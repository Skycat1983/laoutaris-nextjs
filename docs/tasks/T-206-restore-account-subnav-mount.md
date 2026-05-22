# T-206 Restore Account Subnav Mount

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Auth, Admin, And Permissions](../workstreams/auth-admin-and-permissions.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Restore the existing tested account subnavigation loader in the account layout
and add layout-level coverage so it remains mounted.

## Context

- A-005/F-109 found that `AccountSubnavLoader` is implemented, tested, and
  documented as preserving account links and disabled states, but
  `src/app/account/layout.tsx` comments out the Suspense block that would render
  it.
- `src/app/account/layout.tsx` still imports `AccountSubnavLoader` and
  `SubnavSkeleton`, which points to an unfinished restore rather than an
  intentional prune.
- Other route-family layouts such as biography and collections already mount
  their subnav loaders inside `Suspense` with `SubnavSkeleton`.
- T-081 already moved `AccountSubnavLoader` off same-app HTTP and focused
  loader tests cover links for settings, favourites, watchlist, comments, cart,
  and orders.

## Scope

In scope:

- Restore the existing Suspense-mounted `AccountSubnavLoader` block in
  `src/app/account/layout.tsx`.
- Preserve the current layout wrapper, account route behavior, loader link
  labels/order/disabled states, and `SubnavSkeleton` fallback.
- Add layout-level coverage or a source invariant proving the account layout
  renders the loader instead of leaving it commented out.
- Keep the existing `AccountSubnavLoader` no-self-fetch and link behavior tests
  passing.

Out of scope:

- Do not redesign account navigation, add new account routes, enable cart or
  orders, or change saved-item/comment link semantics.
- Do not change account auth/session policy, middleware, user navigation API
  contracts, saved-item redirects, or account dropdown behavior.
- Do not prune `AccountSubnavLoader`; current docs and tests treat it as the
  intended account UX unless a separate owner decision says otherwise.
- Do not touch mixed component barrel cleanup, public detail not-found
  contracts, client fetch retry states, route loading-state documentation,
  homepage prototypes, or framed-preview behavior.

## Concurrency

Run this task alone with other work touching account layout navigation,
`AccountSubnavLoader`, `SubnavSkeleton`, or account layout tests/source
invariants.

Owned files:

- `src/app/account/layout.tsx`
- layout-level account test or source-hygiene test added/updated for this
  mount invariant
- `__tests__/unit/loaders/AccountSubnavLoader.test.tsx` only if existing loader
  assertions need narrow updates
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Account layout renders `AccountSubnavLoader` inside `Suspense` with
  `SubnavSkeleton` fallback.
- The layout no longer contains a commented-out account subnav block.
- Focused coverage fails if the account layout stops mounting the subnav
  loader.
- Existing `AccountSubnavLoader` tests still pass and continue to prove current
  link behavior and no same-app fetch usage.
- No account route, auth, saved-item, cart, orders, or account dropdown
  behavior changes beyond restoring the subnav mount.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/AccountSubnavLoader.test.tsx
npm run lint
git diff --check
```

Add any new account layout test/source-hygiene test path to the focused Jest
command before handoff.

## Agent Prompt

You are working on T-206. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
F-109 in `docs/audits/findings-register.md`, and the frontend/auth/testing
workstreams. Restore only the existing `AccountSubnavLoader` Suspense block in
`src/app/account/layout.tsx`, preserve the existing account subnav links and
disabled behavior, and add layout-level coverage or a source invariant proving
the account layout mounts the loader. Do not redesign account navigation, add
cart/orders behavior, change auth/session policy, alter account redirects, or
touch unrelated A-005 follow-ups. Run the verification commands plus any new
focused account layout test, then update this handoff with candidate tracker
updates.

## Handoff Notes

- Prepared after T-205 resolved F-108 mixed component barrel cleanup.
- 2026-05-22: Restored the active `Suspense` block in
  `src/app/account/layout.tsx` so it mounts `AccountSubnavLoader` with
  `SubnavSkeleton` fallback before account route content. Removed the
  commented-out subnav block without changing account routes, auth/session
  behavior, saved-item semantics, cart/orders disabled behavior, or loader link
  construction.
- Added `__tests__/unit/accountLayoutSubnavMount.test.tsx` to prove the account
  layout renders the subnav loader inside `Suspense`, preserves the account
  content wrapper, and cannot satisfy the invariant with a JSX-commented
  `AccountSubnavLoader` block.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/AccountSubnavLoader.test.tsx __tests__/unit/accountLayoutSubnavMount.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Candidate tracker updates for the orchestrator/reconciliation owner:
  mark F-109/T-206 resolved in `docs/audits/findings-register.md`; add the
  T-206 completion fact to the frontend, auth/admin, and testing workstreams;
  update any active orchestration/risk entries that still list the account
  subnav mount as open.
