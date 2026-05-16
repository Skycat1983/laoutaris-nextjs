# T-080 Migrate Collection Section Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move `CollectionSectionLoader` off same-app HTTP by sharing server-only
collection list service logic with `GET /api/v2/public/collection`.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-073 moved collection redirect/navigation pages to shared server-only
  collection navigation services.
- T-078 moved collection artwork detail and pagination loaders to shared
  collection artwork services.
- T-079 moved `BiographySectionLoader` to shared article list service logic and
  left `CollectionSectionLoader` separate.
- Before this task,
  `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx` called
  `serverApi.public.collection.multiple({ section: "collections", limit: 9 })`.
- Before this task, `GET /api/v2/public/collection` owned the collection list
  query, optional `section` filter, pagination, transform, success list
  envelope, missing-list response, and public-safe `500` body.

## Scope

In scope:

- Add a shared server-only collection list service, for example
  `src/lib/data/services/getCollectionList.ts`, or an equivalent strongly typed
  service shape.
- Move the existing public collection list query/transform behavior into the
  service: connect to MongoDB, apply optional `section`, page/limit defaults,
  transform with `transformCollection.toFrontend`, and return collections plus
  pagination metadata.
- Refactor `GET /api/v2/public/collection` to call the shared service while
  preserving the current success envelope, metadata shape, missing-list response
  body, and public-safe `500` body.
- Refactor `CollectionSectionLoader` to call the shared service directly for
  `section: "collections"` and `limit: 9`.
- Preserve `CollectionSection` props and the loader's current `null` fallback
  for non-Next loading failures.
- Remove direct same-app HTTP imports and calls from `CollectionSectionLoader`.
- Add or update focused tests for the service, API route, and
  `CollectionSectionLoader` no-self-fetch behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate collection detail pages/routes, collection navigation services,
  collection artwork services/routes/loaders, account/user loaders, shop
  loaders, route URL/base URL policy, cache policy, root layout DB/session
  ownership, or global logging/redaction policy.
- Do not change collection list query validation, empty-list status semantics,
  `CollectionSection`, collection transforms, or visible collection section
  layout.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getCollectionList.ts` or equivalent
- `src/app/api/v2/public/collection/route.ts`
- `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
- `__tests__/unit/data/getCollectionList.test.ts` or equivalent
- `__tests__/unit/api/publicCollectionRoutes.test.ts`
- `__tests__/unit/loaders/CollectionSectionLoader.test.tsx` or equivalent
- `docs/tasks/T-080-migrate-collection-section-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `CollectionSectionLoader` no longer imports `serverApi`, `serverPublicApi`,
  or fetcher-backed collection list methods.
- `CollectionSectionLoader` no longer calls
  `serverApi.public.collection.multiple`, `fetch`, or another same-app HTTP
  wrapper.
- `GET /api/v2/public/collection` and `CollectionSectionLoader` share the same
  server-only collection list service for collection list reads.
- The public collection list API route preserves its success list envelope and
  metadata shape for valid list requests.
- The public collection list API route preserves its current missing-list
  response body and public-safe `500` body.
- `CollectionSectionLoader` still renders `CollectionSection` with section
  collections and still returns `null` for non-Next loading failures.
- Focused tests cover service success/missing-list/failure behavior, route
  envelope preservation, loader no-self-fetch behavior, collection section
  filter behavior, and section limit behavior.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(" src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/data/getCollectionList.test.ts __tests__/unit/loaders/CollectionSectionLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16. Added `getCollectionList`, refactored
  `GET /api/v2/public/collection` and `CollectionSectionLoader` to share it,
  removed the loader's collection-list same-app HTTP dependency, and added
  focused service/API/loader tests.
- Preserved the public collection list success envelope, metadata shape,
  missing-list `404` body, public-safe `500` body, and empty-array success
  semantics.
- Verification completed:
  `rg -n "serverPublicApi|serverApi|\\.multiple\\(|fetch\\(" src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
  returned no matches, and
  `npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/data/getCollectionList.test.ts __tests__/unit/loaders/CollectionSectionLoader.test.tsx`
  passed. `npm run lint`, `npm run build`, and `git diff --check` also
  passed; build retained existing MongoDB/static-generation and debug-log noise
  from unrelated paths.
- Keep collection detail routes/pages, collection navigation services,
  collection artwork services/routes/loaders, account/user loaders, shop
  loaders, route URL/base URL policy, root layout ownership, cache policy, and
  global logging/redaction policy separate.

## Escalate

Escalate to the orchestrator if:

- Sharing collection list behavior requires changing current route response
  contracts or visible collection section behavior.
- The route's current query parsing needs broader validation/status cleanup
  beyond preserving existing `section`, `page`, and `limit` behavior.
- The fix requires touching unrelated collection detail/artwork/navigation
  routes, collection transforms, or global server API/fetcher architecture.
