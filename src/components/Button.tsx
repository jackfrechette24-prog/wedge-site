import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[15px] font-semibold transition duration-200";

const variants = {
  primary: "bg-lime text-obsidian hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgb(199_255_61/0.28)]",
  secondary: "border border-bone/15 text-bone hover:border-bone/40",
};

type Variant = keyof typeof variants;

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

function Arrow() {
  return <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />;
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", arrow, className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, cn("disabled:opacity-60", className))} {...props} />;
}
