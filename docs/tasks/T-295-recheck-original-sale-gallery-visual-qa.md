# T-295 Recheck Original Sale Gallery Visual QA

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Recheck the original artwork sale-gallery route from T-293 after T-294 hardened
product-kind classification, and decide whether that original route is scoped
owner-review-ready or still blocked.

## What This Does

This task reviews
`/shop/products/joseph-laoutaris-original-artwork-no-043` at targeted desktop
and mobile/narrow widths. It confirms whether the raw original preview is
visibly meaningful, whether generated room-gallery selection works repeatably,
whether the sale shell remains stable, and whether the enquiry CTA remains
truthful.

## Why This Exists

T-293 could not sign off the original route because the raw preview appeared
mostly blank in a desktop screenshot and a follow-up room-selection click check
was not repeatable after intermittent Shopify fetch failures. T-294 fixed the
separate product-kind classification issue, but it did not re-run this visual
check.

## Context

- T-261 made `/shop/products/[productHandle]` render the sale gallery as the
  common detail layout.
- T-293 found the unlinked print route scoped owner-review-ready, found the
  book candidate blocked by missing durable Shopify book metadata, and left the
  original route awaiting a stable visual recheck.
- T-294 fixed the generic `artwork` fallback misclassification so ambiguous
  untyped products no longer become originals solely because fallback text
  contains `artwork`.
- The original route reviewed by T-293 was
  `/shop/products/joseph-laoutaris-original-artwork-no-043`.

## Scope

In scope:

- Review only the named original product route unless the route no longer
  exists, in which case record the exact blocker.
- Inspect one desktop viewport and one mobile/narrow viewport.
- Confirm route status, sale-gallery render, product kind/copy, raw image
  visibility, room-gallery labels, room-selection interaction, absence of
  print-only frame/mat controls, enquiry CTA wording, and layout overflow.
- Keep evidence targeted: selectors, route status, small screenshots or
  bounding-box notes only where needed.
- Record whether the route is owner-review-ready, needs a visual refinement, or
  is blocked by unstable product fetches/data.

Out of scope:

- Do not change runtime source, product data, Shopify metadata, room
  backgrounds, product-page rail rendering, frame/mat controls, enquiry
  behavior, route cache policy, or broad visual design.
- Do not re-review print behavior or book behavior.
- Do not implement cart/checkout, Shopify option mapping, frame/mat
  persistence, sale-policy copy, physical dimension migration, or product-data
  mutation.
- Do not install or expand Playwright; use existing local tooling only.

## Concurrency

This is a focused review task and can run in parallel with unrelated backend or
docs work. It should not run in parallel with another task editing
`src/app/shop/products/[productHandle]/page.tsx`,
`src/components/shop/product-detail/*`, or
`src/components/shop/frame-preview/*`.

Owned files:

- this task brief handoff section only
- optional concise assessment note if screenshot references or owner notes need
  a durable location

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `src/app/shop/products/[productHandle]/page.tsx`
- `src/components/shop/product-detail/ShopProductSaleGallery.tsx`
- `src/lib/shop/productClassification.ts`
- `docs/tasks/T-293-review-live-sale-gallery-visual-qa.md`
- `docs/tasks/T-294-harden-sale-gallery-product-kind-classification.md`

## Completion Contract

- Mark this task `Status: Completed` only after the targeted recheck is done.
- Record the route, viewports, product-fetch stability, visual findings, and
  exact verification result.
- State clearly whether the original route is owner-review-ready, needs a
  specific follow-up, or remains blocked by product-fetch/data instability.
- If shared trackers are not owned by this task, list candidate tracker updates
  for the orchestrator instead of editing them.

## Acceptance Criteria

- Handoff states whether
  `/shop/products/joseph-laoutaris-original-artwork-no-043` returned `200` and
  rendered `shop-product-sale-gallery`.
- Raw preview visibility is confirmed or a specific visual/data blocker is
  recorded.
- Room-gallery selection is confirmed repeatable or a specific fetch/interaction
  blocker is recorded.
- The route does not show print-only frame/mat controls.
- CTA copy remains factual for the current Shopify-hosted purchase/enquiry
  boundary.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

