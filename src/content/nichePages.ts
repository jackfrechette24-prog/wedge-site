// Copy for the two main SEO pages.
import type { Niche } from "./caseStudies";
import type { FaqPage } from "./faqs";
import type { PageSeo } from "./types";

type TextSection = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: { title: string; body: string }[];
};

export type NichePage = {
  path: string;
  breadcrumb: string;
  seo: PageSeo;
  niche: Niche;
  faqPage: FaqPage;
  eyebrow: string;
  h1: string;
  intro: string[];
  whyFail: TextSection;
  whatWeRun: TextSection;
  whoWeWorkWith: TextSection;
  extra: TextSection;
  caseStudy: { eyebrow: string; title: string; intro: string };
  process: { eyebrow: string; title: string; intro: string; link: string };
  crossLink: { title: string; body: string; label: string; href: string };
  faq: { eyebrow: string; title: string };
  cta: { title: string; note: string };
};

export const interiorPage: NichePage = {
  path: "/window-treatment-marketing",
  breadcrumb: "Window Treatments",
  seo: {
    title: "Marketing for Window Treatment Companies",
    description:
      "Marketing for window treatment companies: Facebook ads for blind and shade companies, every lead called, and consults booked onto your calendar.",
  },
  niche: "interior",
  faqPage: "interior",
  eyebrow: "FOR BLINDS, SHADES, SHUTTERS + DRAPERY",
  h1: "Marketing for Window Treatment Companies",
  intro: [
    "Marketing for window treatment companies should do one thing: put more in-home consults on your calendar. We run Facebook and Instagram ads for blinds, shades, shutters, and drapery companies, then our team calls every lead and books the appointment. You show up and close.",
    "We only work with window treatment and screen companies. If you've been trying to grow a window treatment business with referrals, home shows, and an agency that also does dentists and roofers, this page is for you.",
  ],
  whyFail: {
    eyebrow: "01 / THE PROBLEM",
    title: "Why generic agencies fail window treatment dealers.",
    paragraphs: [
      "Most marketing for blind companies gets built by people who have never been on a consult. They run the same playbook they run for everyone else, and then they send you a report full of clicks. The report looks fine. Your calendar doesn't.",
      "Window treatments aren't an impulse buy, and they aren't a commodity if you sell them right. Your buyer just moved in, finished a remodel, or got tired of the sun fading the floor. They want someone to come out, measure, and show them samples. Selling that in-home appointment takes a different message than selling a $40 online blind.",
    ],
    subsections: [
      {
        title: "They don't know your products.",
        body: "A roller shade, a cellular shade, a plantation shutter, and a motorized shade each have a different buyer and a different reason to buy. An agency that treats them all as \"window coverings\" writes ads that sound like nothing and attract price shoppers.",
      },
      {
        title: "They stop at the lead.",
        body: "An agency that hands you a list of names has done the easy half. Someone still has to call them, fast, while you're on a ladder at another job. When nobody calls within the hour, the lead books with whoever did. That's why our appointment setting team calls every lead for you.",
      },
      {
        title: "They can't tell you what you sold.",
        body: "If your marketing report ends at cost per click, nobody can tie the spend to closed jobs. We track leads to booked appointments to closed revenue, because that's the number you actually pay your crew with.",
      },
    ],
  },
  whatWeRun: {
    eyebrow: "02 / WHAT WE RUN",
    title: "Facebook ads for blind companies, and everything else you sell.",
    paragraphs: [
      "Your buyer is a homeowner in your service area, scrolling on their phone at night, thinking about the room that still has builder-grade blinds. Facebook and Instagram are where you can reach them before they ever search. That's why our window treatment marketing starts there.",
      "We write and produce the ads, built around your market and the products you want to sell more of:",
    ],
    bullets: [
      "Blinds: wood, faux wood, and aluminum, sold on fit, finish, and the free in-home measure.",
      "Shades: roller, cellular, roman, and solar. Marketing for shade companies works best when each ad speaks to one problem: heat, glare, or privacy.",
      "Shutters: the high-value upgrade, sold to homeowners who plan to stay.",
      "Drapery: custom work for buyers who care about the look and expect a designer's eye.",
      "Motorized shades: the higher-ticket add-on, sold on tall windows, hard-to-reach spots, and daily convenience.",
    ],
    subsections: [
      {
        title: "Built for your market, not copied from someone else's.",
        body: "A new-build neighborhood outside Dallas and a historic district in Boston buy for different reasons. Your ads reflect your service area, your products, and your offers.",
      },
      {
        title: "Then our team picks up the phone.",
        body: "Every lead gets called by our appointment setting team. They confirm the project, answer the basics, and book the consult onto your calendar. By the time you walk in the door, the homeowner expects you.",
      },
    ],
  },
  whoWeWorkWith: {
    eyebrow: "03 / WHO WE WORK WITH",
    title: "Franchise owners and independent dealers.",
    paragraphs: [
      "We work with owner-operators across the U.S., typically doing $500K or more a year. If you're the person who decides how the business grows, you're who we built this for.",
    ],
    subsections: [
      {
        title: "Franchise owners",
        body: "Your franchise brand gives you name recognition, not a full calendar. Corporate marketing rarely reaches your territory the way you need it to. We focus on your zip codes and your calendar.",
      },
      {
        title: "Independent and boutique dealers",
        body: "You compete on service, selection, and design, not on the lowest price. Your ads should say so, and they should bring in homeowners who value that. We help you attract those buyers instead of the ones calling for the cheapest quote.",
      },
    ],
  },
  extra: {
    eyebrow: "04 / SLOW SEASON",
    title: "Stop waiting on referrals to fill your slow months.",
    paragraphs: [
      "Referrals and repeat customers are the best leads you'll ever get. They just don't show up on demand. When the calendar thins out, most dealers go back to mailers or another home show, and they wait to see what happens.",
      "Paid ads give you a source of new consults you can actually plan around. If you want to grow a window treatment business past what word of mouth can carry, you need demand that doesn't depend on who your last customer happened to talk to. That's the job. Month to month, no long-term contracts, and if we don't produce in month one, you can walk.",
      "It also changes how you run your week. When new consults show up on your calendar without you chasing them, you can decide which products to push, plan your crew's schedule ahead of time, and stop discounting just to keep people busy in a slow month.",
    ],
  },
  caseStudy: {
    eyebrow: "05 / RESULTS",
    title: "What this looks like in a real market.",
    intro: "Lightstyle Solutions sells interior shades and exterior retractable screens in Nashville.",
  },
  process: {
    eyebrow: "06 / THE PROCESS",
    title: "Five steps from first call to first leads.",
    intro: "Launch is about 3 days after onboarding, and first leads typically come in within 24 hours of launch.",
    link: "See the full process",
  },
  crossLink: {
    title: "Also sell exterior screens?",
    body: "We run those as a separate effort so each product gets the right message.",
    label: "Marketing for retractable screen companies",
    href: "/retractable-screen-marketing",
  },
  faq: { eyebrow: "FAQ", title: "Window treatment marketing questions." },
  cta: { title: "Ready for more booked consults?", note: "Takes 30 seconds." },
};

