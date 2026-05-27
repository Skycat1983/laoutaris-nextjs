# T-307 Expand Public Route Builder Consumers

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Migrate the next low-risk public UI link consumers to the client-safe public
route builder module added by T-305.

## Context

T-305 added `src/lib/routes/publicAppRoutes.ts` and migrated metadata,
dynamic-sitemap, main-nav, skeleton-route, and footer legal-link consumers. T-302
identified additional duplicated public app links across cards, search results,
sections, and detail views. This task should continue that centralization
without changing route behavior or touching Shopify dashboard data.

## Scope

In scope:

- Read [T-302 route-builder scope](../audits/results/T-302-route-builder-centralization-scope.md)
  and [T-305](T-305-add-public-app-route-builders.md).
- Migrate a narrow public UI set that builds existing public app paths inline,
  prioritizing cards/search/section links for:
  - artwork detail;
  - biography article detail;
  - blog detail;
  - collection detail;
  - collection artwork detail;
  - shop product detail links that already have a handle.
- Preserve rendered labels, link destinations, query behavior, product handling,
  and public copy.
- Add or update focused tests for migrated consumers.
- Run the client/server import-boundary guard if any migrated consumer is a
  client component.

Out of scope:

- Do not touch Shopify dashboard data, Shopify metadata, Storefront queries,
  product classification, option mapping, checkout/cart, or policy URLs.
- Do not touch auth/protected routes, API route builders, admin action routes,
  middleware matchers, smoke route lists, redirects, cache policy, generated
  params, or route segment config.
- Do not create a broad route barrel that imports server-only modules.

## Concurrency

Can run in parallel with T-308 and T-309 if this task owns only runtime public
UI consumers and focused tests. Do not edit shared trackers while running; list
candidate updates in this handoff.

## Files Likely Touched

- `src/lib/routes/publicAppRoutes.ts`
- public card/search/section/detail-link consumers under `src/components` and
  `src/app`
- focused tests for touched consumers
- `docs/tasks/T-307-expand-public-route-builder-consumers.md`

## Acceptance Criteria

- Selected public UI consumers use `publicAppRoutes` constants/builders instead
  of duplicating string paths.
- Rendered routes and labels are unchanged.
- No Shopify dashboard, auth, API, admin, smoke, redirect, or cache-policy
  behavior changes.
- Focused tests and import-boundary coverage pass.

## Verification

```bash
npm run lint
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Add focused touched-consumer test paths to the `npm test -- --runTestsByPath`
command.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-305 completed the first
  public route-builder slice.
- Completed on 2026-05-27.
- Migrated the next public UI route-builder consumers to
  `src/lib/routes/publicAppRoutes.ts` without changing rendered labels or
  destination semantics:
  - public cards:
    `BlogCard`, `BlogsViewCard`, `BiographyCard`, `ProductCard`,
    `CollectionCard`, and `ArtworkShopSection`;
  - public artwork/shop detail surfaces:
    `MasonryLayout`, Shopify product featured-artwork links, and
    `ShopProductSaleGallery` linked archive-record links;
  - public blog sections:
    `BlogSectionContinuous`, `BlogSectionSplitScreen`, `BlogSectionTiles`, and
    `BlogsSectionFeatured`.
- Added focused coverage in
  `__tests__/unit/components/PublicRouteBuilderConsumers.test.tsx` for
  migrated card, masonry, artwork-shop, and source wiring behavior, including
  encoded route segments.
- Preserved deferred areas: Shopify dashboard data, Storefront queries,
  checkout/cart, auth/protected routes, API route builders, admin routes,
  middleware matchers, smoke route lists, redirects, cache policy, generated
  params, and route segment config.
- Remaining low-risk public UI candidates from the T-302 inventory include
  protected/account comment links (`UserCommentsView`) and prototype-home links;
  these were left untouched because this task scoped runtime public UI consumers
  and avoided auth/prototype surfaces.
- Candidate shared tracker updates for orchestrator reconciliation: mark T-307
  complete in the task index; add architecture/frontend/testing progress notes;
  update F-030 to name the expanded public UI consumer migration.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/components/PublicRouteBuilderConsumers.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/routes/publicAppRoutes.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts`;
  `npm run lint`;
  `git diff --check`.
