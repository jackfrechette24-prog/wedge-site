// Home page copy.
import type { PageSeo, TitledText } from "./types";
import { SYSTEM_NAME } from "./site";

export const homeSeo: PageSeo = {
  title: "Marketing Agency for Window Treatment Companies",
  description:
    "The marketing agency for window treatment companies and exterior screen companies. Facebook and Instagram ads, every lead called, appointments booked.",
};

export const homeCopy = {
  logoBar: "Trusted by window treatment and screen companies across the U.S.",
  problem: {
    eyebrow: "01 / THE PROBLEM",
    title: "Good work doesn't fill a calendar by itself.",
    intro: "You sell a great product and your installs look sharp. The trouble starts before the first appointment.",
    cards: [
      {
        title: "Referrals and repeat customers dry up.",
        body: "Word of mouth built the business, but you can't turn it up when the calendar goes quiet.",
      },
      {
        title: "Home shows and mailers are hard to track.",
        body: "You write the check, a few people call, and nobody can say which jobs came from which spend.",
      },
      {
        title: "Generic agencies don't know your products.",
        body: "If they can't tell a roller shade from a motorized screen, they can't write an ad your buyer cares about.",
      },
      {
        title: "Leads come in and nobody calls fast enough.",
        body: "You're on an install. By the time you call back, they've booked with someone else.",
      },
    ] satisfies TitledText[],
    closing: "And at the end of the month, you've paid for marketing with no way to tie it to closed jobs.",
  },
  system: {
    eyebrow: `02 / ${SYSTEM_NAME}`,
    title: "A marketing agency for window treatment companies, and nobody else.",
    intro: `${SYSTEM_NAME} does one job: it puts in-home appointments on your calendar and tracks them to closed revenue.`,
    pillars: [
      {
        title: "Ads built for your market and products",
        body: "Facebook and Instagram ads for your service area and the products you sell: interior, exterior, or both.",
      },
      {
        title: "Every lead called and booked",
        body: "Our appointment setting team calls every lead and books them onto your calendar. You don't chase anyone.",
      },
      {
        title: "Tracked to closed revenue",
        body: "We measure booked appointments and closed revenue, not clicks. You see what your marketing actually sold.",
      },
    ] satisfies TitledText[],
    link: "See how it works",
  },
  process: {
    eyebrow: "03 / HOW IT WORKS",
    title: "Five steps from first call to first leads.",
    link: "See the full process",
  },
  niches: {
    title: "Two kinds of company. Two different playbooks.",
    cards: [
      {
        label: "Interior",
        title: "Window treatments",
        body: "Blinds, shades, shutters, drapery, and motorized shades. For franchise owners and independent dealers.",
        href: "/window-treatment-marketing",
        linkLabel: "Marketing for window treatment companies",
      },
      {
        label: "Exterior",
        title: "Exterior retractable screens",
        body: "Retractable and motorized patio screens. Higher ticket, more seasonal, and a very different buyer.",
        href: "/retractable-screen-marketing",
        linkLabel: "Marketing for screen companies",
      },
    ],
  },
  results: {
    eyebrow: "04 / RESULTS",
    title: "Real companies. Real closed revenue.",
    link: "View all results",
  },
  risk: { eyebrow: "THE TERMS" },
  faq: { eyebrow: "05 / FAQ", title: "Questions owners ask us." },
  finalCta: { title: "Ready to fill your calendar?", note: "Takes 30 seconds." },
};
