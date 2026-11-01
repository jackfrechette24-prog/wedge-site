import { NextResponse } from "next/server";
import { deliverAll } from "@/lib/leads/retry";
import { getLead, listUndelivered, retryDeps } from "@/lib/leads/store";

export const runtime = "nodejs";

const BULK_LIMIT = 50;

// Protected by the Basic Auth check in middleware.ts. Manual retries ignore the backoff timer.
export async function POST(request: Request) {
  const form = await request.formData();
  const id = form.get("id");
  const returnTo = String(form.get("returnTo") ?? "");
  const target = returnTo.startsWith("/admin/leads") ? returnTo : "/admin/leads";
  let notice: string;

  try {
    const rows = typeof id === "string" ? [await getLead(id)].flatMap((row) => row ?? []) : await listUndelivered(BULK_LIMIT);
    const counts = await deliverAll(rows, retryDeps);
    notice = `Retried ${rows.length}: ${counts.sent} sent, ${counts.failed + counts.dead} failed.`;
  } catch (error) {
    console.error("[admin] retry failed", error);
    notice = "Retry failed. Check the database connection.";
  }

  const url = new URL(target, request.url);
  url.searchParams.set("notice", notice);
  return NextResponse.redirect(url, 303);
}
