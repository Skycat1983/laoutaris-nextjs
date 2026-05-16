# T-060 Remove Unsupported Shop Controls

Status: Completed

Workstreams:
[Shopify commerce](../workstreams/shopify-commerce.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the first focused F-013 shop UI slice by removing public shop controls
that are visible but not backed by API behavior: colour and dimension filters,
plus placeholder pagination.

## Context

- F-013 tracks shop filters, pagination, and sorting UI that expose behavior not
  backed by canonical API data.
- T-036 validated the backed public shop listing query params:
  `decade`, `artstyle`, `medium`, `surface`, `showOriginals`, `showPrints`,
  `showBooks`, and optional `sortBy`.
- `ShopFilters` still renders colour and dimension selects, but
  `ShopProductGallery` never sends `colour` or `dimension` to
  `/api/v2/public/shop/products`, and the API route does not accept those
  fields.
- `ShopResultsBar` renders hard-coded pagination controls (`1`, `2`, `...`,
  `5`, arrow) with no handlers or API-backed pagination metadata.
- Title-keyword product type sorting remains a separate F-013/F-014 follow-up.

## Scope

In scope:

- Remove the unsupported colour and dimension selects from `ShopFilters`.
- Remove stale `colour` and `dimension` state/defaults from shop filter state
  where they are only supporting the removed controls.
- Remove placeholder pagination controls from `ShopResultsBar`.
- Preserve backed filters and controls:
  - art style,
  - medium,
  - surface,
  - decade,
  - originals/prints/books checkboxes,
  - sort dropdown,
  - result count.
- Add focused component tests proving unsupported controls are not rendered and
  backed controls remain available.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not implement shop pagination.
- Do not implement colour or dimension filtering.
- Do not change the public shop API route or query schema unless type cleanup
  requires removing stale client-only fields.
- Do not change title-keyword product type sorting.
- Do not change Shopify product transforms, checkout/cart, admin linking,
  product-link data audits, or MongoDB data.
- Do not perform global logging cleanup.

## Files Likely Touched

- `src/components/modules/filters/ShopFilters.tsx`
- `src/components/modules/filters/ShopResultsBar.tsx`
- `src/components/compositions/ShopProductGallery.tsx`
- `src/lib/data/types/shopTypes.ts`
- Focused component tests under `__tests__/unit/`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- Public shop no longer renders colour or dimension filters.
- Public shop no longer renders fake pagination controls.
- Backed shop filters, product type checkboxes, result count, and sort dropdown
  still render.
- Clearing filters no longer resets unsupported colour/dimension state.
- No public shop API behavior changes.
- F-013 remains open for title-keyword type sorting and any future real
  pagination/sorting contract work.

## Verification

Run:

```bash
npm test -- --runTestsByPath <focused shop filter/results component test>
npm run lint
npm run build
```

If no focused component test exists yet, add one and record the exact path in
the handoff notes.

## Handoff Notes

- Completed 2026-05-16.
- Removed unsupported public shop colour and dimension selects from
  `ShopFilters`.
- Removed `colour` and `dimension` from `ShopFiltersState` and from
  `ShopProductGallery` default/reset filter state.
- Removed hard-coded placeholder pagination controls from `ShopResultsBar`.
- Added focused component coverage in
  `__tests__/unit/shopUnsupportedControls.test.tsx` proving unsupported
  controls are absent while backed filters, product-type controls, result count,
  and sorting remain visible.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/shopUnsupportedControls.test.tsx`,
  `npm run lint`, and `npm run build`.
- Build retained existing MongoDB, fetcher, branch-verification, and static
  generation log noise already documented in the testing workstream.
- F-013 remains open for title-keyword product type sorting and any future real
  pagination/sorting contract work.

## Escalate

Escalate to the orchestrator if:

- The owner wants colour/dimension filtering implemented instead of removed.
- Pagination must be implemented now rather than removed until backed metadata
  exists.
- Changing filter state would require public API, Shopify, or MongoDB behavior
  outside this task's scope.
