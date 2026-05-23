# T-236 Lazy-Load Public Mobile Navigation Drawers

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce initial public header JavaScript by deferring the mobile-only search and
navigation drawer implementations until user intent, without moving root
providers or changing navigation behavior.

## Context

- T-234 scoped the A-022 client-provider/client-island opportunity and found
  that moving `SessionProvider` or `GlobalFeaturesProvider` first is too
  cross-cutting.
- The safer first proof is the public mobile header: the root layout chunk
  currently contains `SearchDrawer`, `MobileNavDrawer`, modal symbols, and
  `SessionProvider`.
- No active source currently imports `next/dynamic`.
- The T-234 build baseline recorded:
  - Shared first-load JavaScript: `87.5 kB`.
  - Static shells such as `/biography`, `/collections`, `/project`,
    `/project/film`, and `/shop`: `87.7 kB`.
  - Public browse/form routes: `/artwork` `177 kB`, `/blog` `183 kB`,
    `/shop/products` `142 kB`, and `/project/contact` `149 kB`.
  - Root layout client chunk: 35,174 bytes uncompressed, with
    `SessionProvider`, `modalContent`, `openModal`, `AccountNav`,
    `SearchDrawer`, and `MobileNavDrawer` present.

## Scope

In scope:

- Split the mobile search drawer so the visible mobile search trigger remains
  in the initial header, while the drawer body/search form implementation is
  loaded only after the trigger is used.
- Split the mobile navigation drawer so the visible mobile navigation trigger
  remains in the initial header, while the drawer body/account-link/session
  implementation is loaded only after the trigger is used.
- Preserve existing mobile trigger labels, icons, drawer close controls, search
  submission to `/search?q=...`, and session-based account link availability.
- Keep desktop and tablet navigation unchanged.
- Keep `ClientContextBoundary`, `SessionProvider`, `GlobalFeaturesProvider`,
  saved-item actions, account routes, admin routes, and route cache policy in
  their current locations.
- Update focused source and behavior tests that guard public search/navigation
  accessibility, relative URLs, and initial client-island scope.
- Compare build output against the T-234 baseline and record whether the root
  layout chunk and first-load route sizes changed.

Out of scope:

- Do not move root providers.
- Do not split `GlobalFeaturesProvider` or remove language state in this task.
- Do not change auth/session semantics, account routes, saved-item behavior,
  modals outside the two mobile drawers, admin behavior, or cache policy.
- Do not refactor desktop/tablet navigation, route data loading, or public
  nav-link construction.
- Do not hide the mobile header controls before hydration.

## Concurrency

Run after T-234. Do not run in parallel with provider moves, root layout work,
or other tasks touching the same public navigation/search modules.

Owned files:

- `src/components/modules/navigation/mainNav/MobileNavLayout.tsx`
- `src/components/modules/search/SearchDrawer.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`
- new colocated mobile drawer trigger/body files under the same search and
  navigation module directories, if needed
- `__tests__/unit/publicSearchNavigationAccessibility.test.tsx`
- `__tests__/unit/navigationRelativeUrls.test.tsx`
- optional focused source-hygiene test for the lazy drawer split
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Implementation Notes

- Prefer a small client trigger/controller for each drawer that owns open state
  and imports the heavy drawer body only after intent.
- If using `next/dynamic`, avoid a shape that renders no labelled trigger before
  hydration. The trigger must remain a real button in the initial header path.
- Avoid importing `SearchDrawer` or `MobileNavDrawer` body modules directly from
  `MobileNavLayout` if that keeps the drawer bodies in the root layout chunk.
- Keep the drawer body components responsible for their existing content and
  behavior once loaded.
- Record any tradeoff if Next still preloads the dynamic chunks despite the
  split; the build evidence matters more than the intended structure.

## Acceptance Criteria

- Mobile search and navigation header controls remain labelled buttons.
- Opening mobile search still renders the search input, close control, and
  routes submitted queries to `/search?q=...`.
- Opening mobile navigation still renders the same public links and session-
  dependent account links.
- Desktop and tablet navigation output is unchanged.
- Root providers are not moved.
- The root layout chunk no longer directly contains both full drawer
  implementation symbols, or the handoff explains why Next retained them.
- Build output comparison against the T-234 baseline is recorded.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
npm run build
git diff --check
```

Use targeted source/build searches for `next/dynamic`, `SearchDrawer`,
`MobileNavDrawer`, `SessionProvider`, `useSession`, `.next/static/chunks/app/layout-*.js`,
and the relevant public route first-load rows.

## Handoff Notes

- Finding: F-115.
- Depends on: T-234.
- T-234 selected this as the first runtime proof before any root provider move.
- 2026-05-23: Completed. `SearchDrawer` and `MobileNavDrawer` now keep only
  labelled trigger/controller code in the public header path and lazy-load
  colocated body modules after first open intent. The body modules retain the
  existing search form, close controls, public nav links, and session-dependent
  account links. Root providers, route cache policy, desktop/tablet navigation,
  account/admin routes, and global feature/session provider ownership were not
  moved.
- Build comparison against T-234:
  - Shared first-load JavaScript: `87.6 kB` versus T-234 `87.5 kB`.
  - Stable static shells such as `/biography`, `/collections`, `/project`,
    `/project/film`, and `/shop`: `87.8 kB` versus T-234 `87.7 kB`.
  - Public browse/form routes stayed effectively flat against T-234:
    `/artwork` `177 kB`, `/blog` `183 kB`, `/shop/products` `142 kB`, and
    `/project/contact` `149 kB`.
  - Root layout client chunk:
    `.next/static/chunks/app/layout-400efb798bcf3f61.js` is `27,772` bytes
    uncompressed versus T-234 `35,174` bytes.
  - Next emitted separate lazy drawer chunks:
    `.next/static/chunks/1590.33b0cb6def221761.js` (`1,273` bytes) for the
    search drawer body and `.next/static/chunks/963.4d2fe44e20b0046b.js`
    (`7,433` bytes) for the mobile navigation drawer body.
  - The root layout chunk still contains dynamic-wrapper references to the
    lazy export names, but the full body content/close-control implementation
    is in the lazy chunks.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`
    passed with 3 suites and 10 tests. Existing `punycode` deprecation warnings
    appeared.
  - `npm run build` passed.
  - `git diff --check` passed.
