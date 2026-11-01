import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] font-medium uppercase leading-5 tracking-[0.18em] text-muted sm:text-xs", className)}>
      {children}
    </p>
  );
}
