# T-114 Add Discovery Endpoint Smoke Assertions

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)

## Goal

Extend the unauthenticated public smoke path so deployed `/robots.txt` and
`/sitemap.xml` discovery endpoints are checked for status and minimal safe
content, giving T-103 through T-113 deployment evidence beyond unit tests and
build output.

## Context

- T-103 added baseline `robots.ts`/`sitemap.ts` discovery files for stable
  public routes.
- T-106, T-107, and T-112 added route-specific metadata and conservative
  structured data for public detail pages.
- T-113 expanded the sitemap with best-effort dynamic public detail URLs while
  preserving route rendering policy.
- F-085/R-030 remain partially mitigated only because deployed discovery
  endpoint smoke assertions are still missing.
- T-025 added `scripts/smoke-public-routes.mjs` and `npm run smoke:public`,
  but that script currently checks route status and admin denial only.

## Scope

- In scope:
  - Add `/robots.txt` and `/sitemap.xml` to the unauthenticated public smoke
    script.
  - Assert `200` responses for both endpoints.
  - Add minimal body checks that prove `robots.txt` references the public
    sitemap URL and `sitemap.xml` is XML-like sitemap output containing stable
    public URLs.
  - Keep content assertions conservative: avoid requiring a specific live
    dynamic detail record, product handle, Shopify availability, exact URL
    count, or ordering.
  - Ensure the smoke script fails if sitemap output includes obvious private,
    admin, account, or API paths.
  - Add focused tests for the smoke-script endpoint checks, including success
    and failure output.
  - Update deployment/testing/frontend workstreams and this task brief after
    completion.
- Out of scope:
  - Do not add production credentials, Vercel tokens, `.vercel` metadata, or
    secret-handling changes.
  - Do not run live production smoke unless explicitly asked by the
    orchestrator or owner.
  - Do not change `robots.ts`, `sitemap.ts`, metadata helpers, route rendering,
    route cache policy, or structured data output unless the smoke-script work
    exposes a narrow bug.
  - Do not automate credentialed/admin smoke, Vercel log inspection, CI
    scheduling, monitoring provider selection, or incident-response ownership.
  - Do not fix the existing Shopify fetch `cache` plus `next.revalidate`
    warning surfaced by build; route that as a separate task.

## Files Likely Touched

- `scripts/smoke-public-routes.mjs`
- New or existing focused tests under `__tests__/unit/deployment/`
- `docs/runbooks/deployment.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/tasks/T-114-add-discovery-endpoint-smoke-assertions.md`

## Acceptance Criteria

- `npm run smoke:public` checks `/robots.txt` and `/sitemap.xml` by default.
- Discovery endpoint failures produce actionable script output without dumping
  large response bodies.
- `robots.txt` body validation proves the sitemap link is present.
- `sitemap.xml` body validation proves stable public archive URLs are present
  and private/admin/account/API URLs are absent.
- Existing public smoke checks and optional detail route behavior continue to
  work.
- Deployment runbook documents that discovery endpoints are covered by the
  public smoke script and that dynamic detail URL presence still depends on
  approved records/upstream availability.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts
npm run smoke:public -- --help
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Completed by adding default `/robots.txt` and `/sitemap.xml` checks to
  `scripts/smoke-public-routes.mjs`.
- `robots.txt` validation checks for an absolute `Sitemap:` directive pointing
  at `/sitemap.xml`; it does not require the sitemap origin to match a preview
  alias because discovery currently uses the canonical public site URL.
- `sitemap.xml` validation checks XML-like `<urlset>` output, stable public
  `<loc>` paths, and excludes private `/admin`, `/account`, and `/api` URL
  paths without requiring dynamic detail records, ordering, or URL counts.
- Added `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` for
  success output, missing robots sitemap-directive failure output, no raw body
  dump on failure, and private sitemap path failure output.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`,
  `npm run smoke:public -- --help`, `npm run lint`, `npm run build`, and
  `git diff --check`.
- Build still surfaces the existing Shopify fetch `cache` plus
  `next.revalidate` warning on `/sitemap.xml`; cleanup remains separate by
  task scope.
- Keep Shopify fetch-cache warning cleanup, CI/scheduled smoke, monitoring,
  credentialed/admin smoke, and incident-response ownership separate.
