import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CheckList } from "@/components/CheckList";
import { Container } from "@/components/Container";
import { Glow } from "@/components/Glow";
import { Headline } from "@/components/Headline";
import { SectionLabel } from "@/components/SectionLabel";
import { VideoPlayer } from "@/components/VideoPlayer";
import { caseStudies } from "@/content/caseStudies";
import { confirmedCopy as copy, confirmedSeo } from "@/content/flow";
import { PRECALL_VIDEO } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(confirmedSeo, "/confirmed", { noindex: true });

export default function ConfirmedPage() {
  return (
    <div className="relative overflow-x-clip py-16 lg:py-24">
      <Glow className="left-1/2 top-0 w-[min(900px,130vw)] -translate-x-1/2" />
      <Container className="relative max-w-3xl">
        <SectionLabel className="mb-6">{copy.eyebrow}</SectionLabel>
        <Headline segments={copy.title} as="h1" size={1} />
        <div className="surface-card featured-card mt-10 p-6 md:p-8">
          <h2 className="card-title">{copy.nextTitle}</h2>
          <CheckList items={copy.next} className="mt-6 text-muted" />
          <p className="mt-6 border-l-2 border-lime pl-3.5 font-semibold leading-snug">{copy.calendarReminder}</p>
        </div>

        {PRECALL_VIDEO && (
          <div className="mt-14">
            <SectionLabel className="mb-4">{copy.videoEyebrow}</SectionLabel>
            <h2 className="card-title mb-6">{copy.videoTitle}</h2>
            <VideoPlayer video={PRECALL_VIDEO} />
          </div>
        )}

        <h2 className="card-title mt-14">{copy.resultsTitle}</h2>
        <ul className="mt-5 border-t border-line">
          {caseStudies.map((study) => (
            <li key={study.slug} className="border-b border-line">
              <Link href={`/case-studies/${study.slug}`} className="group flex min-h-14 items-center justify-between gap-4 py-4">
                <span>
                  <span className="block font-semibold">{study.company}</span>
                  <span className="block text-sm text-muted">{study.headlineMetric}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-lime transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
