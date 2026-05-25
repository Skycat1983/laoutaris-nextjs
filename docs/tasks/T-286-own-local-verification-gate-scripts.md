# T-286 Own Local Verification Gate Scripts

Status: Completed

Workstream: [Testing and quality](../workstreams/testing-and-quality.md).

## Goal

After T-285 restores explicit TypeScript `noEmit`, make the now-green local
verification gates repo-owned and discoverable instead of ad hoc handoff
commands.

## Context

T-282 rebaselined local verification after T-281, T-283, and T-284:

- `npm test` passed: 198 suites and 1,405 tests.
- `npm run build` passed under Node `22.14.0`.
- `npm run lint` passed.
- `git diff --check` passed.
- Explicit TypeScript failed only on the narrow T-285 test typing regression.

Once T-285 is complete, F-123 and F-125 should no longer remain framed as
unowned local verification blockers. F-126, repository-owned CI and full smoke
evidence, remains separate because public-smoke variables, credentialed smoke,
and Vercel/operator evidence are owner-blocked.

## Scope

In scope:

- Add a package script for explicit TypeScript checking, for example
  `typecheck`.
- Optionally add a local aggregate verification script if it stays small and
  uses existing commands.
- Update `docs/runbooks/testing.md` so the canonical local verification command
  set includes full Jest, explicit TypeScript, build, lint, and whitespace
  expectations.
- Update `docs/tasks/README.md`, this task brief, and the testing workstream.
- Update findings/risk wording for F-123/F-125 if the task proves those local
  gates are now owned.

Out of scope:

- Adding or changing GitHub Actions CI workflows.
- Scheduled public-smoke variables, credentialed smoke, Vercel log inspection,
  or owner-blocked production-ops implementation.
- Adding Playwright or browser automation.
- Changing application runtime behavior.

## Concurrency

Run after T-285. This task edits package scripts and shared testing docs, so do
not run it in parallel with another task editing `package.json`, testing
runbooks, findings, risks, or orchestration state.

## Files Likely Touched

- `package.json`
- `docs/runbooks/testing.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/tasks/T-286-own-local-verification-gate-scripts.md`
- `docs/tasks/README.md`
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after the owned verification commands
  pass under the pinned runtime.
- Update task index and testing workstream.
- Record whether F-123/F-125 are resolved, mitigated, or still open.
- Leave F-126/main CI workflow implementation as a separate follow-up unless a
  new task explicitly scopes it.

## Acceptance Criteria

- Developers and agents can run an explicit repo-owned typecheck command.
- The testing runbook names the current local verification baseline and runtime.
- The local gates added or documented by this task pass after T-285.
- Owner-blocked production smoke and privileged operations remain separate.

## Verification

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0
npm run typecheck
npm test
npm run build
npm run lint
git diff --check
```

If an aggregate verification script is added, run and record it too.

## Handoff Notes

- Planned after T-282 prepared T-285 as the last red local verification gate.
- Completed on 2026-05-25 by adding `npm run typecheck` for explicit
  TypeScript `noEmit` and `npm run verify:local` for the local aggregate gate.
- Updated the testing runbook, task index, testing workstream, findings
  register, production risk wording, and orchestration state. F-123 and F-125
  are now resolved for local gate ownership. F-126 remains separate for main CI,
  scheduled/detail public smoke, credentialed/admin smoke, Vercel log evidence,
  and other owner/platform-blocked production operations.
- Verification under Node `22.14.0` / npm `10.9.2`:
  - `npm run verify:local` passed. The aggregate ran `npm run typecheck`,
    full `npm test` with 198 suites and 1,405 tests passing, `npm run build`,
    `npm run lint`, and `git diff --check`.
  - The build passed in the default sandbox but still emitted expected MongoDB
    DNS/revalidation warnings while prerendering intentional external-data
    surfaces; release evidence still needs the external-access notes described
    in the testing runbook.
