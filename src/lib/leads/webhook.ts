import { REVENUE_OPTIONS } from "@/content/flow";
import type { LeadRow } from "@/db/schema";

const TIMEOUT_MS = 8000;

export type LeadRecord = Pick<
  LeadRow,
  | "id" | "firstName" | "lastName" | "companyName" | "email" | "phone" | "website" | "ownsCompany" | "annualRevenue"
  | "willingToInvest3k" | "qualified" | "qualificationPath" | "consent" | "consentText" | "createdAt" | "pageUrl"
  | "referrer" | "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "fbclid" | "gclid"
>;

export function revenueLabel(value: string) {
  return REVENUE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

/** Flat snake_case JSON for easy field mapping in the CRM. */
export function buildWebhookPayload(lead: LeadRecord) {
  return {
    lead_id: lead.id,
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
    company_name: lead.companyName,
    website: lead.website,
    owns_company: lead.ownsCompany,
    annual_revenue: revenueLabel(lead.annualRevenue),
    willing_to_invest_3k: lead.willingToInvest3k,
    qualified: lead.qualified,
    qualification_path: lead.qualificationPath,
    consent: lead.consent,
    consent_text: lead.consentText,
    submitted_at: lead.createdAt.toISOString(),
    page_url: lead.pageUrl,
    referrer: lead.referrer,
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    utm_content: lead.utmContent,
    utm_term: lead.utmTerm,
    fbclid: lead.fbclid,
    gclid: lead.gclid,
  };
}

/** Throws on a missing URL, a non-2xx response, or a timeout. */
export async function sendWebhook(lead: LeadRecord) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) throw new Error("CRM_WEBHOOK_URL is not set");
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(buildWebhookPayload(lead)),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
}

export function errorMessage(error: unknown) {
  return (error instanceof Error ? error.message : String(error)).slice(0, 500);
}
