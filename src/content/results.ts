// Copy for the case study index and template.
import type { PageSeo, Segments } from "./types";

export const caseStudiesSeo: PageSeo = {
  title: "Window Treatment Marketing Case Studies",
  description:
    "Window treatment marketing case studies: real revenue results from blinds, shade, and exterior screen companies across the U.S.",
};

export const caseStudiesCopy = {
  breadcrumb: "Results",
  eyebrow: "RESULTS",
  h1: [{ text: "Results:" }, { text: "window treatment and screen company", accent: true }, { text: "case studies" }] satisfies Segments,
  intro: "Window treatment marketing case studies from real companies in real markets, measured in closed revenue.",
  filters: { all: "All", interior: "Interior", exterior: "Exterior", label: "Filter case studies" },
  empty: "No case studies in this category yet.",
  cardLink: "Read the case study",
  noVideo: "Video coming soon",
  playLabel: "Play video",
  logoAlt: "logo",
};

export const caseStudyTemplateCopy = {
  situation: { label: "THE SITUATION", title: "The situation" },
  whatWeDid: { label: "WHAT WE DID", title: "What we did" },
  results: { label: "THE NUMBERS", title: [{ text: "THE" }, { text: "results.", accent: true }] satisfies Segments },
  quoteLabel: "IN THEIR WORDS",
  backLink: "All case studies",
  nicheLinkLabel: { interior: "Marketing for window treatment companies", exterior: "Marketing for retractable screen companies" },
  ownerLabel: "Owner",
  alsoKnownAsLabel: "Also known as",
  ctaTitle: [{ text: "WANT RESULTS LIKE THIS" }, { text: "in your market?", accent: true }] satisfies Segments,
  ctaNote: "Takes 30 seconds.",
};
