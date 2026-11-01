import { RISK_REVERSAL } from "@/content/site";
import { CheckList } from "./CheckList";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";

export function RiskStrip({ label }: { label?: string }) {
  return (
    <section className="border-y border-line py-14 lg:py-20">
      <Container>
        {label && <SectionLabel className="mb-8">{label}</SectionLabel>}
        <CheckList items={RISK_REVERSAL} className="grid gap-6 text-lg font-semibold leading-snug md:grid-cols-3 md:space-y-0" />
      </Container>
    </section>
  );
}
