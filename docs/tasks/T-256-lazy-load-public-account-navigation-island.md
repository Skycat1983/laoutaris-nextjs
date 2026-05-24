# T-256 Lazy-Load Public Account Navigation Island

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce the post-T-254 root/header client cost by deferring public account
navigation menu implementation code until account-menu intent, without moving
providers or changing auth/session behavior.

## Context

- T-236 lazy-loaded the public mobile search and navigation drawer bodies,
  reducing the root layout client chunk from `35,174` to `27,772` bytes
  uncompressed while keeping root providers in place.
- T-254 removed unused language state from the active root modal provider path
  and lazy-loaded the modal dialog presentation. The root layout chunk moved to
  `27,498` bytes uncompressed, and the modal dialog code split successfully.
- T-255 found the remaining above-target root/header cost is outside the modal
  path. Source shows `DesktopNavLayout` and `TabletNavLayout` still import
  `AccountNav`, which imports account dropdown/menu primitives, NextAuth
  session/sign-out APIs, modal hooks, and account icons in the persistent public
  header path.
- `ClientContextBoundary`, `SessionProvider`, and modal provider ownership
  should stay rooted for this slice.

## Scope

In scope:

- Split the public header account navigation so the initial desktop/tablet
  header path keeps a stable account trigger/fallback while deferring
  account-menu/dropdown implementation code until account-menu intent.
- Keep `SessionProvider` global and unchanged.
- Keep modal state available globally at the existing root boundary.
- Preserve current visible behavior for:
  - unauthenticated profile-disabled, sign-in, and sign-up account menu states;
  - authenticated profile and logout menu states;
  - logout success/failure modal messaging and account-route redirect callback;
  - desktop and tablet header layout spacing.
- Keep the existing T-236 mobile search/navigation drawer body split intact.
- Add or update focused source/behavior coverage for the account nav split,
  rooted provider ownership, preserved account menu behavior, and
  client/server import boundaries.
- Run a build and compare the root layout client chunk against the T-254
  `27,498` byte baseline.

Out of scope:

- Do not move `ClientContextBoundary`.
- Do not move `SessionProvider`, change session/auth semantics, or add
  route-local session providers.
- Do not move modal provider ownership below the root.
- Do not change saved-item server actions, saved-item buttons, comment cards,
  auth form payloads, account routes, admin dashboard behavior, contact/enquiry
  forms, shop behavior, cache policy, route segment config, package files,
  Playwright setup, or CI workflows.
- Do not remove or redesign the account menu, language menu, heart/cart menu
  placeholders, or header layout in this task unless the existing code must be
  mechanically moved into the lazy account island.
- Do not broaden the split to search, mobile drawer, footer, route-local
  forms, saved-item controls, comments, admin operation tabs, or shop islands.

## Concurrency

Run after T-255. Do not run in parallel with root layout/provider/header/account
navigation edits, auth/session refactors, modal provider edits, saved-item
action edits, account/admin/comment UI edits, contact/enquiry form edits,
cache-policy runtime work, package edits, Playwright setup, or CI edits.

Owned files:

- `src/components/modules/navigation/accountNav/AccountNav.tsx`
- `src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx`
- optional colocated account-nav shell/body files under
  `src/components/modules/navigation/accountNav/`
- `src/components/modules/navigation/mainNav/DesktopNavLayout.tsx` only if the
  account island mount changes
- `src/components/modules/navigation/mainNav/TabletNavLayout.tsx` only if the
  account island mount changes
- focused affected tests under `__tests__/unit/`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Implementation Notes

- Prefer the smallest split that keeps the same account trigger footprint in
  the desktop/tablet header before the account menu is opened.
- A small account trigger shell may remain in the initial header path. The
  shadcn menu/dropdown body, account menu content, account-specific icons, and
  sign-out/modal callback logic should load only after account-menu intent if
  that can be done without changing behavior.
- Keep `SessionProvider` rooted. This task may lazy-load components that call
  `useSession()`, but it should not change how session data is provided.
- If the current shadcn navigation-menu primitives make intent-gated lazy
  loading impractical without behavior drift, keep behavior and record the
  build/source evidence rather than moving providers or broadening the task.
- Keep dynamic imports client-compatible and avoid a split shape that causes
  hydration warnings or a blank/unstable header trigger.

## Acceptance Criteria

- `SessionProvider` remains global in `ClientContextBoundary`.
- Modal provider ownership remains global in `ClientContextBoundary`.
- The public header still renders a stable account trigger on desktop and
  tablet before interaction.
- Account menu behavior remains equivalent for unauthenticated and
  authenticated states, including sign-in/sign-up/profile disabled/enabled
  states and logout modal callback behavior.
- Account dropdown/menu implementation code is deferred from the initial root
  header path, or the handoff explains with source/build evidence why it could
  not be split safely.
- The root layout client chunk is below `26,000` bytes uncompressed, or the
  task handoff explains why Next retained account navigation code despite the
  split.
- No cache, route segment, auth/session, saved-action, account/admin/comment,
  contact/enquiry, shop, package, Playwright, or CI behavior is changed.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/commentActionAccessibility.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
npm run build
git diff --check
```

Use targeted source searches for `AccountNav`, `AccountNavDropdown`,
`useSession`, `signOut`, `useGlobalFeatures`, `SessionProvider`,
`next/dynamic` or `React.lazy`, `.next/static/chunks/app/layout-*.js`, and the
account navigation lazy chunk. Compare the root layout chunk against the T-254
`27,498` byte baseline.

## Handoff Notes

- Finding: F-115.
- Related finding: F-111.
- Risk: R-012.
- Depends on: T-255.
- T-255 selected this runtime task because T-254 proved the modal split and
  showed the remaining root/header cost sits in existing header/account client
  code rather than the modal dialog path.
- Completed on 2026-05-24. `AccountNav` now keeps a stable public header
  account trigger shell in the desktop/tablet header path and lazy-loads
  `AccountNavDropdown` with `React.lazy`/`Suspense` after account-menu intent.
- `AccountNavDropdown` still owns the NextAuth `useSession()`/`signOut()`
  calls, rooted modal hook usage, account menu links, and logout modal callback
  behavior. It can mount initially open when the first click or hover triggered
  the lazy load.
- `ClientContextBoundary`, `SessionProvider`, and `GlobalFeaturesProvider`
  ownership stayed rooted. The T-236 mobile search/navigation drawer body split
  stayed intact.
- Build evidence: `.next/static/chunks/app/layout-452b0ebce9934366.js` is
  `22,313` bytes uncompressed versus the T-254 `27,498` byte baseline. The
  account dropdown implementation split to
  `.next/static/chunks/1833.254d53090d3e3f31.js` at `20,287` bytes. Targeted
  search confirmed `Logout successful.`, `Logout failed.`, `/account/settings`,
  and `/sign-in?mode=signup` are absent from the root layout chunk and present
  in the lazy account chunk.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx`,
  `npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/commentActionAccessibility.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `npm run build`, targeted source/chunk searches, and `git diff --check`.
