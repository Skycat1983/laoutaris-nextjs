# T-345 Prepare Shopify Sale Sample

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Expose a pre-launch sale sample with 10 original artworks and 25 prints, using
a mixed selection where some artworks have both products, some have originals
only, and some have prints only.

## Context

- Generated print links are app-listable, but generated Shopify products are
  still `DRAFT`.
- Generated original links remain hidden by default.
- Making products truly visible in public shop surfaces requires both an
  app-side public link and Shopify Storefront availability.

## Scope

In scope:

- Create a reproducible random sale-sample selection.
- Add guarded tooling to set selected MongoDB product links public.
- Add guarded tooling to activate and publish selected Shopify products.
- Keep the selection to exactly 10 originals and 25 prints with partial overlap.

Out of scope:

- Do not activate or publish the whole generated catalog.
- Do not change unselected generated products.
- Do not add framed/material/mat variants.
- Do not mutate Cloudinary, orders, customers, collections, domains, aliases,
  Vercel state, checkout/cart behavior, or product prices.

## Selection

Selection seed: `owner-sale-sample-2026-05-29`

- Overlap, both original and print: `No.001`, `No.121`, `No.085`, `No.158`,
  `No.051`, `No.189`, `No.071`
- Original only: `No.194`, `No.114`, `No.102`
- Print only: `No.120`, `No.098`, `No.164`, `No.059`, `No.015`, `No.197`,
  `No.138`, `No.028`, `No.109`, `No.054`, `No.035`, `No.057`, `No.147`,
  `No.185`, `No.157`, `No.041`, `No.037`, `No.045`

## Activation Outcome

The guarded live write was attempted with exact confirmation
`ACTIVATE_SHOPIFY_SALE_SAMPLE`, but the first attempt was blocked because
Shopify denied the read needed to resolve the Online Store publication before
any mutation ran:

```text
Access denied for publications field. Required access: `read_publications` access scope.
```

The report confirms 0 MongoDB updates, 0 Shopify status updates, and 0 Shopify
publication writes. The current Shopify Admin token needs publication scopes
before the selected products can be published to the storefront.

2026-05-29 follow-up: querying `currentAppInstallation.accessScopes` for the
current token still returned only `read_products` and `write_products`.
Refreshing a client-credentials token from the local `SHOPIFY_CLIENT_ID` and
`SHOPIFY_SECRET` returned scope `write_products`, so the active Shopify app
version/token grant still does not include publication scopes.

2026-05-29 final run: after the owner updated Shopify app scopes and refreshed
the app/token grant, `currentAppInstallation.accessScopes` returned
`read_products`, `write_products`, `read_publications`, and
`write_publications`. The confirmed write then completed:

- 35 selected Shopify products activated.
- 35 selected Shopify products published to `Online Store`.
- 17 selected MongoDB artwork link groups updated.
- 18 selected MongoDB link groups already had public print links.
- 0 MongoDB failures, 0 Shopify status failures, and 0 Shopify publication
  failures.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/prepareShopifySaleSampleHelpers.test.js __tests__/unit/scripts/applyShopifySaleSampleHelpers.test.js
npm run prepare:shopify-sale-sample -- --reconciliation=reports/shopify-catalog-post-draft-create-reconciliation-report.json --output=reports/shopify-sale-sample-selection.json --original-count=10 --print-count=25 --overlap-count=7 --seed=owner-sale-sample-2026-05-29
npm run apply:shopify-sale-sample -- --mode=plan --selection=reports/shopify-sale-sample-selection.json --output=reports/shopify-sale-sample-activation-plan.json
set -a; source .env; set +a; npm run apply:shopify-sale-sample -- --mode=write --selection=reports/shopify-sale-sample-selection.json --output=reports/shopify-sale-sample-activation-write-report.json --confirm=ACTIVATE_SHOPIFY_SALE_SAMPLE
set -a; source .env; set +a; npm run audit:shopify-products
```

## Next Agent Action

Run public shop/API checks to confirm the selected sale sample appears in the
app and unselected generated originals remain hidden.
