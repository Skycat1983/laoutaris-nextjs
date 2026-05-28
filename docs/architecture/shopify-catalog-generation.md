# Shopify Catalog Generation

This document defines the phased plan for generating Shopify products from the
MongoDB artwork archive.

## Goal

Every MongoDB artwork can have two Shopify-backed commerce candidates:

- one original painting product, with inventory quantity `1`;
- one print product, with default edition quantity `50`.

The print quantity is a default, not a permanent rule. The generation pipeline
must support per-artwork or global overrides before live Shopify writes.

Products may exist in Shopify without being publicly listed. The initial import
should create products as draft or unpublished until the owner chooses which
products are actively for sale.

## Source Of Truth

MongoDB remains the archive source of truth for artwork identity, title,
archive image, dimensions, medium, surface, decade, and collection context.
Shopify remains the commerce source of truth for product status, price,
inventory, variants, availability, checkout URL, and fulfilment settings.

Generated Shopify products must link back to MongoDB with:

```text
custom.mongodb_artwork_id = <MongoDB artwork _id>
```

The current public app already reads this metafield for original and print
product detail pages.

## Product Families

### Original Painting

One original product should be generated for each artwork.

Default generated shape:

- Product type: `Original Artwork`
- Tags: `original`, `painting`, `archive-artwork`
- Inventory quantity: `1`
- Inventory policy: deny purchase when sold out unless the owner explicitly
  chooses otherwise.
- Metafield: `custom.mongodb_artwork_id`
- Initial status: draft or unpublished.

### Fine Art Print

One print product should be generated for each artwork.

Default generated shape:

- Product type: `Fine Art Print`
- Tags: `print`, `fine-art-print`, `archive-artwork`
- Variants: one explicit `Frame package = Unframed` variant for the pilot.
  Framed, material, and mat variants are deferred until owner-approved option
  labels, pricing, inventory/fulfilment handling, and app-to-Shopify mappings
  exist.
- Inventory quantity: `50`
- Inventory policy: deny purchase when sold out unless the owner explicitly
  chooses otherwise.
- Metafield: `custom.mongodb_artwork_id`
- Initial status: draft or unpublished.

Print edition quantity must be configurable because the owner may later choose
different edition sizes.

## Handle And Idempotency Policy

The generator must be idempotent. Running it twice should not create duplicate
products.

Before live writes, approve a stable handle policy. Recommended shape:

```text
joseph-laoutaris-original-<artwork-slug>-<short-artwork-id>
joseph-laoutaris-print-<artwork-slug>-<short-artwork-id>
```

The short artwork ID suffix prevents collisions between works with similar
titles. Earlier planning allowed preserving existing manually created
original/print products. The current owner direction is to replace those
hand-created original/print products with generated draft products where doing
so is safer and more repeatable. Cleanup must be scoped to Shopify
original/print products from reconciliation evidence only; MongoDB artworks,
book products, and Cloudinary assets must not be deleted.

The first implementation must generate a manifest that records:

- MongoDB artwork ID;
- generated original handle;
- generated print handle;
- existing Shopify product match, if any;
- proposed create/update action;
- product type, tags, inventory quantity, and status;
- archive image URL for Shopify product media;
- warnings for missing images, duplicate handles, missing required fields, or
  existing product conflicts.

## Image Policy

The first generator may use the artwork's existing public Cloudinary delivery
URL as the product image source. It must not mutate Cloudinary assets.

Before live bulk import, the plan should report artworks with missing or invalid
image URLs so the owner can decide whether to skip those products or create
them without images.

## Price And Listing Policy

The generator must not invent final prices.

Before live writes, the owner must choose one of:

- a global default original price and print price;
- price rules by size, medium, decade, or collection;
- a CSV/JSON override file with per-artwork prices;
- create products with placeholder prices but keep them draft/unpublished.

Recommended first live import: create draft/unpublished products with safe
placeholder or owner-approved prices, then publish selected products later.

## Shopify API Path

Two programmatic paths are acceptable:

- Generated Shopify CSV import for low-credential first import.
- Shopify Admin GraphQL API for long-term idempotent creation and updates.

The preferred long-term path is Admin GraphQL using `productSet` or bulk
operations:

