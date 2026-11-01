import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckList } from "@/components/CheckList";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { FloatingBadge } from "@/components/FloatingBadge";
import { Glow } from "@/components/Glow";
import { Headline } from "@/components/Headline";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { SectionLabel } from "@/components/SectionLabel";
import { StatCard } from "@/components/StatCard";
import { TextLink } from "@/components/TextLink";
import { VideoSlot } from "@/components/VideoPlayer";
import { caseStudies, getCaseStudy, NICHE_LABELS, nicheHref, STAT_LABELS, type CaseStudy } from "@/content/caseStudies";
import { caseStudiesCopy, caseStudyTemplateCopy as copy } from "@/content/results";
import { articleJsonLd, pageMetadata, videoJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata(
    { title: `${study.company} Case Study`, description: study.summary },
    `/case-studies/${study.slug}`,
  );
}

function populatedStats(study: CaseStudy) {
  return (Object.keys(STAT_LABELS) as (keyof CaseStudy["stats"])[]).flatMap((key) => {
    const value = study.stats[key];
    return value ? [{ key, value, label: STAT_LABELS[key] }] : [];
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const video = videoJsonLd(study.video);
  const stats = populatedStats(study);
  const nicheLink = nicheHref(study);

  return (
    <>
      <JsonLd data={video ? [articleJsonLd(study), video] : articleJsonLd(study)} />

      <section className="relative overflow-x-clip border-b border-line pb-20 pt-6 lg:pb-28 lg:pt-8">
        <Container className="relative">
          <Breadcrumbs
            items={[
              { name: caseStudiesCopy.breadcrumb, path: "/case-studies" },
              { name: study.company, path: `/case-studies/${study.slug}` },
            ]}
          />
          <div className="mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-5">
              <p className="mono-label mb-5 text-mist">{study.city}, {study.state}</p>
              <Headline segments={study.headline} as="h1" size={1} />
              {study.logo ? (
                <Image src={study.logo} alt={`${study.company} ${caseStudiesCopy.logoAlt}`} width={160} height={48} className="mt-6 h-10 w-auto object-contain" />
              ) : (
                <p className="mt-6 text-xl font-semibold">{study.company}</p>
              )}
              {study.alsoKnownAs && <p className="mt-1 text-muted">{copy.alsoKnownAsLabel} {study.alsoKnownAs}</p>}
              {study.owner && <p className="mt-1 text-muted">{copy.ownerLabel}: {study.owner}</p>}
              <ul className="mt-6 flex flex-wrap gap-2">
                {study.niches.map((niche) => (
                  <li key={niche} className="mono-pill">{NICHE_LABELS[niche]}</li>
                ))}
              </ul>
            </div>
            <div className="relative min-w-0 lg:col-span-7">
              <Glow className="left-1/2 top-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <VideoSlot video={study.video} />
                {study.stats.revenue && (
                  <FloatingBadge
                    value={study.stats.revenue}
                    label={study.stats.timeframe ?? STAT_LABELS.revenue}
                    className="-bottom-5 right-2 lg:-bottom-6 lg:-right-4"
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionLabel className="mb-6">{copy.situation.label}</SectionLabel>
            <h2 className="headline headline-3">{copy.situation.title}</h2>
            <div className="mt-6 space-y-4 text-lg text-muted">
              {study.situation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionLabel className="mb-6">{copy.whatWeDid.label}</SectionLabel>
            <h2 className="headline headline-3">{copy.whatWeDid.title}</h2>
            <CheckList items={study.whatWeDid} className="mt-6 text-lg text-muted" />
          </Reveal>
        </div>
      </Section>

      {stats.length > 0 && (
        <Section label={copy.results.label} title={copy.results.title} glow="center" className="!pt-0">
          <div className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Reveal key={stat.key} delay={index * 60}>
                <StatCard value={stat.value} label={stat.label} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {study.quote && (
        <Section label={copy.quoteLabel} className="!pt-0">
          <Reveal>
            <blockquote>
              <p className="max-w-4xl font-accent text-4xl italic leading-[1.1] md:text-6xl">{study.quote.text}</p>
              <footer className="mt-6 text-muted">{study.quote.name}, {study.quote.role}</footer>
            </blockquote>
          </Reveal>
        </Section>
      )}

      <section className="border-t border-line py-8">
        <Container className="flex flex-wrap gap-x-8 gap-y-2">
          <TextLink href={nicheLink}>{copy.nicheLinkLabel[study.niches.includes("interior") ? "interior" : "exterior"]}</TextLink>
          <TextLink href="/case-studies">{copy.backLink}</TextLink>
        </Container>
      </section>

      <CtaBand title={copy.ctaTitle} note={copy.ctaNote} />
    </>
  );
}
