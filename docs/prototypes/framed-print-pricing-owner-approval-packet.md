# Framed Print Pricing Owner Approval Packet

Status: Approved for read-only variant planning

Source report:

- `reports/framed-print-commerce-formula-audit.json`
- Generated: `2026-05-29T15:30:57.605Z`
- Approval status in report: `draft_unapproved_owner_review_only`

Related docs:

- [T-349 Formula-Based Framed Print Pricing Proposal](../tasks/T-349-formula-based-framed-print-pricing.md)
- [Shopify Commerce Workstream](../workstreams/shopify-commerce.md)

This packet is for owner decisions only. It does not call Shopify, mutate
Shopify, mutate MongoDB, mutate Cloudinary, change prices, create variants,
publish products, alter checkout/cart, or touch orders or customers.

## Owner Approval

Approved by owner in chat on 2026-05-29 for the next read-only Shopify
variant-plan task only.

Approved first-pass decisions:

- Frame packages: `Unframed`, `Black wood`, and `Oak`.
- Held back: `White wood`.
- Mat profiles: `No mat` and `White mat`.
- Held back: `Wide white mat`.
- Invalid combination: `Unframed / White mat`.
- Rounding for planning: `none`.
- Formula rates: approved as placeholder planning rates only.
- Scope: read-only Shopify variant plan using the current 25 sale-sample
  prints.

Still blocked:

- Any Shopify variant creation or update.
- Any Shopify price write.
- Any Shopify publication/status change.
- Any MongoDB or Cloudinary mutation.
- Any app-owned checkout/cart behavior.
- Treating pixel-derived prices as launch-approved live prices.

## Review Goal

Decide whether the formula-based framed-print pricing setup is approved for the
next read-only Shopify variant-planning task, or whether the frame labels, mat
profiles, placeholder rates, rounding behavior, and invalid-combination rules
need revision first.

The current formula report uses image pixels as a temporary measurement source.
Pixel-derived prices are planning evidence only. Do not publish these prices or
variants until real dimensions and owner-approved framemaker rates exist, or
until the owner explicitly accepts a temporary placeholder-pricing phase.

## Formula Audit Snapshot

The formula audit exists and passed the required no-write boundary.

| Field | Result |
| --- | --- |
| Print products audited | 215 |
| Valid measurement rows | 215 |
| Invalid measurement rows | 0 |
| Sale-sample prints marked | 25 |
| Proposed owner-review variant rows | 1,075 |
| Currency | GBP |
| Measurement source now | Image pixels via `pixel_ratio_fallback` |
| Future measurement source | Physical print dimensions in centimeters |
| Base print price in report | `100.00` |
| Handling price in report | `0.00` |
| Rounding mode in report | `none` |

The audited option matrix contains five valid draft rows per print:

| Frame package | Mat | Draft price range |
| --- | --- | --- |
| Unframed | No mat | `100.00` |
| Black wood | No mat | `141.17` to `167.01` |
| Black wood | White mat | `156.78` to `198.41` |
| Oak | No mat | `155.48` to `188.21` |
| Oak | White mat | `171.65` to `221.40` |

## Decisions Needed

### 1. Frame Labels

Decision question: Are these frame labels approved for owner-facing Shopify
options?

Current report labels:

| ID | Label | Report behavior |
| --- | --- | --- |
| `unframed` | `Unframed` | No frame charge |
| `black_wood` | `Black wood` | Base plus perimeter rate |
| `oak` | `Oak` | Higher base plus higher perimeter rate |

Recommendation: Approve `Unframed`, `Black wood`, and `Oak` as the first
sellable labels only if they match the real fulfilment packages. Hold
`White wood` out of the first variant plan unless the owner confirms it is a
real sellable frame package.

Project impact: approved labels become the candidate Shopify option values in
the next read-only variant plan. Label changes after variants exist would
require migration or cleanup work.

### 2. Mat Profiles

Decision question: Are these mat labels and margin profiles approved?

Current report profiles:

