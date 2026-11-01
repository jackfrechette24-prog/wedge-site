import { NextResponse } from "next/server";
import { handleLeadSubmission } from "@/lib/leads/handler";
import { clientIp, leadDeps } from "@/lib/leads/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: {} }, { status: 400 });
  }
  const result = await handleLeadSubmission(
    body,
    { ip: clientIp(request.headers), userAgent: request.headers.get("user-agent") },
    leadDeps,
  );
  return NextResponse.json(result.body, { status: result.status });
}
