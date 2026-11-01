import { randomUUID } from "node:crypto";
import { z } from "zod";
import { CONSENT_TEXT } from "@/content/flow";
import type { NewLead } from "@/db/schema";
import { evaluateQualification } from "@/lib/qualification";
import type { AlertEvent } from "./alerts";
import { HONEYPOT_FIELD, MIN_ELAPSED_MS, leadSubmissionSchema, type LeadSubmission } from "./schema";
import { errorMessage, type LeadRecord } from "./webhook";

export const LEAD_RATE_LIMIT = 5;

export type InsertableLead = NewLead & LeadRecord;

export type LeadDeps = {
  findBySubmissionId(clientSubmissionId: string): Promise<{ id: string } | null>;
  /** Counts this request toward the limit. True when the IP is over it. */
  hitRateLimit(ipHash: string, scope: string, limit: number): Promise<boolean>;
  insertLead(lead: InsertableLead): Promise<{ id: string; created: boolean }>;
  markSent(id: string, at: Date): Promise<void>;
  markFailed(id: string, error: string, at: Date): Promise<void>;
  sendWebhook(lead: LeadRecord): Promise<void>;
  /** Must never throw or delay the response. */
  notify(event: AlertEvent): void;
  hashIp(ip: string): string;
  now(): Date;
};

export type RequestContext = { ip: string; userAgent: string | null };

export type LeadResult =
  | { status: 200; body: { ok: true; leadId: string } }
  | { status: 400; body: { ok: false; errors: Record<string, string[] | undefined> } }
  | { status: 500; body: { ok: false; leadId: string } };

function success(leadId: string): LeadResult {
  return { status: 200, body: { ok: true, leadId } };
}

/** Looks exactly like a real success, so a bot learns nothing about why it was dropped. */
function silentReject(reason: string): LeadResult {
  console.warn(`[lead] silently rejected: ${reason}`);
  return success(randomUUID());
}

function isSpam(body: unknown) {
  const fields = (body ?? {}) as Record<string, unknown>;
  if (fields[HONEYPOT_FIELD]) return "honeypot";
  const elapsed = fields.elapsedMs;
  if (typeof elapsed !== "number" || elapsed < MIN_ELAPSED_MS) return "too_fast";
  return null;
}

function buildRecord(input: LeadSubmission, ctx: RequestContext, ipHash: string, now: Date, body: unknown): InsertableLead {
  const { qualified, path } = evaluateQualification({
    ownsCompany: input.ownsCompany,
    annualRevenue: input.annualRevenue,
    willingToInvest3k: input.willingToInvest3k ?? undefined,
  });
  const { attribution } = input;
  return {
    id: randomUUID(),
    clientSubmissionId: input.clientSubmissionId,
    createdAt: now,
    firstName: input.firstName,
    lastName: input.lastName,
    companyName: input.companyName,
    email: input.email,
    phone: input.phone,
    website: input.website,
    ownsCompany: input.ownsCompany,
    annualRevenue: input.annualRevenue,
    willingToInvest3k: input.willingToInvest3k,
    qualified,
    qualificationPath: path,
    consent: input.consent,
    consentText: CONSENT_TEXT,
    pageUrl: attribution.page_url,
    referrer: attribution.referrer,
    userAgent: ctx.userAgent?.slice(0, 500) ?? null,
    ipHash,
    utmSource: attribution.utm_source,
    utmMedium: attribution.utm_medium,
    utmCampaign: attribution.utm_campaign,
    utmContent: attribution.utm_content,
    utmTerm: attribution.utm_term,
    fbclid: attribution.fbclid,
    gclid: attribution.gclid,
    webhookStatus: "pending",
    webhookAttempts: 0,
    rawPayload: body,
  };
}

/**
 * Never lose a lead: write to the database first, then send to the CRM. The browser gets a
 * success as long as at least one of the two worked.
 */
export async function handleLeadSubmission(body: unknown, ctx: RequestContext, deps: LeadDeps): Promise<LeadResult> {
  const spam = isSpam(body);
  if (spam) return silentReject(spam);

  const parsed = leadSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, errors: z.flattenError(parsed.error).fieldErrors } };
  }

  const input = parsed.data;
  const ipHash = deps.hashIp(ctx.ip);

  // A database problem here is not a reason to drop the lead, so carry on and let the insert report it.
  try {
    const existing = await deps.findBySubmissionId(input.clientSubmissionId);
    if (existing) return success(existing.id);
    if (await deps.hitRateLimit(ipHash, "lead", LEAD_RATE_LIMIT)) return silentReject(`rate_limit ${ipHash.slice(0, 12)}`);
  } catch (error) {
    console.error("[lead] pre-checks failed", error);
  }

  const record = buildRecord(input, ctx, ipHash, deps.now(), body);

  let stored = false;
  let dbError: string | undefined;
  try {
    const result = await deps.insertLead(record);
    if (!result.created) return success(result.id);
    stored = true;
  } catch (error) {
    dbError = errorMessage(error);
    console.error("[lead] database write failed", error);
  }

  let delivered = false;
  let webhookError: string | undefined;
  try {
    await deps.sendWebhook(record);
    delivered = true;
  } catch (error) {
    webhookError = errorMessage(error);
    console.error("[lead] webhook failed", error);
  }

  if (stored) {
    // If this update fails the row stays pending and the retry job picks it up.
    try {
      if (delivered) await deps.markSent(record.id, deps.now());
      else await deps.markFailed(record.id, webhookError ?? "unknown", deps.now());
    } catch (error) {
      console.error("[lead] status update failed", error);
    }
    if (!delivered) deps.notify({ kind: "webhook_failed", lead: record, error: webhookError });
    return success(record.id);
  }

  if (delivered) {
    deps.notify({ kind: "db_failed", lead: record, error: dbError });
    return success(record.id);
  }

  deps.notify({ kind: "both_failed", lead: record, error: `db: ${dbError}; webhook: ${webhookError}` });
  return { status: 500, body: { ok: false, leadId: record.id } };
}
