// Shared by the form (field errors) and the API (real validation).
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import { VALIDATION_MESSAGES as messages } from "@/content/flow";
import { REVENUE_VALUES } from "@/db/schema";
import { evaluateQualification } from "@/lib/qualification";

export const HONEYPOT_FIELD = "hp_confirm_field";
export const MIN_ELAPSED_MS = 3000;

const name = (message: string) => z.string().trim().min(1, message).max(120, message);

const phone = z.string().transform((value, ctx) => {
  const parsed = parsePhoneNumberFromString(value, "US");
  if (!parsed || !parsed.isValid() || (parsed.country !== "US" && parsed.country !== "CA")) {
    ctx.addIssue({ code: "custom", message: messages.phone });
    return z.NEVER;
  }
  return parsed.number as string;
});

const website = z
  .string()
  .trim()
  .max(300, messages.website)
  .transform((value, ctx) => {
    if (!value) return null;
    const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      if (new URL(url).hostname.includes(".")) return url;
    } catch {
      // Falls through to the validation error.
    }
    ctx.addIssue({ code: "custom", message: messages.website });
    return z.NEVER;
  });

export const contactSchema = z.object({
  firstName: name(messages.firstName),
  lastName: name(messages.lastName),
  companyName: name(messages.companyName),
  email: z.string().trim().toLowerCase().pipe(z.email(messages.email)),
  phone,
  website: website.optional().transform((value) => value ?? null),
  consent: z.literal(true, messages.consent),
});

// Tracking data must never be the reason a lead gets rejected, so bad values become null.
const tracked = (max: number) =>
  z
    .string()
    .transform((value) => value.slice(0, max) || null)
    .nullable()
    .optional()
    .catch(null)
    .transform((value) => value ?? null);

export const attributionSchema = z
  .object({
    utm_source: tracked(300),
    utm_medium: tracked(300),
    utm_campaign: tracked(300),
    utm_content: tracked(300),
    utm_term: tracked(300),
    fbclid: tracked(500),
    gclid: tracked(500),
    page_url: tracked(2000),
    referrer: tracked(2000),
  })
  .catch({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    fbclid: null,
    gclid: null,
    page_url: null,
    referrer: null,
  });

export const leadSubmissionSchema = contactSchema
  .extend({
    clientSubmissionId: z.uuid(),
    ownsCompany: z.literal(true),
    annualRevenue: z.enum(REVENUE_VALUES),
    willingToInvest3k: z.boolean().nullable().optional().transform((value) => value ?? null),
    attribution: attributionSchema,
  })
  .refine(
    (input) =>
      evaluateQualification({
        ownsCompany: input.ownsCompany,
        annualRevenue: input.annualRevenue,
        willingToInvest3k: input.willingToInvest3k ?? undefined,
      }).qualified,
    { message: "Answers do not qualify", path: ["annualRevenue"] },
  );

export type LeadSubmission = z.output<typeof leadSubmissionSchema>;

export const disqualifiedSchema = z.object({
  reason: z.enum(["not_owner", "budget"]),
  annualRevenue: z.enum(REVENUE_VALUES).nullable().optional().catch(null),
  attribution: attributionSchema,
});
