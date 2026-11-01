import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/caseStudies";
import { CONTENT_UPDATED } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/window-treatment-marketing", priority: 0.9 },
  { path: "/retractable-screen-marketing", priority: 0.9 },
  { path: "/how-it-works", priority: 0.8 },
  { path: "/case-studies", priority: 0.8 },
  { path: "/apply", priority: 0.7 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(({ path, priority }) => ({ url: absoluteUrl(path), lastModified: CONTENT_UPDATED, priority })),
    ...caseStudies.map((study) => ({
      url: absoluteUrl(`/case-studies/${study.slug}`),
      lastModified: study.publishedAt,
      priority: 0.7,
    })),
  ];
}
