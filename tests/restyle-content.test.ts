import { describe, expect, it } from "vitest";
import { caseStudies } from "@/content/caseStudies";
import { comparison } from "@/content/comparison";
import { howItWorksCopy, processSteps } from "@/content/howItWorks";
import { exteriorPage, interiorPage } from "@/content/nichePages";
import { caseStudiesCopy } from "@/content/results";
import { FOUNDER, HERO_VARIANTS } from "@/content/site";
import { timeline } from "@/content/timeline";
import type { Segments } from "@/content/types";

const flat = (segments: Segments) => segments.map((segment) => segment.text).join(" ").toLowerCase();

describe("headlines keep their SEO wording", () => {
  it("niche H1s read as the full keyword phrase", () => {
    expect(flat(interiorPage.h1)).toBe("marketing for window treatment companies");
    expect(flat(exteriorPage.h1)).toBe("marketing for retractable and motorized screen companies");
  });
  it("how it works and case study H1s keep their keywords", () => {
    expect(flat(howItWorksCopy.h1)).toContain("window treatment lead generation process");
    expect(flat(caseStudiesCopy.h1)).toBe("results: window treatment and screen company case studies");
  });
});

describe("headline segments", () => {
  it("every hero variant has exactly one accent phrase", () => {
    for (const variant of Object.values(HERO_VARIANTS)) {
      expect(variant.filter((segment: Segments[number]) => segment.accent)).toHaveLength(1);
    }
  });
  it("every case study has a headline with an accent", () => {
    for (const study of caseStudies) {
      expect(study.headline.some((segment) => segment.accent)).toBe(true);
    }
  });
});

describe("structured content", () => {
  it("every process step has a timing pill and a takeaway", () => {
    expect(processSteps).toHaveLength(5);
    for (const step of processSteps) {
      expect(step.timing).toBeTruthy();
      expect(step.takeaway).toBeTruthy();
    }
  });
  it("the timeline is labeled as typical, not a promise", () => {
    expect(timeline.note).toBe("TYPICAL CLIENT TIMELINE");
    expect(timeline.rows).toHaveLength(7);
  });
  it("comparison rows have both sides", () => {
    expect(comparison.rows).toHaveLength(6);
    for (const row of comparison.rows) {
      expect(row.them && row.us).toBeTruthy();
    }
  });
  it("founder stats are editable strings", () => {
    expect(FOUNDER.stats.map((stat) => stat.label)).toEqual(["ACTIVE CLIENTS", "NICHES ONLY", "MARKETS SERVED"]);
  });
});
