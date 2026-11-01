import { buildWebhookPayload, revenueLabel, type LeadRecord } from "./webhook";

export type AlertKind = "webhook_failed" | "webhook_dead" | "db_failed" | "both_failed";

export type AlertEvent = { kind: AlertKind; lead: LeadRecord; error?: string };

const TITLES: Record<AlertKind, string> = {
  webhook_failed: "Lead did not reach the CRM. Retrying automatically.",
  webhook_dead: "Lead gave up after all retries. Call them and add them by hand.",
  db_failed: "Database write failed. The lead reached the CRM but is not in the backup.",
  both_failed: "Database AND CRM failed. This message is the only copy of the lead. Call them now.",
};

export function formatAlert({ kind, lead, error }: AlertEvent) {
  const lines = [
    TITLES[kind],
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Company: ${lead.companyName}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Revenue: ${revenueLabel(lead.annualRevenue)}`,
    `Lead ID: ${lead.id}`,
  ];
  if (error) lines.push(`Error: ${error}`);
  if (kind === "both_failed") lines.push(`Full lead: ${JSON.stringify(buildWebhookPayload(lead))}`);
  return { subject: `[Wedge lead alert] ${TITLES[kind]}`, text: lines.join("\n") };
}

// Form input ends up in this message, so keep Slack from reading it as mentions or links.
function escapeSlack(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Alert responded with ${response.status}`);
}

/** Never throws. Every failure here is logged and swallowed. */
export async function sendAlert(event: AlertEvent) {
  try {
    const { subject, text } = formatAlert(event);
    const { ALERT_SLACK_WEBHOOK_URL, RESEND_API_KEY, ALERT_EMAIL_TO, ALERT_EMAIL_FROM } = process.env;
    const sends: Promise<unknown>[] = [];
    if (ALERT_SLACK_WEBHOOK_URL) sends.push(postJson(ALERT_SLACK_WEBHOOK_URL, { text: escapeSlack(text) }));
    if (RESEND_API_KEY && ALERT_EMAIL_TO) {
      sends.push(
        postJson(
          "https://api.resend.com/emails",
          { from: ALERT_EMAIL_FROM || "onboarding@resend.dev", to: ALERT_EMAIL_TO, subject, text },
          { authorization: `Bearer ${RESEND_API_KEY}` },
        ),
      );
    }
    const results = await Promise.allSettled(sends);
    for (const result of results) {
      if (result.status === "rejected") console.error("[alerts] send failed", result.reason);
    }
  } catch (error) {
    console.error("[alerts] failed", error);
  }
}
