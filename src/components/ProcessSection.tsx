import { processSteps } from "@/content/howItWorks";
import type { Segments } from "@/content/types";
import { Container } from "./Container";
import { Glow } from "./Glow";
import { ProcessStep } from "./ProcessStep";
import { SectionHeading } from "./Section";
import { TextLink } from "./TextLink";
import { TimelinePanel } from "./TimelinePanel";

type Props = {
  label: string;
  title: Segments;
  detailed?: boolean;
  link?: { label: string; href: string };
};

/** The signature section: the 5 steps on the left, the timeline panel on the right. */
export function ProcessSection({ label, title, detailed, link }: Props) {
  return (
    <section className="relative overflow-x-clip py-20 lg:py-36">
      <Glow className="-right-1/4 top-1/4 w-[min(900px,130vw)]" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <SectionHeading label={label} title={title} className="mb-12" />
            <ol>
              {processSteps.map((step, index) => (
                <ProcessStep key={step.title} step={step} index={index} detailed={detailed} />
              ))}
            </ol>
            {link && <TextLink href={link.href} className="mt-4">{link.label}</TextLink>}
          </div>
          <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <TimelinePanel />
          </div>
        </div>
      </Container>
    </section>
  );
}
