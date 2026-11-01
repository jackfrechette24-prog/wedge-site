import { Fragment } from "react";
import type { Segments } from "@/content/types";
import { cn } from "@/lib/cn";

type Props = {
  segments: Segments;
  as?: "h1" | "h2" | "h3";
  size?: 1 | 2 | 3;
  className?: string;
};

/** One semantic heading. Each segment sits on its own line, and accent segments use .accent-text. */
export function Headline({ segments, as: Tag = "h2", size = 2, className }: Props) {
  return (
    <Tag className={cn("headline", `headline-${size}`, className)}>
      {segments.map((segment, index) => (
        <Fragment key={segment.text}>
          {index > 0 && " "}
          <span className="block">
            {segment.accent ? <span className="accent-text">{segment.text}</span> : segment.text}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
