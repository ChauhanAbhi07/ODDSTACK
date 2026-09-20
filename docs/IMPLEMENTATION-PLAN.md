# ODDESTACK website implementation plan

Status: implemented locally; production integration and business-content approval remain before public launch. See [validation results](./VALIDATION.md) and [setup instructions](../README.md).

Prepared: 20 September 2026.

Source: [Original website brief](./ODDESTACK-WEBSITE-BRIEF.txt), preserved unchanged from the supplied document.

## 1. Scope and starting point

Build the complete ODDESTACK website described in the brief: an integrated business growth, technology, and intelligence company with an original identity and functional interactive experiences.

The original planning request authorized saving the brief and preparing this plan. The user subsequently authorized implementation; the application now follows the scope below.

Workspace inspection found:

- `C:\Abhishek\ODDSTACK` was empty before these documents were added.
- No application, package manifest, dependencies, or Git repository exists yet.
- No applicable `AGENTS.md` was found in the workspace or its parent directories.
- No resumes, existing brand assets, verified case studies, or production integration credentials were supplied.

Use **ODDESTACK** as the official brand spelling even though the workspace directory is named `ODDSTACK`.

## 2. Product and visual direction

The first screen should make the proposition clear within approximately ten seconds: one team brings together AI, technology, creative, growth, commerce, data, and operations to solve business problems.

Initial design direction:

- Hero: “Your business doesn't need another agency. It needs a better stack.”
- Primary action: **Build Your Stack**, linking to the project wizard.
- Secondary action: **Explore Capabilities**, linking to the homepage stack builder.
- Near-black background, warm off-white text, muted supporting text, and acid lime `#C7FF3D` as the main accent.
- A strong ODDESTACK wordmark and a simple offset-layer symbol, implemented with typography and SVG.
- Fluid oversized headings, readable body copy, restrained hairlines, and consistent spacing tokens.
- A connected stack visual built with CSS/SVG and small motion effects; no decorative WebGL dependency.
- Alternate editorial layouts, interactive sections, typographic moments, and varied case-study treatments.
- Geometric or initial-based team artwork; no fabricated photographic headshots.

Establish tokens and a representative hero, button, card, and form field before building all page sections. Check the visual system at desktop and mobile sizes during this first pass.

## 3. Application architecture

Use the requested Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons. Check official documentation and compatible stable versions when scaffolding; record the selected versions in the package manifest and lockfile. Add shadcn/ui only if an accessible primitive materially reduces implementation work.

Use Server Components for content and route templates. Limit Client Components to the menu, motion wrappers, selectors, drawers, recommendation flow, and project wizard. Keep content and business rules independent from presentation.

Proposed structure:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    services/page.tsx
    services/[slug]/page.tsx
    solutions/page.tsx
    industries/page.tsx
    industries/[slug]/page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    team/page.tsx
    insights/page.tsx
    insights/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    privacy/page.tsx
    terms/page.tsx
    api/inquiries/route.ts
    robots.ts
    sitemap.ts
    not-found.tsx
    error.tsx
  components/
    layout/
    ui/
    sections/
    stack-builder/
    solution-finder/
    project-wizard/
  data/
    navigation.ts
    services.ts
    solutions.ts
    industries.ts
    team.ts
    case-studies.ts
    articles.ts
    stats.ts
    engagements.ts
    process.ts
  lib/
    content-types.ts
    recommendations.ts
    inquiry-schema.ts
    inquiries/
    seo.ts
  config/
    site.ts
public/
  brand/
  artwork/
tests/
  unit/
  e2e/
