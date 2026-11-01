import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudiesForNiche } from "@/content/caseStudies";
import type { NichePage } from "@/content/nichePages";
import { CTAS } from "@/content/site";
import { ButtonLink } from "./Button";
import { Card } from "./Card";
import { CaseStudyCard } from "./CaseStudyCard";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { PageHero } from "./PageHero";
import { ProcessTimeline } from "./ProcessTimeline";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { WedgeList } from "./WedgeMark";

type TextSectionData = NichePage["whyFail"];

function TextSection({ data, tone }: { data: TextSectionData; tone: "dark" | "graphite" | "light" }) {
  return (
    <Section tone={tone} eyebrow={data.eyebrow} title={data.title}>
      <Reveal className="max-w-3xl space-y-5 text-lg text-muted">
        {data.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {data.bullets && <WedgeList items={data.bullets} className="pt-2" />}
      </Reveal>
      {data.subsections && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:[&:has(>:nth-child(3))]:grid-cols-3">
          {data.subsections.map((sub, index) => (
            <Reveal key={sub.title} delay={index * 60}>
              <Card className="h-full">
                <h3 className="text-xl leading-snug">{sub.title}</h3>
                <p className="mt-3 text-[15px] text-muted">{sub.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

export function NichePageTemplate({ page }: { page: NichePage }) {
  const studies = caseStudiesForNiche(page.niche);
  return (
    <>
      <PageHero crumbs={[{ name: page.breadcrumb, path: page.path }]} eyebrow={page.eyebrow} title={page.h1}>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted md:text-xl">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
          <ButtonLink href={CTAS.secondary.href} variant="secondary">{CTAS.secondary.label}</ButtonLink>
        </div>
      </PageHero>

      <TextSection data={page.whyFail} tone="light" />
      <TextSection data={page.whatWeRun} tone="dark" />
      <TextSection data={page.whoWeWorkWith} tone="graphite" />
      <TextSection data={page.extra} tone="dark" />

      <Section tone="light" eyebrow={page.caseStudy.eyebrow} title={page.caseStudy.title} intro={page.caseStudy.intro}>
        <div className="grid gap-6 md:grid-cols-2">
          {studies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </Section>

      <Section tone="dark" eyebrow={page.process.eyebrow} title={page.process.title} intro={page.process.intro}>
        <ProcessTimeline />
        <Link href="/how-it-works" className="mt-10 inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-accent">
          {page.process.link}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <section className="tone-graphite py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-5 md:px-8">
          <div>
            <h2 className="text-2xl">{page.crossLink.title}</h2>
            <p className="mt-2 text-muted">{page.crossLink.body}</p>
          </div>
          <ButtonLink href={page.crossLink.href} variant="secondary" arrow>{page.crossLink.label}</ButtonLink>
        </div>
      </section>

      <FaqSection page={page.faqPage} eyebrow={page.faq.eyebrow} title={page.faq.title} />
      <CtaBand title={page.cta.title} note={page.cta.note} />
    </>
  );
}
