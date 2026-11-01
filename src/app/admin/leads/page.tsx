import type { Metadata } from "next";
import { buttonClass } from "@/components/Button";
import { Logo } from "@/components/Logo";
import type { WebhookStatus } from "@/db/schema";
import { cn } from "@/lib/cn";
import { WEBHOOK_STATUSES } from "@/lib/leads/statuses";
import { disqualifiedCounts, listLeads } from "@/lib/leads/store";
import { revenueLabel } from "@/lib/leads/webhook";

export const metadata: Metadata = { title: "Leads", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | undefined>> };

const FIELD = "min-h-10 rounded-sm border border-line bg-graphite px-3 text-sm text-bone";
const SMALL_BUTTON = "min-h-9 rounded-sm border border-line px-3 text-xs hover:border-lime hover:text-lime";

const STATUS_STYLE: Record<WebhookStatus, string> = {
  sent: "text-mist",
  pending: "text-bone",
  failed: "text-lime",
  dead: "bg-lime text-obsidian px-1.5",
};

async function loadData(status: WebhookStatus | undefined, q: string | undefined) {
  try {
    const [rows, disqualified] = await Promise.all([listLeads({ status, q }), disqualifiedCounts(30)]);
    return { rows, disqualified, error: null };
  } catch (error) {
    console.error("[admin] load failed", error);
    return { rows: [], disqualified: [], error: "Could not reach the database. Check DATABASE_URL." };
  }
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const { status: rawStatus, q, notice } = await searchParams;
  const status = WEBHOOK_STATUSES.find((value) => value === rawStatus);
  const { rows, disqualified, error } = await loadData(status, q);

  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (q) query.set("q", q);
  const queryString = query.toString() ? `?${query}` : "";
  const returnTo = `/admin/leads${queryString}`;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <div className="flex flex-wrap items-center gap-2">
          <form method="post" action="/api/admin/retry">
            <input type="hidden" name="returnTo" value={returnTo} />
            <button className={buttonClass("secondary", "min-h-10 px-4 py-2 text-sm")}>Retry all failed</button>
          </form>
          <a href={`/api/admin/export${queryString}`} className={buttonClass("secondary", "min-h-10 px-4 py-2 text-sm")}>Export CSV</a>
        </div>
      </header>

      <h1 className="mt-8 text-3xl">Leads</h1>
      {notice && <p role="status" className="mt-4 border-l-2 border-lime pl-3 text-sm">{notice}</p>}
      {error && <p role="alert" className="mt-4 border-l-2 border-lime pl-3 text-sm">{error}</p>}

      <section className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-mist">
        <span>Disqualified, last 30 days:</span>
        {disqualified.length === 0 && <span>None</span>}
        {disqualified.map((row) => (
          <span key={row.reason}>{row.reason}: <span className="text-lime">{row.value}</span></span>
        ))}
      </section>

      <form method="get" className="mt-6 flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="q">Search</label>
        <input id="q" name="q" defaultValue={q} placeholder="Name, company, email, phone" className={cn(FIELD, "w-72")} />
        <label className="sr-only" htmlFor="status">Webhook status</label>
        <select id="status" name="status" defaultValue={status ?? ""} className={FIELD}>
          <option value="">All statuses</option>
          {WEBHOOK_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <button className={SMALL_BUTTON}>Apply</button>
      </form>

      <div className="mt-6 overflow-x-auto border border-line">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="font-mono text-[11px] uppercase tracking-[0.1em] text-mist">
            <tr className="border-b border-line">
              {["Received", "Name", "Company", "Email", "Phone", "Revenue", "Source", "Webhook", ""].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} className="border-b border-line align-top last:border-0">
                <td className="whitespace-nowrap px-3 py-3 text-mist">{lead.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                <td className="px-3 py-3">{lead.firstName} {lead.lastName}</td>
                <td className="px-3 py-3">{lead.companyName}</td>
                <td className="px-3 py-3">{lead.email}</td>
                <td className="whitespace-nowrap px-3 py-3">{lead.phone}</td>
                <td className="whitespace-nowrap px-3 py-3">{revenueLabel(lead.annualRevenue)}</td>
                <td className="px-3 py-3 text-mist">{lead.utmSource ?? "direct"}</td>
                <td className="px-3 py-3">
                  <span className={cn("font-mono text-xs", STATUS_STYLE[lead.webhookStatus])}>{lead.webhookStatus}</span>
                  <span className="ml-2 text-xs text-mist">{lead.webhookAttempts}x</span>
                  {lead.webhookLastError && <p className="mt-1 max-w-56 truncate text-xs text-mist" title={lead.webhookLastError}>{lead.webhookLastError}</p>}
                </td>
                <td className="px-3 py-3">
                  {lead.webhookStatus !== "sent" && (
                    <form method="post" action="/api/admin/retry">
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <button className={cn(SMALL_BUTTON, "whitespace-nowrap")}>Retry webhook</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-10 text-center text-mist">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mist">Showing the newest {rows.length}. Export CSV for everything.</p>
    </div>
  );
}
