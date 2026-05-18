# T-126 Migrate Public Loader Page Logging

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Migrate the first low-risk non-route `console.error()` slice for public server
loaders and App Router pages to the
[logging and redaction policy](../architecture/logging-and-redaction.md)
without changing user-facing fallback behavior.

## Context

- T-125 defined the non-route logging/redaction policy and found 86 direct
  `console.error()`/`console.warn()` calls across 66 non-route files.
- Public server loaders and App Router pages are the recommended first
  implementation slice because they are server-side, provider-independent, and
  can preserve current generic fallback UI.
- API-v2 route handler logging is already guarded by T-122 and is out of scope.

## Scope

In scope:

- Replace or remove direct `console.error()` calls in the current public
  loader/page slice:
  - `src/app/biography/page.tsx`
  - `src/app/collections/page.tsx`
  - `src/app/collections/[slug]/page.tsx`
  - `src/app/shop/products/[productHandle]/page.tsx`
  - `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
  - `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
  - `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
  - `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`
  - `src/components/loaders/componentLoaders/MainNavLoader.tsx`
  - `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
  - `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx`
  - `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
- Use a server-only structured logging helper or remove logs that the policy
  classifies as low-value recoverable noise.
- Preserve existing redirects, fallback UI, loader return values, metadata, and
  route rendering/cache policy.
- Add focused source-hygiene coverage for the touched files.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not change API-v2 route handler logging.
- Do not install or configure a monitoring provider.
- Do not change Shopify provider-client logging except where the product page
  catches linked-artwork fetch failures in this page slice.
- Do not change public error UI, error boundaries, cache policy, or data-fetch
  ownership unless required to preserve current behavior.
- Do not add a recursive full-source `console.error()`/`console.warn()` guard
  for all non-route files yet.

## Likely Files

- `src/app/biography/page.tsx`
- `src/app/collections/page.tsx`
- `src/app/collections/[slug]/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
- `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
- `src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx`
- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
- `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx`
- `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
- `src/lib/observability/`
- `__tests__/unit/observability/`
- Related docs under `docs/`

## Acceptance Criteria

- The scoped public loader/page files contain no direct `console.error()` or
  `console.warn()` calls.
- Any retained logging goes through a server-only structured redacted helper
  aligned with the T-125 policy.
- Current user-facing fallbacks, redirects, and loader/page contracts are
  preserved.
- Focused tests or source-hygiene checks cover the touched files.
- Related workstream and tracking docs record what remains for provider/data
  services, server actions, client components, admin dashboard clients, and
  utility/helper warnings.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/app/biography/page.tsx src/app/collections/page.tsx 'src/app/collections/[slug]/page.tsx' 'src/app/shop/products/[productHandle]/page.tsx' src/components/loaders/viewLoaders/BlogDetailLoader.tsx src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx src/components/loaders/viewLoaders/ShopProductsLoader.tsx src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx src/components/loaders/componentLoaders/MainNavLoader.tsx src/components/loaders/sectionLoaders/BiographySectionLoader.tsx src/components/loaders/sectionLoaders/BlogSectionLoader.tsx src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts
git diff --check
```

Run narrower focused tests added by the implementation before broadening. Lint
and build are recommended if the slice adds shared logging helpers or touches
loader behavior beyond source-hygiene changes.

## Handoff Notes

- Planned on 2026-05-18 by T-125 as the first safe implementation slice after
  the non-route logging/redaction policy was defined.
- Completed on 2026-05-18. Added `createServerLogger()` as a requestless,
  server-only structured logging helper, migrated the scoped public page and
  loader failure paths from direct `console.error()` calls to redacted
  structured events, and preserved existing redirects, null fallbacks, thrown
  errors, and user-facing shop loader copy.
- Added focused source hygiene for the T-126 file list plus logger/page/loader
  coverage for structured event payloads and fallback behavior.
- Remaining non-route direct `console.error()`/`console.warn()` cleanup covers
  provider/data services, server actions/session helpers, public/account client
  components, admin dashboard clients, shared fetcher/client reporting, and
  utility/helper warnings.

Verification:

```bash
rg -n "console\.(error|warn)\(" src/app/biography/page.tsx src/app/collections/page.tsx 'src/app/collections/[slug]/page.tsx' 'src/app/shop/products/[productHandle]/page.tsx' src/components/loaders/viewLoaders/BlogDetailLoader.tsx src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx src/components/loaders/viewLoaders/ShopProductsLoader.tsx src/components/loaders/componentLoaders/CollectionArtworksPaginationLoader.tsx src/components/loaders/componentLoaders/MainNavLoader.tsx src/components/loaders/sectionLoaders/BiographySectionLoader.tsx src/components/loaders/sectionLoaders/BlogSectionLoader.tsx src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx
npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/observability/publicLoaderPageLoggingSourceHygiene.test.ts __tests__/unit/pages/BiographyPage.test.tsx __tests__/unit/pages/CollectionsPage.test.tsx __tests__/unit/pages/CollectionSlugPage.test.tsx __tests__/unit/loaders/BiographySectionLoader.test.tsx __tests__/unit/loaders/BlogSectionLoader.test.tsx __tests__/unit/loaders/CollectionSectionLoader.test.tsx __tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/loaders/BlogDetailLoader.test.tsx __tests__/unit/loaders/ShopProductsLoader.test.tsx __tests__/unit/shopProductDetailPage.test.tsx
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/observability/logger.test.ts __tests__/unit/observability/publicLoaderPageLoggingSourceHygiene.test.ts
npm run lint
npm run build
git diff --check
```
