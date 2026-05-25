# T-289 Add OAuth Role Session Propagation Test

Status: Completed

Workstreams:

- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)
- [Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Close F-141 by adding focused provider-style OAuth role/session propagation
coverage without changing production auth behavior.

## Context

A-032 found that adapter-created OAuth users default to `role: "user"` and the
generic NextAuth callbacks copy user role into JWT/session state, but there is
no provider-specific test proving the OAuth-shaped callback path keeps that
default user role.

Existing `credentialsRoleSession.test.ts` covers credentials users with admin
and user roles, and `dbHelpers.test.ts` covers adapter-created OAuth user
defaults. This task should connect those behaviors at the callback boundary.

## Scope

In scope:

- Add focused test coverage for an OAuth/provider-shaped user object passing
  through `authCallbacks.jwt()` and `authCallbacks.session()`.
- Prove the default persisted OAuth role remains `user` in the JWT and session.
- Preserve existing credentials admin/user role tests.
- Update this task, the task index, and auth/testing workstream notes.

Out of scope:

- Changing OAuth providers, NextAuth adapter behavior, sign-in UI, or session
  runtime behavior.
- Adding credentialed smoke or browser automation.
- Pruning legacy session helpers; T-290 owns pruning inventory.

## Concurrency

Can run in parallel with T-290 if it does not edit the same auth test file.
Coordinate if both tasks touch `credentialsRoleSession.test.ts` or auth
workstream docs.

## Files Likely Touched

- `__tests__/unit/auth/credentialsRoleSession.test.ts`
- `docs/tasks/T-289-add-oauth-role-session-propagation-test.md`
- `docs/tasks/README.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`

## Completion Contract

- Mark this task `Status: Completed` only after focused auth tests pass.
- Update task index and relevant workstream notes.
- Mark F-141 resolved if the new coverage closes the finding.
- Keep production auth behavior unchanged unless the test exposes a real defect.

## Acceptance Criteria

- OAuth/provider-shaped callback coverage proves a user role of `user` reaches
  both JWT and session.
- Existing credentials role propagation coverage remains intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/db/dbHelpers.test.ts
npm run typecheck
git diff --check
```

## Handoff Notes

- Planned from F-141 after the local verification and Main CI tracks completed.
- Completed on 2026-05-25.
- Added provider-shaped OAuth callback coverage to
  `__tests__/unit/auth/credentialsRoleSession.test.ts` using a Google OAuth
  account/profile fixture and an adapter-defaulted `role: "user"` user object.
- The test proves `authCallbacks.jwt()` preserves the OAuth-created user's
  default role and `authCallbacks.session()` exposes that same `user` role on
  `session.user`.
- Production auth behavior was unchanged.
- Verification passed:
  - `npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/db/dbHelpers.test.ts`
    passed with 2 suites and 15 tests. Jest emitted the existing Node
    `punycode` deprecation warning.
  - `npm run typecheck` passed.
  - `git diff --check` passed.
