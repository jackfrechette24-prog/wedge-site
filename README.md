# Wedge Acquisition website

Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Postgres with Drizzle, hosted on Railway.

## Local setup

Needs Node 20+ and pnpm. For a database, use any local Postgres (`postgresql://localhost:5432/wedge`) or the public URL of a separate Railway environment, so test leads stay out of production.

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
| `pnpm cron:retry` | Trigger the webhook retry job. Needs `NEXT_PUBLIC_SITE_URL` and `CRON_SECRET` |
| `pnpm mock:webhook` | Fake CRM webhook on port 4010. Set `CRM_WEBHOOK_URL=http://localhost:4010/hook` |

The mock can fail on command: `curl -X POST localhost:4010/fail`, then `curl -X POST localhost:4010/ok`. See what it received with `curl localhost:4010/received`.

## Deploying to Railway

The project has three services: the app, Postgres, and a cron job that retries failed leads.

### 1. App service

1. Create a Railway project and choose **Deploy from GitHub repo**. Rename the service to `app`.
2. `railway.json` sets the build command, the start command, the pre-deploy migration, and the healthcheck on `/`. These override the dashboard.

`pnpm start` listens on `0.0.0.0` and on the `PORT` Railway provides.

### 2. Postgres service

1. In the project, choose **New**, then **Database**, then **PostgreSQL**. Keep the service name `Postgres`, because the variable reference below uses it.
2. On the app service, set `DATABASE_URL` to `${{Postgres.DATABASE_URL}}`. This is the private network URL, which connects without SSL.

Migrations run automatically before each deploy with `pnpm db:migrate`. If one fails, the deploy stops and the running version stays up.

To run commands from your computer, copy `DATABASE_PUBLIC_URL` from the Postgres service. It connects with SSL automatically. Add `?sslmode=disable` or `?sslmode=require` to any URL to override the default.

Turn on backups for the Postgres service, because this database is your lead backup. Backups depend on your Railway plan.

### 3. Cron service

1. Choose **New**, then **GitHub Repo**, and pick this repo again. Rename the service to `cron`.
2. In the service's settings, set the **Config file path** to `/railway.cron.json`. **This step matters.** Without it, the service reads `railway.json` and tries to run a second copy of the website.
3. Set these variables on the cron service:
   - `NEXT_PUBLIC_SITE_URL` to `https://wedgeacquisition.com`
   - `CRON_SECRET` to `${{app.CRON_SECRET}}`

It runs `pnpm cron:retry` every 10 minutes (`*/10 * * * *`) and then exits. A run shows as failed in Railway if the retry job returns an error. Until your domain is live, set `NEXT_PUBLIC_SITE_URL` on this service to the app's Railway URL.

### 4. Custom domain

1. On the app service, open **Settings**, then **Networking**, then **Custom Domain**, and add `wedgeacquisition.com` and `www.wedgeacquisition.com`.
2. Railway shows a `CNAME` target for each one. At your registrar, remove the records pointing to Lovable and add these. If your registrar doesn't support a `CNAME` at the root domain, use its `ALIAS` or `ANAME` record, or move DNS to a provider that flattens root CNAMEs, like Cloudflare.
3. Wait for Railway to verify the domain and issue the certificate.
4. If Lovable manages the domain itself, disconnect it in Lovable first. Lower the DNS TTL a day ahead if you can, and keep the Lovable site running until the new one is verified.
5. Add any old Lovable URLs to `LEGACY_REDIRECTS` in `next.config.ts` so they keep their search traffic.

Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy, because `NEXT_PUBLIC_*` values are baked in at build time.

## Environment variables

