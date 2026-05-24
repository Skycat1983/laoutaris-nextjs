# T-259 Add Targeted Route Transition Loading Check

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add the final targeted A-024 route-transition loading check after the public
route loading shells, programmatic pending feedback, and admin `@main` loading
skeleton have landed.

## Context

- A-024 found that route traversal could feel frozen because no focused test
  exercised delayed route-transition loading behavior.
- Playwright is not installed and remains decision-gated by the testing
  runbook, so this task uses a narrow component-level route-transition harness.
- The check should prove that a real navigation control can start a delayed
  route transition, show the route-local loading shell, and then replace it
  with final route content.

## Scope

In scope:

- Add one targeted component-level delayed route-transition test.
- Use an already-implemented route loading shell, not a generic fallback.
- Keep the test focused on one representative public journey.
- Update A-024 result/workstream/finding notes for F-122.

Out of scope:

- Do not install Playwright or add browser tooling/scripts.
- Do not change route cache policy, public route data fetching, admin behavior,
  auth/account behavior, Shopify behavior, package files, CI workflows, or
  visual design.
- Do not broaden into full navigation smoke coverage.

## Acceptance Criteria

- The test submits a real public navigation control.
- The test simulates a delayed route response.
- The test asserts that a route-local loading shell/status appears during the
  delay.
- The test asserts final route content replaces the loading shell.
- Focused verification passes without adding Playwright.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteTransitionLoading.test.tsx __tests__/unit/publicRouteLoadingShells.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx
npm run lint
git diff --check
```

## Handoff Notes

- Finding: F-122.
- Related findings: F-118, F-119, F-120.
- Depends on: A-024 Phase 3, T-257, and T-258.
- 2026-05-24: Completed. Added
  `publicRouteTransitionLoading.test.tsx`, which submits the real desktop
  `Searchbar`, suspends a representative `/search` route, asserts the
  route-local search loading shell is visible during the delay, then resolves
  final route content.
- Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/publicRouteTransitionLoading.test.tsx __tests__/unit/publicRouteLoadingShells.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx`,
  `npm run lint`, and `git diff --check`.
