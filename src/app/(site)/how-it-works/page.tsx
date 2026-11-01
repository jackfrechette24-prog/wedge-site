import { ButtonLink } from "@/components/Button";
import { CheckList } from "@/components/CheckList";
import { ComparisonSection } from "@/components/ComparisonSection";
import { CtaBand } from "@/components/CtaBand";
import { FaqSection } from "@/components/FaqSection";
import { PageHero } from "@/components/PageHero";
import { ProcessSection } from "@/components/ProcessSection";
import { Reveal } from "@/components/Reveal";
import { RiskStrip } from "@/components/RiskStrip";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { howItWorksCopy as copy } from "@/content/howItWorks";
import { CTAS } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(copy.seo, "/how-it-works");

export default function HowItWorksPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.breadcrumb, path: "/how-it-works" }]} eyebrow={copy.eyebrow} title={copy.h1}>
        <p className="mt-6 max-w-3xl text-lg text-muted">{copy.intro}</p>
        <div className="mt-8">
          <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
        </div>
      </PageHero>

      <ProcessSection label={copy.process.label} title={copy.process.title} detailed />

      <Section label={copy.split.label} title={copy.split.title}>
        <div className="grid gap-5 md:grid-cols-2">
          {[copy.split.you, copy.split.us].map((column, index) => (
            <Reveal key={column.heading} delay={index * 80}>
              <div className={`surface-card h-full p-6 md:p-8 ${index === 1 ? "featured-card" : ""}`}>
                <h3 className="card-title">{column.heading}</h3>
                <CheckList items={column.items} className="mt-6 text-muted" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label={copy.tracking.label} title={copy.tracking.title} intro={copy.tracking.intro} glow="center">
        <div className="grid gap-5 md:grid-cols-3">
          {copy.tracking.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="surface-card h-full p-6 md:p-8">
                <p className="mono-label text-mist">0{index + 1}</p>
                <h3 className="card-title mt-5 text-lime">{item.title}</h3>
                <p className="mt-3 text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <ComparisonSection />
      <RiskStrip label={copy.risk.label} />
      <FaqSection page="how-it-works" label={copy.faq.label} title={copy.faq.title} />

      <Section label={copy.related.label} title={copy.related.title}>
        <ul className="border-t border-line">
          {copy.related.links.map((link) => (
            <li key={link.href} className="border-b border-line py-2">
              <TextLink href={link.href} className="w-full justify-between text-lg">{link.label}</TextLink>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={copy.cta.title} note={copy.cta.note} />
    </>
  );
}
