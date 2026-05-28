# T-324 Add Auth Callback Redirect Coverage

Status: Completed

Workstreams:

- [Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)
- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add focused coverage for current `authCallbacks.redirect()` behavior without
changing runtime auth redirects.

## Context

T-323 found that `src/lib/config/authCallbacks.ts` owns auth redirect semantics,
not ordinary route-builder cleanup. The owner/orchestrator accepted the
recommended coverage-first path on 2026-05-28: preserve the current
`/api/auth/signin -> /dashboard` behavior for now, make it explicit in tests,
and defer any destination change to a separate runtime decision.

## Scope

In scope:

- Read
  [T-323 auth callback redirect contract scope](../audits/results/T-323-auth-callback-redirect-contract-scope.md).
- Add focused unit coverage for:
  - `/api/auth/signin` redirecting to `${baseUrl}/dashboard`.
  - `/api/auth/signout` redirecting to `baseUrl`.
  - same-origin non-auth callback URLs passing through unchanged.
  - off-origin callback URLs falling back to `baseUrl`.

Out of scope:

- Do not change `src/lib/config/authCallbacks.ts`.
- Do not change route builders, middleware, session/JWT behavior, OAuth/provider
  behavior, sign-in UI, smoke scripts, sitemap/robots, or saved-item behavior.
- Do not decide whether `/dashboard` is the long-term destination.

## Files Touched

- `__tests__/unit/auth/credentialsRoleSession.test.ts`
- `docs/tasks/T-324-add-auth-callback-redirect-coverage.md`

## Acceptance Criteria

- Focused tests lock the current redirect callback contract.
- Runtime auth behavior is unchanged.
- Future redirect destination changes must update the explicit redirect tests.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts
git diff --check
```

Results on 2026-05-28:

- `npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts`
  passed: 1 suite, 14 tests.
- `git diff --check` passed.

## Handoff Notes

- Prepared and implemented by the orchestrator on 2026-05-28 after T-323
  completed and the owner accepted the coverage-first recommendation.
- `/dashboard` remains a documented current behavior, not an endorsed
  long-term product destination.
