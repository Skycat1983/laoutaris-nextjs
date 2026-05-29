# T-347 Framed Print Commerce Roadmap

Status: Ready

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Related docs:

- [Framed print preview architecture](../architecture/framed-print-preview.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)
- [Shopify catalog generation](../architecture/shopify-catalog-generation.md)
- [Frame option commerce model](T-332-frame-option-commerce-model.md)
- [Framed print preview implementation plan](framed-print-preview-implementation-plan.md)

## Goal

Turn the current preview-only frame and mat controls into real Shopify-backed
print purchase options without waiting months for physical artwork dimensions.
The first commerce model should preserve aspect ratio from existing image pixel
metrics, price frame and mat choices conservatively, and later swap in physical
print dimensions when they become available.

## Current Position

- Generated print products currently have one Shopify variant:
  `Frame package = Unframed`.
- Product detail pages can show frame and mat controls, but those controls are
  preview-only. They do not select variants, alter price, persist choice, or
  change the Shopify purchase handoff.
- MongoDB artwork image fields already provide useful ratio/source metrics:
  `image.pixelWidth`, `image.pixelHeight`, `image.secure_url`,
  `image.public_id`, and `image.format`.
- Physical artwork/print dimensions are not expected for months.
- T-332 selected variants inside the print product as the first production
  commerce model. Standalone frame products remain deferred.

## Core Decision

Use Shopify variants on each print product. Do not create separate frame
products for the first production model.

Initial variant dimensions:

- `Frame package`
- `Mat`

Do not add `Print size` as a Shopify option until real print sizes exist.

Recommended initial option values:

| Option | Values |
| --- | --- |
| `Frame package` | `Unframed`, `Black wood`, `Oak`, optionally `White wood` |
| `Mat` | `No mat`, `White mat` |

`Unframed / White mat` should not be generated unless the owner explicitly
decides that a loose matted print is a sellable product. The likely first
matrix is:

| Frame package | Mat | Sellable? |
| --- | --- | --- |
| `Unframed` | `No mat` | Yes |
| `Black wood` | `No mat` | Yes |
| `Black wood` | `White mat` | Yes |
| `Oak` | `No mat` | Yes |
| `Oak` | `White mat` | Yes |
| `White wood` | `No mat` | Optional |
| `White wood` | `White mat` | Optional |

## Temporary Measurement Model

Until physical dimensions exist, use the source image dimensions as a temporary
measurement box. This is not a customer-facing physical size claim; it is a
ratio-preserving fallback so formula-based frame and mat pricing can be audited
before real print dimensions arrive.

The resolver should return a normalized measurement:

```ts
type FrameCommerceMeasurement = {
  width: number;
  height: number;
  unit: "px" | "cm";
  source: "pixel_ratio_fallback" | "physical_print_dimensions";
};
```

Current fallback:

- `width = image.pixelWidth`
- `height = image.pixelHeight`
- `unit = "px"`
- `source = "pixel_ratio_fallback"`

Future replacement:

- `width = physicalPrintWidthCm`
- `height = physicalPrintHeightCm`
- `unit = "cm"`
- `source = "physical_print_dimensions"`

Only the measurement resolver should need to change when real print sizes
arrive. Pricing and variant-planning code should consume `width`, `height`, and
`unit` without caring whether the current source is pixels or centimeters.

Important customer-facing rule:

- Do not show `A3`, `A2`, centimeters, inches, or any physical-size label until
  real print dimensions exist.
- Use option labels that describe the product package only, such as
  `Black wood` or `Oak with white mat`.

## Pricing Model

Frame and mat choices must increase price because mat changes the required
outer frame length and material handling.

Use a deterministic formula for the first implementation:

```text
variant price =
  base print price
  + frame price from outer perimeter
  + mat price from mat area
  + optional handling/rounding
```

Formula:

```text
shortSide = min(printWidth, printHeight)
matMargin = shortSide * mat.marginRatio
outerWidth = printWidth + (matMargin * 2)
outerHeight = printHeight + (matMargin * 2)
framePerimeter = (outerWidth * 2) + (outerHeight * 2)
matArea = (outerWidth * outerHeight) - (printWidth * printHeight)

framePrice = frame.basePrice + (framePerimeter * frame.ratePerUnit)
matPrice = mat.basePrice + (matArea * mat.ratePerSquareUnit)
```

The owner must approve the actual values before any Shopify write.

Pricing report should include:

- artwork ID and title;
- source measurement width/height/unit/source;
- source pixel width/height for auditability while the fallback is active;
- each proposed variant;
- mat margin;
- outer width and height;
- frame perimeter;
- mat area;
- base print price;
- frame price;
- mat price;
- final price;
- warnings for missing/invalid image dimensions.

