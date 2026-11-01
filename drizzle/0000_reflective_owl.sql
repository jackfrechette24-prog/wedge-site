CREATE TYPE "public"."webhook_status" AS ENUM('pending', 'sent', 'failed', 'dead');--> statement-breakpoint
CREATE TABLE "disqualified_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reason" text NOT NULL,
	"annual_revenue" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"page_url" text
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_submission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"company_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"website" text,
	"owns_company" boolean NOT NULL,
	"annual_revenue" text NOT NULL,
	"willing_to_invest_3k" boolean,
	"qualified" boolean NOT NULL,
	"qualification_path" text NOT NULL,
	"consent" boolean NOT NULL,
	"consent_text" text NOT NULL,
	"page_url" text,
	"referrer" text,
	"user_agent" text,
	"ip_hash" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"fbclid" text,
	"gclid" text,
	"webhook_status" "webhook_status" DEFAULT 'pending' NOT NULL,
	"webhook_attempts" integer DEFAULT 0 NOT NULL,
	"webhook_last_error" text,
	"webhook_last_attempt_at" timestamp with time zone,
	"webhook_sent_at" timestamp with time zone,
	"raw_payload" jsonb,
	CONSTRAINT "leads_client_submission_id_unique" UNIQUE("client_submission_id")
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "disqualified_events_created_at_idx" ON "disqualified_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_webhook_status_idx" ON "leads" USING btree ("webhook_status");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "rate_limits_lookup_idx" ON "rate_limits" USING btree ("scope","ip_hash","created_at");