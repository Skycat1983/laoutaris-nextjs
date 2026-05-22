# T-143 Decide Public Search Scope

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Record and implement the smallest safe public search scope decision: either make
`/search` a true site-wide search that includes artworks and shop products, or
make the visible UI and route copy explicit that search covers only articles,
blogs, and collections.

## Context

- A-017/F-098 found global public search excludes artworks and shop products
  even though the visible entry point reads like general site search.
- Extending search affects public DTOs, result rendering, Shopify product
  lookups, pagination/metadata, and tests.
- Narrowing search is a product/content decision because it changes visible
  discovery expectations.

## Scope

In scope:

- Decide and record the chosen launch scope in this task handoff.
- If site-wide search is chosen, update search schema, service, result types,
  rendering, and focused tests for artworks and shop products.
- If narrow search is chosen, update visible labels/copy and route behavior so
  users understand the current article/blog/collection scope, and provide clear
  links to artwork and shop discovery.
- Keep result copy free of checkout, sale, shipping, refund, or guarantee
  claims unless owner/legal-approved policy pages exist.
- Add or update focused tests for the chosen behavior.

Out of scope:

- Do not implement full search pagination UI unless explicitly included by the
  chosen scope and kept narrow.
- Do not change `/artwork` browse query parsing, sorted blog loading, nav
  fallbacks, visible breadcrumbs, or shop sorting.
- Do not add checkout/cart behavior or Shopify availability guarantees.
- Do not add a search provider or external indexing service.

## Concurrency

Can run in parallel with T-141 or T-142. Avoid running in parallel with another
task touching public search files.

Owned files when implementing the decision:

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/app/api/v2/public/search/route.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/*`
- focused search API/page/component tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/app/api/v2/public/search/route.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/SearchResultsSection.tsx`
- relevant public search tests under `__tests__/unit`
- `docs/tasks/T-143-decide-public-search-scope.md`

## Acceptance Criteria

- Public search scope is explicit in code, UI, and task handoff.
- If widened, artworks and shop products have typed result DTOs, visible result
  sections, and focused tests.
- If narrowed, the UI no longer implies site-wide search and directs users to
  artwork/shop discovery.
- Existing article, blog, and collection search behavior remains covered.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicSearchRoute.test.ts
git diff --check
```

Add focused page/component test paths to the command if the implementation
changes rendered search UI.

## Handoff Notes

- Prepared by T-140 after reconciling A-017.
- If the decision is not available, do not guess; update this task with the
  blocked decision state and next owner question instead of changing runtime
  behavior.
- 2026-05-22 orchestrator direction: use staged site-wide widening rather than
  copy-only narrowing. T-210 completed MongoDB-backed artwork results first
  because artwork discovery is core archive behavior. T-211 then completed the
  separate commerce-specific follow-up for Shopify product results, using the
  existing public shop product data path and avoiding checkout/cart or policy
  claims.
- Completed on 2026-05-22. Public search now includes articles, blogs,
  collections, artworks, and Shopify products, while checkout/cart, shop
  listing controls, commerce policy, and owner/legal work remain separate.
