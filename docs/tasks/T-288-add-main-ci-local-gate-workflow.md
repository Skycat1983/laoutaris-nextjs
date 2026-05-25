# T-288 Add Main CI Local Gate Workflow

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Add the smallest safe GitHub Actions main CI workflow that proves the
repo-owned local verification baseline on pull requests and `main` pushes.

## Context

T-286 added the green local verification commands:

- `npm run typecheck`
- `npm run verify:local`

T-287 selected a staged policy: add non-secret main CI for the local gate, while
keeping release evidence, deployed public smoke, credentialed/admin smoke,
Vercel log checks, and monitoring separate. `npm run verify:local` should not
be run verbatim in CI because its `git diff --check` step only checks the clean
working tree after checkout. The CI workflow should run the same substantive
commands with an event-aware whitespace check over the pull-request or pushed
commit range.

## Scope

In scope:

- Add `.github/workflows/main-ci.yml`.
- Use Node `22.14.0`, npm `10.9.2`, `npm ci`, and npm dependency caching.
- Run `npm run typecheck`, full `npm test`, `npm run build`, `npm run lint`,
  and an event-aware whitespace check.
- Trigger on `pull_request` targeting `main`, `push` to `main`, and
  `workflow_dispatch`.
- Use `contents: read`, branch/ref concurrency, and a first-pass
  `timeout-minutes: 45`.
- Update this task, `docs/tasks/README.md`, and relevant workstream/runbook
  notes after implementation.

Out of scope:

- Running `npm run smoke:public` in main CI.
- Changing `.github/workflows/public-smoke.yml`.
- Configuring repository variables, secrets, credentialed/admin smoke, Vercel
  log inspection, monitoring, alerts, or rollback automation.
- Changing application runtime behavior.

## Concurrency

Do not run in parallel with another task editing `.github/workflows/`,
`package.json`, testing/deployment runbooks, workstreams, findings, risks, or
orchestration state.

## Files Likely Touched

- `.github/workflows/main-ci.yml`
- `docs/tasks/T-288-add-main-ci-local-gate-workflow.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/runbooks/testing.md`
- `docs/runbooks/deployment.md`
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after the workflow file is added and
  local verification below passes.
- Keep public smoke and owner/platform-blocked production operations separate.
- Record any expected CI limitations around restricted external access during
  `npm run build`.

## Acceptance Criteria

- A `Main CI` workflow exists and runs on PRs to `main`, pushes to `main`, and
  manual dispatch.
- The workflow runs the local gate command set with an event-aware whitespace
  check instead of relying on clean-checkout `git diff --check`.
- The workflow uses the pinned Node/npm baseline and `npm ci`.
- No secrets, production variables, public-smoke variables, credentialed smoke,
  Vercel operations, or monitoring setup are added.

## Verification

```bash
npm run verify:local
git diff --check
rg -n "Main CI|main-ci|verify:local|git diff --check" .github/workflows docs/tasks docs/workstreams docs/runbooks docs/orchestration/state.md
```

## Handoff Notes

- Completed on 2026-05-25.
- Added `.github/workflows/main-ci.yml` with `pull_request` to `main`, `push`
  to `main`, and `workflow_dispatch` triggers; `contents: read`; ref-scoped
  concurrency; Node `22.14.0`; npm `10.9.2`; `npm ci`; npm dependency caching;
  and `timeout-minutes: 45`.
- Main CI runs `npm run typecheck`, full `npm test`, `npm run build`, and
  `npm run lint` directly rather than invoking `npm run verify:local`.
- Whitespace checking is event-aware: pull requests compare PR base to the
  checked-out merge SHA, pushes compare `before` to the pushed SHA, new-branch
  pushes compare the empty tree to the pushed SHA, and manual dispatch checks
  `HEAD^` to the checked-out SHA when a parent exists.
- Main CI intentionally does not add secrets, production variables,
  `npm run smoke:public`, credentialed/admin smoke, Vercel log checks,
  monitoring, alerts, or rollback automation.
- Expected CI limitation: the `npm run build` step runs without production
  secrets or privileged external-release evidence. A green Main CI build is
  regression evidence only; production release handoffs still need the
  external-access build evidence and deployed smoke/log evidence in the
  deployment runbook.
- Verification passed:
  - `npm run verify:local` passed under the current working tree. It ran
    `npm run typecheck`, full Jest with 198 suites and 1,405 tests,
    `npm run build`, `npm run lint`, and `git diff --check`. Build completed
    with the expected restricted-network MongoDB revalidation warnings for the
    documented biography/collection external-data surfaces.
  - `git diff --check` passed.
  - `rg -n "Main CI|main-ci|verify:local|git diff --check" .github/workflows docs/tasks docs/workstreams docs/runbooks docs/orchestration/state.md`
    passed and confirmed the workflow/docs references.
  - YAML parse check passed for `.github/workflows/main-ci.yml`.
