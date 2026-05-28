# Incident Response Runbook

Use this runbook for production failures, security or privacy concerns,
unexpected deploy behavior, and external-provider outages affecting the Joseph
Laoutaris archive, admin, auth, or shop/enquiry flows.

This runbook does not choose a monitoring provider or require production
credentials. It defines how operators classify, triage, escalate, collect
evidence, decide rollback, and create durable follow-up work.

## Severity Levels

Classify by user impact, data risk, and reversibility. If unsure, start at the
higher severity and downgrade after evidence confirms the scope.

| Severity | Use when | Examples | First response target |
| --- | --- | --- | --- |
| SEV-1 Critical | The public site, auth/admin boundary, data integrity, or privacy/security posture is actively at risk. | `GET /` or major public browse routes return repeatable `5xx`; non-admin access reaches admin UI or APIs; data deletion/corruption is suspected; credentials, cookies, tokens, customer data, or private owner data may be exposed; production points at the wrong deployment or environment. | Start triage immediately, notify owner/orchestrator, decide rollback or containment before feature debugging. |
| SEV-2 High | A production-critical workflow is unavailable or materially degraded without confirmed data exposure. | Credentials sign-in fails for all approved accounts; admin dashboard is unavailable; `/shop/products`, product detail, enquiry submission, MongoDB, Shopify, Cloudinary, or NextAuth/OAuth fails repeatedly; approved artwork/detail routes return `5xx`; deploy smoke fails on critical paths. | Triage promptly, collect targeted evidence, decide rollback, defer, or external-provider mitigation. |
| SEV-3 Medium | A scoped production feature is broken, degraded, or noisy but core browse/admin/security paths remain usable. | One article/blog/artwork detail fails because of one record; optional detail smoke record is stale; client error boundary trips on one route; request IDs/logs show repeated handled failures; Cloudinary image delivery is degraded for a subset of assets. | Triage during the active work window, mitigate or open a follow-up task, update smoke records if needed. |
| SEV-4 Low | Non-urgent operational or documentation issue with no active production impact. | Runbook ambiguity, missing owner placeholder, nonblocking warning, stale incident follow-up, manual smoke evidence formatting issue. | Track in the relevant task/workstream and fix through normal backlog flow. |

Treat privacy/security concerns as at least SEV-1 until the owner confirms no
secret, credential, personal data, cookie, token, or private admin data exposure.
Treat suspected data loss or destructive admin behavior as SEV-1 until backup,
restore, and affected-record scope are understood.

## Intake Sources

Incidents can start from any of these signals:

- Failed deployment smoke from the [deployment runbook](deployment.md).
- Owner, artist estate, admin, or user report.
- Vercel deployment/runtime logs for a specific deployment, function, route, or
  time window.
- API `requestId` response body fields or `X-Request-Id` headers from routes
  that use the T-099 request-context pattern.
- Browser/client error boundaries, console excerpts, or screenshots supplied by
  an operator.
- MongoDB connection, query, write, backup, or data consistency symptoms.
- Shopify Storefront API, product lookup, product detail, or enquiry-context
  symptoms.
- Cloudinary upload signing, upload widget, media delivery, or asset lifecycle
  symptoms.
- NextAuth credentials, OAuth provider, callback, session, or admin-role
  symptoms.
- DNS/domain, TLS, Vercel alias, or wrong-environment reports.

## First 15 Minutes

1. Open an incident note in the active task, orchestration handoff, or a new
   task brief. Use UTC timestamps.
2. Assign a severity using the table above and record the current classifier.
3. Identify the affected surface: public archive, admin, auth, shop/enquiry,
   database, media, deployment, dependency/runtime, privacy/security, or
   third-party provider.
4. Capture only targeted evidence:
   - URL path or API route.
   - HTTP status and method.
   - UTC timestamp and time zone of report.
   - Deployment URL or ID, commit SHA, and Vercel environment if known.
   - `requestId` or `X-Request-Id` when present.
   - `x-vercel-id` when present.
   - Short redacted log excerpt or owner-provided excerpt.
   - Provider status page or dashboard state summarized without secrets.
5. Reproduce with the narrowest safe check. Prefer `npm run smoke:public` for
   unauthenticated deployed route status and targeted route requests over broad
   browser traces.
6. Check deployment recency: compare the failing deployment, alias, environment,
   and commit with the expected release.
