import { cn } from "@/lib/cn";

/** A small stat card that overlaps a video frame. */
export function FloatingBadge({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn("absolute z-10 rounded-[14px] border border-line-strong bg-panel/95 px-3.5 py-2.5 shadow-[0_12px_40px_rgb(0_0_0/0.5)]", className)}>
      <p className="font-display text-2xl font-bold uppercase leading-none text-lime md:text-3xl">{value}</p>
      <p className="mt-1 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-mist sm:text-[10px]">{label}</p>
    </div>
  );
}
