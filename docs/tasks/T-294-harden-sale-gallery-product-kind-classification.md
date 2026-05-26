# T-294 Harden Sale Gallery Product Kind Classification

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Stop untyped Shopify products from being misclassified as original artworks
solely because their title, handle, or description contains the generic word
`artwork`, then record the durable metadata still required for book sale-gallery
review.

## Context

- T-293 reviewed the live T-261 sale gallery with one print route, one original
  route, and one book-candidate route.
- The unlinked print route was owner-review-ready for the scoped current
  behavior.
- The original route needs a later stable recheck for raw image visibility and
  room-gallery selection because repeated local Shopify fetches were
  intermittent.
- The book candidate,
  `/shop/products/the-complete-artwork-of-joseph-laoutaris`, rendered as
  `Original Artwork` because current Storefront data has empty `productType`,
  empty `tags`, no `featuredArtworkIds`, and no explicit book/catalog/publication
  marker. The title/handle contain `artwork`, which is too weak to infer an
  original artwork product.

## Scope

In scope:

- Update `getShopProductKind()` so fallback title/handle/description token
  `artwork` alone does not classify an untyped product as `original`.
- Preserve stronger original signals such as explicit `original`, painting,
  drawing, canvas, or owner-approved explicit metadata where current behavior
  depends on them.
- Preserve book classification from durable book signals:
  `featuredArtworkIds`, `productType`, tags, or clear book/catalog/publication
  tokens.
- Add focused unit coverage for:
  - the T-293 book-candidate shape returning `product`, not `original`, when no
    durable book/original metadata exists;
  - an untyped `original-artwork` handle/title still returning `original`;
  - explicit Shopify metadata still returning the expected kind.
- Update this task, task index, and relevant workstream notes after completion.

Out of scope:

- Do not mutate Shopify product data.
- Do not invent book metadata in source code or hard-code the current book
  candidate handle.
- Do not make the book candidate owner-review-ready without durable Shopify
  metadata.
- Do not re-run broad visual QA, redesign the sale gallery, change room
  backgrounds, apply the rail renderer to product pages, add cart/checkout,
  map Shopify options, persist frame/mat choices, change enquiry behavior, or
  migrate physical dimensions.
- Do not address the T-293 original-route visual recheck in this task except to
  preserve existing original classification for strong original signals.

## Concurrency

Do not run in parallel with another task editing
`src/lib/shop/productClassification.ts`, product-detail sale-gallery behavior,
or shared shop product-detail tests.

This task owns the implementation files it changes plus this task brief,
`docs/tasks/README.md`, and relevant Shopify/frontend/testing workstream notes.
Leave unrelated dirty files alone.

## Files Likely Touched

- `src/lib/shop/productClassification.ts`
- `__tests__/unit/shopProductDetailPage.test.tsx`
- a focused classifier unit test if one exists or is added
- `docs/tasks/T-294-harden-sale-gallery-product-kind-classification.md`
- `docs/tasks/README.md`
- relevant workstream notes

## Completion Contract

- Mark this task `Status: Completed` only after implementation, focused tests,
  docs, and whitespace verification are done.
- Record whether ambiguous untyped products now fall back to `product` instead
  of `original`.
- Record that book owner-review remains blocked until Shopify product data
  carries durable book metadata.
- List any candidate follow-up for the original-route visual recheck instead of
  broadening this task.

## Acceptance Criteria

- A product shaped like the T-293 book candidate with no `productType`, no tags,
  no `featuredArtworkIds`, and only generic `artwork` fallback wording no longer
  renders/classifies as `original`.
- Untyped products with strong original signals such as `original-artwork` still
  classify as `original`.
- Products with explicit book metadata still classify as `book` and keep ordered
  product image/page gallery behavior.
- Products with explicit print metadata or clear print fallback signals still
  classify as `print`.
- No checkout/cart, Shopify mutation, room preview, rail renderer, or visual
  redesign behavior changes are introduced.

## Verification

```bash
npm test -- --runTestsByPath <focused classifier/product-detail tests>
git diff --check
```

Broaden to `npm run lint` only if the implementation touches more than the
classifier and focused tests.

## Handoff Notes

- Planned on 2026-05-26 from T-293. This task does the classification cleanup
  because the current book candidate was misleadingly shown as an original
  artwork due to weak fallback wording. It does not solve missing Shopify book
  metadata or the original-route visual recheck.
- Completed on 2026-05-26. `getShopProductKind()` now separates explicit
  Shopify metadata tokens from fallback handle/title/description tokens.
  Explicit metadata can still classify `Artwork`, `Original`, painting,
  drawing, or canvas products as `original`, but fallback `artwork` by itself no
  longer does.
- Ambiguous untyped products shaped like the T-293 book candidate now classify
  and render as generic `product`, not `original`. The product detail regression
  keeps the sale gallery, raw product image fallback, enquiry boundary, and no
  print frame controls or original room-preview labels.
- Preserved expected classification for untyped `original-artwork` fallback
  wording, explicit book/print/original metadata, `featuredArtworkIds`, and
  clear fallback book/catalog/publication tokens.
- Book owner review remains blocked until Shopify product data carries durable
  book metadata such as `productType`, tags, or `featuredArtworkIds`; this task
  did not mutate Shopify data or hard-code the current book-candidate handle.
- Candidate follow-up: recheck the T-293 original route raw image visibility
  and room-gallery selection after product fetches are stable.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/shopProductClassification.test.ts __tests__/unit/shopProductDetailPage.test.tsx` passed with 2 suites and 21 tests.
  - `git diff --check` passed.
