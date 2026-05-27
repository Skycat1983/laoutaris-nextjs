# T-310 Implement Sentry Monitoring Baseline

Status: Completed

Workstreams:

- [Deployment, Security, And Observability](../workstreams/deployment-security-and-observability.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the first Sentry monitoring baseline for this Next.js app.

## Context

The owner approved Sentry on 2026-05-27. ADR 0005 now records Sentry as the
approved provider, replacing the previous blocked provider decision. This task
should implement the smallest useful error-reporting baseline without touching
Shopify dashboard data, Vercel privileged settings, credentialed smoke, public
smoke variables, alert webhooks, source-map upload, profiling, broad tracing, or
session replay.

## Scope

In scope:

- Verify the current official Sentry Next.js setup documentation before editing
  source.
- Add the Sentry SDK/configuration needed for the approved baseline.
- Add Next.js instrumentation/client/server config only where current Sentry
  docs require it.
- Capture server/runtime and browser/client errors with safe request/release/
  environment context where available.
- Preserve T-099 request ID behavior, public error bodies, headers, and
  redaction policy.
- Keep `sendDefaultPii` disabled unless a later owner/legal decision changes
  the policy.
- Update [environment runbook](../runbooks/environment.md) with Sentry variable
  names/classes and no values.
- Add focused tests or source-hygiene checks for configuration, redaction, and
  no secret exposure where practical.

Out of scope:

- Do not touch Shopify dashboard data, Shopify metadata, product options,
  checkout/cart, policy URLs, or product classification.
- Do not configure Vercel project settings or require Vercel log access.
- Do not add alert webhooks, source-map upload, profiling, broad tracing,
  session replay, uptime checks, credentialed smoke, public-smoke variables, or
  CI workflow changes unless a separate task scopes them.
- Do not record Sentry DSN values, auth tokens, organization IDs, project IDs,
  dashboard URLs, or screenshots in repo docs.
- Do not expose server-only secrets through `next.config.mjs` `env`.

## Concurrency

Do not run this in parallel with another task touching package files,
`next.config.mjs`, instrumentation files, environment runbook, global error
boundaries, or observability helpers. It can wait until the currently running
T-307/T-308/T-309 route tasks complete.

## Files Likely Touched

- `package.json`
- `package-lock.json`
- `next.config.mjs`
- Sentry/Next.js instrumentation files required by current docs
- `src/app/error.tsx` or route/global error surfaces only if scoped by current
  Sentry setup
- `src/lib/observability/*`
- `docs/runbooks/environment.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/tasks/T-310-implement-sentry-monitoring-baseline.md`

## Acceptance Criteria

- Sentry baseline is configured for approved server/runtime and browser/client
  error reporting.
- Environment variables are documented by name/classification only, with no
  secret values.
- Request IDs/redaction/public error contracts are preserved.
- Source maps, alert automation, session replay, profiling, broad tracing,
  uptime checks, Vercel settings, and Shopify dashboard work remain separate.

## Verification

```bash
npm run env:guard
npm run typecheck
npm test
npm run build
npm run lint
git diff --check
```

Use narrower focused tests first if the implementation can prove behavior
without the full suite, then run broader checks before handoff.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after owner approved Sentry.
- This task likely requires dependency installation and network access. If the
  sandbox blocks dependency download, request escalation for the install command
  rather than working around the approval flow.
- Completed on 2026-05-27. Installed `@sentry/nextjs`, added server/edge/browser
  Sentry initialization, Next instrumentation registration, App Router
  error-boundary capture, shared redaction helpers, structured logger forwarding
  to Sentry, and focused redaction/source-hygiene tests.
- Current Sentry Next.js setup was checked against the official manual setup
  docs before source edits:
  `https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/`.
- Baseline intentionally keeps `sendDefaultPii: false`, disables source-map
  upload, leaves tracing at `tracesSampleRate: 0`, and does not add replay,
  profiling, alert automation, uptime checks, Vercel project changes, CI
  workflow changes, credentialed smoke, public-smoke variables, or Shopify
  dashboard work.
- Verification:
  - `npm run env:guard` passed.
  - `npm test -- --runTestsByPath __tests__/unit/observability/logger.test.ts __tests__/unit/observability/sentryBaseline.test.ts`
    passed.
  - `npm run build` passed under Node `22.14.0`.
  - `npm run lint` passed.
  - `git diff --check` passed.
  - `npm run typecheck` failed only on unrelated untracked
    `__tests__/unit/components/PublicRouteBuilderConsumers.test.tsx:41` route
    builder fixture typing drift.
  - Full `npm test` ran 202 suites; T-310 focused tests passed, but the suite
    failed on unrelated `__tests__/unit/publicRouteCachePolicy.test.ts:147`
    expectation drift around `MainNavLoader` route constants.
