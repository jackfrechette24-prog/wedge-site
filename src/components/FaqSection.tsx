import { faqsForPage, type FaqPage } from "@/content/faqs";
import { FAQ_SIDE_LINE } from "@/content/home";
import { CTAS } from "@/content/site";
import type { Segments } from "@/content/types";
import { faqJsonLd, videoJsonLd } from "@/lib/seo";
import { ButtonLink } from "./Button";
import { FAQAccordion } from "./FAQAccordion";
import { JsonLd } from "./JsonLd";
import { Section } from "./Section";

type Props = { page: FaqPage; label: string; title: Segments; id?: string };

export function FaqSection({ page, label, title, id }: Props) {
  const items = faqsForPage(page);
  const videos = items.map((faq) => videoJsonLd(faq.video)).filter((video) => video !== null);

  return (
    <Section
      split
      id={id}
      label={label}
      title={title}
      intro={FAQ_SIDE_LINE}
      actions={<ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>}
    >
      <JsonLd data={[faqJsonLd(items), ...videos]} />
      <FAQAccordion items={items} />
    </Section>
  );
}