Set these on the **app** service unless noted.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, sitemap, share images. `https://wedgeacquisition.com`. Also needed on the cron service |
| `DATABASE_URL` | Yes | `${{Postgres.DATABASE_URL}}`. The lead backup |
| `CRM_WEBHOOK_URL` | Yes | Your CRM's inbound webhook |
| `NEXT_PUBLIC_BOOKING_EMBED_URL` | Yes | Calendar URL embedded on `/book` |
| `NEXT_PUBLIC_BOOKING_EMBED_SCRIPT` | No | Vendor script, usually for iframe auto-height |
| `CRON_SECRET` | Yes | Protects the retry job. `openssl rand -hex 32`. Also needed on the cron service, as `${{app.CRON_SECRET}}` |
| `IP_HASH_SALT` | Yes | Salt for IP hashes. `openssl rand -hex 32`. Don't change it later, or rate limits reset |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Yes | Login for `/admin/leads`. The page stays locked if these are empty |
| `ALERT_SLACK_WEBHOOK_URL` | Recommended | Slack alerts on lead delivery problems |
| `RESEND_API_KEY`, `ALERT_EMAIL_TO` | Recommended | Email alerts |
| `ALERT_EMAIL_FROM` | No | Sender on a domain verified in Resend. Without it, Resend's test sender only delivers to your own Resend account email |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta tracking. Loads only if set |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4. Loads only if set |

Missing required variables are logged as a loud error at startup, but the site still renders. If `DATABASE_URL` and `CRM_WEBHOOK_URL` are both missing in production, `/apply` shows a maintenance message with an email link.

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
| Hero headline | `HERO_VARIANTS` and `ACTIVE_HERO` in `site.ts` (`"A"`, `"B"`, or `"C"`) |
| System name | `SYSTEM_NAME` in `site.ts` |
| Hero stat cards, terms, nav, social links | `site.ts` |
| Founder photo, story, and stats | `FOUNDER` in `site.ts` |
| Home sections | `home.ts` |
| 5 steps and How It Works page | `howItWorks.ts` |
| Launch timeline panel | `timeline.ts` |
| Them vs. us comparison | `comparison.ts` |
| Niche pages | `nichePages.ts` |
| Form, booking, confirmation copy | `flow.ts` |
| Privacy and terms | `legal.ts` |

**Headlines** are lists of segments. Each segment sits on its own line, and `accent: true` sets it in the italic serif:

```ts
[{ text: "MAKE YOUR CALENDAR" }, { text: "fill itself.", accent: true }]
```

To change how every accent phrase looks, edit the one `.accent-text` class in `src/app/globals.css`. Body copy supports `**bold**`, which is used to pick out numbers and punchlines.

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

Video slots: `HOME_VSL` and `PRECALL_VIDEO` in `site.ts`, `video` on each case study and FAQ. Structured data appears automatically. Case study cards use `poster` for their image, then fall back to the video thumbnail. Videos open in a 16:9 player regardless of the card shape.

**Add a case study.** Add an object to the array in `caseStudies.ts`. The grid, detail page, sitemap, and share image all update. Stats left `null` are hidden. Put logos in `public/clients/`.

**Add a FAQ.** Add an object to `faqs.ts`. Its `pages` list controls where it shows. Answers support `**bold**` and `[links](/path)`.

`pnpm test` checks the copy rules: no em or en dashes, banned words, and delivery details in `src/content/`, plus title and description lengths.

## Pre-launch checklist

- [ ] All placeholders replaced (search the repo for `TODO_`)
- [ ] Founder copy and stats reviewed, and every number is accurate
- [ ] The inbox in `CONTACT_EMAIL` exists and is monitored
- [ ] Counsel has reviewed privacy and terms, and the "Template" notice is removed from `legal.ts`
- [ ] All environment variables set on the app and cron services
- [ ] Pre-deploy migration succeeded in the app's deploy logs
- [ ] Postgres backups turned on
- [ ] Real test lead appears in `/admin/leads` as `sent` and in the CRM with all fields mapped
- [ ] Test the failure path: temporarily break `CRM_WEBHOOK_URL`, submit, confirm the alert arrives and the lead shows `failed`, restore it, and click retry
- [ ] Calendar prefill works, and booking lands on `/confirmed`
- [ ] Cron service uses `/railway.cron.json`, and its latest run logs a `200` from the retry job
- [ ] Meta and Google events fire on a real submission (Meta Events Manager test tool, GA4 DebugView)
- [ ] Test leads deleted from the production database
- [ ] Old Lovable URLs added to `LEGACY_REDIRECTS`
- [ ] Domain live with HTTPS, `sitemap.xml` submitted to Google Search Console
- [ ] Lighthouse re-run on the live URL with tracking on
