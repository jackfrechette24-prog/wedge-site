import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/caseStudies";
import { applySeo, bookSeo, confirmedSeo, notAFitSeo } from "@/content/flow";
import { homeSeo } from "@/content/home";
import { howItWorksSeo } from "@/content/howItWorks";
import { privacySeo, termsSeo } from "@/content/legal";
import { exteriorPage, interiorPage } from "@/content/nichePages";
import { caseStudiesSeo } from "@/content/results";
import { faqJsonLd, fullTitle, organizationJsonLd, pageMetadata, videoJsonLd } from "@/lib/seo";

const pages = {
  home: homeSeo,
  howItWorks: howItWorksSeo,
  interior: interiorPage.seo,
  exterior: exteriorPage.seo,
  caseStudies: caseStudiesSeo,
  apply: applySeo,
  book: bookSeo,
  confirmed: confirmedSeo,
  notAFit: notAFitSeo,
  privacy: privacySeo,
  terms: termsSeo,
  ...Object.fromEntries(caseStudies.map((study) => [study.slug, { title: `${study.company} Case Study`, description: study.summary }])),
};

describe("page metadata", () => {
  it.each(Object.entries(pages))("%s has a title under 60 and a description under 155", (_name, seo) => {
    expect(fullTitle(seo.title).length).toBeLessThan(60);
    expect(seo.description.length).toBeLessThan(155);
    expect(seo.description.length).toBeGreaterThan(30);
  });

  it("every title and description is unique", () => {
    const seos = Object.values(pages);
    expect(new Set(seos.map((seo) => seo.title)).size).toBe(seos.length);
    expect(new Set(seos.map((seo) => seo.description)).size).toBe(seos.length);
  });

  it("noindex is applied when asked for", () => {
    expect(pageMetadata(bookSeo, "/book", { noindex: true }).robots).toEqual({ index: false, follow: false });
    expect(pageMetadata(homeSeo, "/").robots).toBeUndefined();
  });
});

describe("structured data", () => {
  it("has no street address and serves the United States", () => {
    const org = organizationJsonLd();
    expect(org.address).toEqual({ "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" });
    expect(org.areaServed.name).toBe("United States");
  });

  it("emits no video data for a placeholder", () => {
    expect(videoJsonLd(null)).toBeNull();
  });

  it("emits complete video data for a YouTube video", () => {
    const data = videoJsonLd({ provider: "youtube", id_or_src: "abc123", title: "T", description: "D", thumbnail: "", uploadDate: "2026-11-01" });
    expect(data).toMatchObject({
      name: "T",
      description: "D",
      uploadDate: "2026-11-01",
      thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      embedUrl: "https://www.youtube-nocookie.com/embed/abc123",
    });
  });

  it("strips markdown from FAQ answers", () => {
    const data = faqJsonLd([{ id: "x", question: "Q?", answer: "**Yes.** See [results](/case-studies).", video: null, pages: ["home"] }]);
    expect(data.mainEntity[0]?.acceptedAnswer.text).toBe("Yes. See results.");
  });
});
