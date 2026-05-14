# T-003 Use Stable Session User ID For Ownership

Status: Completed

Workstream: [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Make `session.user.id` the canonical user identity for protected user ownership
checks and remove protected-read user creation from session helper code.

## Outcome

- `getUserIdFromSession()` now returns `session.user.id` directly and returns
  `null` when there is no session or no stable user ID.
- Normal NextAuth session handling in `getUserFromSession()` now uses
  `session.user.id` and `session.user.role` without resolving users by display
  name or creating users during protected reads.
- Focused unit coverage verifies stable-ID success, missing-session null,
  missing-ID null, and that the helper does not call username lookup or user
  creation.
- F-043 is resolved; shared JSON route guards, Cloudinary signing guards,
  `/protected`, legacy session cleanup, and admin bootstrap/recovery remain
  separate auth workstream tasks.

## Why Now

This is the next high-severity auth slice after T-002. It addresses:

- [F-043](../audits/findings-register.md): user ownership checks depend on
  mutable display names and can create users during protected reads.
- [R-002](../risks/production-readiness.md): stable user identity/ownership was
  part of the open auth/admin production risk.
- [A-004](../audits/results/A-004-auth-admin-permissions.md): auth/admin audit
  evidence for the unstable ownership path.

## Read First

- [Auth workstream](../workstreams/auth-admin-and-permissions.md)
- [A-004 auth audit](../audits/results/A-004-auth-admin-permissions.md)
- [T-002 credentials role session](T-002-credentials-role-session.md)
- [Production risks](../risks/production-readiness.md)

## Scope

In scope:

- Update `getUserIdFromSession` so protected route/user ownership checks use
  `session.user.id`.
- Stop creating users inside protected-read session helper code.
- Preserve current route imports where possible so this is not a broad API route
  refactor.
- Add focused tests for:
  - session with stable `user.id` returns that ID.
  - missing session returns `null`.
  - missing `user.id` returns `null`.
  - helper does not look up by username or call user creation during protected
    reads.
- Update task/workstream/risk docs if the mitigation is complete.

Out of scope:

- Do not introduce shared `requireUser` or `requireAdmin` route helpers.
- Do not rewrite all user API response contracts.
- Do not change OAuth user provisioning or adapter behavior.
- Do not remove legacy custom session files, `/protected`, or backup forms.
- Do not refactor favourite/watchlist server actions beyond preserving behavior
  through the stable helper.

## Files Likely Touched

- `src/lib/session/getUserIdFromSession.ts`
- `src/lib/session/getUserFromSession.ts` only if needed to avoid duplicate
  unsafe behavior or document separation.
- User route/action tests under `__tests__/unit/`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/risks/production-readiness.md`
- `docs/audits/findings-register.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to stable session identity and
direct tests/docs. Do not combine this with route guard standardization or auth
pruning.

## Acceptance Criteria

- Protected user ownership helpers use `session.user.id` as the source of truth.
- The helper no longer resolves users by `session.user.name` for ownership.
- The helper no longer creates users as a side effect of protected reads.
- Existing user route/action call sites continue to compile.
- Focused tests cover the new helper behavior.

## Verification

Completed:

```bash
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts
npm test
npm run lint
npm run build
```

`npm test` still emits the existing invalid-date console errors from
`dateUtils.test.ts`. `npm run build` passed, but still emitted the existing
build-time live MongoDB connection and debug-log noise tracked by R-024/F-019
and F-020.

## Escalate

Escalate to the orchestrator if:

- Any route depends on username-based lookup semantics.
- Removing protected-read user creation breaks an OAuth account flow.
- The fix requires changing NextAuth adapter user provisioning.
- Another agent is editing session helpers or user API routes concurrently.
