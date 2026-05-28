# T-332 Frame Option Commerce Model

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Data Models And API](../workstreams/data-models-and-api.md)

## Goal

Define the Shopify-backed commerce model for framed print options before bulk
generated print products are created.

## Recommendation

Frame choices should be embedded in each Shopify print product as variants, not
created as separate standalone frame products for the first production model.

Pilot decision: generated draft print products should start with one explicit
`Unframed` variant only. Do not create framed, material, or mat variants in the
pilot catalog until the owner approves exact print sizes, frame package labels,
mat policy, upcharges, inventory/fulfilment handling, and public option copy.

Minimal pilot variant matrix:

| Shopify product family | Variant count | Option shape | Variant value | Price/inventory owner |
| --- | ---: | --- | --- | --- |
| Fine art print | 1 | `Frame package` | `Unframed` | The same owner-approved print price and print quantity already required by the catalog pilot approval record. |

This means each generated draft print product has exactly one purchasable print
configuration. The current frame and mat controls on product pages remain
preview-only and must not select this Shopify variant, change price, alter
availability, persist choices, or submit option data to enquiries.

Recommended print product option shape:

- Option 1: print size, once real print sizes are approved.
- Option 2: frame package, for example `Unframed`, `Black wood`, `White wood`,
  `Oak`, `Walnut`, `Metal`.
- Option 3: mat option, for example `No mat` or one approved neutral mat.

Each purchasable combination can then own its own Shopify variant price,
availability, SKU, inventory policy, and optional variant metafields. The app's
source-controlled frame profile IDs should map to stable Shopify option values
or variant metafields before frame selections are treated as purchasable.

Future approved matrix, when owner data exists:

| Option | Owner input required before generation |
| --- | --- |
| Print size | Approved size labels, physical dimensions, base price, SKU/inventory policy. |
| Frame package | Approved material/package labels and stable mapping from app frame profile IDs to Shopify option values or variant metafields. |
| Mat option | Approved mat/no-mat policy, neutral mat labels, upcharges, and fulfilment constraints. |

## Rationale

- A framed print is a configured version of the print, not a separate artwork.
- Separate standalone frame products would make it easy for a buyer to select
  mismatched frame/print sizes unless the app owns cart bundling or Shopify
  bundle behavior.
- The current app uses Shopify-hosted purchase handoff and does not own cart or
  checkout line-item construction, so separate add-on products would introduce
  more risk than variants.
- Shopify variants support per-combination price and inventory, which is the
  right place for frame upcharges and availability.

## Guardrails

- Keep the variant matrix intentionally small. Shopify products support up to
  three options, and large variant counts can create admin and channel
  compatibility issues.
- Do not generate all possible frame variants until print sizes, frame
  materials, frame prices, and mat policy are approved.
- Do not use placeholder framed option labels in Shopify. An option value should
  be created only when it can be sold and fulfilled as described.
- Keep the current frame preview controls preview-only until the selected
  options map to real Shopify variants.
- Do not add app-owned cart, checkout, or line-item properties as part of the
  catalog-generation track unless separately approved.
- Standalone frame products remain a later option only if frames are sold as
  independent goods or a bundle/fulfilment workflow requires them.

## Next Agent Action

Update any future T-330 implementation prompt or catalog-generation command to
create draft print products with one `Frame package = Unframed` variant only.
Keep framed/material/mat purchasability behind a later owner-approved option
mapping task.

Do not create or mutate Shopify products, MongoDB records, or Cloudinary assets
from this decision task.

## Verification

- `git diff --check`

No runtime test is required because this task changes docs only.

## Handoff Notes

- Completed on 2026-05-28 as a docs-only commerce-model decision.
- Selected the conservative pilot path: one explicit `Unframed` variant per
  generated draft print product.
- Deferred the small frame/material/mat matrix until owner-approved dimensions,
  labels, prices, inventory/fulfilment handling, and option mappings exist.
- No Shopify, MongoDB, Cloudinary, runtime source, or generated report state was
  changed.
