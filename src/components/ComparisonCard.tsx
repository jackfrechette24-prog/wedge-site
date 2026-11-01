import { Check, Sparkles, X } from "lucide-react";
import { comparison } from "@/content/comparison";
import { cn } from "@/lib/cn";

export function ComparisonCard({ side, className }: { side: "them" | "us"; className?: string }) {
  const isUs = side === "us";
  const info = comparison[side];
  const TagIcon = isUs ? Sparkles : X;
  return (
    <div className={cn("surface-card p-6 md:p-8", isUs ? "featured-card !border-lime/40" : "", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className={cn("mono-label flex items-center gap-2", isUs ? "text-lime" : "text-stop")}>
          <TagIcon className="size-3.5" aria-hidden="true" />
          {info.tag}
        </p>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-mist">{info.standard}</p>
      </div>
      <h3 className="card-title mt-5">{info.name}</h3>
      <dl className="mt-6">
        {comparison.rows.map((row) => (
          <div key={row.label} className="border-t border-line py-4 last:pb-0">
            <dt className="mono-label text-mist">{row.label}</dt>
            <dd className="mt-1.5 flex items-start gap-2.5">
              {isUs && <Check className="mt-[0.2em] size-[18px] shrink-0 text-lime" aria-hidden="true" />}
              {isUs ? <span className="font-medium">{row.us}</span> : <s className="text-mist">{row[side]}</s>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
