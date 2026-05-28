# Monitoring And Error Reporting

This document defines the owner decision and implementation contract for
production monitoring and error reporting. Sentry is now the owner-approved
provider, and T-310 implemented the first scoped error-reporting baseline.
T-326 documents the first alert and public uptime routing contract. Source-map
upload, alert automation/dashboard mutation, profiling, replay, broad tracing,
uptime provider setup, and Vercel project settings remain separate
owner-approved tasks.

## Current State

- Sentry is approved as the monitoring provider by ADR 0005 on 2026-05-27.
- T-310 added `@sentry/nextjs`, `instrumentation.ts`,
  `instrumentation-client.ts`, `sentry.server.config.ts`, and
  `sentry.edge.config.ts`.
- T-310 config keeps `sendDefaultPii: false`, disables tracing with
  `tracesSampleRate: 0`, disables Sentry source-map upload in
  `next.config.mjs`, and does not configure replay, profiling, alerts,
  uptime checks, Vercel project settings, or Shopify dashboard work.
- T-326 documents Heron Laoutaris / `hlaoutaris@gmail.com` as the initial
  Sentry alert destination and Heron Laoutaris as the initial incident
  commander and rollback approver.
- T-326 recommends first Sentry alerting for production server/runtime, edge,
  and browser/client error events while keeping replay, profiling, broad
  tracing, source-map upload, provider webhooks, and sampling changes disabled.
- T-326 scopes future uptime checks to simple unauthenticated public-route
  availability checks only; credentialed/admin, mutation, provider-console, and
  private dashboard checks are out of scope.
- The only OpenTelemetry-related package evidence is Next.js optional peer
  metadata in `package-lock.json`; the app does not depend on or configure
  OpenTelemetry directly.
- The environment runbook defines Sentry variable names and classifications
  without values.
- T-099 through T-122 established the provider-neutral API request ID and
  structured redacted logging foundation for `src/app/api/v2` route handlers.
- T-310 routes structured logger `error` events to Sentry with already-redacted
  payload context and request ID, route, and method tags where available.
- `src/app/error.tsx` and `src/app/global-error.tsx` capture client/App Router
  render-boundary errors without changing the existing visible fallback copy.
- T-116 added the incident-response runbook, including severity, triage,
  evidence, rollback, and owner/escalation matrix placeholders. T-134 made the
  missing owner decisions explicit, and T-326 replaced the stale fully-blocked
  incident routing with the owner-approved initial Heron routing.
- Deployment smoke remains evidence-based and manual/scripted through
  `npm run smoke:public`; it is not continuous monitoring.
- [ADR 0005](../decisions/0005-monitoring-provider-decision.md) records Sentry
  as the approved provider. T-310 completed the first runtime implementation
  baseline; provider-dashboard alert and uptime setup remain separate.

## Required Capture Surfaces

The chosen provider or explicit no-provider launch policy must account for
these surfaces before production launch.

| Surface | Required behavior | Current integration point |
| --- | --- | --- |
| API route handlers | Capture internal failures with route, method, request ID, safe status category, and redacted metadata. Public `500`/alertable upstream responses should keep returning `requestId` and `X-Request-Id` where the route uses the T-099 pattern. | `src/lib/observability/requestContext.ts`, `src/lib/observability/logger.ts`, and `src/lib/api/apiResponse.ts`. |
| App Router server errors | Capture uncaught server render, loader, metadata, sitemap, and route segment errors without exposing raw messages to users. | T-310 added Sentry server/edge initialization through `instrumentation.ts`; broader per-surface normalization and alert routing remain future tasks. |
| Client error boundaries | Report browser-render failures with route, component boundary where safe, browser metadata, and a public event/request identifier when available. | T-310 captures `src/app/error.tsx` and `src/app/global-error.tsx` failures through Sentry. T-299 deleted the unused `src/components/modules/error/ErrorBoundary.tsx`; reintroduce a client-only boundary only through a scoped monitoring/provider task. |
| Unhandled client promise failures | Capture `unhandledrejection` events without dumping raw payloads, form bodies, cookies, tokens, or personal data. | Sentry browser initialization is present through `instrumentation-client.ts`; dedicated unhandled-rejection UX/evidence tests remain future work. |
| Shopify failures | Distinguish Storefront API outage, missing product, invalid stored link, rate/authorization failure, and local transform failure. Join alert evidence to request ID and product handle when safe. | Shopify clients and public shop routes. Keep token and customer data out of logs/events. |
| MongoDB failures | Distinguish connection, query, validation, write, transaction, and data-shape failures. Join alert evidence to request ID and entity class/count only when safe. | MongoDB helpers, server-only data services, API route adapters, and admin/user mutations. |
| Cloudinary failures | Distinguish signing, widget upload, delivery, transformation, allowlist, and missing/deleted asset failures. | `POST /api/v2/admin/sign-cloudinary-params`, upload widgets, and image delivery policy docs. |
| Build and deploy smoke evidence | Record deployment ID/URL, commit SHA, route/status failures, `x-vercel-id`, request IDs, and short redacted log excerpts. | Deployment runbook and `npm run smoke:public`; future automation remains a separate task. |
| Incident triage | Preserve event IDs, request IDs, deployment IDs, status categories, and provider status summaries in the incident timeline without raw secrets or personal data. | Incident-response runbook. |

## Request ID And Logging Contract

Sentry integration must preserve the T-099 request-context contract.

- Accept only safe inbound `X-Request-Id` values using the current
  `isSafeRequestId()` rules; generate a UUID when the inbound value is absent or
  unsafe.
- Keep `X-Request-Id` as the public correlation header for API failures that
  already expose it.
- Keep public `requestId` response fields for real `500` responses and other
  approved alertable failures where current route tests expect them.
