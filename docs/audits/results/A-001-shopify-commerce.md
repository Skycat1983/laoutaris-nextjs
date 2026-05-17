# A-001 Shopify Commerce Readiness Result

Status: Completed

Audit goal: [A-001 Shopify commerce readiness](../goals.md#a-001-shopify-commerce-readiness)

Workstream: [Shopify commerce](../../workstreams/shopify-commerce.md)

## Summary

The Shopify commerce surface is not production-ready yet. The listing route has
the intended MongoDB-to-Shopify join shape and deduplicates product IDs, and the
client product grid still uses the direct `ProductCard` import needed to avoid
the prior client-bundle crash. The main blockers are product detail artwork
linking, checkout scope, admin linking workflow, product ID validation, fake or
non-functional filters and pagination, and missing test coverage around the
Shopify/API transformation path.

## Scope Inspected

- Documentation:
  - `docs/README.md`
  - `docs/workstreams/shopify-commerce.md`
  - `docs/architecture/shopify-commerce.md`
  - `docs/runbooks/shopify-operations.md`
  - `docs/archive/README.md`
  - `docs/audits/goals.md#a-001-shopify-commerce-readiness`
  - `docs/architecture/routes-and-api.md`
  - `docs/risks/production-readiness.md`
- Historical shop notes:
  - `SHOP_ROUTING_ARCHITECTURE.md`
  - `SHOPIFY_ARTWORK_LINKING.md`
  - `SHOP_IMPLEMENTATION_SUMMARY.md`
  - `SHOP_RECONSTRUCTION_SUMMARY.md`
  - `SHOP_SORTING_IMPLEMENTATION.md`
  - `SHOP_CRASH_FIX.md`
- Runtime code inspected, without refactoring:
  - `src/app/shop/page.tsx`
  - `src/app/shop/products/page.tsx`
  - `src/app/shop/products/[productHandle]/page.tsx`
  - `src/app/api/v2/public/shop/products/route.ts`
  - `src/app/api/v2/public/shop/products/[productId]/route.ts`
  - `src/app/api/v2/public/artwork/[id]/route.ts`
  - `src/lib/api/shopify/shopifyClient.ts`
  - `src/lib/api/shopify/queries.ts`
  - `src/lib/config/shopifyConfig.ts`
  - `src/lib/data/models/artworkModel.ts`
  - `src/lib/data/schemas/artworkSchema.ts`
  - `src/lib/data/types/shopTypes.ts`
  - `src/lib/data/types/shopify.ts`
  - `src/lib/data/types/shopifyTypes.ts`
  - `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
  - `src/components/compositions/ShopProductGallery.tsx`
  - `src/components/modules/filters/ShopFilters.tsx`
  - `src/components/modules/filters/ShopResultsBar.tsx`
  - `src/components/modules/cards/ProductCard.tsx`
  - `src/components/modules/cards/ArtworkShopSection.tsx`
  - Admin artwork create/update forms and routes under
    `src/components/features/adminDashboard/` and
    `src/app/api/v2/admin/artwork/`
- Test surface inspected:
  - `__tests__/unit/`
  - `__tests__/integration/`

## Commands Run

- `git status --short`: confirmed pre-existing dirty/untracked project docs and
  README state before editing.
- `sed -n ... docs/...`: read required documentation, linked route/risk docs,
  archive index, audit goal, and the existing A-001 result file.
- `sed -n ... SHOP_*.md`: read historical shop routing, linking, filtering,
  reconstruction, sorting, and crash-fix notes.
- `rg --files src/app/shop src/app/api/v2/public/shop src/lib/api/shopify src/lib/data/types src/components/...`:
  located Shopify routes, API client, types, filters, cards, and loader files.
- `rg -n "shopifyProducts|Shopify|shopify|checkout|buy|cart|sortBy|ProductCard|ShopFilters|ShopResultsBar|getProduct" src docs tests __tests__`:
  searched Shopify and shop behavior references. The command reported
  `tests: No such file or directory`; `__tests__` was inspected separately.
- `rg -n "api/artworks|api/v2/public/artwork|fetchArtwork|ArtworkShopSection|shopifyProducts" src/app src/components src/lib`:
  verified product detail references a non-existent `/api/artworks/:id` path
  while the live public artwork API is `/api/v2/public/artwork/[id]`.
- `rg -n "SHOPIFY_|shopifyConfig|NEXT_PUBLIC_BASE_URL|process\.env" src/lib src/app docs/runbooks docs/workstreams docs/architecture`:
  inspected Shopify environment variable usage and credential references.
- `rg -n "shopifyProducts|Shopify|shopify|productId|featured_artwork_ids|mongodb_artwork_id" src/components/features src/app/api/v2/admin src/lib`:
  checked for admin Shopify-linking workflow and schema support.
- `find __tests__ -type f -maxdepth 4`: listed current tests; no Shopify,
  shop, product transform, or shop API tests were found.
- `nl -ba ...`: captured line-numbered evidence from the inspected runtime files.
- `sed -n ... package.json`: inspected available verification scripts. No
  test/build/lint command was run because this was a non-mutating audit and no
  runtime code changed.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Product detail pages cannot currently load linked archive artwork or book artwork context from the documented public API. | `src/app/shop/products/[productHandle]/page.tsx:20-26` and `:37-45` fetch `/api/artworks/:id`, but the live public route is `src/app/api/v2/public/artwork/[id]/route.ts:34-37` and returns `{ success, data }`, not raw artwork. `rg --files src/app/api` found no `/api/artworks` route. | Replace the route-local artwork fetch with the canonical public/server API helper, parse the response envelope, and add product-detail tests for original, print, book, missing artwork, and malformed metafields. |
| High | Checkout/cart handoff is only a placeholder, so product detail is not a purchase flow. | `src/app/shop/products/[productHandle]/page.tsx:113-119` renders an `Add to Cart` button with no handler, cart mutation, checkout URL, or variant selection. `docs/risks/production-readiness.md` already tracks R-001 for undefined checkout scope. | Escalate a product decision: first release should either hide checkout UI, link to Shopify-hosted product/checkout, or implement Shopify cart/checkout with variant selection. |
| High | Admin product-linking workflow is not implemented as an operator-safe workflow. | `src/lib/data/models/artworkModel.ts:97-107` stores `shopifyProducts`, but `src/lib/data/schemas/artworkSchema.ts:7-45` has no Shopify link schema and admin create/update forms expose only artwork metadata. `src/app/api/v2/admin/artwork/update/[id]/route.ts` accepts arbitrary `$set` data but provides no dedicated Shopify-link validation or workflow. | Escalate the admin-linking decision: define whether links are managed in the existing artwork form, a dedicated admin panel, or an operator script; add numeric-ID/type validation and duplicate prevention. |
| High | Shopify credential handling violates the env-only documentation expectation. | `src/lib/config/shopifyConfig.ts:1-8` reads env vars but includes a concrete Storefront token-shaped value in comments, and `src/app/shop/products/page.tsx:5-6` still says credentials need moving before pushing. The runbook and workstream expect Shopify secrets to live in environment variables only. | Remove credential examples from source comments, verify the token was never a sensitive private token, and rotate it if it is real or has been exposed. |
| Medium | Product ID contract is canonical in docs but not enforced in code, which can break legacy GID-style data. | `src/lib/data/types/shopifyTypes.ts:1-4` documents numeric IDs, while historical notes still show `gid://shopify/Product/...`; `src/lib/data/models/artworkModel.ts:97-107` accepts any string; `src/app/api/v2/public/shop/products/route.ts:103-107` blindly prefixes every stored value with `gid://shopify/Product/`. | Add a shared normalizer/validator for numeric IDs, reject invalid admin writes, and run a one-time data audit or migration for legacy GID values before production. |
| Medium | Colour and dimension filters are visible but non-functional. | `src/components/modules/filters/ShopFilters.tsx:64-87` and `:126-140` render colour and dimension selects; `src/components/compositions/ShopProductGallery.tsx:89-101` never sends them; `src/app/api/v2/public/shop/products/route.ts:21-28` only reads `decade`, `artstyle`, `medium`, and `surface`. Historical notes already said colour/dimension filters were not implemented. | Remove or disable unsupported controls, or implement backed fields/query behavior. Add tests that each visible filter changes the outgoing API request and server query. |
| Medium | Pagination UI is hard-coded and not connected to API behavior. | `src/components/modules/filters/ShopResultsBar.tsx:32-46` renders fixed `1`, `2`, `...`, `5`, and arrow controls with no state or handlers. `src/app/api/v2/public/shop/products/route.ts:46-135` fetches all matching linked artworks/products and returns only `totalArtworks` and `totalProducts`. | Either remove fake pagination for first release or implement `page`, `limit`, and stable product-count semantics across MongoDB and Shopify product fetches. |
| Medium | Default product-type sorting infers type from product title instead of canonical metadata. | `src/components/compositions/ShopProductGallery.tsx:55-67` orders products by checking whether the title contains `book`, `original`, or `print`. `src/lib/api/shopify/shopifyClient.ts:94-115` transforms products without `productType`, tags, variant IDs, or the MongoDB link type that the listing route used. | Carry product type/link metadata through the listing API response and sort on explicit fields. Cover book/original/print ordering when titles do not contain type keywords. |
| Medium | Shopify product transformation is too thin for checkout and robust product detail. | `src/lib/api/shopify/queries.ts:83-149` and `:157-224` query variants, `productType`, tags, and metafields, but `src/lib/api/shopify/shopifyClient.ts:94-115` drops variant IDs/titles/availability, `productType`, tags, and `descriptionHtml`. The product detail page cannot select a variant or create a checkout/cart line from `SimpleProduct`. | Define the product detail contract needed for first release checkout and expose variants, product type, tags, and safe HTML/description handling accordingly. |
| Medium | Public shop API response shape is inconsistent between listing and single-product endpoints. | Listing returns `{ success, data, metadata }` in `src/app/api/v2/public/shop/products/route.ts:128-135`; single product returns raw product or raw `{ error }` in `src/app/api/v2/public/shop/products/[productId]/route.ts:15-40`. `ArtworkShopSection` consumes the raw product at `src/components/modules/cards/ArtworkShopSection.tsx:39-49`. | Standardize the public shop API envelope before broader client usage and add route tests for success, not found, validation failure, and Shopify upstream failure. |
| Low | Debug logging is too noisy for production commerce paths. | Listing API logs queries/counts at `src/app/api/v2/public/shop/products/route.ts:41-44`, `:51-54`, `:64-78`, `:88-100`, and `:123-126`; loader/gallery/artwork sale sections log product URLs and product data at `src/components/loaders/viewLoaders/ShopProductsLoader.tsx:46-70`, `src/components/compositions/ShopProductGallery.tsx:19-20`, `:71-75`, `:111-131`, and `src/components/modules/cards/ArtworkShopSection.tsx:44-85`. | Remove or gate debug logs behind a structured server-side debug flag before launch. |

## Targeted Tests Recommended

- Unit test Shopify product transformation for missing images, no variants,
  compare-at prices, `mongodb_artwork_id`, valid/invalid
  `featured_artwork_ids`, product type, tags, and variant IDs once exposed.
- Unit test Shopify product ID normalization for numeric IDs, GIDs, empty
  strings, and duplicate links.
- Route-test `GET /api/v2/public/shop/products` for empty data, linked books
  deduplication, product type filters, unsupported filters, failed Shopify
  product fetches, and envelope shape.
- Route-test `GET /api/v2/public/shop/products/[productId]` for numeric ID
  validation, not found, upstream failure, and response envelope consistency.
- Component or integration test `/shop/products/[productHandle]` for original,
  print, book, unavailable, missing linked artwork, and malformed metafield
  cases.
- Component test `ShopProductGallery`/`ShopFilters`/`ShopResultsBar` for every
  visible filter, loading/error states, reset behavior, sorting, and pagination
  visibility.
- Admin workflow test for creating/removing `shopifyProducts` links once the
  workflow decision is made.

## Findings Register Updates

- Not updated by this audit because the assignment explicitly scoped edits to
  this result file.
- Candidate rows for reconciliation:
  - High, Shopify: Product detail route uses a non-existent artwork API path and
    does not parse the public artwork envelope.
  - High, Shopify: Checkout/cart handoff is undefined while product detail shows
    an `Add to Cart` affordance.
  - High, Admin/Shopify: Admin product-linking workflow and validation are
    missing.
  - High, Security/Deployment: Shopify credential-like value remains in source
    comments.
  - Medium, Shopify/Data: Numeric Shopify product IDs are documented but not
    validated or migrated.
  - Medium, Shopify/UI: Visible colour and dimension filters are non-functional.
  - Medium, Shopify/UI: Pagination controls are placeholders.
  - Medium, Shopify/Data: Sorting depends on title keywords instead of product
    metadata.
  - Medium, Shopify/API: Public shop API response envelopes are inconsistent.

## Risks Updated

- None. Existing risks R-001, R-005, and R-009 are relevant, but this audit was
  explicitly scoped to the result file and did not modify the risk register.

## Workstream Updates

- None. The workstream should be updated during reconciliation, but this audit
  was explicitly scoped to the result file.

## Decisions To Escalate

- Checkout scope: product detail currently shows `Add to Cart`, but no cart,
  checkout URL, or variant handoff exists. Decide whether first release hides
  purchase controls, links out to Shopify, or implements Shopify cart/checkout.
- Product source of truth for listing: canonical docs say MongoDB supplies
  archive/link context and Shopify supplies commerce data. Confirm whether the
  first release should list only MongoDB-linked Shopify products or all Shopify
  products, including unlinked products that have no archive context.
- Admin product-linking workflow: decide whether Shopify links are managed in
  the existing artwork form, a dedicated admin workflow, or a controlled
  operator script.

## T-059 Product Link Audit

Date: 2026-05-17

Target environment label: owner-approved MongoDB Atlas `laoutarisDB` target.
The connection string was supplied through the task shell and is not recorded in
docs.

Command run:

```bash
npm run audit:shopify-products
```

Exit code: `0`

Result classification: completed existing-data audit evidence. The first
sandboxed attempt failed before connection because DNS/network access was
blocked; the approved-network rerun connected to MongoDB, read only the
projected artwork fields, did not call Shopify APIs, and did not mutate data.

| Report Field | Value |
| --- | --- |
| Total artworks scanned | 215 |
| Artworks with Shopify links | 92 |
| Total Shopify links | 99 |
| Invalid product IDs | 0 |
| Unknown product types | 0 |
| Within-artwork duplicates | 0 |
| Cross-artwork duplicates | 1 group: `type=book`, `productId=10538937319688`, `artworkCount=92`, `linkCount=92`. |

Recommended next task: use
[T-082](../../tasks/T-082-harden-admin-shopify-product-link-validation.md) to
confirm whether the shared book product link is intentional, then harden the
admin product-link validation boundary so future writes keep numeric product
IDs, known product types, and no within-artwork duplicates. No current
product-ID cleanup or migration is indicated by this audit.

## Completion Audit

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read required docs. | Scope inspected lists `docs/workstreams/shopify-commerce.md`, `docs/architecture/shopify-commerce.md`, `docs/runbooks/shopify-operations.md`, `docs/archive/README.md`, and `docs/audits/goals.md#a-001-shopify-commerce-readiness`. | Complete |
| Write result to `docs/audits/results/A-001-shopify-commerce.md`. | This file is updated from `Status: Not started` to `Status: Completed`. | Complete |
| Inspect shop routes. | Scope inspected lists `/shop`, `/shop/products`, `/shop/products/[productHandle]`, and public shop APIs; findings include product detail route and checkout blockers. | Complete |
| Inspect Shopify API client and GraphQL product data. | Scope inspected lists `shopifyClient.ts` and `queries.ts`; findings cover transformation gaps, ID handling, metadata, variants, and response behavior. | Complete |
| Inspect product type definitions and link model. | Scope inspected lists `shopTypes.ts`, `shopify.ts`, `shopifyTypes.ts`, and `artworkModel.ts`; findings cover numeric ID validation and explicit type metadata. | Complete |
| Inspect product cards, filters, sorting, and listing UI. | Scope inspected lists `ProductCard.tsx`, `ShopFilters.tsx`, `ShopResultsBar.tsx`, and `ShopProductGallery.tsx`; findings cover unsupported filters, fake pagination, sorting, direct import preservation, and logging. | Complete |
| Inspect historical shop notes. | Scope inspected lists all root `SHOP_*.md` files indexed by `docs/archive/README.md`; findings compare historical GID examples and filter notes against canonical docs/current code. | Complete |
| Identify production blockers. | High findings cover product-detail artwork linking, checkout placeholder, admin workflow, and credential handling. | Complete |
| Identify data-model mismatches. | Medium findings cover numeric product ID enforcement, Shopify metadata/variant transformation, and API envelope consistency. | Complete |
| Identify missing tests and recommend targeted tests. | Test surface inspected lists `__tests__`; targeted tests are documented above. | Complete |
| Identify unclear checkout/admin/source-of-truth decisions. | `Decisions To Escalate` lists checkout scope, product listing source-of-truth confirmation, and admin product-linking workflow. | Complete |
| Do not refactor runtime code. | Only this audit result file was edited; runtime files were inspected only. | Complete |
| Keep edits scoped to assigned result file and do not update risks/findings register/workstream. | `Findings Register Updates`, `Risks Updated`, and `Workstream Updates` explicitly record no external doc updates due scope. | Complete |
| Use non-mutating inspection and record commands run. | `Commands Run` lists non-mutating `sed`, `rg`, `find`, `nl`, and `git status` inspection; no runtime verification command was run because no runtime code changed. | Complete |

## Next Action

Use the completed T-059 evidence to confirm shared book-link policy and then
assign admin Shopify product-link validation. Do not plan a product-ID cleanup
or migration from this audit unless the owner rejects the reported shared book
link pattern.
