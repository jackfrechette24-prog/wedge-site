import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { ComparisonSection } from "@/components/ComparisonSection";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { FaqSection } from "@/components/FaqSection";
import { FeatureCard } from "@/components/FeatureCard";
import { FloatingBadge } from "@/components/FloatingBadge";
import { Glow } from "@/components/Glow";
import { Headline } from "@/components/Headline";
import { ICONS } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PhotoFrame } from "@/components/PhotoFrame";
import { PillEyebrow } from "@/components/PillEyebrow";
import { ProcessSection } from "@/components/ProcessSection";
import { ResultsRow } from "@/components/ResultsRow";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { SimpleMarkdown } from "@/components/SimpleMarkdown";
import { StatCard } from "@/components/StatCard";
import { TextLink } from "@/components/TextLink";
import { TrustRow } from "@/components/TrustRow";
import { VideoSlot } from "@/components/VideoPlayer";
import { caseStudies } from "@/content/caseStudies";
import { homeCopy, homeSeo } from "@/content/home";
import { ACTIVE_HERO, CTAS, FOUNDER, HERO_BADGES, HERO_EYEBROW, HERO_SUBHEADLINE, HERO_VARIANTS, HOME_VSL } from "@/content/site";
import { homeProcess } from "@/content/timeline";
import { pageMetadata, videoJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata = pageMetadata(homeSeo, "/", { defaultImage: true });

export default function HomePage() {
  const video = videoJsonLd(HOME_VSL);
  return (
    <>
      <JsonLd data={video ? [websiteJsonLd(), video] : websiteJsonLd()} />

      <section className="relative overflow-x-clip pb-20 pt-10 lg:pb-32 lg:pt-20">
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-6">
              <PillEyebrow className="mb-6">{HERO_EYEBROW}</PillEyebrow>
              <Headline segments={HERO_VARIANTS[ACTIVE_HERO]} as="h1" size={1} />
              <SimpleMarkdown text={HERO_SUBHEADLINE} className="mt-6 text-lg text-muted" />
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
                <ButtonLink href={CTAS.heroSecondary.href} variant="secondary">{CTAS.heroSecondary.label}</ButtonLink>
              </div>
              <TrustRow items={[homeCopy.trustRow]} className="mt-6" />
            </div>
            <div className="relative min-w-0 lg:col-span-6">
              <Glow className="left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <VideoSlot video={HOME_VSL} priority />
                <FloatingBadge {...HERO_BADGES.top} className="-top-5 right-2 lg:-right-4 lg:-top-6" />
                <FloatingBadge {...HERO_BADGES.bottom} className="-bottom-5 right-2 lg:-bottom-6 lg:-right-4" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-x-clip py-20 lg:py-36">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <PhotoFrame src={FOUNDER.image} alt={FOUNDER.imageAlt} label={FOUNDER.photoLabel} className="aspect-[4/5] w-full" />
            </Reveal>
            <div className="min-w-0 lg:col-span-7">
              <Reveal>
                <SectionLabel className="mb-6">{FOUNDER.label}</SectionLabel>
                <Headline segments={FOUNDER.title} />
                <div className="mt-6 space-y-4 text-lg text-muted">
                  {FOUNDER.paragraphs.map((paragraph) => (
                    <SimpleMarkdown key={paragraph} text={paragraph} />
                  ))}
                </div>
              </Reveal>
              <div className="mt-8 grid gap-3 min-[480px]:grid-cols-3">
                {FOUNDER.stats.map((stat, index) => (
                  <Reveal key={stat.label} delay={index * 80}>
                    <StatCard value={stat.value} label={stat.label} className="h-full" />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section label={homeCopy.system.label} title={homeCopy.system.title} intro={homeCopy.system.intro} glow="center">
        <div className="grid gap-5 md:grid-cols-3">
          {homeCopy.system.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80}>
              <FeatureCard {...card} />
            </Reveal>
          ))}
        </div>
        <TextLink href="/how-it-works" className="mt-8">{homeCopy.system.link}</TextLink>
      </Section>

      <Section id="results" label={homeCopy.results.label} title={homeCopy.results.title} intro={homeCopy.results.intro}>
        <ResultsRow studies={caseStudies.filter((study) => study.featuredOnHome)} nextCard={homeCopy.results.nextCard} />
        <div className="mt-8">
          <ButtonLink href={CTAS.secondary.href} variant="secondary" arrow>{homeCopy.results.link}</ButtonLink>
        </div>
      </Section>

      <ProcessSection label={homeProcess.label} title={homeProcess.title} link={{ label: homeProcess.link, href: "/how-it-works" }} />

      <ComparisonSection />

      <Section label={homeCopy.niches.label} title={homeCopy.niches.title}>
        <div className="grid gap-5 md:grid-cols-2">
          {homeCopy.niches.cards.map((card, index) => {
            const Icon = ICONS[card.icon];
            return (
              <Reveal key={card.href} delay={index * 80} className="h-full">
                <Link href={card.href} className="surface-card surface-card-hover featured-card group flex h-full flex-col p-6 md:p-10">
                  <span className="icon-tile">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="card-title mt-7 !text-4xl md:!text-[2.75rem]">{card.title}</h3>
                  <p className="mt-4 text-muted">{card.body}</p>
                  <p className="mt-auto flex items-center gap-2 pt-8 font-semibold">
                    {card.linkLabel}
                    <ArrowRight className="size-4 shrink-0 text-lime transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <FaqSection id="faq" page="home" label={homeCopy.faq.label} title={homeCopy.faq.title} />
      <CtaBand title={homeCopy.finalCta.title} note={homeCopy.finalCta.note} />
    </>
  );
}
