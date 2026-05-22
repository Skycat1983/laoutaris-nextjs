# T-210 Add Artwork Results To Public Search

Status: Planned

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Expand the public `/search` route to include archive artwork results as the
first staged implementation step toward resolving the site-wide search gap.

## Context

- A-017/F-098 found the global public search entry point excludes artworks and
  Shopify products even though those are core archive and commerce discovery
  surfaces.
- T-143 recorded the broader public search scope decision. The orchestrator is
  now choosing staged widening rather than a fallback copy-only narrowing:
  start with MongoDB-backed artwork results, then handle Shopify product search
  as a separate commerce-specific slice.
- Existing public search supports articles, blogs, and collections through
  `src/lib/data/services/getPublicSearchResults.ts`,
  `src/lib/data/schemas/searchSchema.ts`, `src/lib/data/types/searchTypes.ts`,
  `/api/v2/public/search`, and `src/app/search/page.tsx`.
- Artworks already have a MongoDB model, public detail route
  `/artwork/[artworkId]`, Cloudinary image data, and existing public artwork
  service/fetcher coverage.

## Scope

In scope:

- Add `artworks` as a valid public search type in the search schema, shared
  search types, API parsing, and page type labels.
- Query `ArtworkModel` in `getPublicSearchResults` with escaped regex input and
  the same page/limit behavior used by the existing result types.
- Search at least `title`, and include conservative exact-field matching for
  safe taxonomy fields if useful, such as `decade`, `artstyle`, `medium`, and
  `surface`.
- Map artwork results into the existing `SearchResultItem` shape with:
  - `title`,
  - an artwork detail `linkTo` under `/artwork/[artworkId]`,
  - `imageUrl` from the sanitized stored Cloudinary image URL when present,
  - neutral subtitle/summary text derived from archive metadata only.
- Render artwork sections and selected-type artwork pagination on `/search`
  using the existing `SearchResultsSection` and `SearchPagination` patterns.
- Update empty-state copy so all-types search mentions artworks alongside
  articles, blogs, and collections.
- Add focused service, API, and page/component coverage for all-types artwork
  results, selected `type=artworks`, unsupported type validation changes, and
  empty states.
- Update this task brief and linked workstreams after completion.

Out of scope:

- Do not add Shopify product search in this task.
- Do not call Shopify from public search.
- Do not change shop product list sorting, pagination, checkout, purchase
  handoff, or commerce claims.
- Do not change `/artwork` browse query parsing, filters, sorting, route cache
  policy, or artwork detail behavior.
- Do not add an external search provider, indexing service, autocomplete, or
  fuzzy ranking.
- Do not redesign the search results page beyond the additions needed to render
  artwork results.

## Concurrency

Run this task alone with other work touching public search schema, search
service, search page rendering, or public search tests.

Owned files:

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/app/api/v2/public/search/route.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/SearchResultsSection.tsx` only if needed
- focused public search tests
- this task brief handoff section

If assigned in parallel, leave shared trackers to orchestrator reconciliation:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/schemas/searchSchema.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/lib/data/services/getPublicSearchResults.ts`
- `src/app/search/page.tsx`
- `__tests__/unit/data/getPublicSearchResults.test.ts`
- `__tests__/unit/api/publicSearchRoute.test.ts`
- focused search page/component tests if page rendering changes need new
  coverage
- `docs/tasks/T-210-add-artwork-results-to-public-search.md`

## Acceptance Criteria

- `/api/v2/public/search?q=...` searches artworks along with articles, blogs,
  and collections by default.
- `/api/v2/public/search?q=...&type=artworks` is valid and returns only artwork
  results plus artwork metadata.
- Unsupported search type validation mentions the complete supported type set.
- `/search?q=...` can render an Artworks section with links to artwork detail
  pages.
- Selected `type=artworks` pages render artwork results, no-results copy, and
  pagination consistently with existing selected-type behavior.
- Existing article, blog, and collection search behavior remains covered.
- Shopify product search remains explicitly out of scope and is not implied by
  result copy.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/api/publicSearchRoute.test.ts
npm run lint
git diff --check
```

Add any focused page/component test paths touched by the implementation before
handoff.

## Agent Prompt

You are working on T-210. Read `AGENTS.md`, `docs/README.md`, F-098 in
`docs/audits/findings-register.md`, R-016 in
`docs/risks/production-readiness.md`, T-143 for the broader search-scope
decision context, and the frontend/data/testing workstreams. Add MongoDB-backed
artwork results to public search as the first staged site-wide search expansion.
Do not add Shopify product search, call Shopify, change artwork browse filters,
change commerce behavior, or introduce a search provider. Preserve existing
article/blog/collection search behavior and run the verification commands, then
update this handoff with what changed and list candidate shared-tracker updates.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-22 after T-209 completed.
- This is the next meaningful owner-independent discovery slice because it
  addresses the high-value archive side of F-098 without blocking on Shopify
  product-search scope or legal/commerce policy decisions.
