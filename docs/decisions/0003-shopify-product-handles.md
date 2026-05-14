# 0003 - Use Shopify Handles For Product Routes

Status: Accepted

Date: 2026-05-14

## Context

Commerce routes must support original artworks, prints, and books. MongoDB
artwork IDs only identify archive records and do not naturally represent prints
or books.

## Decision

Use Shopify product handles for commerce product detail routes:

```text
/shop/products/[productHandle]
```

## Consequences

- Shopify remains the product identity source for commerce URLs.
- MongoDB artwork pages can link to one or more Shopify products.
- Product pages can link back to MongoDB archive data through Shopify metafields.
- Product routes remain SEO-friendly and support non-artwork products such as
  books.
