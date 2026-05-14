# T-006 Add Server-Only Next Config Env Guard

Status: Completed

Workstream:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Add an automated guard that fails if known server-only secrets are exposed
through `next.config.mjs` `env`, so T-001's `MONGO_URI` fix cannot regress.

## Why Now

T-001 removed the immediate `MONGO_URI` exposure, but R-027 remains open until
the repo has a repeatable check that prevents the same mistake from returning.
This task is a small deployment hardening slice and should stay separate from
the broader A-007 environment inventory.

It addresses:

- [F-046](../audits/findings-register.md): a server-only MongoDB connection
  string was exposed through Next config `env`.
- [R-027](../risks/production-readiness.md): server-only secrets can be exposed
  through Next config `env`.
- [A-007](../audits/results/A-007-deployment-environment.md): deployment audit
  recommendation to add a config lint/test check.
- [T-001](T-001-remove-mongo-uri-next-config.md): previous mitigation that
  removed `MONGO_URI` from `next.config.mjs`.

## Read First

- [Deployment workstream](../workstreams/deployment-security-and-observability.md)
- [Environment runbook](../runbooks/environment.md)
- [Deployment runbook](../runbooks/deployment.md)
- [A-007 deployment audit](../audits/results/A-007-deployment-environment.md)
- [T-001 Remove MONGO_URI from Next config](T-001-remove-mongo-uri-next-config.md)

## Scope

In scope:

- Add an automated check for `next.config.mjs` that rejects server-only env keys
  under the Next config `env` field.
- Include exact blocked keys for currently known server-only secrets:
  `MONGO_URI`, `MONGODB_URI`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `JWT_SECRET`,
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `CLOUDINARY_API_SECRET`, `GITHUB_SECRET`,
  and `GOOGLE_SECRET`.
- Include a conservative pattern check for future server-only names containing
  `SECRET`, `TOKEN`, `PASSWORD`, or `PRIVATE_KEY`, unless the name starts with
  `NEXT_PUBLIC_` and is explicitly allowed.
- Keep public variables out of this guard unless they are explicitly forbidden;
  do not treat all `NEXT_PUBLIC_*` values as secret by name alone.
- Wire the check into a repeatable command, preferably an npm script, so agents
  and future CI can run it.
- Consider running the guard before `next build` only if it does not create
  brittle side effects or require network/database access.
- Add focused coverage or a deterministic script self-check proving the guard
  fails for forbidden keys and passes the current config.
- Update environment/deployment docs and this task outcome after completion.

Out of scope:

- Do not complete the full A-007 environment inventory.
- Do not decide `JWT_SECRET`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`,
  `VERCEL_URL`, or Cloudinary upload preset ownership.
- Do not edit `.env` files or record secret values.
- Do not tighten CSP/CORS headers.
- Do not address build-time MongoDB/Google Fonts coupling.
- Do not refactor app runtime config consumers.

## Files Likely Touched

- `scripts/validate-next-config-env.mjs` or an equivalent focused guard
- `package.json`
- Optional focused tests under `__tests__/unit/`
- `next.config.mjs` only if the guard needs a small exported helper or comment
- `docs/tasks/T-006-server-only-next-config-env-guard.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/runbooks/environment.md`
- `docs/runbooks/deployment.md`
- `docs/risks/production-readiness.md`

## Concurrency

You are not alone in the repo. Keep edits scoped to the Next config env guard,
focused verification, and directly related docs. Do not combine this with the
Cloudinary/Vercel/auth environment inventory or header hardening.

## Acceptance Criteria

- The current `next.config.mjs` passes the guard.
- A config containing `env: { MONGO_URI: process.env.MONGO_URI }` fails the
  guard.
- Other known server-only secret names listed in scope fail the guard.
- Allowed public env names do not fail solely because they start with
  `NEXT_PUBLIC_`.
- A repeatable command exists for the guard and is documented.
- R-027 can be marked mitigated or closed only if the guard runs in a standard
  verification path and docs state how to use it.

## Verification

Run the narrowest relevant checks first, then the standard project checks:

```bash
npm run <new-env-guard-script>
npm test -- --runTestsByPath <new-or-updated-test-file>
npm test
npm run lint
npm run build
```

If `npm run build` surfaces the known live MongoDB or external network coupling,
record the exact output and reference R-024/F-019 instead of expanding this
task.

## Escalate

Escalate to the orchestrator if:

- The guard cannot import or inspect `next.config.mjs` without side effects.
- Adding the guard to `npm run build` changes build behavior unrelated to config
  validation.
- The implementation uncovers active `next.config.mjs` `env` usage that appears
  required by runtime code.
- Another agent is editing package scripts, Next config, or deployment docs
  concurrently.

## Outcome

Completed on 2026-05-14.

- Added `scripts/validate-next-config-env.mjs` to inspect `next.config.mjs`
  `env` and reject known server-only secret keys.
- Added a conservative secret-like name check for `SECRET`, `TOKEN`,
  `PASSWORD`, and `PRIVATE_KEY`; `NEXT_PUBLIC_*` names are allowed only when
  they do not match that secret-like pattern or are explicitly allowlisted in
  the guard.
- Added `npm run env:guard` and wired `npm run build` to run the guard before
  `next build`.
- Added focused Jest coverage for the current config, all blocked key names,
  future secret-like names, allowed public names, and non-allowlisted
  secret-like public names.
- Updated the environment and deployment runbooks with the repeatable guard
  command and build precheck behavior.

## Verification Results

- `npm run env:guard`: passed.
- `npm test -- --runTestsByPath __tests__/unit/validateNextConfigEnv.test.ts`:
  passed, 18 tests.
- `npm test`: passed, 13 suites and 137 tests. Existing invalid-date console
  errors from `dateUtils` tests still print.
- `npm run lint`: passed with no ESLint warnings or errors.
- `npm run build`: passed. The guard ran before `next build`; the build still
  prints the existing Browserslist warning and build-time MongoDB/debug logging
  covered by the deployment build-coupling risks.
