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

This matrix records the current approved operating state. The owner has not yet
approved named owners, team aliases, or permanent backup roles for these
surfaces. Until those decisions are recorded, treat every row below as blocked:
operators may collect non-sensitive evidence, but delegated approval authority
does not exist. Escalate to the owner/orchestrator to identify the approved
operator for the affected surface before changing production configuration,
rotating credentials, restoring data, publishing legal/privacy communication,
or promoting/rolling back a deployment.

| Area | Primary owner | Backup/escalation | Access source | Authority |
| --- | --- | --- | --- | --- |
| Incident commander | Blocked: owner/orchestrator must approve the commander role. | Escalate to owner/orchestrator to name the active commander and backup for the incident. | Repo/task docs | Until approved, owner/orchestrator classifies severity, coordinates updates, and closes the incident or delegates those actions in writing. |
| Vercel deployment and rollback | Blocked: Vercel project owner or approved operator is not recorded. | Escalate to owner/orchestrator to identify an operator with Vercel project access. | Vercel dashboard | Only the approved Vercel operator can inspect deployment logs, promote a rollback target, or verify aliases. Rollback requires owner/orchestrator approval while this row is blocked. |
| Repository release authority | Blocked: repository release owner or maintainer alias is not recorded. | Escalate to owner/orchestrator to identify the release approver with GitHub access. | GitHub repository | Only the approved release authority can approve commits, branches, merges, reverts, or release changes. |
| MongoDB production data | Blocked: production database owner is not recorded. | Escalate to owner/orchestrator to identify the MongoDB operator and backup. | MongoDB provider dashboard | Only the approved database operator can inspect production DB health, backups, restore options, and data scope. Restore requires owner/orchestrator approval while this row is blocked. |
| Shopify Storefront/API | Blocked: Shopify store owner or commerce operator is not recorded. | Escalate to owner/orchestrator to identify the commerce operator and backup. | Shopify admin/status | Only the approved commerce operator can inspect Storefront API health, product availability, and store configuration. |
| Cloudinary media/upload | Blocked: Cloudinary owner or media operator is not recorded. | Escalate to owner/orchestrator to identify the media operator and backup. | Cloudinary console | Only the approved media operator can inspect upload preset, cloud, delivery, transformation, and asset state. Destructive media changes also require the Cloudinary runbook. |
| Auth/NextAuth credentials | Blocked: auth credential owner is not recorded. | Escalate to owner/orchestrator to identify the auth operator and admin backup. | Password manager, deployment environment, OAuth dashboards | Only the approved auth operator can approve smoke accounts, rotate NextAuth credentials, or approve auth-provider checks. |
| OAuth providers | Blocked: Google/GitHub OAuth console owner is not recorded. | Escalate to owner/orchestrator to identify the OAuth operator and auth backup. | Provider consoles | Only the approved OAuth operator can inspect callback/client configuration, provider incidents, and provider secret rotation. |
| DNS/domain/TLS | Blocked: domain, DNS, or TLS owner is not recorded. | Escalate to owner/orchestrator to identify the DNS/domain operator and infra backup. | Registrar, DNS, and Vercel domain settings | Only the approved domain operator can inspect or change DNS, TLS, aliases, and production domain routing. |
| Privacy/legal communication | Blocked: owner/legal reviewer and backup are not recorded. | Escalate to owner/orchestrator to identify the legal/privacy approver. | Owner/legal process | Only the approved owner/legal reviewer can approve privacy, security, data-loss, or other user-facing legal communication. |

### Blocked Owner Decisions

These decisions must be supplied by the owner/orchestrator before production
launch or before an affected incident requires the authority.

