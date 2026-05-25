# T-226 Build Alternate Artwork Detail Info Card

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create a new alternate artwork detail information card inspired by the
user-provided reference image, then substitute it into the shared `ArtworkView`
path without deleting or overwriting the existing `ArtworkInfoCard`
implementation.

## Context

- The reference image shows an artwork detail page with a restrained archive
  layout: collection/category eyebrow, large serif artwork title, two-column
  metadata rows, color swatches, outlined `Watchlist` and `Favourite` actions,
  an optional curatorial note area, and the artwork image displayed alongside
  the card.
- Current public detail routes render through `src/components/views/ArtworkView.tsx`.
  This includes standalone `/artwork/[artworkId]`, collection-scoped
  `/collections/[slug]/[artworkId]`, and saved artwork detail views that use
  the same loader/view path.
- The current info card lives at
  `src/components/modules/cards/ArtworkInfoCard.tsx` and must remain intact as
  a rollback/reference implementation.
- `src/components/modules/cards/ArtworkInfoCardVariations.tsx` contains older
  experimental cards. Do not extend that file unless there is a clear local
  reason; prefer a new named card file for this production-facing experiment.
- Artwork data currently includes fields such as title, decade, art style,
  medium, surface, dimensions, image colors, saved states, and Shopify product
  links. It does not currently expose a durable curatorial-note field.

## Read First

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/orchestration/state.md`
4. `docs/workstreams/frontend-routes-and-components.md`
5. `docs/architecture/rendering-and-data-fetching.md`
6. `src/components/views/ArtworkView.tsx`
7. `src/components/modules/cards/ArtworkInfoCard.tsx`
8. `src/components/modules/cards/ArtworkInfoCardVariations.tsx`
9. `src/components/elements/buttons/WatchlistButton.tsx`
10. `src/components/elements/buttons/FavouritesButton.tsx`
11. The attached user reference image for this task, if available in the
    assignment thread.

If the image is not available to the implementing agent, use the visual
description in this task as the source of truth and report that limitation in
the handoff.

## Scope

In scope:

- Add a new alternate card component, for example
  `src/components/modules/cards/ArtworkArchiveInfoCard.tsx`.
- Keep `src/components/modules/cards/ArtworkInfoCard.tsx` unchanged and
  exported; do not delete, rename, or rewrite it.
- Substitute the new card into `src/components/views/ArtworkView.tsx` in place
  of the old card so the shared artwork detail routes use the new presentation.
- Preserve the existing artwork image rendering, magnifier behavior, and
  `ArtworkShopSection` behavior unless a small layout adjustment is required
  to make the new card sit beside the image.
- Preserve watchlist/favourite server-action behavior and unauthenticated modal
  behavior by using the existing `WatchlistButton` and `FavouritesButton`
  components rather than reimplementing those actions.
- Use direct imports for button components instead of broad barrels where this
  new component adds imports.
- Match the reference image's key card aesthetics:
  generous whitespace, small uppercase eyebrow, large Cormorant-style title,
  thin dividers, label/value metadata rows, square color swatches, outlined
  action buttons, and a restrained archive/museum tone.
- Render metadata from real artwork fields only. Use sensible formatting for
  medium/surface and dimensions.
- Include a curatorial-note slot only if data exists or can be passed safely.
  Do not hard-code the example note from the reference image into production
  rendering.
- Keep the component responsive: on narrow screens the card and artwork image
  should stack cleanly without horizontal overflow; on desktop they should sit
  alongside each other in a composition close to the reference image.
- Add focused tests if existing coverage does not prove the old card remains
  present and the new card is now used by `ArtworkView`.

Out of scope:

- Do not delete the old `ArtworkInfoCard`, variation cards, skeletons, or old
  commented card references.
- Do not change artwork data models, admin artwork forms, transforms, API
  contracts, collection services, saved artwork services, Shopify product
  logic, or `ArtworkShopSection`.
- Do not add a fake curatorial-note field or hard-coded artwork copy.
- Do not change live navigation, breadcrumbs, collection tab controls, global
  CSS, Tailwind config, root layout, header, footer, or public search.
- Do not redesign artwork browse/list cards.
- Do not edit shared trackers while other agents may be working.

## Concurrency

This task owns:

- a new artwork detail card file under `src/components/modules/cards/`
- `src/components/views/ArtworkView.tsx`
- focused artwork view/card tests if needed
- this task brief handoff section

Avoid shared tracker and index edits during implementation:
`docs/orchestration/state.md`, `docs/tasks/README.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and
`docs/risks/production-readiness.md`.

