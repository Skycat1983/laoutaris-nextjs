# T-263 Repair Immediate Verification Drift

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Repair the small stale verification failures found by A-032 and A-033 so the
next verification-gate audit can run against meaningful failures instead of
known-obsolete expectations.

## Context

- A-032 found `__tests__/unit/auth/authOptionsImportBoundary.test.tsx` still
  expects root layout global DB/session work, while current source intentionally
  removed global root-layout DB/session work.
- A-033 found `__tests__/unit/observability/apiRequestIdRoutes.test.ts` expects
  the old admin collection read error message `Failed to fetch article(s)` while
  the route returns `Failed to fetch collections`.
- A-033 also found `docs/runbooks/deployment.md` still lists retired same-app
  URL variables as minimum production values even though
  `docs/runbooks/environment.md` and current source classify them as not
  required.

## Scope

In scope:

- Update `authOptionsImportBoundary.test.tsx` to assert the current invariant:
  root layout renders without loading bcrypt and without requiring global
  DB/session work.
- Update `apiRequestIdRoutes.test.ts` to match the current admin collection read
  route error message while preserving request-ID behavior coverage.
- Reconcile the deployment runbook environment checklist with the environment
  runbook for `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and `VERCEL_URL`.

Out of scope:

- Adding monitoring providers, instrumentation, CI jobs, or new smoke scripts.
- Changing auth/session runtime behavior.
- Broad test refactors or full verification-gate audit work.

## Concurrency

This task can run in parallel with T-262, T-264, T-265, or T-266 because it owns
test/runbook drift only. Do not run it in parallel with another task editing the
same two test files or deployment runbook environment checklist.

## Files Likely Touched

- `__tests__/unit/auth/authOptionsImportBoundary.test.tsx`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `docs/runbooks/deployment.md`
- `docs/tasks/T-263-repair-immediate-verification-drift.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after focused tests and diff checks
  pass, or after environment failures are recorded.
- Update this task brief and `docs/tasks/README.md`.
- List any candidate shared tracker updates in handoff notes instead of editing
  findings/risk/workstream trackers.

## Acceptance Criteria

- The auth import-boundary test reflects the no-global-root-session/DB invariant.
- The observability request-ID route test reflects the current collection route
  error message.
- Deployment runbook minimum environment checklist no longer contradicts the
  environment runbook for retired URL variables.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/security/publicShellAuthBoundaries.test.ts
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts
git diff --check
```

## Handoff Notes

- Completed on 2026-05-25 from A-032 and A-033 verification drift findings.
- Updated `authOptionsImportBoundary.test.tsx` so the root layout shell test now
  asserts the current invariant: no bcrypt load and no global DB/session module
  load or calls.
- Updated `apiRequestIdRoutes.test.ts` to expect the current admin collection
  list failure message, `Failed to fetch collections`, while preserving
  request-ID and logging assertions.
- Reconciled the deployment runbook minimum environment checklist with the
  environment runbook by removing retired URL variables from required production
  configuration and documenting them as legacy/platform names.
- Candidate shared tracker update for the orchestrator: A-032 F-A032-002,
  A-033 A033-F5, and A-033 A033-F6 are now handled by T-263; no findings, risk,
  workstream, or orchestration tracker files were edited in this task.

## Verification Results

```bash
npm test -- --runTestsByPath __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/security/publicShellAuthBoundaries.test.ts
# Passed: 2 suites, 4 tests.

npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts
# Passed: 3 suites, 11 tests.

git diff --check
# Passed.
```

Both focused Jest commands emitted the existing Node `punycode` deprecation
warning.
