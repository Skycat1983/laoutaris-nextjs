# T-078 Migrate Collection Artwork Loaders Service

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Move collection artwork detail and pagination loaders off same-app HTTP by
sharing server-only collection artwork service logic with the public collection
artwork routes.

## Context

- ADR 0004 accepts direct server data-access services over same-app HTTP for
  server loaders, API routes, and server actions.
- T-073 moved collection redirect/navigation pages to shared server-only
  collection navigation services.
- T-077 moved `ArtworkLoader` to the existing server-only artwork detail
  service and left collection artwork loaders separate.
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx` still calls
  `serverApi.public.collection.singleCollectionSingleArtwork(slug, artworkId)`.
- `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`
  still calls `serverApi.public.collection.singleCollectionAllArtwork(slug)`.
- `GET /api/v2/public/collection/[slug]/artwork` currently owns the populated
  collection artworks query, transform, success envelope, `404`, and public-safe
  `500` behavior.
- `GET /api/v2/public/collection/[slug]/artwork/[id]` currently owns the
  matching artwork-in-collection lookup, success envelope, collection `404`,
  artwork-not-in-collection `404`, and public-safe `500` behavior.

## Scope

In scope:

- Add shared server-only collection artwork service logic, for example
  `getCollectionWithArtworks.ts` and `getCollectionArtwork.ts`, or an
  equivalent typed service shape.
- Move the existing `/collection/[slug]/artwork` query/transform behavior into
  the shared service path: connect to MongoDB, find by collection `slug`,
  populate `artworks`, lean to the current populated type, transform through
  `transformCollectionPopulated`, and return `null` for missing collection.
- Move the existing `/collection/[slug]/artwork/[id]` lookup behavior into the
  shared service path: connect to MongoDB, find by collection `slug`, populate
  only the matching artwork ID, distinguish missing collection from
  artwork-not-in-collection, and preserve the current success data shape unless
  an existing focused test proves a transformed shape is already expected.
- Refactor both public collection artwork API routes to call the shared service
  path while preserving existing success envelopes, `404`s, and public-safe
  `500`s.
- Refactor `CollectionArtworkLoader` to call the shared service path directly,
  preserve `ArtworkView` props, and preserve its current `null` fallback for
  non-Next loading failures.
- Refactor `CollectionArtworksPaginationLoader` to call the shared service path
  directly, preserve link construction with `buildUrl(["collections", slug,
  artwork._id])`, preserve the `ScrollableArtworkPagination` heading, and
  preserve its current `null` fallback for non-Next loading failures.
- Remove direct same-app HTTP imports and calls from both loaders.
- Add or update focused tests for the service(s), API routes, and both loader
  no-self-fetch behaviors.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate `CollectionSectionLoader`, collection list/detail pages,
  collection navigation services, account/user loaders, shop loaders, route
  URL/base URL policy, cache policy, root layout DB/session ownership, or
  global logging/redaction policy.
- Do not redesign collection artwork pagination, collection artwork page layout,
  `ArtworkView`, or `ScrollableArtworkPagination`.
- Do not remove `serverApi`, `serverPublicApi`, or shared fetcher modules
  globally.

## Files Likely Touched

- `src/lib/data/services/getCollectionWithArtworks.ts` or equivalent
- `src/lib/data/services/getCollectionArtwork.ts` or equivalent
- `src/app/api/v2/public/collection/[slug]/artwork/route.ts`
- `src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts`
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
- `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`
- `__tests__/unit/data/getCollectionWithArtworks.test.ts` or equivalent
- `__tests__/unit/data/getCollectionArtwork.test.ts` or equivalent
- `__tests__/unit/api/publicCollectionRoutes.test.ts`
- `__tests__/unit/loaders/CollectionArtworkLoader.test.tsx` or equivalent
- `__tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx` or
  equivalent
- `docs/tasks/T-078-migrate-collection-artwork-loaders-service.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- `CollectionArtworkLoader` no longer imports `serverApi`, `serverPublicApi`,
  or fetcher-backed collection artwork methods.
- `CollectionArtworksPaginationLoader` no longer imports `serverApi`,
  `serverPublicApi`, or fetcher-backed collection artwork methods.
- `CollectionArtworkLoader` no longer calls
  `serverApi.public.collection.singleCollectionSingleArtwork`, `fetch`, or
  another same-app HTTP wrapper.
- `CollectionArtworksPaginationLoader` no longer calls
  `serverApi.public.collection.singleCollectionAllArtwork`, `fetch`, or another
  same-app HTTP wrapper.
- `GET /api/v2/public/collection/[slug]/artwork`,
  `GET /api/v2/public/collection/[slug]/artwork/[id]`, and the two loaders
  share server-only service logic for their collection artwork reads.
- The populated collection artworks API route preserves its success envelope,
  `404` missing-collection response, and public-safe `500` response.
- The single collection artwork API route preserves its success envelope,
  collection `404`, artwork-not-in-collection `404`, and public-safe `500`
  response.
- `CollectionArtworkLoader` still renders `ArtworkView` with the selected
  artwork when available and still returns `null` for non-Next loading failures.
- `CollectionArtworksPaginationLoader` still renders
  `ScrollableArtworkPagination` with linked collection artworks and the heading
  `"More from this collection"`, and still returns `null` for non-Next loading
  failures.
- Focused tests cover service success/not-found/failure behavior, route envelope
  preservation, loader no-self-fetch behavior, selected artwork rendering, and
  pagination link construction.

## Verification

Run:

```bash
rg -n "serverPublicApi|serverApi|singleCollectionSingleArtwork|singleCollectionAllArtwork|fetch\\(" src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/data/getCollectionWithArtworks.test.ts __tests__/unit/data/getCollectionArtwork.test.ts __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation uses
different focused test filenames, run those files instead while covering the
same service, route, and loader behavior.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- Added `getCollectionWithArtworks` for the populated, transformed collection
  artwork list path shared by
  `GET /api/v2/public/collection/[slug]/artwork` and
  `CollectionArtworksPaginationLoader`.
- Added `getCollectionArtwork` for the selected collection artwork lookup
  shared by `GET /api/v2/public/collection/[slug]/artwork/[id]` and
  `CollectionArtworkLoader`; it preserves the route's existing untransformed
  success data shape while distinguishing collection-missing from
  artwork-not-in-collection.
- `CollectionArtworkLoader` and `CollectionArtworksPaginationLoader` no longer
  import or call `serverApi`, `serverPublicApi`, fetchers, or same-app HTTP for
  these reads.
- Keep `CollectionSectionLoader`, collection list/detail pages, account/user
  loaders, shop loaders, route URL/base URL policy, root layout ownership,
  cache policy, and global logging/redaction policy separate.

## Verification Results

Passed:

```bash
rg -n "serverPublicApi|serverApi|singleCollectionSingleArtwork|singleCollectionAllArtwork|fetch\\(" src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx
npm test -- --runTestsByPath __tests__/unit/api/publicCollectionRoutes.test.ts __tests__/unit/data/getCollectionWithArtworks.test.ts __tests__/unit/data/getCollectionArtwork.test.ts __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx
npm run lint
npm run build
git diff --check
```

The `rg` command returned no matches.
Build passed with the repo's existing MongoDB/static-generation, branch
verification, navigation link, and `ArticleView` debug output.

## Escalate

Escalate to the orchestrator if:

- Sharing the collection artwork route behavior requires changing current route
  response contracts or visible loader behavior.
- The single-artwork route's current populated document shape cannot be safely
  preserved or typed without a broader data-contract decision.
- The fix requires touching unrelated collection routes, artwork transforms, or
  global server API/fetcher architecture.
