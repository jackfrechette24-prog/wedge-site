import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 py-3 text-[15px] font-medium transition-colors duration-200";

const variants = {
  primary: "bg-lime text-obsidian hover:bg-ink hover:text-surface",
  secondary: "border border-line text-ink hover:border-accent hover:text-accent",
};

type Variant = keyof typeof variants;

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
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
      {arrow && <ArrowRight className="size-4" aria-hidden="true" />}
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
