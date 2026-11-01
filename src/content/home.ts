// Home page copy.
import type { IconName, PageSeo, Segments } from "./types";
import { SYSTEM_NAME } from "./site";

export const homeSeo: PageSeo = {
  title: "Marketing Agency for Window Treatment Companies",
  description:
    "The marketing agency for window treatment companies and exterior screen companies. Facebook and Instagram ads, every lead called, appointments booked.",
};

export type FeatureCardData = {
  icon: IconName;
  tag: string;
  title: string;
  promise: string;
  body: string;
  bullets: string[];
};

export const homeCopy = {
  trustRow: "Month to month. No long-term contracts.",
  system: {
    label: SYSTEM_NAME,
    title: [{ text: "WE DON'T SELL CLICKS." }, { text: "We fill calendars.", accent: true }] satisfies Segments,
    intro: `${SYSTEM_NAME} does one job: it puts in-home appointments on your calendar and tracks them to closed revenue.`,
    cards: [
      {
        icon: "target",
        tag: "SYSTEM / 01",
        title: "Ads built for your market",
        promise: "Your service area. Your products. Your buyer.",
        body: "Facebook and Instagram ads for the products you sell, written for the homeowners you want to reach.",
        bullets: ["Interior, exterior, or both", "Your offers and your brand", "Built by people who know the product"],
      },
      {
        icon: "phone-call",
        tag: "SYSTEM / 02",
        title: "Every lead called and booked",
        promise: "You don't chase anyone.",
        body: "Our appointment setting team calls every lead and books them onto your calendar while you're out on a job.",
        bullets: ["Every lead gets a call", "Appointments land on your calendar", "You show up and close"],
      },
      {
        icon: "trending-up",
        tag: "SYSTEM / 03",
        title: "Tracked to closed revenue",
        promise: "You see what your marketing actually sold.",
        body: "We measure booked appointments and closed revenue, so you can tie what you spend to the jobs you close.",
        bullets: ["Leads", "Booked appointments", "Closed revenue"],
      },
    ] satisfies FeatureCardData[],
    link: "See how it works",
  },
  results: {
    label: "RESULTS",
    title: [{ text: "JUDGE US BY" }, { text: "closed revenue.", accent: true }] satisfies Segments,
    intro: "Real companies in real markets. **No likes, no impressions, just the jobs they sold.**",
    link: "View all case studies",
    nextCard: {
      title: [{ text: "YOUR COMPANY" }, { text: "goes here.", accent: true }] satisfies Segments,
      body: "Find out if your market is a fit. Takes 30 seconds.",
    },
  },
  niches: {
    label: "WHO WE SERVE",
    title: [
      { text: "THE MARKETING AGENCY FOR" },
      { text: "window treatment companies", accent: true },
      { text: "AND SCREEN COMPANIES." },
    ] satisfies Segments,
    cards: [
      {
        icon: "blinds",
        title: "Window treatments",
        body: "Blinds, shades, shutters, drapery, and motorized shades. For franchise owners and independent dealers.",
        href: "/window-treatment-marketing",
        linkLabel: "Marketing for window treatment companies",
      },
      {
        icon: "sun",
        title: "Exterior retractable screens",
        body: "Retractable and motorized patio screens. Higher ticket, more seasonal, and a very different buyer.",
        href: "/retractable-screen-marketing",
        linkLabel: "Marketing for screen companies",
      },
    ] satisfies { icon: IconName; title: string; body: string; href: string; linkLabel: string }[],
  },
  faq: {
    label: "FAQ",
    title: [{ text: "THE QUESTIONS" }, { text: "owners actually ask.", accent: true }] satisfies Segments,
  },
  finalCta: {
    title: [{ text: "READY TO" }, { text: "fill your calendar?", accent: true }] satisfies Segments,
    note: "Takes 30 seconds.",
  },
};

export const FAQ_SIDE_LINE = "Still skeptical? Good. If it's not answered here, ask on the call.";
