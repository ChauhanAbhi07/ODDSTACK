# ODDESTACK

A working Next.js website for an integrated technology, AI, creative, growth and operations company. The original brief is preserved in [docs/ODDESTACK-WEBSITE-BRIEF.txt](docs/ODDESTACK-WEBSITE-BRIEF.txt); scope and delivery sequence are in [docs/IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md).

## Run locally

Use Node.js 22 or later. Dependencies are pinned and locked.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No API keys or environment variables are required for the local demo. Copy `.env.example` to `.env.local` to override defaults.

Development shows explicitly labeled draft case studies, sample editorials and placeholder team roles. The project wizard writes local submission records; it does **not** send email or contact a CRM.

```sh
npm run build
npm start
```

Production defaults to public content and disables inquiry persistence until a production adapter is configured. PostgreSQL storage, a retryable notification queue and the existing webhook adapter are implemented. A submitted brief will show an honest unavailable message and an email fallback if storage is not connected. See [the deployment handoff](docs/DEPLOYMENT.md) for standalone/Docker deployment and database operations.

## What is implemented

- Sixteen-section homepage with a custom dark/lime visual system, CSS/SVG stack artwork, mobile navigation and a large branded footer.
- Ten expandable capability groups, eight outcome drawers, eight industry experiences and ten goal-based recommendation paths.
- A deterministic solution finder that transfers selected capabilities and industry into the contact wizard.
- A five-step project wizard with all requested business/contact questions, review, step validation, preserved back navigation, pending/error states and confirmed persistence receipts.
- Seven anonymized experience drafts, twelve pseudonymized/placeholder team profiles and six complete sample articles with category filtering.
- Four engagement models with configurable pricing visibility and engagement context passed into inquiry records.
- Pointer-responsive artwork, restrained magnetic buttons, scroll-linked convergence/reveals, hover interactions, mobile-menu/page-entry transitions, a short finite marquee entrance, and reduced-motion handling. Counters animate only when verified statistics are enabled.
- Route metadata, canonical URLs, social image, Twitter/OpenGraph cards, sitemap, robots rules, Organization/Service schema and publication-gated Article schema.

There are **42 page URLs in preview mode**: eleven fixed pages, ten capability pages, eight industry pages, seven experience pages and six article pages. With the supplied content's current publication statuses, production exposes 29 page URLs; unpublished experience/article URLs return 404. Privacy and terms are visible placeholders marked `noindex`.

Routes: `/`, `/services`, `/services/[slug]`, `/solutions`, `/industries`, `/industries/[slug]`, `/work`, `/work/[slug]`, `/team`, `/insights`, `/insights/[slug]`, `/about`, `/contact`, `/privacy`, `/terms` and `POST /api/inquiries`.

## Architecture

`src/app` contains Server Component route templates and the inquiry handler. `src/components` contains shared layout, UI primitives, CSS/SVG artwork and isolated interactive components. `src/data` holds typed content; `src/lib` holds recommendation rules, publication filtering, validation, SEO helpers and persistence. `src/config/site.ts` holds business configuration. Tokens, component styles and responsive rules live in `src/app/globals.css` alongside Tailwind.

The site uses locally hosted Manrope, no external background imagery, no stock portraits and no decorative WebGL. Since its artwork is CSS/SVG, there are no raster image assets needing `next/image`; use it when adding future photography.

Reusable components include `Header`, `Footer`, `Wordmark`, `ButtonLink`, `Eyebrow`, `SectionTitle`, `PageIntro`, `Tags`, `JsonLd`, `EmptyState`, `StackArt`, `CaseArtwork`, `StackBuilder`, `SolutionFinder`, `SolutionsGrid`, `IndustrySwitcher`, `Comparison`, `ArticleGrid`, `WorkGrid`, `TeamGrid`, `ProjectWizard`, `Process`, `Engagements` and `FinalCTA`.

## Content and publication

- Edit services, solutions, industries, team, case studies, articles, navigation, process, engagements and stats in their respective `src/data/*.ts` files.
- Case studies and articles have `status: "draft" | "published"`. Set `published` only after content review. The same selection governs route visibility and page listings. Sitemap generation always excludes drafts.
- `CONTENT_MODE=preview` includes drafts and placeholder profiles, while robots rules block indexing. It is intended for local/private previews, not confidential storage or a public deployment.
- `CONTENT_MODE=public` excludes drafts and placeholder profiles. Production defaults to this mode.
- Statistics remain hidden until `verified` is true. Their intended attribution is collective team experience, never ODDESTACK client delivery.
- The seven supplied profiles use pseudonyms. The five additional roles are labeled placeholders and disappear from the public view.
- Set `site.showPricing` and provide prices in `src/data/engagements.ts` when approved pricing exists. Add actual social URLs to `site.socials`; no dead placeholder links are rendered.

