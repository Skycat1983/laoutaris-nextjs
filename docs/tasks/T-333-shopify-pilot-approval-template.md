# T-333 Shopify Pilot Approval Template

Status: Completed

Workstream: [Shopify Commerce](../workstreams/shopify-commerce.md)

## Goal

Create a source-only owner approval template for the guarded Shopify catalog
pilot without mutating Shopify, MongoDB, or Cloudinary.

## Context

- [T-330](T-330-shopify-catalog-pilot-creation-plan.md) requires exactly five
  owner-approved artworks before the Phase 3 pilot command can create draft
  Shopify products.
- `reports/shopify-catalog-reconciliation-report.json` is the current read-only
  reconciliation evidence. It scanned 430 planned products and reported 416
  `no_match` products, 10 manual product matches to preserve, 4 manual-review
  conflicts, and 0 query errors.
- The selected pilot candidates must exclude manual matches, conflict rows, and
  any selected original or print row that is not `no_match` /
  `safe_to_create_later`.

## Scope

- Select five clean `no_match` artworks from the reconciliation report.
- Generate a local example owner approval JSON template with placeholder
  original prices, print prices, and `inventoryLocationId`.
- Document how the owner fills the approval file before any live pilot run.
- Keep the task source-only: no Shopify writes, no MongoDB writes, no
  Cloudinary writes, no browser automation, and no runtime code changes.

## Selected Pilot Candidates

The template uses the first five reconciliation artworks whose original and
print products are both `matchStatus: "no_match"` and
`recommendedAction: "safe_to_create_later"`, with zero
`manualNumberMatches` and zero product conflicts:

| Artwork ID | Title | Original handle | Print handle |
| --- | --- | --- | --- |
| `661fc617648efb163cffacee` | `No.002` | `joseph-laoutaris-original-no002-3cffacee` | `joseph-laoutaris-print-no002-3cffacee` |
| `661fc784648efb163cffacf6` | `No.075` | `joseph-laoutaris-original-no075-3cffacf6` | `joseph-laoutaris-print-no075-3cffacf6` |
| `661fc7b7648efb163cffacff` | `No.008` | `joseph-laoutaris-original-no008-3cffacff` | `joseph-laoutaris-print-no008-3cffacff` |
| `661fcae840f59e26cc761dd5` | `No.033` | `joseph-laoutaris-original-no033-cc761dd5` | `joseph-laoutaris-print-no033-cc761dd5` |
| `661fccea40f59e26cc761e0f` | `No.041` | `joseph-laoutaris-original-no041-cc761e0f` | `joseph-laoutaris-print-no041-cc761e0f` |

These selections intentionally exclude all manual/conflict rows, including the
known `no-214-original-artwork` conflict family.

## Files Touched

- `reports/shopify-catalog-pilot-owner-approval.example.json`
- `docs/runbooks/shopify-operations.md`
- `docs/tasks/README.md`
- `docs/workstreams/shopify-commerce.md`

## Acceptance Criteria

- The local example approval JSON contains exactly five artworks.
- Every selected artwork has placeholder original and print prices.
- The template contains an `inventoryLocationId` placeholder.
- Runbook instructions tell the owner how to replace placeholders and preserve
  the source-only boundary before a live pilot run.
- No Shopify, MongoDB, or Cloudinary mutation occurs.

## Verification

```bash
jq empty reports/shopify-catalog-pilot-owner-approval.example.json
jq '[.artworks[] | select((.conflicts|length)==0 and (.matchesByManualArtworkNumber|length)==0 and ([.products[] | select(.matchStatus=="no_match" and .recommendedAction=="safe_to_create_later" and (.manualNumberMatches|length)==0 and (.conflicts|length)==0)] | length)==2) | .artworkId][0:5]' reports/shopify-catalog-reconciliation-report.json
git diff --check
```

## Handoff Notes

- Completed on 2026-05-28 as a source-only pilot approval-template task.
- Generated
  `reports/shopify-catalog-pilot-owner-approval.example.json` with placeholder
  prices and an `inventoryLocationId` placeholder for the five clean selected
  artworks above.
- Updated the Shopify operations runbook with the owner fill-in workflow.
- Did not run the live pilot command and did not mutate Shopify, MongoDB, or
  Cloudinary.
