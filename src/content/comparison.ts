// The them vs. us comparison.
import type { Segments } from "./types";

export const comparison = {
  label: "THE DIFFERENCE",
  title: [
    { text: "MOST AGENCIES" },
    { text: "don't know your industry.", accent: true },
    { text: "WE ONLY KNOW YOURS." },
  ] satisfies Segments,
  them: { tag: "THEM", standard: "INDUSTRY STANDARD", name: "OTHER AGENCIES" },
  us: { tag: "RECOMMENDED", standard: "WEDGE STANDARD", name: "WEDGE ACQUISITION" },
  rows: [
    { label: "CONTRACT", them: "12 month lock-in", us: "Month to month" },
    { label: "INDUSTRY FOCUS", them: "Any business with a credit card", us: "Window treatment and screen companies only" },
    { label: "LEAD FOLLOW-UP", them: "Leads dumped in your inbox", us: "Every lead called and booked for you" },
    { label: "REPORTING", them: "Clicks and impressions", us: "Booked appointments and closed revenue" },
    { label: "CREATIVE", them: "Generic stock templates", us: "Built for your products and market" },
    { label: "SPEED", them: "Weeks to launch", us: "Live in about 3 days" },
  ],
};
