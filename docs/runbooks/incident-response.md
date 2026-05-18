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

Replace `TBD` entries only after the owner/orchestrator records the real
authority. Until then, do not assume access or approval.

| Area | Primary owner | Backup/escalation | Access source | Authority |
| --- | --- | --- | --- | --- |
| Incident commander | TBD owner/orchestrator | TBD backup | Repo/task docs | Classifies severity, coordinates updates, closes incident. |
| Vercel deployment and rollback | TBD Vercel project owner | TBD release backup | Vercel dashboard | Can inspect deployment logs, promote rollback target, verify aliases. |
| Repository release authority | TBD repository owner | TBD maintainer | GitHub repository | Can approve commit, branch, merge, revert, or release changes. |
| MongoDB production data | TBD database owner | TBD backup | MongoDB provider dashboard | Can inspect production DB health, backups, restore options, and data scope. |
| Shopify Storefront/API | TBD Shopify store owner | TBD commerce backup | Shopify admin/status | Can inspect Storefront API, product availability, and store configuration. |
| Cloudinary media/upload | TBD Cloudinary owner | TBD media backup | Cloudinary console | Can inspect upload preset, cloud, delivery, and asset state. |
| Auth/NextAuth credentials | TBD auth owner | TBD admin backup | Password manager, OAuth dashboards | Can approve smoke accounts, credentials rotation, OAuth provider checks. |
| OAuth providers | TBD Google/GitHub OAuth owner | TBD auth backup | Provider consoles | Can inspect callback/client configuration and provider incidents. |
| DNS/domain/TLS | TBD domain owner | TBD infra backup | Registrar/DNS/Vercel domain settings | Can inspect DNS, TLS, aliases, and production domain routing. |
| Privacy/legal communication | TBD owner/legal reviewer | TBD backup | Owner/legal process | Can approve privacy/security user-facing communication. |

For SEV-1, the incident commander must escalate to the owner/orchestrator and
the relevant service owner immediately. For SEV-2, escalate when the first
triage pass cannot identify a safe rollback, defer, or provider-outage path.

## Rollback, Defer, Or Mitigate

Use the [deployment rollback triggers](deployment.md#rollback) for deployment
failures. This runbook adds incident-level decision rules:

| Decision | Use when | Approval |
| --- | --- | --- |
| Roll back | A recent deployment caused repeatable SEV-1 or SEV-2 failure, security/admin regression, wrong commit/environment promotion, root/serverless crash, public archive/shop `5xx`, credentials/admin smoke regression, or product not-found `500`. | Vercel rollback owner plus incident commander. Repository release owner if code revert/fix-forward follows. |
| Defer release | A preview or pending production change fails smoke, build, auth/admin, Shopify, or runtime checks before promotion. | Repository release owner or orchestrator. |
| Mitigate in place | The issue is scoped, reversible, not caused by the current deployment, and can be contained through config, content, provider recovery, or a small follow-up without increasing user/data risk. | Incident commander plus affected service owner. |
| Treat as provider outage | Evidence points to MongoDB, Shopify, Cloudinary, OAuth, DNS, or Vercel external outage and the current deployment is otherwise healthy. | Incident commander plus affected service owner; owner approves any user-facing communication. |
| Pause destructive/admin action | Data loss, data corruption, privacy/security issue, or destructive admin workflow risk is suspected. | Incident commander immediately; owner/database/privacy authority before resuming. |

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
- Owner decisions still TBD:
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
- `TBD` owner gaps discovered during the incident are recorded in the owner
  matrix or relevant workstream backlog.