## Data Contract

Add a pure pricing resolver before touching Shopify:

```ts
type FrameCommerceMetrics = {
  pixelWidth: number;
  pixelHeight: number;
  physicalPrintWidthCm?: number;
  physicalPrintHeightCm?: number;
};

type FrameVariantPricingInput = {
  metrics: FrameCommerceMetrics;
  framePackage: "Unframed" | "Black wood" | "Oak" | "White wood";
  mat: "No mat" | "White mat";
  basePrintPrice: string;
};
```

Resolver behavior:

1. If complete physical print dimensions exist, price from physical dimensions.
2. Otherwise price from pixel-derived metrics.
3. Return the source used: `physical_print_dimensions` or
   `pixel_ratio_fallback`.

This lets the later physical-dimension migration replace inputs without
rewriting Shopify option mapping, variant selection UI, or tests.

## Shopify Variant Metafields

When variants are generated, store enough metadata to audit why a price exists.

Candidate variant metafields, `custom` namespace:

| Metafield | Applies to | Value |
| --- | --- | --- |
| `pricing_source` | all generated print variants | `pixel_ratio_fallback` or `physical_print_dimensions` |
| `pricing_unit` | all generated print variants | `px` or `cm` |
| `source_pixel_width` | all generated print variants | image pixel width |
| `source_pixel_height` | all generated print variants | image pixel height |
| `source_aspect_ratio` | all generated print variants | normalized ratio |
| `pricing_measurement_width` | all generated print variants | width used by formula |
| `pricing_measurement_height` | all generated print variants | height used by formula |
| `pricing_outer_width` | framed/matted print variants | calculated outer width |
| `pricing_outer_height` | framed/matted print variants | calculated outer height |
| `frame_perimeter` | framed variants | calculated outer perimeter |
| `mat_area` | matted variants | calculated mat area |
| `frame_profile_id` | framed variants | app frame profile ID |
| `mat_profile_id` | matted variants | app mat profile ID |
| `physical_print_width_cm` | future | physical print width |
| `physical_print_height_cm` | future | physical print height |

If Shopify variant metafields are awkward for bulk creation, store equivalent
metadata at product level as JSON only after confirming Storefront/Admin access
needs. Variant-level metadata is preferred because price/availability is owned
by each variant.

## Implementation Roadmap

### Phase 1: Read-Only Size And Price Audit

Outcome: owner can review the derived sizing/pricing model before any product
mutation.

Status: Completed by T-349 for formula-based pricing. T-348 remains historical
threshold-class evidence only and should not be used for price approval.

Tasks:

- Add pure helpers for measurement resolution, mat-expanded geometry, perimeter,
  area, and price calculation.
- Add a read-only CLI report for current generated print products.
- Use existing MongoDB image metrics and generated Shopify reconciliation data.
- Report missing/invalid dimensions and duplicate/ambiguous products.

Acceptance:

- Report covers all generated print products.
- No Shopify, MongoDB, or Cloudinary writes.
- Focused tests cover portrait, landscape, square, wide, tall, compact,
  standard, and large examples.
- The current report path is
  `reports/framed-print-commerce-formula-audit.json`; it uses pixel fallback
  measurements now and can consume centimeter measurements through the same
  resolver later.

### Phase 2: Owner Pricing Approval File

Outcome: live variant creation is impossible without an explicit local approval
input.

Tasks:

- Create an approval template with allowed frame packages, mat options, size
  class thresholds, upcharges, base print price, and expected product counts.
- Add validation that rejects unapproved labels, placeholder prices, missing
  thresholds, or surprising product counts.

Acceptance:

- Approval file is human-readable.
- Write commands refuse to run without exact confirmation and approval values.

### Phase 3: Shopify Variant Plan

Outcome: a local report shows the exact variants that would be added or updated
per print product.

Tasks:

- Compare current Shopify print variants to the approved matrix.
- Preserve existing `Unframed / No mat` behavior.
- Plan only missing approved variants.
- Refuse conflicting option labels or unexpected existing variants until
  manually reviewed.

Acceptance:

- Report distinguishes create, preserve, update-price, and manual-review rows.
- No Shopify writes in plan mode.
- Product with unexpected frame/mat labels blocks write mode.

### Phase 4: Guarded Shopify Variant Write

Outcome: selected/approved print products gain real framed and matted variants.

Tasks:

- Add a write command gated by exact owner confirmation.
- Update Shopify product options and variants for approved print products.
- Set per-variant price, inventory policy, SKU/option labels, and metafields.
- Do not publish/unpublish products or change MongoDB public listing in this
  command.

