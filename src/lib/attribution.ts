// Browser only. First-touch attribution kept in a first-party cookie for 30 days.
const COOKIE = "wedge_attr";
const MAX_AGE = 30 * 24 * 60 * 60;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "page_url" | "referrer", string>>;

function readCookie(): Attribution | null {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE}=`));
  if (!entry) return null;
  try {
    return JSON.parse(decodeURIComponent(entry.slice(COOKIE.length + 1)));
  } catch {
    return null;
  }
}

function hasCampaignData(attribution: Attribution) {
  return PARAMS.some((param) => attribution[param]);
}

/** Runs on every page view. Keeps the first visit, unless that visit had no ad data and this one does. */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    page_url: window.location.href.slice(0, 1000),
    referrer: document.referrer.slice(0, 500) || undefined,
  };
  for (const param of PARAMS) {
    const value = params.get(param);
    if (value) current[param] = value.slice(0, 500);
  }
  const existing = readCookie();
  if (existing && (hasCampaignData(existing) || !hasCampaignData(current))) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(current))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

export function readAttribution(): Attribution {
  return readCookie() ?? { page_url: window.location.href.slice(0, 1000), referrer: document.referrer.slice(0, 500) || undefined };
}
