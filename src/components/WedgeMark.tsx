import { cn } from "@/lib/cn";

/** The wedge: vertical edge on the right, hypotenuse rising left to right. Never flip or round it. */
export function WedgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("fill-accent", className)}>
      <polygon points="0,100 100,100 100,0" />
    </svg>
  );
}

export function WedgeList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <WedgeMark className="mt-[0.45em] size-2.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function WedgeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", className)} aria-hidden="true">
      <WedgeMark className="size-3" />
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}
