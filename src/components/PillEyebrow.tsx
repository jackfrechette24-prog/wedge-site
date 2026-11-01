import { cn } from "@/lib/cn";

export function PillEyebrow({ children, className }: { children: string; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-lime/30 bg-lime/5 px-3.5 py-1.5 font-mono text-[9px] font-medium uppercase leading-4 tracking-[0.09em] text-bone min-[400px]:text-[10px] sm:text-[11px] sm:tracking-[0.2em]",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
      {children}
    </p>
  );
}