export const exteriorPage: NichePage = {
  path: "/retractable-screen-marketing",
  breadcrumb: "Exterior Screens",
  seo: {
    title: "Marketing for Retractable Screen Companies",
    description:
      "Marketing for retractable screen companies: Facebook ads for motorized screen companies, patio screen marketing, and appointments booked for you.",
  },
  niche: "exterior",
  faqPage: "exterior",
  eyebrow: "FOR RETRACTABLE + MOTORIZED SCREENS",
  h1: "Marketing for Retractable and Motorized Screen Companies",
  intro: [
    "Marketing for retractable screen companies comes down to one number: booked in-home appointments with homeowners who can afford the job. We run Facebook and Instagram ads for exterior screen companies, then our team calls every lead and books the appointment onto your calendar. You show up and close.",
    "One Orlando screen company generated over $1M in revenue in 10 months on under $15K in ad spend. We only work with window treatment and screen companies, so we already know what your buyer wants to hear.",
  ],
  whyFail: {
    eyebrow: "01 / THE PROBLEM",
    title: "Why general agencies waste a screen company's money.",
    paragraphs: [
      "A motorized patio screen is a considered purchase. The homeowner is spending real money on a space they want to use more: no bugs, less heat, less wind, more privacy. A general agency doesn't know that, so it runs ads that could be selling gutters or a pool cage, and then it reports on clicks.",
      "Outdoor screen company marketing also has problems that an agency used to selling a $200 service never has to think about.",
    ],
    subsections: [
      {
        title: "Tickets are high, so bad leads are expensive.",
        body: "Every appointment costs you a drive, a measure, and a demo. A calendar full of people who wanted a $300 fix for a torn screen door is worse than an empty one. Your ads and our calls need to set the right expectation before you get in the truck.",
      },
      {
        title: "A retractable screen isn't a screen door.",
        body: "Homeowners don't always know this product exists. Your marketing has to show them what it does and what their patio could be, not just announce a sale. That takes someone who understands the product.",
      },
      {
        title: "Speed decides who gets the job.",
        body: "A homeowner who just asked about screens is ready right now, and they may have asked two other companies. You're on an install with a drill in your hand. Our appointment setting team makes the call so that the lead doesn't go cold.",
      },
    ],
  },
  whatWeRun: {
    eyebrow: "02 / WHAT WE RUN",
    title: "Facebook ads for motorized screen companies.",
    paragraphs: [
      "This product sells on what people can see. Facebook and Instagram let you show homeowners in your service area what a covered patio looks like when the screens come down at the push of a button. That's why patio screen marketing works so well there, and it's where we start.",
      "We write and produce the ads for your market and your product line:",
    ],
    bullets: [
      "Motorized screens: the premium option, sold on convenience and the clean look when they're up.",
      "Retractable patio screens: sold on getting the patio back from bugs, heat, and wind.",
      "Garage and lanai openings: sold on turning unused space into a room you actually use.",
      "Solar and privacy fabrics: sold on glare, heat, and nosy neighbors.",
    ],
    subsections: [
      {
        title: "Your market sets the message.",
        body: "Mosquitoes sell screens in Florida. Sun and heat sell them in Arizona. Wind and evening chill sell them on the coast. We build around what your buyers actually complain about.",
      },
      {
        title: "Then our team books the appointment.",
        body: "Our appointment setting team calls every lead, confirms what they're looking for, and books them onto your calendar. You spend your time in front of homeowners, not chasing voicemail.",
      },
    ],
  },
  whoWeWorkWith: {
    eyebrow: "03 / WHO WE WORK WITH",
    title: "Screen specialists and dealers who added exterior.",
    paragraphs: [
      "We work with owner-operators across the U.S., typically doing $500K or more a year. It doesn't matter whether screens are your whole business or a line you added to an interior shop.",
    ],
    subsections: [
      {
        title: "Exterior screen specialists",
        body: "Screens are the business. You need a steady flow of appointments that your crew can actually keep up with, and you want them in the neighborhoods that buy.",
      },
      {
        title: "Window treatment dealers adding exterior",
        body: "You already have the customers and the install crew. We run exterior as its own effort with its own message, so your screen ads don't get lost in your blinds marketing.",
      },
    ],
  },
  extra: {
    eyebrow: "04 / SEASONALITY",
    title: "Exterior is seasonal. Your marketing should know that.",
    paragraphs: [
      "In much of the country, screen demand follows the weather. Buyers wake up in spring, your calendar fills, and by the time you feel the rush, you've already lost weeks. In the off-season, the phone goes quiet and you wonder how you'll keep the crew busy.",
      "We plan around your season and your capacity. In peak months, the goal is a full calendar without overwhelming your crew. Before peak, the goal is to have work lined up early. In markets with a long season, like Florida, there's less of a slow period to wait out. On the discovery call we'll look at your market and tell you what's realistic for it.",
      "Capacity matters more here than in most trades. A motorized screen job takes real install time, and a backed-up crew means a homeowner who waits and starts to second-guess the purchase. Tell us how many jobs a month you can actually install, and we'll work toward that number instead of flooding you with appointments you can't serve. More booked projects only help if you can get them installed while the customer is still excited.",
    ],
  },
  caseStudy: {
    eyebrow: "05 / RESULTS",
    title: "$1M+ in 10 months, on under $15K in ad spend.",
    intro: "Motorized Screens of Orlando sells and installs exterior motorized screens across the Orlando market.",
  },
  process: {
    eyebrow: "06 / THE PROCESS",
    title: "Five steps from first call to first leads.",
    intro: "Launch is about 3 days after onboarding, and first leads typically come in within 24 hours of launch.",
    link: "See the full process",
  },
  crossLink: {
    title: "Also sell blinds and shades?",
    body: "We run interior as a separate effort so each product gets the right message.",
    label: "Marketing for window treatment companies",
    href: "/window-treatment-marketing",
  },
  faq: { eyebrow: "FAQ", title: "Screen company marketing questions." },
  cta: { title: "Ready to book more screen jobs?", note: "Takes 30 seconds." },
};
