import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleLeadSubmission, LEAD_RATE_LIMIT, type LeadDeps } from "@/lib/leads/handler";
import { HONEYPOT_FIELD } from "@/lib/leads/schema";
import { buildWebhookPayload, sendWebhook, type LeadRecord } from "@/lib/leads/webhook";

const validBody = {
  clientSubmissionId: "8b3f0f3e-7c1a-4a55-9b3b-2d7f4f6a1c11",
  firstName: "Jane",
  lastName: "Doe",
  companyName: "Sunrise Shades",
  email: "JANE@example.com",
  phone: "415-555-2671",
  website: "",
  consent: true,
  ownsCompany: true,
  annualRevenue: "500k_1m",
  willingToInvest3k: null,
  attribution: { utm_source: "facebook", page_url: "https://wedgeacquisition.com/?utm_source=facebook" },
  elapsedMs: 15000,
};

const ctx = { ip: "203.0.113.9", userAgent: "vitest" };

function makeDeps(overrides: Partial<LeadDeps> = {}) {
  return {
    findBySubmissionId: vi.fn(async () => null),
    hitRateLimit: vi.fn(async () => false),
    insertLead: vi.fn(async (lead: { id: string }) => ({ id: lead.id, created: true })),
    markSent: vi.fn(async () => {}),
    markFailed: vi.fn(async () => {}),
    sendWebhook: vi.fn(async () => {}),
    notify: vi.fn(),
    hashIp: vi.fn(() => "hashed-ip"),
    now: vi.fn(() => new Date("2026-11-01T12:00:00Z")),
    ...overrides,
  } satisfies LeadDeps;
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("handleLeadSubmission", () => {
  it("DB ok + webhook ok: stores first, sends, marks sent, no alert", async () => {
    const order: string[] = [];
    const deps = makeDeps({
      insertLead: vi.fn(async (lead: { id: string }) => {
        order.push("insert");
        return { id: lead.id, created: true };
      }),
      sendWebhook: vi.fn(async () => {
        order.push("webhook");
      }),
    });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(200);
    expect(order).toEqual(["insert", "webhook"]);
    expect(deps.markSent).toHaveBeenCalledOnce();
    expect(deps.markFailed).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
    const stored = vi.mocked(deps.insertLead).mock.calls[0]![0] as unknown as LeadRecord & { webhookStatus: string; ipHash: string };
    expect(stored.email).toBe("jane@example.com");
    expect(stored.phone).toBe("+14155552671");
    expect(stored.webhookStatus).toBe("pending");
    expect(stored.ipHash).toBe("hashed-ip");
    expect(JSON.stringify(stored)).not.toContain(ctx.ip);
  });

  it("DB ok + webhook fail: still succeeds, marks failed, alerts", async () => {
    const deps = makeDeps({ sendWebhook: vi.fn(async () => { throw new Error("boom"); }) });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(200);
    expect(deps.markFailed).toHaveBeenCalledWith(expect.any(String), "boom", expect.any(Date));
    expect(deps.markSent).not.toHaveBeenCalled();
    expect(deps.notify).toHaveBeenCalledWith(expect.objectContaining({ kind: "webhook_failed" }));
  });

  it("DB fail + webhook ok: still succeeds, alerts, returns a lead ID", async () => {
    const deps = makeDeps({ insertLead: vi.fn(async () => { throw new Error("db down"); }) });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ ok: true, leadId: expect.any(String) });
    expect(deps.sendWebhook).toHaveBeenCalledOnce();
    expect(deps.markSent).not.toHaveBeenCalled();
    expect(deps.notify).toHaveBeenCalledWith(expect.objectContaining({ kind: "db_failed" }));
  });

  it("both fail: returns 500 and alerts with the full lead", async () => {
    const deps = makeDeps({
      insertLead: vi.fn(async () => { throw new Error("db down"); }),
      sendWebhook: vi.fn(async () => { throw new Error("crm down"); }),
    });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(500);
    expect(deps.notify).toHaveBeenCalledOnce();
    expect(deps.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "both_failed",
        lead: expect.objectContaining({ phone: "+14155552671", email: "jane@example.com", companyName: "Sunrise Shades" }),
      }),
    );
  });

  it("database down on the pre-checks too: the lead still goes to the webhook", async () => {
    const down = vi.fn(async () => { throw new Error("db down"); });
    const deps = makeDeps({ findBySubmissionId: down, hitRateLimit: down, insertLead: down });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(200);
    expect(deps.sendWebhook).toHaveBeenCalledOnce();
  });

  it("duplicate submission: returns the original ID with no new row or webhook", async () => {
    const deps = makeDeps({ findBySubmissionId: vi.fn(async () => ({ id: "original-id" })) });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.body).toEqual({ ok: true, leadId: "original-id" });
    expect(deps.insertLead).not.toHaveBeenCalled();
    expect(deps.sendWebhook).not.toHaveBeenCalled();
    expect(deps.hitRateLimit).not.toHaveBeenCalled();
  });

  it("duplicate that loses the insert race: returns the original ID with no webhook", async () => {
    const deps = makeDeps({ insertLead: vi.fn(async () => ({ id: "original-id", created: false })) });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.body).toEqual({ ok: true, leadId: "original-id" });
    expect(deps.sendWebhook).not.toHaveBeenCalled();
  });

  it("invalid data: returns 400 with field errors and stores nothing", async () => {
    const deps = makeDeps();
    const result = await handleLeadSubmission({ ...validBody, phone: "123" }, ctx, deps);
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ errors: { phone: expect.any(Array) } });
    expect(deps.insertLead).not.toHaveBeenCalled();
  });

  it.each([
    ["honeypot", { ...validBody, [HONEYPOT_FIELD]: "spam" }],
    ["under 3 seconds", { ...validBody, elapsedMs: 900 }],
    ["missing timer", { ...validBody, elapsedMs: undefined }],
  ])("spam (%s): looks like success, stores nothing", async (_label, body) => {
    const deps = makeDeps();
    const result = await handleLeadSubmission(body, ctx, deps);
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ ok: true, leadId: expect.any(String) });
    expect(deps.insertLead).not.toHaveBeenCalled();
    expect(deps.sendWebhook).not.toHaveBeenCalled();
  });

  it("rate limited: looks like success, stores nothing", async () => {
    const deps = makeDeps({ hitRateLimit: vi.fn(async () => true) });
    const result = await handleLeadSubmission(validBody, ctx, deps);
    expect(result.status).toBe(200);
    expect(deps.hitRateLimit).toHaveBeenCalledWith("hashed-ip", "lead", LEAD_RATE_LIMIT);
    expect(deps.insertLead).not.toHaveBeenCalled();
  });

  it("uses the server's consent wording and verdict, not the client's", async () => {
    const deps = makeDeps();
    await handleLeadSubmission({ ...validBody, consentText: "forged", qualified: false }, ctx, deps);
    const stored = vi.mocked(deps.insertLead).mock.calls[0]![0] as unknown as LeadRecord;
    expect(stored.consentText).toContain("Reply STOP to opt out");
    expect(stored.qualified).toBe(true);
    expect(stored.qualificationPath).toBe("revenue_300k_plus");
  });
});

