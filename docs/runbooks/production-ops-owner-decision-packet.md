# Production Ops Owner Decision Packet

Status: Partially answered; recommended launch-safe defaults accepted

Use this packet to answer the production operations blockers from
[A-033](../audits/results/A-033-deployment-monitoring-smoke.md) without reading
the full audit. It is a decision intake sheet only. Do not record secrets,
credentials, tokens, private account identifiers, raw logs, or provider
dashboard screenshots in this file.

## Source Documents

- [ADR 0005 monitoring provider decision](../decisions/0005-monitoring-provider-decision.md)
- [Monitoring and error-reporting architecture](../architecture/monitoring-and-error-reporting.md)
- [Incident response runbook](incident-response.md)
- [Deployment runbook](deployment.md)
- [Testing runbook](testing.md)
- [A-033 deployment, monitoring, and smoke snapshot](../audits/results/A-033-deployment-monitoring-smoke.md)
- [Production-readiness risks](../risks/production-readiness.md)

## Current Blocked State

Agents can continue docs, tests, route hardening, and provider-neutral logging
work, but production operations implementation is blocked until the owner or
orchestrator answers these questions:

- Monitoring posture: Sentry is approved as the provider; runtime
  implementation and environment classification are in place. Alert routing,
  source-map upload, replay, profiling, broad tracing, and uptime checks remain
  separate staged follow-ups under the owner-approved defaults below.
- Incident authority: Heron Laoutaris is the initial incident commander and
  rollback approver. Backup/escalation remains unassigned.
- Vercel authority: owner has created a local `VERCEL_TOKEN` for approved CLI
  log/deployment inspection, but rollback, project settings, aliases/domains,
  and backup operator authority remain unapproved.
- Credentialed smoke: non-admin and admin smoke accounts are approved in
  principle, with credentials kept in the owner password manager. Actual secret
  values must never be recorded here.
- Public smoke automation: `SMOKE_BASE_URL` is owner-configured in repository
  variables, and the owner approved the non-secret optional detail values listed
  below.

## How To Answer

Answer each section with one of the accepted formats. Unknown or deferred is a
valid answer, but it keeps the matching implementation work blocked.

Do not paste secret values. For smoke accounts, provider keys, passwords,
tokens, cookies, API credentials, or private dashboard access, write only the
approved private delivery channel and the role that will receive it.

## 1. Monitoring Posture

Decision needed: choose the launch posture for production monitoring and error
reporting.

Accepted answer formats:

| Option | Required answer fields | What agents can do next |
| --- | --- | --- |
| Approved provider | Provider name; launch scope; required capture surfaces; alert destinations or owner roles; source-map/release policy; environment variable names and classifications without values; retention/cost/access notes. | Replace ADR 0005 with an accepted decision, classify provider env variables, then prepare a scoped provider implementation task. |
| No-provider interim launch | Explicit approval; expiry or review date; accepted mitigations; known remaining risks; who reviews incidents during the interim. | Record an accepted no-provider ADR and keep provider SDKs blocked until the review date or replacement decision. |
| Launch blocked | Blocking reason; minimum provider/alert/owner requirements; decision owner; target decision date. | Keep monitoring implementation and production launch readiness blocked. |
| Deferred or unknown | Who must decide; next meeting or input source; target date if known. | Keep ADR 0005 blocked and do not add SDKs, `instrumentation.ts`, source maps, alerts, or provider env variables. |

Owner response:

```md
Monitoring posture:
Provider or no-provider decision: Sentry approved by owner on 2026-05-27.
Launch scope: Initial error reporting for server/runtime and browser/client
  errors; keep session replay, profiling, broad tracing, uptime checks,
  source-map upload, and alert automation separate unless scoped later.
Alert owner/destination: Heron Laoutaris / hlaoutaris@gmail.com initially.
Source-map/release policy: Release/environment metadata allowed; source-map
  upload later, only after a separate scoped task.
Environment variable names/classes, no values: Pending implementation task;
  classify Sentry DSN/ingest identifiers, release/environment metadata, source
  map upload credentials if later approved, sampling flags, and any alert
  secrets.
Review or decision date: 2026-05-28.
Notes: Initial Sentry error reporting is implemented. Session replay: No.
  Profiling: No. Broad tracing: No. Uptime checks: Yes, simple public uptime
  only, as a separate scoped task.
```

## 2. Incident Owner Matrix

