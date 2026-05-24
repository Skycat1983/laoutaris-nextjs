# T-257 Add Programmatic Navigation Pending Feedback

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make the remaining A-024 programmatic public navigations expose pending
feedback while preserving App Router client navigation.

## Context

- A-024 found that dynamic public route transitions can feel inert when custom
  controls navigate without immediate pending UI.
- A-024 Phase 1 added shared accessible loading primitives and upgraded
  localized loading indicators.
- A-024 Phase 2 added route-local loading shells for `/artwork` and `/search`.
- A-024 Phase 3 added the route-local `/shop/products` loading shell.
- The next A-024 action is to address pending feedback in `Searchbar`,
  `SearchDrawerBody`, and the home artwork filter hero before the admin
  dashboard `@main` loading skeleton and route-transition verification.

## Scope

In scope:

- Update `Searchbar` submit navigation so `router.push()` is wrapped with
  local pending feedback for the current Next 14 app.
- Update `SearchDrawerBody` submit navigation so drawer search shows pending
  feedback, prevents duplicate submits, and preserves the current drawer close
  behavior.
- Replace the home artwork filter hero's internal `window.location.href`
  artwork search navigation with App Router client navigation plus pending
  feedback.
- Use the existing accessible loading/status primitives where they fit the UI.
- Preserve current target URLs, query serialization, validation, labels,
  keyboard behavior, and route semantics.
- Add or update focused unit/source coverage for pending feedback and App
  Router navigation behavior.

Out of scope:

- Do not change search result fetching, artwork list query parsing, route cache
  policy, route segment config, API behavior, Shopify behavior, account/auth
  behavior, admin dashboard behavior, package files, Playwright setup, or CI
  workflows.
- Do not redesign search controls, drawer layout, hero layout, artwork filter
  options, or route loading shells.
- Do not use `useLinkStatus`; this app is on Next 14, and A-024 explicitly
  defers that to a future Next upgrade where the hook is available.
- Do not touch account dropdown navigation in this task unless a focused test
  must be adjusted for the T-256 lazy account island.

## Concurrency

Run after A-024 Phase 3 and T-256. Do not run in parallel with edits to
`Searchbar`, `SearchDrawerBody`, `FilterableArtworks`, public route loading
shells, account navigation, root providers, route cache policy, or package
files.

Owned files:

- `src/components/elements/inputs/Searchbar.tsx`
- `src/components/modules/search/SearchDrawerBody.tsx`
- `src/components/modules/hero/slides/FilterableArtworks.tsx`
- focused affected tests under `__tests__/unit/`
- this task brief
- A-024 result/workstream notes only if this task's completion status changes
  them directly

## Acceptance Criteria

- `Searchbar` exposes an accessible pending state after submit navigation
  starts and prevents duplicate submits while pending.
- `SearchDrawerBody` exposes an accessible pending state after submit
  navigation starts, prevents duplicate submits while pending, and preserves
  the existing drawer close behavior.
- The home artwork filter hero uses App Router client navigation for internal
  `/artwork?...` targets instead of `window.location.href`.
- Existing URL/query behavior is preserved for search and artwork filter
  navigation.
- No route cache, server data, account/auth, Shopify, admin, package, or CI
  behavior changes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/publicRouteLoadingShells.test.tsx
npm run lint
git diff --check
```

Add narrower focused tests if the existing files do not cover the new pending
states. Run broader Jest only if the implementation touches shared navigation
helpers.

## Handoff Notes

- Finding: F-119.
- Related findings: F-118, F-120, F-122.
- Depends on: A-024 Phase 3 and T-256.
- This task is intentionally limited to interaction-level pending feedback; the
  admin dashboard loading skeleton and route-transition check remain separate.
- 2026-05-24: Completed. `Searchbar` and `SearchDrawerBody` now use
  transition-backed pending status UI for programmatic search navigation, and
  `FilterableArtworks` now uses App Router navigation with pending feedback
  instead of `window.location.href`. Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/publicRouteLoadingShells.test.tsx`,
  `git diff --check`, and `npm run lint`.
