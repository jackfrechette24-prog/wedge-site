import type { ReactNode } from "react";
import type { Segments } from "@/content/types";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { Glow } from "./Glow";
import { Headline } from "./Headline";
import { PillEyebrow } from "./PillEyebrow";

type Props = {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: Segments;
  /** Shown on the right on desktop. */
  aside?: ReactNode;
  children?: ReactNode;
};

export function PageHero({ crumbs, eyebrow, title, aside, children }: Props) {
  return (
    <section className="relative overflow-x-clip border-b border-line pb-16 pt-6 lg:pb-24 lg:pt-8">
      <Glow className="-right-1/4 -top-1/4 w-[min(1000px,140vw)]" />
      <Container className="relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? "mt-10 grid items-center gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16" : "mt-10 max-w-4xl lg:mt-14"}>
          <div className={aside ? "min-w-0 lg:col-span-8" : undefined}>
            {eyebrow && <PillEyebrow className="mb-6">{eyebrow}</PillEyebrow>}
            <Headline segments={title} as="h1" size={1} />
            {children}
          </div>
          {aside && <div className="mx-auto w-full max-w-[300px] lg:col-span-4 lg:max-w-none">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
