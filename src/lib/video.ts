import type { Video } from "@/content/types";

export function videoThumbnail(video: Video) {
  if (!video) return null;
  if (video.thumbnail) return video.thumbnail;
  return video.provider === "youtube" ? `https://i.ytimg.com/vi/${video.id_or_src}/hqdefault.jpg` : null;
}
