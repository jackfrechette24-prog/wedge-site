import { RISK_REVERSAL } from "@/content/site";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { WedgeMark } from "./WedgeMark";

export function RiskStrip({ eyebrow }: { eyebrow?: string }) {
  return (
    <section className="tone-dark border-y border-line py-14 md:py-20">
      <Container>
        {eyebrow && <Eyebrow className="mb-8">{eyebrow}</Eyebrow>}
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {RISK_REVERSAL.map((line, index) => (
            <Reveal key={line} delay={index * 80} className="flex gap-4">
              <WedgeMark className="mt-1.5 size-3.5 shrink-0" />
              <p className="text-xl font-medium leading-snug tracking-[-0.01em]">{line}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
