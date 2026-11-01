import type { LeadRow } from "@/db/schema";

const COLUMNS: (keyof LeadRow)[] = [
  "createdAt", "firstName", "lastName", "companyName", "email", "phone", "website", "annualRevenue",
  "willingToInvest3k", "qualificationPath", "consent", "webhookStatus", "webhookAttempts", "webhookLastError",
  "webhookSentAt", "pageUrl", "referrer", "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm",
  "fbclid", "gclid", "id",
];

function cell(value: unknown) {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  // Form input ends up here. Stop spreadsheets from running it as a formula. E.164 phones are safe.
  if (/^[=+\-@\t\r]/.test(text) && !/^\+\d+$/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function leadsToCsv(rows: LeadRow[]) {
  const lines = [COLUMNS.join(",")];
  for (const row of rows) lines.push(COLUMNS.map((column) => cell(row[column])).join(","));
  return `${lines.join("\r\n")}\r\n`;
}
