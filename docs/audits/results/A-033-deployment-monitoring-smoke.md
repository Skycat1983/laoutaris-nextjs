# A-033 Deployment, Monitoring, And Smoke Snapshot

Status: Completed

Audit goal:
[A-033 Deployment, monitoring, and smoke snapshot](../goals.md#a-033-deployment-monitoring-and-smoke-snapshot).

Workstreams:
[Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md),
[Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Inspect deployment, monitoring/error-reporting, logging posture, public smoke
automation, credentialed smoke requirements, and incident ownership gaps without
changing runtime code or CI.

## Summary

The deployment, monitoring, and smoke baseline is materially better than the
older A-007/A-021 state, but it is not production-complete. Current source has a
provider-neutral request ID and structured redacted logging foundation, an
unauthenticated public smoke script, and a GitHub Actions public-smoke workflow.
The remaining launch gaps are concentrated around blocked owner/platform
decisions: no approved monitoring provider or no-provider launch policy, no
provider alerts or `instrumentation.ts`, no approved incident/Vercel operator
matrix, no approved credentialed smoke accounts, no Vercel log-access evidence,
and no configured scheduled public-smoke target in repo variables.

Two agent-actionable cleanup items were found during the audit: the deployment
runbook still names retired URL variables as minimum production values even
though the environment runbook and current source classify them as not required,
and one representative observability Jest test has a stale expected admin
collection error message.

## Scope Inspected

- A-033 assignment, audit workflow, result template, and linked workstreams.
- Deployment, environment, testing, and incident-response runbooks.
- Monitoring/error-reporting architecture, logging/redaction architecture, ADR
  0005, and production risk rows for deployment, monitoring, smoke, and
  verification.
- `package.json`, package-lock monitoring dependency search, `next.config.mjs`,
  `.github/workflows/public-smoke.yml`, `scripts/smoke-public-routes.mjs`,
  `scripts/validate-next-config-env.mjs`, middleware, request context, structured
  logger, API response helper, and focused observability/deployment tests.
- Source indicators for monitoring providers, `instrumentation.ts`, public
  smoke variables, active runtime environment variables, request IDs, direct
  console usage, and workflow coverage.

## Commands Run

- `git status --short` - passed; worktree already dirty with unrelated modified
  files and untracked `docs/audits/results/A-033-deployment-monitoring-smoke.md`.
- `rg -n "A-033|deployment monitoring|smoke snapshot|smoke" docs/audits/goals.md docs/README.md docs/audits/README.md docs/workstreams/README.md`
  - passed; located the A-033 assignment and linked result file.
- Targeted doc/source reads with `sed -n`, including
  `docs/audits/goals.md`, `docs/audits/README.md`,
  `docs/workstreams/deployment-security-and-observability.md`,
  `docs/workstreams/testing-and-quality.md`, `docs/runbooks/deployment.md`,
  `docs/runbooks/environment.md`, `docs/runbooks/incident-response.md`,
  `docs/architecture/monitoring-and-error-reporting.md`,
  `docs/architecture/logging-and-redaction.md`,
  `docs/decisions/0005-monitoring-provider-decision.md`,
  `docs/risks/production-readiness.md`, `package.json`, `next.config.mjs`,
  `.github/workflows/public-smoke.yml`, `scripts/smoke-public-routes.mjs`,
  `scripts/validate-next-config-env.mjs`,
  `src/lib/observability/logger.ts`,
  `src/lib/observability/requestContext.ts`,
  `src/lib/api/apiResponse.ts`, and focused tests - passed except one corrected
  typo read of missing `scripts/smoke-public.mjs`.
- `rg --files .github/workflows` - passed; only
  `.github/workflows/public-smoke.yml` is present.
- `rg --files | rg '(^|/)instrumentation\.(ts|js|tsx|jsx)$|sentry|axiom|datadog|newrelic|opentelemetry|otel'`
  - passed with no matches; no app `instrumentation.ts` or provider-named source
  file exists.
- `rg -n '"(@sentry|sentry|@axiomhq|axiom|datadog|newrelic|@opentelemetry|opentelemetry|vercel|analytics|speed-insights)' package-lock.json package.json`
  - passed; only Next package optional peer metadata references
  `@opentelemetry/api` in `package-lock.json`.
- `rg -n "process\.env\.[A-Z0-9_]+|process\.env\[[^\]]+\]" src scripts next.config.mjs package.json --glob '!node_modules/**'`
  - passed; active source/script variables match the environment runbook's
  runtime and smoke-script inventory.
- `npm run env:guard` - passed; `next.config.mjs` does not expose blocked
  server-only env names through Next config `env`.
- `npm run smoke:public -- --help` - passed; help output confirms the script is
  unauthenticated and does not perform credentials sign-in, admin dashboard
  access, or Vercel log inspection.
- `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts __tests__/unit/observability/apiRequestIdRoutes.test.ts __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
  - failed 1 of 21 tests; only
  `apiRequestIdRoutes.test.ts` expects the old admin collection message
  `Failed to fetch article(s)` while the current route returns
  `Failed to fetch collections`.
- `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts __tests__/unit/observability/requestContext.test.ts __tests__/unit/observability/logger.test.ts __tests__/unit/deployment/nextConfigSecurityHeaders.test.ts __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
  - passed 5 suites, 16 tests; Node emitted existing `punycode` deprecation
  warnings.
- Not run: production public smoke, credentialed smoke, Vercel log inspection,
  browser automation, screenshots, full `npm test`, `npm run build`, or
  `npm run lint`.

## Operations Matrix

| Area | Current behavior | Status | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- |
| Monitoring/instrumentation | No provider SDK, app `instrumentation.ts`, provider env contract, source-map/release tracking, dashboard, uptime check, or alert automation is installed or approved. Provider-neutral request IDs/logging exist as the current mitigation. | Partial; policy-blocked | `package.json` has no monitoring provider dependency; `rg --files` found no `instrumentation.ts` or provider-named source file; monitoring architecture and ADR 0005 explicitly block provider work until an owner/platform decision. | Owner/orchestrator must approve a provider, an explicit no-provider interim policy with review date, or launch-blocking posture before implementation. |
| Logging/redaction | API and selected server contexts use `createApiLogger()`/`createServerLogger()` with redaction and `X-Request-Id`; API-v2 route source hygiene blocks direct route-level `console.error()`/`console.warn()`. Logs still go only to platform console, not to provider-backed monitoring. | Partial; policy-blocked | `src/lib/observability/logger.ts`, `src/lib/observability/requestContext.ts`, `src/lib/api/apiResponse.ts`, `__tests__/unit/observability/logger.test.ts`, `requestContext.test.ts`, and `apiRequestIdRoutes.test.ts`; logging architecture records the approved console sink and no provider. | Preserve the redaction/request-ID contract; after provider approval, wire provider capture without exposing secrets, raw bodies, or personal data. |
| Public smoke | `npm run smoke:public` checks unauthenticated public routes, discovery endpoints, product not-found, sign-in/sign-out shells, and unauthenticated admin denial. GitHub Actions can run it manually with `base_url` and on a schedule only after `SMOKE_BASE_URL` is configured. Optional detail checks skip unless non-secret route variables are supplied. | Partial; owner-blocked | `package.json`, `scripts/smoke-public-routes.mjs`, `.github/workflows/public-smoke.yml`, deployment/testing runbooks, and passing `publicSmokeDiscoveryEndpoints.test.ts`. | Configure non-secret `SMOKE_BASE_URL` plus approved optional detail route variables, and keep the route list current as production records change. |
| Credentialed/admin smoke | Required outcomes are documented, but no repo script or workflow performs credentials sign-in, non-admin denial after login, admin dashboard access, or post-sign-out protected-route checks. Secrets must stay outside repo/chat/logs. | Incomplete; owner-blocked | Deployment runbook `Credentials Smoke Handling`; smoke CLI help explicitly excludes credentials sign-in and admin dashboard access; testing runbook says workflow is unauthenticated. | Owner must approve non-admin and admin smoke accounts through a private channel before any credentialed smoke can be run or automated safely. |
| Deployment env ownership | Active runtime and smoke-script variables are inventoried, and `npm run env:guard` passes. The deployment runbook still lists `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and `VERCEL_URL` as minimum production values even though the environment runbook classifies them as deprecated/platform/not required by current source. | Partial; agent-actionable | `docs/runbooks/environment.md` classifies the three URL names as not required by current source; `rg` found no active source use of those names outside docs/workflow variables; `docs/runbooks/deployment.md` still names them in the minimum checklist. | Reconcile the deployment runbook checklist with the environment runbook and current source evidence. |
| Incident roles/rollback | Incident severity, evidence, rollback/defer/mitigate rules, and redaction rules are documented. Every owner/escalation matrix row remains blocked pending owner/orchestrator approval, including Vercel log/rollback operator and backup. | Incomplete; owner/platform-blocked | `docs/runbooks/incident-response.md` owner matrix and blocked decisions; deployment rollback section requires an approved Vercel operator. | Owner/orchestrator must name role labels, people, team aliases, backups, access sources, and authority boundaries before production launch or privileged incident action. |

## Blocked Decisions

| Decision needed | Blocks | Evidence | Suggested owner prompt |
| --- | --- | --- | --- |
| Approve monitoring provider, explicit no-provider interim policy, or launch-blocking monitoring posture. | SDK installation, `instrumentation.ts`, provider env variables, source-map/release tracking, dashboards, uptime checks, alert automation, and launch readiness sign-off. | ADR 0005 status is `Blocked`; monitoring architecture says no provider work should proceed before owner/platform decision. | "Which monitoring posture is approved for launch: a named provider and scope, an explicit no-provider interim policy with review date, or launch blocked until provider setup is complete?" |
| Name incident commander, service owners, and backups. | Incident severity authority, provider checks, data restore, credential rotation, privacy/legal communication, and incident closure. | Incident-response owner matrix lists every role as blocked. | "Who owns incident command and each production surface, and who is the backup/escalation contact for each?" |
| Name Vercel deployment/log/rollback operator and backup. | Targeted Vercel log evidence, rollback execution, alias verification, and privileged deployment incident response. | Deployment rollback section and incident-response matrix require an approved Vercel operator. | "Who has Vercel project access and authority to inspect deployment logs, verify aliases, and trigger rollback when approved?" |
| Approve non-admin and admin smoke accounts plus private secret delivery path. | Credentials sign-in smoke, post-login non-admin denial, admin dashboard smoke, and sign-out/protected-route checks. | Deployment runbook forbids improvising with real user accounts and requires owner-approved smoke accounts outside repo/chat/docs. | "Can you approve dedicated non-admin and admin smoke accounts and provide credentials only through the password manager or another private channel?" |
| Configure public-smoke repository variables and approved route records. | Scheduled GitHub Actions public smoke and optional detail-route coverage. | Workflow skips scheduled runs without `SMOKE_BASE_URL`; deployment/testing runbooks say skipped optional detail checks are missing evidence. | "Which production or preview URL and public detail records should be configured as non-secret GitHub Actions variables for scheduled smoke?" |
| Resolve retired URL variable deployment checklist mismatch. | Clean deployment handoff and environment ownership evidence. | Deployment runbook still asks operators to confirm `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and `VERCEL_URL`; environment runbook says current source no longer requires them. | "Should the deployment checklist drop the retired URL names, or is there an external platform reason to keep documenting them?" |

## Findings

| Severity | Blocking class | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- |
| High | Policy-blocked | Production monitoring and alerting are not implemented and cannot be implemented safely until the owner/platform decision is recorded. | No provider dependency in `package.json`; no `instrumentation.ts`; ADR 0005 blocks provider SDKs, provider env vars, source maps, dashboards, uptime checks, and treating public smoke as approved no-provider monitoring. | Replace ADR 0005 with an accepted provider/no-provider/launch-blocking decision, then create a scoped provider implementation task. |
| High | Owner/platform-blocked | Incident response is documented, but operational authority is missing for every major production surface, including Vercel logs and rollback. | Incident-response owner matrix lists all owners as blocked; deployment runbook says rollback needs an approved Vercel operator and owner/orchestrator approval while blocked. | Owner/orchestrator should fill the owner matrix with approved role labels or named operators and backups before production launch. |
| High | Owner-blocked | Complete smoke evidence cannot be produced without approved smoke accounts and Vercel log access. | `npm run smoke:public -- --help` and deployment/testing runbooks say public smoke excludes credentials sign-in, admin dashboard access, and Vercel log inspection. | Approve non-admin/admin smoke accounts through a private channel and identify the Vercel log operator; keep raw credentials/logs out of repo docs. |
| Medium | Owner-blocked | Public smoke automation exists but scheduled coverage and detail-route proof depend on owner-provided non-secret configuration. | `.github/workflows/public-smoke.yml` skips scheduled runs without `SMOKE_BASE_URL`; script skips artwork, collection, blog, and product detail checks when matching `SMOKE_*` records are absent. | Configure `SMOKE_BASE_URL` and approved optional route variables in GitHub Actions repository variables. |
| Medium | Agent-actionable | Deployment runbook environment checklist is stale for retired same-app URL variables. | Environment runbook classifies `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and `VERCEL_URL` as deprecated/platform/not required by current source; deployment runbook still asks operators to confirm them as minimum production values. | Reconcile `docs/runbooks/deployment.md` with `docs/runbooks/environment.md` and the current source search. |
| Low | Agent-actionable | A focused observability regression test has a stale expected admin collection error message. | `apiRequestIdRoutes.test.ts` expects `Failed to fetch article(s)`, while `src/app/api/v2/admin/collection/read/route.ts` returns `Failed to fetch collections`; the focused Jest run failed only that assertion. | Update the test expectation and rerun the observability/deployment focused test set. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A033-F1 | High | Candidate | Monitoring provider/no-provider launch decision remains blocked, leaving no SDK, `instrumentation.ts`, source-map/release tracking, dashboard, uptime check, or alert automation. | R-019, deployment workstream, monitoring architecture, ADR replacement task. |
| A033-F2 | High | Candidate | Incident owner matrix and Vercel log/rollback authority remain blocked, so privileged production incident actions lack approved operators. | R-019/R-028, deployment workstream, incident-response runbook owner decision follow-up. |
| A033-F3 | High | Candidate | Complete production smoke evidence is blocked on owner-approved credentialed smoke accounts and Vercel log access. | R-019/R-028, deployment and testing workstreams. |
| A033-F4 | Medium | Candidate | GitHub Actions public smoke exists but scheduled/detail coverage is not complete until `SMOKE_BASE_URL` and approved optional route variables are configured. | R-028, testing workstream, deployment runbook. |
| A033-F5 | Medium | Candidate | Deployment runbook still lists retired URL variables as minimum production values despite environment runbook/source evidence that they are not current app requirements. | R-003/R-028, deployment workstream, deployment/environment runbooks. |
| A033-F6 | Low | Candidate | `__tests__/unit/observability/apiRequestIdRoutes.test.ts` has a stale admin collection error-message expectation. | Testing workstream; small test-maintenance task. |

## Risks Updated

- Candidate update for R-019: keep open; current snapshot confirms no provider
  or no-provider policy, no alerts, no `instrumentation.ts`, no source-map or
  release tracking, no completed owner matrix, no credentialed/admin smoke, and
  no Vercel log evidence path beyond manual owner/operator action.
- Candidate update for R-028: keep open; public smoke workflow exists, but
  scheduled runs require `SMOKE_BASE_URL`, optional detail coverage requires
  approved non-secret records, and Vercel log/rollback authority remains blocked.
- Candidate update for R-003/R-028: deployment runbook should stop naming
  retired same-app URL variables as minimum production values unless the owner
  records an external platform reason to keep them.
- Candidate update for R-005: add the stale observability test expectation as a
  small testing-quality cleanup item if not already covered by current work.

## Workstream Updates

- Candidate deployment workstream next action: reconcile
  `docs/runbooks/deployment.md` environment checklist with
  `docs/runbooks/environment.md` for `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and
  `VERCEL_URL`.
- Candidate deployment workstream backlog: obtain owner/platform monitoring
  decision replacing ADR 0005; do not implement provider code until that
  decision exists.
- Candidate deployment workstream backlog: record approved incident owners,
  Vercel log/rollback operator, and backups in the incident-response matrix.
- Candidate testing workstream backlog: configure scheduled public smoke
  repository variables once the owner approves the target URL and optional
  public detail records.
- Candidate testing workstream backlog: repair the stale
  `apiRequestIdRoutes.test.ts` admin collection expectation and rerun the
  focused observability/deployment test set.

## Next Action

Route A033-F5 and A033-F6 as the immediate agent-actionable follow-ups: update
the deployment runbook's retired URL variable checklist, then repair the stale
observability test expectation. Keep A033-F1 through A033-F4 blocked until the
owner/orchestrator supplies monitoring, incident-owner, Vercel-operator, smoke
account, and public-smoke repository-variable decisions.
