# T-002 Persist Credentials Role Into JWT Session

Status: Completed

Workstream: [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Ensure users who sign in with credentials carry their persisted database role
into the NextAuth JWT and session so admin users can pass middleware and
route-local admin checks.

## Outcome

- Credentials authentication now returns the persisted user `role` along with
  `id`, `email`, and `name`.
- The shared NextAuth callbacks preserve that role in JWT state and expose it as
  `session.user.role`.
- Focused unit coverage verifies both credentials admin and credentials
  non-admin role propagation through authorize, JWT, and session shaping.
- F-042 is resolved; stable `session.user.id` ownership helpers, shared route
  guards, Cloudinary signing guards, `/protected`, legacy session cleanup, and
  admin bootstrap/recovery remain separate auth workstream tasks.

## Why Now

This is the smallest high-severity auth slice from the reconciled A-004 audit.
It addresses:

- [F-042](../audits/findings-register.md): credentials admin sessions did not
  persist the database role into JWT/session state.
- [R-002](../risks/production-readiness.md): credentials role persistence is
  now mitigated, while broader auth/admin risks remain open.
- [A-004](../audits/results/A-004-auth-admin-permissions.md): auth/admin audit
  evidence for the failing role path.

## Read First

- [Auth workstream](../workstreams/auth-admin-and-permissions.md)
- [Auth runbook](../runbooks/auth.md)
- [A-004 auth audit](../audits/results/A-004-auth-admin-permissions.md)
- [Production risks](../risks/production-readiness.md)

## Scope

In scope:

- Update credentials authentication so the returned NextAuth user includes the
  persisted `role`.
- Keep `session.user.id` and `session.user.role` populated from JWT state.
- Add focused tests for credentials admin and credentials non-admin role
  propagation where practical.
- Remove or gate only directly related debug logging if it affects the tested
  path.
- Update this task, auth workstream progress, and risk status if the mitigation
  is complete.

Out of scope:

- Do not refactor all session ownership helpers.
- Do not change OAuth account provisioning beyond preserving existing behavior.
- Do not remove `/protected`, legacy custom session code, or backup sign-in
  forms.
- Do not introduce shared `requireUser` or `requireAdmin` route helpers in this
  task.
- Do not modify unrelated admin API routes.

## Files Likely Touched

- `src/lib/actions/authenticateUser.ts`
- `src/lib/config/authOptions.ts`
- `src/lib/session/isAdmin.ts` only if needed for the role propagation fix
- `__tests__/` for focused auth/session tests
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/risks/production-readiness.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to credentials role propagation
and directly related tests/docs. Do not combine this with stable
`session.user.id` ownership helper refactors.

## Acceptance Criteria

- Credentials `authorizeUser` returns a user object that includes the persisted
  role.
- NextAuth JWT callback preserves the role for credentials users.
- NextAuth session callback exposes `session.user.role`.
- A credentials admin user can satisfy existing `role === "admin"` checks.
- A credentials non-admin user remains non-admin.
- Existing OAuth behavior is not intentionally changed.

## Verification

Completed:

```bash
npm test -- --runTestsByPath __tests__/unit/utils/routeUtils.test.ts __tests__/unit/auth/credentialsRoleSession.test.ts
npm test
npm run lint
npm run build
```

`npm run build` passed, but still emitted the existing build-time live MongoDB
connection and debug-log noise tracked by R-024/F-019 and F-020.

## Escalate

Escalate to the orchestrator if:

- The implementation requires changing how OAuth users receive roles.
- The fix requires broad changes to user identity helpers.
- Tests need database integration infrastructure that does not exist yet.
- Another agent is editing auth config or session helpers concurrently.
