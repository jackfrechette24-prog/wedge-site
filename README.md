# Wedge Acquisition website

Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Postgres on Neon with Drizzle, hosted on Vercel.

## Local setup

Needs Node 22.18+ and pnpm.

```bash
pnpm install
cp .env.example .env.local   # fill in what you have
pnpm db:migrate              # needs DATABASE_URL
pnpm dev                     # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` / `build` / `start` | Develop, build, run the production build |
| `pnpm lint` / `typecheck` / `test` | ESLint, TypeScript, Vitest |
| `pnpm db:generate` | Create a new migration after editing `src/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations to `DATABASE_URL` |
| `pnpm mock:webhook` | Fake CRM webhook on port 4010. Set `CRM_WEBHOOK_URL=http://localhost:4010/hook` |

The mock can fail on command: `curl -X POST localhost:4010/fail`, then `curl -X POST localhost:4010/ok`. See what it received with `curl localhost:4010/received`.

For local development, use a separate Neon branch so test leads stay out of production. The HTTP driver only talks to Neon. To use a plain local Postgres, put a Neon-compatible HTTP proxy in front of it and set `NEON_FETCH_ENDPOINT`.

## Neon setup

1. In Vercel, open your project, then **Storage**, then **Create Database**, and choose **Neon**. This adds `DATABASE_URL` to the project.
2. Copy `DATABASE_URL` into `.env.local`.
3. Run `pnpm db:migrate`. Run it again whenever a new file appears in `/drizzle`.

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel. The framework preset is detected automatically.
2. Add the environment variables below for Production, then redeploy. `NEXT_PUBLIC_*` values are baked in at build time, so changing one needs a redeploy.
3. **Use the Pro plan.** `vercel.json` runs the retry job every 10 minutes, and Vercel rejects a deployment on Hobby when a cron runs more than once a day. Hobby is also limited to non-commercial use.

If you stay on Hobby for now, change the schedule in `vercel.json` to `0 8 * * *`. Failed leads then retry once a day, and you can use **Retry all failed** on `/admin/leads` in between.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, sitemap, share images. `https://wedgeacquisition.com` |
| `DATABASE_URL` | Yes | Neon connection string. The lead backup |
| `CRM_WEBHOOK_URL` | Yes | Your CRM's inbound webhook |
| `NEXT_PUBLIC_BOOKING_EMBED_URL` | Yes | Calendar URL embedded on `/book` |
| `NEXT_PUBLIC_BOOKING_EMBED_SCRIPT` | No | Vendor script, usually for iframe auto-height |
| `CRON_SECRET` | Yes | Protects the retry job. `openssl rand -hex 32`. Vercel sends it automatically |
| `IP_HASH_SALT` | Yes | Salt for IP hashes. `openssl rand -hex 32`. Don't change it later, or rate limits reset |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Yes | Login for `/admin/leads`. The page stays locked if these are empty |
| `ALERT_SLACK_WEBHOOK_URL` | Recommended | Slack alerts on lead delivery problems |
| `RESEND_API_KEY`, `ALERT_EMAIL_TO` | Recommended | Email alerts |
| `ALERT_EMAIL_FROM` | No | Sender on a domain verified in Resend. Without it, Resend's test sender only delivers to your own Resend account email |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta tracking. Loads only if set |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4. Loads only if set |

Missing required variables are logged as a loud error at startup, but the site still renders. If `DATABASE_URL` and `CRM_WEBHOOK_URL` are both missing in production, `/apply` shows a maintenance message with an email link.

## Point wedgeacquisition.com at Vercel

1. In Vercel, open **Settings**, then **Domains**, and add `wedgeacquisition.com` and `www.wedgeacquisition.com`.
2. Vercel shows the DNS records to create. They are usually an `A` record for the apex and a `CNAME` for `www`. Use the exact values Vercel shows.
3. At your domain registrar, remove the records pointing to Lovable and add the new ones. If Lovable manages the domain itself, disconnect it in Lovable first.
4. Wait for Vercel to show the domain as valid and issue the certificate.
5. Add any old Lovable URLs to `LEGACY_REDIRECTS` in `next.config.ts` so they keep their search traffic.

Lower the DNS TTL a day ahead if you can, and keep the Lovable site running until the new one is verified.

## Connect the CRM webhook

1. Create an inbound webhook in your CRM and copy its URL into `CRM_WEBHOOK_URL`.
2. Send a test lead through `/apply` so the CRM can learn the fields, then map them.

Every lead is sent as flat JSON:

`lead_id, first_name, last_name, full_name, email, phone, company_name, website, owns_company, annual_revenue, willing_to_invest_3k, qualified, qualification_path, consent, consent_text, submitted_at, page_url, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid`