Acceptance:

- Write report records every created/updated variant and Shopify response.
- Command stops on first Shopify user error unless explicitly designed for
  isolated per-product failures.
- No originals, books, Cloudinary assets, orders, customers, domains, aliases,
  or Vercel state are touched.

### Phase 5: Product Page Variant Selection

Outcome: frame/mat controls select real Shopify variants and update visible
price.

Tasks:

- Extend `SimpleProduct.variants` mapping if selected options are not already
  sufficient.
- Map local frame profile IDs and mat profile IDs to Shopify option values.
- Replace preview-only controls with variant-aware controls only for products
  whose variant matrix is complete and recognized.
- Update displayed price from selected variant.
- Keep raw artwork and room previews synchronized with selected frame/mat.

Acceptance:

- If variant mapping is incomplete, controls fall back to preview-only or hide
  purchasable claims.
- Selected framed/matted variant changes price in the UI.
- Unavailable variants are disabled.
- Product detail still handles book, original, generic, unavailable, and
  unlinked products safely.

### Phase 6: Purchase Handoff

Outcome: customer can buy the selected framed/matted variant without app-owned
cart logic.

Preferred first path:

- Keep Shopify-hosted product page handoff.
- Let Shopify's product page own final option selection if direct
  variant-specific hosted URLs are unreliable.

Possible later path:

- If direct selected-variant checkout is needed, scope a separate cart/checkout
  ownership task. Do not smuggle app-owned checkout into frame work.

Acceptance:

- No app-owned cart is introduced without a separate decision.
- Product page copy remains accurate about Shopify-hosted checkout.
- Selected variant state is not claimed to be purchased unless the handoff
  actually preserves it.

### Phase 7: Physical Dimension Migration

Outcome: pricing and preview geometry use real dimensions when present.

Tasks:

- Add physical print dimension fields or product/variant metafields.
- Update the resolver to prefer physical dimensions.
- Keep pixel-derived fallback for records not yet enriched.
- Run a diff report showing changed measurements, perimeter, area, and prices
  before any price mutation.

Acceptance:

- No existing frame/mat UI rewrite is needed.
- Reports show which products changed classification because physical
  dimensions arrived.
- Price changes remain owner-approved and write-gated.

## Recommended Task Sequence

1. Scope and implement read-only frame commerce sizing/pricing audit. T-348
   captured threshold-based evidence; T-349 replaces that next implementation
   direction with formula-based perimeter/area pricing.
2. Implement T-349 formula-based read-only pricing audit.
3. Owner reviews frame labels, mat policy, formula rates, rounding, and the
   sellable option matrix.
4. Add approval-file validation and variant plan mode.
5. Run variant plan for the current 25 sale-sample prints only.
6. If clean, run guarded Shopify variant write for the sale sample only.
7. Wire product-page controls to real variants for sale-sample prints.
8. Verify with selected portrait, landscape, square, wide, and tall examples.
9. Expand to more print products only after owner review.

## Open Owner Inputs

- First sellable frame packages.
- Whether `White wood` is included in the first paid matrix or held back.
- Whether `White mat` is the only mat option for now.
- Actual frame base/rate, mat base/rate, handling, and rounding values.
- Whether matted unframed prints are sellable or invalid.
- Whether framed variants should share print inventory or have separate manual
  inventory values.
- Whether framed/matted options should be available for all sale-sample prints
  or only a smaller test set first.

## Risks And Guardrails

- Do not expose physical-size labels until real dimensions exist.
- Do not create a huge variant matrix. Shopify supports limited product options
  and variant count, and broad matrices are hard to operate.
- Do not make separate frame products unless fulfilment/inventory needs prove
  variants are insufficient.
- Do not let local preview controls imply a purchasable selection unless they
  map to a real Shopify variant.
- Do not update prices silently. All price changes need owner-approved reports.
- Keep reports local under `reports/` unless the owner asks for committed
  evidence.

## Verification Defaults

For helper/planning tasks:

```bash
npm test -- --runTestsByPath <focused frame-commerce tests>
npm run lint
npm run typecheck
git diff --check
```

For live Shopify write tasks:

```bash
npm run <plan-command>
npm run <write-command> -- --confirm=<EXACT_CONFIRMATION>
npm run <post-write-reconciliation>
npm test -- --runTestsByPath <focused tests>
npm run lint
npm run typecheck
git diff --check
```

For product-page variant selection:

```bash
npm test -- --runTestsByPath <variant-selection component/page tests>
npm run lint
npm run typecheck
```

Add targeted browser checks only after the variant UI exists, and keep them to
representative selected products rather than broad trace capture.
