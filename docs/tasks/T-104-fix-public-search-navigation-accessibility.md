# T-104 Fix Public Search And Navigation Accessibility

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Convert the public search, drawer, mobile navigation, and unauthenticated
artwork intent controls from clickable icons/wrappers into semantic labelled
controls without changing navigation targets, search query behavior, auth
requirements, or saved-item server actions.

## Context

- A-010/F-088 found public search, drawer, mobile navigation, and
  unauthenticated artwork controls have keyboard and accessible-name gaps.
- `Searchbar` submits from a clickable `<div>` around the search icon.
- `SearchDrawer` uses a bare `<Search />` icon as `DrawerTrigger asChild`.
- `MobileNavDrawer` uses bare `<Menu />` and `<X />` icons for drawer open and
  close controls.
- `FavouritesButton` and `WatchlistButton` wrap unauthenticated actions in
  clickable `<div>` elements around submit-button UI, which creates ambiguous
  interaction semantics.
- T-103 handled baseline metadata/discovery only. This task should be a focused
  accessibility/control semantics slice.

## Scope

- In scope:
  - Replace the desktop search icon clickable `<div>` with a real submit
    `button` that has a stable accessible name.
  - Wrap mobile search drawer trigger and close icons in semantic buttons while
    preserving Radix `asChild` behavior.
  - Wrap mobile nav drawer trigger and close icons in semantic buttons while
    preserving drawer open/close behavior and current navigation links.
  - Replace unauthenticated favourite/watchlist clickable wrappers with real
    non-submit buttons that open the existing sign-in-required modal.
  - Add focused component/source tests for accessible names and absence of the
    retired clickable wrapper patterns.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Visual redesign of header, drawers, favourite/watchlist controls, or
    artwork detail pages.
  - Auth flow changes, sign-in modal content, or saved-item server actions.
  - Comment action accessibility, broader hero/card click targets, landmark/
    heading cleanup, or route-specific metadata.
  - Browser automation unless a focused interaction issue cannot be covered
    with unit/source tests.

## Files Likely Touched

- `src/components/elements/inputs/Searchbar.tsx`
- `src/components/modules/search/SearchDrawer.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`
- `src/components/elements/buttons/FavouritesButton.tsx`
- `src/components/elements/buttons/WatchlistButton.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-104-fix-public-search-navigation-accessibility.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Public search submit, mobile search drawer trigger/close, and mobile nav
  drawer trigger/close are keyboard-focusable controls with accessible names.
- Unauthenticated favourite/watchlist actions are keyboard-focusable buttons
  that open the existing login-required modal and do not submit saved-item
  forms.
- Existing search URL construction, drawer state behavior, navigation targets,
  authenticated saved-item forms, and tooltips are preserved.
- Focused tests cover the changed controls or source-level invariants.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared from A-010/F-088 after T-103 completed baseline metadata/discovery.
- Completed on 2026-05-18. `Searchbar` now uses a labelled submit button;
  `SearchDrawer` and `MobileNavDrawer` now use labelled button children for
  Radix drawer triggers/close controls; unauthenticated favourite/watchlist
  intent controls now use explicit non-submit buttons that open the existing
  login-required modal.
- Added `__tests__/unit/publicSearchNavigationAccessibility.test.tsx` for
  desktop search URL behavior, unauthenticated saved-item modal behavior,
  labelled drawer-control source invariants, and absence of retired clickable
  `<div onClick>` wrappers in the scoped controls.
- Verification passed: focused Jest, `npm run lint`, `npm run build`, and
  `git diff --check`.
- Keep comment action accessibility, landmark/heading cleanup, image tuning,
  route-local cache policy, and artwork-to-shop SSR discovery separate.