docs/
```

Introduce reusable primitives for containers, section headings, buttons/links, tags, cards, form fields, step indicators, accessible disclosures, and dialogs. Build shared navigation, footer, breadcrumbs, content templates, and restrained reveal components.

Typed content records should include stable IDs/slugs, display copy, related record IDs, metadata, and publication status. Case studies and statistics also need attribution and verification fields. Team records need an explicit profile type: pseudonymized supplied profile or placeholder. Keep the public content selector responsible for excluding unpublished material from pages, metadata, and sitemaps.

## 4. Delivery phases

### Phase 1 — Foundation and visual system

1. Scaffold the application in this workspace and add a reproducible dependency lockfile.
2. Configure TypeScript, linting, formatting, local scripts, environment examples, and ignored local artifacts.
3. Create site configuration for brand name, domain, public email, optional social links, and pricing visibility.
4. Implement design tokens, optimized fonts, focus states, reduced-motion defaults, and layout primitives.
5. Build the shared header and footer, including a mobile fullscreen menu with correct focus handling.
6. Create the hero and stack artwork to establish the design direction.

Exit criteria: the app builds; shared navigation works with keyboard and touch; the first screen communicates the business clearly at 390px and 1440px; no missing assets or overflow at 320px.

### Phase 2 — Structured content and route templates

1. Model the ten capability groups and their service lists from the brief.
2. Populate eight outcome solutions, eight priority industries, seven case-study drafts, twelve team profiles, six article drafts, six process steps, and four engagement models.
3. Preserve the separate solution-finder industry choices, including Professional Services and Other; define explicit mappings to relevant industry content rather than relying on labels matching.
4. Build all overview and detail templates listed in the route matrix below.
5. Add related content links, breadcrumbs, metadata helpers, and proper missing-slug behavior.
6. Label supplied experience as collective team experience and distinguish unverified draft content from publishable facts.

Exit criteria: every planned route renders; slug relationships resolve; invalid slugs show a real 404; content is stored outside UI components; no invented proof is presented as verified.

### Phase 3 — Complete homepage

Implement all sixteen sections from the brief in this order:

| Section | Planned behavior |
| --- | --- |
| Navigation | Sticky header with a restrained opaque/blurred scroll state and fullscreen mobile menu |
| Hero | Fluid headline, connected capability artwork, subtle pointer response, two working CTAs |
| The problem | Vendor fragments converge into one stack on scroll; static readable fallback |
| Interactive stack builder | Ten expandable capability groups with complete service lists |
| Smart solution finder | Industry, goal, challenge, and recommendation steps |
| Solutions by outcome | Eight cards opening accessible detail drawers with relevant capabilities and a contact CTA |
| Industry solutions | Industry switching with relevant services and detail-page links |
| Experience behind the stack | Explicit collective-experience attribution and publication-controlled statistics |
| Selected experience | Varied case-study layouts linking to full detail pages |
| Team | Pseudonymized and clearly marked placeholder profiles with abstract artwork |
| How ODDESTACK works | Understand, design the stack, build, launch, learn, and scale |
| One team vs many vendors | Interactive comparison with a readable semantic table/list fallback |
| Engagement models | Project, Growth Retainer, Managed Stack, and Transformation; pricing disabled initially |
| Insights | Categorized article previews with functional detail links |
| Final CTA | “Let's make your stack a little odd.” and configurable contact email |
| Contact/project wizard | Full project wizard embedded using the same component as `/contact` |

Exit criteria: all sections contain working content and destinations; hierarchy and layout vary across the page; mobile ordering and spacing are designed deliberately.

### Phase 4 — Recommendation engine and interaction completion

The stack builder is an explorable service interface. The solution finder recommends an assembled stack based on the visitor's business needs.

1. Define typed industry, goal, and challenge identifiers.
2. Provide a curated challenge list for each goal, with an “Other” free-text option.
3. Map goals to base capabilities and industries/challenges to explicit additions or priorities.
4. Deduplicate recommendations and attach short reasons explaining how each element addresses the selected need.
5. Support back navigation, changing answers, and a complete reset without leaving stale recommendations.
6. Carry the recommendation into the project wizard using stable, validated IDs. Keep personal data out of URL parameters.
7. Provide a generic useful recommendation for Other/unmapped combinations; do not imply an LLM generated the result.
8. Add subtle magnetic CTAs, hover feedback, a marquee, eligible counters, section reveals, process motion, and lightweight page-entry transitions.

No external AI API is needed. Pointer effects run only on suitable devices, animation work stays scoped to visible sections, and reduced-motion users receive the same information without movement. A scrolling marquee must offer pause behavior or stop automatically.

Exit criteria: all ten finder goals produce coherent results; the brief's real-estate lead-generation example is represented; recommendations reach the contact flow intact; all controls work without hover or a mouse.

### Phase 5 — Project wizard and inquiry API

Group the eleven requested questions into five manageable steps:

1. Intent and capabilities.
2. Industry and company size.
3. Budget and timeline, including undecided options.
4. Project description.
5. Name, company, email, optional phone/WhatsApp, and review before submission.

Validate each step and the complete payload on the server. Preserve answers when moving back, identify errors next to fields, focus the relevant error, and announce submission state accessibly. Prefill capabilities from the solution finder or a service/industry CTA where appropriate.

Implement `POST /api/inquiries` with a typed persistence adapter:

- Local development: write submissions to gitignored local per-record JSON files and return a receipt ID. The implementation uses atomic records instead of the initially proposed JSONL file to support concurrent idempotent retries. Local filesystem persistence is for development only.
- Production: connect a durable database or approved CRM adapter before enabling live collection. Do not silently fall back to a local file on a hosted production deployment.
- Use request-size limits, validation, an anti-spam honeypot, deployment-appropriate rate limiting, and idempotency to avoid duplicate records on retries.
- Return explicit validation, unavailable-storage, and retryable error responses without exposing sensitive details.
- Do not log complete contact payloads or embed credentials in client code.
- Show the requested success message only after persistence succeeds. In local mode, clearly state that the brief was saved locally and was not sent to the business.
- Keep optional email, CRM, and WhatsApp delivery behind server-side adapters, separate from successful record storage.

Exit criteria: valid submissions persist locally; invalid submissions fail safely; an unavailable storage adapter produces an honest failure state; a repeated submission does not create duplicates; no false delivery confirmation appears.

### Phase 6 — SEO, accessibility, performance, and verification

1. Add route-specific titles/descriptions, canonical URLs, OpenGraph and Twitter cards, a branded social image, sitemap, and robots rules.
2. Add Organization, Service, and Article structured data where the actual published content supports it. Do not invent locations, authors, publish dates, or credentials.
3. Use optimized image handling for raster assets, appropriately sized SVG artwork, optimized fonts, and deferred nonessential interactive code.
4. Audit semantic landmarks, heading order, contrast, skip links, form labels, focus visibility, accessible drawer/menu behavior, and reduced motion.
5. Run responsive checks at 320, 375, 390, 430, 768, 1024, 1440, and 1920px. Check menu, hero, selectors, tables, cards, and every wizard step for overflow and usable touch targets.
6. Run the lint command, TypeScript checks, and a production build.
7. Run focused automated tests for recommendation rules, content relationships/publication filtering, payload validation, and inquiry persistence/error/idempotency behavior.
8. Run browser tests covering navigation, deep links/404s, mobile menu, dialogs, stack disclosures, finder-to-wizard handoff, wizard validation/back navigation, and submission success/failure.
9. Check internal links and use automated accessibility checks plus manual keyboard and reduced-motion passes.
10. Run Lighthouse against the production build on representative home, detail, and contact routes. Target Performance >90, Accessibility >95, Best Practices >95, and SEO >95; record conditions and actual results rather than claiming these targets in advance.

Exit criteria: required checks pass, high-impact usability issues are resolved, and any remaining measured performance limitations are documented.

### Phase 7 — Handoff and launch readiness

1. Add a README with setup, development, production build/start, validation scripts, environment settings, and deployment notes.
2. Document content editing, publication controls, pricing enablement, inquiry adapter configuration, and local-data cleanup.
3. Provide the requested architecture, route, reusable-component, interaction, responsive, and SEO summaries.
4. List unresolved real-business inputs explicitly. A functional development build can be delivered before those inputs arrive; public launch readiness requires resolving the relevant items below.

## 5. Route matrix

| Route | Content and behavior |
| --- | --- |
| `/` | Complete sixteen-section homepage |
| `/services` | Ten capability groups and their relationships |
| `/services/[slug]` | Capability explanation, service list, relevant outcomes/work, and prefilled contact CTA |
| `/solutions` | Eight outcome-led solutions and accessible detail drawers |
| `/industries` | Eight priority industry summaries |
| `/industries/[slug]` | Industry needs, recommended stack, related capabilities, and contact CTA |
| `/work` | Collective-experience index with transparent attribution |
| `/work/[slug]` | Challenge, stack, solution, capabilities, architecture/process visual, and substantiated qualitative outcome |
| `/team` | Seven supplied pseudonymized profiles and five explicit placeholders |
| `/insights` | Article index with category filters |
| `/insights/[slug]` | Complete draft article body and related reading; clearly marked sample content until publishable |
| `/about` | Brand story, integrated delivery proposition, and working process |
| `/contact` | Standalone project wizard with optional recommendation prefill |
| `/privacy` | Clearly marked policy placeholder until business-specific policy is supplied |
| `/terms` | Clearly marked terms placeholder until business-specific terms are supplied |
| `/api/inquiries` | Validated submission endpoint with local and production storage boundaries |

The planned content produces **42 initial page URLs**: 11 fixed pages plus 10 capability, 8 industry, 7 case-study, and 6 article detail pages, before any publication filtering. The API and generated SEO endpoints are additional endpoints.

## 6. Content credibility and publication rules

- Treat the supplied 250+ APIs, 12+ applications, 100+ screens, 50+ videos, and 30+ voice sessions as proposed claims awaiting verification. Retain them in draft data, label their intended attribution as collective team experience, and omit them from the public production view until verified.
- Do not transform individual experience into ODDESTACK customer history. Case-study pages must state their collective-experience basis and avoid employer or unapproved customer identifiers.
- Describe qualitative outcomes only when supported by the brief or later evidence. Do not invent metrics, testimonials, awards, revenue, certifications, founding dates, or offices.
- Preserve the seven supplied pseudonyms and identify them as pseudonyms. Mark the five additional profiles as placeholders in preview content; exclude them from the public production view unless replaced with confirmed profiles.
- Use complete sample articles for development, marked as samples. Do not fabricate real authorship or publishing history.
- Keep social URLs unset until supplied; render no dead `#` social links.
- Present finance/accounting capabilities as operations and process support, consistent with the brief.
- Production builds must have an explicit publication policy; unverified content must not enter structured data or the sitemap through a separate code path.

