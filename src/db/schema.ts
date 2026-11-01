import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const REVENUE_VALUES = ["under_300k", "300k_500k", "500k_1m", "1m_2m", "2m_plus"] as const;

export const webhookStatus = pgEnum("webhook_status", ["pending", "sent", "failed", "dead"]);

const utmColumns = {
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
};

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey(),
    clientSubmissionId: uuid("client_submission_id").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    companyName: text("company_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    website: text("website"),
    ownsCompany: boolean("owns_company").notNull(),
    annualRevenue: text("annual_revenue", { enum: REVENUE_VALUES }).notNull(),
    willingToInvest3k: boolean("willing_to_invest_3k"),
    qualified: boolean("qualified").notNull(),
    qualificationPath: text("qualification_path").notNull(),
    consent: boolean("consent").notNull(),
    consentText: text("consent_text").notNull(),
    pageUrl: text("page_url"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    ...utmColumns,
    fbclid: text("fbclid"),
    gclid: text("gclid"),
    webhookStatus: webhookStatus("webhook_status").notNull().default("pending"),
    webhookAttempts: integer("webhook_attempts").notNull().default(0),
    webhookLastError: text("webhook_last_error"),
    webhookLastAttemptAt: timestamp("webhook_last_attempt_at", { withTimezone: true }),
    webhookSentAt: timestamp("webhook_sent_at", { withTimezone: true }),
    rawPayload: jsonb("raw_payload"),
  },
  (table) => [
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_webhook_status_idx").on(table.webhookStatus),
    index("leads_email_idx").on(table.email),
  ],
);

export const disqualifiedEvents = pgTable(
  "disqualified_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reason: text("reason").notNull(),
    annualRevenue: text("annual_revenue"),
    ...utmColumns,
    pageUrl: text("page_url"),
  },
  (table) => [index("disqualified_events_created_at_idx").on(table.createdAt)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scope: text("scope").notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("rate_limits_lookup_idx").on(table.scope, table.ipHash, table.createdAt)],
);

export type LeadRow = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type WebhookStatus = (typeof webhookStatus.enumValues)[number];
