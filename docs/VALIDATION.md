# Implementation validation

Validated locally on 20 September 2026 using Windows, Node.js 22.18.0, Next.js 16.3.5, React 19.3.0 and headless Microsoft Edge.

## Build and code checks

| Check | Result |
| --- | --- |
| Production build | Passed; no build warnings |
| TypeScript | Passed |
| ESLint | Passed; no warnings |
| Prettier | Passed |
| Unit/API test groups | 6 passed |
| Browser test groups | 18 passed across Edge, Firefox and WebKit (6 per browser) |
| PostgreSQL integration groups | 5 passed against an isolated real PostgreSQL 17 instance |
| Standalone production smoke check | Passed: static assets, routes, PostgreSQL API, duplicate handling and public filtering |
| Docker Compose configuration | Validated; container engine unavailable for image execution |

Unit/API checks cover all 300 supplied industry/goal/challenge combinations, valid unique capability references, draft/public filtering, input validation, concurrent duplicate local submissions, conflicting idempotency-key reuse, request size/type/origin checks, and honest storage-disabled failures.

Browser checks cover:

- All 42 preview page URLs return 200; internal link destinations resolve; invalid detail slugs return 404.
- Desktop and mobile navigation, keyboard Escape dismissal and return of focus, capability expansion and outcome dialogs.
- Real-estate recommendation generation, capability/industry prefill, per-step validation, preserved answers after going back, and a confirmed local submission.
- A simulated storage failure preserves answers and displays the actual error without a success message.
- Homepage horizontal overflow checks at 320, 375, 390, 430, 768, 1024, 1440 and 1920px.
- Mobile capability, industry, experience, team, article and contact pages at 320px.
- Reduced-motion scrolling behavior and a usable mobile wizard.
- Axe WCAG A/AA scans on desktop and mobile homepage and mobile contact; no violations in those audited states.

Desktop and mobile hero/full-page screenshots were generated and visually inspected. Generated files are in the gitignored `artifacts/` directory.

## Production Lighthouse results

Measured against `next start` at `http://localhost:3001`, with public content mode, Lighthouse 12.8.2 default mobile settings and a headless Edge browser. No hosted/CDN deployment was involved. These are local laboratory measurements, not guarantees of field performance.

| Route | Performance | Accessibility | Best practices | SEO | LCP | Blocking time | Layout shift |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 97 | 100 | 100 | 100 | 2.1 s | 150 ms | 0 |
| `/services/ai-automation` | 98 | 100 | 100 | 100 | 2.2 s | 120 ms | 0 |
| `/contact` | 96 | 100 | 100 | 100 | 2.3 s | 160 ms | 0 |

All measured routes exceed the brief's target thresholds. An earlier pass identified undersized supporting text and mobile finder contrast; these were corrected before the measurements above. Lighthouse needed execution outside the tool sandbox to connect to the browser debugging port.

Detailed reports: `artifacts/lighthouse-home.json`, `artifacts/lighthouse-services-ai-automation.json`, `artifacts/lighthouse-contact.json`, and `artifacts/lighthouse-summary.json`. Reproduce with the README's production audit commands.

## Publication and persistence boundaries

Production checks confirmed that a draft case study and a draft article return 404, the sitemap excludes draft experience, and robots rules exclude the API and unfinished legal pages. Local development includes labeled drafts for review; a public production build excludes those drafts and placeholder profiles.

Only verified statistics can appear. No supplied statistics have been marked verified. Pseudonymized team experience is distinguished from ODDESTACK company delivery.

The API stores local records and receipts successfully. Production PostgreSQL and external-storage webhook adapters are implemented. PostgreSQL tests verify concurrency, cross-instance rate limits, transactional rollback, notification retry and competing-worker leases. The standalone production API was tested end to end against PostgreSQL, including an origin-normalization fix found during that test. No externally hosted database, CRM, email or WhatsApp account has been connected or called. Production disables local file storage unless explicitly overridden for a local test.

## Remaining launch work and limits

- Confirm the actual domain, inbox ownership, social links, team composition, approved experience/article content and legal identity/policies.
- Configure durable production inquiry storage, trusted ingress/shared rate limiting, retention and the receiving team's response workflow.
- Replace the privacy and terms placeholders before collecting real public enquiries.
- Run deployment-specific checks after hosting is selected. Firefox and WebKit engine tests passed; physical Safari/other devices, assistive-technology sessions and real-user performance have not been tested here.
- Scores were measured in public mode, which excludes unpublished case studies and sample articles. The complete preview was tested functionally and responsively, but its larger content set has not been separately Lighthouse-scored.
- Local files are intended for development, not ephemeral/serverless persistence. No live deployment has been made.

The original source brief remains unchanged. The implementation plan and README document the application, content-editing model, local setup and production integration contract.

## Completion after the owner confirmed accounts are unavailable

The remaining independent implementation work is complete: durable PostgreSQL storage, notification outbox/worker, migrations, status and retention commands, standalone packaging, Docker definitions, launch-configuration reporting and cross-browser checks. See [DEPLOYMENT.md](./DEPLOYMENT.md). Business identity/content approval, legal-policy completion, a real domain/hosting destination and configured delivery accounts still require owner-supplied information; none has been invented or marked approved.
