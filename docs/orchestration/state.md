# Current Orchestration State

Last updated: 2026-05-14

## Current Priority

Commission the first route/fetcher parity cleanup after T-029 made F-037
measurable, while keeping the residual Next/PostCSS owner decision separate.

## Active Phase

Implementation commissioning and high-risk follow-up sequencing.

## Current Facts

- `AGENTS.md` is the first-read operating guide for all agents.
- `docs/README.md` is the canonical documentation index.
- Workstream briefs exist for production-readiness implementation areas.
- Audit goals and result files exist for discovery work.
- Architecture refactor, unused-code pruning, SSR/data-fetching, and testing
  reliability are first-class audit and workstream concerns.
- This orchestration guide now defines how a successor agent should take over.
- Audit reconciliation now has a dedicated findings register and review process.
- Orchestrator-assigned goals must start with `/goal` and include `effort:
  high` or `effort: xhigh`.
- Orchestrator assignments must be one-line pointers to canonical docs, not
  large prompt blocks.
- Because assignments are one-line pointers, the linked details doc must be
  complete before commissioning an agent.
- Concurrent audit agents should assume they are not alone in the repo and should
  keep edits scoped to assigned result files unless told otherwise.
- Completed audits A-001, A-006, A-012, A-013, A-014, and A-015 have been
  reconciled into the findings register, risk tracker, workstream backlogs, and
  required process/ADR/runbook docs.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md) is accepted and
  chooses direct server data-access services over same-app HTTP self-fetching for
  server loaders, API routes, and server actions.
- Completed audits A-002, A-003, A-004, and A-007 have been reconciled into the
  findings register, risk tracker, and workstream backlogs.
- T-001 through T-023 are complete. They removed `MONGO_URI` exposure from Next
  config, persisted credentials roles into JWT/session state, made stable
  `session.user.id` the protected-read ownership source, standardized the
  public single Shopify product API contract, hardened the Cloudinary signing
  route guard and validation, added the server-only Next config env guard,
  replaced product-detail linked artwork self-fetching with a server-only data
  path, and replaced the product detail `Add to Cart` placeholder with a
  first-release enquiry handoff. The latest batch removed registration
  credential logs and the Shopify token-shaped source comment, hardened public
  enquiry validation, patched the current-major production dependency baseline,
  hardened user comment create/update validation, repaired the active sign-in
  flow, split residual dependency advisories into explicit follow-up tasks,
  completed the Next major migration preflight, upgraded bcrypt to 6.0.0,
  hardened subscription validation, proved the `/artwork` list ADR 0004
  service pattern, pruned the legacy custom auth/session path, hardened admin
  collection writes, migrated public search to a server-only service, and
  removed confirmed-unused direct package candidates. T-023 removed bcrypt and
  credentials password verification from the normal public-page import path by
  lazy-loading credentials authorize inside the NextAuth credentials provider.
- Completed audits A-008, A-016, and A-019 have been reconciled into the
  findings register, risk tracker, workstream backlogs, result files, and task
  briefs.
- T-015 found no accepted stable Next target that clears both residual
  Next/PostCSS advisories: stable `next@16.2.6` still bundles vulnerable
  `postcss@8.4.31`, while canary `16.3.0-canary.6+` clears isolated audit
  output but requires explicit owner acceptance.
- T-016 removed the bcrypt production advisory path, removed helper credential
  logging, and verified bcrypt 6 hash compatibility.
- T-017 resolved subscription server-action validation and public-safe failure
  handling.
- T-018 partially mitigated the remaining same-app HTTP/server data-access risk
  by moving `/artwork` initial list loading to `getArtworkList`.
- T-019 resolved the stale custom login/session path and `/protected` route
  pruning; now-unused `jose` is a package-cleanup candidate.
- T-020 resolved the admin collection create/update validation slice; article,
  artwork, and blog admin writes remain open.
- T-021 partially mitigated public query bounds and ADR 0004 migration by
  moving public search to `getPublicSearchResults`; artwork browse and shop
  browse query bounds remain open.
- T-022 resolved the package cleanup slice for confirmed-unused direct
  dependencies and removed the unused `core-js` install-script path.
- The Vercel bcrypt native trace incident is fixed locally by tracing bcrypt
  prebuilds in `next.config.mjs`; T-023 also removes bcrypt from the normal
  public-page import path locally.
- T-024 is complete. After `origin/main` advanced to
  `820d45f1e155ddc700879f6afef803bea57cbf02`, matching local `HEAD` with the
  T-023 auth import-boundary change, the owner reported the Vercel deployment no
  longer crashes and a fresh `curl -I /` returned `HTTP/2 200`.
