# T-151 Add Current-Scope Search Empty And Pagination States

Status: Planned

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make `/search` render honest empty and pagination states for its current
supported content types without deciding the broader site-wide search scope.

## Context

- T-021 moved `/search` initial rendering to `getPublicSearchResults()` and
  bounded `q`, `type`, `page`, and `limit`.
- A-017/F-049 found `/search` still omits a visible no-results state and exposes
  `page`/`limit` parsing without result metadata or UI pagination.
- F-098/T-143 separately owns the decision of whether public search is
  site-wide and should include artworks and Shopify products. That decision is
  intentionally not part of this task.
- Current supported search types are `articles`, `blogs`, and `collections`.

## Scope

In scope:

- Add a visible no-results state when a valid current-scope search returns no
  articles, blogs, or collections.
- Add a visible no-results state for selected-type searches such as
  `type=articles` when that type has no matches.
- Add backed search metadata for the current supported types, such as `page`,
  `limit`, total counts, and has-more state.
- Render pagination only where the metadata makes the behavior honest. If a
  single selected `type` is needed for unambiguous pagination, keep all-type
  pagination conservative and do not fake global controls.
- Preserve existing query parsing, invalid-query messages, result links, and
  current result cards.
- Add focused tests for no-results rendering, selected-type empty rendering,
  and pagination metadata/UI behavior.

Out of scope:

- Do not add artwork or Shopify product search.
- Do not relabel `/search` as site-wide or content-only unless T-143 has been
  answered.
- Do not add a search index, external provider, autocomplete, or ranking
  algorithm changes.
- Do not change unrelated public browse filters or shop/artwork list
  pagination.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-150 and T-152 because it owns public search service,
types, page rendering, and focused search tests.

Owned files:

- `src/lib/data/services/getPublicSearchResults.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/SearchResultsSection.tsx`
- focused search tests under `__tests__/unit/`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/lib/data/services/getPublicSearchResults.ts`
- `src/lib/data/types/searchTypes.ts`
- `src/app/search/page.tsx`
- `src/components/modules/search/SearchResultsSection.tsx`
- `__tests__/unit/searchPage.test.tsx`
- `__tests__/unit/data/getPublicSearchResults.test.ts`
- `docs/tasks/T-151-add-current-scope-search-empty-pagination.md`

## Acceptance Criteria

- Valid searches with zero current-scope matches render an explicit no-results
  message instead of an empty content area.
- Selected-type searches with zero matches render an explicit selected-type
  no-results message.
- Any visible pagination controls are backed by service/API metadata and do not
  imply unsupported artwork or shop search.
- Focused tests cover the empty and pagination behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/searchPage.test.tsx __tests__/unit/data/getPublicSearchResults.test.ts
git diff --check
```

Run `npm run lint` if shared public search types or page rendering change.

## Handoff Notes

- Prepared after T-147 through T-149 reconciliation.
- Candidate shared-tracker update: mark the F-049/A-017 no-results and
  current-scope pagination gap partially or fully mitigated, while keeping
  F-098/T-143 search-scope decision open.
