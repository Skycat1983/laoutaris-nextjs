# T-125 Define Service Client Logging Policy

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Define the production logging and redaction policy for non-route services,
loaders, server actions, client components, utilities, and provider clients so
future `console.error()`/`console.warn()` cleanup can be split into safe
implementation tasks.

## Context

- T-099 through T-122 handled API-v2 route request IDs, structured redacted
  logging, and route-source hygiene.
- T-123 documented the provider-neutral monitoring/error-reporting plan.
- T-124 made unauthenticated public smoke CI-accessible.
- A-021/R-019 still track lower-level service/client logging policy and broader
  direct `console.error()`/`console.warn()` handling.
- A current non-route source search still finds direct `console.error()` and
  `console.warn()` calls in loaders, pages, server actions, components, helper
  utilities, Shopify clients, and data services.

## Scope

In scope:

- Inventory current non-route direct `console.error()` and `console.warn()`
  locations under `src`, excluding `src/app/api/v2` route handlers and the
  structured logger implementation.
- Create or update durable architecture documentation that defines:
  - allowed versus disallowed direct console usage by runtime surface;
  - redaction rules for user data, request data, provider data, and secrets;
  - how lower-level logs should relate to T-099 request IDs when a request
    context exists;
  - client/browser logging expectations before a monitoring provider is chosen;
  - migration categories for future implementation slices.
- Identify the first safe implementation slices, for example public loader/page
  logs, Shopify/provider client logs, admin dashboard UI logs, or server-action
  logs.
- Update related workstream, finding, risk, task, and orchestration docs.

Out of scope:

- Do not remove or rewrite the direct console calls in this task.
- Do not install or configure a monitoring provider.
- Do not change API-v2 route logging; T-122 already guards that surface.
- Do not change user-facing error UI or error boundary behavior unless a later
  implementation task is assigned.
- Do not add alert automation, credential/admin smoke, or Vercel log access.

## Likely Files

- `docs/architecture/logging-and-redaction.md`
- `docs/architecture/README.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/orchestration/state.md`
- `docs/tasks/T-125-define-service-client-logging-policy.md`

## Acceptance Criteria

- Documentation records the current non-route direct console inventory at a
  useful level of detail without pasting noisy raw command output.
- The policy distinguishes server-only services, server loaders/pages, server
  actions, browser/client components, utilities, and provider clients.
- Redaction and request-context expectations are clear enough for future
  implementation agents to migrate one slice at a time.
- The next code implementation slice is recommended without requiring an owner
  monitoring-provider decision.

## Verification

```bash
rg -n "console\\.error\\(|console\\.warn\\(" src --glob '!app/api/v2/**'
git diff --check
```

## Handoff Notes

- Planned on 2026-05-18 after T-124 completed unauthenticated public smoke
  workflow automation.
- Keep this as a policy and inventory task; implementation should be assigned
  as follow-up slices after the categories are documented.
- Completed on 2026-05-18 by adding
  [logging and redaction](../architecture/logging-and-redaction.md).
- The 2026-05-18 source inventory found 86 direct non-route
  `console.error()`/`console.warn()` calls across 66 files after excluding
  `src/app/api/v2/**` route handlers and the structured logger sink at
  `src/lib/observability/logger.ts`.
- The inventory is grouped by migration surface: admin dashboard clients,
  browser components/hooks, server loaders, provider/data services, App Router
  pages, utilities/helpers, server actions, shared fetcher, and session helper.
- Direct console use is now documented as disallowed for production runtime
  code outside the central structured logger sink, with explicit redaction
  rules for user data, request data, provider data, and secrets.
- Request-context expectations are documented: pass T-099 request IDs from API
  route contexts when available, but lower layers must not call Next request
  APIs only to create a request ID.
- The first recommended implementation slice is
  [T-126 Migrate Public Loader Page Logging](T-126-migrate-public-loader-page-logging.md).
- Verification passed with the required inventory search and `git diff
  --check`. No runtime code or monitoring provider configuration changed.
