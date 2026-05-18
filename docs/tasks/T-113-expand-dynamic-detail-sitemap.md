# T-113 Expand Dynamic Detail Sitemap

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Expand `src/app/sitemap.ts` beyond stable public shell routes to include
available public detail URLs for articles, blogs, artwork, collections,
collection-scoped artwork, and Shopify products without changing route
rendering or adding broad static generation.

## Context

- F-085/R-030 remain partially mitigated after T-103, T-106, T-107, and T-112.
- T-103 created the baseline sitemap for stable public routes only.
- T-110 made public route cache ownership explicit; detail routes remain
  dynamic and must not be converted to ISR/static params by this task.
- T-112 added breadcrumb structured data, leaving dynamic detail sitemap
  expansion and deployment smoke assertions as the next discovery gaps.

## Scope

- In scope:
  - Add server-only sitemap helper logic or route-local helpers that collect
    public detail paths using existing data services or narrow read services.
  - Include biography article routes, blog routes, standalone artwork routes,
    collection routes, collection-scoped artwork routes, and Shopify product
    routes where the app has enough current data to generate safe public URLs.
  - Keep sitemap generation best-effort: failures or missing upstream Shopify
    product data should not break the entire sitemap if a scoped fallback is
    reasonable and documented.
  - Preserve the existing stable public sitemap routes and URL helper.
  - Avoid private, admin, account, API, malformed, duplicate, unavailable, or
    policy-claiming URLs.
  - Add focused tests for stable plus dynamic sitemap entries, duplicate
    removal, public URL generation, and graceful failure behavior.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - `generateStaticParams()`, ISR, route cache policy, or route rendering
    changes.
  - Discovery endpoint deployment smoke automation.
  - Product `Offer`/availability/legal/checkout structured data.
  - Checkout/cart, Shopify pagination, or server-side sorting.
  - Cloudinary delivery transformations or image URL policy changes.

## Files Likely Touched

- `src/app/sitemap.ts`
- New helper/service under `src/lib/metadata/` or `src/lib/data/services/`
- Existing or new focused tests under `__tests__/unit/deployment/`
- `docs/tasks/T-113-expand-dynamic-detail-sitemap.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- `sitemap()` includes the existing stable public routes and public detail URLs
  from current article, blog, artwork, collection, collection-artwork, and shop
  product data.
- Sitemap entries use canonical absolute URLs from `getPublicSitePathUrl()`.
- Duplicate, malformed, private, admin, account, and API URLs are excluded.
- Detail sitemap expansion does not add `generateStaticParams()`, `revalidate`,
  or change route segment config.
- Focused tests cover successful dynamic sitemap generation and graceful
  failure behavior for dynamic sources.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared after T-112 completed public breadcrumb structured data.
- Completed 2026-05-18 by adding server-only dynamic sitemap collection under
  `src/lib/metadata/publicDynamicSitemap.ts` and making `src/app/sitemap.ts`
  merge stable public routes with biography article, blog, standalone artwork,
  collection, collection-scoped artwork, and linked Shopify product detail
  URLs.
- Dynamic sitemap sources are best-effort and isolated; a failed article, blog,
  artwork, collection, or Shopify source is omitted without breaking the whole
  sitemap. Duplicate paths and malformed/private path segments are excluded
  before canonical URL conversion.
- No `generateStaticParams()`, `revalidate`, or public detail route segment
  config changes were added.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- Build passed but emitted existing Shopify client warnings for `/sitemap.xml`
  fetches that specify both `cache: default` and `next.revalidate: 3600`; keep
  Shopify fetch-cache cleanup separate from this sitemap slice.
- Keep deployment smoke automation, broad static/ISR migration, product offer
  structured data, checkout/cart, Cloudinary delivery transformations, and
  owner/legal policy pages separate.
