import { describe, expect, it } from "vitest";
import { contactSchema, disqualifiedSchema, leadSubmissionSchema } from "@/lib/leads/schema";

const contact = {
  firstName: " Jane ",
  lastName: "Doe",
  companyName: "Sunrise Shades",
  email: " Jane@Example.COM ",
  phone: "(415) 555-2671",
  website: "",
  consent: true,
};

const submission = {
  ...contact,
  clientSubmissionId: "8b3f0f3e-7c1a-4a55-9b3b-2d7f4f6a1c11",
  ownsCompany: true,
  annualRevenue: "500k_1m",
  willingToInvest3k: null,
  attribution: { utm_source: "facebook" },
};

describe("contactSchema", () => {
  it("trims names, lowercases email, and normalizes phone to E.164", () => {
    const result = contactSchema.parse(contact);
    expect(result.firstName).toBe("Jane");
    expect(result.email).toBe("jane@example.com");
    expect(result.phone).toBe("+14155552671");
    expect(result.website).toBeNull();
  });

  it("accepts a Canadian number", () => {
    expect(contactSchema.parse({ ...contact, phone: "416-555-2671" }).phone).toBe("+14165552671");
  });

  it.each(["12345", "+44 20 7946 0958", "not a phone", ""])("rejects phone %j", (phone) => {
    expect(contactSchema.safeParse({ ...contact, phone }).success).toBe(false);
  });

  it("rejects a bad email", () => {
    expect(contactSchema.safeParse({ ...contact, email: "jane@" }).success).toBe(false);
  });

  it("requires consent to be explicitly true", () => {
    expect(contactSchema.safeParse({ ...contact, consent: false }).success).toBe(false);
    expect(contactSchema.safeParse({ ...contact, consent: undefined }).success).toBe(false);
  });

  it("adds a scheme to a bare website and rejects junk", () => {
    expect(contactSchema.parse({ ...contact, website: "sunriseshades.com" }).website).toBe("https://sunriseshades.com");
    expect(contactSchema.safeParse({ ...contact, website: "not a site" }).success).toBe(false);
  });

  it("requires first, last, and company names", () => {
    for (const field of ["firstName", "lastName", "companyName"]) {
      expect(contactSchema.safeParse({ ...contact, [field]: "  " }).success).toBe(false);
    }
  });
});

describe("leadSubmissionSchema", () => {
  it("accepts a qualified submission", () => {
    expect(leadSubmissionSchema.safeParse(submission).success).toBe(true);
  });

  it("accepts under $300K only when willing to invest", () => {
    const low = { ...submission, annualRevenue: "under_300k" };
    expect(leadSubmissionSchema.safeParse({ ...low, willingToInvest3k: true }).success).toBe(true);
    expect(leadSubmissionSchema.safeParse({ ...low, willingToInvest3k: false }).success).toBe(false);
    expect(leadSubmissionSchema.safeParse({ ...low, willingToInvest3k: null }).success).toBe(false);
  });

  it("rejects non-owners and unknown revenue values", () => {
    expect(leadSubmissionSchema.safeParse({ ...submission, ownsCompany: false }).success).toBe(false);
    expect(leadSubmissionSchema.safeParse({ ...submission, annualRevenue: "lots" }).success).toBe(false);
  });

  it("never rejects a lead over bad tracking data", () => {
    const result = leadSubmissionSchema.parse({
      ...submission,
      attribution: { utm_source: 42, referrer: "x".repeat(5000), gclid: null },
    });
    expect(result.attribution.utm_source).toBeNull();
    expect(result.attribution.referrer).toHaveLength(2000);
    const missing = leadSubmissionSchema.parse({ ...submission, attribution: "junk" });
    expect(missing.attribution.fbclid).toBeNull();
  });
});

describe("disqualifiedSchema", () => {
  it("drops any extra fields, so personal data can't be stored", () => {
    const result = disqualifiedSchema.parse({ reason: "budget", annualRevenue: "under_300k", email: "a@b.co", attribution: {} });
    expect(result).not.toHaveProperty("email");
  });

  it("rejects unknown reasons", () => {
    expect(disqualifiedSchema.safeParse({ reason: "other", attribution: {} }).success).toBe(false);
  });
});
