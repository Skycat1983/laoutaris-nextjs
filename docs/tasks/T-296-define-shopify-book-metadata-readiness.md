# T-296 Define Shopify Book Metadata Readiness

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Document the durable Shopify metadata required before the current book candidate
can receive a meaningful sale-gallery owner-review pass.

## What This Does

This task updates the commerce docs/runbook with a concrete book product
readiness checklist: the Shopify fields or metafields that must identify a
product as a book/publication, the optional `featured_artwork_ids` relationship
needed for featured artwork sections, and the verification evidence needed
before assigning a repeat book sale-gallery QA task.

## Why This Exists

T-293 found the book candidate
`/shop/products/the-complete-artwork-of-joseph-laoutaris` was not
owner-review-ready because Storefront data did not expose durable book markers.
T-294 fixed the code so generic `artwork` wording no longer misclassifies the
product as an original. T-295 then signed off the original route. The remaining
book blocker is now owner/Shopify data setup, not a rendering change.

## Context

- Current code already supports book classification from `featuredArtworkIds`,
  `productType`, tags, or clear book/catalog/publication signals.
- Current code already supports ordered Shopify product images for book
  cover/page gallery slots when the product is classified as `book`.
- The current book candidate lacks `productType`, tags, and
  `featuredArtworkIds` in Storefront data, so another visual QA pass would not
  test real book behavior yet.
- `docs/runbooks/shopify-operations.md` already describes basic book setup with
  `featured_artwork_ids`, but it does not yet connect that setup to sale-gallery
  owner-review readiness after T-293/T-294/T-295.

## Scope

In scope:

- Update Shopify operations/runbook guidance with a book sale-gallery readiness
  checklist.
- State the minimum durable metadata that can classify a product as a book:
  Shopify `productType`, a durable tag such as `book`/`publication`, or the
  existing `custom.featured_artwork_ids` metafield when relevant.
- State when `featured_artwork_ids` is required: it is required for featured
  artwork sections, but a book can still render an ordered cover/page image
  gallery when classified by durable product metadata and Shopify images exist.
- Record that the current candidate should not be considered book
  owner-review-ready until Storefront product data exposes one of the durable
  book markers.
- Add a follow-up note that a repeat book sale-gallery visual QA task should run
  only after the owner applies metadata in Shopify and Storefront reads confirm
  it.
- Update this task, task index, and relevant workstream notes after completion.

Out of scope:

- Do not mutate Shopify product data.
- Do not add hard-coded handles, title heuristics, or source-side book metadata
  overrides.
- Do not change runtime source, product classification code, sale-gallery
  rendering, product images, product-page rail rendering, cart/checkout, option
  mapping, frame/mat persistence, enquiry behavior, or physical dimensions.
- Do not re-run print, original, or book visual QA.
- Do not install or expand browser tooling.

## Concurrency

This docs-only task can run in parallel with unrelated implementation work. It
should not run in parallel with another task editing the Shopify commerce
architecture, Shopify operations runbook, or Shopify workstream handoff.

This task owns:

- `docs/tasks/T-296-define-shopify-book-metadata-readiness.md`
- `docs/tasks/README.md`
- `docs/runbooks/shopify-operations.md`
- `docs/architecture/shopify-commerce.md` if a durable architecture note is
  needed
- relevant Shopify/frontend/testing workstream notes

Leave unrelated dirty files alone.

## Files Likely Touched

- `docs/runbooks/shopify-operations.md`
- `docs/architecture/shopify-commerce.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/tasks/README.md`
- `docs/tasks/T-296-define-shopify-book-metadata-readiness.md`

## Completion Contract

- Mark this task `Status: Completed` only after the readiness checklist and
  tracker updates are complete.
- Record exactly what metadata is required before book sale-gallery QA can be
  reassigned.
- Record that no Shopify data or runtime code was changed.
- State the next candidate task only if it is now actionable.

## Acceptance Criteria

- Shopify operations docs tell an owner/operator how to make a book product
  identifiable to the current Storefront-backed sale-gallery code.
- Docs distinguish classification metadata from optional/relationship metadata:
  `productType`/tags can classify a book, while `featured_artwork_ids` connects
  the product to featured archive artworks.
- Docs explicitly say the current book candidate remains blocked until Shopify
  data is updated and verified.
- No runtime source, tests, or Shopify data are changed.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 after T-295 signed off the original route. This task
  exists because the remaining sale-gallery blocker is book product metadata
  ownership, not code or broad visual QA.
- Completed on 2026-05-26 as a docs-only readiness pass.
- Updated the Shopify operations runbook with the minimum durable book
  classifiers accepted by current Storefront-backed code: Shopify
  `productType`, durable Shopify tags such as `book`/`publication`, or
  `custom.featured_artwork_ids` when the book also relates to featured archive
  artworks.
- Clarified that `custom.featured_artwork_ids` is required for featured
  artwork sections, but not required for a classified book to render ordered
  Shopify cover/page gallery images.
- Recorded that
  `/shop/products/the-complete-artwork-of-joseph-laoutaris` remains blocked for
  book sale-gallery owner review until Shopify data is updated and Storefront
  reads confirm a durable book marker.
- No Shopify product data, runtime source, tests, product images, sale-gallery
  rendering, cart/checkout behavior, option mapping, enquiry behavior, or
  physical dimensions were changed.
- Next candidate task: after the owner applies Shopify metadata and a
  Storefront read confirms it, assign a narrow repeat book sale-gallery visual
  QA pass for the same candidate handle.

## Verification Result

```bash
git diff --check
```

Passed on 2026-05-26.
