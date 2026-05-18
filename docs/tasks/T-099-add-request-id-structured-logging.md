# T-099 Add Request IDs And Structured Logging

Status: Completed

Workstream:
[Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a provider-neutral request/correlation ID and structured redacted logging
foundation for API failures, without choosing a monitoring vendor or migrating
every route in one task.

## Context

- A-021 found no monitoring SDK, no `instrumentation.ts`, no request/correlation
  ID policy, no structured logger/redaction layer, and no incident-response
  runbook.
- T-041 through T-095 removed direct/debug `console.log()` paths and many
  public-safe `500` bodies, but route-level `console.error()` and
  `console.warn()` policy remains open.
- `src/lib/api/apiResponse.ts` currently returns error envelopes without a
  public request or incident identifier.
- This task should create the logging/request ID pattern and prove it on a
  representative route slice. Broader route migration, monitoring provider
  wiring, alerting, and incident response remain separate.

## Scope

- In scope:
  - Add a small server-only request context utility that accepts a `NextRequest`
    or request-like headers, propagates a caller-provided `x-request-id` when
    safe, otherwise generates a request ID, and exposes response headers that
    include `X-Request-Id`.
  - Add a provider-neutral structured logger wrapper for server/API code with
    explicit safe fields and redaction rules for secrets, tokens, cookies,
    passwords, authorization headers, email addresses unless explicitly allowed,
    and raw exception stacks unless explicitly gated.
  - Extend shared API error response helpers to optionally include a public
    `requestId` and `X-Request-Id` response header for internal/upstream
    failures.
  - Migrate one representative public route, one representative protected user
    route, and one representative admin route to the new request ID/logger
    pattern. Prefer routes already using shared response helpers so the slice is
    focused.
  - Add focused tests for request ID generation/propagation, safe header
    handling, response helper `requestId` behavior, logger redaction, and the
    migrated route failure paths.
  - Update this task brief, deployment/security, data/API, and testing
    workstreams after completion.
- Out of scope:
  - Choosing or installing Sentry, Datadog, New Relic, Axiom, OpenTelemetry, or
    another monitoring provider.
  - Adding `instrumentation.ts`, alerts, dashboards, or production environment
    variables.
  - Migrating all API route files or replacing every direct `console.error()`.
  - Changing public success response contracts.
  - Changing auth, Shopify, Cloudinary, or database behavior beyond logging and
    public request identifiers.
  - Creating the incident-response runbook or owner matrix.

## Files Likely Touched

- `src/lib/api/apiResponse.ts`
- `src/lib/data/types/apiTypes.ts`
- `src/lib/observability/requestContext.ts`
- `src/lib/observability/logger.ts`
- One public API route already using shared helpers.
- One protected user API route already using shared helpers.
- One admin API route already using shared helpers.
- `__tests__/unit/observability/requestContext.test.ts`
- `__tests__/unit/observability/logger.test.ts`
- `__tests__/unit/observability/apiRequestIdRoutes.test.ts`
- `docs/tasks/T-099-add-request-id-structured-logging.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/data-models-and-api.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- API request IDs are generated when absent and propagated from a safe
  `x-request-id` header when present.
- Public internal/upstream failure responses in the migrated route slice include
  a stable `requestId` field and `X-Request-Id` response header.
- Structured logs include the request ID, route/method context, severity, and a
  public-safe error label without logging secrets, cookies, authorization
  headers, password material, raw request bodies, or ungated stack dumps.
- The migrated route slice preserves existing auth, validation, status, and
  success contracts.
- Focused tests lock request ID behavior, redaction behavior, and migrated route
  failure behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts __tests__/unit/observability/apiRequestIdRoutes.test.ts
npm run lint
npm run build
rg -n "requestId|X-Request-Id|structured" src/lib src/app/api/v2 __tests__/unit
git diff --check
```

## Handoff Notes

- Prepared after A-021 reconciliation as the first owner-independent
  observability implementation slice.
- Completed on 2026-05-18 by adding server-only request context and structured
  logger utilities, extending `apiErrorResponse()` with optional public
  `requestId`/`X-Request-Id` support, and migrating
  `GET /api/v2/public/navigation/collections`, `GET /api/v2/user/profile`, and
  `GET /api/v2/admin/collection/read` internal failure paths.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts __tests__/unit/observability/apiRequestIdRoutes.test.ts`,
  `npm run lint`, `npm run build`,
  `rg -n "requestId|X-Request-Id|structured" src/lib src/app/api/v2 __tests__/unit`,
  and `git diff --check`.
- Keep monitoring provider selection, incident-response runbook, alert owner
  matrix, CI/scheduled smoke, and broad route-level logging migration separate.
