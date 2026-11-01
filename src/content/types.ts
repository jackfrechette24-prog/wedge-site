export type Video = {
  provider: "youtube" | "mp4";
  /** YouTube video ID, or the path/URL of an MP4 file. */
  id_or_src: string;
  title: string;
  description: string;
  /** Image path/URL. Leave empty for YouTube to use the video's own thumbnail. */
  thumbnail: string;
  /** ISO date, e.g. "2026-11-01". Required for search engines to show the video. */
  uploadDate: string;
} | null;

export type PageSeo = {
  /** Page title, without the brand suffix. */
  title: string;
  /** Under 155 characters. */
  description: string;
};

export type TitledText = { title: string; body: string };
