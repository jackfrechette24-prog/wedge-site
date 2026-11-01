// Copy for /apply, /book, /confirmed, /not-a-fit, and the 404 page.
import type { PageSeo } from "./types";

export const CONSENT_TEXT =
  "I agree to be contacted by Wedge Acquisition by phone, SMS, and email about my inquiry. Message and data rates may apply. Reply STOP to opt out.";

export const REVENUE_OPTIONS = [
  { value: "under_300k", label: "Under $300K" },
  { value: "300k_500k", label: "$300K to $500K" },
  { value: "500k_1m", label: "$500K to $1M" },
  { value: "1m_2m", label: "$1M to $2M" },
  { value: "2m_plus", label: "$2M+" },
] as const;

export const VALIDATION_MESSAGES = {
  firstName: "Enter your first name.",
  lastName: "Enter your last name.",
  companyName: "Enter your company name.",
  email: "Enter a valid email address.",
  phone: "Enter a valid U.S. or Canadian mobile number.",
  website: "Enter a valid website, or leave this blank.",
  consent: "Please check this box so we can contact you.",
};

export const applySeo: PageSeo = {
  title: "See If You Qualify",
  description: "Answer a few quick questions to see if Wedge Acquisition is a fit for your window treatment or screen company. Takes 30 seconds.",
};

export const applyCopy = {
  eyebrow: "SEE IF YOU QUALIFY",
  back: "Back",
  q1: {
    question: "Do you own a window treatment or exterior retractable screen company?",
    yes: "Yes",
    no: "No",
  },
  q2: { question: "What's your company's current annual revenue?" },
  q3: {
    question: "Are you willing to invest $3,000 per month into marketing?",
    yes: "Yes",
    no: "No",
  },
  contact: {
    title: "You qualify. Where should we reach you?",
    intro: "Next, you'll pick a time for a quick call.",
    firstName: "First name",
    lastName: "Last name",
    companyName: "Company name",
    email: "Email",
    phone: "Mobile phone",
    website: "Company website (optional)",
    privacy: "Privacy policy",
    submit: "See available times",
    submitting: "One moment...",
    retrying: "Something went wrong, retrying...",
  },
  maintenance: {
    title: "We're doing some quick maintenance.",
    body: "The form is down for a moment. Email us and we'll get back to you personally.",
    linkLabel: "Email us",
  },
};

export const bookSeo: PageSeo = {
  title: "Pick a Time",
  description: "Pick a time for a quick call with Wedge Acquisition.",
};

export const bookCopy = {
  eyebrow: "ONE LAST STEP",
  title: "Pick a time that works.",
  body: "15 to 30 minute call. No pressure, we'll tell you straight if it's a fit.",
  calendarTitle: "Booking calendar",
  noCalendar: {
    title: "We've got your details.",
    body: "Our calendar isn't available right now, so we'll call you to set up a time. Need us sooner? Email us.",
    linkLabel: "Email us",
  },
};

export const confirmedSeo: PageSeo = {
  title: "You're Booked",
  description: "Your call with Wedge Acquisition is booked.",
};

export const confirmedCopy = {
  eyebrow: "CONFIRMED",
  title: "You're booked.",
  nextTitle: "What happens next",
  next: [
    "You'll get a confirmation with the call details by email and text.",
    "We'll look at your market before the call so we can use the time well.",
    "On the call, we'll tell you straight if it's a fit and what the numbers look like.",
  ],
  calendarReminder: "Add to calendar: open your confirmation and save the time now, so it doesn't get buried.",
  videoEyebrow: "BEFORE THE CALL",
  videoTitle: "Watch this before we talk.",
  resultsTitle: "While you wait, watch the results",
};

export const notAFitSeo: PageSeo = {
  title: "Thanks for Checking",
  description: "Thanks for checking in with Wedge Acquisition.",
};

export const notAFitCopy = {
  eyebrow: "THANKS FOR CHECKING",
  title: "We're not the right fit right now.",
  reasons: {
    not_owner:
      "This is built for owners of window treatment and screen companies. If you're passing this along to your boss, send them this page.",
    budget:
      "Right now we're not the right fit, and we'd rather tell you than waste your money. When you're ready to invest in growth, come back.",
    default: "This is built for owners of window treatment and screen companies who are ready to invest in growth.",
  },
  homeLink: "Back to home",
};

export const notFoundCopy = {
  eyebrow: "404",
  title: "This page doesn't exist.",
  body: "It may have moved. Head back home and we'll get you where you need to go.",
  link: "Back to home",
};