## 7. Configuration and business inputs

Planned application settings, with exact adapter credentials determined by the selected deployment:

| Setting | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical deployment URL; localhost during development |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Displayed contact address; brief supplies `hello@oddestack.com`, ownership to be confirmed |
| `INQUIRY_STORAGE_DRIVER` | Server-only adapter selector; local development default |
| `INQUIRY_LOCAL_PATH` | Server-only local submission path; defaults to a gitignored data file |
| `CONTENT_MODE` | Server-only preview/public selection; production defaults to public |

No LLM API key is required. Keep pricing visibility and unfilled social links in site/content configuration. Add database or CRM credentials only when a specific production adapter is chosen, and document them in `.env.example` without secret values.

Business inputs needed before public launch:

- Confirmed domain, inbox, social profiles, legal entity details, and approved brand assets if available.
- Verified collective-experience claims and permission to publish anonymized project descriptions.
- Confirmed team composition and decisions on public pseudonyms and placeholder replacements.
- Approved article copy and real author/date information where applicable.
- Hosting choice, durable inquiry destination, responsible inquiry recipient, and spam-control configuration.
- Business-specific privacy/terms copy, retention policy, and any selected analytics/consent requirements.

Development should proceed with explicit placeholders and safe defaults; these missing inputs should not block visual design, page implementation, or local functional testing.

