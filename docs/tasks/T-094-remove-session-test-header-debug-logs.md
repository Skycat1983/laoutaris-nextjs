# T-094 Remove Session Test Header Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining active direct `console.log()` debug output from the
development test-header session helper without changing session resolution,
development test-header overrides, or auth helper return contracts.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 through T-093 removed direct debug logs from DB helpers, public/account
  render paths, user-facing client paths, admin dashboard paths, shared UI, and
  the public artwork fetcher.
- A current source check shows the only remaining active direct
  `console.log()` calls are in `src/lib/session/getUserFromSession.ts`:
  - `console.log("Using test user ID:", testUserId)`
  - `console.log("Using test admin ID:", testAdminId)`
- Commented-out debug lines still exist elsewhere, but those are not active
  runtime logging and should remain separate unless explicitly assigned.

## Scope

In scope:

- Remove the direct success-path test-header `console.log()` calls from
  `src/lib/session/getUserFromSession.ts`.
- Preserve development-only `X-Test-User-Id` behavior:
  - only active when `NODE_ENV === "development"` and a `Request` is supplied
  - attempts `UserModel.findById(testUserId).select("role username").lean().exec()`
  - returns persisted role/username when found
  - returns `{ id: testUserId, role: "user" }` when no user is found or lookup
    fails
- Preserve development-only `X-Test-Admin-Id` behavior:
  - only active when `NODE_ENV === "development"` and a `Request` is supplied
  - returns `{ id: testAdminId, role: "admin" }`
- Preserve `console.error("Error fetching test user:", error)` for the lookup
  failure path.
- Preserve normal `getServerSession(authOptions)` behavior outside development
  test headers.
- Preserve `getUserIdFromSession()` and `isUserAdmin()` delegation behavior.
- Add or update focused source hygiene coverage proving
  `src/lib/session/getUserFromSession.ts` does not contain direct
  `console.log()` calls.
- Add focused behavior coverage for the test-header paths if existing local
  mocking patterns make that practical.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not remove or redesign the development test-header override behavior.
- Do not change `getServerSession`, `authOptions`, `requireApiUser()`,
  `requireApiAdmin()`, middleware, NextAuth callbacks, OAuth provider config,
  or account loaders.
- Do not change `console.error()` handling, route-level API error logging,
  public-safe response behavior, monitoring, or global logging/redaction
  policy.
- Do not clean commented-out debug lines in unrelated files unless a separate
  task explicitly scopes them.
- Do not introduce a logging library, request correlation, feature flag, or
  broader auth/session helper refactor.

## Files Likely Touched

- `src/lib/session/getUserFromSession.ts`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a focused
  session source-hygiene test file
- Optional focused session helper behavior tests if useful and consistent with
  local mocking patterns
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- `src/lib/session/getUserFromSession.ts` contains no direct `console.log()`
  calls.
- `X-Test-User-Id` still resolves persisted role/username in development when
  the user lookup succeeds.
- `X-Test-User-Id` still falls back to a user role when the user is not found
  or lookup fails.
- `X-Test-Admin-Id` still returns an admin session user in development.
- Normal NextAuth session lookup remains unchanged when no development test
  header is active.
- `getUserIdFromSession()` and `isUserAdmin()` still delegate to
  `getUserFromSession()`.
- Focused source hygiene coverage prevents the removed direct session helper
  logs from returning.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene or session helper tests>
npm run lint
npm run build
rg -n "console\\.log\\(" src/lib/session/getUserFromSession.ts
rg -n "console\\.log\\(" src
git diff --check
```

The full-source `rg` is expected to report only commented-out debug lines after
this task unless another active direct log is introduced in parallel.

Completed verification on 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/auth/sessionTestHeaders.test.ts
npm run lint
npm run build
rg -n "console\\.log\\(" src/lib/session/getUserFromSession.ts
rg -n "console\\.log\\(" src
git diff --check
```

The scoped session helper `rg` returned no matches. The full-source `rg`
reported only existing commented-out `console.log()` lines.

## Handoff Notes

- Prepared on 2026-05-17 after T-093 completed the scoped shared UI/public
  fetcher debug-log cleanup. Keep this task limited to active direct
  `getUserFromSession` test-header logs; route-level API logging, commented-out
  debug lines, and broader production logging/redaction policy remain separate
  follow-ups.
- Completed on 2026-05-17 by removing the success-path test-header
  `console.log()` calls from `getUserFromSession` while preserving persisted
  test-user lookup, missing/failing lookup fallback, test-admin override,
  normal NextAuth session lookup, `getUserIdFromSession()`, `isUserAdmin()`,
  and the lookup failure `console.error()` path. Focused session helper tests
  now cover those paths and prevent direct `console.log()` calls from returning
  to the helper.
