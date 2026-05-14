# T-018 Create Artwork List Server Data Service Proof

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make the `/artwork` list page and the public artwork list API share a direct
server-only data service, proving the ADR 0004 pattern without relying on
same-app HTTP from the server loader.

## Why Now

T-007 proved the ADR 0004 pattern for one product-detail linked-artwork read,
but the main `/artwork` route still uses `ArtworkListLoader -> serverApi ->
/api/v2/public/artwork`. The API route owns the list query, transformation, and
pagination behavior, while the server loader calls it over same-app HTTP even
after calling `dbConnect()`.

This task addresses:

- [F-021](../audits/findings-register.md): server-side data access has
  competing ownership models and relies on same-app HTTP self-fetching.
- [R-010](../risks/production-readiness.md): architecture ownership boundaries
  remain audited but not implemented.
- [R-012](../risks/production-readiness.md): SSR/data-fetching patterns still
  need the broader `/artwork` proof route before broad refactors.

## Read First

- [ADR 0004 Server data access ownership](../decisions/0004-server-data-access-ownership.md)
- [Rendering and data fetching architecture](../architecture/rendering-and-data-fetching.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [T-007 Fix shop product detail linked artwork fetching](T-007-shop-product-detail-linked-artwork-fetching.md)

## Scope

In scope:

- Extract the public artwork list query, sorting, color-proximity handling,
  pagination, user-context transformation, and result metadata into a
  server-only data service under the existing data/service conventions.
- Update `GET /api/v2/public/artwork` to parse request search params, call the
  service, and preserve the current `ApiArtworkListResult` success/error
  envelope.
- Update `ArtworkListLoader` to call the server-only service directly instead
  of `serverApi.public.artwork.multiple`.
- Preserve current filter, sort, pagination, and gallery rendering behavior
  unless a bug is required to make the service testable.
- Remove route/loader debug logs that are directly touched by this refactor.
- Add focused tests for the service and route behavior, plus a loader/page
  proof that the server render path does not require a live `localhost:3000`
  same-app fetch.
- Update this task, Architecture, Data/API, Testing, findings, and risk notes
  after completion.

Out of scope:

- Do not migrate every `serverApi` loader in this task.
- Do not redesign artwork browsing, filters, sorting, or pagination.
- Do not solve the broader public search/shop browse query-bounds finding
  [F-060](../audits/findings-register.md), except for minimal typed inputs
  required by the extracted service.
- Do not change the already-completed artwork detail data service from T-007.
- Do not introduce a global API response-helper refactor.

## Concurrency

You are not alone in the repo. This task owns the artwork list API route,
`ArtworkListLoader`, the new artwork-list data service, focused tests, and
directly related docs while it runs. Avoid package edits, auth/session files,
and subscription/admin validation files.

## Acceptance Criteria

- `/artwork` server rendering no longer calls same-app HTTP for the initial
  artwork list.
- The public artwork list API and `ArtworkListLoader` share one server-only data
  service.
- Existing public response shape and gallery initial props are preserved.
- Focused tests prove API and loader behavior without requiring a live local
  web server.
- The new service calls `dbConnect()` or uses an established DB-owned wrapper.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-artwork-list-test-files>
npm run lint
```

Run `npm test` if shared transforms, route mocks, or loader test setup are
changed.

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getArtworkList.test.ts __tests__/unit/api/publicArtworkListRoute.test.ts __tests__/unit/loaders/ArtworkListLoader.test.tsx
npm run lint
npm test
npm run build
```

All commands passed. Full Jest still emits the pre-existing date utility
error-path console output tracked as expected test noise. Build still emits the
known Browserslist notice plus MongoDB/fetcher/debug output during static page
generation.

## Completion Notes

- Added `src/lib/data/services/getArtworkList.ts` as the server-only artwork
  list service. It owns `dbConnect()`, filter query construction, current sort
  modes, color-proximity handling, pagination metadata, and
  `transformArtwork.toFrontend(...)` user-context transformation.
- Refactored `GET /api/v2/public/artwork` into a request adapter that parses
  search params, gets the session user ID, calls the service, and preserves the
  existing `ApiArtworkListResult` success/error envelope.
- Updated `ArtworkListLoader` to call `getArtworkList()` directly, removing
  its `serverApi.public.artwork.multiple` same-app HTTP path and touched debug
  logs.
- Added focused service, API route, and loader tests proving query behavior,
  route envelope behavior, and that the `/artwork` loader path does not require
  a live local web server or `global.fetch`.

## Escalate

Escalate to the orchestrator if:

- Preserving color-proximity behavior requires a broader query-validation
  decision.
- Existing clients depend on undocumented route logs, raw errors, or response
  quirks.
- The service extraction uncovers transform/image-shape drift that belongs in a
  separate data-contract task.
