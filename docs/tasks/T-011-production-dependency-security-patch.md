# T-011 Patch Production Dependency Security Baseline

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Patch the production dependency vulnerabilities found by A-019 without broad
major-version migrations.

## Why Now

A-019 found active production-tree advisories, including a critical direct
`next@14.2.5` exposure and high direct exposures in Cloudinary, Mongoose, and
`bcrypt`.

This task addresses:

- [F-063](../audits/findings-register.md): production dependency audit reports
  critical/high runtime vulnerabilities.
- [R-017](../risks/production-readiness.md): dependency and supply-chain risk is
  now a production blocker.

## Read First

- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Deployment runbook](../runbooks/deployment.md)

## Scope

In scope:

- Upgrade production dependencies on current major lines where possible:
  `next` to the latest safe Next 14 patch identified by A-019, `cloudinary`,
  `mongoose`, `next-auth`, `uuid`, and any root `postcss` exposure needed after
  the Next patch.
- Keep React, Next major, MongoDB major, Mongoose major, and Zod major
  migrations out of this task unless required for the security patch.
- Re-run `npm audit --omit=dev` and record remaining production advisories.
- Run focused smoke checks or targeted tests for auth, admin upload signing,
  public shop/product detail, and Mongo-backed route behavior if the package
  updates touch those paths.
- Update `package.json`, `package-lock.json`, this task, the deployment
  workstream, and risks with the exact versions and residual advisories.

Out of scope:

- Do not upgrade `bcrypt` to v6 unless the task explicitly expands to cover the
  semver-major native dependency and credential hashing compatibility checks.
- Do not remove unused dependencies; that belongs to a package-pruning task.
- Do not introduce CI, Dependabot/Renovate, Node pins, or `npm ci` docs unless
  the patch requires them.
- Do not chase dev-only advisories from Jest/jsdom in this task.

## Concurrency

You are not alone in the repo. This task owns `package.json` and
`package-lock.json` while running. Avoid concurrent package edits.

## Acceptance Criteria

- Production audit no longer reports the A-019 patchable current-major
  vulnerabilities, or residual advisories are explicitly documented with owner
  decision needed.
- Full verification baseline is run or failures are recorded with exact
  environment cause.
- No broad framework or runtime migration is introduced accidentally.

## Outcome

Completed on 2026-05-14.

Patched the A-019 current-major production dependency baseline without moving
React, Next, MongoDB, Mongoose, or Zod across major versions:

- `next`: `14.2.5` -> `14.2.35`
- `eslint-config-next`: `14.2.5` -> `14.2.35`
- `cloudinary`: `2.5.1` -> `2.10.0`
- `mongoose`: `8.9.5` -> `8.23.1`
- `next-auth`: `4.24.11` -> `4.24.14`
- `uuid`: `11.0.5` -> `11.1.1`
- root dev `postcss`: `8.4.39` -> `8.5.14`

The lockfile also refreshed safe transitive current-range patches for
`@babel/runtime`, `yaml`, `picomatch`, `minimatch`, and `brace-expansion`, and
added targeted npm `overrides` for the vulnerable `minimatch@3` ->
`brace-expansion` and `glob@10.3.10` paths. The `glob` override is scoped to
`@next/eslint-plugin-next` and `sucrase`; no global `glob` override was added.

`src/lib/utils/userUtils.ts` now imports Mongoose `ObjectId` as a type-only
dependency, and its unit test uses typed ObjectId test doubles. This keeps the
utility out of Mongoose runtime code and fixes the Jest ESM parse failure
introduced by the newer Mongoose/MongoDB dependency tree.

## Residual Production Advisories

`npm audit --omit=dev --json` now reports 5 production-tree advisories:
0 critical, 4 high, 1 moderate.

Residual owner decisions needed:

- `next@14.2.35` remains reported high by newer Next advisories; npm now lists
  `next@16.2.6` as the fix, which is a semver-major framework migration and is
  out of T-011 scope.
- `next/node_modules/postcss@8.4.31` remains reported moderate because it is
  bundled under Next; npm ties the fix to the same semver-major Next upgrade.
- `bcrypt@5.1.1` remains high through `@mapbox/node-pre-gyp` and `tar`; npm
  lists `bcrypt@6.0.0` as the fix, which is the out-of-scope native dependency
  and credential-hashing compatibility migration.

## Verification

```bash
npm audit --omit=dev
npm test
npm run lint
npm run build
```

If package installation or advisory lookup fails because of registry/network
access, request approval for the required npm command and record the outcome.

Verification run on 2026-05-14:

- `npm audit --omit=dev --json`: exits 1 with 5 residual production advisories
  documented above; no critical advisories remain.
- `npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/api/cloudinarySigningRoute.test.ts __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/data/getArtworkById.test.ts __tests__/unit/api/publicArtworkRoute.test.ts`:
  passed, 6 suites and 37 tests.
- `npm test`: passed, 18 suites and 157 tests. Existing noisy
  `punycode` deprecation warnings and expected date utility error logs remain.
- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed on Next `14.2.35`. The build still emits existing
  live MongoDB connection/debug fetcher logs, a `punycode` deprecation warning,
  and a Browserslist `caniuse-lite` freshness warning.

## Escalate

Escalate to the orchestrator if:

- A security fix requires a major migration.
- `bcrypt` remains the only high production advisory after current-major
  patches.
- Build/test failures appear unrelated to dependency updates.
