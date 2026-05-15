# Current Orchestration State

Last updated: 2026-05-15

## Current Priority

T-057 is ready to assign: centralize numeric Shopify product ID validation/GID
construction and apply it to public product reads. Keep admin Shopify
product-linking, checkout/cart ownership, data migration, Cloudinary upload
policy, global logging/redaction policy, visible blog pinned/tag admin workflow,
and the residual Next/PostCSS owner decision separate.

## Active Phase

T-057 Shopify product ID normalization is prepared and ready for agent
assignment.

## Successor Takeover Snapshot

Use this section as the first operational handoff for a new orchestrator.

- Current orchestrator role: sequence agent tasks, keep docs canonical, and
  reconcile returned work into task/workstream/risk/finding trackers.
- No active audits are recorded.
- No active running agent is recorded in docs.
- T-030 is complete and reconciled: it added the missing admin user/comment
  detail read routes, added focused route tests, and removed
  `admin.read.user` plus `admin.read.comment` from the T-029 route/fetcher
  parity allowlist.
- T-031 is complete and reconciled: it removed the unused favourite/watchlist
  API write fetchers, removed those four operations from the route/fetcher
  parity inventory and allowlist, and preserved the T-028 server-action
  saved-item mutation path.
- T-032 is complete: it removed the unused profile update fetcher, removed
  `user.profile.update` from the route/fetcher parity inventory, left
  `KNOWN_ROUTE_FETCHER_GAP_IDS` empty, and resolved F-037.
- T-033 is complete: it migrated user comment delete to the shared user guard
  before DB/transaction work, validates the comment ID before DB work, preserves
  transactional delete behavior, and returns the typed delete envelope.
- T-034 is complete: it hardened admin article create/update validation with
  strict route schemas, parsed allowlisted persistence, route-local
  `dbConnect()`, and focused route tests.
- T-035 is complete: it added route-safe public artwork browse query parsing
  for filter/sort/color/pagination params before session or artwork service
  work.
- T-036 is complete: it added route-safe public shop listing query parsing for
  repeated filters, product-type boolean strings, and optional `sortBy` before
  `dbConnect()`, MongoDB query construction, or Shopify product fan-out.
- T-037 is complete: it hardened admin artwork create/update validation with
  strict route schemas, canonical artwork constants, allowlisted persistence,
  optional replacement-image updates, route-local DB ownership, and focused
  route tests while leaving Shopify product-link editing separate.
- T-038 is complete: it hardened admin blog create/update validation with
  strict route schemas, allowlisted persistence, route-local DB ownership,
  slug-conflict handling, and focused route tests.
- T-039 is complete: it migrated admin article, artwork, blog, collection,
  comment, and user read routes to `requireApiAdmin()`, added target-read DB
  ownership, detail ID validation, and focused route tests.
- T-040 is complete: it migrated admin article, artwork, blog, collection,
  comment, and user delete routes to `requireApiAdmin()`, added ID validation
  before destructive target/session work, added route-local DB ownership, and
  preserved existing cascade behavior with focused route tests.
- T-041 is complete: it fixed middleware API redirect cleanup by returning
  shared JSON `401` for unauthenticated protected API callers, preserving
  frontend redirects and admin API/frontend denial behavior, and removing
  always-on middleware debug logs. Do not fold remaining user comment route
  migration, shared response-helper standardization, or Shopify decisions into
  its follow-up docs.
- T-042 is complete: it migrated user comment GET/POST/PATCH route-local auth
  to `requireApiUser()`, moved GET auth before DB/model work, preserved
  create/update/delete behavior, added focused comment route tests, and passed
  focused tests, lint, and build.
- T-043 is complete: it added static protected API guard inventory coverage for
  `src/app/api/v2/user` and `src/app/api/v2/admin`. Shared response-helper
  standardization, public optional-session policy, and logging cleanup remain
  separate.
- T-044 is complete: it added `src/lib/api/apiResponse.ts`, delegated
  `apiAuthError()` without changing the auth envelope, and migrated protected
  user profile/navigation/favourite/watchlist read routes to shared helpers
  with real `404`/`500` missing-resource/internal-failure statuses.
- T-045 is complete: it migrated public artwork/article/blog detail routes and
  populated blog-comment detail routes to shared success/error helpers with real
  `404`/`500` statuses, public-safe internal-failure bodies, and focused public
  route tests.
- T-046 is complete: it migrated public collection list/detail/artwork routes
  to shared success/error helpers, added explicit `dbConnect()` ownership, and
  added focused collection route tests.
- T-047 is complete: it migrated public navigation article/collection routes to
  the same shared response helpers, real public-safe `404`/`500` statuses,
  route-local `dbConnect()` ownership, debug-log removal in touched handlers,
  and focused public navigation route tests.
