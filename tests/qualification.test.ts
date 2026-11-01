import { describe, expect, it } from "vitest";
import { REVENUE_OPTIONS } from "@/content/flow";
import { afterQ1, afterQ2, afterQ3, evaluateQualification, previousStep } from "@/lib/qualification";

describe("Q1: owns a company", () => {
  it("yes goes to Q2", () => expect(afterQ1(true)).toEqual({ kind: "step", step: "q2" }));
  it("no is disqualified as not_owner", () => expect(afterQ1(false)).toEqual({ kind: "disqualified", reason: "not_owner" }));
});

describe("Q2: revenue", () => {
  it("under $300K goes to Q3", () => expect(afterQ2("under_300k")).toEqual({ kind: "step", step: "q3" }));
  it.each(REVENUE_OPTIONS.filter((option) => option.value !== "under_300k").map((option) => option.value))(
    "%s skips to contact",
    (revenue) => expect(afterQ2(revenue)).toEqual({ kind: "step", step: "contact" }),
  );
});

describe("Q3: willing to invest", () => {
  it("yes goes to contact", () => expect(afterQ3(true)).toEqual({ kind: "step", step: "contact" }));
  it("no is disqualified as budget", () => expect(afterQ3(false)).toEqual({ kind: "disqualified", reason: "budget" }));
});

describe("back button", () => {
  it("walks back along the path actually taken", () => {
    expect(previousStep("q1", {})).toBeNull();
    expect(previousStep("q2", {})).toBe("q1");
    expect(previousStep("q3", {})).toBe("q2");
    expect(previousStep("contact", { annualRevenue: "under_300k" })).toBe("q3");
    expect(previousStep("contact", { annualRevenue: "1m_2m" })).toBe("q2");
  });
});

describe("evaluateQualification", () => {
  it("qualifies every revenue band of $300K and up", () => {
    for (const annualRevenue of ["300k_500k", "500k_1m", "1m_2m", "2m_plus"] as const) {
      expect(evaluateQualification({ ownsCompany: true, annualRevenue })).toEqual({ qualified: true, path: "revenue_300k_plus" });
    }
  });

  it("qualifies under $300K only with the investment yes", () => {
    expect(evaluateQualification({ ownsCompany: true, annualRevenue: "under_300k", willingToInvest3k: true })).toEqual({
      qualified: true,
      path: "under_300k_will_invest",
    });
    expect(evaluateQualification({ ownsCompany: true, annualRevenue: "under_300k", willingToInvest3k: false }).qualified).toBe(false);
    expect(evaluateQualification({ ownsCompany: true, annualRevenue: "under_300k" }).qualified).toBe(false);
  });

  it("never qualifies a non-owner", () => {
    expect(evaluateQualification({ ownsCompany: false, annualRevenue: "2m_plus" }).qualified).toBe(false);
  });
});
