# T-013 Repair Sign-In Flow

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make the active sign-in UI submit credentials through one tested validation and
authentication path with accessible fields and user-visible errors.

## Why Now

A-016 found the current account navigation renders `SignInForm`, but the form
calls `signIn()` without passing username/email or password values. The backup
form also initializes a validation action but submits through a bare `signIn()`.
This blocks reliable credential auth testing and should be fixed before pruning
legacy auth/session code.

This task addresses:

- [F-058](../audits/findings-register.md): current sign-in UI bypasses the
  validation/auth action path and calls `signIn()` without field values.
- [F-062](../audits/findings-register.md): legacy auth controls need accessible
  labels.
- [R-002](../risks/production-readiness.md): auth/session cleanup remains open.
- [R-015](../risks/production-readiness.md): remaining input-flow validation
  gaps after T-010.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Auth runbook](../runbooks/auth.md)

## Scope

In scope:

- Choose one active credentials sign-in path for `SignInForm`: either
  `signIn("credentials", { ... })` with client-side field handling, or the
  existing server-action validation path if it can authenticate correctly in the
  current app.
- Pass the rendered form values to the chosen auth path.
- Show validation/auth errors to the user without exposing sensitive details.
- Add visible labels or equivalent accessible names for the credential fields
  and keep submit behavior keyboard accessible.
- Remove or clearly retire `SignInFormBackup` only if tests and imports confirm
  it is unused.
- Add focused tests for credentials success path wiring, validation errors, bad
  credentials/auth error display, and the sign-up modal switch where practical.
- Update this task, Auth/Admin, Frontend, Testing, findings, and risk notes
  after completion.

Out of scope:

- Do not redesign the account modal.
- Do not change OAuth provider behavior except to preserve it.
- Do not prune `/protected`, custom session helpers, or legacy auth files beyond
  `SignInFormBackup` unless the task explicitly proves they are unused and safe.
- Do not change registration behavior; T-009 already handled credential logs.

## Concurrency

You are not alone in the repo. Keep edits scoped to sign-in form components,
direct tests, and directly related docs. Avoid touching comment routes or
package files in this task.

## Acceptance Criteria

- The active sign-in form passes username/email and password values to one
  chosen auth path.
- Invalid input and bad credentials produce user-visible, non-sensitive errors.
- Inputs have accessible labels or names.
- Existing OAuth/session behavior is preserved.
- Focused tests cover the selected sign-in path.

## Outcome

Completed on 2026-05-14.

- Chose the existing username-based NextAuth credentials provider as the active
  path and kept OAuth provider configuration unchanged.
- Updated `SignInForm` to validate username/password with the shared credentials
  schema, call `signIn("credentials", { username, password, redirect: false })`,
  show field-level validation errors, show a generic bad-credentials error, and
  update the session after successful sign-in.
- Added visible labels/accessibility metadata to the credential fields and made
  the sign-in/sign-up modal switches keyboard-accessible buttons.
- Updated `SignUpForm` to switch back to the repaired `SignInForm` and removed
  the now-unused `SignInFormBackup`.
- Added `__tests__/unit/forms/SignInForm.test.tsx` covering accessible fields,
  validation errors, success wiring, bad credentials, and sign-up modal
  switching.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm run lint
```

Run `npm test` if auth/session helpers, NextAuth config, or shared test setup
are changed.

Verification run on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/forms/SignInForm.test.tsx`
  passed.
- `npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts`
  passed because the shared credentials schema used by `authorizeUser` changed.
- `npm run lint` passed.

## Escalate

Escalate to the orchestrator if:

- The owner wants username-based login to change to email-based login, or vice
  versa.
- The current NextAuth credentials provider contract conflicts with the form
  labels or validation path.
- Repairing the form requires broader auth/session pruning.
