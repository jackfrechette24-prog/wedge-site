import type { ReactNode } from "react";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type Props = {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

export function PageHero({ crumbs, eyebrow, title, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line pb-16 pt-8 md:pb-24 md:pt-10">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-10 max-w-4xl md:mt-16">
          {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
          <h1 className="text-[2.5rem] sm:text-5xl md:text-[4rem]">{title}</h1>
          {children}
        </div>
      </Container>
    </section>
  );
}
