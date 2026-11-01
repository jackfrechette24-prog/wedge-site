"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/cn";
import { SimpleMarkdown } from "./SimpleMarkdown";
import { VideoPlayer } from "./VideoPlayer";

export function FAQAccordion({ items }: { items: Faq[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="border-t border-line">
      {items.map((faq, index) => {
        const isOpen = open === faq.id;
        const panelId = `${baseId}-${faq.id}`;
        return (
          <div key={faq.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : faq.id)}
                className="group flex min-h-12 w-full items-center gap-4 py-5 text-left md:gap-5"
              >
                <span className="font-mono text-xs font-medium text-lime" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg font-semibold leading-snug">{faq.question}</span>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isOpen ? "border-lime text-lime" : "border-line-strong text-bone group-hover:border-bone/40",
                  )}
                >
                  {isOpen ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                </span>
              </button>
            </h3>
            <div id={panelId} className="faq-panel" data-open={isOpen}>
              <div className="min-h-0 overflow-hidden">
                <div className="pb-6 pl-8 pr-2 text-muted md:pl-[2.35rem] md:pr-14">
                  <SimpleMarkdown text={faq.answer} />
                  {faq.video && isOpen && (
                    <div className="mt-5">
                      <VideoPlayer video={faq.video} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
