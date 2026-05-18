# T-122 Lock API Route Logging Source Hygiene

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md),
[Auth Admin And Permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Add a durable source-hygiene guard proving current `src/app/api/v2` route
handlers stay free of direct route-level `console.error()` and
`console.warn()` calls after the T-117 through T-121 request ID and structured
logging migrations.

## Context

- T-099 introduced provider-neutral request IDs, request-context creation,
  structured redacted API logging, and optional `requestId` plus
  `X-Request-Id` response helper support.
- T-117 through T-121 migrated public, protected user, and admin API route
  internal-failure paths from direct route-level `console.error()` to the
  T-099 structured logger pattern.
- The current source search is clean for direct `console.error()` under
  `src/app/api/v2`, but coverage is split across scoped route lists that can
  miss newly added API route files.
- T-122 replaced those scoped lists with one recursive static test that scans
  current and future `src/app/api/v2/**/route.*` handler files for direct
  `console.error()` and `console.warn()` calls.
- Lower-level service, client, page, and component `console.error()`/
  `console.warn()` policy remains a separate observability task.

## Scope

In scope:

- Add or extend a focused static test that recursively scans `src/app/api/v2`
  route handler files and fails on direct `console.error(` or `console.warn(`
  usage.
- Keep the guard route-level and API-v2 scoped so existing lower-level service,
  client, page, component, utility, and logger implementation calls are not
  changed by this task.
- Preserve the existing scoped request ID behavior tests from T-117 through
  T-121.
- Run a confirming source search for `console.error(` and `console.warn(` under
  `src/app/api/v2`.
- Update this task brief and relevant workstream/finding/risk docs after
  completion.

Out of scope:

- Do not change runtime route behavior unless needed to satisfy the hygiene
  guard.
- Do not remove lower-level service, client, page, component, utility, or
  logger `console.error()`/`console.warn()` calls.
- Do not choose or integrate a monitoring/error-reporting provider.
- Do not add alert automation, scheduled smoke, or CI workflow changes.
- Do not fill incident-response owner matrix placeholders without owner input.

## Likely Files

- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `docs/tasks/T-122-lock-api-route-logging-source-hygiene.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/workstreams/auth-admin-and-permissions.md`
- `docs/orchestration/state.md`

## Acceptance Criteria

- A static test recursively covers current and future `src/app/api/v2` route
  handler files and rejects direct route-level `console.error(` and
  `console.warn(` calls.
- Existing focused request ID/structured logging route tests still pass.
- A source search confirms no direct `console.error(` or `console.warn(` calls
  remain under `src/app/api/v2`.
- Documentation records that the route-level API logging migration is guarded,
  while monitoring provider integration, alert automation, owner matrix
  completion, and lower-level service/client logging policy remain open.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts
npm run lint
npm run build
rg -n "console\\.error\\(|console\\.warn\\(" src/app/api/v2
git diff --check
```

Completed verification on 2026-05-18:

- `npm test -- --runTestsByPath __tests__/unit/observability/apiRequestIdRoutes.test.ts`
  passed; Jest emitted the existing Node `punycode` deprecation warning.
- `rg -n "console\\.error\\(|console\\.warn\\(" src/app/api/v2` returned no
  matches.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check` passed.

## Handoff Notes

- Planned on 2026-05-18 after T-121 completed the final scoped admin
  route-level migration.
- Keep this task limited to route-source invariants; it should not become the
  lower-level logging policy or monitoring provider integration task.
- Completed on 2026-05-18 by consolidating the scoped source-hygiene route lists
  in `__tests__/unit/observability/apiRequestIdRoutes.test.ts` into a recursive
  API-v2 route handler guard. Monitoring provider integration, alert
  automation, owner matrix completion, and lower-level service/client logging
  policy remain open.