- `phone` is E.164, like `+14155552671`.
- `annual_revenue` is the label shown on the form, like `$500K to $1M`.
- `qualification_path` is `revenue_300k_plus` or `under_300k_will_invest`.
- `page_url` is the first page the visitor landed on, including ad tags.

A retry can deliver the same lead twice in rare cases, such as when the CRM accepted the lead but the database update right after it failed. Deduplicate on `lead_id` or email if your CRM allows it.

## How leads are protected

1. The lead is validated, then written to Postgres first.
2. It is then sent to the CRM with an 8 second timeout.
3. The visitor gets a success if either one worked.
4. If the webhook fails, the retry job tries again with backoff (5, 10, 20, 40, 80, 160, 320 minutes). After 8 attempts the lead is marked `dead` and you get an alert.
5. If both fail, the alert contains the full lead, and the browser keeps a copy and resends it on the visitor's next page load. They can still book.

Spam (the honeypot, under 3 seconds on the form, over 5 submissions per IP per hour) gets a normal-looking success response and is not stored. These are logged as `[lead] silently rejected`, and the visitor can still reach the calendar.

`/admin/leads` shows every lead, with search, status filters, retry buttons, and CSV export. CSV export is your fallback if you ever need to move leads by hand.

## Calendar setup

1. Set `NEXT_PUBLIC_BOOKING_EMBED_URL` to the calendar's embed URL.
2. In your calendar's settings, set the redirect after booking to `https://wedgeacquisition.com/confirmed`. This is configured with the vendor, not in this code. If the calendar redirects inside the iframe, use its "open in parent window" option.
3. **Verify prefill.** Complete `/apply` and check that name, email, and phone are filled in on the calendar. If they aren't, change the keys in `BOOKING_PREFILL_PARAMS` in `src/content/site.ts`.

## Editing content

All copy lives in `src/content/`.

| To change | Edit |
| --- | --- |
| Hero headline | `ACTIVE_HERO` in `site.ts` (`"A"`, `"B"`, or `"C"`) |
| System name | `SYSTEM_NAME` in `site.ts` |
| Stats, terms, nav, social links, client logos | `site.ts` |
| Home, How It Works, niche pages | `home.ts`, `howItWorks.ts`, `nichePages.ts` |
| Form, booking, confirmation copy | `flow.ts` |
| Privacy and terms | `legal.ts` |

**Add a video.** Set any video field to:

```ts
{
  provider: "youtube", // or "mp4", with a path in id_or_src
  id_or_src: "dQw4w9WgXcQ",
  title: "Video title",
  description: "One sentence on what it covers.",
  thumbnail: "", // optional for YouTube
  uploadDate: "2026-11-01",
}
```

Video slots: `HOME_VSL` and `PRECALL_VIDEO` in `site.ts`, `video` on each case study and FAQ. Structured data appears automatically.

**Add a case study.** Add an object to the array in `caseStudies.ts`. The grid, detail page, sitemap, footer, and share image all update. Stats left `null` are hidden. Put logos in `public/clients/`.

**Add a FAQ.** Add an object to `faqs.ts`. Its `pages` list controls where it shows. Answers support `**bold**` and `[links](/path)`.

`pnpm test` checks the copy rules: no em or en dashes, banned words, and delivery details in `src/content/`, plus title and description lengths.

## Pre-launch checklist

- [ ] All placeholders replaced (search the repo for `TODO_` and `[CLIENT LOGO]`)
- [ ] Remove empty slots from `CLIENT_LOGOS`
- [ ] The inbox in `CONTACT_EMAIL` exists and is monitored
- [ ] Counsel has reviewed privacy and terms, and the "Template" notice is removed from `legal.ts`
- [ ] All environment variables set in Vercel Production
- [ ] `pnpm db:migrate` run against production
- [ ] Real test lead appears in `/admin/leads` as `sent` and in the CRM with all fields mapped
- [ ] Test the failure path: temporarily break `CRM_WEBHOOK_URL`, submit, confirm the alert arrives and the lead shows `failed`, restore it, and click retry
- [ ] Calendar prefill works, and booking lands on `/confirmed`
- [ ] Cron job shows as active in Vercel, under **Settings**, then **Cron Jobs**
- [ ] Meta and Google events fire on a real submission (Meta Events Manager test tool, GA4 DebugView)
- [ ] Test leads deleted from the production database
- [ ] Old Lovable URLs added to `LEGACY_REDIRECTS`
- [ ] Domain live with HTTPS, `sitemap.xml` submitted to Google Search Console
- [ ] Lighthouse re-run on the live URL with tracking on
