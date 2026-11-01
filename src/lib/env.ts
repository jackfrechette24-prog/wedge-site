import { z } from "zod";

const optional = z.preprocess((value) => (value === "" ? undefined : value), z.string().optional());
const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.url().optional());

const serverEnvSchema = z.object({
  DATABASE_URL: optional,
  CRM_WEBHOOK_URL: optionalUrl,
  CRON_SECRET: optional,
  IP_HASH_SALT: optional,
  ADMIN_USER: optional,
  ADMIN_PASSWORD: optional,
  ALERT_SLACK_WEBHOOK_URL: optionalUrl,
  RESEND_API_KEY: optional,
  ALERT_EMAIL_TO: optional,
  ALERT_EMAIL_FROM: optional,
});

const REQUIRED = ["DATABASE_URL", "CRM_WEBHOOK_URL", "CRON_SECRET", "IP_HASH_SALT", "ADMIN_USER", "ADMIN_PASSWORD"] as const;

/** Called once at startup. Reports problems loudly but never stops the site from rendering. */
export function reportEnvProblems() {
  const parsed = serverEnvSchema.safeParse(process.env);
  const problems = parsed.success ? [] : parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (problems.length === 0 && missing.length === 0) return;

  const lines = [
    ...missing.map((key) => `missing ${key}`),
    ...problems.map((problem) => `invalid ${problem}`),
  ];
  console.error(`\n[env] Server environment problems:\n  - ${lines.join("\n  - ")}\n[env] See .env.example.\n`);
}

/** False only when a lead would have nowhere to go, so the form swaps to the maintenance message. */
export function leadCaptureAvailable() {
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(process.env.DATABASE_URL || process.env.CRM_WEBHOOK_URL);
}
