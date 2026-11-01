import type { ReactNode } from "react";
import type { IconName } from "@/content/types";
import { cn } from "@/lib/cn";
import { CheckList } from "./CheckList";
import { ICONS } from "./icons";

type Props = {
  icon?: IconName;
  tag?: string;
  title: string;
  promise?: string;
  body?: string;
  bullets?: readonly string[];
  featured?: boolean;
  className?: string;
  children?: ReactNode;
};

export function FeatureCard({ icon, tag, title, promise, body, bullets, featured = true, className, children }: Props) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <div className={cn("surface-card surface-card-hover flex h-full flex-col p-6 md:p-8", featured && "featured-card", className)}>
      {(Icon || tag) && (
        <div className="mb-7 flex items-center justify-between gap-4">
          {Icon && (
            <span className="icon-tile">
              <Icon className="size-6" aria-hidden="true" />
            </span>
          )}
          {tag && <span className="mono-pill">{tag}</span>}
        </div>
      )}
      <h3 className="card-title">{title}</h3>
      {promise && <p className="mt-4 font-semibold leading-snug">{promise}</p>}
      {body && <p className="mt-3 text-[15px] text-muted">{body}</p>}
      {bullets && <CheckList items={bullets} className="mt-6 border-t border-line pt-6 text-[15px]" />}
      {children}
    </div>
  );
}
