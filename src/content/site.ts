// Site-wide settings and copy. Edit values here, components pick them up.
import type { Video } from "./types";

export const SITE_NAME = "Wedge Acquisition";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wedgeacquisition.com").replace(/\/$/, "");

// TODO_EMAIL: confirm this inbox exists. It is the fallback contact if the form is ever down.
export const CONTACT_EMAIL = "hello@wedgeacquisition.com";

// Bump this when you make meaningful content changes. It feeds sitemap.xml.
export const CONTENT_UPDATED = "2026-11-01";

// The named system. Alternates: "The Booked Install System", "The Project Pipeline",
// "The Wedge Demand System", "Open Window System".
export const SYSTEM_NAME = "The Full Calendar System";

export const CATEGORY_LINE = "The marketing agency for window treatment and exterior screen companies.";
export const CORE_PROMISE =
  "We help window treatment and retractable screen companies add an extra $500K to $1M a year in new revenue.";
export const TAGLINE = "More booked consults. More installs.";

// Swap the hero headline by changing ACTIVE_HERO to "A", "B", or "C".
export const HERO_VARIANTS = {
  A: "Add an extra $500K to $1M a year to your window treatment business.",
  B: "More booked consults. More installs. An extra $500K to $1M a year.",
  C: "The marketing agency built for window treatment and exterior screen companies.",
} as const;
export const ACTIVE_HERO: keyof typeof HERO_VARIANTS = "A";

export const HERO_EYEBROW = "FOR WINDOW TREATMENT + EXTERIOR SCREEN COMPANIES";
export const HERO_SUBHEADLINE =
  "We run Facebook and Instagram ads for blinds, shades, shutters, and retractable screen companies, then our team calls every lead and books the appointments onto your calendar. You show up and close.";

export const CTAS = {
  primary: { label: "See If You Qualify", href: "/apply" },
  secondary: { label: "See the results", href: "/case-studies" },
} as const;

export const STATS = [
  { value: "$1M+", label: "revenue generated for one screen company in 10 months" },
  { value: "$158K", label: "in 60 days for a Nashville shade + screen company" },
  { value: "24 hours", label: "from launch to first leads" },
] as const;

// Word for word. Do not strengthen these.
export const RISK_REVERSAL = [
  "Month to month. No long-term contracts.",
  "If we don't produce in month one, you can walk.",
  "Our bonuses are tied to the jobs you close from our leads. We win when you win.",
] as const;

export const LOCATION_LINE = "Ontario-based. Serving window treatment and screen companies across the U.S.";
export const LOCATION_SHORT = "Ontario-based, serving the U.S.";

export const NAV = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Window Treatments", href: "/window-treatment-marketing" },
  { label: "Exterior Screens", href: "/retractable-screen-marketing" },
  { label: "Results", href: "/case-studies" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const FOOTER = {
  description:
    "The marketing agency for window treatment and exterior screen companies. Facebook and Instagram ads, every lead called, appointments booked onto your calendar.",
  columns: { pages: "Company", niches: "Who we serve", cases: "Results", legal: "Legal" },
  disclaimer:
    "Results shown are from specific clients and are not typical of every business. Your results depend on your market, your offer, your capacity, and how you run your appointments. Past results do not promise future results.",
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

// TODO_SOCIAL: add profile URLs. Empty entries are ignored in the footer and structured data.
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "" },
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "YouTube", href: "" },
];

// Logo bar. Put logo files in /public/clients. src null shows the name in text.
// name null shows an empty "[CLIENT LOGO]" slot. Remove empty slots before launch.
export const CLIENT_LOGOS: { name: string | null; src: string | null }[] = [
  { name: "Lightstyle Solutions", src: null },
  { name: "Motorized Screens of Orlando", src: null },
  { name: null, src: null },
  { name: null, src: null },
];

// Query params the booking calendar uses for prefill.
// Verify prefill works with your calendar vendor and change these keys if it uses different ones.
export const BOOKING_PREFILL_PARAMS = {
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
  phone: "phone",
} as const;

// TODO_VIDEO: main video on the home page. null shows the "Video coming soon" frame.
export const HOME_VSL: Video = null;

// TODO_VIDEO: optional video on /confirmed. null hides the slot.
export const PRECALL_VIDEO: Video = null;