- T-048 is complete: it migrated admin article/artwork/blog/collection/comment
  and user read list/detail routes to shared response helpers while preserving
  `requireApiAdmin()` guard behavior, invalid-ID `400` contracts, success DTOs,
  metadata, and DB/auth ordering.
- T-049 is complete: it migrated admin article/artwork/blog/collection/comment
  and user delete routes to shared response helpers while preserving success
  messages, `data: null`, invalid-ID `400` contracts, conflict and not-found
  statuses, cascade behavior, transactions, and guard/DB ordering.
- T-050 is complete: it migrated admin article/artwork/blog/collection
  create/update routes to shared response helpers while preserving structured
  validation responses, create/update success contracts, `201` create statuses,
  not-found/conflict statuses, allowlisted persistence, and guard/DB ordering.
- T-051 is complete: it added focused public transform contract tests and fixed
  blog `readTime`, collection `firstArtworkId`, public user `isOwner`, and
  populated comment/blog ownership-context drift.
- T-052 is complete: it resolved the focused F-041 public artwork image
  contract slice for Cloudinary image sanitization, color-proximity metadata
  typing, and Cloudinary color schema tightening.
- T-053 is complete: it created
  [data-field-contracts.md](../architecture/data-field-contracts.md), covering
  article `section`, blog `imageUrl`/`pinned`/`tags`, and user `password`.
- T-054 is complete: it removed the stale admin filter `"collections"` article
  option by deriving section filters from `ARTICLE_SECTION_OPTIONS`, exported a
  narrow `ARTICLE_FILTER_OPTIONS` contract for coverage, and added focused
  schema/options regression tests.
- T-055 is complete: it aligned blog `imageUrl`, `pinned`, and `tags` runtime
  contracts across the model, route schemas, allowlisted admin create/update
  persistence, and focused tests while leaving visible pinned/tag admin workflow
  controls out of scope.
- T-056 is complete: it made persisted user passwords optional, denied
  credentials auth for OAuth-style users without stored hashes before bcrypt
  verification, preserved hashed credentials role propagation, and kept
  public/own password sanitization intact.
- T-057 is ready: it owns the focused F-012 public Shopify product ID
  normalization slice for shared numeric ID validation/GID construction across
  public single-product and listing routes.
- Next task assignment:
  `/task effort: high details: docs/tasks/T-057-normalize-shopify-product-ids.md`
- The worktree is expected to be dirty from recent completed tasks and
  orchestration updates. Do not revert or overwrite unrelated files. Run
  `git status --short` before edits and treat existing changes as other agents'
  work unless the owner explicitly asks for cleanup.
- Chat history is not canonical. If chat and docs disagree, use the docs and
  update them before commissioning the next agent.

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
- T-020 resolved the admin collection create/update validation slice, T-034
  resolved the admin article create/update validation slice, T-037 resolved the
  admin artwork create/update validation slice, and T-038 resolved the admin
  blog create/update validation slice.
- T-021 partially mitigated public query bounds and ADR 0004 migration by
  moving public search to `getPublicSearchResults`; T-035 completed artwork
  browse query bounds, and T-036 completed shop browse query bounds.
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
  a self-checking known-gap allowlist for F-037 and found no additional
  mismatches.
- T-030 is complete. It added the active admin user/comment detail read routes
  behind the shared admin guard, added focused route tests, and reduced the
  T-029 known-gap allowlist to the five remaining favourite/watchlist/profile
  entries.
- T-031 is complete. It removed the unused favourite/watchlist write fetchers
  and reduced the T-029 known-gap allowlist to only `user.profile.update`.
- T-032 is complete. It removed the unused profile update fetcher instead of
  adding an unscoped profile edit route, emptied the parity allowlist, and
  resolved F-037.
- T-033 is complete. It hardened user comment delete auth/status/envelope
  behavior without changing comment create/update or admin comment delete.
- T-034 is complete. It applies the T-020 admin write-validation pattern to
  article create/update with strict schemas, allowlisted persistence,
  route-local `dbConnect()`, session-owned create authors, structured validation
  errors, and focused route tests.
- T-035 is complete. It validates and bounds public artwork browse query params
  before session lookup and artwork list service calls, with focused route
  coverage.
- T-036 is complete. It validates public shop listing repeated filters,
  product-type boolean strings, and optional `sortBy` before DB or Shopify work,
  without changing checkout, product ID migration, server-side sorting, or
  pagination behavior.
- T-037 is complete. It applies the T-020/T-034 admin write-validation pattern
  to artwork create/update with strict route schemas, allowlisted persistence,
  route-local `dbConnect()`, optional replacement-image updates, structured
  validation errors, and focused route tests.