| ID | Label | Margin ratio | Report behavior |
| --- | --- | ---: | --- |
| `none` | `No mat` | `0` | No mat charge |
| `white_small` | `White mat` | `0.08` | Base plus mat-area rate |

Recommendation: Approve `No mat` and `White mat` for the first matrix if
`White mat` represents the actual mat package. Keep `Wide white mat` out of the
first Shopify variant plan until the owner confirms the wider profile and its
pricing.

Project impact: mat profiles alter both outer frame size and price. Changing a
margin ratio later changes frame perimeter, mat area, and every framed/matted
variant price.

### 3. Placeholder Rates

Decision question: Should the current placeholder rates be approved, revised,
or replaced with framemaker-supplied rates before variant planning?

Current report rates:

| Component | Base | Rate |
| --- | ---: | ---: |
| Base print | `100.00` | n/a |
| Unframed | `0.00` | `0` per unit |
| Black wood | `25.00` | `0.0030` per unit |
| Oak | `35.00` | `0.0038` per unit |
| No mat | `0.00` | `0` per square unit |
| White mat | `12.00` | `0.000003` per square unit |
| Handling | `0.00` | n/a |

Recommendation: Treat these values as unapproved placeholders. Before Shopify
variant planning moves toward live prices, the owner should either approve
temporary placeholder prices for draft-only planning or provide real frame,
mat, handling, and base print rates.

Project impact: rates drive every draft price in the report. The next
variant-plan task can model Shopify options from placeholders, but live writes
must wait for owner-approved rates and a clear unit basis.

### 4. Rounding

Decision question: Should final prices remain exact formula outputs, or should
they round to a commercial price rule?

Current report behavior:

- `rounding.mode`: `none`
- `roundingAdjustment`: `0.00` for audited rows

Recommendation: Decide the rounding rule before creating a Shopify variant
plan. Good candidates are no rounding for audit transparency, nearest `5`, or
a psychological ending rule. Pick one rule and apply it consistently.

Project impact: rounding changes visible prices and must be stable before any
Shopify price write. Changing rounding after variants are created would require
price recalculation and another owner approval pass.

### 5. Invalid Combinations

Decision question: Which combinations should be intentionally excluded from the
first sellable matrix?

Current report behavior:

- `Unframed / White mat` is not included.
- Loose matted unframed prints are disabled with
  `allowLooseMattedUnframed: false`.
- `White wood` is not included.
- `Wide white mat` is not included.
- Invalid measurement rows: `0`.

Recommendation: Keep `Unframed / White mat` invalid unless the owner confirms
loose matted prints are sellable. Keep `White wood` and `Wide white mat` out of
the first matrix unless the owner approves the fulfilment package and rates.

Project impact: invalid-combination rules define which Shopify variants should
not exist. Approving too many combinations increases fulfilment, pricing, and
variant-management work.

### 6. First Shopify Variant-Plan Gate

Decision question: Is the project allowed to prepare the next read-only Shopify
variant plan from this formula report?

Recommended gate: proceed to a read-only variant-plan task only after the owner
answers these items:

- approve or revise frame labels;
- approve or revise mat labels and margin ratios;
- approve temporary draft rates or provide real rates;
- choose a rounding rule;
- confirm invalid combinations;
- confirm whether physical dimensions are required before any price write;
- confirm that the next task remains read-only and does not mutate Shopify.

Project impact: passing this gate should produce a local variant-plan report
only. It should map approved frame/mat decisions to Shopify option names and
candidate variants, but it should not create variants, write prices, publish
products, alter MongoDB links, or change checkout/cart behavior.

## Recommended Owner Approval Summary

For the first pass, approve the narrow matrix only:

- `Unframed / No mat`
- `Black wood / No mat`
- `Black wood / White mat`
- `Oak / No mat`
- `Oak / White mat`

Keep these blocked for now:

- `Unframed / White mat`
- `White wood`
- `Wide white mat`
- any physical-size customer labels
- any live Shopify variant or price writes

The next safe task is a read-only Shopify variant-plan report, gated on the
owner's answers above.