If tracker updates are needed, list them in this task's handoff notes for the
orchestrator.

## Acceptance Criteria

- A new alternate artwork detail info card exists alongside the old
  `ArtworkInfoCard`; the old implementation is still available for rollback.
- `ArtworkView` renders the new card for shared artwork detail routes without
  changing loader contracts.
- Watchlist and favourite behavior still works for logged-in and logged-out
  users.
- Real artwork metadata, dimensions, and color palette render without
  fabricated content.
- Desktop layout resembles the reference direction: text/card information on
  one side and artwork image on the other, with clean spacing and restrained
  archive styling.
- Mobile layout stacks cleanly with no page-level horizontal overflow or text
  overlap.
- Existing artwork shop/product detail behavior is unchanged.

## Verification

Run the narrowest checks that prove this slice:

```bash
npm test -- --runTestsByPath __tests__/unit/pages/ArtworkPage.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/SavedArtworkLoaders.test.tsx
npm run lint
git diff --check
```

If focused tests are added for the new card, include them in the test command.

If browser automation is available and already set up, run one targeted visual
check for `/artwork/[artworkId]` or a collection-scoped artwork route using a
known local seed item. Capture only concise observations or a small screenshot;
do not collect traces, videos, full DOM dumps, or broad screenshot sets.

## Agent Prompt

You are working on T-226. Read `AGENTS.md`, `docs/README.md`, this task brief,
the frontend/testing workstreams, `docs/architecture/rendering-and-data-fetching.md`,
`src/components/views/ArtworkView.tsx`,
`src/components/modules/cards/ArtworkInfoCard.tsx`,
`src/components/modules/cards/ArtworkInfoCardVariations.tsx`,
`src/components/elements/buttons/WatchlistButton.tsx`, and
`src/components/elements/buttons/FavouritesButton.tsx`. Use the attached
reference image if available. Build a new alternate artwork detail info card
alongside the existing `ArtworkInfoCard`, then substitute the new card into
`ArtworkView` without deleting or overwriting the old implementation. Preserve
real artwork data, saved-item button behavior, magnifier/image behavior,
`ArtworkShopSection`, loader contracts, global styling, navigation, and shared
trackers. Do not hard-code the reference image's curatorial note. Run the
focused artwork tests, lint, `git diff --check`, and a targeted visual check if
browser automation is available, then update only this task handoff.

## One-Line Assignment

```text
/task effort: high details: docs/tasks/T-226-build-alternate-artwork-detail-info-card.md
```

## Handoff Notes

- Prepared on 2026-05-23 from the user-provided alternate artwork detail card
  reference image.
- Completed on 2026-05-23 by adding
  `src/components/modules/cards/ArtworkArchiveInfoCard.tsx` and substituting it
  into `src/components/views/ArtworkView.tsx`.
- The legacy `ArtworkInfoCard` remains unchanged and available for rollback.
- The new card uses real artwork title, decade, medium/surface, art style,
  image dimensions, and hex color fields. It only renders a curatorial note
  when a note is passed; no reference-image note text was hard-coded.
- `ArtworkShopSection` and the existing `MagnifierImage` path remain in place.
  Watchlist/favourite behavior is still delegated to the existing
  `WatchlistButton` and `FavouritesButton` components through direct imports.
- Added focused coverage in
  `__tests__/unit/components/ArtworkArchiveInfoCard.test.tsx` for metadata,
  palette links, saved-item button prop handoff, old-card availability, and
  `ArtworkView` usage of the new card.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/components/ArtworkArchiveInfoCard.test.tsx __tests__/unit/pages/ArtworkPage.test.tsx __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/loaders/SavedArtworkLoaders.test.tsx`;
  `npm run lint`; `git diff --check`.
- Targeted browser visual check was not run because repo-local browser
  automation is not installed: `playwright`, `@playwright/test`, and
  `puppeteer` all resolve as unavailable in this workspace.
- Candidate tracker updates for the orchestrator after completion: mark T-226
  complete in the frontend/testing workstreams and record that shared artwork
  detail routes now use a new rollback-safe alternate info card while the old
  `ArtworkInfoCard` remains available.