- T-038 is complete. It applies the T-020/T-034/T-037 admin write-validation
  pattern to blog create/update with strict route schemas, allowlisted
  persistence, route-local `dbConnect()`, structured validation errors,
  slug-conflict handling, and focused route tests.
- T-039 is complete. It migrated admin read routes from `isAdmin()` to
  `requireApiAdmin()`, added explicit target-read DB ownership, returned
  structured JSON `400` for invalid detail IDs before target reads, preserved
  existing read response semantics, and passed focused route tests, lint, and
  build.
- T-040 is complete. It migrated admin delete routes from `isAdmin()` to
  `requireApiAdmin()`, returned shared JSON `401`/`403` guard responses before
  destructive work, added structured JSON `400` invalid-ID handling before
  target/session work, preserved existing delete/cascade semantics, and passed
  focused route tests, lint, and build.
- T-041 is complete. It resolved the middleware-level F-036 auth-status gap so
  protected API callers receive JSON `401` responses rather than NextAuth
  sign-in redirects while frontend protected routes keep their redirect
  behavior.
- T-042 is complete. It moved user comment GET/POST/PATCH handlers to
  `requireApiUser()` before body, DB, model, or transaction work, preserved
  comment validation/DTO behavior, and returned real GET missing-user/internal
  failure statuses.
- T-043 is complete. It locks the protected route-local guard invariant with a
  static inventory test before moving on to response-helper or logging-policy
  work.
- T-044 is complete. It introduced a small shared API response helper and
  applied it only to protected user profile, navigation, favourite, and
  watchlist read routes before any broader response-helper migration.
- T-045 is complete. It applied the same helper to public content detail routes
  before broader public list/search/navigation, admin, or logging-policy work.
- T-046 is complete. It applied the same helper to public collection APIs before
  broader public navigation or admin response-helper work.
- T-047 is complete. It applied the same helper to public navigation APIs
  before broader admin response-helper, logging-policy, or field-contract work.
- T-048 is complete. It applied the same helper to admin read APIs before
  broader admin write/delete response-helper, logging-policy, or field-contract
  work.
- T-049 is complete. It applied the same helper pattern to admin delete APIs
  before broader admin create/update response-helper, logging-policy, or
  field-contract work.
- T-050 is complete. It applied the same helper pattern to admin create/update
  APIs before broader field-contract, Shopify product-linking, or logging-policy
  work.
- T-051 is complete. It resolved the focused F-040 public transform drift for
  blog `readTime`, collection `firstArtworkId`, public user `isOwner`, and
  comment ownership-state propagation through populated blog/comment paths.
- T-052 is complete: public artwork transforms now sanitize nested Cloudinary
  image DTOs, omit `image.public_id`, preserve `similarityScore` as optional
  public-only image metadata for color-proximity results, and validate
  persisted color arrays as strict `{ color, percentage }` objects without
  changing upload policy or Shopify behavior.
- T-053 is complete. It created the F-039 field contract matrix for article
  `section`, blog `imageUrl`/`pinned`/`tags`, and user `password` in
  [data-field-contracts.md](../architecture/data-field-contracts.md).
- T-054 is complete. It aligned admin article section UI options with
  `ARTICLE_SECTION_OPTIONS` and added focused regression coverage that
  `"collections"` remains invalid for article sections while collection routes
  remain separate.
- T-055 is complete. It aligned blog `imageUrl`, `pinned`, and `tags`
  model/schema/admin route contracts while leaving visible admin workflow and
  public filtering behavior separate.
- T-056 is complete. It aligned optional persisted user password typing and
  credentials/OAuth behavior while preserving credentials password requirements,
  hashed-user role propagation, and public/own password sanitization.
- The highest current blockers are residual Next/PostCSS production advisories,
  owner confirmation of whether the removed Shopify value requires rotation,
  Vercel project-setting and rollback ownership, broader root-layout
  DB/session/cache ownership, staged ADR 0004
  server data-access migrations, package-manager/Node runtime pins, Cloudinary
  upload policy, admin bootstrap/recovery, and the broader CORS/CSP and logging
  policy decisions.

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

Assign T-057:
`/task effort: high details: docs/tasks/T-057-normalize-shopify-product-ids.md`

Keep admin Shopify product-linking, checkout/cart ownership, data migration,
remaining Cloudinary upload policy/runbook work, focused production logging
cleanup, visible blog pinned/tag admin workflow, and the residual Next/PostCSS
owner decision separate unless priority changes.

Keep the immediate bcrypt tracing include in `next.config.mjs` until a future
native-dependency policy explicitly replaces it. Use the T-025 deployment smoke
checklist for future deployment, runtime, auth, Shopify, and route-contract
changes.
