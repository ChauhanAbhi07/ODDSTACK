# Deployment handoff

For the current GitHub Pages request, follow [GITHUB-PAGES.md](GITHUB-PAGES.md). The remaining sections describe the optional full Next.js server deployment for automatic email delivery or database storage later.

The application and deployment code are complete. The owner has confirmed that hosting, domain, inbox/CRM and approved business details are not available yet. No public site or external notification service has been created. This guide describes the prepared path once those inputs exist.

## Local review

```sh
npm ci
npm run dev
```

The complete preview is at `http://localhost:3000`. No accounts, credentials or paid services are required. The local development form writes gitignored records and explicitly says they were not sent to the business.

## Direct email: one deployment, no database

The Next.js frontend and enquiry API run together. Use `INQUIRY_STORAGE_DRIVER=email` to send enquiries through Resend without PostgreSQL, a CRM, a queue worker or a separate backend host.

Set these server-only values in `.env.local` for local testing or in your hosting project's runtime environment:

```dotenv
INQUIRY_STORAGE_DRIVER=email
RESEND_API_KEY=your-api-key
INQUIRY_EMAIL_FROM=enquiries@your-verified-domain.com
INQUIRY_EMAIL_TO=your-inbox@example.com
```

Use a plain email address on a verified sending domain for FROM and your receiving mailbox for TO. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the confirmed public contact address too. `.env.example` is only a template. Never prefix the API key with `NEXT_PUBLIC_`.

The endpoint validates the form and submits a plain-text email containing all enquiry fields. Reply-To is the visitor's validated email; the recipient always comes from server configuration. The success message confirms queuing for email delivery, not arrival in the inbox. Check provider delivery/bounce records and spam filtering during the live smoke test. Provider failures leave the form answers available for retry. No local or database backup is written in email mode.

The adapter follows the [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email). Stable [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys) prevent duplicate sends within the provider's 24-hour window; retries after that can send again. Existing request limits are per application process, not shared across instances; configure the host's rate-limiting controls if scaling out.

Use the standalone Node deployment below for a single app process. If deploying with Docker, use the email-only Compose file (it starts no database):

```sh
docker compose -f compose.email.yaml --env-file .env.production.local up --build -d
```

This requires the public site URL and public contact email as build values plus the three email settings above at runtime. Put the app behind HTTPS. Email sending may have provider charges depending on usage; no separate backend or database subscription is required by this setup. No external email has been sent during implementation; tests mock the provider. Real delivery still requires account configuration and a live check.

## Optional production storage

Two database/storage alternatives remain available if needed later:

- `postgres`: application-managed durable storage, database-wide rate limits and a transactional notification queue.
- `webhook`: an existing service that implements the durable-storage and idempotency contract described in the README.

For PostgreSQL, configure a server-only `DATABASE_URL` and set `INQUIRY_STORAGE_DRIVER=postgres`. Use the hosting provider's verified TLS settings for remote connections; do not disable certificate verification. Set `RATE_LIMIT_SECRET` to a randomly generated secret of at least 32 characters.

Apply the idempotent initial migration before enabling collection:

```sh
npm run db:migrate
npm run db:status
```

Use a dedicated database. Run migrations with an administrative role, and use a restricted application role in a managed production database. The runtime requires SELECT/INSERT/UPDATE on the three `oddestack_*` tables; the retention operator also needs DELETE. Configure database backups and verify restoration on the selected host. A volume is persistence, not a backup.

Repeated payloads with the same `Idempotency-Key` return the original receipt. Changed payloads with the same key receive 409. New submissions are limited to ten per minute per database bucket; duplicate receipts do not consume that quota. Transactions include the enquiry and its notification record, so a queue failure cannot leave a falsely confirmed partial write.

Behind a reverse proxy, enable `TRUST_PROXY=true` only if the proxy replaces incoming `X-Forwarded-For` with the real client address. Otherwise the application ignores this header and uses a shared anonymous bucket. Raw client IPs are not stored; persistent buckets use a keyed hash. Keep ingress-level traffic/body limits as well.

## Notifications and CRM handoff

Configure `INQUIRY_NOTIFICATION_WEBHOOK_URL` (HTTPS) and `INQUIRY_NOTIFICATION_WEBHOOK_SECRET` when a recipient system exists. A receiver can deliver email or create a CRM record. Run this command on a schedule, for example once a minute:

