# T-112 Add Public Breadcrumb Structured Data

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add conservative `BreadcrumbList` JSON-LD to high-value public detail pages so
search crawlers can understand archive, article, blog, collection, and shop
detail hierarchy without changing visible UI or commerce claims.

## Context

- F-085/R-030 remain partially mitigated after T-103, T-106, and T-107.
- Existing detail pages already render conservative entity JSON-LD for
  biography articles, blog posts, standalone artwork, collection-scoped
  artwork, and Shopify products.
- The remaining F-085 structured-data gap is breadcrumb structured data.
  Dynamic-detail sitemap expansion and deployment smoke assertions should stay
  separate.
- Product structured data must remain descriptive only. Do not add `Offer`,
  availability, shipping, refund, payment, guarantee, or checkout claims.

## Scope

- In scope:
  - Add shared breadcrumb JSON-LD builder helpers using the existing public
    site URL helper and canonical route path helpers.
  - Render breadcrumb JSON-LD on `/biography/[slug]`, `/blog/[slug]`,
    `/artwork/[artworkId]`, `/collections/[slug]/[artworkId]`, and
    `/shop/products/[productHandle]`.
  - Keep breadcrumb items conservative and aligned to current public hierarchy,
    such as Home > Biography > Article, Home > Blog > Post, Home > Artwork >
    Artwork, Home > Collections > Collection > Artwork, and Home > Shop >
    Products > Product.
  - Reuse existing data services already called by the JSON-LD components
    where practical; do not add same-app HTTP.
  - Preserve existing entity JSON-LD, metadata, visible routes, visible
    breadcrumbs/navigation, product enquiry behavior, and route cache policy.
  - Add focused tests for breadcrumb helper output and the page components that
    render breadcrumb JSON-LD.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Dynamic sitemap expansion for content/detail records.
  - Deployment smoke automation for discovery endpoints.
  - Product `Offer`/availability/legal/checkout structured data.
  - Visible breadcrumb UI changes.
  - Route cache/ISR/static params changes.
  - Cloudinary delivery transformations.

## Files Likely Touched

- `src/lib/metadata/publicDetailMetadata.ts`
- `src/components/metadata/PublicDetailJsonLd.tsx`
- `src/app/biography/[slug]/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/artwork/[artworkId]/page.tsx`
- `src/app/collections/[slug]/[artworkId]/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- Existing or new focused tests under `__tests__/unit/deployment/`
- `docs/tasks/T-112-add-public-breadcrumb-structured-data.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Covered public detail pages render one entity JSON-LD script and one
  breadcrumb JSON-LD script when source content/product data is available.
- Breadcrumb item names and URLs match current canonical route hierarchy.
- Missing or failed content/product lookups return no breadcrumb script rather
  than throwing.
- Existing product JSON-LD remains descriptive and does not gain commerce/legal
  claims.
- Focused tests cover helper output, rendered scripts, missing-data behavior,
  and no same-app HTTP in the structured-data path.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx
npm run lint
npm run build
git diff --check
```

Completed 2026-05-18:

- Focused Jest passed with 3 suites and 21 tests.
- `npm run lint` passed with no ESLint warnings or errors.
- `npm run build` passed; touched public detail routes remain explicitly
  dynamic as before.
- `git diff --check` passed.

## Handoff Notes

- Prepared after T-111 resolved artwork-to-shop SSR discovery.
- Added shared breadcrumb route path helpers and conservative
  `BreadcrumbList` builders in `src/lib/metadata/publicDetailMetadata.ts`.
- Public detail structured-data components now render one existing entity
  JSON-LD script plus one breadcrumb JSON-LD script when the same source
  content/product lookup succeeds; missing or failed lookups still render no
  structured-data script.
- Product JSON-LD remains descriptive only and does not add `Offer`,
  availability, shipping, refund, payment, guarantee, or checkout claims.
- Keep dynamic sitemap expansion, discovery endpoint smoke automation,
  Cloudinary delivery transformations, route cache/ISR migration, and product
  offer/checkout structured data separate.
