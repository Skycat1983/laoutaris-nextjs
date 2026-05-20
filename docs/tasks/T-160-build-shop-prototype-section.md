# T-160 Build Shop Prototype Section

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Build the full-width shop teaser section for the homepage prototype using
`to_prototype/shop.png` as the design guide and real shop/product data where
available.

## Context

- The image is a guide for the homepage shop teaser section, not the shop
  landing page.
- Current commerce remains enquiry-led. Do not add cart or checkout behavior.
- Existing shop listing data is available through `getShopProductList` and the
  current `ShopProductsLoader` path.
- T-157 should provide `/prototype/home` and a prototype component folder before
  this task is wired into the route.

## Scope

In scope:

- Build a prototype shop section component under the prototype home folder.
- Use `to_prototype/shop.png` for composition, full-width horizontal product
  rhythm, CTA placement, card density, and navigation affordance inspiration.
- Consume real product data through existing server-only shop product services
  or a prototype loader that delegates to them.
- Link the section CTA to `/shop` or `/shop/products` based on existing route
  behavior.
- Render product cards from existing product DTO fields such as title, image,
  type/tags, and price where safely available.
- Keep copy enquiry-safe and avoid checkout, secure-payment, shipping, refund,
  buyer-protection, or guarantee claims.
- Keep the section full-width and independent of `ContentLayout`.
- Add focused coverage if meaningful behavior or data mapping is introduced.

Out of scope:

- Do not change the live shop landing page, `ShopProductsLoader`,
  `ShopProductGallery`, or Shopify DTO contracts.
- Do not add cart, checkout, variant selection, shipping, refund, or payment
  behavior.
- Do not redesign biography, blog, the global hero, or navbar.
- Do not edit global CSS or create central style tokens in this task.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-158 and T-159 after T-157 creates the prototype
route/folder. Avoid touching biography/blog prototype files.

Can run in parallel with T-161 because T-161 is read-only.

Owned files:

- shop prototype section files under `src/components/prototypes/home/`
- prototype home route wiring only for the shop slot if T-157 is complete
- focused shop prototype tests if added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/prototypes/home/ShopPrototypeSection.tsx`
- `src/components/prototypes/home/HomePrototype.tsx`
- optional `src/components/prototypes/home/ShopPrototypeLoader.tsx`
- focused tests under `__tests__/unit/` if added
- `docs/tasks/T-160-build-shop-prototype-section.md`

## Acceptance Criteria

- `/prototype/home` shows a full-width shop teaser inspired by
  `to_prototype/shop.png`.
- The section renders real product data where available and degrades cleanly if
  products cannot load.
- The section does not imply checkout/cart/payment behavior.
- The live homepage and live shop pages are unchanged.
- The section is responsive enough to inspect on desktop and mobile without
  obvious text overlap.

## Verification

```bash
npm run lint
git diff --check
```

Add focused tests if data mapping, fallback behavior, or route rendering is
covered.

## Agent Prompt

You are working on T-160. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Use `to_prototype/shop.png` as the visual guide for
a full-width homepage shop teaser section on `/prototype/home`. Use real shop
product data through existing server-only services where available. Keep all
copy enquiry-safe: no cart, checkout, secure-payment, shipping, refund,
buyer-protection, or guarantee claims. Do not change the live homepage, live
shop pages, `ShopProductsLoader`, `ShopProductGallery`, Shopify DTO contracts,
`ContentLayout`, global CSS, or shared trackers. Keep your writes inside the
prototype shop files and route wiring needed to display that section. Run the
listed verification and update only this task brief handoff.

## Handoff Notes

- Completed 2026-05-20.
- Added `ShopPrototypeSection` for the full-width homepage shop teaser, using
  `to_prototype/shop.png` for the header/CTA placement, horizontal product
  rhythm, product-card density, divider treatment, and rail controls.
- Added `getShopPrototypeProducts`, which delegates to server-only
  `getShopProductList`, limits the prototype rail to 8 products, and returns a
  neutral empty state when product loading fails.
- Wired `/prototype/home` to load biography, blog, and shop prototype data in
  parallel while preserving the isolated prototype route and leaving the live
  homepage/shop pages, `ShopProductsLoader`, `ShopProductGallery`, Shopify DTOs,
  `ContentLayout`, and global CSS unchanged.
- Added focused coverage for the prototype shop loader, product rendering,
  fallback state, CTA/product links, and source isolation.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/ShopPrototypeLoader.test.tsx __tests__/unit/pages/PrototypeHomePage.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Candidate tracker update for the orchestrator: T-160 is complete and the
  prototype shop section now uses real shop product data through the shared
  server-only product-list service.
