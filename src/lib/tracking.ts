// Browser only. Every call does nothing if the matching script isn't loaded.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView() {
  window.fbq?.("track", "PageView");
}

/** The event ID equals the lead ID, so server-side events can be deduplicated against it later. */
export function trackQualifiedLead(leadId: string) {
  window.fbq?.("track", "Lead", {}, { eventID: leadId });
  window.gtag?.("event", "generate_lead");
}
