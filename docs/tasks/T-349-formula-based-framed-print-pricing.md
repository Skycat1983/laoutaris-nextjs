# T-349 Formula-Based Framed Print Pricing Proposal

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Data Models And API](../workstreams/data-models-and-api.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

Related docs:

- [T-347 Framed print commerce roadmap](T-347-framed-print-commerce-roadmap.md)
- [T-348 Framed print commerce size and price audit](T-348-framed-print-commerce-size-price-audit.md)
- [Framed print preview architecture](../architecture/framed-print-preview.md)
- [Frame option commerce model](T-332-frame-option-commerce-model.md)

## Goal

Replace threshold-based framed-print pricing with a continuous formula that
uses pixel dimensions now and can later use real centimeter dimensions without
rewriting the pricing, variant planning, or product-page selection pipeline.

The next implementation should remain read-only. It should generate a local
owner-review report and should not mutate Shopify, MongoDB, Cloudinary, prices,
variants, publications, checkout/cart, orders, or customers.

## Core Recommendation

Use a normalized measurement box and keep the pricing formula unit-agnostic.

Pixels are acceptable as the temporary unit because they preserve artwork ratio
and relative material demand. The code should not treat pixels as a physical
claim. Later, when real print dimensions exist, the same resolver should return
centimeters and the same perimeter/area formulas should continue to work.

Planned measurement shape:

```ts
type FrameCommerceMeasurement = {
  width: number;
  height: number;
  unit: "px" | "cm";
  source: "pixel_ratio_fallback" | "physical_print_dimensions";
};
```

Resolver rule:

1. If complete physical print dimensions exist, return them as centimeters.
2. Otherwise return `image.pixelWidth` and `image.pixelHeight` as pixels.
3. If neither source is complete and positive, reject the row for pricing and
   report a warning.

Customer-facing rule:

- Do not show pixel dimensions as a size.
- Do not show centimeters, inches, `A2`, `A3`, or any physical size label until
  real print dimensions exist.
- Product option labels should describe the package only, for example
  `Black wood` and `White mat`.

## Formula Model

Every variant should be calculated from the same geometric steps.

Start with the print box:

```text
printWidth = measurement.width
printHeight = measurement.height
shortSide = min(printWidth, printHeight)
```

Calculate mat margin:

```text
matMargin = shortSide * mat.marginRatio
```

For `No mat`, `mat.marginRatio = 0`.

Calculate the outer framed/matted box:

```text
outerWidth = printWidth + (matMargin * 2)
outerHeight = printHeight + (matMargin * 2)
```

Calculate frame material length:

```text
framePerimeter = (outerWidth * 2) + (outerHeight * 2)
```

Calculate mat material area:

```text
printArea = printWidth * printHeight
outerArea = outerWidth * outerHeight
matArea = outerArea - printArea
```

Then price:

```text
framePrice =
  frame.basePrice
  + (framePerimeter * frame.ratePerUnit)

matPrice =
  mat.basePrice
  + (matArea * mat.ratePerSquareUnit)

variantPrice =
  basePrintPrice
  + framePrice
  + matPrice
  + optionalHandling
  + optionalRounding
```

For `Unframed`, frame price is `0`. `Unframed / White mat` should remain invalid
unless the owner decides loose matted prints are sellable.

## Suggested Initial Profiles

These are structural defaults for the implementation, not approved production
prices.

Frame packages:

| ID | Label | Pricing behavior |
| --- | --- | --- |
| `unframed` | `Unframed` | No frame perimeter charge |
| `black_wood` | `Black wood` | Base + perimeter rate |
| `oak` | `Oak` | Higher base + perimeter rate |
| `white_wood` | `White wood` | Optional, hold out unless owner approves |

Mat profiles:

| ID | Label | Margin ratio | Pricing behavior |
| --- | --- | ---: | --- |
| `none` | `No mat` | `0` | No mat area charge |
| `white_small` | `White mat` | `0.08` | Base + area rate |
| `white_wide` | `Wide white mat` | `0.14` | Optional later wider mat |

The first production matrix should stay small:

| Frame package | Mat | First matrix |
| --- | --- | --- |
| `Unframed` | `No mat` | Yes |
| `Black wood` | `No mat` | Yes |
| `Black wood` | `White mat` | Yes |
| `Oak` | `No mat` | Yes |
| `Oak` | `White mat` | Yes |
| `White wood` | `No mat` | Optional |
| `White wood` | `White mat` | Optional |
| `Unframed` | `White mat` | No, unless owner approves |

## Replacement Strategy For Real Sizes

The implementation should keep the formula independent from the source unit.
The only future substitution should happen in the measurement resolver.

Current fallback:

```ts
resolveMeasurement(artwork) => {
  width: artwork.image.pixelWidth,
  height: artwork.image.pixelHeight,
  unit: "px",
  source: "pixel_ratio_fallback"
}
```

Future physical source:

```ts
resolveMeasurement(printVariantOrProduct) => {
  width: physicalPrintWidthCm,
  height: physicalPrintHeightCm,
  unit: "cm",
  source: "physical_print_dimensions"
}
```

When the unit changes to `cm`, owner-approved rates must also change from
pixel-based placeholder rates to framemaker-supplied centimeter rates. The
formula shape remains the same:

- mat margin expands the outer box;
- frame perimeter prices frame material;
- mat area prices mat material;
- final price is composed from base print, frame, mat, handling, and rounding.

## Proposed Implementation Slice

Update the current framed-print audit rather than writing Shopify variants.

Recommended source changes:

- Add a pure pricing helper, likely under
  `scripts/framed-print-commerce-pricing-helpers.cjs` or by replacing the
  threshold-specific parts of
  `scripts/audit-framed-print-commerce-helpers.cjs`.
- Keep `npm run audit:framed-print-commerce`.
- Write a new report path so the threshold audit remains historical evidence:
  `reports/framed-print-commerce-formula-audit.json`.
- Keep the existing local input sources:
  - `reports/shopify-catalog-dry-run-plan.json`
  - `reports/shopify-sale-sample-selection.json`

Report each print with:

- artwork ID, title, artwork number, and proposed print handle;
- source measurement width, height, unit, and source;
- source pixel dimensions for auditability;
- selected sale-sample marker;
- each proposed variant;
- mat margin;
- outer width and height;
- frame perimeter;
- mat area;
- base print price;
- frame price;
- mat price;
- handling or rounding adjustment if present;
- final draft price;
- validity warnings.

Report summary should include:

- total prints audited;
- valid and invalid measurement rows;
- sale-sample prints marked;
- proposed variant rows;
- min/median/max frame perimeter;
- min/median/max mat area;
- min/median/max final draft price by frame/mat option.

## Draft Configuration Shape

The next implementation can use source-controlled draft values. They must be
clearly marked as owner-review placeholders.

Example shape:

```ts
type FramePricingProfile = {
  id: "unframed" | "black_wood" | "oak" | "white_wood";
  label: string;
  basePrice: string;
  ratePerUnit: string;
};

type MatPricingProfile = {
  id: "none" | "white_small" | "white_wide";
  label: string;
  marginRatio: number;
  basePrice: string;
  ratePerSquareUnit: string;
};

type FramePricingPolicy = {
  measurementPreference: "physical_print_dimensions_first";
  fallbackMeasurement: "image_pixels";
  basePrintPrice: string;
  currencyCode: "GBP";
  frames: FramePricingProfile[];
  mats: MatPricingProfile[];
  matrix: Array<{
    frameId: FramePricingProfile["id"];
    matId: MatPricingProfile["id"];
  }>;
  rounding: {
    mode: "none" | "nearest_5" | "nearest_10" | "psychological_ending";
  };
};
```

## Testing Requirements

Focused unit tests should cover:

- measurement resolver uses physical dimensions first when supplied;
- measurement resolver falls back to pixels when physical dimensions are
  missing;
- invalid zero/missing dimensions produce warnings and no variant prices;
- no-mat variants preserve the original print dimensions as the outer box;
- mat variants increase outer width and height by `matMargin * 2`;
- larger mat ratio increases frame perimeter and mat area;
- frame perimeter is calculated as `2 * (outerWidth + outerHeight)`;
- mat area is calculated as `outerArea - printArea`;
- unframed variants have zero frame price;
- invalid `Unframed / White mat` rows are rejected unless explicitly allowed;
- final price composes base print, frame, mat, handling, and rounding;
- report safety still declares no Shopify/MongoDB/Cloudinary mutation.

## Acceptance Criteria

- The audit is formula-based and does not use size-class thresholds for price.
- The formula works with `unit: "px"` and `unit: "cm"` measurements.
- The report makes clear that pixel-derived prices are placeholders for owner
  review only.
- Existing T-348 threshold evidence is not overwritten.
- No live Shopify, MongoDB, or Cloudinary calls are added.
- No Shopify variants or prices are created or changed.
- The next owner decision becomes concrete: approve frame/mat labels,
  formula rates, rounding, and whether `White wood` or wider mat profiles are
  in the first sellable matrix.

## Implementation Result

Completed on 2026-05-29.

- Replaced threshold-class helper logic in
  `scripts/audit-framed-print-commerce-helpers.cjs` with a unit-agnostic
  measurement resolver, mat-expanded geometry calculation, frame-perimeter
  pricing, mat-area pricing, optional handling, and rounding support.
- Kept `npm run audit:framed-print-commerce` read-only. The command reads only
  the local catalog plan and sale-sample selection report, then writes
  `reports/framed-print-commerce-formula-audit.json`.
- Preserved the T-348 threshold report at
  `reports/framed-print-commerce-size-price-audit.json` as historical evidence.
- Generated formula audit summary: 215 print products audited, 215 valid
  measurement rows, 0 invalid measurement rows, 25 sale-sample prints marked,
  and 1,075 draft owner-review variant rows.
- Added focused helper coverage for physical-dimension preference, pixel
  fallback, invalid measurements, mat geometry, perimeter/area formulas,
  unframed frame price, invalid `Unframed / White mat`, price composition,
  rounding, and no-mutation report safety.

## Verification

Commands run:

```bash
npm test -- --runTestsByPath __tests__/unit/scripts/auditFramedPrintCommerceHelpers.test.js
npm run audit:framed-print-commerce
npm run lint
npm run typecheck
git diff --check
```

## Next Agent Action

Owner review is next through
[framed-print-pricing-owner-approval-packet.md](../prototypes/framed-print-pricing-owner-approval-packet.md).
Approve or revise frame/mat labels, placeholder formula rates, rounding
behavior, invalid combinations, and whether `White wood` or wider mat profiles
belong in the first sellable matrix before any Shopify variant planning or live
write task.
