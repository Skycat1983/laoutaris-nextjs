# T-016 Upgrade Bcrypt 6 Compatibility

Status: Completed

Workstreams:
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Upgrade the credential-hashing dependency from `bcrypt@5.1.1` to
`bcrypt@6.0.0` and verify registration/login hashing behavior so the residual
`@mapbox/node-pre-gyp` and `tar` production advisories are removed.

## Outcome

Completed on 2026-05-14.

- Upgraded `bcrypt` and `@types/bcrypt` to `6.0.0`; `package-lock.json` now
  resolves bcrypt through `node-addon-api` and `node-gyp-build` instead of the
  vulnerable `@mapbox/node-pre-gyp`/`tar` path.
- Removed the direct credential-value log from `src/lib/helpers/bcrypt.ts`,
  typed the helper return values, and made malformed-hash compare failures
  resolve to `false` instead of returning a truthy error object.
- Added `__tests__/unit/auth/bcryptHelper.test.ts` for new hash creation,
  same-run verification, existing bcrypt hash compatibility, failed
  verification, malformed hashes, and no helper console logging.
- `npm audit --omit=dev --json` now reports only the residual `next` and nested
  `postcss` advisories owned by T-015; it no longer reports `bcrypt`,
  `@mapbox/node-pre-gyp`, or `tar`.

## Why Now

T-014 confirmed `npm audit --omit=dev --json` still reports high production
advisories through `bcrypt@5.1.1 -> @mapbox/node-pre-gyp@1.0.11 -> tar@6.2.1`.
npm reports `bcrypt@6.0.0` as the available fix. Local credential hashing goes
through `src/lib/helpers/bcrypt.ts`, which uses the standard `compare`,
`genSalt`, and `hash` APIs and is called by registration and credentials auth.

This task addresses:

- [F-063](../audits/findings-register.md): residual high runtime advisories need
  major-migration decisions.
- [R-017](../risks/production-readiness.md): dependency health remains open
  after T-011/T-014.
- [R-002](../risks/production-readiness.md): auth/session hardening remains
  open.

## Read First

- [T-014 Decide Residual Dependency Advisories](T-014-residual-dependency-advisory-decision.md)
- [T-011 Patch Production Dependency Security Baseline](T-011-production-dependency-security-patch.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Auth runbook](../runbooks/auth.md)

## Scope

In scope:

- Update `bcrypt` to `6.0.0` and refresh `package-lock.json`.
- Keep or remove `@types/bcrypt` based on TypeScript verification for the
  upgraded package.
- Verify that `src/lib/helpers/bcrypt.ts` still correctly hashes new passwords
  and verifies existing hashes created by bcrypt 5.
- Remove the direct credential-value logging from the bcrypt helper before
  running credential-flow verification.
- Add focused tests for hash creation, successful verification, failed
  verification, and no credential logging where practical.
- Run production audit verification and confirm the `bcrypt`,
  `@mapbox/node-pre-gyp`, and `tar` advisories no longer appear.
- Run focused auth tests plus lint, and broaden to full Jest/build if the
  package or helper changes affect shared auth behavior.

Out of scope:

- Do not change the credential hashing algorithm beyond the `bcrypt@6` package
  upgrade unless compatibility fails and the owner accepts an alternate strategy.
- Do not change sign-in UI behavior; T-013 owns the active sign-in form.
- Do not start the Next major migration; T-015 owns its preflight decision.
- Do not prune unused dependencies unrelated to the bcrypt path.

## Concurrency

This task owns `package.json`, `package-lock.json`, `src/lib/helpers/bcrypt.ts`,
and focused bcrypt/auth tests while running. Avoid concurrent package edits.

## Acceptance Criteria

- `npm audit --omit=dev --json` no longer reports `bcrypt`,
  `@mapbox/node-pre-gyp`, or `tar` production advisories.
- New bcrypt hashes can be generated and verified.
- Existing bcrypt 5 hashes remain verifiable.
- Credential values and password hashes are not logged by the helper.
- Focused auth/bcrypt tests and lint pass, with broader verification recorded if
  package or auth behavior warrants it.

## Verification

```bash
npm audit --omit=dev --json
npm ls bcrypt @mapbox/node-pre-gyp tar --omit=dev
npm test -- --runTestsByPath __tests__/unit/auth/bcryptHelper.test.ts __tests__/unit/auth/credentialsRoleSession.test.ts
npm run lint
npm test
npm run build
```

2026-05-14 verification:

- `npm audit --omit=dev --json` exited `1` with 2 remaining production
  vulnerabilities: `next` high and nested `postcss` moderate, both fixed by the
  T-015 Next major path. The bcrypt advisory path was absent.
- `npm ls bcrypt @mapbox/node-pre-gyp tar --omit=dev` exited `0` and showed
  only `bcrypt@6.0.0`.
- Focused auth/bcrypt tests passed: 2 suites, 11 tests.
- `npm run lint` passed with no ESLint warnings or errors.
- `npm test` passed: 21 suites, 179 tests. Existing date utility error-path
  console output remains.
- `npm run build` passed. Existing build-time MongoDB/fetcher/debug logs and
  the Browserslist update notice remain.

## Escalate

Escalate to the owner/orchestrator if:

- `bcrypt@6.0.0` cannot install on the intended production Node/runtime target.
- Existing hashes cannot be verified.
- The app should switch to a different password-hashing strategy instead of
  staying on bcrypt.
