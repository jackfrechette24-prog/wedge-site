// FAQs. `pages` controls where each question shows. Answers support **bold** and [links](/path).
// Set `video` to show a video inside the opened answer.
import type { Video } from "./types";

export type FaqPage = "home" | "interior" | "exterior" | "how-it-works";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  video: Video;
  pages: FaqPage[];
};

export const faqs: Faq[] = [
  {
    id: "how-fast",
    question: "How fast will I see leads?",
    answer: "First leads typically come in within 24 hours of launch. Launch is about 3 days after onboarding.",
    video: null,
    pages: ["home", "interior", "exterior", "how-it-works"],
  },
  {
    id: "franchise-owners",
    question: "Do you work with franchise owners?",
    answer: "Yes. We work with franchise owners and independent or boutique dealers.",
    video: null,
    pages: ["home", "interior", "exterior"],
  },
  {
    id: "contract",
    question: "Do you require a long-term contract?",
    answer: "No. Month to month. If we don't produce in month one, you can walk.",
    video: null,
    pages: ["home", "interior", "exterior", "how-it-works"],
  },
  {
    id: "who-calls",
    question: "Who calls the leads?",
    answer: "Our appointment setting team calls every lead and books qualified appointments onto your calendar.",
    video: null,
    pages: ["home", "interior", "exterior", "how-it-works"],
  },
  {
    id: "interior-exterior",
    question: "Do you do interior, exterior, or both?",
    answer: "All three. We run them as separate efforts so each gets the right message.",
    video: null,
    pages: ["home", "interior", "exterior"],
  },
  {
    id: "what-i-do",
    question: "What do I need to do?",
    answer:
      "Show up to the onboarding and pre-launch calls, run your appointments, close, and keep your pipeline updated so we can track revenue.",
    video: null,
    pages: ["home", "how-it-works"],
  },
  {
    id: "success",
    question: "How do you measure success?",
    answer: "Booked appointments and closed revenue, not clicks or likes.",
    video: null,
    pages: ["home", "interior", "exterior", "how-it-works"],
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answer:
      "It depends on your market and goals. We cover it on the call, and we'll tell you straight if the numbers don't make sense for you.",
    video: null,
    pages: ["home", "interior", "exterior"],
  },
  {
    id: "outside-us",
    question: "Do you work outside the U.S.?",
    answer: "We currently work with companies across the U.S.",
    video: null,
    pages: ["home"],
  },
  {
    id: "different",
    question: "What makes you different from a general marketing agency?",
    answer: "We only work with window treatment and screen companies.",
    video: null,
    pages: ["home", "interior", "exterior"],
  },
];

export function faqsForPage(page: FaqPage) {
  return faqs.filter((faq) => faq.pages.includes(page));
}
