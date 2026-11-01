import { cn } from "@/lib/cn";

export function TrustRow({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-[0.5em] size-2 shrink-0 rounded-full bg-go" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
