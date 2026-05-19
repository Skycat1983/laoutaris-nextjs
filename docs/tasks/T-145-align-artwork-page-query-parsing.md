# T-145 Align Artwork Page Query Parsing

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make the server-rendered `/artwork` page use the shared artwork list query
schema so page defaults, filters, and sort values match the public artwork API.

## Context

- A-017/F-099 found `/artwork` manually casts `searchParams` and defaults
  `sortBy` to `colorProximity`.
- The public artwork API uses `parseArtworkListQuery`, whose default sort is
  `mostRecent` and whose enums/limits reject unsupported values.
- T-035 already bounded public artwork browse query parsing at the API
  boundary; the page should not maintain a second parser with different
  defaults.
- Existing `ArtworkListLoader` tests prove loader/service behavior and can be
  extended or complemented by a page-level test.

## Scope

In scope:

- Convert App Router `searchParams` into `ArtworkListQueryInput` using a shared
  adapter or equivalent schema-driven path.
- Use `parseArtworkListQuery` for `/artwork` page defaults and validated
  values before passing props into `ArtworkListLoader`.
- Preserve valid multi-value filters for decade, art style, medium, and
  surface.
- Decide a narrow invalid-query behavior for the page, such as falling back to
  safe defaults or rendering a stable error/empty state, and cover it in tests.
- Add focused tests proving page/API query parity for default sort, filter mode,
  multi-value filters, invalid enum handling, and page bounds.

Out of scope:

- Do not change public artwork API route behavior unless a shared adapter fix
  requires it.
- Do not change artwork gallery UI, infinite loading, color matching, or
  filter component design.
- Do not alter public search scope, sorted blog loading, navigation fallbacks,
  or taxonomy launch policy.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-144 and T-146 because it owns only `/artwork` page
query parsing, a shared query adapter if needed, and focused tests.

Owned files:

- `src/app/artwork/page.tsx`
- `src/lib/data/schemas/artworkListQuerySchema.ts` only if an App Router
  adapter is needed
- focused `/artwork` page or artwork list query tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/artwork/page.tsx`
- `src/lib/data/schemas/artworkListQuerySchema.ts`
- `__tests__/unit/pages/ArtworkPage.test.tsx`
- `__tests__/unit/loaders/ArtworkListLoader.test.tsx`
- `docs/tasks/T-145-align-artwork-page-query-parsing.md`

## Acceptance Criteria

- `/artwork` page defaults match the shared query schema, including
  `sortBy: "mostRecent"` when no sort is supplied.
- Valid filters and sort parameters passed through the URL reach
  `ArtworkListLoader` in the same normalized shape as the API service path.
- Invalid query values no longer create unvalidated loader props.
- Focused tests cover parity and invalid-query behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/pages/ArtworkPage.test.tsx __tests__/unit/loaders/ArtworkListLoader.test.tsx
git diff --check
```

Adjust the test path if the implementation extends an existing page/query test
instead of adding `ArtworkPage.test.tsx`.

## Handoff Notes

- Prepared after T-141/T-142 reconciliation from A-017/F-099.
- If invalid page-query behavior reveals a product decision, record the blocker
  here rather than broadening the task into search UX work.
- Completed implementation:
  - `/artwork` now parses App Router `searchParams` through
    `parseArtworkListQuery` before constructing `ArtworkListLoader` props.
  - `ArtworkListQueryInput` accepts App Router single-string or repeated-array
    filter params while preserving the existing URLSearchParams API adapter.
  - Invalid page queries fall back to the shared schema defaults rather than
    passing unvalidated values to the loader.
  - Added focused `/artwork` page coverage for default sort/filter mode,
    normalized valid filters, invalid enum fallback, and pagination bounds.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/pages/ArtworkPage.test.tsx __tests__/unit/loaders/ArtworkListLoader.test.tsx`
    passed.
  - `npm test -- --runTestsByPath __tests__/unit/api/publicArtworkListRoute.test.ts`
    passed.
  - `git diff --check` passed.
- Candidate tracker updates:
  - Frontend Routes And Components / Data Models And API / Testing And Quality:
    note T-145 completion and that `/artwork` page/API query parsing is now
    aligned for defaults, valid normalized filters, invalid enums, and page
    bounds.
