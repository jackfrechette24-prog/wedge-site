import type { LeadRow, WebhookStatus } from "@/db/schema";
import type { AlertEvent } from "./alerts";
import { errorMessage, type LeadRecord } from "./webhook";

export const MAX_ATTEMPTS = 8;
export const PENDING_GRACE_MS = 2 * 60 * 1000;
const BACKOFF_BASE_MS = 5 * 60 * 1000;
const BACKOFF_MAX_MS = 6 * 60 * 60 * 1000;
const CRON_BATCH_SIZE = 20;
const CONCURRENCY = 5;

/** Wait after the Nth failed attempt: 5m, 10m, 20m, 40m, 80m, 160m, 320m. */
export function backoffMs(attempts: number) {
  if (attempts <= 0) return 0;
  return Math.min(BACKOFF_BASE_MS * 2 ** (attempts - 1), BACKOFF_MAX_MS);
}

type RetryFields = Pick<LeadRow, "webhookStatus" | "webhookAttempts" | "webhookLastAttemptAt" | "createdAt">;

export function isDueForRetry(lead: RetryFields, now: Date) {
  if (lead.webhookStatus !== "pending" && lead.webhookStatus !== "failed") return false;
  if (lead.webhookAttempts >= MAX_ATTEMPTS) return false;
  if (lead.webhookStatus === "pending" && now.getTime() - lead.createdAt.getTime() < PENDING_GRACE_MS) return false;
  const last = lead.webhookLastAttemptAt?.getTime() ?? 0;
  return now.getTime() - last >= backoffMs(lead.webhookAttempts);
}

export function selectDueLeads<T extends RetryFields>(leads: T[], now: Date, limit = CRON_BATCH_SIZE) {
  return leads.filter((lead) => isDueForRetry(lead, now)).slice(0, limit);
}

export type RetryRow = LeadRecord & RetryFields;

export type RetryDeps = {
  /** Reserves the attempt. False means another run already took it. */
  claimAttempt(id: string, expectedAttempts: number, at: Date): Promise<boolean>;
  markRetrySent(id: string, at: Date): Promise<void>;
  markRetryFailed(id: string, status: WebhookStatus, error: string): Promise<void>;
  sendWebhook(lead: LeadRecord): Promise<void>;
  notify(event: AlertEvent): void;
  now(): Date;
};

export type AttemptOutcome = "sent" | "failed" | "dead" | "skipped";

export async function attemptDelivery(lead: RetryRow, deps: RetryDeps): Promise<AttemptOutcome> {
  if (!(await deps.claimAttempt(lead.id, lead.webhookAttempts, deps.now()))) return "skipped";

  try {
    await deps.sendWebhook(lead);
  } catch (error) {
    const message = errorMessage(error);
    const wasDead = lead.webhookStatus === "dead";
    const isDead = wasDead || lead.webhookAttempts + 1 >= MAX_ATTEMPTS;
    await deps.markRetryFailed(lead.id, isDead ? "dead" : "failed", message);
    if (isDead && !wasDead) deps.notify({ kind: "webhook_dead", lead, error: message });
    // A pending row means the first attempt never reported back, so nobody has been told yet.
    else if (lead.webhookStatus === "pending") deps.notify({ kind: "webhook_failed", lead, error: message });
    return isDead ? "dead" : "failed";
  }

  await deps.markRetrySent(lead.id, deps.now());
  return "sent";
}

export async function deliverAll(leads: RetryRow[], deps: RetryDeps) {
  const counts: Record<AttemptOutcome, number> = { sent: 0, failed: 0, dead: 0, skipped: 0 };
  for (let start = 0; start < leads.length; start += CONCURRENCY) {
    const batch = leads.slice(start, start + CONCURRENCY);
    const outcomes = await Promise.allSettled(batch.map((lead) => attemptDelivery(lead, deps)));
    for (const outcome of outcomes) {
      if (outcome.status === "fulfilled") counts[outcome.value] += 1;
      else {
        counts.failed += 1;
        console.error("[retry] attempt crashed", outcome.reason);
      }
    }
  }
  return counts;
}
