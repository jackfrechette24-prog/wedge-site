import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CompanyLogo, NicheTags } from "@/components/CaseStudyCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { CtaBand } from "@/components/CtaBand";
import { Eyebrow } from "@/components/Eyebrow";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { StatBlock } from "@/components/StatBlock";
import { VideoSlot } from "@/components/VideoPlayer";
import { WedgeList } from "@/components/WedgeMark";
import { caseStudies, getCaseStudy, nicheHref, STAT_LABELS, type CaseStudy } from "@/content/caseStudies";
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

      <section className="relative overflow-hidden border-b border-line pb-14 pt-8 md:pb-20 md:pt-10">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <Breadcrumbs
            items={[
              { name: caseStudiesCopy.breadcrumb, path: "/case-studies" },
              { name: study.company, path: `/case-studies/${study.slug}` },
            ]}
          />
          <div className="mt-10 max-w-4xl md:mt-16">
            <Eyebrow className="mb-5">{study.city}, {study.state}</Eyebrow>
            <h1 className="text-[2.5rem] text-accent sm:text-5xl md:text-[4rem]">{study.headlineMetric}</h1>
            <CompanyLogo study={study} className="mt-6 text-xl font-medium md:text-2xl" />
            {study.alsoKnownAs && (
              <p className="mt-1 text-muted">{copy.alsoKnownAsLabel} {study.alsoKnownAs}</p>
            )}
            {study.owner && (
              <p className="mt-1 text-muted">{copy.ownerLabel}: {study.owner}</p>
            )}
            <div className="mt-6">
              <NicheTags study={study} />
            </div>
          </div>
        </Container>
      </section>

      <Section className="!py-12 md:!py-16">
        <VideoSlot video={study.video} />
      </Section>

      <Section tone="light">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 className="text-3xl md:text-4xl">{copy.situation}</h2>
            <div className="mt-6 space-y-4 text-lg text-muted">
              {study.situation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-3xl md:text-4xl">{copy.whatWeDid}</h2>
            <WedgeList items={study.whatWeDid} className="mt-6 text-lg text-muted" />
          </Reveal>
        </div>
      </Section>

      {stats.length > 0 && (
        <Section title={copy.results}>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <StatBlock key={stat.key} value={stat.value} label={stat.label} className="bg-surface p-6 md:p-8" />
            ))}
          </div>
        </Section>
      )}

      {study.quote && (
        <Section tone="graphite">
          <Reveal>
            <Card className="border-0 bg-transparent p-0 md:p-0">
              <blockquote>
                <p className="max-w-4xl text-3xl font-medium leading-tight tracking-[-0.02em] md:text-5xl">{study.quote.text}</p>
                <footer className="mt-6 text-muted">{study.quote.name}, {study.quote.role}</footer>
              </blockquote>
            </Card>
          </Reveal>
        </Section>
      )}

      <Section tone="light" className="!py-12">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <Link href={nicheLink} className="inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-accent">
            {copy.nicheLinkLabel[study.niches.includes("interior") ? "interior" : "exterior"]}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/case-studies" className="inline-flex min-h-11 items-center gap-2 font-medium transition-colors hover:text-accent">
            {copy.backLink}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <CtaBand title={copy.ctaTitle} note={copy.ctaNote} />
    </>
  );
}
