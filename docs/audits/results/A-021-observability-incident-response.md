# A-021 Observability And Incident Response Result

Status: Completed

Audit goal: [A-021 Observability and incident response](../goals.md#a-021-observability-and-incident-response)

Workstream: [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md)

## Summary

The project has a useful deployment smoke and rollback checklist from T-025,
including public-route smoke automation, credential-smoke handling rules, and
targeted Vercel log evidence fields. It does not yet have production
observability. There is no application monitoring SDK, no `instrumentation.ts`,
no alerting configuration, no request or correlation ID policy, no structured
logger/redaction layer, and no incident-response runbook that names severity,
triage, escalation, communication, and post-incident ownership. Current failure
signals are still mostly Vercel logs plus scattered direct `console.error()`
calls.

No runtime code, shared findings register, shared risk tracker, or workstream
brief was changed by this audit. Shared tracker updates below are candidate
reconciliation notes for the orchestrator.

## Scope Inspected

- Required audit docs:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md#a-021-observability-and-incident-response`
  - `docs/workstreams/deployment-security-and-observability.md`
  - `docs/runbooks/deployment.md`
- Related operational context:
  - `docs/runbooks/environment.md`
  - `docs/risks/production-readiness.md`
  - `docs/audits/findings-register.md`
  - `docs/tasks/incident-2026-05-14-vercel-bcrypt-native-trace.md`
  - `docs/tasks/T-025-repeatable-vercel-smoke-checklist.md`
- Runtime and observability surfaces:
  - `package.json`
  - `package-lock.json`
  - `next.config.mjs`
  - `src/middleware.ts`
  - `src/app/error.tsx`
  - `src/components/modules/error/ErrorBoundary.tsx`
  - `src/lib/api/apiResponse.ts`
  - `src/lib/api/core/createFetcher.ts`
  - `src/lib/api/shopify/shopifyClient.ts`
  - `src/app/api/v2/**/route.ts`
  - `scripts/smoke-public-routes.mjs`
  - repository workflow/config locations excluding `node_modules`

## Current Controls

| Area | Current state | Audit disposition |
| --- | --- | --- |
| Deployment smoke | `docs/runbooks/deployment.md` defines a smoke evidence template, minimum route set, credential-smoke secret handling, targeted Vercel log checks, rollback triggers, and rollback evidence. `npm run smoke:public` is wired in `package.json`. | Good baseline for deploy verification, but it is not monitoring or alerting. |
| Public smoke automation | `scripts/smoke-public-routes.mjs` checks unauthenticated public statuses, optional detail records, auth shell pages, product not-found behavior, and unauthenticated admin denial. | Useful manual/CI building block; it intentionally skips credentials, admin dashboard access, page content, and Vercel logs. |
| Debug `console.log()` cleanup | `rg -n "console\\.log\\(" src` returns no matches, and the focused source-hygiene Jest test passes. | Good progress from T-088 through T-095. |
| Public-safe API response helpers | `src/lib/api/apiResponse.ts` provides typed success/list/error helpers, and many route slices now use stable public-safe `500` bodies. | Useful response-contract progress; it does not provide request IDs, structured internal logs, or alertable events. |
| Rollback documentation | Deployment runbook lists concrete rollback triggers and evidence fields. | Good trigger checklist; rollback authority and broader incident roles are still not assigned. |

## Commands Run

- `sed -n '1,220p' docs/README.md`: read canonical docs entry point.
- `sed -n '1,220p' docs/audits/README.md`: read audit workflow and shared-file ownership.
- `sed -n '1,260p' docs/audits/goals.md` and `sed -n '327,345p' docs/audits/goals.md`: read the A-021 goal and expected result file.
- `sed -n '1,260p' docs/workstreams/deployment-security-and-observability.md` and later progress-section reads: inspected deployment/security/observability facts, backlog, and prior logging cleanup.
- `sed -n '1,280p' docs/runbooks/deployment.md`: inspected smoke, targeted Vercel log, and rollback guidance.
- `sed -n '1,220p' docs/runbooks/environment.md`: checked whether monitoring or alerting environment variables are documented.
- `sed -n '1,260p' docs/risks/production-readiness.md`: checked current R-019/R-028 coverage.
- `rg -n "Sentry|sentry|datadog|newrelic|opentelemetry|otel|instrumentation|logger|pino|winston|logtail|axiom|posthog|analytics|monitor|alert|incident|rollback|smoke|VERCEL|console\\.(error|warn|info|debug|trace|log)" src scripts docs next.config.mjs package.json`: searched current observability, monitoring, incident, and console surfaces.
- `rg --files | rg '(^|/)(instrumentation|middleware|sentry|logger|logging|monitor|observability|telemetry|error|response|api-response|smoke|vercel)'`: checked likely observability file names.
- `find . -maxdepth 2 -type f \( -name 'vercel.json' -o -name '.env*' -o -name '.nvmrc' -o -name '.node-version' -o -name 'next.config.mjs' \) -print`: checked root deployment/config files without reading local `.env` contents.
- `find . -path './node_modules' -prune -o -path './.next' -prune -o -maxdepth 3 -type d \( -name '.github' -o -name '.vercel' \) -print`: confirmed no repo-owned GitHub Actions or Vercel metadata directories outside dependencies.
- `node -e "const p=require('./package.json'); ..."` and `nl -ba package.json`: inspected scripts and direct dependencies.
- `rg -n "@sentry|sentry|@vercel/analytics|@vercel/speed-insights|opentelemetry|newrelic|datadog|pino|winston|logtail|axiom|posthog" package-lock.json package.json`: checked package-level monitoring/logging SDK evidence. The only OpenTelemetry hit is Next's optional peer metadata in `package-lock.json`.
- `rg -n "SENTRY|NEXT_PUBLIC_SENTRY|VERCEL_ANALYTICS|OTEL|AXIOM|DATADOG|NEW_RELIC|POSTHOG|MONITOR|ALERT" docs/runbooks/environment.md package.json src scripts next.config.mjs`: found no monitoring/alerting env contract.
- `rg -n "requestId|correlation|x-request|trace|traceparent|span|error id|event id|structured" src docs scripts`: checked for request-correlation and structured logging policy.
- `rg -n "console\\.log\\(" src || true`: confirmed no direct source `console.log()` calls.
- `rg -n "console\\.error\\(" src | wc -l`: counted 136 direct source `console.error()` calls.
- `rg -n "console\\.warn\\(" src | wc -l`: counted 4 direct source `console.warn()` calls.
- `find src/app/api/v2 -name route.ts -print | wc -l`: counted 54 API route files.
- `rg -l "console\\.error\\(" src/app/api/v2 -g 'route.ts' | wc -l`: counted 51 API route files with direct `console.error()` calls.
- `rg -n "error\\.message|error\\.stack|JSON\\.stringify\\(error|message: error|error: error" src/app src/lib -g '*.ts' -g '*.tsx'`: checked remaining raw error-message and stack surfaces.
- `npm test -- --runTestsByPath __tests__/unit/security/consoleLogSourceHygiene.test.ts`: passed; confirms `src` stays free of direct or commented `console.log()` calls.
- `npm run smoke:public -- --help`: passed; confirms smoke script wiring and documented limitations.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Production monitoring and error reporting are not implemented. | `package.json` has no monitoring/error-reporting dependency, `rg --files` found no `instrumentation.ts`, Sentry, logger, monitoring, telemetry, or observability module, and monitoring env searches found no Sentry/Datadog/New Relic/Axiom/PostHog/Vercel Analytics contract. `src/components/modules/error/ErrorBoundary.tsx` only writes browser errors to `console.error()`. | Choose an error-reporting/monitoring approach for Next.js 14 on Vercel, document the owner and env variables, add server/client instrumentation, capture uncaught server errors, route-handler failures, client errors, and unhandled promise rejections, then add production alert rules. |
| High | There is no request or correlation ID policy, so Vercel logs, API errors, smoke evidence, and user reports cannot be reliably joined. | `rg` for `requestId`, `correlation`, `x-request`, `traceparent`, and related terms returned no runtime implementation. `src/lib/api/apiResponse.ts` returns error envelopes without an incident/request identifier. 51 of 54 API route files contain direct `console.error()` calls, but the logs are not normalized with route, method, request ID, user/admin context, or redacted metadata. | Add a small request-context/logger layer before broad monitoring rollout: generate or propagate a request ID in middleware/route helpers, include it in internal logs and public `500` responses, and define fields that are safe to log. |
| High | Incident response is only partially defined by deploy smoke and rollback checks; active incident ownership, severity, triage, escalation, and postmortem steps are missing. | `docs/runbooks/deployment.md` covers smoke evidence, targeted Vercel log checks, and rollback triggers, but there is no incident-response runbook in `docs/runbooks/`. The rollback section still says the owner or orchestrator must identify who has Vercel rollback permission before launch. Existing incident notes are task-specific, for example the 2026-05-14 bcrypt incident. | Create `docs/runbooks/incident-response.md` covering severity levels, intake signals, first responder, Vercel/DB/Shopify/Cloudinary access owners, rollback authority, communication rules, evidence retention/redaction, post-incident review, and how to open follow-up tasks. |
| Medium | Public error boundaries can expose raw runtime messages to users without reporting the failure anywhere. | `src/app/error.tsx:13` renders `{error.message}` directly in the global App Router error UI. There is no monitoring hook in that file. The custom `ErrorBoundary` only logs the browser `ErrorEvent` to the console and sets a fallback state. | Replace user-visible raw error messages with stable public copy, report the original error to the chosen monitoring sink with a safe event/request ID, and add a client-side `unhandledrejection` capture policy if the boundary remains. |
| Medium | Production logging and redaction remain inconsistent after `console.log()` cleanup. | Source hygiene now blocks `console.log()`, but `src` still has 136 direct `console.error()` calls and 4 direct `console.warn()` calls. `src/app/api/v2/public/blog/route.ts:38-42` logs the stack explicitly. `src/lib/api/core/createFetcher.ts:61-65` logs the caught error and returns `error.message` in a client-facing fetcher error. `src/lib/api/shopify/shopifyClient.ts` logs Shopify GraphQL errors directly. | Continue F-020/F-053 as a logging-policy task: centralize levels, redact request/user/provider data, keep expected failures out of error logs, prevent stack dumps unless explicitly gated, and standardize client-facing fallback messages. |
| Medium | Deployment smoke is repeatable but not continuous or complete enough to serve as monitoring. | `package.json:14` exposes `npm run smoke:public`, and the script help states it does not perform credentials sign-in, admin dashboard access, or Vercel log inspection. `docs/runbooks/deployment.md:161-169` documents the same limitations. No `.github` workflow or `.vercel` metadata exists outside `node_modules`, so the smoke script is not scheduled or gated by CI in this repo. | Decide whether public smoke should run in CI, on a schedule, or manually only. If automated, wire the public smoke against preview/production targets without secrets and keep credential/admin/log checks as owner-run production evidence until safe synthetic accounts and access are approved. |
| Medium | Alert ownership is undefined for external dependency failures. | The deployment runbook says `/shop/products` and product detail `5xx` failures are deployment-blocking unless confirmed as a Shopify outage, and targeted logs should check MongoDB, Shopify, auth, native-package, and missing-env failures. There is no owner matrix or alert routing for MongoDB, Shopify, Cloudinary, auth, Vercel runtime, or native-package failures. | Add an operator matrix to the incident runbook or deployment workstream that maps each service and failure type to owner, escalation channel, expected dashboard/log source, and rollback or defer criteria. |

## Findings Register Updates

- Not updated directly. This audit was scoped to the result file, and shared
  trackers are owned by the orchestrator or a reconciliation agent.
- Candidate reconciliation rows:

| Candidate severity | Area | Candidate finding |
| --- | --- | --- |
| High | Observability | Production monitoring and error reporting are not implemented for server, route-handler, client, and external-provider failures. |
| High | Observability/Logging | Request/correlation IDs and structured redacted logging are missing, leaving Vercel logs, user reports, smoke evidence, and API responses hard to connect. |
| High | Operations | Incident-response ownership, severity, triage, escalation, communication, and postmortem process are missing outside deploy-smoke rollback checks. |
| Medium | Operations | Public smoke checks are repeatable but not continuous and do not cover credentialed, admin, content, or Vercel-log verification without owner action. |
| Medium | Logging/Security | Direct `console.error()` and `console.warn()` calls need a production logging/redaction policy after the `console.log()` cleanup stream. |

## Risks Updated

- Not updated directly.
- Candidate updates:
  - Expand R-019 to mention the completed A-021 audit, the missing monitoring
    SDK/instrumentation, missing request IDs, missing incident-response runbook,
    and missing alert owner matrix.
  - R-028 can continue to track Vercel project-setting ownership and deployment
    smoke limitations; A-021 adds that smoke checks are not a substitute for
    continuous monitoring.

## Workstream Updates

- Not updated directly.
- Candidate backlog additions for
  [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md):
  - Choose and document an error-reporting/monitoring provider or explicit
    no-provider decision.
  - Add request ID propagation plus a structured redacted logger.
  - Create an incident-response runbook with rollback authority and alert owner
    matrix.
  - Decide CI/scheduled/manual ownership for `npm run smoke:public` and
    credentialed smoke evidence.

## Verification

- This was a documentation-only audit.
- `npm test -- --runTestsByPath __tests__/unit/security/consoleLogSourceHygiene.test.ts` passed.
- `npm run smoke:public -- --help` passed.
- No `npm run build` or full `npm run lint` was run because no runtime behavior
  changed.

## Completion Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Audit logging. | Direct console inventory, source-hygiene test, API route error-log counts, and logging helper/source reads are recorded above. | Complete |
| Audit error reporting. | Package/config/file searches found no monitoring SDK or instrumentation; error boundary and App Router error UI were inspected. | Complete |
| Audit monitoring. | Package/env/config searches found no monitoring contract; deployment smoke controls were inspected separately. | Complete |
| Audit alert ownership. | Deployment runbook, risk tracker, and workstream were inspected; owner matrix is missing and recorded as a finding. | Complete |
| Audit incident triage. | Deployment rollback guidance and bcrypt incident note were inspected; durable incident runbook is missing and recorded as a finding. | Complete |
| Audit rollback readiness. | T-025 deployment runbook rollback triggers and evidence fields were inspected and summarized as current controls. | Complete |
| Audit information operators need during production failures. | Smoke evidence template, targeted Vercel log fields, native-package capture fields, and missing request IDs/alert owner matrix were checked. | Complete |
| Expected output file. | This result file was updated with summary, scope, commands, findings, candidate tracker updates, verification, and next action. | Complete |

## Next Action

Reconcile A-021 into R-019 and the deployment workstream, then create the first
implementation task for request IDs plus a structured redacted logger. That
task should stay provider-neutral but leave a clean integration point for the
chosen monitoring/error-reporting service.
