"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Video } from "@/content/types";
import { videoThumbnail } from "@/lib/video";

const FRAME = "relative aspect-video w-full overflow-hidden rounded-[24px] border border-line-strong bg-panel";

function PlayMark() {
  return (
    <span className="flex size-16 items-center justify-center rounded-2xl bg-lime text-obsidian shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] transition-transform duration-200 group-hover:scale-105 md:size-[72px]">
      <Play className="ml-0.5 size-6 fill-current md:size-7" aria-hidden="true" />
    </span>
  );
}

export function VideoPlaceholder({ label = "Video coming soon" }: { label?: string }) {
  return (
    <div className={`${FRAME} placeholder-frame flex flex-col items-center justify-center gap-4`}>
      <PlayMark />
      <p className="mono-label text-mist">{label}</p>
    </div>
  );
}

/** The player itself, for once a visitor has asked to watch. */
export function VideoEmbed({ video, poster }: { video: NonNullable<Video>; poster?: string | null }) {
  if (video.provider === "youtube") {
    return (
      <iframe
        className="absolute inset-0 size-full"
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id_or_src)}?autoplay=1&rel=0`}
        title={video.title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video className="absolute inset-0 size-full" src={video.id_or_src} controls autoPlay playsInline poster={poster ?? undefined}>
      <track kind="captions" />
    </video>
  );
}

/** Shows a thumbnail and play button. The player only loads after a click. */
export function VideoPlayer({ video, priority }: { video: NonNullable<Video>; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = videoThumbnail(video);

  if (playing) {
    return (
      <div className={FRAME}>
        <VideoEmbed video={video} poster={thumbnail} />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`${FRAME} group block cursor-pointer`} aria-label={`Play video: ${video.title}`}>
      {thumbnail && (
        <Image src={thumbnail} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" priority={priority} className="object-cover" />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <PlayMark />
      </span>
    </button>
  );
}

export function VideoSlot({ video, priority }: { video: Video; priority?: boolean }) {
  return video ? <VideoPlayer video={video} priority={priority} /> : <VideoPlaceholder />;
}
