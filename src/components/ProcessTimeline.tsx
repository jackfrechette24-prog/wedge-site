import { processSteps } from "@/content/howItWorks";
import { Reveal } from "./Reveal";
import { WedgeMark } from "./WedgeMark";

/** Compact 5-step timeline: horizontal on desktop, vertical on mobile. */
export function ProcessTimeline() {
  return (
    <ol className="grid gap-0 lg:grid-cols-5 lg:gap-6">
      {processSteps.map((step, index) => (
        <li key={step.title} className="relative border-l border-line pb-10 pl-7 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-7">
          <WedgeMark className="absolute -left-[7px] top-0 size-3.5 lg:-top-[7px] lg:left-0" />
          <Reveal delay={index * 60}>
            <p className="font-mono text-xs font-medium tracking-[0.14em] text-muted">0{index + 1}</p>
            <h3 className="mt-3 text-xl leading-snug">{step.title}</h3>
            <p className="mt-3 text-[15px] text-muted">{step.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