7. Decide whether the incident needs immediate containment:
   - Roll back a bad deployment.
   - Disable/defer a broken release path.
   - Treat as an external-provider outage and communicate the dependency state.
   - Escalate security/privacy/data-loss risk to the owner before further
     debugging.

Do not collect traces, full DOM snapshots, full raw provider logs, database
dumps, cookies, credentials, OAuth tokens, session tokens, CSRF tokens, password
reset links, or screenshots containing secret values.

## Triage Checklist

Use the smallest relevant slice.

| Surface | Checks | Evidence to keep |
| --- | --- | --- |
| Public site outage | Run the public smoke helper against production; request `GET /`, `/artwork`, `/collections`, `/blog`, `/shop/products`, `/robots.txt`, and `/sitemap.xml`; inspect deployment-specific Vercel logs for the same UTC window. | Statuses, failed paths, deployment ID/URL, commit SHA, `x-vercel-id`, short redacted log excerpt. |
| Admin/auth regression | Check `/api/auth/signin`, `/api/auth/signout`, credentials smoke if an owner-approved smoke account exists, non-admin denial, and admin dashboard access using the deployment runbook rules. | Outcome wording only, role expectation, request IDs if present, no usernames/emails/passwords/cookies/tokens. |
| Commerce/enquiry disruption | Check `/shop/products`, approved product detail, known missing product `404`, enquiry form/report path, Shopify Storefront API symptoms, and MongoDB enquiry persistence symptoms if available. | Product handle or route, status, request ID, Shopify error category, no customer personal data dump. |
| MongoDB/data-loss risk | Stop destructive or write-heavy actions if corruption is suspected; identify affected collection/entity class; check whether failures are read, write, connection, validation, or migration related. | Entity type, count estimate if safe, operation type, redacted error label, backup/restore question list. |
| Cloudinary/media issue | Check whether failures are upload signing, admin widget upload, transformed delivery, allowlisted host, or missing/deleted asset related. | Public asset URL path only if safe, route/admin action, Cloudinary error category, no API secret or signed params. |
| Privacy/security concern | Preserve the report, stop further exposure where possible, avoid sharing details broadly, and escalate to owner/orchestrator before public communication. | Minimal facts, affected surface, timestamps, suspected data class, containment action. |
| Third-party outage | Check provider status/dashboard through an owner or approved operator and compare with app logs/request IDs. | Provider name, status summary, affected routes, app fallback behavior, no dashboard screenshots with private details. |
| Browser/client error | Ask for a minimal route, action, timestamp, and sanitized screenshot or short console excerpt. | Browser/version if relevant, route/action, request ID if shown, redacted screenshot/excerpt. |

## Owner And Escalation Matrix

This matrix records the current approved operating state. On 2026-05-28, the
owner approved Heron Laoutaris as the initial incident commander, repository
release authority, service owner for provider checks, rollback approver, and
initial Sentry alert destination through `hlaoutaris@gmail.com`.

Backup operators are not assigned yet. Operators may collect non-sensitive
evidence, but delegated backup authority does not exist until the owner records
it. Escalate to Heron Laoutaris or the owner/orchestrator before changing
production configuration, rotating credentials, restoring data, publishing
legal/privacy communication, or promoting/rolling back a deployment.

