# T-032 Prune Unused Profile Update Fetcher

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the final F-037 route/fetcher parity gap by removing the unused
`user.profile.update` fetcher instead of adding an unsupported profile write
route.

## Why Now

After T-031, the only expected F-037 allowlist entry should be
`user.profile.update`: the fetcher exposes `PATCH /api/v2/user/profile`, but the
route only exports `GET`. Static search shows no active UI or server consumer
calls the profile update fetcher. Pruning the unsupported method keeps the
profile write contract out of production scope until validation, persistence,
and UX requirements are intentionally designed.

This task addresses:

- [F-037](../audits/findings-register.md): API client fetchers expose
  unsupported route paths and methods.
- [R-006](../risks/production-readiness.md): route/fetcher parity drift remains
  open.
- [R-005](../risks/production-readiness.md): route/fetcher contract coverage
  should stay current.

## Read First

- [T-029 Add route fetcher parity inventory](T-029-route-fetcher-parity-inventory.md)
- [T-031 Prune unused saved item write fetchers](T-031-prune-unused-saved-item-write-fetchers.md)
- [A-002 API contracts result](../audits/results/A-002-api-contracts.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- `src/lib/api/user/profile/fetchers.ts`
- `src/app/api/v2/user/profile/route.ts`
- `__tests__/unit/api/userProfileRoute.test.ts`
- `__tests__/unit/api/routeFetcherParity.test.ts`

## Scope

In scope:

- Confirm no active source consumer calls `clientApi.user.profile.update`,
  `serverApi.user.profile.update`, or `profile.update`.
- Remove the unused `update` method from `createProfileFetchers`.
- Remove the `user.profile.update` operation from `FETCHER_OPERATIONS` and
  `KNOWN_ROUTE_FETCHER_GAP_IDS` in
  `__tests__/unit/api/routeFetcherParity.test.ts`.
- Confirm the route/fetcher parity allowlist is empty after the cleanup.
- Update this task, workstreams, findings, risks, and orchestration state after
  completion. If the allowlist is empty, mark F-037 resolved.

Out of scope:

- Do not implement `PATCH /api/v2/user/profile`.
- Do not redesign the profile DTO or change current profile `GET` response
  behavior.
- Do not add account settings editing UI.
- Do not address the separate A-002 raw-profile DTO finding unless required by
  the fetcher cleanup.

## Acceptance Criteria

- `createProfileFetchers` exposes only the backed `get` method.
- There are no active source references to `profile.update` outside historical
  docs, task docs, or the completed diff.
- T-029's parity test passes with `KNOWN_ROUTE_FETCHER_GAP_IDS` empty.
- The parity test still self-checks the empty allowlist and all inventoried
  fetcher operations are backed by route methods.

## Verification

Run the focused profile and parity tests:

```bash
npm test -- --runTestsByPath __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts
```

Then run:

```bash
npm run lint
npm run build
```

Also run a reference check:

```bash
rg -n "profile\\.update|clientApi\\.user\\.profile\\.update|serverApi\\.user\\.profile\\.update" src __tests__
```

## Completion

Completed on 2026-05-15.

- Removed the unused `update` method from
  `src/lib/api/user/profile/fetchers.ts`; `createProfileFetchers` now exposes
  only the backed `get` method.
- Removed the `user.profile.update` operation from `FETCHER_OPERATIONS` and
  replaced `KNOWN_ROUTE_FETCHER_GAP_IDS` with an explicit empty set in
  `__tests__/unit/api/routeFetcherParity.test.ts`.
- Confirmed the route/fetcher parity allowlist is empty and the parity test
  still self-checks the empty allowlist against current fetcher operations.
- Reference check returned no active source or test matches:
  `rg -n "profile\\.update|clientApi\\.user\\.profile\\.update|serverApi\\.user\\.profile\\.update" src __tests__`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/userProfileRoute.test.ts __tests__/unit/api/routeFetcherParity.test.ts`
  passed with 2 suites and 5 tests, `npm run lint` passed, and `npm run build`
  passed. Build retained existing MongoDB connection, branch verification,
  fetcher debug, and static-generation log noise.
- F-037 is resolved; all inventoried fetcher operations are now backed by
  matching route methods.

## Escalate

Escalate to the orchestrator if:

- An active consumer calls the profile update fetcher.
- Product direction requires profile editing in this refactor batch.
- Removing the method exposes broader API client type coupling.
