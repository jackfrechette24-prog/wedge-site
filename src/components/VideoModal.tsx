"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Video } from "@/content/types";
import { VideoEmbed } from "./VideoPlayer";

type Props = { video: NonNullable<Video>; poster?: string | null; onClose: () => void };

/** Native dialog, so focus trapping, Escape, and returning focus are handled by the browser. */
export function VideoModal({ video, poster, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={video.title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[min(1100px,calc(100vw-2rem))] overflow-visible bg-transparent backdrop:bg-obsidian/90"
    >
      <button
        type="button"
        onClick={() => ref.current?.close()}
        aria-label="Close video"
        className="mb-3 ml-auto flex size-11 items-center justify-center rounded-full border border-line-strong text-bone transition-colors hover:border-lime"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line-strong bg-obsidian">
        <VideoEmbed video={video} poster={poster} />
      </div>
    </dialog>
  );
}