## Configuration

| Variable | Purpose / default |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin; `http://localhost:3000` locally. Set the real HTTPS origin before a public build. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Display email; defaults to the brief's `hello@oddestack.com`, ownership unconfirmed. |
| `CONTENT_MODE` | `preview` or `public`; defaults to preview in development, public in production. |
| `INQUIRY_STORAGE_DRIVER` | `local`, `postgres`, `webhook`, or `disabled`; development defaults to local, production to disabled. |
| `DATABASE_URL` | Server-only PostgreSQL connection string when using `postgres`. |
| `RATE_LIMIT_SECRET` | Random secret of at least 32 characters for persistent rate-limit buckets. |
| `INQUIRY_NOTIFICATION_WEBHOOK_URL` / `INQUIRY_NOTIFICATION_WEBHOOK_SECRET` | Optional notification destination and credential, used by `db:notify`. |
| `INQUIRY_RETENTION_DAYS` | Approved retention period; `db:retention` defaults to a dry run. |
| `INQUIRY_LOCAL_PATH` | Local record directory; defaults to `.local/inquiries`. |
| `ALLOW_LOCAL_INQUIRIES` | Set `true` only to test local persistence with a local production build. Not suitable for serverless hosting. |
| `INQUIRY_WEBHOOK_URL` | Server-only HTTPS endpoint for a durable production storage adapter. |
| `INQUIRY_WEBHOOK_SECRET` | Server-only bearer credential for the storage endpoint. |
| `TRUST_PROXY` | Set `true` only behind a proxy that replaces/validates `X-Forwarded-For`. |
| `CHROME_PATH` | Optional browser executable override for the Lighthouse script. |
| `AUDIT_BASE_URL` | Lighthouse target; defaults to `http://localhost:3001`. |

Set content/public URL values before building, because static routes and metadata are generated at build time. No LLM key is used. Never place server credentials in `NEXT_PUBLIC_*` variables.

## Inquiry storage and production integration

Requests require JSON and an `Idempotency-Key` header. The server enforces a 16 KB payload limit, validates the schema, rejects the honeypot, checks browser origins, and returns a receipt only after persistence.

Local submissions are stored as `.local/inquiries/<hashed-key>/record.json`. Each record includes a generated receipt ID, payload hash, timestamp and the validated brief. Directory creation claims the idempotency key; atomic rename makes a complete record visible. A repeated identical request receives the same receipt; changed content with the same key returns 409. This per-record design replaces the plan's proposed JSONL file to make concurrent retries safer. These directories contain personal information and are gitignored; manage their retention deliberately.

For production set `INQUIRY_STORAGE_DRIVER=webhook` and configure its URL and secret. The endpoint receives the validated brief, a bearer credential and the same `Idempotency-Key`. It must persist durably before returning a JSON response like `{"id":"receipt_123"}`. IDs must contain 1–100 letters, digits, underscores or hyphens. It must return the same ID for duplicate payload/key pairs and reject conflicting reuse. The adapter uses HTTPS, rejects redirects and applies a 10-second timeout.

The API includes an in-process limiter. The PostgreSQL adapter additionally implements a shared transactional limiter and idempotency across application instances. The external storage-webhook adapter relies on the receiver's shared rate and deduplication controls. By default, untrusted proxy headers are ignored and requests share an anonymous bucket. PostgreSQL records a notification job in the same transaction as the enquiry; run `npm run db:notify` against a configured receiver to hand it to email/CRM automation with retry support. This app never falsely claims an email was sent.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run format:check
npm run build
```

`test:e2e` uses headless Microsoft Edge; `test:browsers` runs Edge, Firefox and WebKit. Tests start a development server if needed. They test all 42 preview routes, internal link destinations, invalid slugs, navigation/dialogs, recommendation handoff, submission success/failure, reduced motion, mobile detail pages, and horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440 and 1920px. Axe checks the homepage and mobile contact page. WebKit is engine coverage, not a physical Safari-device test. For other systems, change the Edge project channel and install the corresponding browsers.

Production performance checks:

```sh
npm run build
npm run start -- --port 3001
# In another terminal:
npm run audit:site
```

Lighthouse audits the homepage, AI capability detail and contact route with its default mobile settings. Reports and screenshots are saved in the gitignored `artifacts/` directory. See [docs/VALIDATION.md](docs/VALIDATION.md) for measured results and limitations.

## Before public launch

Supply the real domain and confirmed inbox, legal identity and approved privacy/terms, verified experience claims, approved case studies/articles, confirmed team composition and any real social links. Choose hosting and a durable inquiry destination, configure production request limits and retention, and test receipt handling in that environment. The site is implemented locally; it has not been deployed or connected to external business accounts.

Framework references used during setup: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) and [Tailwind's Next.js integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
