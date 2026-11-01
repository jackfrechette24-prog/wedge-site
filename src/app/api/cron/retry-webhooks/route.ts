import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deliverAll, selectDueLeads } from "@/lib/leads/retry";
import { findRetryCandidates, pruneRateLimits, retryDeps, sweepExhausted } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok: false }, { status: 401 });
  // Without a webhook URL every attempt would fail and burn through the retry limit.
  if (!process.env.CRM_WEBHOOK_URL) return NextResponse.json({ ok: true, skipped: "no webhook configured" });

  try {
    const now = new Date();
    const swept = await sweepExhausted();
    const due = selectDueLeads(await findRetryCandidates(now), now);
    const counts = await deliverAll(due, retryDeps);
    await pruneRateLimits();
    return NextResponse.json({ ok: true, swept, attempted: due.length, ...counts });
  } catch (error) {
    console.error("[cron] retry failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
