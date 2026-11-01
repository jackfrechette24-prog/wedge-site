"use client";

import { useState } from "react";
import { caseStudies, type Niche } from "@/content/caseStudies";
import { caseStudiesCopy } from "@/content/results";
import { cn } from "@/lib/cn";
import { VideoCard } from "./VideoCard";

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
              "mono-pill min-h-11 px-5 transition-colors",
              filter === option ? "!border-lime !bg-lime !text-obsidian" : "hover:!border-lime hover:!text-bone",
            )}
          >
            {caseStudiesCopy.filters[option]}
          </button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {visible.map((study) => (
            <VideoCard key={study.slug} study={study} headingAs="h2" />
          ))}
        </div>
      ) : (
        <p className="text-muted">{caseStudiesCopy.empty}</p>
      )}
    </>
  );
}
