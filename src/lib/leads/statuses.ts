import type { WebhookStatus } from "@/db/schema";

export const WEBHOOK_STATUSES: WebhookStatus[] = ["pending", "sent", "failed", "dead"];