describe("sendWebhook", () => {
  const lead = {
    id: "lead-1", firstName: "Jane", lastName: "Doe", companyName: "Sunrise", email: "jane@example.com", phone: "+14155552671",
    website: null, ownsCompany: true, annualRevenue: "500k_1m", willingToInvest3k: null, qualified: true,
    qualificationPath: "revenue_300k_plus", consent: true, consentText: "text", createdAt: new Date("2026-11-01T12:00:00Z"),
    pageUrl: null, referrer: null, utmSource: "facebook", utmMedium: null, utmCampaign: null, utmContent: null, utmTerm: null,
    fbclid: null, gclid: null,
  } satisfies LeadRecord;

  beforeEach(() => vi.stubEnv("CRM_WEBHOOK_URL", "https://crm.example/hook"));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("posts the flat snake_case payload", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await sendWebhook(lead);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://crm.example/hook");
    const body = JSON.parse(init.body as string);
    expect(body).toEqual(buildWebhookPayload(lead));
    expect(body).toMatchObject({ lead_id: "lead-1", full_name: "Jane Doe", annual_revenue: "$500K to $1M", utm_source: "facebook" });
    expect(Object.keys(body)).toHaveLength(25);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("throws on a non-2xx response", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 503 })));
    await expect(sendWebhook(lead)).rejects.toThrow("503");
  });

  it("throws when the URL is not configured", async () => {
    vi.stubEnv("CRM_WEBHOOK_URL", "");
    await expect(sendWebhook(lead)).rejects.toThrow("not set");
  });
});
