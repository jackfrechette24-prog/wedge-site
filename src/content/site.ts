// Site-wide settings and copy. Edit values here, components pick them up.
import type { Segments, Video } from "./types";

export const SITE_NAME = "Wedge Acquisition";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wedgeacquisition.com").replace(/\/$/, "");

// TODO_EMAIL: confirm this inbox exists. It is the fallback contact if the form is ever down.
export const CONTACT_EMAIL = "hello@wedgeacquisition.com";

// Bump this when you make meaningful content changes. It feeds sitemap.xml.
export const CONTENT_UPDATED = "2026-11-02";

// The named system. Alternates: "The Booked Install System", "The Project Pipeline",
// "The Wedge Demand System", "Open Window System".
export const SYSTEM_NAME = "The Full Calendar System";

export const CATEGORY_LINE = "The marketing agency for window treatment and exterior screen companies.";
export const CORE_PROMISE =
  "We help window treatment and retractable screen companies add an extra $500K to $1M a year in new revenue.";
export const TAGLINE = "More booked consults. More installs.";

// Swap the hero headline by changing ACTIVE_HERO to "A", "B", or "C".
export const HERO_VARIANTS = {
  A: [{ text: "ADD AN EXTRA" }, { text: "$500K to $1M", accent: true }, { text: "A YEAR IN NEW REVENUE." }],
  B: [{ text: "MORE BOOKED CONSULTS. MORE INSTALLS." }, { text: "An extra $500K to $1M a year.", accent: true }],
  C: [{ text: "THE MARKETING AGENCY" }, { text: "built for window treatment", accent: true }, { text: "AND EXTERIOR SCREEN COMPANIES." }],
} satisfies Record<string, Segments>;
export const ACTIVE_HERO: keyof typeof HERO_VARIANTS = "A";

export const HERO_EYEBROW = "BUILT FOR WINDOW TREATMENT + SCREEN COMPANIES";
export const HERO_SUBHEADLINE =
  "We run Facebook and Instagram ads for blinds, shades, shutters, and retractable screen companies, then our team calls every lead and books the appointments onto your calendar. **You show up and close.**";

// The two floating cards on the hero video.
export const HERO_BADGES = {
  top: { value: "$1M+", label: "ONE SCREEN CLIENT · 10 MONTHS" },
  bottom: { value: "$228K", label: "78 DAYS" },
};

export const CTAS = {
  primary: { label: "See If You Qualify", href: "/apply" },
  secondary: { label: "See the results", href: "/case-studies" },
  heroSecondary: { label: "See Real Results", href: "/#results" },
} as const;

// Which form every "See If You Qualify" button uses.
// "roasform": the buttons open the ROASForm popup, and /apply shows the ROASForm inline.
// "native": the buttons link to /apply and the built-in multi-step form runs exactly as before.
export const LEAD_FORM_PROVIDER: "roasform" | "native" = "roasform";

export const ROASFORM = {
  formId: "e847e8-82119c-595ee1",
  scriptSrc: "https://my.roasform.com/roasform-embed.js",
  containerId: "roasform-e847e8-82119c-595ee1",
} as const;

// Word for word. Do not strengthen these.
export const RISK_REVERSAL = [
  "Month to month. No long-term contracts.",
  "If we don't produce in month one, you can walk.",
  "Our bonuses are tied to the jobs you close from our leads. We win when you win.",
] as const;

export const LOCATION_LINE = "Ontario-based. Serving window treatment and screen companies across the U.S.";
export const LOCATION_SHORT = "Ontario-based. Serving the U.S.";

export const NAV = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Results", href: "/case-studies" },
  { label: "Window Treatments", href: "/window-treatment-marketing" },
  { label: "Exterior Screens", href: "/retractable-screen-marketing" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const FOOTER = {
  description:
    "The marketing agency for window treatment and exterior screen companies. Facebook and Instagram ads, every lead called, appointments booked onto your calendar.",
  tagline: "More booked consults. More installs.",
  columns: [
    {
      title: "Company",
      links: [
        { label: "How It Works", href: "/how-it-works" },
        { label: "Results", href: "/case-studies" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Industries",
      links: [
        { label: "Window Treatment Marketing", href: "/window-treatment-marketing" },
        { label: "Retractable Screen Marketing", href: "/retractable-screen-marketing" },
      ],
    },
    {
      title: "Get Started",
      links: [{ label: "See If You Qualify", href: "/apply" }],
    },
  ],
  disclaimer:
    "Results shown are from specific clients and are not typical of every business. Your results depend on your market, your offer, your capacity, and how you run your appointments. Past results do not promise future results.",
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

// TODO_FOUNDER: draft copy. Replace the paragraphs with your own story and add a photo.
// TODO_STATS: confirm these numbers are current. Each one shows exactly as written here.
export const FOUNDER = {
  /** Path under /public, e.g. "/founder.jpg". null shows the placeholder frame. */
  image: "/founder.jpg" as string | null,
  imageAlt: "Founder of Wedge Acquisition",
  photoLabel: "FOUNDER · ONTARIO, CANADA",
  label: "WHY WE EXIST",
  title: [{ text: "BUILT FOR" }, { text: "one industry", accent: true }, { text: "ONLY." }] satisfies Segments,
  paragraphs: [
    "Most agencies will take any business with a credit card. On Monday it's a dentist, on Tuesday a roofer, and on Wednesday they're learning what a cellular shade is on your dime.",
    "**We picked one industry and stayed in it.** We only work with window treatment and exterior screen companies, so we already know how your buyer thinks, what a good consult looks like, and why a booked in-home appointment matters more than a click.",
    "That focus is the whole point. **Your market, your products, your calendar.** Nothing else gets our attention.",
  ],
  stats: [
    { value: "32", label: "ACTIVE CLIENTS" },
    { value: "2", label: "NICHES ONLY" },
    { value: "US", label: "MARKETS SERVED" },
  ],
};

// TODO_SOCIAL: add profile URLs. Empty entries are ignored in the footer and structured data.
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "" },
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "YouTube", href: "" },
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
