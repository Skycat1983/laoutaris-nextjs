# T-285 Fix Client Promise NODE_ENV Typecheck

Status: Completed

Workstream: [Testing and quality](../workstreams/testing-and-quality.md).

## Goal

Restore the explicit TypeScript `noEmit` gate after T-282 found a narrow
test-file `NODE_ENV` mutation typing regression.

## Context

T-282 rebaselined the local verification gates after T-281, T-283, and T-284.
Full Jest, production build, lint, and whitespace checks passed under the
pinned Node `22.14.0` / npm `10.9.2` runtime, but:

```text
__tests__/unit/db/clientPromiseLazyConnection.test.ts(9,17): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
__tests__/unit/db/clientPromiseLazyConnection.test.ts(19,17): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
```

The failing test was introduced for lazy MongoDB client behavior and mutates
`process.env.NODE_ENV` directly.

## Scope

In scope:

- Fix the test typing in
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts`.
- Preserve the lazy connection behavior assertions.
- Keep the production code behavior unchanged unless the test exposes a real
  runtime defect.
- Run the focused test and explicit TypeScript gate.

Out of scope:

- Adding a formal `typecheck` package script or CI/release gate.
- Reworking MongoDB client configuration beyond what the test typing requires.
- Broad verification rebaselining beyond proving this repair.

## Concurrency

Can run in parallel with docs-only or unrelated frontend tasks. This task owns
`__tests__/unit/db/clientPromiseLazyConnection.test.ts`; coordinate with any
agent editing that file.

## Files Likely Touched

- `__tests__/unit/db/clientPromiseLazyConnection.test.ts`
- `docs/tasks/T-285-fix-client-promise-node-env-typecheck.md`
- `docs/tasks/README.md`
- `docs/workstreams/testing-and-quality.md`

## Completion Contract

- Mark this task `Status: Completed` only after the focused test and explicit
  TypeScript command pass or a new blocker is recorded.
- Update `docs/tasks/README.md`.
- Update the testing workstream with exact verification results.
- Leave broad CI/release-gate decisions out of scope.

## Acceptance Criteria

- `npm exec tsc -- --noEmit --pretty false --skipLibCheck` passes under the
  pinned runtime.
- The client-promise lazy connection test still proves the raw MongoDB client is
  not instantiated or connected until `clientPromise` is awaited.

## Verification

```bash
source ~/.nvm/nvm.sh && nvm use 22.14.0
npm test -- --runTestsByPath __tests__/unit/db/clientPromiseLazyConnection.test.ts
npm exec tsc -- --noEmit --pretty false --skipLibCheck
git diff --check
```

## Handoff Notes

- Planned from T-282's post-repair verification snapshot.
- Completed on 2026-05-25 by replacing direct
  `process.env.NODE_ENV` assignments in
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts` with a test-local
  mutable env helper. Production code behavior was not changed.
- The lazy connection test still proves the raw MongoDB client constructor and
  `connect()` are not called until `clientPromise` is awaited, and repeated
  awaits reuse the same promise.
- Verification under Node `22.14.0` / npm `10.9.2`:
  - `npm test -- --runTestsByPath __tests__/unit/db/clientPromiseLazyConnection.test.ts`
    passed.
  - `npm exec tsc -- --noEmit --pretty false --skipLibCheck` passed.
  - `git diff --check` passed.
