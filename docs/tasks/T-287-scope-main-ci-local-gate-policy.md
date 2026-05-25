# T-287 Scope Main CI Local Gate Policy

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Decide the smallest safe repository-owned CI or release-gate policy for the
now-green local verification baseline without implementing the workflow yet.

## Context

T-286 made local verification repo-owned:

- `npm run typecheck`
- `npm run verify:local`

`npm run verify:local` passed under Node `22.14.0` / npm `10.9.2` and runs
typecheck, full Jest, production build, lint, and whitespace checks. F-123 and
F-125 are resolved for local gate ownership. F-126 remains open because the
repository still does not have a main CI workflow that runs the local gate, and
production smoke evidence remains partly owner/platform-blocked.

## Decision

Use a staged policy:

1. Add a repository-owned `Main CI` workflow in the next implementation task.
2. Keep production release evidence as a separate deployment checklist until
   owner/platform-blocked smoke, Vercel log, and monitoring decisions are
   answered.

A release-only checklist is not sufficient for F-126 because the local gate is
now green and repo-owned, but no CI workflow proves it on pull requests or
`main`. The public-smoke workflow should remain separate because it checks a
deployed unauthenticated base URL and depends on optional owner-provided
repository variables for detail coverage.

`npm run verify:local` is the right local handoff gate, but it is not CI-ready
as-is. Its command set is CI-appropriate, but the final `git diff --check`
checks the local working tree; on a clean GitHub Actions checkout it would not
prove whitespace in the pushed or pull-request commits. Main CI should run the
same substantive gates with an event-aware whitespace check.

The next implementation should add `.github/workflows/main-ci.yml` with:

- Triggers: `pull_request` targeting `main`, `push` to `main`, and
  `workflow_dispatch`.
- Permissions: `contents: read`.
- Concurrency: one run per ref or PR, with in-progress runs cancelled for the
  same branch/ref.
- Runtime: `ubuntu-latest`, `actions/setup-node@v4` with Node `22.14.0`, npm
  cache enabled, and log checks for `node -v` and `npm -v` expecting npm
  `10.9.2`.
- Install: `npm ci`.
- Gate commands, in order:
  `npm run typecheck`, `npm test`, `npm run build`, `npm run lint`, and an
  event-aware whitespace check over the PR/base or pushed commit range.
- Timeout: start with `timeout-minutes: 45` for the single job. Reduce later
  only after real Actions duration data is available.
- Cache policy: use the built-in npm cache from `actions/setup-node`; do not
  cache `.next` or Jest artifacts in the first workflow slice.
- Environment assumptions: no repository secrets or production variables.
  Restricted external access during CI build is acceptable regression evidence
  but does not replace release evidence for MongoDB, Shopify, Google Fonts, or
  dynamic sitemap coverage.

Main CI must not run `npm run smoke:public`, configure public-smoke variables,
add credentialed/admin smoke, inspect Vercel logs, install monitoring, or
change runtime behavior.

## Scope

In scope:

- Inspect `.github/workflows/public-smoke.yml`, `package.json`, testing and
  deployment runbooks, and current environment requirements.
- Decide whether the next implementation should add a GitHub Actions main CI
  workflow, a release-only checklist, or a staged policy.
- Define the exact command set, trigger policy, Node/npm setup, caching policy,
  timeout expectations, and environment assumptions for the next task.
- Keep intentional external-build evidence and owner-blocked smoke evidence
  separate from local gate CI.
- If implementation is appropriate, prepare a follow-up task brief with bounded
  files and verification.

Out of scope:

- Adding or editing CI workflow files.
- Configuring repository variables or secrets.
- Credentialed/admin smoke, Vercel log evidence, monitoring, alerts, or
  rollback automation.
- Changing application runtime behavior.

## Concurrency

Docs-only. Do not run in parallel with another agent editing CI workflows,
testing/deployment runbooks, findings, risks, or orchestration state.

## Files Likely Touched

- `docs/tasks/T-287-scope-main-ci-local-gate-policy.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/runbooks/testing.md`
- `docs/runbooks/deployment.md`
- `docs/orchestration/state.md`
- A follow-up task brief if implementation is selected

## Completion Contract

- Mark this task `Status: Completed` only after the next CI/release-gate policy
  is explicit.
- Update `docs/tasks/README.md` and relevant workstream docs.
- If a workflow implementation task is created, keep it separate and link it in
  the handoff notes.
- Do not edit `.github/workflows/` in this task.

## Acceptance Criteria

- The next step for F-126 local-gate CI ownership is clear.
- The policy explains whether `npm run verify:local` is CI-ready as-is or needs
  an adapted command.
- Owner-blocked public-smoke variables, credentialed smoke, Vercel evidence,
  and monitoring remain separate from the local gate decision.

## Verification

```bash
git diff --check
rg -n "verify:local|main CI|release gate|F-126" docs/tasks docs/workstreams docs/runbooks docs/orchestration/state.md
```

## Handoff Notes

- Planned after T-286 made the local verification baseline repo-owned and green.
- Completed 2026-05-25 as a docs-only policy decision.
- Selected a staged policy: implement a non-secret `Main CI` local-gate
  workflow next, while keeping external-access release evidence, deployed public
  smoke, credentialed/admin smoke, Vercel log checks, and monitoring/alerting
  separate.
- Prepared [T-288 Add main CI local gate workflow](T-288-add-main-ci-local-gate-workflow.md)
  as the bounded implementation follow-up.
- Verification:
  - `git diff --check` passed.
  - `rg -n "verify:local|main CI|release gate|F-126" docs/tasks docs/workstreams docs/runbooks docs/orchestration/state.md`
    passed and shows the policy/handoff references.
