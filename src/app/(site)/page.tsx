import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { Eyebrow } from "@/components/Eyebrow";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { LogoBar } from "@/components/LogoBar";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/Reveal";
import { RiskStrip } from "@/components/RiskStrip";
import { Section } from "@/components/Section";
import { StatBlock } from "@/components/StatBlock";
import { VideoSlot } from "@/components/VideoPlayer";
import { WedgeMark } from "@/components/WedgeMark";
import { caseStudies } from "@/content/caseStudies";
import { homeCopy, homeSeo } from "@/content/home";
import { ACTIVE_HERO, CTAS, HERO_EYEBROW, HERO_SUBHEADLINE, HERO_VARIANTS, HOME_VSL, STATS } from "@/content/site";
import { pageMetadata, videoJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata(homeSeo, "/");

const TEXT_LINK = "mt-10 inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-accent";

export default function HomePage() {
  const video = videoJsonLd(HOME_VSL);
  return (
    <>
      <JsonLd data={video ? [websiteJsonLd(), video] : websiteJsonLd()} />

      <section className="relative overflow-hidden pb-14 pt-14 md:pb-20 md:pt-24">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <div className="max-w-5xl">
            <Eyebrow className="mb-6">{HERO_EYEBROW}</Eyebrow>
            <h1 className="text-[2.625rem] sm:text-6xl lg:text-[5.25rem] lg:leading-[1.02]">{HERO_VARIANTS[ACTIVE_HERO]}</h1>
            <p className="mt-6 max-w-3xl text-lg text-muted md:text-xl">{HERO_SUBHEADLINE}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
              <ButtonLink href={CTAS.secondary.href} variant="secondary">{CTAS.secondary.label}</ButtonLink>
            </div>
          </div>
          <div className="mt-12 md:mt-16">
            <VideoSlot video={HOME_VSL} priority />
          </div>
          <div className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-3 md:mt-16">
            {STATS.map((stat) => (
              <StatBlock key={stat.value} value={stat.value} label={stat.label} />
            ))}
          </div>
        </Container>
      </section>

      <LogoBar title={homeCopy.logoBar} />

      <Section tone="light" eyebrow={homeCopy.problem.eyebrow} title={homeCopy.problem.title} intro={homeCopy.problem.intro}>
        <div className="grid gap-6 md:grid-cols-2">
          {homeCopy.problem.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 60}>
              <Card className="h-full">
                <h3 className="text-xl leading-snug md:text-2xl">{card.title}</h3>
                <p className="mt-3 text-muted">{card.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 max-w-3xl text-xl font-medium leading-snug tracking-[-0.01em]">{homeCopy.problem.closing}</Reveal>
      </Section>

      <Section eyebrow={homeCopy.system.eyebrow} title={homeCopy.system.title} intro={homeCopy.system.intro}>
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {homeCopy.system.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80} className="bg-surface p-6 md:p-8">
              <WedgeMark className="size-5" />
              <h3 className="mt-8 text-2xl leading-snug">{pillar.title}</h3>
              <p className="mt-3 text-muted">{pillar.body}</p>
            </Reveal>
          ))}
        </div>
        <Link href="/how-it-works" className={TEXT_LINK}>
          {homeCopy.system.link}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <Section tone="graphite" eyebrow={homeCopy.process.eyebrow} title={homeCopy.process.title}>
        <ProcessTimeline />
        <Link href="/how-it-works" className={TEXT_LINK}>
          {homeCopy.process.link}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <Section title={homeCopy.niches.title}>
        <div className="grid gap-6 md:grid-cols-2">
          {homeCopy.niches.cards.map((card, index) => (
            <Reveal key={card.href} delay={index * 80} className="h-full">
              <Link href={card.href} className="group flex h-full flex-col rounded-sm border border-line bg-card p-6 transition-colors duration-200 hover:border-accent md:p-10">
                <Eyebrow>{card.label}</Eyebrow>
                <h3 className="mt-4 text-3xl md:text-4xl">{card.title}</h3>
                <p className="mt-4 text-muted">{card.body}</p>
                <p className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium">
                  {card.linkLabel}
                  <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" eyebrow={homeCopy.results.eyebrow} title={homeCopy.results.title}>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.filter((study) => study.featuredOnHome).map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
        <Link href="/case-studies" className={TEXT_LINK}>
          {homeCopy.results.link}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <RiskStrip eyebrow={homeCopy.risk.eyebrow} />
      <FaqSection id="faq" page="home" eyebrow={homeCopy.faq.eyebrow} title={homeCopy.faq.title} />
      <CtaBand title={homeCopy.finalCta.title} note={homeCopy.finalCta.note} />
    </>
  );
}
