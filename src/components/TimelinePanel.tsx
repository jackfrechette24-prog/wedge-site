import { TrendingUp } from "lucide-react";
import { timeline, type TimelineTone } from "@/content/timeline";
import { cn } from "@/lib/cn";

const STATUS_COLOR: Record<TimelineTone, string> = {
  done: "text-go",
  active: "text-lime",
  review: "text-amber",
};

export function TimelinePanel() {
  return (
    <div className="surface-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="mono-label flex items-center gap-2 text-go">
          <span className="pulse-dot size-2 rounded-full bg-go" aria-hidden="true" />
          {timeline.liveLabel}
        </p>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-mist">{timeline.note}</p>
      </div>
      <h3 className="card-title mt-5">{timeline.title}</h3>
      <ul className="mt-6 space-y-2">
        {timeline.rows.map((row) => (
          <li key={row.day} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-xl border border-line px-3.5 py-3 sm:grid-cols-[6.5rem_1fr_auto]">
            <span className="col-span-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-mist sm:col-span-1">{row.day}</span>
            <span className="text-sm leading-snug">{row.description}</span>
            <span className={cn("font-mono text-[10px] font-medium uppercase tracking-[0.12em]", STATUS_COLOR[row.tone])}>{row.status}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-lime/40 bg-lime/5 px-4 py-4">
        <div>
          <p className="mono-label text-lime">{timeline.outcome.label}</p>
          <p className="mt-1 font-display text-2xl font-bold uppercase leading-none">{timeline.outcome.title}</p>
        </div>
        <TrendingUp className="size-7 shrink-0 text-lime" aria-hidden="true" />
      </div>
    </div>
  );
}
