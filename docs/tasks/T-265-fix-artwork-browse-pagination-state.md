# T-265 Fix Artwork Browse Pagination State

Status: Completed

Workstreams:

- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
- [Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Fix deep-linked `/artwork` browse pages so the client gallery initializes
pagination state from the server-rendered list metadata.

## Context

- A-028 found `/artwork?page=3` can server-render page 3, then the client
  gallery starts its internal page counter at `1` and can request page 2 on the
  next load-more interaction.
- `ArtworkListLoader` currently passes only artwork data into `ArtworkGallery`.
- `ArtworkGallery` initializes `page` to `1` and `hasMore` to `true` regardless
  of route query or server list metadata.

## Scope

In scope:

- Thread list pagination metadata from the artwork list loader into
  `ArtworkGallery`.
- Initialize the gallery's current page and `hasMore` state from server metadata.
- Preserve current filter, sort, URL, and cached unfiltered browse behavior.
- Add focused coverage for non-page-1 initial render and terminal-page behavior.

Out of scope:

- Changing artwork API response contracts beyond metadata already available to
  the loader.
- Changing public search, shop listing, collection detail, or cache policy.
- Broad visual redesign of the gallery.

## Concurrency

This task can run in parallel with T-263, T-264, and T-266. Do not run it in
parallel with another task editing `ArtworkListLoader`, `ArtworkGallery`, or
their focused tests.

## Files Likely Touched

- `src/components/loaders/viewLoaders/ArtworkListLoader.tsx`
- `src/components/artwork/ArtworkGallery.tsx`
- Focused artwork loader/gallery tests under `__tests__/unit/`
- `docs/tasks/T-265-fix-artwork-browse-pagination-state.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation and focused
  tests are complete.
- Update this task brief and `docs/tasks/README.md`.
- List candidate findings/risk/workstream updates in handoff notes unless
  explicitly assigned to reconcile shared trackers.

## Acceptance Criteria

- A direct `/artwork?page=3` render loads the next page as page 4, not page 2.
- A direct terminal-page render does not keep observing/loading as if more pages
  exist.
- Page 1 and filtered browse behavior remain unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkListLoader.test.tsx <focused ArtworkGallery test file>
git diff --check
```

If the gallery test file does not exist, add or identify the focused component
test file and record the exact command used.

## Handoff Notes

- Planned from A-028 high-priority public archive browse finding.
- Completed 2026-05-25: `ArtworkListLoader` now passes server list pagination
  metadata into `ArtworkGallery`. The gallery initializes `page`/`hasMore` from
  that metadata, deep-linked page 3 browse loads page 4 next, and terminal pages
  do not request additional pages.
- Added focused coverage in
  `__tests__/unit/components/ArtworkGalleryPaginationState.test.tsx` and
  extended `__tests__/unit/loaders/ArtworkListLoader.test.tsx` for the metadata
  prop handoff.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/ArtworkListLoader.test.tsx __tests__/unit/components/ArtworkGalleryPaginationState.test.tsx`,
  `git diff --check`, and `npm run lint`.
- Candidate shared-tracker updates: frontend/testing workstream progress should
  record T-265 completion. No new production risk or audit finding was created.