- T-025 is complete. The deployment runbook now contains repeatable Vercel smoke
  evidence fields, route/status expectations, credentials smoke secret handling,
  targeted log requirements, and rollback triggers. `npm run smoke:public`
  covers unauthenticated public-route status checks without secrets.
- T-026 is complete. It introduced shared route-local user/admin API guards,
  migrated admin collection create/update plus user profile auth-status
  behavior, and passed focused route/guard tests, lint, and build.
- T-027 is complete. It applied `requireApiUser()` to user navigation,
  favourites, and watchlist read routes with real JSON `401` responses before
  DB/model work, added explicit watchlist read-route DB ownership, and passed
  focused saved-route guard tests, lint, and build.
- T-028 is complete. It added explicit favourite/watchlist server-action
  `dbConnect()` ownership before model work, affected-route revalidation after
  successful toggles, defensive saved-item input handling, and focused action
  tests.
- T-029 is complete. It added a static route/fetcher parity inventory test with
  a self-checking seven-item known-gap allowlist for F-037 and found no
  additional mismatches.
- T-030 is ready. It scopes the active admin user/comment detail read route
  mismatches to two new admin detail routes, focused route tests, and removal of
  `admin.read.user` and `admin.read.comment` from the T-029 allowlist.
- The highest current blockers are residual Next/PostCSS production advisories,
  owner confirmation of whether the removed Shopify value requires rotation,
  Vercel project-setting and rollback ownership, broader protected API
  auth-status consistency, remaining route/fetcher parity drift, broader
  root-layout DB/session/cache ownership, remaining admin write validation,
  artwork/shop browse query bounds, staged ADR 0004 server data-access
  migrations, package-manager/Node runtime pins, Cloudinary upload policy, admin
  bootstrap/recovery, and the broader CORS/CSP and logging policy decisions.

## Active Audits

None currently active.

Completed and reconciled:

- [A-001 Shopify commerce readiness](../audits/results/A-001-shopify-commerce.md)
- [A-006 Testing and quality baseline](../audits/results/A-006-testing-quality-baseline.md)
- [A-012 Documentation and handoff quality](../audits/results/A-012-documentation-knowledge-base.md)
- [A-013 Architecture refactor scope](../audits/results/A-013-architecture-refactor-scope.md)
- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [A-015 SSR and data-fetching strategy](../audits/results/A-015-ssr-data-fetching.md)
- [A-002 Public, user, and admin API contracts](../audits/results/A-002-api-contracts.md)
- [A-003 Data models, schemas, and transforms](../audits/results/A-003-data-models-transforms.md)
- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [A-007 Deployment and environment readiness](../audits/results/A-007-deployment-environment.md)
- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)

## Recommended Next Audits

Good follow-up audits after the next implementation batch is assigned or
completed:

1. [A-009 Cloudinary and asset operations](../audits/goals.md#a-009-cloudinary-and-asset-operations)
2. [A-020 Privacy, consent, and commerce compliance](../audits/goals.md#a-020-privacy-consent-and-commerce-compliance)
3. [A-021 Observability and incident response](../audits/goals.md#a-021-observability-and-incident-response)

## Open Coordination Tasks

- Use `/goal effort: high` by default when commissioning audit work; reserve
  `effort: xhigh` for broad, ambiguous, or high-risk cross-cutting audits.
- Update and review the relevant details doc first, then commission agents with a
  one-line `/goal` or `/task` pointer.
- Keep future audit result status in sync with `docs/audits/goals.md` and
  `docs/audits/results/README.md`.
- Keep [findings-register.md](../audits/findings-register.md) in sync with
  future completed audit results.
- Convert future completed audit findings into workstream backlog items before
  assigning implementation work.
- Keep A-002, A-003, A-004, A-007, A-008, A-016, and A-019 reconciled findings
  linked when assigning implementation work.
- Add ADRs when architecture or process decisions become settled.
- Keep High severity risks visible and linked to active work.
- Resolve or escalate owner decisions captured in the findings register:
  checkout scope, admin Shopify linking, i18n scope, auth/session pruning,
  Shopify credential verification/rotation, residual Next/PostCSS dependency
  risk, and public enquiry/commercial contact ownership.
- Resolve or escalate the new A-002/A-007 decisions: admin API route convention,
  legacy/env variable status, Vercel rollback owner, and Cloudinary upload
  preset ownership.

## Next Orchestrator Action

Commission
`/task effort: high details: docs/tasks/T-030-admin-user-comment-detail-read-routes.md`.

After T-030, choose between another F-037 allowlist cleanup group,
broader protected API guard migration, remaining artwork/shop browse query
bounds, or admin write validation.

Keep the immediate bcrypt tracing include in `next.config.mjs` until a future
native-dependency policy explicitly replaces it. Use the T-025 deployment smoke
checklist for future deployment, runtime, auth, Shopify, and route-contract
changes.
