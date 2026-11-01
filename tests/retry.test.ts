import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { attemptDelivery, backoffMs, deliverAll, isDueForRetry, MAX_ATTEMPTS, selectDueLeads, type RetryDeps, type RetryRow } from "@/lib/leads/retry";

const MINUTE = 60 * 1000;
const now = new Date("2026-11-01T12:00:00Z");
const ago = (ms: number) => new Date(now.getTime() - ms);

function lead(overrides: Partial<RetryRow> = {}) {
  return {
    id: "lead-1", firstName: "Jane", lastName: "Doe", companyName: "Sunrise", email: "jane@example.com", phone: "+14155552671",
    website: null, ownsCompany: true, annualRevenue: "500k_1m", willingToInvest3k: null, qualified: true,
    qualificationPath: "revenue_300k_plus", consent: true, consentText: "text", createdAt: ago(60 * MINUTE),
    pageUrl: null, referrer: null, utmSource: null, utmMedium: null, utmCampaign: null, utmContent: null, utmTerm: null,
    fbclid: null, gclid: null, webhookStatus: "failed", webhookAttempts: 1, webhookLastAttemptAt: ago(60 * MINUTE),
    ...overrides,
  } satisfies RetryRow;
}

describe("backoffMs", () => {
  it("doubles from 5 minutes", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map((n) => backoffMs(n) / MINUTE)).toEqual([5, 10, 20, 40, 80, 160, 320]);
  });
  it("is capped at 6 hours", () => expect(backoffMs(20)).toBe(360 * MINUTE));
  it("has no wait before a first attempt", () => expect(backoffMs(0)).toBe(0));
});

describe("isDueForRetry", () => {
  it("skips a pending lead younger than 2 minutes", () => {
    expect(isDueForRetry(lead({ webhookStatus: "pending", webhookAttempts: 0, webhookLastAttemptAt: null, createdAt: ago(MINUTE) }), now)).toBe(false);
  });
  it("picks up a pending lead older than 2 minutes", () => {
    expect(isDueForRetry(lead({ webhookStatus: "pending", webhookAttempts: 0, webhookLastAttemptAt: null, createdAt: ago(3 * MINUTE) }), now)).toBe(true);
  });
  it("waits out the backoff on a failed lead", () => {
    expect(isDueForRetry(lead({ webhookAttempts: 2, webhookLastAttemptAt: ago(9 * MINUTE) }), now)).toBe(false);
    expect(isDueForRetry(lead({ webhookAttempts: 2, webhookLastAttemptAt: ago(10 * MINUTE) }), now)).toBe(true);
  });
  it("stops at the attempt limit", () => {
    expect(isDueForRetry(lead({ webhookAttempts: MAX_ATTEMPTS }), now)).toBe(false);
    expect(isDueForRetry(lead({ webhookAttempts: MAX_ATTEMPTS - 1, webhookLastAttemptAt: ago(24 * 60 * MINUTE) }), now)).toBe(true);
  });
  it("ignores sent and dead leads", () => {
    expect(isDueForRetry(lead({ webhookStatus: "sent" }), now)).toBe(false);
    expect(isDueForRetry(lead({ webhookStatus: "dead" }), now)).toBe(false);
  });
});

describe("selectDueLeads", () => {
  it("filters to due leads and respects the limit", () => {
    const leads = [
      lead({ id: "a" }),
      lead({ id: "b", webhookStatus: "sent" }),
      lead({ id: "c" }),
      lead({ id: "d", webhookAttempts: 7, webhookLastAttemptAt: ago(MINUTE) }),
    ];
    expect(selectDueLeads(leads, now).map((row) => row.id)).toEqual(["a", "c"]);
    expect(selectDueLeads(leads, now, 1).map((row) => row.id)).toEqual(["a"]);
  });
});

describe("attemptDelivery", () => {
  function deps(overrides: Partial<RetryDeps> = {}) {
    return {
      claimAttempt: vi.fn(async () => true),
      markRetrySent: vi.fn(async () => {}),
      markRetryFailed: vi.fn(async () => {}),
      sendWebhook: vi.fn(async () => {}),
      notify: vi.fn(),
      now: () => now,
      ...overrides,
    } satisfies RetryDeps;
  }
  const failing = () => vi.fn(async () => { throw new Error("crm down"); });

  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it("marks a successful retry as sent", async () => {
    const d = deps();
    expect(await attemptDelivery(lead(), d)).toBe("sent");
    expect(d.markRetrySent).toHaveBeenCalledOnce();
    expect(d.notify).not.toHaveBeenCalled();
  });

  it("does nothing when another run already claimed the attempt", async () => {
    const d = deps({ claimAttempt: vi.fn(async () => false) });
    expect(await attemptDelivery(lead(), d)).toBe("skipped");
    expect(d.sendWebhook).not.toHaveBeenCalled();
  });

  it("keeps retrying without another alert on an ordinary failure", async () => {
    const d = deps({ sendWebhook: failing() });
    expect(await attemptDelivery(lead({ webhookAttempts: 3 }), d)).toBe("failed");
    expect(d.markRetryFailed).toHaveBeenCalledWith("lead-1", "failed", "crm down");
    expect(d.notify).not.toHaveBeenCalled();
  });

  it("alerts the first time a stuck pending lead fails", async () => {
    const d = deps({ sendWebhook: failing() });
    await attemptDelivery(lead({ webhookStatus: "pending", webhookAttempts: 0 }), d);
    expect(d.notify).toHaveBeenCalledWith(expect.objectContaining({ kind: "webhook_failed" }));
  });

  it("goes dead and alerts on the 8th failure", async () => {
    const d = deps({ sendWebhook: failing() });
    expect(await attemptDelivery(lead({ webhookAttempts: MAX_ATTEMPTS - 1 }), d)).toBe("dead");
    expect(d.markRetryFailed).toHaveBeenCalledWith("lead-1", "dead", "crm down");
    expect(d.notify).toHaveBeenCalledWith(expect.objectContaining({ kind: "webhook_dead" }));
  });

  it("a manual retry of a dead lead stays dead without a repeat alert", async () => {
    const d = deps({ sendWebhook: failing() });
    expect(await attemptDelivery(lead({ webhookStatus: "dead", webhookAttempts: MAX_ATTEMPTS }), d)).toBe("dead");
    expect(d.notify).not.toHaveBeenCalled();
  });

  it("a manual retry of a dead lead can succeed", async () => {
    const d = deps();
    expect(await attemptDelivery(lead({ webhookStatus: "dead", webhookAttempts: MAX_ATTEMPTS }), d)).toBe("sent");
  });

  it("deliverAll tallies outcomes and survives a crash", async () => {
    const d = deps({
      sendWebhook: vi.fn(async (row: { id: string }) => {
        if (row.id === "bad") throw new Error("nope");
      }),
      claimAttempt: vi.fn(async (id: string) => {
        if (id === "crash") throw new Error("db down");
        return true;
      }),
    });
    const counts = await deliverAll([lead({ id: "ok" }), lead({ id: "bad" }), lead({ id: "crash" })], d);
    expect(counts).toEqual({ sent: 1, failed: 2, dead: 0, skipped: 0 });
  });
});
