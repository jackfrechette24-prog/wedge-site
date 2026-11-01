"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Play } from "lucide-react";
import { NICHE_LABELS, type CaseStudy } from "@/content/caseStudies";
import { caseStudiesCopy } from "@/content/results";
import { cn } from "@/lib/cn";
import { videoThumbnail } from "@/lib/video";
import { VideoModal } from "./VideoModal";
import { WedgeMark } from "./WedgeMark";

/** A tall case study card. The name links to the case study, and the play button opens the video. */
export function VideoCard({ study, headingAs: Heading = "h3", className }: { study: CaseStudy; headingAs?: "h2" | "h3"; className?: string }) {
  const [open, setOpen] = useState(false);
  const poster = study.poster ?? videoThumbnail(study.video);

  return (
    <article className={cn("surface-card surface-card-hover group relative aspect-[9/16] w-full", className)}>
      {poster ? (
        <Image src={poster} alt="" fill sizes="(min-width: 1024px) 270px, 72vw" className="object-cover" />
      ) : (
        <div className="placeholder-frame absolute inset-0 flex items-center justify-center p-6 text-center">
          <WedgeMark className="absolute bottom-0 right-0 w-3/5 opacity-[0.07]" />
          {study.logo ? (
            <Image src={study.logo} alt={`${study.company} ${caseStudiesCopy.logoAlt}`} width={160} height={48} className="relative h-10 w-auto object-contain" />
          ) : (
            <p className="relative font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-mist">
              {study.video ? study.company : caseStudiesCopy.noVideo}
            </p>
          )}
        </div>
      )}

      {study.video && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${caseStudiesCopy.playLabel}: ${study.company}`}
          className="absolute left-1/2 top-[40%] z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-lime text-obsidian shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] transition-transform duration-200 hover:scale-105"
        >
          <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-obsidian/90 p-4">
        <Heading className="text-sm font-semibold leading-snug">
          <Link href={`/case-studies/${study.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {study.company}
          </Link>
        </Heading>
        <p className="text-xs text-muted">{study.city}, {study.state}</p>
        <p className="mt-2 font-display text-2xl font-bold uppercase leading-[1.02] text-lime">{study.headlineMetric}</p>
        <p className="sr-only">{study.niches.map((niche) => NICHE_LABELS[niche]).join(", ")}</p>
      </div>

      {open && study.video && <VideoModal video={study.video} poster={poster} onClose={() => setOpen(false)} />}
    </article>
  );
}
