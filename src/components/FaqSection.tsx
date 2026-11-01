import { faqsForPage, type FaqPage } from "@/content/faqs";
import { faqJsonLd, videoJsonLd } from "@/lib/seo";
import { Accordion, AccordionItem } from "./Accordion";
import { JsonLd } from "./JsonLd";
import { Section } from "./Section";
import { SimpleMarkdown } from "./SimpleMarkdown";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
  page: FaqPage;
  eyebrow: string;
  title: string;
  tone?: "dark" | "graphite" | "light";
  id?: string;
};

export function FaqSection({ page, eyebrow, title, tone = "dark", id }: Props) {
  const items = faqsForPage(page);
  const videos = items.map((faq) => videoJsonLd(faq.video)).filter((video) => video !== null);

  return (
    <Section tone={tone} id={id} eyebrow={eyebrow} title={title}>
      <JsonLd data={[faqJsonLd(items), ...videos]} />
      <Accordion>
        {items.map((faq) => (
          <AccordionItem key={faq.id} title={faq.question}>
            <SimpleMarkdown text={faq.answer} />
            {faq.video && (
              <div className="mt-5">
                <VideoPlayer video={faq.video} />
              </div>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
