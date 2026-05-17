# T-095 Remove Commented Debug Log Leftovers

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove stale commented-out `console.log()` debug snippets from source so the
full-source `console.log()` search is clean without changing runtime behavior.

## Context

- F-020 tracks debug logs and expected output that make tests, builds, SSR, API,
  upload, and commerce paths noisy.
- T-088 through T-094 removed the active direct `console.log()` output from DB,
  public/account, admin, shared UI, public fetcher, and session helper paths.
- After T-094, `rg -n "console\\.log\\(" src` reports only commented-out debug
  snippets in:
  - `src/lib/config/authCallbacks.ts`
  - `src/lib/actions/authenticateUser.ts`
  - `src/contexts/SessionProvider.tsx`
  - `src/components/sections/CollectionSection.tsx`
  - `src/components/modules/navigation/mainNav/MainNav.tsx`
  - `src/components/layouts/admin/AdminContentLayout.tsx`

## Scope

In scope:

- Remove the stale commented `console.log()` lines from the six files listed
  above.
- Preserve all auth callback, credentials authentication, session provider,
  collection section, main navigation, and admin content layout behavior.
- Preserve non-debug explanatory comments that still add value.
- Add or update source hygiene coverage proving the stale commented debug
  snippets do not return, or rely on an existing full-source/targeted source
  search if no test file is more appropriate.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change active auth/session behavior, callback routing, credential
  validation, UI rendering, navigation layouts, or admin layout structure.
- Do not remove non-debug comments, TODOs, or historical documentation.
- Do not change `console.error()` handling, route-level API error logging,
  public-safe response behavior, monitoring, or global logging/redaction policy.
- Do not introduce a logging library, request correlation, feature flag, or
  broader source-pruning refactor.

## Files Likely Touched

- `src/lib/config/authCallbacks.ts`
- `src/lib/actions/authenticateUser.ts`
- `src/contexts/SessionProvider.tsx`
- `src/components/sections/CollectionSection.tsx`
- `src/components/modules/navigation/mainNav/MainNav.tsx`
- `src/components/layouts/admin/AdminContentLayout.tsx`
- `__tests__/unit/security/renderSourceHygiene.test.ts`,
  `__tests__/unit/security/credentialSourceHygiene.test.ts`, or a focused
  source-hygiene test file if useful
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The six scoped source files no longer contain commented-out `console.log()`
  snippets.
- `rg -n "console\\.log\\(" src` returns no matches.
- Auth callback, credentials auth, session provider, collection section, main
  nav, and admin content layout behavior is unchanged.
- Focused source hygiene coverage or the required source search prevents stale
  debug snippets from returning.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene tests>
npm run lint
npm run build
rg -n "console\\.log\\(" src
git diff --check
```

The `rg` command should return no matches after this task.

Completed verification on 2026-05-17:

```bash
npm test -- --runTestsByPath __tests__/unit/security/consoleLogSourceHygiene.test.ts
npm run lint
npm run build
rg -n "console\\.log\\(" src
git diff --check
```

The full-source `rg` returned no matches.

## Handoff Notes

- Prepared on 2026-05-17 after T-094 removed the last active direct
  `console.log()` output. Keep this task limited to stale commented debug
  snippets; route-level API logging, `console.error()` handling, and broader
  production logging/redaction policy remain separate follow-ups.
- Completed on 2026-05-17 by removing the scoped stale commented
  `console.log()` snippets from auth callbacks, credentials auth, the session
  provider, collection section, main navigation, and admin content layout
  without changing runtime behavior. Added full-source source-hygiene coverage
  so direct or commented `console.log()` calls cannot return under `src`.
