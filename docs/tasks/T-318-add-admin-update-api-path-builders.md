# T-318 Add Admin Update API Path Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe admin update API path builders for the implementation slice
scoped by T-317.

## Context

T-317 selected admin update as the next API route-builder family after admin
delete and read. Update fetchers currently build dynamic admin update URLs
inline and duplicate `encodeURIComponent()` handling. This task should
centralize only client fetcher URL construction.

## Scope

In scope:

- Read [T-317 next API route-builder family scope](../audits/results/T-317-next-api-route-builder-family-scope.md).
- Add a client-safe value-only module for admin update API paths, for example
  `src/lib/api/admin/update/paths.ts`.
- Export a concrete external path builder, for example
  `adminUpdatePath(resource, id)`.
- Keep the four supported update resources explicit:
  `article`, `artwork`, `blog`, and `collection`.
- Update `src/lib/api/admin/update/fetchers.ts` to use the shared builder.
- Preserve current `PATCH` method options and `JSON.stringify(data)` request
  bodies.
- Add focused unit coverage for supported resources, encoded IDs, and preserved
  fetch options, likely in
  `__tests__/unit/api/adminUpdateFetchers.test.ts`.

Out of scope:

- Do not edit route handlers, guard helpers, DB work, validation schemas, DTO
  transforms, response contracts, status codes, route logging behavior,
  request-context route IDs, or admin UI behavior.
- Do not make physical route files import client fetcher builders.
- Do not change `createRequestContext()` route template IDs such as
  `/api/v2/admin/article/update/[id]`.
- Do not centralize admin create, read, delete, public, user, auth,
  middleware, smoke, sitemap, Shopify, or route-ID paths in this task.

## Concurrency

Can run in parallel with T-319 because this task owns admin update API fetcher
path code and focused tests only. Do not run in parallel with another task
touching admin update fetchers, admin update route handlers, route/fetcher
parity, or admin update behavior tests.

## Files Likely Touched

- `src/lib/api/admin/update/paths.ts`
- `src/lib/api/admin/update/fetchers.ts`
- `__tests__/unit/api/adminUpdateFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that preserves explicit operation inventory
- `docs/tasks/T-318-add-admin-update-api-path-builders.md`

## Acceptance Criteria

- Admin update fetchers call a shared client-safe path-builder module for
  dynamic update URLs.
- Generated update paths preserve current `encodeURIComponent()` behavior.
- The four supported update resources remain explicit.
- Existing `PATCH` method and `JSON.stringify(data)` request bodies are
  unchanged.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminUpdateFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
git diff --check
```

Run the four admin create/update route suites only if the implementation
touches anything beyond fetcher URL construction:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts
```

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-317 completed.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
- Completed on 2026-05-27. Added client-safe admin update path builders,
  moved admin update fetchers to the shared builder, and added focused fetcher
  coverage for supported resources, encoded IDs, and preserved `PATCH` request
  options.
- Verification: `npm test -- --runTestsByPath __tests__/unit/api/adminUpdateFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts` passed.
- Verification: `npm run lint` passed.
- Verification: `git diff --check` passed.