If browser automation is used, keep it limited to the named original product
route, targeted selectors, one desktop viewport, and one mobile/narrow
viewport. Do not collect traces, videos, full DOM dumps, full browser logs, or
large screenshot sets.

## Agent Prompt

You are working on T-295. Read `AGENTS.md`, `docs/README.md`,
`docs/tasks/T-293-review-live-sale-gallery-visual-qa.md`,
`docs/tasks/T-294-harden-sale-gallery-product-kind-classification.md`, and the
Shopify/frontend/testing workstreams. Recheck only
`/shop/products/joseph-laoutaris-original-artwork-no-043` at one desktop and one
mobile/narrow viewport. Confirm route status, sale-gallery render, raw image
visibility, room-gallery selection, absence of print-only frame/mat controls,
truthful CTA wording, and layout overflow. This is a review task only: do not
edit runtime source, product data, Shopify metadata, shared trackers, or broad
visual styling. Run `git diff --check`.

## Handoff Notes

- Planned on 2026-05-26 after T-294 completed product-kind classification
  hardening. This task exists because T-293 left the original product route
  unsigned-off due to raw image visibility concerns and intermittent local
  Shopify fetch failures during room-selection rechecks.
- Completed on 2026-05-26 with a scoped recheck of only
  `/shop/products/joseph-laoutaris-original-artwork-no-043` at desktop
  `1440x1000` and mobile/narrow `390x844` viewports against local
  `http://localhost:3003`.
- Route result: the final scoped probe returned `200` and rendered
  `shop-product-sale-gallery`. The sale shell showed `Original Artwork` /
  `Original artwork`, title `No.043`, five gallery buttons, and no empty
  preview state.
- Raw preview result: confirmed visibly meaningful at both viewports after
  targeting the main preview area. The raw Shopify product image loaded from
  `https://cdn.shopify.com/s/files/1/0992/3182/6184/files/JRL_w090_crop.jpg?v=1759319612`
  with natural dimensions `3504x2898`; desktop rendered it at about
  `448x688`, and mobile rendered it at about `342x496`.
- Room-selection result: confirmed repeatable in the browser probe. The
  gallery switched raw -> Modern Gallery -> Scandinavian White Wall -> raw at
  desktop and mobile; selected button labels and `aria-pressed` state updated,
  and `shop-sale-main-room-preview` appeared for room selections.
- Controls and CTA result: print-only `Frame` and `Mat` controls were absent
  at both viewports. The route used the current truthful enquiry boundary:
  `Enquire About This Product` plus `Contact the archive team to confirm
  availability and purchase details.` It did not show a Shopify purchase CTA or
  checkout copy because this product has no hosted Shopify URL in the current
  data.
- Layout result: no horizontal document overflow was detected at desktop
  (`scrollWidth` `1425`, `innerWidth` `1440`) or mobile (`390` / `390`).
- Product-fetch stability: successful browser navigations were stable enough
  to complete the scoped sign-off, but the local dev server still logged two
  transient Shopify `getProductByHandle` `fetch failed` errors during a
  separate `HEAD` route-status probe before subsequent `GET` requests returned
  `200`. Treat this as residual local/live Storefront fetch instability, not a
  blocker for this route's scoped visual owner-review readiness.
- Evidence was intentionally limited to selector facts, bounding boxes, route
  status, and four clipped main-preview screenshots in `/private/tmp`:
  `t295-original-desktop-raw.png`, `t295-original-desktop-room.png`,
  `t295-original-mobile-raw.png`, and `t295-original-mobile-room.png`. No
  traces, videos, full DOM dumps, full browser logs, or broad screenshot sets
  were collected.
- Decision: the original artwork route is scoped owner-review-ready for the
  T-295 criteria. Candidate tracker update for the orchestrator: keep a
  separate reliability follow-up for intermittent live Shopify Storefront
  fetch failures during local route probes if that is not already tracked.
- Intentionally out of scope and not changed: runtime source, product data,
  Shopify metadata, shared trackers, workstream briefs, product-page rail
  rendering, frame/mat behavior, room backgrounds, CTA behavior, route cache
  policy, and broad visual styling.
- Verification:
  - Scoped Chrome DevTools Protocol probe completed against
    `http://localhost:3003` for the named route at `1440x1000` and `390x844`.
  - `git diff --check` passed.
