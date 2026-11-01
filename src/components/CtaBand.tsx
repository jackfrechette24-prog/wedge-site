import { CTAS } from "@/content/site";
import { ButtonLink } from "./Button";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { WedgeMark } from "./WedgeMark";

export function CtaBand({ title, note }: { title: string; note?: string }) {
  return (
    <section className="tone-graphite relative overflow-hidden py-20 md:py-32">
      <WedgeMark decorative className="absolute bottom-0 right-0 h-full w-auto" />
      <Container className="relative">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl md:text-6xl">{title}</h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href={CTAS.primary.href} arrow>{CTAS.primary.label}</ButtonLink>
            {note && <p className="font-mono text-xs uppercase tracking-[0.14em] text-mist">{note}</p>}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
