# T-320 Add Admin Create API Path Builders

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add client-safe admin create API path builders for the next low-risk API
route-builder implementation slice.

## Context

T-317 selected admin update as the next API family and deferred admin create as a
separate static-path follow-up. T-318 completed admin update path builders.
Admin create fetchers still duplicate their static `/api/v2/admin/.../create`
paths inline.

## Scope

In scope:

- Read [T-317 next API route-builder family scope](../audits/results/T-317-next-api-route-builder-family-scope.md).
- Read [T-318 admin update API path builders](T-318-add-admin-update-api-path-builders.md).
- Add a client-safe value-only module for admin create API paths, for example
  `src/lib/api/admin/create/paths.ts`.
- Export a concrete external path builder, for example
  `adminCreatePath(resource)`.
- Keep the four supported create resources explicit:
  `article`, `artwork`, `blog`, and `collection`.
- Update `src/lib/api/admin/create/fetchers.ts` to use the shared builder.
- Preserve current `POST` method options and `JSON.stringify(data)` request
  bodies.
- Add focused unit coverage for supported resources and preserved fetch
  options, likely in `__tests__/unit/api/adminCreateFetchers.test.ts`.

Out of scope:

- Do not edit route handlers, guard helpers, DB work, validation schemas, DTO
  transforms, response contracts, status codes, route logging behavior,
  request-context route IDs, or admin UI behavior.
- Do not make physical route files import client fetcher builders.
- Do not change `createRequestContext()` route template IDs such as
  `/api/v2/admin/article/create`.
- Do not centralize admin update, read, delete, public, user, auth,
  middleware, smoke, sitemap, Shopify, or route-ID paths in this task.

## Concurrency

Can run in parallel with T-321 because this task owns admin create API fetcher
path code and focused tests only. Do not run in parallel with another task
touching admin create fetchers, admin create route handlers, route/fetcher
parity, or admin create behavior tests.

## Files Likely Touched

- `src/lib/api/admin/create/paths.ts`
- `src/lib/api/admin/create/fetchers.ts`
- `__tests__/unit/api/adminCreateFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that preserves explicit operation inventory
- `docs/tasks/T-320-add-admin-create-api-path-builders.md`

## Acceptance Criteria

- Admin create fetchers call a shared client-safe path-builder module for
  create URLs.
- The four supported create resources remain explicit.
- Existing `POST` method and `JSON.stringify(data)` request bodies are
  unchanged.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminCreateFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
git diff --check
```

Run the four admin create route suites only if the implementation touches
anything beyond fetcher URL construction:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts
```

## Tracker Ownership

The assigned agent owns this task brief status, handoff notes, and verification
results. Do not edit `docs/tasks/README.md`, workstream briefs,
`docs/orchestration/state.md`, `docs/audits/findings-register.md`, or
`docs/risks/production-readiness.md`; list candidate tracker updates in this
brief for orchestrator reconciliation.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-318 and T-319 completed.
- This is source-only and does not require Shopify dashboard work, privileged
  Vercel access, or network access.
- Completed on 2026-05-27. Added client-safe admin create path builders,
  moved admin create fetchers to the shared builder, and added focused fetcher
  coverage for supported resources and preserved `POST` request options.
- Verification: `npm test -- --runTestsByPath __tests__/unit/api/adminCreateFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts` passed.
- Verification: `npm run lint` passed.
- Verification: `git diff --check` passed.
