import type { Metadata } from "next";
import type { CaseStudy } from "@/content/caseStudies";
import type { Faq } from "@/content/faqs";
import { FOOTER, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/content/site";
import type { PageSeo, Video } from "@/content/types";

const TITLE_LIMIT = 60;
// Site-wide share image. An explicit image beats a page's own opengraph-image file, so only
// pages without one of those should ask for this.
const DEFAULT_OG_IMAGE = "/opengraph-image";

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

/** Full page title. Uses the long brand suffix when it fits, a short one when it doesn't. */
export function fullTitle(title: string) {
  const long = `${title} | ${SITE_NAME}`;
  return long.length < TITLE_LIMIT ? long : `${title} | Wedge`;
}

export function pageMetadata(seo: PageSeo, path: string, options?: { noindex?: boolean; defaultImage?: boolean }): Metadata {
  const title = fullTitle(seo.title);
  const images = options?.defaultImage ? { images: [DEFAULT_OG_IMAGE] } : {};
  return {
    title: { absolute: title },
    description: seo.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description: seo.description, url: absoluteUrl(path), siteName: SITE_NAME, type: "website", ...images },
    twitter: { card: "summary_large_image", title, description: seo.description, ...images },
    robots: options?.noindex ? { index: false, follow: false } : undefined,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/wedge_icon_dark.png"),
    image: absoluteUrl("/brand/wedge_icon_dark.png"),
    description: FOOTER.description,
    areaServed: { "@type": "Country", name: "United States" },
    address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" },
    sameAs: SOCIAL_LINKS.map((social) => social.href).filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

function plainText(markdown: string) {
  return markdown.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: plainText(faq.answer) },
    })),
  };
}

/** Returns null when there is no video, so no structured data is emitted for a placeholder. */
export function videoJsonLd(video: Video) {
  if (!video) return null;
  const isYouTube = video.provider === "youtube";
  const thumbnail = video.thumbnail || (isYouTube ? `https://i.ytimg.com/vi/${video.id_or_src}/hqdefault.jpg` : "");
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: thumbnail ? absoluteUrl(thumbnail) : undefined,
    uploadDate: video.uploadDate,
    ...(isYouTube
      ? { embedUrl: `https://www.youtube-nocookie.com/embed/${video.id_or_src}` }
      : { contentUrl: absoluteUrl(video.id_or_src) }),
  };
}

export function articleJsonLd(study: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${study.company}: ${study.headlineMetric}`,
    description: study.summary,
    datePublished: study.publishedAt,
    url: absoluteUrl(`/case-studies/${study.slug}`),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
