# T-088 Remove MongoDB DB Helper Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove direct debug logging and stale commented connection examples from the
MongoDB helper layer without changing DB connection behavior, retry behavior, or
NextAuth adapter-created user defaults.

## Context

- F-020 tracks noisy debug output across tests, builds, SSR, DB, API, and
  commerce paths.
- T-041, T-067, T-068, T-069, T-076, T-077, and T-079 removed several focused
  debug-log slices, but verification handoffs still repeatedly report MongoDB
  connection/static-generation log noise.
- `src/lib/db/clientPromise.ts` logs environment and `MONGO_URI` existence at
  module load and logs every raw driver connection attempt.
- `src/lib/db/mongodb.ts` logs Mongoose connection attempts, retry delays,
  cached connection usage, and masked URI exhaustion details; it also retains
  stale commented old DB code and OAuth callback URL examples.
- `src/lib/db/connectWithRetry.ts` logs wrapper connection start/success/failure
  while rethrowing errors.
- `src/lib/db/adapter.ts` logs OAuth profile data and created user documents in
  `CustomMongoDBAdapter.createUser()`.

## Scope

In scope:

- Remove direct `console.log`, `console.info`, `console.debug`,
  `console.warn`, and direct `console.error` calls from:
  - `src/lib/db/mongodb.ts`
  - `src/lib/db/clientPromise.ts`
  - `src/lib/db/connectWithRetry.ts`
  - `src/lib/db/adapter.ts`
- Preserve existing Mongoose connection options, raw MongoDB driver options,
  retry counts, backoff timing, global client cache behavior, thrown errors, and
  `CustomMongoDBAdapter` user defaults.
- Remove stale commented old-code blocks and historical OAuth callback URL
  examples from `src/lib/db/mongodb.ts` if needed to keep source hygiene checks
  clear.
- Add or update focused source hygiene tests proving the DB helper files do not
  contain direct console calls, MongoDB URI existence debug strings, raw OAuth
  profile/user logging strings, or hard-coded OAuth callback URL examples.
- Update affected workstreams, findings, risks, and orchestration state after
  completion.

Out of scope:

- Do not introduce a production logging library, request correlation, monitoring,
  or alerting policy in this task.
- Do not change DB connection lifecycle, retry/backoff semantics, connection
  timeout values, pool settings, or cached global connection behavior.
- Do not change NextAuth providers, callbacks, session shape, OAuth callback
  configuration, or adapter-created user field defaults.
- Do not change route-level API error logging or non-DB component debug logs.
- Do not change build-time live MongoDB/static-generation coupling; this task
  only removes noisy direct DB helper logs.

## Files Likely Touched

- `src/lib/db/mongodb.ts`
- `src/lib/db/clientPromise.ts`
- `src/lib/db/connectWithRetry.ts`
- `src/lib/db/adapter.ts`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a focused DB
  source-hygiene test file
- `docs/orchestration/state.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- The four DB helper files listed in scope contain no direct `console.*` calls.
- `src/lib/db/mongodb.ts` no longer contains stale hard-coded OAuth callback URL
  examples or large commented old DB connection implementations.
- `dbConnect()` still returns early for an existing Mongoose connection, retries
  up to the existing maximum, waits with the existing backoff calculation, and
  throws the last connection error after exhaustion.
- `clientPromise` still uses the raw MongoDB driver options, development global
  cache, and production direct connection promise.
- `withDbConnect()` still awaits `dbConnect()` before calling the handler and
  rethrows failures.
- `CustomMongoDBAdapter.createUser()` still sets `username`, `role`,
  `watchlist`, `favourites`, `createdAt`, and `updatedAt`, and still delegates
  to the base adapter.
- Focused tests or source checks prove DB helper direct console/debug strings
  cannot return.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused DB source-hygiene tests>
npm run lint
npm run build
rg -n "console\\.|http://localhost:3000|api/auth/callback|MONGO_URI exists|Raw MongoDB|DB Connect called|Custom createUser|Custom user created" src/lib/db
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-087 retired the server-side same-app wrapper
  layer. Keep this task limited to DB helper source hygiene and noisy direct
  logging; broader production logging/redaction and build-time DB coupling stay
  separate.
- Completed on 2026-05-17: removed direct console calls from the scoped DB
  helper files, removed stale MongoDB connection and OAuth callback examples
  from `mongodb.ts`, preserved connection/retry/cache/adapter defaults, and
  added focused source hygiene plus DB helper behavior coverage. Verification
  passed with focused Jest, `npm run lint`, `npm run build`, the required
  `src/lib/db` source search, and `git diff --check`.
