# T-312 Add Admin Delete API Path Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe admin delete API path builders for the first API route-builder
runtime slice.

## Context

T-309 separated API route ownership into external fetch URLs, client fetcher
builders, physical route files, and request-context route IDs. It selected the
admin delete fetcher family as the first implementation slice because the
current fetcher already has small local path helpers and strong parity/behavior
coverage.

## Scope

In scope:

- Read [T-309 API route builder ownership scope](../audits/results/T-309-api-route-builder-ownership-scope.md).
- Add a client-safe value-only module for admin delete API paths, for example
  `src/lib/api/admin/delete/paths.ts`.
- Export concrete external path builders for destructive and preview URLs, for
  example `adminDeletePath(resource, id)` and
  `adminDeletePreviewPath(resource, id)`.
- Keep the six supported delete resources explicit:
  `article`, `artwork`, `blog`, `collection`, `comment`, and `user`.
- Update `src/lib/api/admin/delete/fetchers.ts` to use the shared path
  builders.
- Add or extend focused unit coverage for encoded IDs, destructive paths,
  preview paths, and preserved fetch options.

Out of scope:

- Do not edit route handlers, preview helper behavior, guard helpers, DB work,
  transactions, cascade logic, evidence payload handling, audit events, or
  request/response contracts.
- Do not replace `createRequestContext()` or `adminDeletePreviewResponse()`
  route template IDs with concrete fetch URLs.
- Do not make physical route files import client fetcher builders.
- Do not centralize admin read, create, update, public, user, auth, middleware,
  smoke, sitemap, or Shopify paths in this task.

## Concurrency

Can run in parallel with T-311 because it owns API fetcher path builder code and
admin delete fetcher tests only. Do not run in parallel with another task
touching admin delete fetchers, admin delete route handlers, route/fetcher
parity, or admin delete behavior tests.

## Files Likely Touched

- `src/lib/api/admin/delete/paths.ts`
- `src/lib/api/admin/delete/fetchers.ts`
- `__tests__/unit/api/adminDeleteFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that preserves explicit operation inventory
- `docs/tasks/T-312-add-admin-delete-api-path-builders.md`

## Acceptance Criteria

- Admin delete fetchers call a shared path-builder module for destructive and
  preview URLs.
- Generated paths preserve current `encodeURIComponent()` behavior.
- The six supported delete resources remain explicit.
- Existing fetcher call expectations continue to pass.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
git diff --check
```

Run `npm run lint` if source changes touch import ordering or shared modules
with existing lint coverage.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-309 completed.
- This is source-only and does not require Shopify dashboard work or privileged
  Vercel access.
- Completed on 2026-05-27 by adding
  `src/lib/api/admin/delete/paths.ts`, moving admin delete fetchers to the
  shared destructive/preview path builders, and extending focused coverage for
  explicit supported resources plus encoded IDs.
- Route handlers, request-context route IDs, preview helpers, guard behavior,
  response contracts, evidence payload handling, cascade logic, transactions,
  and audit events were left unchanged.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminDeleteFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts`,
  `git diff --check`, and `npm run lint`.
