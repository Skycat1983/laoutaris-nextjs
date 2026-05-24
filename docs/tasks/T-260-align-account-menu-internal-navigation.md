# T-260 Align Account Menu Internal Navigation

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the remaining F-119 account-menu navigation follow-up by replacing raw
internal account-menu anchors with App Router navigation semantics while
preserving the T-256 lazy account island and existing auth/logout behavior.

## Context

- A-024 found programmatic and custom internal navigations that lacked pending
  feedback or bypassed App Router navigation.
- T-257 completed the scoped public search and home artwork filter pending
  feedback slice.
- T-256 moved `AccountNavDropdown` behind a lazy account-menu island, but the
  dropdown still owns internal account/sign-in/signup menu routes.
- F-119 remains partially mitigated only because account-menu internal route
  semantics were deferred to a separate account-navigation task.

## Scope

In scope:

- Update `AccountNavDropdown` internal navigation for `/account/settings`,
  `/sign-in`, and `/sign-in?mode=signup` to use App Router-compatible
  navigation semantics.
- Preserve disabled/enabled behavior for authenticated and unauthenticated menu
  states:
  - unauthenticated users can use sign-in and sign-up menu items;
  - unauthenticated profile and logout controls remain disabled;
  - authenticated users can use profile and logout controls;
  - authenticated sign-in and sign-up controls remain disabled.
- Preserve logout `signOut({ redirect: false })`, success/failure modal
  messaging, and account-route redirect callback behavior.
- Preserve the T-256 lazy account island boundary; the dropdown implementation
  must stay out of the persistent root/header path.
- Add or update focused tests for route semantics, disabled behavior, lazy
  island boundaries, and logout modal behavior where needed.

Out of scope:

- Do not move `ClientContextBoundary`, `SessionProvider`, or modal provider
  ownership.
- Do not change auth/session semantics, sign-in form behavior, account routes,
  saved-item actions, comments, admin behavior, contact/enquiry forms, shop
  behavior, cache policy, route segment config, package files, Playwright
  setup, or CI workflows.
- Do not redesign the account menu, language menu, heart/cart placeholders, or
  header layout.
- Do not broaden this to search/drawer/artwork pending feedback; T-257 already
  owns that path.

## Concurrency

Run after T-259. Do not run in parallel with account navigation, root
provider/header edits, auth/session refactors, modal provider edits, saved-item
action edits, account route edits, package edits, Playwright setup, or CI
edits.

Owned files:

- `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
- focused affected tests under `__tests__/unit/`
- this task brief
- F-119/A-024 docs only if this task completes or changes the remaining
  follow-up status

## Acceptance Criteria

- Account dropdown internal profile/sign-in/sign-up navigation no longer uses
  raw internal anchors that bypass App Router client navigation.
- Disabled menu items remain non-navigable and expose the existing disabled
  affordance.
- Logout behavior and modal callbacks are unchanged.
- `AccountNavDropdown` remains lazy-loaded behind `AccountNav`; root/header
  source still does not import the dropdown implementation eagerly.
- F-119 can be marked resolved if no other A-024 account-menu navigation gap
  remains.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
npm run lint
git diff --check
```

Add narrower focused tests if existing coverage does not assert the account
menu route semantics. Run `npm run build` only if the implementation changes
the lazy import boundary or root/header chunk ownership.

## Handoff Notes

- Finding: F-119.
- Related tasks: T-256, T-257, T-259.
- 2026-05-24 completed: `AccountNavDropdown` now renders enabled internal
  profile/sign-in/sign-up routes through `next/link`, renders disabled menu
  states as non-navigating buttons, and keeps logout as a disabled-aware action
  button using `signOut({ redirect: false })` plus the existing modal callback
  behavior.
- Focused coverage was added for authenticated and unauthenticated menu route
  semantics, disabled states, logout behavior, and the T-256 lazy account
  island/source boundary.
- Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `git diff --check`, and `npm run lint`.
