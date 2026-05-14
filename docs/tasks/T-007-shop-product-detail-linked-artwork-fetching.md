# T-007 Fix Shop Product Detail Linked Artwork Fetching

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Make `/shop/products/[productHandle]` load linked archive artwork and book
artwork context from a canonical server-side data path instead of fetching the
non-existent `/api/artworks/:id` route.

## Why Now

This is a concrete high-severity commerce/rendering blocker. Product detail
pages currently show product data from Shopify, but their archive context fetch
uses a route that does not exist and falls back to an absolute same-app base URL.
Fixing it also gives a small ADR 0004-aligned server data-access slice without
attempting the full `/artwork` list migration.

It addresses:

- [F-008](../audits/findings-register.md): product detail pages fetch linked
  artwork from a non-existent route.
- [R-020](../risks/production-readiness.md): product detail linked artwork is a
  high-severity Shopify production blocker.
- [R-012](../risks/production-readiness.md): same-app HTTP remains in
  server-side rendering paths.
- [A-001](../audits/results/A-001-shopify-commerce.md): Shopify product detail
  linked artwork evidence.
- [A-015](../audits/results/A-015-ssr-data-fetching.md): SSR/data-fetching
  evidence for the same blocker.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md): server loaders
  and pages should call server-only data services instead of same-app HTTP.

## Read First

- [Shopify commerce workstream](../workstreams/shopify-commerce.md)
- [Architecture refactor workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [ADR 0004](../decisions/0004-server-data-access-ownership.md)
- [A-001 Shopify audit](../audits/results/A-001-shopify-commerce.md)
- [A-015 SSR/data-fetching audit](../audits/results/A-015-ssr-data-fetching.md)

## Scope

In scope:

- Replace `/shop/products/[productHandle]` helper fetches to
  `/api/artworks/:id` with a server-only artwork data path.
- Remove this page's dependency on `NEXT_PUBLIC_BASE_URL` and the
  `http://localhost:3000` fallback.
- Prefer extracting a small server-only artwork-by-ID service/helper that owns:
  - ObjectId shape validation where appropriate.
  - `dbConnect()`.
  - `ArtworkModel.findById(...).lean()`.
  - `transformArtwork.toFrontend(...)`.
  - a typed nullable result for missing or invalid artwork IDs.
- Reuse that helper from the existing public artwork detail API route if it
  keeps behavior equivalent and avoids duplicate query/transform logic.
- Preserve the public artwork API response envelope and status behavior for
  browser/API consumers.
- Make product detail gracefully ignore missing, invalid, or deleted linked
  artwork IDs for originals/prints and books.
- Add focused tests for the extracted artwork-by-ID data path and any changed
  API route behavior.
- Add a product-detail-focused test or assertion where practical that proves the
  page path does not call same-app `/api/artworks/:id` fetches.
- Update this task, Shopify workstream, architecture workstream, and risk status
  after completion.

Out of scope:

- Do not implement checkout/cart behavior.
- Do not change the product detail `Add to Cart` placeholder.
- Do not build the admin Shopify product-linking workflow.
- Do not migrate the whole `/artwork` listing route to the ADR 0004 service
  pattern.
- Do not centralize every app base URL or remove all same-app HTTP fetches.
- Do not change Shopify product transforms except where needed to preserve
  existing `mongodbArtworkId` and `featuredArtworkIds` behavior.
- Do not change shop filters, pagination, sorting, product cards, or listing
  APIs.

## Files Likely Touched

- `src/app/shop/products/[productHandle]/page.tsx`
- `src/app/api/v2/public/artwork/[id]/route.ts` if sharing the new helper
- New or existing server-only helper under `src/lib/`
- Focused tests under `__tests__/unit/`
- `docs/tasks/T-007-shop-product-detail-linked-artwork-fetching.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/risks/production-readiness.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to product detail linked
artwork fetching, the minimal shared artwork-by-ID data path, focused tests, and
directly related docs. Do not combine this with checkout, admin linking, broad
ADR 0004 migration, or route-wide cache policy.

## Acceptance Criteria

- `/shop/products/[productHandle]` no longer references `/api/artworks/:id`.
- `/shop/products/[productHandle]` no longer needs `NEXT_PUBLIC_BASE_URL` or a
  localhost fallback to fetch linked artwork.
- Linked original/print artwork and book artwork IDs are resolved through the
  canonical transformed `ArtworkFrontend` path.
- Missing or invalid linked artwork IDs do not crash product detail rendering.
- Existing public artwork detail API behavior is preserved if its internals are
  refactored.
- Focused tests cover success, missing/invalid artwork ID, and no same-app
  product-detail artwork fetch.

## Verification

Run the narrowest relevant tests first, then the standard project checks:

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm test
npm run lint
npm run build
```

If `npm run build` surfaces the known live MongoDB or external network coupling,
record the exact output and reference R-024/F-019 instead of expanding this
task.

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getArtworkById.test.ts __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/shopProductDetailPage.test.tsx
npm test
npm run lint
npm run build
```

`npm run build` passed. It still emitted the known noisy static-generation
MongoDB/self-fetch logs tracked by R-012/R-024, but no build failure occurred.

## Completion Notes

- Added `src/lib/data/services/getArtworkById.ts` as a server-only artwork ID
  lookup path with strict ObjectId-shape validation, `dbConnect()`,
  `ArtworkModel.findById(...).lean()`, and `transformArtwork.toFrontend(...)`.
- Refactored `src/app/api/v2/public/artwork/[id]/route.ts` to keep the public
  artwork API envelope while delegating MongoDB query and transform ownership to
  the server data service.
- Updated `/shop/products/[productHandle]` to resolve linked original/print
  artwork and book artwork through the server data service, removing its
  `/api/artworks/:id`, `NEXT_PUBLIC_BASE_URL`, and `localhost:3000` dependency.
- Added focused unit tests for the service, public artwork route adapter, and
  product detail page no-self-fetch behavior.

## Escalate

Escalate to the orchestrator if:

- Shopify metafields contain non-ObjectId artwork identifiers that must be
  supported immediately.
- The service extraction requires broad changes to public artwork list routes or
  route cache policy.
- Testing the page requires a new SSR test harness that would affect multiple
  routes.
- Another agent is editing product detail, public artwork API routes, or artwork
  transforms concurrently.
