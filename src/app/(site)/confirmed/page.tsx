import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { WedgeList } from "@/components/WedgeMark";
import { caseStudies } from "@/content/caseStudies";
import { confirmedCopy as copy, confirmedSeo } from "@/content/flow";
import { PRECALL_VIDEO } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(confirmedSeo, "/confirmed", { noindex: true });

export default function ConfirmedPage() {
  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <Eyebrow className="mb-5">{copy.eyebrow}</Eyebrow>
        <h1 className="text-5xl md:text-7xl">{copy.title}</h1>
        <h2 className="mt-12 text-2xl">{copy.nextTitle}</h2>
        <WedgeList items={copy.next} className="mt-6 text-lg text-muted" />
        <p className="mt-8 border-l-2 border-lime pl-4 text-muted">{copy.calendarReminder}</p>

        {PRECALL_VIDEO && (
          <div className="mt-14">
            <Eyebrow className="mb-3">{copy.videoEyebrow}</Eyebrow>
            <h2 className="mb-6 text-2xl">{copy.videoTitle}</h2>
            <VideoPlayer video={PRECALL_VIDEO} />
          </div>
        )}

        <h2 className="mt-14 text-2xl">{copy.resultsTitle}</h2>
        <ul className="mt-5 border-t border-line">
          {caseStudies.map((study) => (
            <li key={study.slug} className="border-b border-line">
              <Link href={`/case-studies/${study.slug}`} className="flex min-h-14 items-center justify-between gap-4 py-4 transition-colors hover:text-accent">
                <span>
                  <span className="block font-medium">{study.company}</span>
                  <span className="block text-sm text-muted">{study.headlineMetric}</span>
                </span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