| Decision needed | Interim escalation | Next owner action |
| --- | --- | --- |
| Name the incident commander role and backup process. | Owner/orchestrator. | Approve a named owner, role label, team alias, or explicit commander assignment process. |
| Name the Vercel deployment/log/rollback operator and backup. | Owner/orchestrator. | Confirm who can access Vercel logs, verify aliases, and promote rollback targets. |
| Name the repository release approver and backup maintainer. | Owner/orchestrator. | Confirm who can approve merges, reverts, release branches, and fix-forward changes. |
| Name the MongoDB production data operator and restore approver. | Owner/orchestrator. | Confirm who can inspect health/backups and who can approve restore or data-scope decisions. |
| Name the Shopify commerce operator and backup. | Owner/orchestrator. | Confirm who can inspect Storefront API/product state and approve commerce-provider outage handling. |
| Name the Cloudinary media operator and backup. | Owner/orchestrator. | Confirm who can inspect upload/delivery state and approve any future destructive asset operation. |
| Name the auth credential and OAuth provider operators. | Owner/orchestrator. | Confirm who can approve smoke accounts, credentials rotation, callback checks, and provider incident checks. |
| Name the DNS/domain/TLS operator and backup. | Owner/orchestrator. | Confirm who can inspect or change DNS, TLS, Vercel aliases, and production domain routing. |
| Name the privacy/legal communication approver and backup. | Owner/orchestrator. | Confirm who can approve user-facing privacy, security, data-loss, or legal statements. |

### Approval Authority While Blocked

| Action | Required approval while owner rows are blocked |
| --- | --- |
| Rollback or production deployment promotion | Owner/orchestrator approval plus an identified Vercel operator with project access. Repository release authority is also required if a code revert or fix-forward follows. |
| Release changes, merge, revert, or fix-forward | Owner/orchestrator approval plus the identified GitHub release approver. |
| Provider health checks or dashboard inspection | Owner/orchestrator approval plus the identified operator for the affected provider: Vercel, MongoDB, Shopify, Cloudinary, Auth/NextAuth, OAuth, or DNS/domain. |
| MongoDB restore or data-scope decision | Owner/orchestrator approval plus the identified MongoDB operator. Do not restore, delete, export, or mutate production data from this runbook alone. |
| Credential or secret rotation | Owner/orchestrator approval plus the identified owner for the affected secret source, such as Auth/NextAuth, OAuth, Shopify, Cloudinary, MongoDB, Vercel, or DNS. |
| Privacy, security, data-loss, or legal communication | Owner/legal reviewer approval. If no reviewer has been approved, do not publish user-facing communication beyond private owner/orchestrator escalation. |

For SEV-1, the incident commander must escalate to the owner/orchestrator and
the relevant service owner immediately. For SEV-2, escalate when the first
triage pass cannot identify a safe rollback, defer, or provider-outage path.
If the affected owner row is blocked, the owner/orchestrator must identify the
approved operator before any privileged action continues.

## Rollback, Defer, Or Mitigate

Use the [deployment rollback triggers](deployment.md#rollback) for deployment
failures. This runbook adds incident-level decision rules:

| Decision | Use when | Approval |
| --- | --- | --- |
| Roll back | A recent deployment caused repeatable SEV-1 or SEV-2 failure, security/admin regression, wrong commit/environment promotion, root/serverless crash, public archive/shop `5xx`, credentials/admin smoke regression, or product not-found `500`. | Vercel rollback owner plus incident commander. Repository release owner if code revert/fix-forward follows. While owner rows are blocked, owner/orchestrator approval plus an identified Vercel operator is required. |
| Defer release | A preview or pending production change fails smoke, build, auth/admin, Shopify, or runtime checks before promotion. | Repository release owner or orchestrator. While owner rows are blocked, owner/orchestrator approval plus the identified release approver is required. |
| Mitigate in place | The issue is scoped, reversible, not caused by the current deployment, and can be contained through config, content, provider recovery, or a small follow-up without increasing user/data risk. | Incident commander plus affected service owner. While owner rows are blocked, owner/orchestrator must identify the affected service operator before privileged changes. |
| Treat as provider outage | Evidence points to MongoDB, Shopify, Cloudinary, OAuth, DNS, or Vercel external outage and the current deployment is otherwise healthy. | Incident commander plus affected service owner; owner approves any user-facing communication. While owner rows are blocked, owner/orchestrator must identify the affected provider operator. |
| Pause destructive/admin action | Data loss, data corruption, privacy/security issue, or destructive admin workflow risk is suspected. | Incident commander immediately; owner/database/privacy authority before resuming. While owner rows are blocked, keep the action paused until owner/orchestrator identifies the required authority. |

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
