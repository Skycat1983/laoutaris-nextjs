# T-282 Run Post-Repair Verification Snapshot

Status: Completed

Workstream: [Testing and quality](../workstreams/testing-and-quality.md).

## Goal

Rebaseline the local verification gates after T-281 and any parallel build
coupling tasks complete.

## Context

A-027 and A-034 showed full Jest was not release-ready. T-275 restored explicit
TypeScript `noEmit`, T-276 fixed deterministic assertion drift, T-277 stabilized
admin full-run timeouts, and T-280 removed the public-smoke socket artifact. At
assignment time, the remaining known targeted failure was T-281's shop
import-boundary regression.

This task is a verification snapshot, not an implementation sweep.

## Scope

In scope:

- Run the current local verification gates under the pinned runtime where
  available.
- Record pass/fail results and classify any remaining failures into smaller
  follow-up tasks.
- Update this task brief, `docs/tasks/README.md`, and the testing workstream.
- Update orchestration state if this task changes the next recommended order.

Out of scope:

- Fixing newly discovered failures in the same task.
- Adding CI or release gates.
- Running browser automation unless a failure specifically requires it.

## Concurrency

Run after T-281. If T-283 or T-284 are already active, wait for them before
running `npm run build`; otherwise record that build coupling work remained
pending when the snapshot was taken.

## Files Likely Touched

- `docs/tasks/T-282-run-post-repair-verification-snapshot.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after commands are run or clearly
  blocked by environment constraints.
- Record exact command outcomes, including counts for full Jest if it runs.
- Create or propose follow-up task IDs for any remaining failures instead of
  expanding this task.

## Acceptance Criteria

- The orchestrator has a current answer for full Jest, explicit TypeScript,
  build, lint, and whitespace status.
- Remaining failures, if any, are separated into small next tasks.

## Verification

```bash
npm test
npm exec tsc -- --noEmit --pretty false --skipLibCheck
npm run build
npm run lint
git diff --check
```

If a command is unavailable or environment-blocked, record the exact blocker and
the strongest substitute command.

## Handoff Notes

- Planned after T-281 because broad verification should wait for the known
  import-boundary failure to be repaired.
- Completed on 2026-05-25 after T-281, T-283, and T-284 were all marked
  completed.
- The local shell initially reported Node `v21.2.0` and npm `10.2.3`, so all
  verification commands below were run through `nvm use 22.14.0`, which reported
  Node `v22.14.0` and npm `10.9.2`.
- The only red gate is explicit TypeScript `noEmit`, isolated to test-file
  `NODE_ENV` mutation typing in
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts`. Follow-up
  [T-285](T-285-fix-client-promise-node-env-typecheck.md) is prepared for that
  narrow repair.
- Production build no longer reports the T-281 shop import-boundary failure or
  the T-283/T-284 build-coupling failures.

Verification:

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm test
```

Passed: 198 suites, 1405 tests.

```text
Test Suites: 198 passed, 198 total
Tests:       1405 passed, 1405 total
Snapshots:   0 total
Time:        101.916 s
Ran all test suites.
```

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm exec tsc -- --noEmit --pretty false --skipLibCheck
```

Failed with two diagnostics:

```text
__tests__/unit/db/clientPromiseLazyConnection.test.ts(9,17): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
__tests__/unit/db/clientPromiseLazyConnection.test.ts(19,17): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
```

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm run build
```

Passed. The build compiled, completed type/lint validation, generated 50/50
static pages, and listed `/prototype/home` as dynamic.

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm run lint
```

Passed with `No ESLint warnings or errors`.

```bash
git diff --check
```

Passed with no whitespace-error output.
