import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBand } from "@/components/CtaBand";
import { FaqSection } from "@/components/FaqSection";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { RiskStrip } from "@/components/RiskStrip";
import { Section } from "@/components/Section";
import { WedgeList } from "@/components/WedgeMark";
import { howItWorksCopy as copy, processSteps } from "@/content/howItWorks";
import { CTAS } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(copy.seo, "/how-it-works");

export default function HowItWorksPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.breadcrumb, path: "/how-it-works" }]} eyebrow={copy.eyebrow} title={copy.h1}>
        <p className="mt-6 max-w-3xl text-lg text-muted md:text-xl">{copy.intro}</p>
        <div className="mt-8">
          <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
        </div>
      </PageHero>

      <Section tone="light" eyebrow={copy.stepsEyebrow} title={copy.stepsTitle}>
        <ol className="border-t border-line">
          {processSteps.map((step, index) => (
            <li key={step.title} className="border-b border-line py-8 md:py-10">
              <Reveal className="grid gap-4 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-sm font-medium tracking-[0.14em] text-muted md:col-span-1">0{index + 1}</p>
                <h3 className="text-2xl leading-snug md:col-span-4 md:text-3xl">{step.title}</h3>
                <div className="md:col-span-7">
                  <p className="text-lg font-medium leading-snug">{step.body}</p>
                  <p className="mt-3 text-muted">{step.detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow={copy.split.eyebrow} title={copy.split.title}>
        <div className="grid gap-6 md:grid-cols-2">
          {[copy.split.you, copy.split.us].map((column) => (
            <Reveal key={column.heading}>
              <Card className="h-full">
                <h3 className="text-2xl">{column.heading}</h3>
                <WedgeList items={column.items} className="mt-6 text-muted" />
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="graphite" eyebrow={copy.tracking.eyebrow} title={copy.tracking.title} intro={copy.tracking.intro}>
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {copy.tracking.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="bg-surface p-6 md:p-8">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-muted">0{index + 1}</p>
              <h3 className="mt-6 text-2xl text-accent md:text-3xl">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <RiskStrip />
      <FaqSection page="how-it-works" eyebrow={copy.faq.eyebrow} title={copy.faq.title} />

      <Section tone="light" title={copy.related.title}>
        <ul className="border-t border-line">
          {copy.related.links.map((link) => (
            <li key={link.href} className="border-b border-line">
              <Link href={link.href} className="flex min-h-14 items-center justify-between gap-4 py-4 text-lg font-medium transition-colors hover:text-accent">
                {link.label}
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={copy.cta.title} note={copy.cta.note} />
    </>
  );
}
