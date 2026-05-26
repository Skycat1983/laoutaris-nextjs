# T-297 Prepare Sale Gallery Owner Review Packet

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create a concise owner-facing review packet for the live shop product
sale-gallery work so the owner can make the remaining visual, commerce, and
data decisions without reading task handoffs.

## What This Does

This task creates a plain-language packet, likely under `docs/prototypes/`, that
summarizes what is ready to review, what is blocked, and what decisions are
needed before agents start product-page rail adoption, real texture assets,
Shopify option mapping, frame/mat purchase behavior, physical dimensions, or a
repeat book sale-gallery QA pass.

## Why This Exists

T-293, T-294, T-295, and T-296 completed the agent-side sale-gallery follow-up
chain. The unlinked print route and named original route are scoped
owner-review-ready. The book candidate is blocked until Shopify data exposes
durable book metadata. The next useful step is an owner decision packet, not
more runtime work.

## Context

- T-261 built the live product detail sale-gallery shell for prints, originals,
  books, and generic products while preserving hosted Shopify purchase or
  enquiry fallback behavior.
- T-293 reviewed named print, original, and book-candidate routes. The print
  route was scoped owner-review-ready; the original route needed recheck; the
  book candidate was blocked by missing/misleading metadata.
- T-294 hardened product-kind classification so ambiguous untyped products do
  not render as originals from generic `artwork` fallback wording.
- T-295 rechecked the named original route and marked it scoped
  owner-review-ready.
- T-296 documented the Shopify metadata required before repeat book
  sale-gallery QA is meaningful.

## Scope

In scope:

- Create an owner-facing sale-gallery review packet under `docs/prototypes/` or
  the nearest established owner-review docs location.
- Include review routes and plain-language status:
  - print route ready for scoped owner review;
  - original route ready for scoped owner review;
  - book candidate blocked until Shopify metadata is updated and verified.
- Explain what the owner should inspect: layout, raw image, room previews,
  frame/mat controls for prints, original room previews, enquiry/purchase CTA
  wording, and mobile/desktop fit.
- Include concrete decision questions and project impact for:
  - approving the current print/original sale-gallery layout;
  - keeping or changing room backgrounds;
  - whether product pages should adopt the rail renderer from `/prototype/frame`;
  - whether procedural frame materials are acceptable or real texture assets are
    needed first;
  - whether frame/mat choices remain preview-only or need Shopify variant/option
    mapping;
  - what source owns physical dimensions;
  - when repeat book sale-gallery QA can run after Shopify metadata updates.
- Update this task, task index, prototypes index if a packet is added there,
  and relevant workstream notes after completion.

Out of scope:

- Do not edit runtime source, product data, Shopify metadata, CSS, sale-gallery
  components, frame-preview components, room backgrounds, or product images.
- Do not make owner decisions on the owner's behalf.
- Do not start product-page rail adoption, Shopify option mapping, checkout or
  cart work, enquiry mutation, physical dimension migration, frame/mat
  persistence, or real texture asset creation.
- Do not re-run browser visual QA.

## Concurrency

This docs-only task can run in parallel with unrelated implementation work. It
should not run in parallel with another task editing the same owner-review
packet, prototypes index, Shopify workstream handoff, frontend workstream
handoff, or testing workstream handoff.

This task owns:

- the new owner review packet;
- `docs/prototypes/README.md` if a prototypes packet is added there;
- `docs/tasks/T-297-prepare-sale-gallery-owner-review-packet.md`;
- `docs/tasks/README.md`;
- relevant Shopify/frontend/testing workstream notes.

Leave unrelated dirty files alone.

## Files Likely Touched

- `docs/prototypes/sale-gallery-owner-review-packet.md`
- `docs/prototypes/README.md`
- `docs/tasks/T-297-prepare-sale-gallery-owner-review-packet.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Completion Contract

- Mark this task `Status: Completed` only after the owner packet and tracker
  updates are complete.
- Record where the packet lives and which owner decisions remain open.
- State that no runtime/product-data changes were made.
- If the packet makes a follow-up implementation task actionable, list it as a
  candidate only; do not create it unless explicitly scoped by the orchestrator.

## Acceptance Criteria

- The packet lets a non-coder review the sale-gallery status without reading
  T-261 or T-293 through T-296.
- The packet clearly distinguishes ready print/original review routes from the
  book metadata blocker.
- Decision questions are concrete, answerable, and include practical project
  impact.
- No runtime behavior, product data, or Shopify metadata changes are made.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 after T-296 documented the book metadata readiness
  gate. This task exists because the sale-gallery work now needs owner
  decisions before further implementation, not another code slice.
- Completed on 2026-05-26 as a docs-only owner packet.
- Added
  [sale-gallery-owner-review-packet.md](../prototypes/sale-gallery-owner-review-packet.md)
  under `docs/prototypes/` and indexed it from
  [docs/prototypes/README.md](../prototypes/README.md).
- The packet records the ready scoped review routes:
  `/shop/products/joseph-laoutaris-fine-art-print-no-034` and
  `/shop/products/joseph-laoutaris-original-artwork-no-043`.
- The packet records the blocked book candidate:
  `/shop/products/the-complete-artwork-of-joseph-laoutaris`, which should not
  receive repeat book sale-gallery QA until Shopify metadata is updated and a
  Storefront read confirms a durable book/publication marker.
- Open owner decisions remain: current print/original layout approval, room
  background direction, product-page rail renderer adoption, procedural versus
  real frame material assets, whether frame/mat choices stay preview-only or
  map to Shopify variants/options, physical dimension source ownership, and
  repeat book review timing after metadata verification.
- No runtime source, product data, Shopify metadata, CSS, sale-gallery
  components, frame-preview components, room backgrounds, product images,
  checkout/cart behavior, enquiry behavior, tests, or browser QA were changed.
- Candidate follow-up only: after owner decisions are answered, scope separate
  implementation tasks for approved rail adoption, material asset work,
  Shopify option mapping, physical dimensions, or repeat book sale-gallery QA.

## Verification Result

```bash
git diff --check
```

Passed on 2026-05-26.
