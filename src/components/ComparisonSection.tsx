import { comparison } from "@/content/comparison";
import { ComparisonCard } from "./ComparisonCard";
import { Glow } from "./Glow";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function ComparisonSection() {
  return (
    <Section label={comparison.label} title={comparison.title}>
      <div className="relative grid items-start gap-5 md:grid-cols-2">
        <Glow tone="stop" className="-left-[10%] top-0 hidden w-[60%] md:block" />
        <Glow className="-right-[10%] top-0 w-full md:w-[60%]" />
        <Reveal className="relative md:order-2">
          <ComparisonCard side="us" />
        </Reveal>
        <Reveal className="relative md:order-1" delay={80}>
          <ComparisonCard side="them" />
        </Reveal>
      </div>
    </Section>
  );
}
