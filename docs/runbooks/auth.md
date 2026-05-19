# Auth Runbook

Authentication uses NextAuth with JWT sessions.

## Code Areas

- `src/lib/config/authOptions.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/middleware.ts`
- `src/lib/session/`
- `src/lib/actions/authenticateUser.ts`
- `src/lib/actions/registerUser.ts`

## Providers

- Credentials.
- GitHub OAuth.
- Google OAuth.

## Environment Configuration

Auth environment variables are inventoried in
[environment.md](environment.md). Current source requires `NEXTAUTH_SECRET` for
middleware token lookup, plus `GITHUB_ID`/`GITHUB_SECRET` and
`GOOGLE_ID`/`GOOGLE_SECRET` only when those OAuth providers are enabled.

`JWT_SECRET` and `AUTH_SECRET` are legacy or unused candidates, not current
runtime requirements. Do not keep them in managed environments unless the owner
documents a specific external reason.

## Admin Access

Middleware checks route protection and admin access. Admin authorization depends
on the JWT role value being `admin`.

The persisted user role is stored in MongoDB on the `users` collection as
`role: "user"` or `role: "admin"`. Credentials sign-in reads that persisted
role, copies it into the NextAuth JWT in the `jwt` callback, then exposes it on
`session.user.role` in the `session` callback. A role change does not update an
already-issued JWT; the affected user must sign out and sign back in before the
new role is reflected in the session.

### Admin Bootstrap And Recovery

Use this workflow for first-admin bootstrap, routine admin promotion, and
emergency lockout recovery. Do not record account names, emails, passwords,
password hashes, session values, cookies, CSRF tokens, OAuth tokens, provider
secrets, MongoDB connection strings, or private owner contact details in repo
docs, task notes, screenshots, or chat.

#### Required Approval And Evidence

Before creating, promoting, demoting, or recovering an admin account, collect
approval outside this repo:

- Owner or orchestrator approval for the exact action and production
  environment.
- The approved account source, such as owner-created credentials account,
  owner-approved OAuth account, or owner-approved smoke account, without naming
  the account in docs.
- Reason for the change, such as first production bootstrap, admin handoff, or
  all-admin lockout.
- Confirmation that a current MongoDB backup/export path exists for affected
  user data, following the [database runbook](database.md).
- Planned verification window, deployment URL, and expected role outcome.

Record only sanitized evidence in Markdown. Acceptable examples:

- `Owner approved promotion of one existing credentials account to admin; identifier retained in password manager.`
- `Admin dashboard access succeeded after sign-out/sign-in; no username recorded.`
- `Non-admin denial still returned expected forbidden behavior after recovery.`

#### Verify A Current Admin Role

To verify an existing admin without changing data:

1. Confirm the account is owner-approved for admin verification and that any
   credential or OAuth secret stays in the approved private channel.
2. Sign in through the intended provider.
3. Confirm `/admin/dashboard/articles` is reachable.
4. Confirm a known non-admin account, if available, cannot reach the same admin
   route.
5. Record only the role expectation and outcome, not account identifiers or
   session details.

If the dashboard check fails but MongoDB shows `role: "admin"` for the approved
account, require sign-out/sign-in before treating it as a role persistence bug
because existing JWTs can contain the prior role.

#### First Production Admin

Preferred bootstrap path:

1. Owner creates or identifies one production account through the normal
   credentials or OAuth sign-in path.
2. An approved database operator connects to the production MongoDB environment
   through the managed provider console or an approved shell that already has
   `MONGO_URI` configured privately.
3. Operator confirms the account exists and there is no current usable admin.
   Do not paste query output containing usernames or emails into docs.
4. Operator updates only the approved account's `role` field to `"admin"`.
5. The account signs out and signs back in so NextAuth issues a JWT with
   `role: "admin"`.
6. Run the verification checklist below and record sanitized evidence.

Use exact account identifiers from the private approval channel or password
manager. Do not use partial-name guessing, public user data, or chat history as
the source of truth for the target account.

#### Routine Promotion Or Demotion

For planned admin handoff:

1. Confirm there is at least one other working admin before demoting or deleting
   an admin account.
2. Confirm the target account and requested role from an owner-approved private
   source.
3. Export or otherwise protect the affected user record before direct role
   edits.
4. Change only the `role` field.
5. Require the affected user to sign out and sign back in.
6. Verify admin and non-admin behavior.

Rollback for an incorrect promotion is to set the account back to
`role: "user"`, revoke active sessions by requiring sign-out or rotating
`NEXTAUTH_SECRET` when exposure risk justifies invalidating all sessions, then
rerun the non-admin denial checks.

#### All-Admin Lockout Recovery

Use emergency recovery only when no current admin can sign in or reach the admin
dashboard.

1. Treat the incident as at least an auth/admin incident under
   [incident-response.md](incident-response.md).
2. Get owner or orchestrator approval for the recovery operator, target account,
   and production environment.
3. Verify whether the failure is account-specific, OAuth-provider-wide,
   credentials-provider-wide, or deployment-wide before editing data.
4. If a known approved account exists, promote that account by setting only
   `role: "admin"` in MongoDB.
5. If no approved account exists, the owner must first create or approve an
   account through a private channel. Do not create credentials, set passwords,
   or store temporary secrets from this runbook.
6. Require sign-out/sign-in and run the verification checklist.
7. After recovery, open or update the runtime follow-up to prevent current-admin
   self-deletion and last-admin deletion.

#### Verification Checklist

After any admin role change:

- Credentials sign-in works for the approved account if credentials auth is in
  scope for that account.
- OAuth sign-in works for the approved provider if OAuth is in scope for that
  account.
- The recovered or promoted admin can reach `/admin/dashboard/articles`.
- A non-admin account is still redirected or forbidden from admin UI and admin
  APIs.
- After sign-out, `/account` and `/admin/dashboard/articles` require sign-in
  again.
- Deployment smoke evidence follows the
  [credentials smoke handling](deployment.md#credentials-smoke-handling) rules.

For direct API checks, capture only status, route, request time, deployment URL,
and request ID if present. Do not capture cookies, authorization headers,
browser storage, CSRF tokens, or raw session payloads.

#### Current Runtime Gap

This runbook documents operational recovery only. Runtime protections against
deleting the current admin account or deleting the last remaining admin account
are separate implementation work and must not be treated as solved by this
documentation.

## Manual Verification

- Anonymous user can access public pages.
- Anonymous user is redirected away from protected account/admin pages.
- Signed-in non-admin user can access account pages.
- Signed-in non-admin user cannot access admin pages or admin APIs.
- Admin user can access dashboard and admin APIs.
- Sign-out returns the user to a public route.

## Open Work

- Audit all protected routes against middleware matchers.
- Reduce production logging risk in middleware.
- Confirm OAuth redirect behavior for the production domain.
- Implement runtime protections against deleting the current admin account and
  deleting the last remaining admin account.
