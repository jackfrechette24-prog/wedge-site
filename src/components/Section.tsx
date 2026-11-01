import type { ReactNode } from "react";
import type { Segments } from "@/content/types";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Glow } from "./Glow";
import { Headline } from "./Headline";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { SimpleMarkdown } from "./SimpleMarkdown";

const GLOW_POSITION = {
  center: "left-1/2 top-1/2 w-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2",
  left: "-left-1/4 top-0 w-[min(900px,130vw)]",
  right: "-right-1/4 top-0 w-[min(900px,130vw)]",
};

type Props = {
  id?: string;
  label?: string;
  title?: Segments;
  /** Supports **bold** and [links](/path). */
  intro?: string;
  actions?: ReactNode;
  glow?: keyof typeof GLOW_POSITION;
  /** Headline column on the left, content on the right. */
  split?: boolean;
  /** Keep the headline column in view while the content scrolls. Desktop only. */
  sticky?: boolean;
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({ label, title, intro, actions, className }: Pick<Props, "label" | "title" | "intro" | "actions" | "className">) {
  return (
    <Reveal className={className}>
      {label && <SectionLabel className="mb-6">{label}</SectionLabel>}
      {title && <Headline segments={title} />}
      {intro && <SimpleMarkdown text={intro} className="mt-6 text-lg text-muted" />}
      {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
    </Reveal>
  );
}

export function Section({ id, label, title, intro, actions, glow, split, sticky = true, className, children }: Props) {
  const hasHeading = Boolean(label || title || intro || actions);
  return (
    <section id={id} className={cn("relative overflow-x-clip py-20 lg:py-36", className)}>
      {glow && <Glow className={GLOW_POSITION[glow]} />}
      <Container className="relative">
        {split ? (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className={cn("lg:col-span-5", sticky && "lg:sticky lg:top-28 lg:self-start")}>
              <SectionHeading label={label} title={title} intro={intro} actions={actions} />
            </div>
            <div className="min-w-0 lg:col-span-7">{children}</div>
          </div>
        ) : (
          <>
            {hasHeading && <SectionHeading label={label} title={title} intro={intro} actions={actions} className="mb-12 max-w-4xl lg:mb-16" />}
            {children}
          </>
        )}
      </Container>
    </section>
  );
}
