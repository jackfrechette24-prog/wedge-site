// How It Works page copy. The steps also power the timeline on the home and niche pages.
import type { PageSeo, Segments, TitledText } from "./types";

export const howItWorksSeo: PageSeo = {
  title: "Window Treatment Lead Generation Process",
  description:
    "Our window treatment lead generation process: 5 steps from discovery call to booked appointments, with first leads within 24 hours of launch.",
};

export const processSteps: (TitledText & { detail: string; timing: string; takeaway: string })[] = [
  {
    title: "Discovery call",
    timing: "DAY 0",
    takeaway: "You'll know if it's a fit before you commit to anything.",
    body: "We learn your market, products, capacity, and goals. If it's not a fit, we tell you.",
    detail:
      "This is a straight conversation, not a pitch. We want to know what you sell, where you install, how many jobs your crew can handle, and what a good year looks like. If the numbers don't work for your market, you'll hear it from us on this call.",
  },
  {
    title: "Onboarding call",
    timing: "DAY 1",
    takeaway: "One call, and we have what we need.",
    body: "We gather everything we need: your offers, service area, products, and brand.",
    detail:
      "One call and you're done. We collect your offers, the zip codes you actually want to drive to, the products you want to sell more of, and how your brand should look and sound. You won't get a 40-page questionnaire.",
  },
  {
    title: "Build and launch in 3 days",
    timing: "DAYS 1 TO 3",
    takeaway: "You don't write a word or learn any software.",
    body: "We build your ads, creative, and the full system for your market.",
    detail:
      "Our team writes and builds everything for your market and products. You don't write copy, cut video, or learn any software. About 3 days after onboarding, it's ready for your review.",
  },
  {
    title: "Pre-launch call",
    timing: "BEFORE LAUNCH",
    takeaway: "Nothing goes live until you've seen it.",
    body: "We walk you through the system and how appointments will hit your calendar.",
    detail:
      "Before anything goes live, we show you what your buyers will see, how our team will talk to them, and exactly how appointments land on your calendar. You sign off, and we go.",
  },
  {
    title: "First leads within 24 hours",
    timing: "WITHIN 24 HRS",
    takeaway: "You run the appointments. Our team keeps booking them.",
    body: "Your ads go live, leads start coming in, and our team books them onto your calendar. You run the appointments and close.",
    detail:
      "First leads typically come in within 24 hours of launch. Our appointment setting team calls them and books them onto your calendar. You run the appointments, close the jobs, and do the installs.",
  },
];

export const howItWorksCopy = {
  seo: howItWorksSeo,
  breadcrumb: "How It Works",
  eyebrow: "HOW IT WORKS",
  process: {
    label: "THE 5 STEPS",
    title: [{ text: "FROM CALL TO" }, { text: "booked appointments", accent: true }, { text: "IN DAYS." }] satisfies Segments,
  },
  h1: [{ text: "HOW OUR" }, { text: "window treatment lead generation", accent: true }, { text: "PROCESS WORKS." }] satisfies Segments,
  intro:
    "Five steps. Launch about 3 days after onboarding. First leads typically within 24 hours of launch. Here is our window treatment lead generation process, and exactly what happens at each stage.",
  split: {
    label: "WHO DOES WHAT",
    title: [{ text: "WHAT YOU DO" }, { text: "vs. what we do.", accent: true }] satisfies Segments,
    you: {
      heading: "What you do",
      items: [
        "Show up to the onboarding and pre-launch calls",
        "Run your appointments",
        "Close the jobs and do the installs",
        "Keep your pipeline updated so we can track revenue",
      ],
    },
    us: {
      heading: "What we do",
      items: [
        "Build Facebook and Instagram ads for your market and products",
        "Write and produce the creative",
        "Call every lead",
        "Book appointments onto your calendar",
        "Track leads and appointments through to closed revenue",
      ],
    },
  },
  tracking: {
    label: "WHAT WE TRACK",
    title: [{ text: "THREE NUMBERS" }, { text: "that matter.", accent: true }] satisfies Segments,
    intro: "Clicks and likes don't pay your installers. These do.",
    items: [
      { title: "Leads", body: "How many people in your service area raised their hand for a quote." },
      { title: "Booked appointments", body: "How many of them are now on your calendar for a consult." },
      { title: "Closed revenue", body: "How many dollars of jobs you sold from those appointments." },
    ] satisfies TitledText[],
  },
  related: {
    label: "KEEP READING",
    title: [{ text: "SEE IT FOR" }, { text: "your side of the business.", accent: true }] satisfies Segments,
    links: [
      { label: "Marketing for window treatment companies", href: "/window-treatment-marketing" },
      { label: "Marketing for retractable screen companies", href: "/retractable-screen-marketing" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  risk: { label: "THE TERMS" },
  faq: { label: "FAQ", title: [{ text: "QUESTIONS ABOUT" }, { text: "the process.", accent: true }] satisfies Segments },
  cta: { title: [{ text: "FIND OUT IF" }, { text: "your market is a fit.", accent: true }] satisfies Segments, note: "Takes 30 seconds." },
};
