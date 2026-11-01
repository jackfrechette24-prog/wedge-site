import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex min-h-11 items-center gap-2 font-semibold transition-colors hover:text-lime", className)}>
      {children}
      <ArrowRight className="size-4 shrink-0 text-lime transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
