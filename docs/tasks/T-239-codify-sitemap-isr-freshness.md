# T-239 Codify Sitemap ISR Freshness

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make `/sitemap.xml` freshness an explicit, source-owned one-hour ISR contract
without changing sitemap contents, public route rendering, generated params,
Shopify product behavior, or discovery smoke semantics.

## Context

- T-232 accepted a target one-hour freshness window for sitemap discovery.
- T-237 deferred sitemap work until after the second route-local cache proof.
- T-238 completed that second proof for the collections default redirect.
- Current post-T-238 build evidence already records `/sitemap.xml`
  `initialRevalidateSeconds: 3600`, but `src/app/sitemap.ts` does not declare a
  route-level freshness export. The current manifest value appears to be
  inherited from Shopify Storefront reads inside sitemap generation, where
  production `fetch()` uses `next.revalidate: 3600`.
- The next safe improvement is to make the sitemap route itself own the
  one-hour policy so later Shopify fetch-policy changes cannot silently change
  crawler freshness.

## Scope

In scope:

- Add an explicit sitemap freshness constant and route segment export in
  `src/app/sitemap.ts`, targeting `3600` seconds.
- Preserve the current stable and dynamic sitemap entry generation behavior.
- Preserve best-effort dynamic sitemap source fallback: Article, Blog, Artwork,
  Collection, and Shopify source failures must not fail the entire sitemap.
- Preserve robots output and public smoke discovery checks.
- Update focused route/cache policy and sitemap discovery tests so the accepted
  public revalidate surfaces are:
  - `/biography` default redirect at 10 minutes
  - `/collections` default redirect at 10 minutes
  - `/sitemap.xml` discovery output at 1 hour
- Update the rendering architecture notes after implementation.
- Record `npm run build` route output and `.next/prerender-manifest.json`
  evidence for `/sitemap.xml`.

Out of scope:

- Do not change sitemap URL coverage, priorities, change frequencies,
  `lastModified` behavior, deduping, safe path filtering, or private path
  filtering.
- Do not change Shopify fetch policy, Shopify transforms, product availability,
  product detail rendering, checkout/cart behavior, or commerce copy.
- Do not add `dynamic = "force-dynamic"`, `force-static`, `no-store`, cache
  tags, `revalidatePath`, `revalidateTag`, or `generateStaticParams()`.
- Do not add route-level `revalidate` to blog, artwork, search, shop, account,
  admin, collection detail, or biography detail routes.
- Do not split the sitemap by source or create sitemap indexes.
- Do not move root providers, modal providers, session ownership, or client
  islands.

## Concurrency

Run after T-238. Do not run in parallel with sitemap source edits, Shopify
fetch-policy edits, route-cache policy edits, public discovery smoke edits, or
broader public static/ISR work.

Owned files:

- `src/app/sitemap.ts`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `__tests__/unit/deployment/publicMetadataDiscovery.test.ts`
- `__tests__/unit/deployment/publicDynamicSitemap.test.ts`
- `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` only if
  smoke expectations need a narrow guard update
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- `src/app/sitemap.ts` explicitly owns a one-hour route freshness policy.
- Sitemap output still includes stable public routes plus safe best-effort
  dynamic detail URLs, with private/admin/account/API paths excluded.
- Existing dynamic sitemap failure isolation is preserved.
- `/sitemap.xml` remains prerendered static output with
  `initialRevalidateSeconds: 3600` in the prerender manifest.
- `/robots.txt` behavior remains unchanged.
- No public page, detail route, API route, Shopify route, account route, admin
  route, provider, or client island behavior changes.
- Tests prevent broad route-level ISR drift outside the accepted biography,
  collections, and sitemap surfaces.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts
npm run build
node -e "const m=require('./.next/prerender-manifest.json'); console.log(JSON.stringify(m.routes['/sitemap.xml'], null, 2));"
git diff --check
```

If a deployed or local production base URL is available, also run:

```bash
npm run smoke:public -- --base-url=<base-url>
```

Record when that smoke command is not run because no deployed/local production
URL is available.

## Result

- `src/app/sitemap.ts` now exports `SITEMAP_REVALIDATE_SECONDS = 3600` and
  `revalidate = SITEMAP_REVALIDATE_SECONDS`, making `/sitemap.xml` one-hour
  ISR freshness source-owned.
- Sitemap content behavior remains unchanged: stable public routes still lead
  the output, dynamic Article, Blog, Artwork, Collection, and Shopify entries
  remain best-effort, and private/admin/account/API paths remain excluded.
- Focused cache-policy tests now guard the accepted route-level `revalidate`
  surfaces as `/biography`, `/collections`, and `/sitemap.xml`.
- Build route output kept `/sitemap.xml` static:
  `○ /sitemap.xml 0 B 0 B`.
- `.next/prerender-manifest.json` evidence for `/sitemap.xml`:
  `initialRevalidateSeconds: 3600`, `srcRoute: "/sitemap.xml"`,
  `dataRoute: null`.

## Verification Run

- `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
  passed: 4 suites, 18 tests. Existing `punycode` deprecation warnings still
  appeared.
- `npm run build` passed.
- `node -e "const m=require('./.next/prerender-manifest.json'); console.log(JSON.stringify(m.routes['/sitemap.xml'], null, 2));"`
  reported `initialRevalidateSeconds: 3600`.
- `git diff --check` passed.
- `npm run smoke:public -- --base-url=<base-url>` was not run because no
  deployed or local production base URL was provided for this task.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-238.
- T-239 should make the sitemap's current one-hour manifest behavior explicit
  in source. It should not broaden into sitemap content expansion, Shopify
  cache changes, generated params, blog caching, provider work, or monitoring.
