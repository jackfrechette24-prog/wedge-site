// How It Works page copy. The steps also power the timeline on the home and niche pages.
import type { PageSeo, TitledText } from "./types";

export const howItWorksSeo: PageSeo = {
  title: "Window Treatment Lead Generation Process",
  description:
    "Our window treatment lead generation process: 5 steps from discovery call to booked appointments, with first leads within 24 hours of launch.",
};

export const processSteps: (TitledText & { detail: string })[] = [
  {
    title: "Discovery call",
    body: "We learn your market, products, capacity, and goals. If it's not a fit, we tell you.",
    detail:
      "This is a straight conversation, not a pitch. We want to know what you sell, where you install, how many jobs your crew can handle, and what a good year looks like. If the numbers don't work for your market, you'll hear it from us on this call.",
  },
  {
    title: "Onboarding call",
    body: "We gather everything we need: your offers, service area, products, and brand.",
    detail:
      "One call and you're done. We collect your offers, the zip codes you actually want to drive to, the products you want to sell more of, and how your brand should look and sound. You won't get a 40-page questionnaire.",
  },
  {
    title: "Build and launch in 3 days",
    body: "We build your ads, creative, and the full system for your market.",
    detail:
      "Our team writes and builds everything for your market and products. You don't write copy, cut video, or learn any software. About 3 days after onboarding, it's ready for your review.",
  },
  {
    title: "Pre-launch call",
    body: "We walk you through the system and how appointments will hit your calendar.",
    detail:
      "Before anything goes live, we show you what your buyers will see, how our team will talk to them, and exactly how appointments land on your calendar. You sign off, and we go.",
  },
  {
    title: "First leads within 24 hours",
    body: "Your ads go live, leads start coming in, and our team books them onto your calendar. You run the appointments and close.",
    detail:
      "First leads typically come in within 24 hours of launch. Our appointment setting team calls them and books them onto your calendar. You run the appointments, close the jobs, and do the installs.",
  },
];

export const howItWorksCopy = {
  seo: howItWorksSeo,
  breadcrumb: "How It Works",
  eyebrow: "HOW IT WORKS",
  h1: "How our window treatment lead generation process works.",
  intro:
    "Five steps. Launch about 3 days after onboarding. First leads typically within 24 hours of launch. Here is our window treatment lead generation process, and exactly what happens at each stage.",
  stepsEyebrow: "THE 5 STEPS",
  stepsTitle: "What happens, in order.",
  split: {
    eyebrow: "WHO DOES WHAT",
    title: "What you do vs. what we do.",
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
    eyebrow: "WHAT WE TRACK",
    title: "Three numbers that matter.",
    intro: "Clicks and likes don't pay your installers. These do.",
    items: [
      { title: "Leads", body: "How many people in your service area raised their hand for a quote." },
      { title: "Booked appointments", body: "How many of them are now on your calendar for a consult." },
      { title: "Closed revenue", body: "How many dollars of jobs you sold from those appointments." },
    ] satisfies TitledText[],
  },
  related: {
    title: "See it for your side of the business.",
    links: [
      { label: "Marketing for window treatment companies", href: "/window-treatment-marketing" },
      { label: "Marketing for retractable screen companies", href: "/retractable-screen-marketing" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  faq: { eyebrow: "FAQ", title: "Questions about the process." },
  cta: { title: "Find out if your market is a fit.", note: "Takes 30 seconds." },
};
