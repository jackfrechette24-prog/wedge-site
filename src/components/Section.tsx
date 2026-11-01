import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

type Props = {
  tone?: "dark" | "graphite" | "light";
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Section({ tone = "dark", id, eyebrow, title, intro, children, className }: Props) {
  return (
    <section id={id} className={cn(`tone-${tone}`, "py-20 md:py-28", className)}>
      <Container>
        {(eyebrow || title || intro) && (
          <Reveal className="mb-12 max-w-3xl md:mb-16">
            {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
            {title && <h2 className="text-[2rem] sm:text-4xl md:text-5xl">{title}</h2>}
            {intro && <div className="mt-5 text-lg text-muted">{intro}</div>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