| Area | Primary owner | Backup/escalation | Access source | Authority |
| --- | --- | --- | --- | --- |
| Incident commander | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Owner contact path and repo/task docs. | Classifies severity, coordinates incident updates, decides closure, and delegates actions in writing. |
| Sentry alert recipient | Heron Laoutaris / `hlaoutaris@gmail.com`. | Owner-approved backup alert destination, not yet assigned. | Sentry dashboard; never record provider secrets or dashboard screenshots. | Receives initial SEV-1/SEV-2 Sentry error alerts after the alert policy is configured in a separate provider-dashboard task. |
| Vercel deployment and rollback | Heron Laoutaris approves rollback. Owner local shell has `VERCEL_TOKEN` for approved deployment/log inspection. | Owner-approved backup operator, not yet assigned. | Owner local shell or Vercel dashboard; never record token values. | Targeted deployment/log inspection and read-only alias/domain verification are allowed only when scoped. Rollback execution, deployment promotion, environment changes, alias/domain changes, and project setting changes require separate Heron Laoutaris approval per incident/task. |
| Repository release authority | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | GitHub repository. | Approves production release, merge, revert, branch, and fix-forward decisions. |
| MongoDB production data | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | MongoDB provider dashboard. | May inspect production DB health, backups, restore options, and data scope when scoped. Data restore, export, deletion, or destructive changes require explicit owner approval. |
| Shopify Storefront/API | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Shopify admin/status. | May inspect Storefront API health, product availability, and provider status when scoped. Dashboard metadata, product policy, and store configuration changes remain owner-operated unless separately approved. |
| Cloudinary media/upload | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Cloudinary console. | May inspect upload preset, cloud, delivery, transformation, and asset state when scoped. Asset deletion remains blocked until separate cleanup policy approval. |
| Auth/NextAuth credentials | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Owner password manager, deployment environment, OAuth dashboards. | Approves smoke accounts and auth-provider checks. Secret rotation and smoke credentials stay private and require explicit scoped approval. |
| OAuth providers | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Google/GitHub provider consoles. | May inspect callback/client configuration and provider incidents when scoped. Provider config changes and secret rotation require explicit owner approval. |
| DNS/domain/TLS | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Registrar, DNS, and Vercel domain settings. | Read-only domain/alias verification is allowed only when scoped. DNS, TLS, alias, domain-routing, and Vercel project setting changes require explicit owner approval. |
| Privacy/legal communication | Heron Laoutaris. | Owner-approved backup operator, not yet assigned. | Owner/legal process. | Approves user-facing privacy, security, data-loss, or other legal communication. |

## Initial Sentry Alert Policy

This runbook documents the first alert recommendation only; it does not create,
edit, or verify provider dashboard alerts.

- Route initial Sentry error alerts to Heron Laoutaris at
  `hlaoutaris@gmail.com`.
- Start with error-event alerting for production server/runtime, edge, and
  browser/client errors captured by the T-310 Sentry baseline.
- Prioritize repeated `500`/unhandled exceptions, App Router render-boundary
  errors, and provider-adjacent failures that affect public archive, auth/admin,
  shop/enquiry, MongoDB, Shopify, Cloudinary, OAuth, DNS/domain, or deployment
  surfaces.
- Alert evidence should preserve Sentry event IDs, request IDs, route, method,
  environment, release/deployment metadata when available, and redacted error
  category. Do not include raw request bodies, cookies, authorization headers,
  credentials, tokens, customer personal data, provider secrets, or dashboard
  screenshots in repo docs.
- Keep session replay, profiling, broad tracing, source-map upload, provider
  webhooks, and sampling changes disabled unless a later owner-approved task
  explicitly scopes them.
- Alert silencing, threshold tuning, destination changes, and backup recipient
  setup require a separate provider-dashboard task.

## Simple Public Uptime Check Policy

Simple uptime checks are approved as a future provider/dashboard setup step.
They supplement `npm run smoke:public`; they do not replace deployment smoke,
incident triage, Vercel log inspection, or credentialed smoke.

Initial uptime checks should be unauthenticated public availability checks only:

- `GET /`
- `GET /artwork`
- `GET /collections`
- `GET /blog`
- `GET /shop/products`
- `GET /robots.txt`
- `GET /sitemap.xml`

Optional detail checks may use the current owner-approved public smoke records
from the production ops decision packet. Do not configure credentialed,
sessioned, admin, password-manager, private dashboard, mutation, enquiry-submit,
cart/checkout, or provider-console checks as part of this uptime policy.

Uptime alert destinations should start with Heron Laoutaris /
`hlaoutaris@gmail.com`. Provider choice, check interval, threshold, region,
notification channel, and any escalation schedule belong to the future scoped
dashboard task. Vercel project settings, aliases/domains, rollback execution,
and deployment promotion remain separate approval-gated actions.

### Remaining Owner Decisions

These decisions remain open before permanent production operations coverage is
complete, or before an affected incident needs delegated authority.

