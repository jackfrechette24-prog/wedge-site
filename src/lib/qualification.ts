import type { REVENUE_OPTIONS } from "@/content/flow";

export type Revenue = (typeof REVENUE_OPTIONS)[number]["value"];
export type FlowStep = "q1" | "q2" | "q3" | "contact";
export type DisqualifyReason = "not_owner" | "budget";
export type Route = { kind: "step"; step: FlowStep } | { kind: "disqualified"; reason: DisqualifyReason };

export type Answers = {
  ownsCompany?: boolean;
  annualRevenue?: Revenue;
  willingToInvest3k?: boolean;
};

export function afterQ1(ownsCompany: boolean): Route {
  return ownsCompany ? { kind: "step", step: "q2" } : { kind: "disqualified", reason: "not_owner" };
}

export function afterQ2(revenue: Revenue): Route {
  return { kind: "step", step: revenue === "under_300k" ? "q3" : "contact" };
}

export function afterQ3(willing: boolean): Route {
  return willing ? { kind: "step", step: "contact" } : { kind: "disqualified", reason: "budget" };
}

export function previousStep(step: FlowStep, answers: Answers): FlowStep | null {
  if (step === "q2") return "q1";
  if (step === "q3") return "q2";
  if (step === "contact") return answers.annualRevenue === "under_300k" ? "q3" : "q2";
  return null;
}

const PROGRESS: Record<FlowStep, number> = { q1: 10, q2: 40, q3: 65, contact: 90 };

export function progressFor(step: FlowStep) {
  return PROGRESS[step];
}

const STEP_NUMBER: Record<FlowStep, number> = { q1: 1, q2: 2, q3: 3, contact: 4 };
export const TOTAL_STEPS = 4;

export function stepNumberFor(step: FlowStep) {
  return STEP_NUMBER[step];
}

export type Qualification = { qualified: boolean; path: string };

/** The server's own verdict on the answers. Never trust the client's. */
export function evaluateQualification(answers: Answers): Qualification {
  if (!answers.ownsCompany) return { qualified: false, path: "not_owner" };
  if (!answers.annualRevenue) return { qualified: false, path: "incomplete" };
  if (answers.annualRevenue !== "under_300k") return { qualified: true, path: "revenue_300k_plus" };
  return answers.willingToInvest3k
    ? { qualified: true, path: "under_300k_will_invest" }
    : { qualified: false, path: "budget" };
}
