import { cn } from "@/lib/cn";

/** A short lime line, then a mono label with the slash device. */
export function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("mono-label flex items-center gap-3 text-mist", className)}>
      <span className="w-6 shrink-0 border-t border-lime" aria-hidden="true" />
      <span>{"// "}{children}</span>
    </p>
  );
}
