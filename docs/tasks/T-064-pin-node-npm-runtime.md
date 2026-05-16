# T-064 Pin Node And Npm Runtime

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Resolve the first F-064 supply-chain control slice by committing a reproducible
Node/npm baseline and updating install/deploy docs to use lockfile-based
installs.

## Context

- F-064 tracks missing package-manager, Node runtime, CI, and dependency-update
  controls.
- A-019 found no `packageManager`, no `engines`, no `.nvmrc`, no
  `.node-version`, no `.npmrc`, and setup docs using `npm install`.
- T-015 recorded the local Next major preflight environment as Node `v22.14.0`
  and npm `10.9.2`.
- The current shell also reports Node `v22.14.0` and npm `10.9.2`.
- Current production dependency work must not be coupled to a Next major
  migration or the residual Next/PostCSS owner decision.

## Scope

In scope:

- Add a `packageManager` pin for npm in `package.json`.
- Add an `engines.node` policy in `package.json` that matches the committed
  runtime baseline and remains compatible with the current framework.
- Add root Node version control files used by common tooling, such as `.nvmrc`
  and `.node-version`.
- Add an npm policy file if useful for enforcing or documenting engine behavior.
- Keep `package-lock.json` root metadata consistent with `package.json`.
- Update setup, deployment, and testing/runbook docs so fresh installs use
  `npm ci` and package additions still use explicit npm package commands.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not add GitHub Actions, Dependabot, Renovate, or other dependency-update
  automation.
- Do not change application runtime code.
- Do not change dependency versions except lockfile metadata required by npm.
- Do not attempt the Next/PostCSS major migration or accept canary framework
  risk.
- Do not change Vercel project settings directly.

## Files Likely Touched

- `package.json`
- `package-lock.json`
- `.nvmrc`
- `.node-version`
- `.npmrc`
- `docs/runbooks/setup.md`
- `docs/runbooks/deployment.md`
- `docs/runbooks/testing.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The repo declares the npm package-manager version.
- The repo declares the Node runtime baseline in package metadata and root
  version files.
- Fresh install docs use `npm ci`.
- Package-addition docs, if added, distinguish dependency updates from fresh
  installs.
- Lockfile metadata is consistent after package metadata changes.
- CI/dependency-update automation and Next major migration remain separate.

## Verification

Run:

```bash
node -v
npm -v
npm ci --dry-run --ignore-scripts
npm test
npm run lint
npm run build
```

If any command fails for environment reasons, record the exact blocker and the
follow-up needed.

## Handoff Notes

- Completed 2026-05-16.
- Added `packageManager: "npm@10.9.2"` and a Node engine policy of
  `>=22.14.0 <23` to `package.json`.
- Added `.nvmrc`, `.node-version`, and `.npmrc`; npm now enforces the declared
  Node engine through `engine-strict=true`.
- Refreshed `package-lock.json` root metadata with the Node engine policy.
- Updated setup, deployment, and testing runbooks to use `npm ci` for clean
  installs and to keep dependency additions as explicit package-changing npm
  commands.
- CI/dependency-update automation, Vercel project settings, and the residual
  Next/PostCSS package decision remain separate follow-ups.

Verification completed:

```bash
node -v
npm -v
npm ci --dry-run --ignore-scripts
npm test
npm run lint
npm run build
```

Results: Node `v22.14.0`, npm `10.9.2`; install dry-run passed; Jest passed
with 56 suites and 512 tests; lint passed with no warnings or errors; build
passed. Existing verification noise remained: date utility expected error-path
console output in tests, Browserslist notice, Google Fonts retry messages,
MongoDB/static-generation logs, branch-verification logs, and fetcher debug
logs.

## Escalate

Escalate to the orchestrator if:

- The selected Node/npm baseline conflicts with current Next, Vercel, bcrypt,
  or local developer constraints.
- Enforcing engine policy breaks install verification in a way that needs an
  owner decision.
- CI/dependency automation or a Next package edit becomes necessary to finish
  this runtime pinning slice.