| Decision needed | Interim escalation | Next owner action |
| --- | --- | --- |
| Assign backup incident commander and backup alert recipient. | Heron Laoutaris / owner-orchestrator. | Approve named backup people, role labels, team aliases, or an explicit backup assignment process. |
| Configure Sentry alert policy in the provider dashboard. | Heron Laoutaris. | Create the initial production error-alert policy and destination without enabling replay, profiling, broad tracing, source-map upload, webhooks, or sampling changes. |
| Configure simple public uptime checks. | Heron Laoutaris. | Approve provider/check interval/threshold/region/channel for unauthenticated public-route availability checks only. |
| Assign backup Vercel deployment/log/rollback operator. | Heron Laoutaris. | Confirm who can inspect Vercel logs, verify aliases, and execute a rollback after explicit incident approval. |
| Assign backup repository release maintainer. | Heron Laoutaris. | Confirm who can approve merges, reverts, release branches, and fix-forward changes if Heron is unavailable. |
| Assign backup MongoDB production data operator. | Heron Laoutaris. | Confirm who can inspect health/backups and who can approve restore or data-scope decisions if Heron is unavailable. |
| Assign backup Shopify commerce operator. | Heron Laoutaris. | Confirm who can inspect Storefront API/product state and provider outage state if Heron is unavailable. |
| Assign backup Cloudinary media operator. | Heron Laoutaris. | Confirm who can inspect upload/delivery state and approve any future destructive asset operation if Heron is unavailable. |
| Assign backup auth credential and OAuth provider operators. | Heron Laoutaris. | Confirm who can approve smoke accounts, credentials rotation, callback checks, and provider incident checks if Heron is unavailable. |
| Assign backup DNS/domain/TLS operator. | Heron Laoutaris. | Confirm who can inspect or change DNS, TLS, Vercel aliases, and production domain routing if Heron is unavailable. |
| Assign backup privacy/legal communication approver. | Heron Laoutaris. | Confirm who can approve user-facing privacy, security, data-loss, or legal statements if Heron is unavailable. |

### Approval Authority

| Action | Required approval |
| --- | --- |
| Rollback execution or production deployment promotion | Explicit Heron Laoutaris approval for the incident/task plus an identified Vercel operator with project access. Repository release authority is also required if a code revert or fix-forward follows. |
| Release changes, merge, revert, or fix-forward | Heron Laoutaris approval, or a future owner-approved backup release maintainer. |
| Provider health checks or dashboard inspection | Heron Laoutaris approval plus the identified operator for the affected provider: Vercel, Sentry, MongoDB, Shopify, Cloudinary, Auth/NextAuth, OAuth, or DNS/domain. |
| Sentry alert or uptime dashboard changes | Separate Heron Laoutaris approval for the scoped provider-dashboard task. Do not enable replay, profiling, broad tracing, source-map upload, webhooks, or sampling changes as part of the initial alert/uptime policy. |
| Vercel project settings, aliases/domains, or deployment promotion | Separate Heron Laoutaris approval. Read-only inspection does not authorize mutation. |
| MongoDB restore or data-scope decision | Heron Laoutaris approval plus the identified MongoDB operator. Do not restore, delete, export, or mutate production data from this runbook alone. |
| Credential or secret rotation | Heron Laoutaris approval plus the identified owner for the affected secret source, such as Auth/NextAuth, OAuth, Shopify, Cloudinary, MongoDB, Vercel, Sentry, or DNS. |
| Privacy, security, data-loss, or legal communication | Heron Laoutaris or future owner-approved legal/privacy reviewer approval. |

For SEV-1, the incident commander must escalate to the owner/orchestrator and
the relevant service owner immediately. For SEV-2, escalate when the first
triage pass cannot identify a safe rollback, defer, or provider-outage path.
If Heron is unavailable and no backup has been assigned for the affected
surface, do not continue privileged action until the owner/orchestrator
identifies the approved operator.

## Rollback, Defer, Or Mitigate

