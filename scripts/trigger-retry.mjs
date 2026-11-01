// Triggers the webhook retry job. Runs as a separate Railway cron service every 10 minutes.
// Exits 0 on success and 1 on failure.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const secret = process.env.CRON_SECRET;

if (!siteUrl || !secret) {
  console.error("[cron:retry] NEXT_PUBLIC_SITE_URL and CRON_SECRET must both be set.");
  process.exit(1);
}

try {
  const response = await fetch(`${siteUrl}/api/cron/retry-webhooks`, {
    headers: { Authorization: `Bearer ${secret}` },
    signal: AbortSignal.timeout(120000),
  });
  const body = await response.text();
  console.log(`[cron:retry] ${response.status} ${body}`);
  process.exitCode = response.ok ? 0 : 1;
} catch (error) {
  console.error("[cron:retry] request failed:", error);
  process.exitCode = 1;
}