```sh
npm run db:notify
```

The worker leases up to twenty due jobs, posts `{ id, createdAt, inquiry }` with a bearer credential, and uses the receipt ID as `Idempotency-Key`. The receiver must deduplicate this key: delivery is at least once, because a process can stop after delivery and before recording acknowledgement. Failed deliveries retain the enquiry, back off up to an hour, and remain visible in `db:status`. Multiple workers use database locks and leases to avoid claiming the same active job.

No notification has been sent to an external destination during development. Delivery tests used an in-process fixture.

Set a business-approved `INQUIRY_RETENTION_DAYS` before reviewing old records:

```sh
npm run db:retention
# Only after reviewing the dry-run count:
npm run db:retention -- --apply
```

The apply command deletes expired enquiries and their associated notification rows, plus stale rate buckets. It is deliberately not scheduled by default. The script never prints contact payloads or credentials.

## Standalone Node deployment

Set the real `NEXT_PUBLIC_SITE_URL`, confirmed `NEXT_PUBLIC_CONTACT_EMAIL`, and `CONTENT_MODE=public` before the build. Next.js embeds public values and static content during compilation; changing them later requires rebuilding.

```sh
npm ci
npm run build
npm run package:standalone
node .next/standalone/server.js
```

Deploy the prepared `.next/standalone` directory, supply server-only runtime settings through the host's secret manager, and put it behind an HTTPS reverse proxy. `PORT` and `HOSTNAME` configure the listener. Build on the target operating system; the verified local artifact is a Windows build and should not be copied blindly to a Linux host with native dependencies.

## Docker deployment

`Dockerfile` builds a Linux standalone image and runs it as the non-root Node user. `compose.yaml` provides the app, a persistent PostgreSQL 17 volume, and an optional database-operations image. Supply configuration in a gitignored environment file; use URL-safe random characters for `POSTGRES_PASSWORD`, because Compose interpolates it into `DATABASE_URL`.

Required Compose values: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `POSTGRES_PASSWORD`, and `RATE_LIMIT_SECRET`.

```sh
docker compose --env-file .env.production.local up --build -d
docker compose --env-file .env.production.local --profile operations run --rm operations npm run db:status
```

PostgreSQL applies the initial SQL file on the first empty-volume startup. For an existing volume, run the migration explicitly through the operations image:

```sh
docker compose --env-file .env.production.local --profile operations run --rm operations npm run db:migrate
docker compose --env-file .env.production.local --profile operations run --rm operations npm run db:notify
```

Schedule the notification command after configuring its endpoint. The web port binds to `127.0.0.1:3000`; expose it through the host's HTTPS proxy. The database has no published host port. Do not use `docker compose down --volumes` on live data.

Compose configuration was validated locally. Docker Desktop's engine was not running, so a container-image build/run has not been verified. The same standalone application was successfully built and smoke-tested against a real PostgreSQL server outside Docker.

## Launch review

```sh
npm run launch:check
```

This reports missing real configuration and review markers. `CONTACT_EMAIL_CONFIRMED`, `BUSINESS_CONTENT_REVIEWED` and `LEGAL_PAGES_REVIEWED` document work that must actually be completed; setting flags does not replace editing/reviewing the content. Currently the check intentionally reports missing inputs.

Keep articles/case studies as drafts until approved, keep unverified statistics hidden, and replace legal placeholders with the business-specific policy and terms. Confirm the live HTTPS origin, receipt persistence, notification delivery, privacy copy and backup/retention arrangements before inviting public enquiries.

## Reproduce the additional checks

```sh
npx playwright install firefox webkit
npm run test:browsers
# TEST_DATABASE_URL must point to a dedicated test database:
npm run test:database
```

Database tests create and remove a unique test schema; they do not clear existing application tables. A local production server with the PostgreSQL driver can be checked using `node scripts/smoke-production.mjs`. That script only accepts localhost destinations and writes a clearly synthetic test enquiry.

Implementation references: [node-postgres transactions](https://node-postgres.com/features/transactions), [connection pooling](https://node-postgres.com/features/pooling), and [PostgreSQL locking](https://www.postgresql.org/docs/17/explicit-locking.html). Next.js deployment behavior was checked against the installed package's `dist/docs` documentation.
