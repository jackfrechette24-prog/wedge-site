import { processSteps } from "@/content/howItWorks";
import { Reveal } from "./Reveal";

type Props = { step: (typeof processSteps)[number]; index: number; detailed?: boolean };

export function ProcessStep({ step, index, detailed }: Props) {
  return (
    <li className="border-t border-line py-8 first:border-t-0 first:pt-0 md:py-10">
      <Reveal className="grid grid-cols-[3.25rem_1fr] gap-x-4 md:grid-cols-[4.5rem_1fr] md:gap-x-5">
        <p className="font-display text-[3.25rem] font-bold leading-none text-lime/40 md:text-[4rem]" aria-hidden="true">
          0{index + 1}
        </p>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="card-title">{step.title}</h3>
            <span className="mono-pill">{step.timing}</span>
          </div>
          <p className="mt-4 text-muted">{detailed ? step.detail : step.body}</p>
          <p className="mt-4 border-l-2 border-lime pl-3.5 font-semibold leading-snug">{step.takeaway}</p>
        </div>
      </Reveal>
    </li>
  );
}
