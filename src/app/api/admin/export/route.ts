import { WEBHOOK_STATUSES } from "@/lib/leads/statuses";
import { leadsToCsv } from "@/lib/csv";
import { listLeads } from "@/lib/leads/store";
import type { WebhookStatus } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protected by the Basic Auth check in middleware.ts.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const status = params.get("status") as WebhookStatus | null;
  const rows = await listLeads(
    { status: status && WEBHOOK_STATUSES.includes(status) ? status : undefined, q: params.get("q") || undefined },
    20000,
  );
  return new Response(leadsToCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="wedge-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
