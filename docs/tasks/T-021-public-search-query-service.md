# T-021 Harden Public Search Query Service

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Validate and bound public search query input while moving the `/search` page
off same-app HTTP through a shared server-only search service.

## Why Now

F-060 remains open after the subscription and artwork-list slices. The search
route currently builds `new RegExp(query, "i")` directly from user input,
accepts unbounded `page` and `limit`, and ignores the fetcher's optional `type`
parameter. The `/search` page also calls `serverApi.public.search.search(...)`,
keeping a route-critical server render on same-app HTTP.

This task addresses:

- [F-060](../audits/findings-register.md): public search, artwork browse, and
  shop browse APIs need query parsing and bounds.
- [F-021](../audits/findings-register.md): route-critical server rendering
  still relies on same-app HTTP in multiple places.
- [F-049](../audits/findings-register.md): public list and search semantics are
  under-specified.
- [R-006](../risks/production-readiness.md): API validation/status/DTO drift
  remains open.
- [R-012](../risks/production-readiness.md): SSR/data-fetching patterns still
  need staged migration away from self-HTTP.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [ADR 0004 Server data access ownership](../decisions/0004-server-data-access-ownership.md)
- [T-018 Create artwork list server data service proof](T-018-artwork-list-server-data-proof.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Rendering and data fetching architecture](../architecture/rendering-and-data-fetching.md)

## Scope

In scope:

- Add a route/page-safe search query parser that trims and length-bounds `q`,
  validates optional `type` as `articles`, `blogs`, or `collections`, and
  bounds `page` and `limit`.
- Escape user search text before building a MongoDB regex or use an equivalent
  safe query strategy.
- Extract search query execution and DTO shaping into a server-only data
  service that owns `dbConnect()`.
- Update `GET /api/v2/public/search` to parse request query params, call the
  service, honor `type` if provided, return real 400 validation responses, and
  preserve a documented success envelope.
- Update `src/app/search/page.tsx` to call the server-only search service
  directly instead of `serverApi.public.search.search(...)`.
- Add focused service, API route, and page/loader tests proving invalid query
  handling, bounded pagination, `type` filtering, escaped regex input, and no
  live same-app `fetch` requirement for the server render path.
- Update this task, Data/API, Architecture, Frontend, Testing, findings, and
  risk notes after completion.

Out of scope:

- Do not change artwork browse or shop browse query parsing in this task except
  to document them as remaining F-060 follow-up.
- Do not redesign the search UI.
- Do not add search indexing, ranking, highlighting, or pagination controls.
- Do not migrate unrelated `serverApi` loaders.

## Concurrency

You are not alone in the repo. This task owns the public search route, search
page, new search data service/query parser, focused tests, and directly related
docs. Avoid admin collection write routes, package manifests, and artwork list
service files unless a tiny shared type import is unavoidable.

## Acceptance Criteria

- Invalid or missing search input returns stable behavior without throwing or
  building an unsafe regex.
- `q`, `type`, `page`, and `limit` are validated and bounded before database
  work.
- `type` filters the result sets returned by the route/service when provided.
- `/search` server rendering no longer calls same-app HTTP for initial results.
- Focused tests prove service, API route, and server-render behavior.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-search-test-files>
npm run lint
```

Run `npm test` if shared query parsing or route test setup is changed.

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getPublicSearchResults.test.ts __tests__/unit/api/publicSearchRoute.test.ts __tests__/unit/searchPage.test.tsx
npm test
npm run lint
npm run build
```

All commands passed. Full Jest still emits the pre-existing date utility
error-path console output tracked as expected test noise. Build still emits the
known Browserslist notice plus MongoDB/fetcher/debug output during static page
generation.

## Completion Notes

- Added `src/lib/data/schemas/searchSchema.ts` as the shared route/page query
  parser. It trims and length-bounds `q`, validates `type`, defaults optional
  `page`/`limit`, and rejects out-of-bounds pagination before database work.
- Added `src/lib/data/services/getPublicSearchResults.ts` as the server-only
  search service. It owns `dbConnect()`, escapes user text before building the
  MongoDB regex, honors `type`, applies bounded pagination, and returns the
  existing success envelope.
- Refactored `GET /api/v2/public/search` into a thin HTTP adapter with real 400
  validation responses and public-safe 500 failures.
- Updated `src/app/search/page.tsx` to parse query params and call the search
  service directly, removing the `serverApi.public.search.search(...)`
  same-app HTTP path for the initial server render.
- Added focused service, API route, and page tests proving escaped regex input,
  `type` filtering, bounded pagination validation, and no live same-app
  `fetch` requirement for the server render path.
- Artwork browse and shop browse query bounds remain the F-060 follow-up.

## Escalate

Escalate to the orchestrator if:

- Existing search UI behavior conflicts with honoring the `type` parameter.
- Search response metadata needs a broader API contract decision.
- Query escaping changes expected search semantics enough to require owner
  product input.
