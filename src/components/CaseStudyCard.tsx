import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NICHE_LABELS, type CaseStudy } from "@/content/caseStudies";
import { caseStudiesCopy } from "@/content/results";
import { WedgeMark } from "./WedgeMark";

export function NicheTags({ study }: { study: CaseStudy }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {study.niches.map((niche) => (
        <li key={niche} className="rounded-sm border border-line px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          {NICHE_LABELS[niche]}
        </li>
      ))}
    </ul>
  );
}

export function CompanyLogo({ study, className }: { study: CaseStudy; className?: string }) {
  if (!study.logo) return <p className={className ?? "font-medium"}>{study.company}</p>;
  return (
    <Image
      src={study.logo}
      alt={`${study.company} ${caseStudiesCopy.logoAlt}`}
      width={160}
      height={48}
      className="h-10 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0"
    />
  );
}

function cardThumbnail(study: CaseStudy) {
  if (!study.video) return null;
  if (study.video.thumbnail) return study.video.thumbnail;
  return study.video.provider === "youtube" ? `https://i.ytimg.com/vi/${study.video.id_or_src}/hqdefault.jpg` : null;
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const thumbnail = cardThumbnail(study);
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex h-full flex-col rounded-sm border border-line bg-card transition-colors duration-200 hover:border-accent"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-sm border-b border-line bg-graphite">
        {thumbnail ? (
          <Image src={thumbnail} alt={`${study.company} case study video`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        ) : (
          <WedgeMark decorative className="absolute bottom-0 right-0 h-4/5 w-auto" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <CompanyLogo study={study} />
        <p className="mt-1 text-sm text-muted">{study.city}, {study.state}</p>
        <p className="mt-6 text-3xl font-medium leading-tight tracking-[-0.02em] text-accent md:text-4xl">{study.headlineMetric}</p>
        <div className="mt-6">
          <NicheTags study={study} />
        </div>
        <p className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium">
          {caseStudiesCopy.cardLink}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </Link>
  );
}
