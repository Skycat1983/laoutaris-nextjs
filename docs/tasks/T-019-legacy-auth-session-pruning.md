# T-019 Prune Legacy Auth Session Path

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove or explicitly retire the stale custom login/session path and `/protected`
route now that the active NextAuth credentials sign-in flow is repaired and
tested.

## Why Now

A-004 and A-014 found a competing legacy auth/session chain and a stale
`/protected` App Router page with invalid redirect behavior. T-013 repaired the
active `SignInForm` and removed `SignInFormBackup`, which creates a safer point
to prune the remaining unused auth path in a focused task.

This task addresses:

- [F-032](../audits/findings-register.md): auth/session cleanup and stale
  `/protected` deletion need auth-owner confirmation before pruning.
- [R-002](../risks/production-readiness.md): stale auth/session paths,
  protected-route cleanup, admin guard migration, and bootstrap/recovery remain
  open.
- [R-011](../risks/production-readiness.md): superseded code paths can obscure
  production auth risk.

## Read First

- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [T-013 Repair sign-in flow](T-013-sign-in-flow-repair.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Auth runbook](../runbooks/auth.md)

## Scope

In scope:

- Search current imports and rendered routes for `LoginForm`, `processLogin`,
  the custom `src/lib/session/session.ts` helpers, `/protected`, and
  `PROTECTED_FRONTEND_ROUTES.PROTECTED`.
- Remove `LoginForm`, `processLogin`, stale custom session helpers, and related
  exports only where reference evidence proves they are unused by the active
  NextAuth path.
- Remove `src/app/protected/page.tsx` and the `/protected` frontend route
  constant if no documented owner workflow still depends on it.
- Keep `SignInForm`, NextAuth provider config, JWT/session callbacks, OAuth
  behavior, and the tested credentials authorize path intact.
- Update imports/barrel exports after pruning.
- Add focused static/import regression coverage or targeted tests where
  practical, and rerun the T-013 sign-in test to prove the active path still
  works.
- Update this task, Auth/Admin, Frontend, Testing, findings, and risk notes
  after completion.

Out of scope:

- Do not introduce shared admin API guards or migrate additional admin routes.
- Do not design admin bootstrap/recovery.
- Do not change OAuth provider behavior, credentials schema semantics, or the
  account modal UI beyond removing stale exports.
- Do not prune unrelated unused UI or package dependencies.

## Concurrency

You are not alone in the repo. Keep edits scoped to the legacy auth/session
path, `/protected`, route constants if applicable, focused tests, and directly
related docs. Avoid touching subscription validation, artwork list data access,
or package manifests.

## Acceptance Criteria

- The repo no longer exposes an unused competing custom login/session path, or
  any retained piece has a documented active owner and reason.
- `/protected` is removed if it is stale, or documented if intentionally kept.
- The active `SignInForm`/NextAuth credentials flow remains tested and
  unchanged in behavior.
- Import/reference searches show no broken references to removed files or
  constants.
- Focused tests or static guards cover the active sign-in path and any pruning
  regressions practical for this codebase.

## Outcome

Completed on 2026-05-14.

- Removed the unused `LoginForm` component and its user-form barrel export.
- Removed the legacy `processLogin` server action and moved its still-needed
  credential input types into the active `authenticateUser` module.
- Removed the custom JWT cookie helpers in `src/lib/session/session.ts` and the
  unreferenced duplicate/test-header session helpers; the active credentials
  flow remains the NextAuth path.
- Removed `src/app/protected/page.tsx` and the stale `PROTECTED` frontend route
  constant.
- Removed the unused email-login schema/validation branch that only served the
  pruned legacy action.
- Added focused route utility coverage proving the retired protected test route
  is no longer treated as protected.
- Left package cleanup out of scope; `jose` is now a dependency-pruning
  candidate for a package-focused task.

## Verification

```bash
rg "LoginForm|processLogin|PROTECTED_FRONTEND_ROUTES\\.PROTECTED|/protected" src __tests__
npm test -- --runTestsByPath __tests__/unit/forms/SignInForm.test.tsx
npm run lint
```

Run `npm test` if shared auth/session helpers, route constants, or test setup
are changed beyond the focused pruning.

Verification run on 2026-05-14:

- `rg "LoginForm|processLogin|PROTECTED_FRONTEND_ROUTES\\.PROTECTED|/protected" src __tests__`
  returned no matches.
- `rg "getAuthUser|getRoleFromSession|githubSession|getSessionController" src __tests__`
  returned no matches.
- `rg "from \"jose\"|from 'jose'|JWT_SECRET" src` returned no matches.
- `npm test -- --runTestsByPath __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/utils/routeUtils.test.ts __tests__/unit/auth/credentialsRoleSession.test.ts`
  passed.
- `npm run lint` passed.

## Escalate

Escalate to the orchestrator if:

- The owner confirms `/protected` is still a planned workflow.
- The custom session helpers are still required for a documented non-NextAuth
  authentication path.
- Pruning reveals active imports from NextAuth `authorize`, middleware, or
  route-guard code that require a broader auth architecture decision.
