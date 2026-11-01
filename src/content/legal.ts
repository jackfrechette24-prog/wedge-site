// Privacy policy and terms. Template only, have counsel review before launch.
import type { PageSeo } from "./types";
import { CONTACT_EMAIL, SITE_NAME } from "./site";

export type LegalSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export const LEGAL_TEMPLATE_NOTICE = "Template, have counsel review.";
export const LEGAL_UPDATED = "Last updated: November 1, 2026";

export const privacySeo: PageSeo = {
  title: "Privacy Policy",
  description: "How Wedge Acquisition collects, uses, and protects information submitted through this website.",
};

export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${SITE_NAME} is a marketing agency based in Ontario, Canada, serving window treatment and screen companies in the United States. This policy explains how we handle information collected through this website.`,
    ],
  },
  {
    heading: "What we collect",
    bullets: [
      "Information you give us: your name, company name, email, mobile phone number, company website, and your answers to our qualification questions.",
      "Your consent record: whether you agreed to be contacted, the wording you agreed to, and when.",
      "Technical information: the page you arrived on, the referring site, tracking tags in the link you followed, browser type, and a one-way hash of your IP address. We do not store your raw IP address.",
      "If you do not qualify, we record only the reason and your revenue answer, not your contact details.",
    ],
  },
  {
    heading: "How we use it",
    bullets: [
      "To respond to your inquiry and schedule a call.",
      "To contact you by phone, SMS, and email about your inquiry, as you consented to.",
      "To understand which marketing brought you here and improve our site and our own advertising.",
      "To protect this website from spam and abuse.",
    ],
  },
  {
    heading: "Your consent to be contacted",
    paragraphs: [
      "When you submit our form and check the consent box, you agree to be contacted by Wedge Acquisition by phone, SMS, and email about your inquiry. Message and data rates may apply. Consent is not a condition of purchase. You can reply STOP to any text message to opt out, use the unsubscribe link in any email, or email us at any time to withdraw consent.",
    ],
  },
  {
    heading: "Cookies and analytics",
    paragraphs: [
      "We use a first-party cookie, kept for up to 30 days, to remember how you found us. We may also use cookies and similar tools from Meta and Google to measure traffic and our advertising. You can block cookies in your browser settings, and the site will still work.",
    ],
  },
  {
    heading: "Who we share it with",
    paragraphs: [
      "We do not sell your information. We share it only with service providers that help us run our business, such as hosting, database, scheduling, contact management, messaging, and analytics providers, and when the law requires it. Some providers store data outside Canada, including in the United States, where it may be subject to local law.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep your information as long as we need it for the purposes above, or as the law requires, then delete or de-identify it.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      `You can ask to see, correct, or delete your information, or withdraw consent, by emailing ${CONTACT_EMAIL}. We will respond within a reasonable time and as required by law.`,
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "We use reasonable safeguards to protect your information. No system is perfectly secure, so we cannot promise absolute security.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [`Questions about this policy? Email ${CONTACT_EMAIL}.`],
  },
];

export const termsSeo: PageSeo = {
  title: "Terms of Use",
  description: "The terms that apply when you use the Wedge Acquisition website.",
};

export const termsSections: LegalSection[] = [
  {
    heading: "Using this website",
    paragraphs: [
      `This website is operated by ${SITE_NAME}, based in Ontario, Canada. By using it, you agree to these terms. If you do not agree, please do not use the site.`,
    ],
  },
  {
    heading: "Business use",
    paragraphs: [
      "This site is intended for owners and representatives of businesses. Information you submit must be accurate, and you must be authorized to submit it.",
    ],
  },
  {
    heading: "No client relationship",
    paragraphs: [
      "Submitting a form or booking a call does not create a client relationship. Any services we provide are governed by a separate written agreement.",
    ],
  },
  {
    heading: "Results",
    paragraphs: [
      "Case studies and figures on this site describe results achieved by specific clients. They are not typical of every business and do not promise any particular outcome. Your results depend on your market, your offer, your capacity, and how you run your appointments.",
    ],
  },
  {
    heading: "Communications",
    paragraphs: [
      "If you consent on our form, we may contact you by phone, SMS, and email about your inquiry. Message and data rates may apply. Reply STOP to opt out of texts. See our privacy policy for details.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      `The content, branding, and design of this site belong to ${SITE_NAME} or its licensors. You may not copy or reuse them without permission.`,
    ],
  },
  {
    heading: "Third-party services",
    paragraphs: [
      "This site may link to or embed third-party services, such as video players and scheduling tools. We are not responsible for their content or practices.",
    ],
  },
  {
    heading: "Disclaimer and limit of liability",
    paragraphs: [
      `This site is provided "as is" without warranties of any kind. To the extent the law allows, ${SITE_NAME} is not liable for indirect or consequential losses arising from your use of the site.`,
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [`We may update these terms by posting a new version here. Questions? Email ${CONTACT_EMAIL}.`],
  },
];
