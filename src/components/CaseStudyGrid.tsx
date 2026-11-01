"use client";

import { useState } from "react";
import { caseStudies, type Niche } from "@/content/caseStudies";
import { caseStudiesCopy } from "@/content/results";
import { cn } from "@/lib/cn";
import { CaseStudyCard } from "./CaseStudyCard";

type Filter = "all" | Niche;

const FILTERS: Filter[] = ["all", "interior", "exterior"];

export function CaseStudyGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = caseStudies.filter((study) => filter === "all" || study.niches.includes(filter));

  return (
    <>
      <div role="group" aria-label={caseStudiesCopy.filters.label} className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className={cn(
              "min-h-11 rounded-sm border px-4 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors",
              filter === option ? "border-lime bg-lime text-obsidian" : "border-line text-muted hover:border-accent hover:text-accent",
            )}
          >
            {caseStudiesCopy.filters[option]}
          </button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      ) : (
        <p className="text-muted">{caseStudiesCopy.empty}</p>
      )}
    </>
  );
}
