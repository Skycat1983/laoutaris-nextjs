# T-314 Add Admin Read API Path Builders

Status: Planned

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe admin read API path builders as the next API route-builder
runtime slice after T-312.

## Context

T-309 selected admin delete as the first API route-builder slice and identified
admin read as the natural second slice. T-312 proved the client-safe API path
builder pattern for admin delete fetchers while keeping physical route files
and request-context route IDs separate.

## Scope

In scope:

- Read [T-309 API route builder ownership scope](../audits/results/T-309-api-route-builder-ownership-scope.md)
  and [T-312](T-312-add-admin-delete-api-path-builders.md).
- Add a client-safe value-only module for admin read API paths, for example
  `src/lib/api/admin/read/paths.ts`.
- Export concrete external path builders for admin read list and detail URLs.
- Preserve the current supported read resources and current query-string
  behavior from `src/lib/api/admin/read/fetchers.ts`, including pagination,
  search, and filter parameters where the fetcher already owns them.
- Update `src/lib/api/admin/read/fetchers.ts` to use the shared path builders.
- Add or extend focused unit coverage for encoded IDs, list/detail paths,
  query-string preservation, and existing fetch options.

Out of scope:

- Do not edit route handlers, guard helpers, DB work, route response contracts,
  DTO transforms, request-context route IDs, route logging behavior, pagination
  parsing, validation, or admin UI behavior.
- Do not make physical route files import client fetcher builders.
- Do not centralize admin create, update, delete, public, user, auth,
  middleware, smoke, sitemap, or Shopify paths in this task.

## Concurrency

Can run in parallel with T-315 because this task owns only admin read API
fetcher path code and focused tests. Do not run in parallel with another task
touching admin read fetchers, admin read route handlers, route/fetcher parity,
or admin read behavior tests.

## Files Likely Touched

- `src/lib/api/admin/read/paths.ts`
- `src/lib/api/admin/read/fetchers.ts`
- `__tests__/unit/api/adminReadFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that preserves explicit operation inventory
- `docs/tasks/T-314-add-admin-read-api-path-builders.md`

## Acceptance Criteria

- Admin read fetchers call a shared path-builder module for list and detail
  URLs.
- Generated detail paths preserve current `encodeURIComponent()` behavior.
- Generated list paths preserve current query-string behavior.
- Supported admin read resources remain explicit.
- Existing fetcher call expectations continue to pass.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminReadFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
git diff --check
```

Run `npm run typecheck` if new exported types are added or existing fetcher
types are changed.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-313 restored the broad
  verification gate.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
