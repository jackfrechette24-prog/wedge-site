// Case studies. Add an object to the array and the index, detail page, sitemap, and
// structured data all update. Any stat left null is hidden.
import type { Segments, Video } from "./types";

export type Niche = "interior" | "exterior";

export type CaseStudy = {
  slug: string;
  company: string;
  alsoKnownAs: string | null;
  owner: string | null;
  city: string;
  state: string;
  niches: Niche[];
  headlineMetric: string;
  /** The headline metric, split up for the case study page and share image. */
  headline: Segments;
  summary: string;
  situation: string[];
  whatWeDid: string[];
  stats: {
    revenue: string | null;
    timeframe: string | null;
    adSpend: string | null;
    leads: string | null;
    appointments: string | null;
    costPerLead: string | null;
    roas: string | null;
  };
  quote: { text: string; name: string; role: string } | null;
  /** Path under /public, e.g. "/clients/lightstyle.svg". */
  logo: string | null;
  video: Video;
  /** Path under /public for the video card image. Falls back to the video's own thumbnail. */
  poster: string | null;
  featuredOnHome: boolean;
  /** ISO date, used in structured data and the sitemap. */
  publishedAt: string;
};

export const NICHE_LABELS: Record<Niche, string> = {
  interior: "Interior shades",
  exterior: "Exterior screens",
};

export const STAT_LABELS: Record<keyof CaseStudy["stats"], string> = {
  revenue: "Revenue",
  timeframe: "Timeframe",
  adSpend: "Ad spend",
  leads: "Leads",
  appointments: "Appointments",
  costPerLead: "Cost per lead",
  roas: "Return on ad spend",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "motorized-screens-orlando",
    company: "Motorized Screens of Orlando",
    alsoKnownAs: "Screens of Central Florida",
    owner: "Jimmy Nilson",
    city: "Orlando",
    state: "FL",
    niches: ["exterior"],
    headlineMetric: "$1M+ in revenue in 10 months",
    headline: [{ text: "$1M+", accent: true }, { text: "IN REVENUE IN 10 MONTHS" }],
    summary: "An Orlando exterior motorized screen company generated over $1M in revenue in 10 months on under $15K in ad spend.",
    // TODO_CASE_STUDY: replace with the real story. Where was the business before you started?
    situation: [
      "Motorized Screens of Orlando, also known as Screens of Central Florida, sells and installs exterior motorized screens in the Orlando market.",
    ],
    whatWeDid: [
      "We ran Facebook and Instagram ads built for exterior motorized screens in the Orlando market.",
      "Our appointment setting team called the leads and booked appointments onto the calendar.",
      "We tracked the work to closed revenue, so the number that mattered was jobs sold, not clicks.",
    ],
    stats: {
      revenue: "$1M+",
      timeframe: "10 months",
      adSpend: "Under $15K",
      leads: null, // TODO
      appointments: null, // TODO
      costPerLead: null, // TODO
      roas: null, // TODO
    },
    quote: null, // TODO_QUOTE
    logo: null, // TODO_LOGO
    video: {
      provider: "youtube",
      id_or_src: "--QR-9Q9A5A",
      title: "How We Helped Motorized Screens Orlando Add An Additional $1.06M In Projects From Meta Ads",
      description: "How an Orlando exterior motorized screen company added new projects with Facebook and Instagram ads and booked appointments.",
      thumbnail: "https://i.ytimg.com/vi/--QR-9Q9A5A/maxresdefault.jpg",
      uploadDate: "2026-11-02",
    },
    poster: null, // TODO_POSTER
    featuredOnHome: true,
    publishedAt: "2026-11-01",
  },
  {
    slug: "lightstyle-solutions",
    company: "Lightstyle Solutions",
    alsoKnownAs: null,
    owner: null,
    city: "Nashville",
    state: "TN",
    niches: ["interior", "exterior"],
    headlineMetric: "$228K in revenue in 78 days",
    headline: [{ text: "$228K", accent: true }, { text: "IN REVENUE IN 78 DAYS" }],
    summary: "A Nashville interior shade and exterior retractable screen company generated $228K in revenue in its first 78 days with us.",
    // TODO_CASE_STUDY: replace with the real story. Where was the business before you started?
    situation: [
      "Lightstyle Solutions sells and installs interior shades and exterior retractable screens in the Nashville market.",
    ],
    whatWeDid: [
      "We ran Facebook and Instagram ads built for shades and retractable screens in the Nashville market, with each product getting its own message.",
      "Our appointment setting team called the leads and booked appointments onto the calendar.",
      "We tracked the work to closed revenue, so the number that mattered was jobs sold, not clicks.",
    ],
    stats: {
      revenue: "$228K",
      timeframe: "78 days",
      adSpend: null, // TODO
      leads: null, // TODO
      appointments: null, // TODO
      costPerLead: null, // TODO
      roas: null, // TODO
    },
    quote: null, // TODO_QUOTE
    logo: null, // TODO_LOGO
    video: {
      provider: "youtube",
      id_or_src: "mxI9GSeyfCg",
      title: "How This Window Treatment Company Closed An Additional $228k In Shade Projects From Meta Ads",
      description: "How a Nashville shade and retractable screen company closed more shade projects with Facebook and Instagram ads and booked appointments.",
      thumbnail: "https://i.ytimg.com/vi/mxI9GSeyfCg/maxresdefault.jpg",
      uploadDate: "2026-11-02",
    },
    poster: null, // TODO_POSTER
    featuredOnHome: true,
    publishedAt: "2026-11-01",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export function caseStudiesForNiche(niche: Niche) {
  return caseStudies.filter((study) => study.niches.includes(niche));
}

export function nicheHref(study: CaseStudy) {
  return study.niches.includes("interior") ? "/window-treatment-marketing" : "/retractable-screen-marketing";
}