- `productSet` can create or update products and can upsert by handle.
- Bulk operations can run mutations asynchronously from JSONL for larger
imports.

Official references:

- <https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet>
- <https://shopify.dev/docs/api/usage/bulk-operations/imports>
- <https://help.shopify.com/en/manual/products/import-export/import-products>

Any Admin API script requires an owner-created private Admin API token with
`write_products`. Do not record token values in repo docs, chat, commits, or
generated manifests.

## Phases

### Phase 0: Decisions And Guardrails

Record the owner decisions needed before live writes:

- default product status: draft/unpublished recommended;
- handle policy;
- price source;
- print edition default: `50`, with override support;
- print variant policy: one `Frame package = Unframed` variant for the pilot;
- original inventory: `1`;
- inventory location and fulfilment behavior;
- image source policy;
- whether to use CSV first or Admin GraphQL first;
- whether to immediately write selected `shopifyProducts` links back to MongoDB
  or keep MongoDB linking manual until a later task.

### Phase 1: Dry-Run Product Plan

Build a local script that reads MongoDB artwork records and writes a product
plan file without contacting Shopify or mutating data.

The dry run should answer:

- how many artworks are eligible;
- how many original products would be created;
- how many print products would be created;
- which records lack required data;
- which generated handles collide;
- which products need price/image/manual review.

Verification should be local and file-based. No Shopify token is required.

### Phase 2: Existing Shopify Reconciliation

Add a read-only Shopify Admin query step that checks existing products by
handle, `custom.mongodb_artwork_id`, and manual owner-created artwork-number
patterns.

This prevents duplicates and lets the owner preserve products that were already
created manually. Products returned by a metafield lookup are valid matches
only when their `custom.mongodb_artwork_id` exactly equals the MongoDB artwork
ID being reconciled; null or different metafield values must be ignored as
metafield matches. Manual preservation matching uses the normalized artwork
number from MongoDB titles such as `No.026` against Shopify product handles or
titles such as `joseph-laoutaris-fine-art-print-no-026` and
`joseph-laoutaris-original-artwork-no-043`, then assigns the product family from
handle, title, tags, or `productType`.

This phase requires read access to Shopify Admin API, but still performs no
writes.

### Phase 3: Pilot Creation

Create products for a small owner-approved sample, for example five artworks:

- five original products;
- five print products.

Products should be draft/unpublished unless the owner explicitly approves
publishing. Print products should use the one-variant pilot matrix:
`Frame package = Unframed`. Verify product handles, images, metafields,
variants, inventory, and Storefront reads before expanding.

### Phase 4: Bulk Draft Generation

Create or update the full product catalog as draft/unpublished products.

The bulk operation should be resumable and idempotent:

- do not create duplicates on rerun;
- report Shopify user errors per product;
- write an import result file with created/updated/skipped/error counts;
- do not publish products by default.

### Phase 5: Selected Listing And MongoDB Linking

Publish/list only selected products.

Decide whether to write generated product links into MongoDB:

- all generated products;
- only products selected for active listing;
- only manually approved products.

This decision affects `/shop/products` because the current listing path starts
from MongoDB artwork `shopifyProducts` links and then fans out to Shopify.
Linking every generated product before a listing policy exists could make the
public shop too broad or expensive.

### Phase 6: Operational Maintenance

After the first import, the generator should support:

- adding products for new artworks;
- updating draft products when archive metadata changes;
- changing print edition quantity defaults;
- applying per-artwork overrides;
- reporting products that no longer match MongoDB;
- avoiding destructive Shopify changes unless separately approved.

## Required Safety Rules

- Default to dry-run mode.
- Never print or persist Shopify Admin API tokens.
- Never delete Shopify products in the generator.
- Never publish products by default.
- Never overwrite existing manual products unless the manifest shows the exact
  field changes and the owner approves.
- Keep original inventory at `1` unless an owner override exists.
- Keep print inventory at configurable default `50` unless an owner override
  exists.
- Keep pilot print products to one `Frame package = Unframed` variant unless a
  later owner-approved frame/material/mat matrix exists.
- Keep app-owned checkout/cart work separate from product generation.

## First Implementation Task

The first source task should build only the Phase 1 dry-run product plan. It
should not call Shopify and should not mutate MongoDB, Shopify, or Cloudinary.
