# T-348 Framed Print Commerce Size And Price Audit

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Related docs:

- [T-347 Framed print commerce roadmap](T-347-framed-print-commerce-roadmap.md)
- [Framed print preview architecture](../architecture/framed-print-preview.md)
- [Frame option commerce model](T-332-frame-option-commerce-model.md)
- [Shopify catalog generation](../architecture/shopify-catalog-generation.md)

## Goal

Create the first read-only framed-print commerce audit so frame/mat pricing can
be reviewed before any Shopify variant, price, publication, MongoDB, or
Cloudinary mutation.

## Scope

Implemented:

- Added `npm run audit:framed-print-commerce`.
- Added pure helpers for pixel-derived frame commerce classification.
- Added draft owner-review-only variant price rows for:
  - `Unframed / No mat`
  - `Black wood / No mat`
  - `Black wood / White mat`
  - `Oak / No mat`
  - `Oak / White mat`
- Reads the existing generated catalog plan from
  `reports/shopify-catalog-dry-run-plan.json`.
- Optionally reads `reports/shopify-sale-sample-selection.json` to mark the
  current selected sale-sample prints.
- Writes the local report
  `reports/framed-print-commerce-size-price-audit.json`.
- Added focused unit coverage for argument parsing, money parsing,
  classification, price rows, no-mutation report safety, sale-sample marking,
  and invalid image dimensions.

Out of scope:

- Shopify writes.
- Shopify variant creation or update.
- Shopify price mutation.
- MongoDB writes.
- Cloudinary writes.
- Product detail variant-selection UI.
- Checkout/cart behavior.
- Customer-facing physical size labels.

## Current Report

Command run:

```bash
npm run audit:framed-print-commerce
```

Result:

- Print products audited: 215.
- Valid image metrics: 215.
- Invalid image metrics: 0.
- Sale-sample prints marked: 25.
- Draft owner-review variant rows: 1,075.

Pricing class distribution from the current draft thresholds:

| Class | Count |
| --- | ---: |
| `compact` | 29 |
| `standard` | 161 |
| `large` | 0 |
| `wide` | 0 |
| `tall` | 9 |
| `square` | 16 |
| `invalid` | 0 |

Dimension distribution:

| Metric | Min | P25 | Median | P75 | Max | Average |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Long side px | 1600 | 3504 | 3504 | 3504 | 3504 | 3202.9023 |
| Short side px | 1095 | 2263 | 2566 | 2855 | 3497 | 2417.0698 |
| Aspect ratio | 0.3779 | 0.7137 | 0.7914 | 0.8804 | 1.5913 | 0.8492 |

## Important Interpretation

The current thresholds and upcharges are draft planning values only. They are
not owner-approved prices and must not be written to Shopify.

Because no current archive images exceed the draft wide threshold and none
reach the draft large threshold after shape overrides, the next step should be
owner review of the distribution before choosing final thresholds. The report
is useful evidence that most current works cluster around a 3504px long side.

Owner follow-up changed the next implementation direction after this report:
do not continue toward threshold-based price classes. Use T-348 as historical
evidence about image distribution only. T-349 replaces the pricing direction
with a formula based on measurement width/height, mat-expanded outer dimensions,
frame perimeter, and mat area. That formula should use pixels now and later
swap to centimeter measurements when real print sizes and framemaker rates are
available.

## Acceptance Criteria

- The command reads local reports only.
- The output states that Shopify, MongoDB, Cloudinary, prices, and variants are
  not mutated.
- All generated print products from the catalog plan are audited.
- Current sale-sample prints are marked when the selection report is present.
- Tests cover compact, standard, large, wide, tall, and square classifications.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/auditFramedPrintCommerceHelpers.test.js
npm run audit:framed-print-commerce
```

Both commands passed on 2026-05-29.

## Next Agent Action

Implement [T-349](T-349-formula-based-framed-print-pricing.md) as the next
read-only audit. Do not prepare threshold-class approval values and do not
start Shopify variant planning or writing yet.
