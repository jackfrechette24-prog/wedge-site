import { createHash } from "node:crypto";
import { after } from "next/server";
import { and, count, desc, eq, gte, ilike, inArray, lt, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db/client";
import { disqualifiedEvents, leads, rateLimits, type WebhookStatus } from "@/db/schema";
import { sendAlert, type AlertEvent } from "./alerts";
import type { InsertableLead, LeadDeps } from "./handler";
import { MAX_ATTEMPTS, PENDING_GRACE_MS, type RetryDeps } from "./retry";
import { sendWebhook } from "./webhook";

const HOUR_MS = 60 * 60 * 1000;

export function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}${process.env.IP_HASH_SALT ?? ""}`).digest("hex");
}

export function clientIp(headers: Headers) {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function hitRateLimit(ipHash: string, scope: string, limit: number) {
  const db = getDb();
  const since = new Date(Date.now() - HOUR_MS);
  const [row] = await db
    .select({ value: count() })
    .from(rateLimits)
    .where(and(eq(rateLimits.scope, scope), eq(rateLimits.ipHash, ipHash), gte(rateLimits.createdAt, since)));
  if ((row?.value ?? 0) >= limit) return true;
  await db.insert(rateLimits).values({ scope, ipHash });
  return false;
}

function notifyAfterResponse(event: AlertEvent) {
  // Runs once the response is sent, and the platform keeps the function alive until it finishes.
  after(() => sendAlert(event));
}

export const leadDeps: LeadDeps = {
  async findBySubmissionId(clientSubmissionId) {
    const [row] = await getDb()
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.clientSubmissionId, clientSubmissionId))
      .limit(1);
    return row ?? null;
  },
  hitRateLimit,
  async insertLead(lead: InsertableLead) {
    const db = getDb();
    const inserted = await db
      .insert(leads)
      .values(lead)
      .onConflictDoNothing({ target: leads.clientSubmissionId })
      .returning({ id: leads.id });
    if (inserted[0]) return { id: inserted[0].id, created: true };
    // Lost a race with an identical submission. Hand back the original.
    const [existing] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.clientSubmissionId, lead.clientSubmissionId))
      .limit(1);
    if (!existing) throw new Error("Conflict on insert but no existing lead found");
    return { id: existing.id, created: false };
  },
  async markSent(id, at) {
    await getDb()
      .update(leads)
      .set({
        webhookStatus: "sent",
        webhookSentAt: at,
        webhookLastAttemptAt: at,
        webhookAttempts: sql`${leads.webhookAttempts} + 1`,
        webhookLastError: null,
      })
      .where(eq(leads.id, id));
  },
  async markFailed(id, error, at) {
    await getDb()
      .update(leads)
      .set({
        webhookStatus: "failed",
        webhookLastAttemptAt: at,
        webhookAttempts: sql`${leads.webhookAttempts} + 1`,
        webhookLastError: error,
      })
      .where(eq(leads.id, id));
  },
  sendWebhook,
  notify: notifyAfterResponse,
  hashIp,
  now: () => new Date(),
};

export const retryDeps: RetryDeps = {
  async claimAttempt(id, expectedAttempts, at) {
    const claimed = await getDb()
      .update(leads)
      .set({ webhookAttempts: sql`${leads.webhookAttempts} + 1`, webhookLastAttemptAt: at })
      .where(and(eq(leads.id, id), eq(leads.webhookAttempts, expectedAttempts)))
      .returning({ id: leads.id });
    return claimed.length > 0;
  },
  async markRetrySent(id, at) {
    await getDb()
      .update(leads)
      .set({ webhookStatus: "sent", webhookSentAt: at, webhookLastError: null })
      .where(eq(leads.id, id));
  },
  async markRetryFailed(id, status, error) {
    await getDb().update(leads).set({ webhookStatus: status, webhookLastError: error }).where(eq(leads.id, id));
  },
  sendWebhook,
  notify: notifyAfterResponse,
  now: () => new Date(),
};

export async function findRetryCandidates(now: Date) {
  return getDb()
    .select()
    .from(leads)
    .where(
      and(
        inArray(leads.webhookStatus, ["pending", "failed"]),
        lt(leads.webhookAttempts, MAX_ATTEMPTS),
        lt(leads.createdAt, new Date(now.getTime() - PENDING_GRACE_MS)),
      ),
    )
    .orderBy(sql`${leads.webhookLastAttemptAt} asc nulls first`)
    .limit(200);
}

/** Rows that ran out of attempts without reaching dead, e.g. if a function crashed mid-attempt. */
export async function sweepExhausted() {
  const swept = await getDb()
    .update(leads)
    .set({ webhookStatus: "dead" })
    .where(and(inArray(leads.webhookStatus, ["pending", "failed"]), gte(leads.webhookAttempts, MAX_ATTEMPTS)))
    .returning();
  for (const lead of swept) {
    await sendAlert({ kind: "webhook_dead", lead, error: lead.webhookLastError ?? undefined });
  }
  return swept.length;
}

export async function pruneRateLimits() {
  await getDb().delete(rateLimits).where(lt(rateLimits.createdAt, new Date(Date.now() - 24 * HOUR_MS)));
}

export async function recordDisqualified(event: typeof disqualifiedEvents.$inferInsert) {
  await getDb().insert(disqualifiedEvents).values(event);
}

export { hitRateLimit };

// Admin queries.

export type LeadFilter = { status?: WebhookStatus; q?: string };

function filterClause({ status, q }: LeadFilter): SQL | undefined {
  const conditions: (SQL | undefined)[] = [];
  if (status) conditions.push(eq(leads.webhookStatus, status));
  if (q) {
    const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(leads.firstName, pattern),
        ilike(leads.lastName, pattern),
        ilike(leads.companyName, pattern),
        ilike(leads.email, pattern),
        ilike(leads.phone, pattern),
      ),
    );
  }
  return and(...conditions);
}

export async function listLeads(filter: LeadFilter, limit = 200) {
  return getDb().select().from(leads).where(filterClause(filter)).orderBy(desc(leads.createdAt)).limit(limit);
}

export async function getLead(id: string) {
  const [row] = await getDb().select().from(leads).where(eq(leads.id, id)).limit(1);
  return row ?? null;
}

export async function listUndelivered(limit: number) {
  return getDb()
    .select()
    .from(leads)
    .where(inArray(leads.webhookStatus, ["failed", "dead"]))
    .orderBy(desc(leads.createdAt))
    .limit(limit);
}

export async function disqualifiedCounts(days: number) {
  return getDb()
    .select({ reason: disqualifiedEvents.reason, value: count() })
    .from(disqualifiedEvents)
    .where(gte(disqualifiedEvents.createdAt, new Date(Date.now() - days * 24 * HOUR_MS)))
    .groupBy(disqualifiedEvents.reason);
}