Decision needed: approve who owns incident command, service checks, privileged
provider actions, and backups.

Accepted answer format:

| Area | Primary owner or role | Backup/escalation | Access source | Authority boundary |
| --- | --- | --- | --- | --- |
| Incident commander |  |  |  |  |
| Repository release authority |  |  | GitHub repository |  |
| MongoDB production data |  |  | MongoDB provider dashboard |  |
| Shopify Storefront/API |  |  | Shopify admin/status |  |
| Cloudinary media/upload |  |  | Cloudinary console |  |
| Auth/NextAuth credentials |  |  | Password manager, deployment environment |  |
| OAuth providers |  |  | Google/GitHub provider consoles |  |
| DNS/domain/TLS |  |  | Registrar, DNS, Vercel domain settings |  |
| Privacy/legal communication |  |  | Owner/legal process |  |

Answering with role labels is acceptable if named people should stay out of the
repo, for example `Owner-approved Vercel operator in password manager entry`.
The incident response runbook can then record the approved role and private
lookup path without exposing personal or secret details.

Implementation blocked until answered:

- Incident closure authority.
- Provider dashboard checks.
- Data restore or production data-scope decisions.
- Credential or secret rotation.
- Privacy/security/data-loss user-facing communication.

Owner response on 2026-05-28:

| Area | Primary owner or role | Backup/escalation | Access source | Authority boundary |
| --- | --- | --- | --- | --- |
| Incident commander | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Owner contact path | Coordinates incidents and closure. |
| Repository release authority | Heron Laoutaris | Owner-approved backup operator, not yet assigned | GitHub repository | Approves production release/merge decisions. |
| MongoDB production data | Heron Laoutaris | Owner-approved backup operator, not yet assigned | MongoDB provider dashboard | Data restore/destructive changes require explicit owner approval. |
| Shopify Storefront/API | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Shopify admin/status | Dashboard metadata/policy changes remain owner-operated. |
| Cloudinary media/upload | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Cloudinary console | Asset deletion remains blocked until separate cleanup policy approval. |
| Auth/NextAuth credentials | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Owner password manager, deployment environment | Secret rotation and smoke credentials stay private. |
| OAuth providers | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Google/GitHub provider consoles | Provider config changes require explicit owner approval. |
| DNS/domain/TLS | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Registrar, DNS, Vercel domain settings | Domain/alias changes require explicit owner approval. |
| Privacy/legal communication | Heron Laoutaris | Owner-approved backup operator, not yet assigned | Owner/legal process | Owner approves user-facing privacy/security communication. |

## 3. Vercel Deployment, Logs, And Rollback

Decision needed: approve who can inspect Vercel logs, verify deployment aliases,
and execute rollback after owner/orchestrator approval.

Accepted answer format:

```md
Vercel operator role/name:
Owner local shell with `VERCEL_TOKEN` for approved deployment/log inspection.
Backup operator role/name:
Owner-approved backup operator, not yet assigned.
Access source:
Owner local shell profile/password manager; token value must not be recorded.
Can inspect deployment logs: Yes | No
Yes, for approved targeted CLI/API inspection when the token is available to
the operator shell.
Can verify production aliases/domains: Yes | No
Yes, read-only.
Can promote rollback target: Yes | No
No by default; only after explicit Heron Laoutaris approval per incident.
Rollback approval required from:
Heron Laoutaris.
Redacted log excerpt delivery path for agents without Vercel access:
Owner-provided redacted excerpts remain the fallback when `VERCEL_TOKEN` is not
available to the agent shell.
Notes:
```

Implementation blocked until answered:

- Complete production smoke evidence with targeted Vercel log review.
- Privileged rollback execution.
- Deployment alias verification by an approved operator.
- Incident response for Vercel runtime or native-package failures.

## 4. Credentialed Smoke Accounts

Decision needed: approve dedicated non-admin and admin smoke accounts plus the
private path for sharing credentials with approved operators.

Accepted answer format:

```md
Non-admin smoke account approved: Yes
Admin smoke account approved: Yes
Credential storage/delivery channel, no values:
Owner password manager; no credentials in repo, docs, or chat.
Who may retrieve credentials:
Heron Laoutaris and explicitly approved operators during a scoped
smoke/deployment task.
Allowed environments: Production | Preview | Both
Production for now; preview only after preview has a safe/stable database.
Account rotation owner:
Heron Laoutaris.
Account retirement conditions:
Immediately if exposed, after operator access changes, after an incident, or on
a regular 90-day rotation.
Notes:
```