Use the [deployment rollback triggers](deployment.md#rollback) for deployment
failures. This runbook adds incident-level decision rules:

| Decision | Use when | Approval |
| --- | --- | --- |
| Roll back | A recent deployment caused repeatable SEV-1 or SEV-2 failure, security/admin regression, wrong commit/environment promotion, root/serverless crash, public archive/shop `5xx`, credentials/admin smoke regression, or product not-found `500`. | Heron Laoutaris as incident commander/rollback approver plus an identified Vercel operator. Repository release authority is required if code revert/fix-forward follows. |
| Defer release | A preview or pending production change fails smoke, build, auth/admin, Shopify, or runtime checks before promotion. | Heron Laoutaris as repository release authority, or a future owner-approved backup release maintainer. |
| Mitigate in place | The issue is scoped, reversible, not caused by the current deployment, and can be contained through config, content, provider recovery, or a small follow-up without increasing user/data risk. | Incident commander plus affected service owner. Heron Laoutaris currently owns both roles unless a future backup is assigned. |
| Treat as provider outage | Evidence points to MongoDB, Shopify, Cloudinary, OAuth, DNS, Sentry, or Vercel external outage and the current deployment is otherwise healthy. | Incident commander plus affected service owner; Heron Laoutaris approves any user-facing communication. |
| Pause destructive/admin action | Data loss, data corruption, privacy/security issue, or destructive admin workflow risk is suspected. | Incident commander immediately; owner/database/privacy authority before resuming. Heron Laoutaris currently owns these approvals unless a future backup is assigned. |

After rollback or mitigation, rerun the minimum checks from
[deployment smoke checks](deployment.md#smoke-checks-after-deploy) that match
the incident. Always record the rollback evidence fields from the deployment
runbook when rollback occurs.

## Evidence Handling And Redaction

Keep enough evidence to reconstruct the incident without retaining sensitive
material.

Allowed evidence:

- UTC timestamps, affected route paths, HTTP methods/statuses, deployment IDs or
  URLs, commit SHAs, build IDs, `x-vercel-id`, and public `requestId` values.
- Short redacted log excerpts that show error category, route/function, request
  ID, and first app-owned stack frame when safe.
- Provider status summaries and owner-provided excerpts after redaction.
- Sanitized screenshots that show public UI state without credentials,
  cookies, emails, customer personal data, private admin content, tokens, or
  dashboard secrets.
- Record counts or entity classes when needed for data-risk scoping, without
  dumping records.

Do not store:

- Passwords, password hashes, reset links, API tokens, OAuth tokens, Vercel
  tokens, Shopify tokens, Cloudinary API secrets, MongoDB connection strings, or
  authorization headers.
- Cookies, session tokens, CSRF tokens, raw request bodies, raw provider logs,
  full database exports, or customer personal data dumps.
- Unredacted usernames/emails for smoke accounts or users.
- Screenshots that reveal credential fields, browser cookies, password manager
  contents, provider secrets, or private dashboard configuration.

Evidence retention rules:

- Keep summarized incident evidence in the task/runbook/workstream handoff.
- Keep raw sensitive artifacts out of the repo. If the owner must retain them,
  store them in the owner's approved private system and reference only a
  redacted summary in repo docs.
- Redact before pasting into Markdown. If a value might be a secret, replace it
  with `[REDACTED]` and describe the category instead.
- Do not use production user accounts for smoke unless the owner explicitly
  approves the account through a private channel.

## Communication

For SEV-1 and SEV-2, record a short running timeline:

```md
## Incident Timeline

- Started at, UTC:
- Severity:
- Incident commander:
- Affected surface:
- Current user impact:
- Current containment:
- Owner/escalation contacts used:
- Next update due, UTC:
```

Keep communication factual. Avoid speculation in owner-facing summaries; label
unknowns and next checks. Privacy/security, data-loss, payment/commerce, or
legal-facing communication needs owner/legal approval before publication.

## Post-Incident Review

Complete this section after production is stable.

```md
## Post-Incident Review

- Incident title:
- Incident date, UTC:
- Severity at peak:
- Final severity:
- Incident commander:
- Affected surfaces:
- User/admin impact:
- Root cause:
- Trigger:
- Detection source:
- Request IDs / deployment IDs / commit SHAs:
- Containment:
- Rollback/defer/mitigation decision:
- Resolution:
- Evidence retained:
- Evidence excluded/redacted:
- What worked:
- What failed or was missing:
- Follow-up tasks:
- Risks updated:
- Runbooks/workstreams updated:
- Owner decisions still unresolved:
```

Follow-up rules:

- Create task briefs for implementation work that changes runtime behavior,
  verification, monitoring, owner access, or provider configuration.
- Update `docs/risks/production-readiness.md` when an unresolved production
  risk remains after closure.
- Update the relevant workstream brief when the incident changes current facts,
  backlog order, verification, or next action.
- Update runbooks when a repeatable operating step changed.
- Add an ADR only for meaningful decisions that should not be re-litigated.

## Closure Criteria

Close the incident only after:

- The affected production path is stable or explicitly deferred.
- Rollback, mitigation, or provider-outage handling is recorded.
- Minimum relevant smoke or targeted checks pass.
- Evidence is redacted and summarized.
- Follow-up tasks and risks are created or updated.
- Unresolved owner gaps discovered during the incident are recorded in the
  owner matrix or relevant workstream backlog.
