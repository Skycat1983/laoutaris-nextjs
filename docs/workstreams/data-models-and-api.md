# Data Models And API Workstream

Status: Active

Goal: make MongoDB schemas, Mongoose models, transforms, and API responses
consistent enough for production refactoring and Shopify integration.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Database runbook](../runbooks/database.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-016 Forms, validation, and user input](../audits/goals.md#a-016-forms-validation-and-user-input)

## Blocks

- Reliable public archive browsing.
- Admin CRUD hardening.
- Commerce link integrity.
- Broad test coverage.

## Related Code Areas

- `src/lib/data/schemas/`
- `src/lib/data/models/`
- `src/lib/data/types/`
- `src/lib/transforms/`
- `src/lib/api/`
- `src/app/api/v2/`

## Current Facts

- The API is split into public, user, and admin route groups under
  `/api/v2`.
- Mongoose schemas and frontend types are separate and need contract alignment.
- Transform functions normalize model data for frontend use.
- MongoDB connection helpers exist under `src/lib/db/`.
- Shopify product links currently live on artwork data.
- A-013 and A-001 found response envelopes, status codes, and transform
  contracts are uneven across public, user, admin, and shop routes.
- A-015 found several MongoDB-backed API routes and account actions without
  explicit route-local DB connection ownership.
- A-001 found Shopify product IDs are documented as numeric but accepted as
  arbitrary strings.
- A-002 completed the `/api/v2` contract inventory and found inconsistent real
  HTTP statuses, route/fetcher drift, DB connection gaps, validation behavior,
  raw document responses, shop envelope drift, and undocumented admin route
  conventions.
- A-003 found model/schema/type field drift, admin write validation gaps,
  profile/comment/enquiry DTO mismatches, transform extender gaps, and artwork
  image sanitization issues.
- T-004 completed the first narrow API contract slice: the public single
  Shopify product route now uses success/error envelopes, validates numeric
  product IDs before Shopify calls, and has focused route tests.
- A-016 completed the forms/input audit and confirmed server-side validation
  gaps in public enquiry, user comments, admin create/update routes,
  subscription, search/browse query parsing, and input persistence tests.
- A-008 confirmed public and admin routes return raw exception messages and need
  public-safe error responses with internal redacted logging.
- T-010 completed the first public input hardening slice: public enquiry now
  uses a shared Zod DTO schema, persists only normalized validated fields,
  returns real 400 validation responses with `fieldErrors`/`formErrors`, removes
  request-body logging, owns `dbConnect()`, and returns public-safe 500 errors.
- T-012 completed the user comment input hardening slice: comment create/update
  now use route-safe Zod parsing, real HTTP auth/validation/not-found/forbidden
  statuses, parsed trimmed text persistence, transformed frontend DTO responses,
  and focused route tests.
- T-017 completed the subscription input hardening slice: `submitSubscription`
  validates defensive `FormData` input, normalizes email values, owns
  `dbConnect()`, persists only the normalized subscriber DTO, removes direct
  input logging, and returns stable public-safe failures.
- T-018 moved the public artwork list query, existing filter/sort behavior,
  color-proximity handling, pagination metadata, user-context transformation,
  and `dbConnect()` ownership into `getArtworkList`, shared by the API route and
  `ArtworkListLoader`.
- T-020 completed the first admin collection write validation slice: collection
  create/update now use strict route-safe schemas, real validation statuses,
  allowlisted parsed persistence, ObjectId checks, `dbConnect()` ownership, and
  focused route tests.
- T-021 completed public search query hardening: `/api/v2/public/search` now
  validates and bounds `q`/`type`/`page`/`limit`, escapes search regex input,
  delegates MongoDB query/DTO work to `getPublicSearchResults`, and returns real
  400 validation responses.
- T-026 began F-036 protected API auth-status cleanup with shared user/admin
  route-local guards and a representative admin/user route slice.
- T-027 continued F-036 on user navigation, favourites, and watchlist read
  routes, and added explicit DB ownership to the watchlist read routes.
- T-028 resolved the F-027 favourite/watchlist server-action DB ownership and
  revalidation slice, including invalid saved-item input handling and focused
  action tests.
- T-029 added a focused static route/fetcher parity inventory test for the
  known F-037 mismatches before runtime contract fixes.
- T-030 added the active admin user/comment detail read routes and removed those
  two known-gap entries from the T-029 parity allowlist.
- T-031 removed the unused favourite/watchlist write fetchers and reduced the
  F-037 route/fetcher parity allowlist to the remaining profile update gap.
- T-032 removed the unused profile update fetcher, emptied the route/fetcher
  parity allowlist, and resolved F-037 without adding an unneeded profile write
  route.
- T-033 completed protected user comment delete status/envelope cleanup.
- T-034 completed admin article create/update validation with strict route
  schemas, allowlisted persistence, article/artwork ObjectId checks, session
  author ownership, route-local `dbConnect()`, and focused route tests.
- T-035 completed public artwork browse query validation with route-safe
  filter/sort/color/pagination parsing before session lookup or artwork list
  service calls.
- T-036 completed the remaining F-060 shop browse query-bounds slice by
  validating repeated filters, product-type booleans, and optional `sortBy`
  before MongoDB or Shopify work.
- T-037 completed the F-057 admin artwork create/update validation slice.
- T-038 completed the remaining F-057 admin blog create/update validation slice
  with strict schemas, allowlisted persistence, route-local DB ownership, and
  slug-conflict coverage.
- T-039 continued F-036 by moving remaining admin read routes to the shared
  admin guard, adding explicit target-read DB ownership, and validating detail
  IDs before target model reads.
- T-040 continued F-036 by moving admin delete routes to the shared admin guard,
  adding explicit route-local DB ownership before destructive model work, and
  validating delete IDs before target/session work.
- T-041 addressed the middleware-level F-036 gap where protected API callers
  were redirected instead of receiving JSON `401` responses.
- T-042 finished the user comment route group's route-local protected auth
  cleanup by moving GET/POST/PATCH to `requireApiUser()`, preserving comment
  DTOs and validation behavior, and returning real GET failure statuses.
- T-043 added static protected API guard inventory coverage before broader
  response-helper standardization begins.
- T-044 added the first shared API response-helper slice, scoped to protected
  user profile, navigation, favourite, and watchlist read routes with real
  `404`/`500` statuses and public-safe error envelopes.
- T-045 completed the next response-helper slice, scoped to public artwork,
  article, blog, and populated blog-comment detail route failures with real
  `404`/`500` statuses and public-safe internal-failure bodies.
- T-046 completed the next response-helper slice, scoped to public collection
  routes, explicit route-local DB ownership, and public-safe `404`/`500`
  envelopes.
- T-047 completed the next response-helper slice, scoped to public navigation
  article/collection routes, explicit route-local DB ownership, and public-safe
  `404`/`500` envelopes.
- T-048 completed the next response-helper slice, scoped to admin read routes
  with shared success/error helpers, real empty-list/missing-resource/internal
  failure statuses, public-safe `500` bodies, and preserved guard behavior,
  invalid-ID validation, success DTOs, metadata, and DB-before-model ordering.
- T-049 completed the next response-helper slice, scoped to admin delete routes
  with shared success/error helpers, preserved success messages, `data: null`,
  conflict handling, missing-resource/internal-failure statuses, cascade
  behavior, transactions, guard/DB ordering, and touched debug-log removal.
- T-050 completed the final currently staged admin response-helper slice,
  scoped to admin create/update routes with shared success/error helpers while
  preserving validation responses, success DTOs, create statuses, allowlisted
  persistence, not-found/conflict statuses, and guard/DB ordering.
- T-051 is prepared for the next bounded field/transform contract slice:
  focused public transform tests and fixes for blog `readTime`, collection
  `firstArtworkId`, public user `isOwner`, and comment ownership state.

## Backlog

- Inventory all public, user, and admin API response shapes.
- Identify routes that return inconsistent success/error envelopes.
- Standardize shared success, error, unauthorized, forbidden, not-found,
  validation, and upstream-service response helpers.
- Replace body-level `statusCode`/`errorCode` failures with real HTTP response
  statuses across representative public, user, and admin routes first.
- Use the route/fetcher parity inventory to catch new unsupported methods and
  missing route files before consumers depend on them.
- Require route responses to return transformed frontend/admin data rather than
  raw Mongoose documents unless explicitly documented.
- Add `dbConnect()` or a shared DB wrapper to every MongoDB-backed API route and
  server action, then test handlers in isolation.
- Confirm schemas, TypeScript types, and transforms agree on required fields.
- Build a field matrix for article, artwork, blog, collection, comment, user,
  enquiry, and subscriber records, then choose the authoritative layer for each
  required/optional field.
- Add validation policy for create and update routes, including `safeParse` or
  equivalent 400 responses instead of broad 500s for validation failures.
- Fix high-risk route DTO mismatches for user profile and admin content writes.
- Migrate admin create/update routes toward allowlisted schemas, ObjectId
  validation, real 400 validation responses, and route tests by content type.
- Replace raw exception responses with stable public-safe errors across public,
  user, and admin routes.
- Add Shopify product ID normalization and validation for admin writes, API
  reads, and one-time data migration/audit work.
- Document pagination and filtering contracts for artwork, collection, blog,
  article, search, and shop endpoints.
- Choose list empty-state semantics and search pagination metadata behavior.
- Document whether admin action-segment API paths are canonical, or open an ADR
  for a resource-oriented migration plan.
- Audit form/input validation from UI through API persistence.
- Add tests for high-risk transforms and route utilities, including blog
  `readTime`, collection `firstArtworkId`, user/comment ownership state, artwork
  image sanitization, and color-sort payloads.

## Acceptance Criteria

- API response conventions are documented and applied consistently.
- Data model fields needed by public pages and admin forms are traceable from
  schema to type to transform.
- Missing, invalid, and unauthorized requests return predictable status codes.
- Shopify product references are validated consistently before persistence.

## Verification

```bash
npm test
npm run build
```

Add API route tests where behavior is changed.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-013, and A-015 data/API findings into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled A-002 and A-003 into F-036 through F-041, F-049, F-050,
  existing F-010/F-012/F-015/F-024, production risks, and this backlog.
- 2026-05-14: Prepared T-004 to standardize the public single Shopify product
  API contract before broad route/fetcher refactors.
- 2026-05-14: Completed T-004 for
  `/api/v2/public/shop/products/[productId]`; validation, 400/404/502 error
  envelopes, success `data` wrapping, and the direct artwork-page consumer are
  covered by focused tests.
- 2026-05-14: Reconciled A-016 into F-055 through F-062, updated F-016, and
  routed the first public input slice to T-010.
- 2026-05-14: Reconciled A-008 raw exception handling into F-053 and this
  backlog.
- 2026-05-14: Completed T-010 for `POST /api/v2/public/enquiry`; shared schema
  validation, normalized DTO persistence, body-log removal, real HTTP
  validation statuses, public-safe 500s, and focused route tests are in place.
- 2026-05-14: Completed T-012 for user comment create/update routes; route-safe
  schema validation, real HTTP statuses, trimmed persistence, transformed
  frontend DTOs, transaction rollback coverage, and focused route tests are in
  place.
- 2026-05-14: Completed T-017 for `submitSubscription`; server-action
  validation, normalization, `dbConnect()` ownership, public-safe errors, input
  log removal, and focused tests are in place.
- 2026-05-14: Completed T-018 for `GET /api/v2/public/artwork`; the route now
  parses search params and delegates query/transform ownership to
  `getArtworkList` while preserving the public list envelope.
- 2026-05-14: Prepared T-020 for admin collection create/update validation and
  T-021 for public search query validation plus server-only data access.
- 2026-05-14: Completed T-020 for admin collection create/update validation;
  strict route schemas, allowlisted parsed persistence, collection/artwork
  ObjectId validation, real 400/401/404/500 statuses, `dbConnect()` ownership,
  debug-log removal, and focused route tests are in place.
- 2026-05-14: Completed T-021 for public search query validation and direct
  server data access; `getPublicSearchResults` now owns MongoDB connection,
  escaped regex search, `type` filtering, pagination bounds, and DTO shaping for
  both the API route and `/search` page.
- 2026-05-14: Completed T-026 by adding shared user/admin API route guards and
  migrating admin collection create/update plus user profile auth-status
  behavior without changing the profile raw-document DTO shape.
- 2026-05-14: Completed T-027 by moving user navigation, favourites, and
  watchlist read routes behind `requireApiUser()` before DB/model work and by
  adding explicit `dbConnect()` ownership to watchlist list/detail reads.
- 2026-05-14: Prepared T-028 for favourite/watchlist server-action
  `dbConnect()` ownership, route revalidation, invalid saved-item input
  handling, and focused action tests.
- 2026-05-14: Completed T-028 by adding favourite/watchlist server-action
  `dbConnect()` ownership before model reads/writes, preserving stable action
  states/messages, revalidating account/artwork paths only after successful
  persistence, and adding focused action tests for ordering and invalid input.
- 2026-05-14: Prepared T-029 to make F-037 route/fetcher parity drift
  measurable with a static route manifest, explicit fetcher operation
  inventory, and self-checking known-gap allowlist.
- 2026-05-14: Completed T-029 by adding
  `__tests__/unit/api/routeFetcherParity.test.ts`; it scans the current App
  Router API route manifest, checks all 59 active fetcher operations across 16
  fetcher modules, and carries only the seven documented F-037 gaps in a
  self-checking allowlist. Focused parity test, lint, and build passed.
- 2026-05-14: Prepared T-030 to back `clientApi.admin.read.user(id)` and
  `clientApi.admin.read.comment(id)` with admin detail routes, focused route
  tests, and parity allowlist cleanup.
- 2026-05-15: Completed T-030 by adding
  `GET /api/v2/admin/user/read/[id]` and
  `GET /api/v2/admin/comment/read/[id]` behind `requireApiAdmin()`, with
  transformed success envelopes, real `404` responses, public-safe `500`
  responses, explicit target-read `dbConnect()` ownership, focused route tests,
  and removal of the two admin read operations from the parity allowlist.
- 2026-05-15: Prepared T-031 and T-032 to clean up the remaining F-037
  favourite/watchlist/profile user fetcher drift by pruning unsupported unused
  write fetchers. This keeps the saved-item server actions and profile read
  route behavior unchanged.
- 2026-05-15: Completed T-031 by removing the unused favourite/watchlist API
  write fetchers, removing their four operations from the route/fetcher parity
  inventory and known-gap allowlist, preserving the T-028 server-action
  mutation path, and reducing the remaining F-037 allowlist to
  `user.profile.update`.
- 2026-05-15: Completed T-032 by removing the unused profile update fetcher,
  removing `user.profile.update` from the route/fetcher parity inventory,
  leaving `KNOWN_ROUTE_FETCHER_GAP_IDS` empty, and resolving F-037 with focused
  profile/parity tests, lint, build, and reference-check verification.
- 2026-05-15: Prepared T-033, T-034, and T-035 as the next post-F-037 task
  queue: user comment delete guard/status/envelope cleanup, admin article
  create/update validation, and public artwork browse query validation.
- 2026-05-15: Completed T-033 by moving user comment delete to the shared user
  guard before DB work, validating route params before transactions, preserving
  the user/blog/comment delete transaction, and returning the typed delete
  envelope with focused route coverage.
- 2026-05-15: Completed T-034 by hardening admin article create/update route
  validation with strict route schemas, parsed allowlisted persistence,
  article/artwork ObjectId validation, session-owned create author, route-local
  `dbConnect()` before article model writes, public-safe persistence failures,
  and focused route tests.
- 2026-05-15: Completed T-035 by adding route-safe public artwork browse query
  parsing for filter mode, sort option, optional hex color, repeated artwork
  filters, and bounded pagination before session lookup or `getArtworkList`.
  Focused route/service tests, lint, and build passed.
- 2026-05-15: Prepared T-036 for the remaining F-060 public shop browse query
  validation slice. It should validate shop listing query params before
  `dbConnect()`, MongoDB query construction, or Shopify product fan-out while
  preserving existing success response and valid filter behavior.
- 2026-05-15: Completed T-036 by adding route-safe public shop listing query
  parsing for repeated artwork-derived filters, product-type boolean strings,
  and optional `sortBy` before `dbConnect()`, MongoDB query construction, or
  Shopify product fan-out. Focused route tests, lint, and build passed.
- 2026-05-15: Prepared T-037 and T-038 as the remaining F-057 admin
  write-validation queue. T-037 covers artwork create/update first; T-038 covers
  blog create/update after T-037 is reconciled.
- 2026-05-15: Completed T-037 by hardening admin artwork create/update route
  validation with strict schemas, canonical artwork constants, parsed
  allowlisted persistence, update ID validation, optional replacement-image
  updates, session-owned create author, route-local `dbConnect()` before artwork
  model writes, public-safe persistence failures, and focused route tests.
- 2026-05-15: Completed T-038 by hardening admin blog create/update route
  validation with strict schemas, parsed allowlisted persistence, update ID
  validation before body reads, validated title-based slug updates and
  conflicts, session-owned create author, route-local `dbConnect()` before blog
  model work, public-safe persistence failures, and focused route tests.
- 2026-05-15: Prepared T-039 and T-040 as the next F-036 protected admin API
  guard migration queue. T-039 covers remaining admin read routes; T-040 covers
  admin delete routes after T-039 is reconciled.
- 2026-05-15: Completed T-039 by moving admin article, artwork, blog,
  collection, comment, and user read routes to `requireApiAdmin()`, preserving
  existing success/not-found/empty-list/public-safe failure semantics, adding
  route-local `dbConnect()` before target reads, and adding JSON `400` invalid
  ID handling before detail target reads.
- 2026-05-15: Completed T-040 by moving admin article, artwork, blog,
  collection, comment, and user delete routes to `requireApiAdmin()`, preserving
  existing success/not-found/conflict/cascade semantics, adding route-local
  `dbConnect()` before destructive target work, and adding JSON `400` invalid
  ID handling before target reads/writes and transaction session startup.
- 2026-05-15: Prepared T-041 for middleware API auth-response cleanup so
  unauthenticated protected API requests return JSON `401` rather than
  browser-oriented redirects.
- 2026-05-15: Completed T-041 by returning shared JSON `401` middleware
  responses for unauthenticated protected API requests, preserving admin API
  `403` behavior, and verifying focused middleware/route utility tests, lint,
  and build.
- 2026-05-15: Prepared T-042 for user comment GET/POST/PATCH route-local guard
  cleanup, including real GET failure statuses and focused comment route tests.
- 2026-05-15: Completed T-042 by moving user comment GET/POST/PATCH to
  `requireApiUser()`, moving GET auth before DB/model work, returning real
  `404`/`500` GET failures, preserving create/update validation and DTO
  behavior, and verifying focused route tests, lint, and build.
- 2026-05-15: Prepared T-043 for protected API guard inventory closure across
  user/admin route files, keeping response-helper standardization separate.
- 2026-05-15: Completed T-043 by adding a static protected API guard inventory
  test across user/admin route files. It requires the shared guard imports and
  calls, blocks direct session/admin helper checks, and verifies guard calls
  precede body, DB, model, or transaction work in exported handlers.
- 2026-05-15: Prepared T-044 as the first shared response-helper
  standardization slice. It owns a small `src/lib/api` response helper and the
  protected user profile/navigation/favourite/watchlist read routes, while
  leaving comments, admin/public/Shopify routes, field contracts, and logging
  policy separate.
- 2026-05-15: Completed T-044 by adding `src/lib/api/apiResponse.ts`, keeping
  `apiAuthError()`'s envelope unchanged through delegation, and migrating
  protected user profile/navigation/favourite/watchlist read routes to shared
  success/error helpers with real `404` missing-resource and public-safe `500`
  internal-failure statuses. Focused helper/profile/saved-route tests, guard
  inventory, lint, and build passed.
- 2026-05-15: Prepared T-045 as the next shared response-helper slice. It owns
  public artwork/article/blog detail route failures, real `404`/`500` statuses,
  public-safe `500` bodies, and focused public route tests while leaving public
  lists/search/navigation, admin routes, field contracts, and logging policy
  separate.
- 2026-05-15: Completed T-045 by migrating public artwork/article/blog detail
  routes and populated blog-comment detail routes to shared success/error
  helpers, preserving transformed DTO success envelopes and artwork optional
  user context, replacing body-only `statusCode` failures with real
  public-safe `404`/`500` responses, and verifying focused route/parity tests,
  lint, and build.
- 2026-05-15: Prepared T-046 for public collection route response-helper
  cleanup. It owns collection list/detail/artwork route helpers, real statuses,
  route-local `dbConnect()` ownership, and focused collection route tests while
  leaving public navigation, admin routes, and logging policy separate.
- 2026-05-15: Completed T-046 by migrating public collection
  list/detail/artwork routes to shared success/error helpers, preserving
  current success contracts, replacing body-only `statusCode` failures with
  real public-safe `404`/`500` responses, and adding route-local `dbConnect()`
  ownership before model reads.
- 2026-05-15: Prepared T-047 for public navigation route response-helper
  cleanup. It owns article/collection navigation route helpers, real statuses,
  route-local `dbConnect()` ownership, touched debug-log removal, and focused
  public navigation route tests while leaving admin routes, field contracts,
  Shopify product ID/admin-linking, and global logging policy separate.
- 2026-05-15: Completed T-047 by migrating public article/collection navigation
  routes to shared success/error helpers, preserving current navigation success
  contracts, replacing body-only `statusCode` failures with real public-safe
  `404`/`500` responses, adding route-local `dbConnect()` ownership before
  model reads where it was missing, and verifying focused navigation/parity
  tests, lint, and build.
- 2026-05-15: Prepared T-048 for admin read route response-helper cleanup. It
  owns article/artwork/blog/collection/comment/user read list/detail helper
  usage, real statuses, public-safe internal failure bodies, and focused admin
  read route tests while leaving admin writes/deletes, field contracts, Shopify
  product ID/admin-linking, and global logging policy separate.
- 2026-05-15: Completed T-048 by migrating admin
  article/artwork/blog/collection/comment/user read list/detail routes to
  shared success/list/error response helpers, preserving `requireApiAdmin()`,
  invalid-ID `400` responses, transformed DTOs, list metadata, empty-list and
  missing-resource `404`s, DB-before-model ordering, and public-safe internal
  `500` bodies. Focused admin read/parity tests, lint, and build passed.
- 2026-05-15: Prepared T-049 for admin delete route response-helper cleanup.
  It owns article/artwork/blog/collection/comment/user delete helper usage,
  real statuses, public-safe internal failure bodies, direct debug-log removal,
  and focused admin delete route tests while leaving admin create/update routes,
  field contracts, Shopify product ID/admin-linking, and global logging policy
  separate.
- 2026-05-15: Completed T-049 by migrating admin
  article/artwork/blog/collection/comment/user delete routes to shared
  success/error response helpers, preserving `requireApiAdmin()`, invalid-ID
  `400` responses, route-specific success messages, `data: null`,
  missing-resource `404`s, artwork conflict `409`, cascade behavior,
  transaction abort/commit/end behavior, DB-before-model ordering, and
  public-safe internal `500` bodies. Focused admin delete/helper/parity tests,
  lint, and build passed.
- 2026-05-15: Completed T-050 by migrating admin article/artwork/blog/collection
  create/update routes to shared success/error response helpers, preserving
  structured validation `400` bodies, create `201`s, update DTOs, missing
  resource `404`s, blog slug conflict `409`, allowlisted persistence,
  guard/body-read/DB ordering, and public-safe internal `500` bodies. Focused
  admin create/update/helper/parity tests, lint, and build passed.
- 2026-05-15: Prepared T-051 for the focused F-040 public transform contract
  slice. It owns blog `readTime`, collection `firstArtworkId`, public user
  `isOwner`, and comment ownership-state coverage/fixes while leaving the
  broader F-039 field matrix, F-041 image sanitization, Shopify product
  ID/admin-linking, and global logging policy separate.

## Next Agent Action

Assign T-051:
`/task effort: high details: docs/tasks/T-051-add-public-transform-contract-coverage.md`
