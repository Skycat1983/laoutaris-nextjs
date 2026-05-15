# T-056 Align User Password OAuth Contract

Status: Ready

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Implement the remaining F-039 user password field-contract slice by aligning
persisted user types with OAuth-created users that do not have passwords, while
preserving credentials registration/login password requirements and public/own
user password sanitization.

## Why Now

T-053 created the field contract matrix, T-054 aligned article `section`, and
T-055 aligned blog `imageUrl`/`pinned`/`tags`. The remaining F-039 runtime
slice is user `password`: `UserModel` allows missing passwords for OAuth users,
but `UserBase.password` is typed as required and credentials authentication can
pass a missing stored hash into bcrypt verification.

This task addresses:

- [F-039](../audits/findings-register.md): required and optional field
  contracts disagree across Mongoose models, Zod schemas, and TypeScript types.
- [R-002](../risks/production-readiness.md): auth/admin hardening remains open
  beyond completed guard slices.
- [R-006](../risks/production-readiness.md): field contracts and transform
  outputs remain inconsistent.
- [R-015](../risks/production-readiness.md): input flows have residual
  validation and persistence gaps.

## Read First

- [Data field contracts](../architecture/data-field-contracts.md)
- [A-003 result](../audits/results/A-003-data-models-transforms.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- `src/lib/data/models/userModel.ts`
- `src/lib/data/schemas/userSchema.ts`
- `src/lib/db/adapter.ts`
- `src/lib/actions/registerUser.ts`
- `src/lib/actions/authenticateUser.ts`
- `src/lib/constants/publicDocumentConstants.ts`
- `src/lib/constants/ownDocumentConstants.ts`
- `src/lib/transforms/user/transformUser.ts`
- `src/lib/transforms/user/transformOwnUser.ts`
- `__tests__/unit/auth/credentialsRoleSession.test.ts`
- `__tests__/unit/auth/authOptionsImportBoundary.test.tsx`
- `__tests__/unit/transforms/publicTransformContracts.test.ts`
- `__tests__/unit/api/userProfileRoute.test.ts`

## Scope

In scope:

- Make the main persisted `UserBase.password` contract optional to match
  `UserModel` and OAuth adapter-created users.
- Preserve credentials registration and sign-in schemas requiring password
  strings at the form/credentials boundary.
- Preserve `registerUser()` behavior: credentials users still hash and persist
  a password.
- Harden credentials authentication so an existing user with no stored password
  hash is treated as invalid credentials before calling `verifyPassword()`.
- Preserve credentials role propagation for users with stored hashes.
- Preserve public and own user sanitization so password is never exposed in
  frontend DTOs.
- Add focused tests proving:
  - credentials users with hashes still authorize and propagate role,
  - OAuth-style users without `password` cannot authenticate through the
    credentials provider,
  - missing stored hashes do not call `verifyPassword()`,
  - public/own user sanitization still omits password where existing coverage
    applies.
- Update this task, the field contract doc if implementation clarifies any
  detail, workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not change OAuth adapter user creation fields beyond what is required to
  preserve current optional-password behavior.
- Do not add password reset, account linking, password setup for OAuth users, or
  visible account-settings UI.
- Do not change NextAuth provider configuration beyond credentials auth
  behavior needed for missing stored hashes.
- Do not change article or blog field contracts covered by T-054 and T-055.
- Do not add Shopify, Cloudinary, logging, or Next/PostCSS changes.
- Do not prune or redesign unused/stale user model files unless the build
  requires a local type alignment; document any candidate cleanup separately.

## Acceptance Criteria

- `UserBase.password` reflects that persisted users may lack a password.
- Credentials registration and login input validation still require passwords.
- Credentials auth returns `null`/invalid credentials for users without stored
  hashes and does not call bcrypt verification for missing hashes.
- Credentials auth still verifies stored hashes and propagates persisted roles.
- Public/own user DTO sanitization remains intact.
- No account-linking, password-reset, OAuth provider, Shopify, Cloudinary, or
  logging behavior is changed.

## Verification

Run:

```bash
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/transforms/publicTransformContracts.test.ts __tests__/unit/api/userProfileRoute.test.ts
npm run lint
npm run build
```

If a focused user model/type contract test is added, include it in the Jest
command and update this task's handoff notes.

## Handoff Notes

- Keep this as the user `password` credentials/OAuth contract slice only.
- Treat OAuth users without passwords as valid persisted users but invalid
  credentials login targets until a deliberate password setup/account-linking
  workflow exists.
- Treat existing dirty worktree changes as other agents' work unless they are
  required to complete this task.

## Escalate

Escalate to the orchestrator if:

- Missing stored-password behavior requires a product decision beyond returning
  invalid credentials.
- Aligning user types requires changing OAuth adapter semantics.
- Password setup, reset, account linking, or visible account-settings workflows
  are needed to complete the requested contract alignment.
