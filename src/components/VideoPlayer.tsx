"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Video } from "@/content/types";
import { WedgeMark } from "./WedgeMark";

const FRAME = "relative aspect-video w-full overflow-hidden rounded-sm border border-line bg-graphite";

export function VideoPlaceholder({ label = "Video coming soon" }: { label?: string }) {
  return (
    <div className={`tone-graphite ${FRAME} flex items-center justify-center`}>
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <WedgeMark className="absolute bottom-0 right-0 h-3/5 w-auto opacity-90 [fill:var(--color-obsidian)]" />
      <p className="relative font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-mist sm:text-xs">{label}</p>
    </div>
  );
}

function thumbnailFor(video: NonNullable<Video>) {
  if (video.thumbnail) return video.thumbnail;
  return video.provider === "youtube" ? `https://i.ytimg.com/vi/${video.id_or_src}/hqdefault.jpg` : null;
}

/** Shows a thumbnail and play button. The player only loads after a click. */
export function VideoPlayer({ video, priority }: { video: NonNullable<Video>; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = thumbnailFor(video);

  if (playing && video.provider === "youtube") {
    return (
      <div className={FRAME}>
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id_or_src)}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (playing) {
    return (
      <div className={FRAME}>
        <video className="absolute inset-0 size-full" src={video.id_or_src} controls autoPlay playsInline poster={thumbnail ?? undefined}>
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`${FRAME} group block cursor-pointer`} aria-label={`Play video: ${video.title}`}>
      {thumbnail && (
        <Image src={thumbnail} alt="" fill sizes="(min-width: 1152px) 1088px, 100vw" priority={priority} className="object-cover" />
      )}
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime text-obsidian transition-colors group-hover:bg-bone md:size-20">
        <Play className="ml-1 size-6 fill-current md:size-7" aria-hidden="true" />
      </span>
    </button>
  );
}

export function VideoSlot({ video, priority }: { video: Video; priority?: boolean }) {
  return video ? <VideoPlayer video={video} priority={priority} /> : <VideoPlaceholder />;
}
