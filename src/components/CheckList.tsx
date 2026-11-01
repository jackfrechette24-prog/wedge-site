import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function CheckList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <CircleCheck className="mt-[0.2em] size-[18px] shrink-0 text-lime" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