## 8. Definition of done

- Every route and homepage section in this plan is implemented, with no dead CTAs or incomplete article/detail views in preview mode.
- The stack builder, recommendation engine, comparison, industry selector, and project wizard are functional on mobile and desktop.
- Local submissions persist through the API, with verified validation, failure, and retry behavior.
- Content is typed, reusable, and ready for later CMS migration.
- Accessibility, responsive, build, lint, type, browser, link, and performance checks have recorded results.
- Public content uses accurate attribution and excludes unapproved placeholders and claims.
- Documentation clearly separates a complete local implementation from remaining production integrations and business approvals.

Execution order: foundation → content/templates → complete homepage → interaction completion → inquiry API → verification → handoff. Make each phase runnable before moving on, and keep this plan updated with actual completion evidence during implementation.

## 9. Implementation outcome

All seven development phases have been carried out locally. The application includes the complete homepage, all 42 preview page URLs, structured content, interactive tools, validated inquiry persistence, SEO and responsive behavior. Build, lint, type, formatting, unit/API and browser checks passed. Final Lighthouse performance scores were 97 (home), 98 (capability detail), and 96 (contact); accessibility, best practices and SEO scored 100 on each audited route.

See [VALIDATION.md](./VALIDATION.md) for exact coverage, conditions and remaining launch work. Local persistence uses atomic per-record JSON instead of the original JSONL proposal. CSS/SVG artwork replaces the need for external raster assets. Draft content and unverified statistics remain publication-controlled. The follow-up completion added tested PostgreSQL persistence, a retryable notification queue, operations commands, standalone/Docker deployment preparation, and Firefox/WebKit validation. The owner confirmed no hosting/domain/business accounts are available yet; actual publication and live account configuration remain pending those inputs. See [DEPLOYMENT.md](./DEPLOYMENT.md).
