# T-069 Remove Shared Fetcher Debug Logs

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove always-on debug logging from the shared API fetcher and server API URL
helper files while preserving current fetch behavior and same-app URL
construction.

## Context

- F-020 still tracks build, fetcher, DB, commerce, and SSR console noise after
  the middleware, Cloudinary upload, and public shop logging slices.
- `src/lib/api/core/createFetcher.ts` previously logged each fetch call, a partial
  stack trace, the final URL, and response status on every request.
- `src/lib/api/public/serverPublicApi.ts`,
  `src/lib/api/user/serverUserApi.ts`, and
  `src/lib/api/admin/serverAdminApi.ts` previously logged constructed base URLs and
  final URLs, and each keeps a commented URL-construction debug block.
- ADR 0004 says route-critical server loaders/actions should eventually move
  away from same-app HTTP, but this task is only a logging cleanup.

## Scope

In scope:

- Remove direct `console.log` debug output from:
  - `src/lib/api/core/createFetcher.ts`
  - `src/lib/api/public/serverPublicApi.ts`
  - `src/lib/api/user/serverUserApi.ts`
  - `src/lib/api/admin/serverAdminApi.ts`
- Remove stale commented URL-construction debug blocks from the three server API
  helper files.
- Preserve `createFetcher` request execution, header merging, JSON parsing,
  success return behavior, non-success `ApiErrorResponse` behavior, `isNextError`
  rethrow behavior, and existing fetch-error handling.
- Preserve current production/preview/local base URL construction in the server
  API helper files.
- Add or extend focused source hygiene coverage so direct fetcher/server API
  `console.log` debug output and stale commented URL debug blocks cannot return.
- Update this task, linked workstreams, findings, risks if needed, and
  orchestration state after completion.

Out of scope:

- Do not migrate any server loader, action, or API helper away from same-app
  HTTP. That remains a separate ADR 0004/F-021 architecture slice.
- Do not change base URL policy, hard-coded production domain behavior,
  `VERCEL_URL` handling, localhost fallback behavior, or Next `headers()` usage.
- Do not define or implement the global logging/redaction, monitoring, or
  request-correlation policy.
- Do not remove all `console.error` paths unless a specific touched error path
  is clearly debug-only and existing behavior remains covered.
- Do not edit fetcher operation inventories unless the implementation actually
  changes fetcher modules or supported operations.

## Files Likely Touched

- `src/lib/api/core/createFetcher.ts`
- `src/lib/api/public/serverPublicApi.ts`
- `src/lib/api/user/serverUserApi.ts`
- `src/lib/api/admin/serverAdminApi.ts`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a new focused
  source hygiene test
- `docs/tasks/T-069-remove-shared-fetcher-debug-logs.md`
- `docs/tasks/README.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- The touched shared fetcher and server API helper files contain no direct
  `console.log` calls.
- The stale commented URL-construction debug blocks are removed from the server
  API helper files.
- `createFetcher` still merges headers, executes `fetch`, parses JSON, returns
  successful envelopes, returns stable `ApiErrorResponse` objects for failed
  responses and fetch failures, and rethrows Next control-flow errors.
- Server public/user/admin API helpers still construct the same URLs for
  production, preview, and local environments.
- Focused source hygiene coverage fails if direct fetcher/server API
  `console.log` debugging or stale commented URL debug blocks return.

## Verification

Run:

```bash
rg -n "console\\.log|URL Construction Debug|Fetcher called|Final URL|📥 Response" src/lib/api/core/createFetcher.ts src/lib/api/public/serverPublicApi.ts src/lib/api/user/serverUserApi.ts src/lib/api/admin/serverAdminApi.ts
npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts
npm run lint
npm run build
git diff --check
```

The `rg` command is expected to return no matches. If the implementation adds a
new focused fetcher test, run it as part of the focused verification set.

## Handoff Notes

- Prepared 2026-05-16.
- Completed 2026-05-16.
- Removed direct `console.log` request/URL/response debug output from
  `createFetcher` and removed constructed/final URL logs plus stale commented
  URL debug blocks from the public, user, and admin server API helpers.
- Added focused `createFetcher` behavior coverage for header merging, request
  execution, JSON parsing, success envelopes, failed responses, fetch failures,
  and Next control-flow error rethrows.
- Extended source hygiene coverage so direct shared fetcher/server API helper
  `console.log` debugging and stale URL debug phrases cannot return.
- Verification passed:
  - `rg -n "console\\.log|URL Construction Debug|Fetcher called|Final URL|📥 Response" src/lib/api/core/createFetcher.ts src/lib/api/public/serverPublicApi.ts src/lib/api/user/serverUserApi.ts src/lib/api/admin/serverAdminApi.ts` returned no matches.
  - `npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts __tests__/unit/api/createFetcher.test.ts`
  - `npm run lint`
  - `npm run build`
  - `git diff --check`
- Build still emits previously tracked MongoDB/static-generation,
  branch-verification, and link console noise outside this task.
- Keep broader logging/redaction policy under F-020/F-053/R-019.
- Keep ADR 0004 same-app HTTP migrations, base URL policy, Next `headers()`
  migration, and request/correlation logging decisions separate.

## Escalate

Escalate to the orchestrator if:

- Removing the logs exposes an untested behavior dependency in the fetcher or
  server API URL helpers.
- A proper fix requires changing base URL construction, same-app HTTP usage, or
  Next `headers()` behavior.
- A proper fix requires deciding a global logging framework, redaction policy,
  or request-correlation policy.
