# T-200 Implement Artwork Detail Not-Found Contract

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the accepted public detail not-found/error contract for standalone
artwork and collection-scoped artwork detail routes only.

## Context

- A-005 found public detail routes do not share a reliable not-found/error
  contract.
- T-199 recorded the accepted contract in
  [Rendering and data fetching](../architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract).
- This task is the first runtime slice from that contract.
- Standalone `/artwork/[artworkId]` already validates malformed ObjectIds in
  the page, but `ArtworkLoader` throws a generic error when `getArtworkById()`
  returns `null`.
- Collection-scoped `/collections/[slug]/[artworkId]` currently has no
  page-level ObjectId validation, and `CollectionArtworkLoader` can convert
  missing collection/artwork statuses into a logged `null` render.

## Scope

In scope:

- Add a shared public detail not-found view/component with route-appropriate
  title, message, and return-link props.
- Add route-local `not-found.tsx` files for:
  - `src/app/artwork/[artworkId]/not-found.tsx`
  - `src/app/collections/[slug]/[artworkId]/not-found.tsx`
- Preserve standalone artwork malformed ObjectId behavior.
- Add collection-scoped artwork ObjectId validation before
  `getCollectionArtwork()` can construct a MongoDB `ObjectId`.
- Map `getArtworkById()` returning `null` to `notFound()` for standalone
  artwork detail.
- Map `getCollectionArtwork()` statuses of `collection-not-found` and
  `artwork-not-found` to `notFound()` for collection-scoped artwork detail.
- Preserve upstream/service failures as error-boundary failures, not 404s.
- Preserve optional Shopify product-link degradation: failures to load linked
  shop products must not make a found artwork detail route 404.
- Add or update focused tests for malformed IDs, valid-but-missing primary
  content, upstream failures, optional product-link degradation, and no
  same-app HTTP regressions.

Out of scope:

- Do not change biography/project article detail, blog detail, or Shopify
  product detail routes.
- Do not change metadata, JSON-LD, sitemap, cache policy, saved artwork
  behavior, comments, product enquiry, checkout/cart, or framed-preview
  behavior.
- Do not resolve home section loader, client follow-up fetch, mixed barrel, or
  account subnav findings.
- Do not add a CI/release `noEmit` gate.

## Concurrency

Run this task alone with other runtime work touching public detail routes,
`ArtworkLoader`, `CollectionArtworkLoader`, shared public not-found UI, or
public detail tests. It can run in parallel with docs-only owner-decision work
or framed-preview visual review that does not touch these files.

Owned files:

- `src/app/artwork/[artworkId]/page.tsx`
- `src/app/artwork/[artworkId]/not-found.tsx`
- `src/app/collections/[slug]/[artworkId]/page.tsx`
- `src/app/collections/[slug]/[artworkId]/not-found.tsx`
- `src/components/loaders/viewLoaders/ArtworkLoader.tsx`
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
- shared public not-found component/view path chosen by the agent
- focused tests for the touched routes/loaders
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Malformed artwork IDs on both scoped and unscoped artwork detail routes call
  `notFound()` before primary content data access.
- Valid-but-missing standalone artwork and collection-scoped artwork primary
  content calls `notFound()`.
- Upstream/service failures still reach the App Router error boundary path.
- Found artwork details still render even if optional Shopify product-link
  loading fails or degrades.
- Route-local not-found UI exists for the two converted route families and uses
  shared public presentation.
- Focused tests pass and existing no-same-app-fetch/source-hygiene expectations
  remain intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx
npm test -- --runTestsByPath __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
git diff --check
```

Add any new focused route/not-found component test paths to the command before
handoff.

## Agent Prompt

You are working on T-200. Read `AGENTS.md`, `docs/README.md`, T-199, the A-005
result, `docs/architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract`,
and the frontend workstream. Implement only the accepted not-found/error
contract for `/artwork/[artworkId]` and `/collections/[slug]/[artworkId]`.
Add shared public not-found presentation and route-local not-found files for
those two route families, map malformed IDs and missing primary content to
`notFound()`, keep upstream failures as errors, and preserve optional Shopify
product-link degradation. Do not touch article/blog/product detail routes,
metadata/cache/sitemap behavior, checkout/enquiry behavior, or shared trackers.
Run the verification commands plus any new focused tests, then update this
handoff with candidate tracker updates.

## Handoff Notes

- Prepared after T-199 defined the public detail not-found/error contract.
- Completed on 2026-05-22.
- Added shared `PublicDetailNotFound` presentation and route-local not-found
  files for `/artwork/[artworkId]` and
  `/collections/[slug]/[artworkId]`.
- Added shared artwork ObjectId param validation for the converted pages and
  metadata paths so malformed standalone and collection-scoped artwork IDs do
  not reach primary content data access.
- Updated `ArtworkLoader` and `CollectionArtworkLoader` so valid-but-missing
  primary artwork content calls `notFound()`, while upstream primary-content
  service failures still throw into the App Router error boundary path.
- Preserved linked Shopify product degradation by rendering found artwork
  details with empty shop product props when optional product-link loading
  fails.
- Added focused coverage in
  `__tests__/unit/pages/ArtworkDetailNotFoundContract.test.tsx` plus updated
  loader tests for missing primary content, upstream failures, optional product
  degradation, malformed IDs, route-local not-found UI, and no same-app HTTP
  regressions.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/pages/ArtworkDetailNotFoundContract.test.tsx`
  passed.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
  passed.
- Verification: `npm run lint` passed.
- Verification: `git diff --check` passed.
- Test runs emitted the existing Node `punycode` deprecation warning.
- Candidate tracker updates for the orchestrator: mark the artwork and
  collection-scoped artwork slice of the public detail not-found/error contract
  complete; keep the broader public-detail finding open for biography/project
  article, blog, and Shopify route-local UI follow-up slices; note that shared
  workstream trackers were intentionally not edited by this implementation
  task.