- Attach request ID, route, method, event name, timestamp, status category, and
  safe provider metadata to monitoring events.
- Do not send authorization headers, cookies, passwords, password hashes,
  session tokens, CSRF tokens, OAuth tokens, Shopify tokens, Cloudinary API
  secrets, MongoDB URIs, raw request bodies, full provider logs, or customer
  personal data to the provider.
- Keep email redaction as the default. Any allowlist for email fields needs an
  explicit owner-approved use case and focused tests.
- Keep provider-specific event IDs separate from public request IDs. Public UI
  can show a safe request/event reference after approval, but it must not expose
  provider dashboard URLs or secret project identifiers.

## Provider Decision Checklist

The owner/platform decision should answer these questions before implementation.

- Provider choice: Sentry, Axiom, Datadog, New Relic, Vercel-native
  observability, another provider, or an explicit no-provider interim policy.
- Scope: error reporting only, logs only, traces/performance, uptime checks,
  frontend session replay, or a narrower launch baseline.
- Data boundary: what data may leave Vercel and where it is stored, including
  retention, region, privacy, and access expectations.
- Runtime coverage: Node.js serverless, App Router server components/routes,
  client browser errors, build/deploy events, and any edge/runtime constraints.
- Alert ownership: who receives SEV-1/SEV-2 alerts for Vercel, MongoDB,
  Shopify, Cloudinary, auth/OAuth, and DNS/domain failures.
- Access model: which maintainers may view dashboards, configure alerts, rotate
  keys, and silence noisy events.
- Cost and limits: expected event volume, sampling, retention, free-tier limits,
  and escalation path if the provider throttles or blocks events.
- Release tracking: whether commit SHA, Vercel deployment ID, environment, and
  source maps should be uploaded or attached.
- Source maps: whether browser source maps may be uploaded to the provider and
  how access is restricted.
- Smoke/uptime: whether provider checks replace, supplement, or alert on top of
  `npm run smoke:public`.
- Interim launch position: whether launch is blocked by provider install or can
  proceed with manual smoke plus incident runbook and request IDs.

## Environment Variable Rules

Do not add concrete Sentry variable values to the repo. Before or with code
changes, update `docs/runbooks/environment.md` with Sentry variable names,
purpose, classification, required environments, and rotation/configuration
guidance.

Classify provider variables this way:

| Variable type | Classification | Allowed exposure |
| --- | --- | --- |
| Server DSN, API key, ingest token, license key, or write token | Server-only secret unless the provider explicitly documents a public browser DSN model. | Server runtime/build only; never `NEXT_PUBLIC_*` unless approved as browser-safe. |
| Browser DSN or public client key | Public provider identifier; not a secret, but still environment-managed. | `NEXT_PUBLIC_*` only after the provider's browser model is documented. |
| Environment/release name | Non-secret deployment metadata. | Server and/or public only when needed for grouping events; values must not reveal secrets. |
| Source map upload token | Server-only CI/deployment secret. | CI/build environment only; never browser runtime or `next.config.mjs` `env`. |
| Sampling, debug, and enable flags | Non-secret configuration unless they include tokens or endpoints with secrets. | Prefer server-only by default; public only when browser behavior needs it. |
| Alert webhook URL | Secret. | Provider dashboard or server-side automation only; never public runtime. |

Provider variables must also follow the existing environment rules:

- Do not record secret values in repo docs or chat.
- Do not expose server-only values through `next.config.mjs` `env`.
- Do not use `NEXT_PUBLIC_*` for a variable unless the value is explicitly safe
  for browser bundles.
- Include purpose, classification, required environments, owner/status notes,
  and rotation/configuration guidance in the environment runbook.
- Run `npm run env:guard` after any `next.config.mjs` env change; provider
  variables containing `SECRET`, `TOKEN`, `PASSWORD`, or `PRIVATE_KEY` must stay
  blocked from client exposure.

## Completed Baseline And Remaining Contract

T-310 completed the first Sentry baseline after
[ADR 0005](../decisions/0005-monitoring-provider-decision.md) recorded the
approved provider:

1. Added the approved SDK and Sentry initialization files for server, edge, and
   browser runtime.
2. Added Next instrumentation registration and the current Sentry
   `onRequestError` hook export.
3. Wired structured logger `error` events to Sentry with redacted context while
   preserving request ID, response header, public body, and redaction contracts.
4. Added App Router client/global error boundary capture.
5. Added provider-specific environment variables to the environment runbook.
6. Added focused redaction, source-hygiene, and logger-to-Sentry tests.

Remaining follow-ups:

1. Configure the initial Sentry error alert policy in the provider dashboard
   using Heron Laoutaris / `hlaoutaris@gmail.com` as the destination, without
   enabling source-map upload, profiling, session replay, broad tracing,
   provider webhooks, or sampling changes.
2. Configure simple public uptime checks only after a separate
   owner-approved provider/dashboard task chooses provider, interval, threshold,
   region, and notification channel.
3. Keep source-map upload, profiling, session replay, broad tracing, uptime
   provider setup, CI/scheduled smoke changes, and Vercel project configuration
   separate unless a later owner-approved task scopes them.

## No-Provider Interim Policy

If the owner explicitly chooses no provider for an interim launch, record that
decision in an ADR or task handoff with an expiry/review date. The minimum
interim operating posture should remain:

- T-099 request IDs and structured redacted API logs stay enabled.
- `npm run smoke:public` remains the deploy smoke baseline.
- The incident-response runbook remains the escalation and evidence contract.
- Manual Vercel log inspection remains required for production incidents.
- Provider-dashboard alert setup, uptime checks, source-map upload, and backup
  operator assignment remain open production risks.
