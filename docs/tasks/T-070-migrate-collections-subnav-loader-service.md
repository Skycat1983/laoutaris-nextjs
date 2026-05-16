# T-070 Migrate Collections Subnav Loader Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Complete the next focused ADR 0004/F-021 slice by moving
`CollectionsSubnavLoader` off same-app HTTP and onto a shared server-only
collection navigation data service used by both the loader and the public
collection navigation API route.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-007, T-018, and T-021 proved the pattern for artwork detail, artwork list,
  and public search.
- T-069 removed debug logs from the shared fetcher and server API helpers but
  intentionally left same-app HTTP behavior unchanged.
- `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx`
  currently calls
  `serverPublicApi.navigation.fetchCollectionNavigationList()`, which goes
  through same-app HTTP.
- `src/app/api/v2/public/navigation/collections/route.ts` already owns the
  MongoDB query, transform, and response contract for the same collection
  navigation data.

## Scope

In scope:

- Add a server-only data service for the collection navigation list, for example
  `src/lib/data/services/getCollectionNavigationList.ts`.
- Move the existing route query/transform behavior into the shared service:
  connect to MongoDB, find collections with `section: "collections"`, select
  `title slug artworks`, sort by `updatedAt: 1`, transform through
  `transformCollectionNav.toFrontend`, and preserve the no-results semantics
  required by the current API route.
- Refactor `GET /api/v2/public/navigation/collections` to call the shared
  service while preserving its existing success envelope, metadata, `404`, and
  public-safe `500` behavior.
- Refactor `CollectionsSubnavLoader` to call the shared service directly and
  build the same `Subnav` links without importing `serverPublicApi` or making a
  same-app HTTP request.
- Add or update focused tests for the service, route, and loader behavior.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate other navigation routes, article navigation, collection detail
  routes, blog loaders, or shop loaders.
- Do not change the `Subnav` UI, link format, collection ordering, selected
  fields, transform output, route path, route response envelope, or error copy
  unless required to preserve the existing contract.
- Do not change the broader base URL policy, server API helper design, global
  logging/redaction policy, root layout DB/session ownership, or cache policy.
- Do not remove `serverPublicApi` or shared fetcher modules globally.

## Files Likely Touched

- `src/lib/data/services/getCollectionNavigationList.ts`
- `src/app/api/v2/public/navigation/collections/route.ts`
- `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx`
- `__tests__/unit/data/getCollectionNavigationList.test.ts` or equivalent
- `__tests__/unit/api/publicNavigationRoutes.test.ts`
- `__tests__/unit/loaders/CollectionsSubnavLoader.test.tsx` or equivalent
- `docs/tasks/T-070-migrate-collections-subnav-loader-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `CollectionsSubnavLoader` no longer imports `serverPublicApi`,
  `serverApi`, or same-app HTTP fetchers.
- The new shared service owns the collection navigation MongoDB query,
  `dbConnect()`, selection, ordering, and transform.
- The public collection navigation API route and loader both use the shared
  service.
- The API route preserves its existing response helper envelope, metadata, `404`
  no-results behavior, and public-safe `500` behavior.
- The loader still renders the same `Subnav` link data from collection title,
  slug, and `firstArtworkId`.
- Focused tests cover service success/no-results/failure behavior, route
  envelope preservation, and loader no-self-fetch behavior.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|fetch\\(" src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/data/getCollectionNavigationList.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and loader behavior.

Completed 2026-05-16:

- `rg -n "serverPublicApi|serverApi|fetch\\(" src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx`
  returned no matches, as expected.
- `npm test -- --runTestsByPath __tests__/unit/api/publicNavigationRoutes.test.ts __tests__/unit/data/getCollectionNavigationList.test.ts __tests__/unit/loaders/CollectionsSubnavLoader.test.tsx`
  passed.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check` passed.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16. Added `getCollectionNavigationList`, reused it from
  `GET /api/v2/public/navigation/collections` and
  `CollectionsSubnavLoader`, and added focused service/API/loader coverage.
- Keep other same-app HTTP migrations separate.
- Keep route URL/base URL policy, global logging/redaction policy, root layout
  DB/session ownership, and cache policy separate.

## Escalate

Escalate to the orchestrator if:

- The current loader behavior depends on API-envelope semantics that do not map
  cleanly to a shared service without changing route or UI contracts.
- The existing route no-results behavior is ambiguous and requires a product
  decision.
- The fix requires touching unrelated navigation routes or changing global
  server API/fetcher architecture.
