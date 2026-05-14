# T-014 Decide Residual Dependency Advisories

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Turn the residual T-011 production advisories into explicit owner decisions and
follow-up task scope before any major dependency migration starts.

## Why Now

T-011 removed the critical production audit exposure and patched current-major
dependencies, but `npm audit --omit=dev` still reports production advisories
that npm fixes only through major migrations:

- Next/PostCSS advisories tied to moving from Next 14 to Next 16.
- `bcrypt@5.1.1` exposure tied to `bcrypt@6.0.0`.

This task addresses:

- [F-063](../audits/findings-register.md): residual high runtime advisories need
  major-migration decisions.
- [R-017](../risks/production-readiness.md): dependency health remains open
  after T-011.
- [R-013](../risks/production-readiness.md): testing must stay reliable before
  framework/runtime migrations.

## Read First

- [T-011 Patch production dependency security baseline](T-011-production-dependency-security-patch.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)

## Scope

In scope:

- Re-run or inspect `npm audit --omit=dev --json` to confirm residual advisory
  package paths and fix availability.
- Decide whether to schedule a Next major migration now, defer it with an
  explicit accepted-risk note, or split a pre-migration audit first.
- Decide whether to schedule a focused `bcrypt@6` compatibility task now, defer
  it with an explicit accepted-risk note, or replace the native dependency with
  another credential-hashing strategy through an ADR.
- Update the deployment/security workstream and risk tracker with the chosen
  direction.
- Create follow-up task briefs or ADR stubs only for decisions that are accepted
  by the owner/orchestrator.

Out of scope:

- Do not perform the Next major migration in this task.
- Do not upgrade `bcrypt` in this task.
- Do not remove unused dependencies; F-034 needs a separate package-pruning
  task.
- Do not add CI/update automation; F-064 owns that follow-up.

## Concurrency

This is a decision/planning task. It may inspect package files and audit output,
but it should not edit `package.json` or `package-lock.json` unless explicitly
expanded by the orchestrator.

## Acceptance Criteria

- Residual production advisories are listed by package path, severity, and fix
  availability.
- Next major migration direction is documented as schedule, defer, or audit
  first.
- `bcrypt@6` direction is documented as schedule, defer, or alternate strategy.
- Risks and workstreams reflect the chosen direction.
- Any accepted follow-up implementation has a ready task brief.

## Outcome

Completed on 2026-05-14.

`npm audit --omit=dev --json` still exits 1 with 5 production-tree advisories:
0 critical, 4 high, 1 moderate. All reported fixes are semver-major package
migrations.

| Package path | Severity | Advisory path | npm fix availability |
| --- | --- | --- | --- |
| `node_modules/next` (`next@14.2.35`) | High | Direct `next` advisories, plus the nested PostCSS advisory effect. | `next@16.2.6`, semver-major. |
| `node_modules/next/node_modules/postcss` (`postcss@8.4.31`) | Moderate | Bundled under `next`; root `postcss@8.5.14` is not the vulnerable path. | `next@16.2.6`, semver-major. |
| `node_modules/bcrypt` (`bcrypt@5.1.1`) | High | Direct package affected through `@mapbox/node-pre-gyp`. | `bcrypt@6.0.0`, semver-major. |
| `node_modules/@mapbox/node-pre-gyp` (`1.0.11`) | High | Transitive dependency of `bcrypt`, affected through `tar`. | `bcrypt@6.0.0`, semver-major. |
| `node_modules/tar` (`6.2.1`) | High | Transitive dependency under `@mapbox/node-pre-gyp`. | `bcrypt@6.0.0`, semver-major. |

Decision:

- Next/PostCSS: split a pre-migration audit first. Do not start the Next major
  package edit until the app's Next 14 App Router, middleware, image optimizer,
  headers, React, Node runtime, lint, build, and test implications are
  inventoried. This is not an accepted-risk defer; production launch still
  needs either the migration or an explicit owner acceptance of the residual
  risk.
- `bcrypt`: schedule a focused `bcrypt@6.0.0` compatibility and verification
  task now. No alternate hashing-strategy ADR is needed yet because the local
  auth surface uses the normal `compare`, `genSalt`, and `hash` API through one
  helper, and `bcrypt@6.0.0` removes the vulnerable
  `@mapbox/node-pre-gyp`/`tar` path. The implementation task must still verify
  native install behavior, credential login/registration behavior, TypeScript
  types, audit output, and the existing credential-value log in the bcrypt
  helper.

Created accepted follow-up task briefs:

- [T-015 Audit Next Major Migration Preflight](T-015-next-major-migration-preflight.md)
- [T-016 Upgrade Bcrypt 6 Compatibility](T-016-bcrypt-6-compatibility.md)

## Verification

```bash
npm audit --omit=dev --json
```

No build/test run is required unless the task is expanded into package edits.

Verification run on 2026-05-14:

- `npm audit --omit=dev --json`: exits 1 with 5 residual production
  advisories, documented above.
- `npm ls bcrypt next postcss tar @mapbox/node-pre-gyp --omit=dev`: confirmed
  the vulnerable package paths are `next`'s nested `postcss` and
  `bcrypt -> @mapbox/node-pre-gyp -> tar`.
- `npm view next@16.2.6 engines peerDependencies dependencies --json`:
  confirmed the npm audit fix target requires Node `>=20.9.0`, supports React
  18.2+ or React 19 peer ranges, and remains a major framework migration.
- `npm view bcrypt@6.0.0 engines dependencies optionalDependencies --json`:
  confirmed the npm audit fix target requires Node `>= 18` and depends on
  `node-addon-api`/`node-gyp-build` instead of `@mapbox/node-pre-gyp`.
- No build/test run was required because this task did not edit package files
  or runtime code.

## Escalate

Escalate to the owner/orchestrator if:

- Production launch timing determines whether residual advisories can be
  temporarily accepted.
- Next major migration would conflict with the current Next.js 14 App Router
  architecture.
- Credential hashing strategy needs an irreversible decision.
