import { caseStudiesForNiche } from "@/content/caseStudies";
import type { NichePage } from "@/content/nichePages";
import { homeCopy } from "@/content/home";
import { CTAS } from "@/content/site";
import { ButtonLink } from "./Button";
import { CtaBand } from "./CtaBand";
import { FaqSection } from "./FaqSection";
import { FeatureCard } from "./FeatureCard";
import { PageHero } from "./PageHero";
import { ProcessTimeline } from "./ProcessTimeline";
import { ResultsRow } from "./ResultsRow";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SimpleMarkdown } from "./SimpleMarkdown";
import { TextLink } from "./TextLink";
import { VideoCard } from "./VideoCard";
import { WedgeList } from "./WedgeMark";

type TextSectionData = NichePage["whyFail"];

function TextSection({ data, glow }: { data: TextSectionData; glow?: "left" | "right" }) {
  return (
    <Section split label={data.label} title={data.title} glow={glow}>
      <Reveal className="space-y-5 text-lg text-muted">
        {data.paragraphs.map((paragraph) => (
          <SimpleMarkdown key={paragraph} text={paragraph} />
        ))}
        {data.bullets && <WedgeList items={data.bullets} className="pt-1" />}
      </Reveal>
      {data.subsections && (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {data.subsections.map((sub, index) => (
            <Reveal key={sub.title} delay={index * 60} className="last:odd:sm:col-span-2">
              <FeatureCard title={sub.title} body={sub.body} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

export function NichePageTemplate({ page }: { page: NichePage }) {
  const studies = caseStudiesForNiche(page.niche);
  const featured = studies[0];
  return (
    <>
      <PageHero
        crumbs={[{ name: page.breadcrumb, path: page.path }]}
        eyebrow={page.eyebrow}
        title={page.h1}
        aside={featured && <VideoCard study={featured} headingAs="h2" />}
      >
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          {page.intro.map((paragraph) => (
            <SimpleMarkdown key={paragraph} text={paragraph} />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
          <ButtonLink href={CTAS.secondary.href} variant="secondary">{CTAS.secondary.label}</ButtonLink>
        </div>
      </PageHero>

      <TextSection data={page.whyFail} />
      <TextSection data={page.whatWeRun} glow="right" />
      <TextSection data={page.whoWeWorkWith} />
      <TextSection data={page.extra} glow="left" />

      <Section label={page.caseStudy.label} title={page.caseStudy.title} intro={page.caseStudy.intro}>
        <ResultsRow studies={studies} nextCard={homeCopy.results.nextCard} />
      </Section>

      <Section label={page.process.label} title={page.process.title} intro={page.process.intro} glow="center">
        <ProcessTimeline />
        <TextLink href="/how-it-works" className="mt-8">{page.process.link}</TextLink>
      </Section>

      <Section title={page.crossLink.title} intro={page.crossLink.body} actions={<ButtonLink href={page.crossLink.href} variant="secondary" arrow>{page.crossLink.label}</ButtonLink>} className="border-y border-line !py-16 lg:!py-20" />

      <FaqSection page={page.faqPage} label={page.faq.label} title={page.faq.title} />
      <CtaBand title={page.cta.title} note={page.cta.note} />
    </>
  );
}
