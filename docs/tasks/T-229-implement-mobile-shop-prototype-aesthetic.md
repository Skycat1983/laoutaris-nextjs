# T-229 Implement Mobile Shop Prototype Aesthetic

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Adapt only the `/prototype/home` shop section for mobile viewports using
`mobile_designs/shop.png` as the visual guide, while preserving the existing
wider desktop prototype behavior and real shop product data path.

## Context

- `/prototype/home` is an isolated owner-review workshop route, not the live
  homepage.
- The current shop prototype section already uses real Shopify product data
  where available and keeps the route enquiry-safe.
- `mobile_designs/shop.png` shows a phone-first commerce teaser with a warm
  gallery background, uppercase `Shop` eyebrow, large Cormorant `Available
  now` heading, intro copy, underlined `View full shop` link, rounded category
  pills, a centered featured product card with side-card peeks, circular
  previous/next buttons over the side cards, and a `Swipe to browse` progress
  indicator.
- Other agents may be working in this repo at the same time. Keep edits tightly
  scoped and do not overwrite unrelated dirty files.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/workstreams/testing-and-quality.md`
6. `docs/prototypes/homepage-owner-review-packet.md`
7. `docs/architecture/shopify-commerce.md`
8. `src/components/prototypes/home/ShopPrototypeSection.tsx`
9. `src/components/prototypes/home/HomePrototype.tsx`
10. `src/components/prototypes/home/prototypeHomeLayout.ts`
11. `__tests__/unit/pages/PrototypeHomePage.test.tsx`
12. `mobile_designs/shop.png`

## Scope

In scope:

- Implement a mobile-specific shop layout in
  `src/components/prototypes/home/ShopPrototypeSection.tsx`.
- Match the mobile mockup's important aesthetic beats:
  - warm off-white/gallery section background
  - uppercase `Shop` eyebrow
  - large Cormorant `Available now` heading
  - intro copy
  - underlined `View full shop` link
  - rounded category pill row such as Featured, Originals, Prints, Books, and
    Editions
  - centered featured product card with visible side-card peeks
  - circular previous/next controls
  - product image, label, title, divider, price, and `Details` affordance
  - `Swipe to browse` label and progress indicator
- Keep product cards backed by `SimpleProduct[]`; do not hard-code product
  titles, prices, or images except existing fallback copy.
- Preserve current product links (`/shop/products/[handle]`) and `SHOP_ROUTE`.
- Keep all copy enquiry-safe: no cart, checkout, secure-payment, shipping,
  refund, buyer-protection, guarantee, or purchase-finality claims.
- Preserve the current desktop/tablet shop behavior unless a shared helper
  needs a small compatible adjustment.
- Keep images constrained and object-fitted so product art remains visible
  without page-level horizontal overflow.
- Preserve empty/load-error behavior.
- Add or adjust focused tests for mobile controls, product links, source
  hygiene, or fallback behavior if needed.

Out of scope:

- Do not change the live homepage, `src/components/views/Home.tsx`, live shop
  pages, shop loaders, Shopify DTO/contracts, global CSS, Tailwind config, root
  layout, header, footer, or public navigation.
- Do not implement the biography, blog, collections, or project mobile mockups.
- Do not add cart, checkout, purchase, shipping, refund, or policy claims.
- Do not add, remove, or upgrade dependencies.
- Do not add a fake hamburger/menu control just because it appears in the
  mockup.
- Do not migrate prototype code into production.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- `src/components/prototypes/home/ShopPrototypeSection.tsx`
- focused shop prototype tests if needed
- this task brief handoff section

Avoid:

- `src/components/prototypes/home/BlogPrototypeSection.tsx`
- `src/components/prototypes/home/ProjectPrototypeSection.tsx`, if another
  agent creates it
- `src/components/prototypes/home/CollectionPrototypeSection.tsx`
- `src/components/prototypes/home/BiographyPrototypeSection.tsx`
- `src/components/prototypes/home/HomePrototype.tsx` unless absolutely needed
- live route/view files
- `docs/orchestration/state.md`, `docs/tasks/README.md`,
  `docs/workstreams/*`, shared trackers, risks, and audit registers

If `__tests__/unit/pages/PrototypeHomePage.test.tsx` already has unrelated
dirty changes, preserve them and add only the minimum shop-specific assertions.

## Acceptance Criteria

- At mobile widths, the shop section reads as the supplied mockup: editorial
  intro, category pills, centered featured product card, side-card peeks,
  previous/next controls, product details, and browse progress cue.
- The mobile layout does not create page-level horizontal scrolling.
- Text remains readable and does not overlap product imagery, controls, card
  edges, or CTA/link affordances.
- Product cards, controls, and shop links remain keyboard-accessible with clear
  focus states.
- Desktop and wider tablet shop behavior remains visually and functionally
  equivalent to the pre-task prototype.
- Existing empty/load-error behavior remains intact.
- The section remains enquiry-safe and does not imply checkout readiness.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx
npm run lint
git diff --check
```

If practical, run a narrow phone-viewport check for `/prototype/home` focused
only on the shop section. Capture concise observations, not traces, videos,
full DOM dumps, broad logs, or large screenshot sets.

## Agent Prompt

You are working on T-229. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/prototypes/homepage-owner-review-packet.md`,
`docs/architecture/shopify-commerce.md`,
`src/components/prototypes/home/ShopPrototypeSection.tsx`,
`src/components/prototypes/home/HomePrototype.tsx`,
`src/components/prototypes/home/prototypeHomeLayout.ts`,
`__tests__/unit/pages/PrototypeHomePage.test.tsx`, and
`mobile_designs/shop.png`.

Implement only the mobile shop prototype aesthetic for `/prototype/home`: warm
editorial intro, `View full shop` link, category pills, centered featured
product card with side-card peeks, circular previous/next controls, product
label/title/price/details, and `Swipe to browse` progress cue matching the
mockup's visual direction. Preserve real Shopify product data, current product
links, desktop/tablet behavior, empty/load-error states, live homepage behavior,
global CSS, navigation, shared trackers, and enquiry-safe commerce wording. Do
not add cart/checkout/purchase-policy claims or dependencies. Other agents may
be editing nearby prototype files, so keep changes scoped and preserve
unrelated dirty work. Run the focused prototype page test, lint,
`git diff --check`, and a targeted mobile visual check if available, then
update only this task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-229-implement-mobile-shop-prototype-aesthetic.md
```

## Handoff Notes

- Prepared on 2026-05-23 as the remaining mobile mockup slice for the
  `/prototype/home` shop section using `mobile_designs/shop.png`.
- Completed on 2026-05-23. Added the mobile-only shop prototype deck in
  `src/components/prototypes/home/ShopPrototypeSection.tsx` with category
  pills, centered featured product card, decorative side-card peeks, circular
  previous/next controls, product label/title/price/details, and a `Swipe to
  browse` progress cue while preserving the existing `md+` shop rail,
  `SimpleProduct[]` data path, product links, empty/load-error copy, and
  enquiry-safe wording.
- Added focused coverage in
  `__tests__/unit/pages/PrototypeHomePage.test.tsx` for the mobile shop pills,
  product controls, real product links/data, fallback product metadata, and the
  preserved desktop rail assertions.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Targeted route check: `npm run dev` served `/prototype/home` on
  `http://localhost:3001` because port 3000 was already in use, and `curl`
  returned `200` for `http://localhost:3001/prototype/home`. A true
  phone-viewport browser screenshot was not captured because repo-local browser
  automation is not installed (`playwright` resolves as unavailable). No
  browser automation dependency was added.
- Follow-up correction on 2026-05-23 after owner feedback: replaced the
  collection-like absolute mobile shop deck with a shop-specific horizontal
  snap rail. The mobile shop now uses real inline product cards with scroll
  padding for side-card peeks and keeps state only for previous/next controls
  and progress. Added source coverage to keep the mobile shop carousel distinct
  from the collections deck. Verification passed again with
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Follow-up refinement on 2026-05-23 after owner feedback: tightened the mobile
  spacing between `View full shop`, category controls, and the product rail;
  reduced category controls to selectable `Originals`, `Prints`, and `Books`
  buttons with `Originals` selected by default; removed mobile product-card
  rounded corners; and compacted the mobile card details so the divider, price,
  and `Details` affordance sit closer to the title. Verification passed again
  with `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Follow-up refinement on 2026-05-23 after owner feedback: changed the mobile
  category controls from visual toggles into real tabs that filter the product
  rail by Shopify `productType` or tags for originals, prints, and books. Tab
  changes reset the rail to the first matching product, and empty categories
  show neutral prototype copy instead of stale cards. Verification passed again
  with `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`,
  `npm run lint`, and `git diff --check`.
