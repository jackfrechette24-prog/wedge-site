import { CTAS, RISK_REVERSAL } from "@/content/site";
import type { Segments } from "@/content/types";
import { ButtonLink } from "./Button";
import { Container } from "./Container";
import { Glow } from "./Glow";
import { Headline } from "./Headline";
import { Reveal } from "./Reveal";
import { TrustRow } from "./TrustRow";

export function CtaBand({ title, note }: { title: Segments; note?: string }) {
  return (
    <section className="relative overflow-x-clip border-t border-line py-20 text-center lg:py-40">
      <Glow className="left-1/2 top-1/2 w-[min(1000px,140vw)] -translate-x-1/2 -translate-y-1/2" />
      <Container className="relative">
        <Reveal className="flex flex-col items-center">
          <Headline segments={title} />
          {note && <p className="mt-6 text-lg text-muted">{note}</p>}
          <div className="mt-8">
            <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
          </div>
          <TrustRow items={RISK_REVERSAL} className="mt-10 justify-center text-left" />
        </Reveal>
      </Container>
    </section>
  );
}
