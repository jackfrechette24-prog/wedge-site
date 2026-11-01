import { NextResponse } from "next/server";
import { disqualifiedSchema } from "@/lib/leads/schema";
import { clientIp, hashIp, hitRateLimit, recordDisqualified } from "@/lib/leads/store";

export const runtime = "nodejs";

const RATE_LIMIT = 30;

// Analytics only. No personal data, and it always answers OK so the visitor's redirect is never affected.
export async function POST(request: Request) {
  try {
    const parsed = disqualifiedSchema.safeParse(await request.json());
    if (parsed.success && !(await hitRateLimit(hashIp(clientIp(request.headers)), "disqualified", RATE_LIMIT))) {
      const { reason, annualRevenue, attribution } = parsed.data;
      await recordDisqualified({
        reason,
        annualRevenue: annualRevenue ?? null,
        utmSource: attribution.utm_source,
        utmMedium: attribution.utm_medium,
        utmCampaign: attribution.utm_campaign,
        utmContent: attribution.utm_content,
        utmTerm: attribution.utm_term,
        pageUrl: attribution.page_url,
      });
    }
  } catch (error) {
    console.error("[disqualified] failed", error);
  }
  return NextResponse.json({ ok: true });
}