Do not use real personal accounts unless the owner explicitly approves that
account as a smoke account through a private channel. Do not record usernames,
emails, passwords, reset links, cookies, CSRF tokens, session tokens, or
screenshots containing credentials.

Implementation blocked until answered:

- Credentials sign-in deployment smoke.
- Non-admin post-login admin denial proof.
- Admin dashboard smoke proof.
- Any future credentialed Playwright or browser-smoke automation.

## 5. Public Smoke Repository Variables

Decision needed: approve the non-secret GitHub Actions variables for scheduled
unauthenticated public smoke.

Accepted answer format:

| Variable | Approved value or source | Required? | Notes |
| --- | --- | --- | --- |
| `SMOKE_BASE_URL` |  | Required for scheduled runs | Public production or preview base URL. |
| `SMOKE_TIMEOUT_MS` |  | Optional | Non-secret timeout override. |
| `SMOKE_SEARCH_QUERY` |  | Optional | Public query string only. |
| `SMOKE_ARTWORK_ID` |  | Optional | Public artwork record ID approved for smoke. |
| `SMOKE_COLLECTION_SLUG` |  | Optional | Public collection slug approved for smoke. |
| `SMOKE_COLLECTION_ARTWORK_ID` |  | Optional | Public artwork ID within the approved collection. |
| `SMOKE_BLOG_SLUG` |  | Optional | Public blog slug approved for smoke. |
| `SMOKE_PRODUCT_HANDLE` |  | Optional | Public Shopify product handle approved for smoke. |
| `SMOKE_MISSING_PRODUCT_HANDLE` |  | Optional | Public nonexistent handle used to prove `404`. |

Owner-approved repository variable values on 2026-05-28:

| Variable | Approved value or source | Required? | Notes |
| --- | --- | --- | --- |
| `SMOKE_BASE_URL` | Owner configured in GitHub Actions variables | Required for scheduled runs | Public production base URL. |
| `SMOKE_TIMEOUT_MS` | unset | Optional | Use script default. |
| `SMOKE_SEARCH_QUERY` | `art` | Optional | Matches script default; explicit value is acceptable. |
| `SMOKE_ARTWORK_ID` | `661fc617648efb163cffacee` | Optional | Observed in production sitemap and verified with `200` on 2026-05-28. |
| `SMOKE_COLLECTION_SLUG` | `xxl` | Optional | Observed in production sitemap. |
| `SMOKE_COLLECTION_ARTWORK_ID` | `661fc617648efb163cffacee` | Optional | Observed in production sitemap under `/collections/xxl/...` and verified with `200` on 2026-05-28. |
| `SMOKE_BLOG_SLUG` | `progress-report` | Optional | Observed in production sitemap and verified with `200` on 2026-05-28. |
| `SMOKE_PRODUCT_HANDLE` | `joseph-laoutaris-fine-art-print-no-034` | Optional | Observed in production sitemap and verified with `200` on 2026-05-28. |
| `SMOKE_MISSING_PRODUCT_HANDLE` | `codex-smoke-missing-product` | Optional | Script default; keep nonexistent to prove product not-found behavior. |

Only public, non-secret values belong in repository variables. Credentials,
tokens, cookies, Vercel API keys, private account identifiers, and private admin
URLs must stay out of GitHub Actions variables.

Implementation blocked until answered:

- Scheduled public smoke coverage.
- Optional artwork, collection, blog, and product detail smoke proof.
- Treating a green scheduled workflow as anything beyond the default
  unauthenticated route set.

## Agent-Actionable Work After Answers

Create focused implementation tasks only after the matching answer exists:

- Prepare a scoped Sentry implementation task using ADR 0005 and the monitoring
  architecture.
- Implement the approved monitoring provider scope and environment contract.
- Update the incident response owner matrix with approved roles, backups,
  access sources, and authority boundaries.
- Update the deployment runbook with the approved Vercel log/rollback operator
  and evidence path.
- Configure public-smoke repository variables after the owner approves public
  records.
- Scope credentialed smoke automation only after smoke accounts and private
  secret handling are approved.

Until then, agents should keep provider SDKs, `instrumentation.ts`, alert
automation, source-map upload, credential handling, Vercel privileged actions,
and CI workflow changes out of scope.
