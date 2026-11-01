import { processSteps } from "@/content/howItWorks";
import { Reveal } from "./Reveal";

/** A compact summary of the 5 steps, for the niche pages. */
export function ProcessTimeline() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={index * 60} className="surface-card h-full p-5">
            <p className="font-display text-4xl font-bold leading-none text-lime/40" aria-hidden="true">0{index + 1}</p>
            <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight">{step.title}</h3>
            <p className="mt-3 text-sm text-muted">{step.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
