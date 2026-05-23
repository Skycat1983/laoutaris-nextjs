# Monitoring And Error Reporting

This document defines the owner decision and implementation contract for
production monitoring and error reporting. It is provider-neutral by design:
no SDK, `instrumentation.ts`, alert automation, or Vercel project setting should
be added until the owner/platform decision is recorded.

## Current State

- The app has no monitoring or error-reporting dependency in `package.json`.
- There is no app-level `instrumentation.ts`.
- The only OpenTelemetry-related package evidence is Next.js optional peer
  metadata in `package-lock.json`; the app does not depend on or configure
  OpenTelemetry directly.
- The environment runbook does not define monitoring or alerting variables.
- T-099 through T-122 established the provider-neutral API request ID and
  structured redacted logging foundation for `src/app/api/v2` route handlers.
- T-116 added the incident-response runbook, including severity, triage,
  evidence, rollback, and `TBD` owner/escalation matrix placeholders.
- Deployment smoke remains evidence-based and manual/scripted through
  `npm run smoke:public`; it is not continuous monitoring.
- [ADR 0005](../decisions/0005-monitoring-provider-decision.md) records that no
  provider or no-provider interim launch policy is approved as of 2026-05-23.

## Required Capture Surfaces

The chosen provider or explicit no-provider launch policy must account for
these surfaces before production launch.

| Surface | Required behavior | Current integration point |
| --- | --- | --- |
| API route handlers | Capture internal failures with route, method, request ID, safe status category, and redacted metadata. Public `500`/alertable upstream responses should keep returning `requestId` and `X-Request-Id` where the route uses the T-099 pattern. | `src/lib/observability/requestContext.ts`, `src/lib/observability/logger.ts`, and `src/lib/api/apiResponse.ts`. |
| App Router server errors | Capture uncaught server render, loader, metadata, sitemap, and route segment errors without exposing raw messages to users. | Future provider task should evaluate Next.js `instrumentation.ts`, route segment error files, and server loader/service boundaries. |
| Client error boundaries | Report browser-render failures with route, component boundary where safe, browser metadata, and a public event/request identifier when available. | `src/app/error.tsx` and `src/components/modules/error/ErrorBoundary.tsx` need provider-neutral UX and reporting follow-up. |
| Unhandled client promise failures | Capture `unhandledrejection` events without dumping raw payloads, form bodies, cookies, tokens, or personal data. | Future provider client bootstrap after owner approval. |
| Shopify failures | Distinguish Storefront API outage, missing product, invalid stored link, rate/authorization failure, and local transform failure. Join alert evidence to request ID and product handle when safe. | Shopify clients and public shop routes. Keep token and customer data out of logs/events. |
| MongoDB failures | Distinguish connection, query, validation, write, transaction, and data-shape failures. Join alert evidence to request ID and entity class/count only when safe. | MongoDB helpers, server-only data services, API route adapters, and admin/user mutations. |
| Cloudinary failures | Distinguish signing, widget upload, delivery, transformation, allowlist, and missing/deleted asset failures. | `POST /api/v2/admin/sign-cloudinary-params`, upload widgets, and image delivery policy docs. |
| Build and deploy smoke evidence | Record deployment ID/URL, commit SHA, route/status failures, `x-vercel-id`, request IDs, and short redacted log excerpts. | Deployment runbook and `npm run smoke:public`; future automation remains a separate task. |
| Incident triage | Preserve event IDs, request IDs, deployment IDs, status categories, and provider status summaries in the incident timeline without raw secrets or personal data. | Incident-response runbook. |

## Request ID And Logging Contract

Provider integration must preserve the T-099 request-context contract.

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

Do not add concrete provider variables until a provider is approved. After
approval, update `docs/runbooks/environment.md` before or with code changes.

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

## Implementation Contract After Approval

The provider implementation task can proceed only after
[ADR 0005](../decisions/0005-monitoring-provider-decision.md) is replaced or
superseded by an accepted owner/platform decision that records the approved
provider or no-provider policy and environment contract. That task should:

1. Add the approved SDK or integration with the smallest runtime surface that
   satisfies the decision.
2. Add `instrumentation.ts` only if the chosen integration needs it.
3. Wire API route logging to the provider without breaking current request ID,
   response header, public body, and redaction contracts.
4. Add client and server error capture for the approved surfaces.
5. Add provider-specific environment variables to the environment runbook.
6. Add focused tests or source-hygiene checks for request IDs, redaction, and
   public error behavior.
7. Document alert routing and owner responsibilities in the incident-response
   runbook once real owners are approved.
8. Keep CI/scheduled smoke automation as a separate implementation task unless
   the owner decision explicitly combines it with provider rollout.

## No-Provider Interim Policy

If the owner explicitly chooses no provider for an interim launch, record that
decision in an ADR or task handoff with an expiry/review date. The minimum
interim operating posture should remain:

- T-099 request IDs and structured redacted API logs stay enabled.
- `npm run smoke:public` remains the deploy smoke baseline.
- The incident-response runbook remains the escalation and evidence contract.
- Manual Vercel log inspection remains required for production incidents.
- Provider selection, alert automation, client error capture, and owner matrix
  completion remain open production risks.
