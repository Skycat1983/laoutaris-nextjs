# T-023 Decouple Root Layout Auth From Bcrypt

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove `bcrypt` and credentials password verification from the normal public
page import path, so rendering `/` and other public routes does not depend on a
native bcrypt package load.

## Outcome

Completed on 2026-05-14.

- `src/lib/config/authOptions.ts` no longer imports
  `src/lib/actions/authenticateUser.ts` at module load. The credentials
  provider now dynamically imports `authorizeUser` only inside the credentials
  `authorize` callback.
- The root/session auth config can be imported for `getServerSession()` without
  importing `src/lib/helpers/bcrypt.ts` or loading the native `bcrypt` package.
- Credentials sign-in behavior remains on the existing
  `authorizeUser -> authenticateUsername -> verifyPassword` path once the
  credentials callback runs.
- Added
  `__tests__/unit/auth/authOptionsImportBoundary.test.tsx` to prove auth config
  import, lazy credentials authorize, and root layout public-shell rendering do
  not require bcrypt during normal public imports.
- Kept the `next.config.mjs` bcrypt prebuild tracing include as the deployment
  safety net until production redeploy smoke passes.

## Why Now

The 2026-05-14 Vercel incident proved that the root layout has production-scale
blast radius. `src/app/layout.tsx` imports `authOptions` and calls
`getServerSession(authOptions)` for every page. Before this task, `authOptions`
imported the credentials provider `authorizeUser`, which imported
`src/lib/helpers/bcrypt.ts` at module load. That made `/` load bcrypt in the
serverless function bundle even when no user was signing in.

The immediate incident fix includes bcrypt prebuilds through
`next.config.mjs` output-file tracing. This task reduces the blast radius so
public page rendering is not relying on that native packaging path.

This task addresses:

- [F-025](../audits/findings-register.md): root layout DB/session work forces
  global dynamic rendering and blocks route-specific ownership.
- [F-065](../audits/findings-register.md): native bcrypt install/build
  expectations still need explicit policy.
- [Incident 2026-05-14 Vercel bcrypt native trace](incident-2026-05-14-vercel-bcrypt-native-trace.md)
- [R-012](../risks/production-readiness.md): root layout session/data work
  still creates shared rendering risk.
- [R-017](../risks/production-readiness.md): native dependency deployment
  behavior needs runtime verification beyond unit tests.

## Read First

- [Incident 2026-05-14 Vercel bcrypt native trace](incident-2026-05-14-vercel-bcrypt-native-trace.md)
- [A-015 SSR and data-fetching strategy](../audits/results/A-015-ssr-data-fetching.md)
- [T-016 Upgrade bcrypt 6 compatibility](T-016-bcrypt-6-compatibility.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)

## Scope

In scope:

- Trace the current import chain from `src/app/layout.tsx` to
  `src/lib/helpers/bcrypt.ts`.
- Change the auth configuration so importing `authOptions` for session reads
  does not eagerly import the credentials authorize implementation or bcrypt.
  A likely small approach is to lazy-load `authorizeUser` inside the
  Credentials provider `authorize` callback.
- Preserve credentials sign-in behavior, OAuth providers, JWT/session
  callbacks, adapter behavior, and existing session shape.
- Keep the immediate `next.config.mjs` bcrypt tracing include until production
  smoke confirms the decoupling; do not remove that safety net in this task
  unless the owner/orchestrator explicitly approves.
- Add focused tests proving:
  - importing the root/session auth config does not import or require bcrypt;
  - credentials authorize still lazy-loads the password-verification path and
    works with existing focused auth tests;
  - root/public page rendering does not require bcrypt to load.
- Record production-oriented verification expectations for redeploy smoke:
  `GET /` and credentials sign-in.
- Update this task, the incident note, findings, risks, and workstream docs
  after completion.

Out of scope:

- Do not redesign NextAuth providers or session callbacks.
- Do not remove credentials login or change password hashing strategy.
- Do not remove root-layout `getServerSession` entirely unless the task proves a
  safe session-boundary replacement and updates affected UI.
- Do not solve Node/package-manager pins; F-064 owns that separate follow-up.
- Do not upgrade Next or change residual Next/PostCSS dependency handling.

## Concurrency

You are not alone in the repo. This task owns auth configuration import
boundaries, focused auth/root-layout tests, and directly related docs. Avoid
package edits, Next upgrades, admin route work, public search work, and broader
root-layout DB/session refactors unless required to prove this exact import
boundary.

## Acceptance Criteria

- Importing `authOptions` from the root layout path does not eagerly import
  `src/lib/helpers/bcrypt.ts` or load the native bcrypt package.
- Credentials sign-in still verifies existing bcrypt hashes through the lazy
  credentials path.
- Public root/page rendering has focused coverage that fails if bcrypt is
  required during a normal public render/import.
- The incident note records that output tracing is the immediate fix and this
  task is the blast-radius reduction follow-up.
- Verification commands and any production smoke requirement are recorded.

## Verification

Passed on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm run lint`
- `npm run build`
- `npm test`

Notes:

- The full Jest run passed with 31 suites and 224 tests. Existing date utility
  error-path console output remains expected test noise.
- The production build passed. Existing build-time MongoDB, fetcher, link, and
  root-layout debug output remains expected noise and is tracked separately by
  production logging work.

After deploy, smoke:

- `GET /`
- Credentials sign-in with a known test/admin account

## Escalate

Escalate to the orchestrator if:

- NextAuth requires eager provider imports that make lazy credentials loading
  unsafe.
- Removing bcrypt from the public import path requires a broader root-layout
  session architecture decision.
- Vercel still fails to load bcrypt after the tracing include and import-boundary
  change are both present.
