import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="border-t border-line">{children}</div>;
}

export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-6 py-5 text-lg font-medium transition-colors hover:text-accent md:text-xl">
        <h3 className="text-[inherit] font-[inherit] leading-snug tracking-normal">{title}</h3>
        <Plus className="accordion-icon size-5 shrink-0 transition-transform duration-200" aria-hidden="true" />
      </summary>
      <div className="max-w-3xl pb-6 text-muted">{children}</div>
    </details>
  );
}
