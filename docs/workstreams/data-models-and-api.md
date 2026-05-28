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
- T-068 removed direct debug `console.log` output from the public shop listing
  route while preserving query validation, MongoDB filter construction,
  malformed ID skipping, product ID deduplication, Shopify fetch fan-out,
  success envelope, and metadata behavior.
- T-082 added admin artwork create/update validation for optional
  `shopifyProducts` writes, enforcing numeric product IDs, known product types,
  and no within-artwork duplicate product IDs before persistence.
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
- T-070 moved the public collection navigation list query, selected fields,
  ordering, transform, `maxTimeMS`, metadata construction, and `dbConnect()`
  ownership into `getCollectionNavigationList`, shared by the API route and
  collections subnav loader.
- T-048 completed the next response-helper slice, scoped to admin read routes
  with shared success/error helpers, real empty-list/missing-resource/internal
  failure statuses, public-safe `500` bodies, and preserved guard behavior,
  invalid-ID validation, success DTOs, metadata, and DB-before-model ordering.
- T-314 added client-safe admin read API path builders for the supported
  article, artwork, blog, collection, comment, and user read resources. Admin
  read fetchers now share list/detail path construction while preserving
  pagination, search, filter query-string behavior, and encoded detail IDs.
- T-049 completed the next response-helper slice, scoped to admin delete routes
  with shared success/error helpers, preserved success messages, `data: null`,
  conflict handling, missing-resource/internal-failure statuses, cascade
  behavior, transactions, guard/DB ordering, and touched debug-log removal.
- T-050 completed the final currently staged admin response-helper slice,
  scoped to admin create/update routes with shared success/error helpers while
  preserving validation responses, success DTOs, create statuses, allowlisted
  persistence, not-found/conflict statuses, and guard/DB ordering.
- T-051 completed the focused F-040 public transform contract slice: blog
  `readTime` is derived from text, collection `firstArtworkId` uses `null`
  instead of `undefined` for empty collections, public user transforms compute
  `isOwner` from caller context while filtering sensitive fields, and populated
  blog/comment transforms preserve comment/user ownership context. The public
  collection card link now coalesces null `firstArtworkId` values to the
  existing empty-string fallback.
- T-052 completed the bounded F-041 public artwork image contract slice: public
  image sanitization, explicit optional color-proximity metadata typing, and
  Cloudinary color schema tightening.
- T-053 created the durable F-039 core field contract matrix for article
  `section`, blog `imageUrl`/`pinned`/`tags`, and user `password`; runtime
  alignment remains open through the follow-up task candidates in
  [data-field-contracts.md](../architecture/data-field-contracts.md).
- T-054 completed the article `section` runtime alignment slice: admin article
  filter section options now derive from `ARTICLE_SECTION_OPTIONS`, and focused
  regression coverage confirms `"collections"` remains invalid for article
  create/update schemas while collection routes stay separate.
- T-055 completed the blog `imageUrl`/`pinned`/`tags` runtime alignment slice:
  persisted blogs now require `imageUrl` and default `tags` to `[]`; admin blog
  route schemas accept/default `pinned` and `tags`, reject invalid tags before
  blog reads/writes, and persist only parsed allowlisted fields.
- T-135 applies the shared content image URL allowlist to admin article, blog,
  and collection create/update schemas so unsupported image hosts fail with
  structured validation errors before model reads or writes.
- T-056 completed the remaining scoped F-039 user `password` runtime alignment
  slice: persisted user types allow missing passwords for OAuth-created users,
  credentials auth rejects users without stored hashes before bcrypt
  verification, existing hashed credentials users still authorize with roles,
  and public/own user DTOs continue omitting passwords.
- T-070 completed the public collection navigation service slice: the API route
  now adapts `getCollectionNavigationList` results into the existing success
  envelope, `404` no-results response, and public-safe `500` response.
- T-071 completed the article navigation service slice: the public article
  navigation route now adapts the shared `getArticleNavigationList` service
  into the existing success envelope, `404` no-results response, and
  public-safe `500` response.
- T-072 reused `getArticleNavigationList` from remaining article navigation page
  consumers without changing the API route contract.
- T-073 added a shared collection navigation item service and reused collection
  navigation services from collection redirect pages and the public collection
  navigation item route.
- T-074 added a shared populated article detail service for the public article
  detail route and `ArticleLoader`.
- T-075 shares blog detail service logic between `BlogDetailLoader` and the
  public blog detail routes.
- T-076 shares blog list service logic between `GET /api/v2/public/blog`,
  `BlogListLoader`, and `BlogSectionLoader`.
- T-078 shares collection artwork service logic between the public collection
  artwork routes, `CollectionArtworkLoader`, and
  `CollectionArtworksPaginationLoader`.
- T-079 shares article list service logic between
  `GET /api/v2/public/article` and `BiographySectionLoader`.
- T-080 shares collection list service logic between
  `GET /api/v2/public/collection` and `CollectionSectionLoader`.
- T-081 shares account navigation service logic between
  `GET /api/v2/user/navigation` and `AccountSubnavLoader`.
- T-083 shares saved-artwork service logic between the protected user
  favourite/watchlist read routes and the account favourites/watchlist loaders.
- T-084 shares profile/comment read service logic between the protected user
  profile/comment GET routes and the account settings/comments loaders.
- T-085 shares public shop product listing service logic between
  `GET /api/v2/public/shop/products` and `ShopProductsLoader`. The service owns
  DB connection setup, artwork Shopify-link filtering, product-type filtering,
  numeric product ID normalization/skipping, deduplication, Shopify fan-out,
  and metadata construction after route query parsing succeeds.
- A-020 found data/API follow-ups for newsletter consent/source fields and
  unsubscribe workflow, product enquiry context persistence, comment
  retention/deletion expectations, and account privacy actions.
- A-021 found API observability follow-ups for request/correlation IDs,
  structured redacted logging, and public incident/request identifiers on
  internal failure responses.
- T-100 added optional `productHandle` support to the public enquiry DTO and
  Mongoose model. The public enquiry route persists normalized valid handles
  and rejects malformed product context with a validation `400`.
- T-208 adds Shopify's hosted public product URL to the Shopify product DTO and
  `SimpleProduct` as `onlineStoreUrl`. Product list, handle, and ID transforms
  preserve valid absolute HTTP(S) URLs and normalize missing, empty, relative,
  malformed, or non-HTTP(S) values to `null`.
- T-154 added route-local runtime validation for public article list
  `section`, article navigation `[section]`, and collection list `section`
  inputs before service calls, using canonical taxonomy constants.

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
- Build additional field matrices for artwork, collection, comment, enquiry,
  and subscriber records when implementation work discovers unresolved
  required/optional drift outside the T-053 scope.
- Add validation policy for create and update routes, including `safeParse` or
  equivalent 400 responses instead of broad 500s for validation failures.
- Fix high-risk route DTO mismatches for user profile and admin content writes.
- Migrate admin create/update routes toward allowlisted schemas, ObjectId
  validation, real 400 validation responses, and route tests by content type.
- Replace raw exception responses with stable public-safe errors across public,
  user, and admin routes.
- Add request/correlation ID propagation to public-safe internal failure
  responses after the logging policy task is scoped.
- Add newsletter consent/source metadata and unsubscribe route behavior after
  owner/legal requirements are accepted.
- Harden admin read-list `page`/`limit` query parsing and bounds before adding
  main read-tab pagination, route-backed filters, or search.
- Document pagination and filtering contracts for artwork, collection, blog,
  article, search, and shop endpoints.
- Choose list empty-state semantics and search pagination metadata behavior.
- Decide whether public search is site-wide; if yes, extend search schema,
  service, DTOs, and result metadata for artworks and shop products, and if no,
  make the narrower scope explicit in route/UI contracts.
- Decide collection section launch policy for non-`collections` values, then
  align public/admin contracts if the owner chooses to narrow or expose those
  sections.
- Document whether admin action-segment API paths are canonical, or open an ADR
  for a resource-oriented migration plan.
- Audit form/input validation from UI through API persistence.
- Add tests for remaining high-risk transforms and route utilities, including
  artwork image sanitization, color-sort payloads, and broader field-matrix
  decisions.

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
- 2026-05-15: Completed T-051 by adding focused public transform contract
  tests and fixing the F-040 drift: blog transforms now derive `readTime`,
  collection transforms return `firstArtworkId: null` for empty collections,
  public user transforms compute `isOwner` without exposing `email` or
  `password`, and populated comment/blog paths preserve caller `userId`
  ownership context. The public collection card link coalesces null
  `firstArtworkId` values to the existing empty-string fallback. Focused
  transform tests, full Jest, lint, and build passed.
- 2026-05-15: Prepared T-052 for the focused F-041 public artwork image
  contract slice. It owns `image.public_id` sanitization, explicit
  color-proximity `similarityScore` behavior, Cloudinary color schema
  validation, and focused public/admin artwork tests while leaving upload
  policy, Shopify product-linking, global logging, and the broader F-039 field
  matrix separate.
- 2026-05-15: Completed T-052 by routing `transformArtwork.toFrontend()` and
  populated artwork transforms through the Cloudinary image sanitizer,
  preserving public-safe image fields, typing `similarityScore` as optional
  public-only image metadata, and tightening Cloudinary color schema validation
  to strict `{ color, percentage }` objects. Focused artwork image contract,
  artwork list, public/admin artwork route tests, lint, and build passed.
- 2026-05-15: Prepared T-053 as the documentation-first F-039 field contract
  matrix. It owns article `section`, blog `imageUrl`/`pinned`/`tags`, and user
  `password` model/schema/type/UI-auth alignment recommendations before any
  runtime field fixes are assigned.
- 2026-05-15: Completed T-053 by creating
  [data-field-contracts.md](../architecture/data-field-contracts.md), linking
  it from architecture docs, and recording implementation-ready follow-up
  candidates: T-054 for article section UI constants, T-055 for blog
  `imageUrl`/`pinned`/`tags`, and T-056 for user `password` credentials/OAuth
  alignment. No runtime behavior changed.
- 2026-05-15: Prepared T-054 as the first F-039 runtime field-contract slice.
  It owns article `section` UI option alignment with
  `ARTICLE_SECTION_OPTIONS` and focused regression coverage rejecting the stale
  `"collections"` article section while keeping collection routes separate.
- 2026-05-15: Completed T-054 by deriving admin article filter section options
  from `ARTICLE_SECTION_OPTIONS`, exporting the narrow
  `ARTICLE_FILTER_OPTIONS` contract for regression coverage, and proving
  `createArticleSchema` plus `updateArticleRouteBodySchema` reject
  `section: "collections"`. Focused tests, lint, and build passed.
- 2026-05-15: Prepared T-055 as the next F-039 runtime field-contract slice.
  It owns blog `imageUrl`, `pinned`, and `tags` model/schema/admin route
  alignment while leaving visible admin workflow, public filtering behavior,
  and user password/OAuth alignment separate.
- 2026-05-15: Completed T-055 by aligning blog field contracts across the
  model, route schemas, admin create/update persistence, and focused tests:
  `imageUrl` is required on persisted blogs, `tags` defaults to `[]`, route
  create defaults omitted `pinned`/`tags`, create/update accept explicit
  replacements, invalid tags return structured `400`s before blog model
  reads/writes, and visible admin forms remain unchanged.
- 2026-05-15: Prepared T-056 as the remaining F-039 runtime field-contract
  slice. It owns user `password` optional persisted typing and credentials/OAuth
  authentication behavior while preserving registration/login password
  requirements and frontend password sanitization.
- 2026-05-15: Completed T-056 by making `UserBase.password` optional, guarding
  credentials authentication against missing stored hashes before bcrypt
  verification, preserving credentials role propagation for hashed users, and
  extending focused auth/transform tests for OAuth-style missing-password
  denial and public/own password sanitization. Focused tests, lint, and build
  passed.
- 2026-05-15: Prepared T-057 for the focused F-012 Shopify product ID
  normalization slice. It should centralize numeric product ID validation/GID
  construction and apply it to public Shopify product reads without changing
  admin linking, data migration, checkout/cart, product transforms, sorting, or
  pagination.
- 2026-05-15: Completed T-057 by adding shared Shopify product ID
  normalization/GID construction for public product reads. Invalid path IDs
  still return `400` before Shopify calls, and invalid stored listing IDs are
  skipped before Shopify fan-out with deduplication after normalization.
- 2026-05-15: Prepared T-058 for the read-only F-012 existing-data audit. It
  should report invalid Shopify product IDs, duplicate links, and migration
  needs without mutating MongoDB or calling Shopify APIs.
- 2026-05-15: Completed T-058 by adding a read-only MongoDB audit for artwork
  Shopify product links. The audit mirrors public-read numeric ID validation,
  flags stored GID-style and other malformed values, reports duplicate links,
  and leaves admin writes and actual data migration separate.
- 2026-05-15: Prepared T-059 to execute the read-only Shopify product-link audit
  against the owner-approved MongoDB environment and use the evidence to scope
  any owner-approved cleanup or admin-write validation follow-up.
- 2026-05-15: T-059 attempted `npm run audit:shopify-products`, but the command
  exited `1` before connecting because `MONGO_URI` was not set. Existing-data
  audit evidence remains blocked on the owner-approved MongoDB target.
- 2026-05-17: Completed T-059 against the owner-approved MongoDB Atlas
  `laoutarisDB` target. The audit exited `0` after scanning 215 artworks and
  found 0 invalid Shopify product IDs, 0 unknown product types, and 0
  within-artwork duplicates. It reported 1 review-only cross-artwork duplicate
  book group for product `10538937319688` across 92 artworks, so current audit
  evidence does not indicate a product-ID cleanup or migration.
- 2026-05-16: Prepared T-061 as the next F-014/F-013 product DTO contract slice.
  It should carry Shopify `productType` and `tags` through `SimpleProduct` and
  use that explicit metadata for default shop type sorting while leaving
  variants, checkout data, description HTML, pagination, and admin linking
  separate.
- 2026-05-16: Completed T-061; the Shopify transform now carries
  `productType` and `tags` through `SimpleProduct` for list, handle, and ID
  reads, while variants, checkout data, description HTML, pagination, and admin
  linking remained separate.
- 2026-05-16: Prepared T-062 as the next F-014 Shopify transform slice. It
  should preserve queried variant metadata in `SimpleProduct` while leaving
  checkout/cart behavior, product-detail CTA changes, description HTML,
  pagination, admin linking, and data migration separate.
- 2026-05-16: Completed T-062; the Shopify transform now preserves variant
  IDs, titles, availability, price money, compare-at price money, and optional
  variant image URL/alt text for list, handle, and ID reads, with no-variant
  products returning `variants: []`.
- 2026-05-16: Prepared T-063 as the next F-014 Shopify transform slice. It
  should preserve queried `descriptionHtml` in `SimpleProduct` while leaving
  rich HTML rendering, sanitization policy, product-detail UI, checkout/cart,
  pagination, admin linking, and data migration separate.
- 2026-05-16: Completed T-063; `SimpleProduct` now preserves queried Shopify
  `descriptionHtml` for list, handle, and ID reads while existing plain
  `description`, product metadata, variant metadata, API envelopes,
  product-detail UI, checkout/cart, and admin linking remain unchanged.
- 2026-05-22: Prepared T-208 as the next Shopify DTO/API contract slice. It
  should carry Shopify's hosted public product URL through product list, handle,
  and ID reads so product detail pages can hand off to Shopify-hosted purchase
  when available, while preserving enquiry fallback and keeping app-owned
  cart/checkout separate.
- 2026-05-22: Completed T-208. Shopify product queries now request
  `onlineStoreUrl`, `SimpleProduct.onlineStoreUrl` carries valid hosted URLs
  through list, handle, and ID reads, and invalid or missing hosted URL values
  normalize to `null` without changing variant, price, image, product type,
  tags, metafield, or description behavior.
- 2026-05-16: Prepared T-068 as a no-contract-change shop API cleanup. It
  should remove public shop product-listing route debug logs while preserving
  query validation, MongoDB filter construction, malformed ID skipping,
  deduplication, Shopify fan-out, success envelope, and metadata.
- 2026-05-16: Completed T-068; the public shop product-listing route no longer
  emits direct `console.log` debug output on normal requests, and focused route
  plus source hygiene tests preserve the existing query validation, filter,
  malformed ID skipping, deduplication, response envelope, and metadata
  behavior.
- 2026-05-16: Prepared T-069 as a no-contract-change shared fetcher cleanup. It
  should remove direct request/URL/response debug logs from `createFetcher` and
  URL debug logs from server public/user/admin API helpers while preserving
  current fetch error handling and same-app URL construction.
- 2026-05-16: Completed T-069 as a no-contract-change shared fetcher cleanup.
  `createFetcher` no longer emits direct request/URL/response debug logs, and
  the server public/user/admin API helpers no longer emit URL debug logs or keep
  stale commented URL debug blocks. Focused tests cover the preserved fetcher
  envelope, header, and error behavior.
- 2026-05-16: Prepared T-070 as a collection navigation service extraction.
  The public collection navigation route and `CollectionsSubnavLoader` should
  share one server-only query/transform service while preserving route
  envelopes and loader link behavior.
- 2026-05-16: Completed T-070; `getCollectionNavigationList` now owns the
  collection navigation list `dbConnect()`, query, selection, sort, timeout,
  transform, no-results signal, and metadata, while the public route preserves
  the existing success, `404`, and public-safe `500` envelopes.
- 2026-05-16: Prepared T-071 as an article navigation service extraction. The
  public article navigation route, `BiographySubnavLoader`, and `MainNavLoader`
  should share one server-only query/transform service while preserving route
  envelopes and loader link behavior.
- 2026-05-16: Completed T-071; `getArticleNavigationList` now owns the article
  navigation list `dbConnect()`, query, selection, `displayDate: -1` sort,
  transform, no-results signal, and metadata, while the public route preserves
  the existing success, `404`, and public-safe `500` envelopes. T-283 later
  removed `MainNavLoader` from live article navigation reads so the root header
  no longer performs MongoDB access during static shell prerendering.
- 2026-05-16: Prepared T-072 to reuse the completed article navigation service
  from `src/app/biography/page.tsx` and the navigation path in `ArticleLoader`
  without changing article detail data access.
- 2026-05-16: Completed T-072; remaining article navigation page consumers now
  use `getArticleNavigationList` directly, with no public article navigation
  API contract changes and no article-detail service extraction.
- 2026-05-16: Completed T-073; `getCollectionNavigationItem` now owns the
  single collection navigation item DB connection, query, selection, transform,
  and not-found result, while the public route preserves the existing success,
  `404`, and public-safe `500` response contract.
- 2026-05-16: Completed T-074; `getArticleBySlugPopulated` now owns the
  populated article detail DB connection, `slug` lookup, `author artwork`
  population, lean typing, transform, and not-found result, while the public
  article detail route preserves its optional session lookup before service
  work plus the existing success, `404`, and public-safe `500` contract.
- 2026-05-16: Completed T-075; `getBlogBySlugWithAuthor` now owns the
  non-comments blog detail DB connection, `slug` lookup, `comments` and
  `author` population, lean typing, transform, and not-found result.
  `getBlogBySlugWithComments` now owns the populated-comments detail DB
  connection, `slug` lookup, `comments.author` population, lean typing,
  transform, and not-found result. Both public blog detail routes preserve
  their existing success, `404`, and public-safe `500` contracts.
- 2026-05-16: Prepared T-076 to move the public blog list query, sort/filter,
  transform, metadata, and DB ownership into a shared service used by
  `GET /api/v2/public/blog`, `BlogListLoader`, and `BlogSectionLoader`.
- 2026-05-16: Completed T-076; `getBlogList` now owns public blog list DB
  connection setup, current sort/filter behavior, pagination, transform, and
  metadata, while `GET /api/v2/public/blog` preserves the existing valid
  success envelope, invalid `sortby` body, and public-safe `500` body.
- 2026-05-16: Prepared T-078 to move collection artwork list/detail lookup
  behavior into shared service logic used by
  `GET /api/v2/public/collection/[slug]/artwork`,
  `GET /api/v2/public/collection/[slug]/artwork/[id]`, and the corresponding
  server loaders.
- 2026-05-16: Completed T-078; `getCollectionWithArtworks` now owns the
  populated collection artwork list DB connection, `slug` lookup, `artworks`
  population, lean typing, and transform. `getCollectionArtwork` now owns the
  selected artwork-in-collection DB connection, `slug` lookup, matching artwork
  population, collection-missing/artwork-missing distinction, and preserved
  success data shape. Both public routes preserve their existing success,
  `404`, and public-safe `500` contracts.
- 2026-05-16: Prepared T-079 to move the public article list query, optional
  section/field filters, pagination, transform, metadata, and DB ownership into
  shared service logic used by `GET /api/v2/public/article` and
  `BiographySectionLoader`.
- 2026-05-16: Completed T-079; `getArticleList` now owns public article list
  DB connection setup, optional section and field selection, pagination,
  transform, metadata, and no-results service behavior while the public article
  list route preserves its existing success, no-results, and public-safe `500`
  response bodies.
- 2026-05-16: Prepared T-080 to move the public collection list query, optional
  section filter, pagination, transform, metadata, and DB ownership into shared
  service logic used by `GET /api/v2/public/collection` and
  `CollectionSectionLoader`.
- 2026-05-16: Completed T-080; `getCollectionList` now owns public collection
  list DB connection setup, optional section filtering, pagination, transform,
  metadata, missing-list service behavior, and empty-array success semantics
  while the public collection list route preserves its existing success,
  missing-list, and public-safe `500` response bodies.
- 2026-05-17: Prepared T-081 to move the user account navigation query,
  `favourites`/`watchlist`/`comments` field selection, transform, missing-user
  handling, and DB ownership into shared service logic used by
  `GET /api/v2/user/navigation` and `AccountSubnavLoader`.
- 2026-05-17: Completed T-081; `getOwnUserNavigation` now owns user account
  navigation DB connection setup, current-user lookup, selected
  `favourites`/`watchlist`/`comments` fields, `transformAccountNav` mapping,
  and missing-user service behavior while the user navigation route preserves
  its existing guard, success, `404`, and public-safe `500` bodies.
- 2026-05-17: Completed T-082; admin artwork create/update route schemas now
  validate optional `shopifyProducts` writes before persistence, trimming
  numeric product IDs, rejecting GID-style or non-numeric IDs, requiring known
  product types, and blocking within-artwork duplicate product IDs. The T-059
  audit found no data migration need, and T-082 performed no MongoDB mutation.
- 2026-05-17: Completed T-083; `getOwnSavedArtwork` now owns current-user
  favourite/watchlist list and detail DB connection setup, populated saved-list
  reads, artwork detail lookup, user-aware transform state, list metadata, and
  missing/not-saved service behavior while the protected user routes preserve
  their existing guards, success envelopes, `404`s, and public-safe `500`s.
- 2026-05-17: Completed T-084; `getOwnUserProfile` now owns current-user
  profile DB connection setup, password exclusion, and own-user frontend DTO
  transformation, while `getOwnUserComments` owns current-user populated
  comment reads, transformed comment DTOs, list metadata, missing-user service
  behavior, and DB connection setup. The protected user profile/comment GET
  routes preserve their existing guards, success envelopes, failure statuses,
  and public-safe `500`s.
- 2026-05-17: Completed T-085; `getShopProductList` now owns public shop
  product listing DB connection setup, artwork filtering, Shopify product-link
  extraction, product-type filtering, product ID normalization/skipping and
  deduplication, Shopify fan-out, per-product fetch failure skipping, and
  metadata construction. The public shop products route preserves its query
  validation, success envelope, validation `400`s, and public-safe `500`.
- 2026-05-18: Reconciled A-020 and A-021 into data/API follow-ups for
  consent/unsubscribe fields, product enquiry context, account/comment privacy
  actions, request IDs, and structured logging.
- 2026-05-18: Prepared T-099 for request IDs and structured logging, and T-100
  for product enquiry context persistence.
- 2026-05-18: Completed T-100 for public enquiry product context persistence.
  Ordinary enquiry payloads still work without product context, valid handles
  are normalized before persistence, and invalid product context is rejected
  before `dbConnect()` or `EnquiryModel.create()`.
- 2026-05-18: Completed T-099 for the first API request ID/logging slice.
  `apiErrorResponse()` can now include public request IDs and
  `X-Request-Id`, and representative public navigation, protected user
  profile, and admin collection read failure paths use request context plus
  structured redacted logging without changing success contracts.
- 2026-05-18: Prepared T-117 as the next request ID/logging migration slice for
  public content API list/detail internal-failure paths that still use direct
  route-level `console.error()`.
- 2026-05-18: Completed T-117 for public article, blog, artwork, and
  collection API read routes. Internal failures now use request context plus
  structured redacted logging, real `500` responses include `requestId` and
  `X-Request-Id`, and success, validation, `404`, and legacy list pseudo-500
  bodies were preserved.
- 2026-05-18: Prepared T-118 as the next request ID/logging migration slice for
  public search, navigation, and shop product API internal/upstream failure
  paths that still use direct route-level `console.error()`.
- 2026-05-18: Completed T-118 for public search, navigation, and shop product
  API routes. Internal/upstream failures now use request context plus
  structured redacted logging, real `500` responses and the Shopify upstream
  `502` response include `requestId` and `X-Request-Id`, and success,
  validation `400`, missing-resource `404`, query parsing, Shopify ID
  normalization, and client fetcher contracts were preserved.
- 2026-05-18: Prepared T-119 as the next request ID/logging migration slice for
  protected user favourite, watchlist, and comment API internal-failure paths
  that still use direct route-level `console.error()`.
- 2026-05-18: Completed T-119 for protected user favourite, watchlist, and
  comment API routes. Internal failures now use request context plus structured
  redacted logging, scoped `500` responses include `requestId` and
  `X-Request-Id`, and auth, validation `400`, missing-resource `404`,
  forbidden `403`, ownership, transaction, success DTO, and existing
  action/loader contracts were preserved.
- 2026-05-18: Prepared T-120 as the next request ID/logging migration slice for
  admin read list/detail API internal-failure paths that still use direct
  route-level `console.error()`. Admin write/delete route migration remains
  separate.
- 2026-05-18: Completed T-120 for scoped admin read list/detail API routes.
  Internal failures now use request context plus structured redacted logging,
  scoped `500` responses include `requestId` and `X-Request-Id`, and
  `requireApiAdmin()` guard behavior, invalid-ID `400`s,
  empty-list/missing-resource `404`s, pagination metadata, success DTOs,
  transforms, and DB-before-model ordering were preserved.
- 2026-05-18: Prepared T-121 as the next request ID/logging migration slice for
  admin create, update, and delete API internal-failure paths that still use
  direct route-level `console.error()`.
- 2026-05-18: Completed T-121 for scoped admin create, update, and delete API
  routes. Internal failures now use request context plus structured redacted
  logging, scoped `500` responses include `requestId` and `X-Request-Id`, and
  shared admin guards, validation `400`s, invalid-ID handling, missing-resource
  `404`s, conflict `409`s, mutation success contracts, allowlisted
  persistence, cascade behavior, and transaction cleanup were preserved.
- 2026-05-18: Prepared T-122 to protect the completed API route logging
  migration with recursive source-hygiene coverage across `src/app/api/v2`
  route handler files. The task should not alter route contracts or lower-level
  service/client logging behavior.
- 2026-05-18: Completed T-122 by adding recursive API-v2 route handler
  source-hygiene coverage for direct `console.error()` and `console.warn()`
  calls. The guard changes test coverage only; route contracts and lower-level
  service/client logging behavior were not changed.
- 2026-05-19: Completed T-135 by hardening admin article, blog, and collection
  image URL schemas with the T-101 Cloudinary/external-host policy while
  preserving DTO shapes, field names, auth behavior, and successful persistence
  for already-allowed URLs.
- 2026-05-19: T-140 reconciled A-011, A-017, and A-018 data/API findings into
  F-093, F-098, F-099, F-103, and updated F-049/R-006. T-142 is prepared for
  admin artwork relationship existence checks; public search scope, search
  metadata, and section runtime validation remain separate follow-ups. T-145
  later resolved `/artwork` page/API query parity.
- 2026-05-19: Completed T-142 by adding route-local artwork existence checks to
  admin article create/update and collection `artworksToAdd` writes, with
  focused admin article/collection route coverage.
- 2026-05-19: Completed T-144's shared fetcher slice by preserving structured
  error-envelope fields such as `fieldErrors` and `formErrors` for client form
  consumers without changing route envelopes.
- 2026-05-19: Completed T-145 by aligning `/artwork` page query parsing,
  defaults, valid filter normalization, invalid enum fallback, and pagination
  bounds with the shared public artwork query schema.
- 2026-05-19: Completed T-151 by adding per-type public search metadata for
  articles, blogs, and collections, with selected-type pagination state exposed
  through the service/API/page contract.
- 2026-05-19: Prepared T-154 for route-local runtime validation of public
  article and collection section parameters using canonical taxonomy constants.
- 2026-05-20: Completed T-154. Public article list `section`, article
  navigation `[section]`, and collection list `section` inputs now validate
  against canonical constants before service calls, with public-safe `400`
  responses for invalid values. Collection section launch policy and i18n label
  direction remain separate owner decisions.
- 2026-05-20: Prepared T-156 for a read-only admin delete cascade preview
  contract across current destructive delete resources, before any delete UI,
  backup/review evidence, or audit-event changes.
- 2026-05-20: Completed T-156. The admin API now exposes read-only delete
  preview routes for article, artwork, blog, collection, comment, and user
  resources, with a typed contract for target identity, blockers, delete
  impacts, detach/update impacts, preserved records/assets, and production
  evidence reminders.
- 2026-05-20: Completed T-163. Admin delete preview fetchers now call the
  preview routes through a client-safe type boundary while existing destructive
  delete fetchers still call the same `DELETE` routes. Route/fetcher parity was
  updated for the new preview operations.
- 2026-05-20: Completed T-164. Destructive admin delete fetchers now send the
  validated evidence payload, and article/artwork/blog/collection/comment/user
  delete routes reject missing or invalid backup/review evidence before
  destructive mutation.
- 2026-05-20: Completed T-165. A server-only
  `AdminDeleteAuditEventModel` and helper now persist redacted destructive
  admin delete audit receipts with safe evidence references and summarized
  preview counts. Article, artwork, blog, collection, comment, and user delete
  routes create the receipt before destructive mutation and return a
  public-safe failure without mutation if receipt creation fails.
- 2026-05-20: Completed T-171 and T-173. T-171 found all audited article,
  blog, and collection image URLs compatible with the current Cloudinary
  delivery policy. T-173 found that admin read-list routes already return
  pagination metadata but needed shared query bounds before UI pagination,
  filters, or search expanded.
- 2026-05-20: Completed T-174. Article, artwork, blog, collection, comment,
  and user admin read-list routes now share bounded `page`/`limit` parsing with
  structured `400` responses for invalid pagination values before resource
  list queries.
- 2026-05-20: Completed T-175. The main admin blog read tab now consumes the
  existing blog read-list pagination metadata. Route-backed filter contracts
  remain the next data/API-adjacent admin archive slice.
- 2026-05-20: Completed T-176. Admin blog read `featured` and year filters now
  use route-backed `filterKey`/`filterValue` query params and apply before
  `countDocuments()` and paginated `find()` calls.
- 2026-05-20: Completed T-177. Admin blog read search now uses bounded
  route-backed `search` query parsing, escapes regex metacharacters, searches
  title/slug only, and applies before both `countDocuments()` and paginated
  `find()` calls.
- 2026-05-20: Completed T-179. Admin collection read search now uses bounded
  route-backed `search` query parsing, escapes regex metacharacters, searches
  title/slug only, and applies before both `countDocuments()` and paginated
  `find()` calls.
- 2026-05-20: Completed T-180. Admin article read filters now use route-backed
  `filterKey`/`filterValue` query params, and article search uses bounded
  route-backed `search` query parsing over title/slug before both
  `countDocuments()` and paginated `find()` calls.
- 2026-05-20: Completed T-181. Admin artwork read filters now use constrained
  route-backed `filterKey`/`filterValue` query params, and artwork search uses
  bounded route-backed `search` query parsing over title before both
  `countDocuments()` and paginated `find()` calls.
- 2026-05-20: Completed T-182. The comment and user main admin read tabs now
  consume the existing comment/user read-route pagination metadata without
  route contract changes.
- 2026-05-20: Completed T-183. The shared admin read pagination-control
  extraction was frontend-only and made no data/API route, fetcher, query, or
  contract changes.
- 2026-05-22: Prepared T-210 as the next public search data/API slice. It adds
  MongoDB-backed artwork results to the public search schema, result types, and
  service while keeping Shopify product search out of scope.
- 2026-05-22: Completed T-210. `/api/v2/public/search` now accepts
  `type=artworks`; all-type public search includes MongoDB-backed artwork
  results; `getPublicSearchResults` queries `ArtworkModel` by escaped title
  regex plus exact artwork taxonomy matches and maps results to the shared
  search DTO with sanitized Cloudinary image URLs.
- 2026-05-22: Prepared T-211 as the next public search data/API slice. It adds
  Shopify product results to the public search schema, result types, service,
  and metadata by reusing the existing public shop product-list service path.
- 2026-05-22: Completed T-211. `/api/v2/public/search` now accepts
  `type=shop-products`; all-type public search includes Shopify product results
  from `getShopProductList()`; and product result metadata uses the same
  per-type pagination contract as articles, blogs, collections, and artworks.
- 2026-05-22: Completed T-212 as a docs-only compliance decision-packet task.
  The owner later approved the packet recommendations for implementation
  scoping. Newsletter consent/source fields, unsubscribe routes, account
  privacy actions, and contact/comment retention behavior remain separate
  implementation tasks; T-213 is frontend-only for privacy/terms routes and
  footer legal links.
- 2026-05-22: Completed T-213 as the frontend policy-route/footer-link slice.
  Prepared T-214 as the next data/API compliance slice for newsletter
  consent/source metadata and public unsubscribe behavior.
- 2026-05-22: Completed T-214. New subscriber records now persist
  consent/source metadata and a generated public unsubscribe identifier, and
  public unsubscribe behavior marks matching subscribers unsubscribed without
  exposing private subscriber data. Account acknowledgement metadata remained
  separate until T-215.
- 2026-05-22: Completed T-215. New credentials and OAuth-created users can now
  persist optional account privacy acknowledgement metadata with privacy
  version, terms version, accepted timestamp, accepted-by surface, and source,
  while historical users remain valid and existing adapter defaults are
  preserved.
- 2026-05-22: Completed T-216. The comment posting notice/manual handoff slice
  made no schema, API, persistence, moderation-state, request-persistence, or
  retention automation changes.
- 2026-05-22: Completed T-217. The contact/product and artwork enquiry notice
  slice made no enquiry schema, API, persistence, stored notice metadata,
  operator workflow, or retention automation changes.

## Next Agent Action

T-264 is complete for reciprocal delete-reference data integrity, and T-266,
T-269, and T-270 are complete for the A-028 public search/shop/collection route
contract slices that touched data/API behavior. Do not reassign those unless
artwork delete, collection delete, explicit shop-product search, shop `sortBy`,
or stale collection slug not-found behavior regresses.

T-174's data/API prerequisite, T-175's blog pagination pilot, T-176's
route-backed filter contract, T-177's route-backed search pilot, and T-179's
collection pagination/search rollout are complete. T-180's article
pagination/filter/search rollout is also complete, and T-181 completed the
artwork pagination/filter/search route contract. T-182 consumed existing
comment/user route metadata without changing route contracts. T-183 was a
frontend-only pagination-control extraction. No additional data/API admin
archive task is open.
T-208 is complete for the Shopify hosted product URL DTO/API contract. No
additional data/API task is open for this handoff unless a future cart/checkout
decision introduces line-item, variant-selection, or checkout ownership
contracts.
Do not reassign
[T-211 Add Shopify product results to public search](../tasks/T-211-add-shopify-product-results-to-public-search.md);
it is complete. Do not reassign
[T-214 Add newsletter consent source and unsubscribe](../tasks/T-214-add-newsletter-consent-source-unsubscribe.md);
it is complete. T-215 is complete; do not reassign it unless account
acknowledgement metadata persistence regresses. T-216 is complete; do not
reassign it unless comment notice behavior regresses. T-217 is complete; do not
reassign it unless contact/enquiry notice behavior regresses. T-218 is a
frontend-only footer cleanup and should not change data/API behavior. Keep
enquiry schema changes, retained notice metadata, operator workflow changes,
and retention automation separate unless explicitly assigned. Keep collection
section launch policy, broader response-helper
cleanup, route-local DB ownership gaps, field-contract
matrices, server-side shop pagination/sorting contracts, lower-level logging
policy, admin Shopify-link work, and Cloudinary runtime cleanup separate.
T-122, T-135, T-142, T-144's fetcher preservation, T-145, T-151, T-154, T-156,
T-163, T-164, T-165, T-171, T-173, T-174, T-175, T-176, T-177, T-179, T-180,
T-181, T-182, and T-183 are complete; do not reassign them unless their guards,
validation behavior, search metadata, preview contract/UI, evidence gate, audit
receipts, image URL audit, admin read-list audit, admin read query bounds, blog
pagination pilot, route-backed blog filters, route-backed blog
search, collection pagination/search, article pagination/filter/search,
artwork pagination/filter/search, comment/user metadata consumption, or
query/fetcher contracts regress.

Do not reassign T-081, T-082, T-083, T-084, or T-085 unless a regression is
opened.
Existing Shopify product-link data migration is not indicated by the completed
T-059 audit and T-082 validation work.

T-309 is complete and selected admin delete client fetcher URLs as the first
API route-builder runtime slice. T-312 completed that slice by adding
client-safe admin delete destructive/preview path builders while keeping
physical route files, request-context route IDs, route handlers, API response
contracts, statuses, validation, auth/admin guards, DB ownership, logging
behavior, and Shopify dashboard work unchanged. T-314 completed the next
source-only API route-builder slice for admin read list/detail fetcher paths
and preserved route handlers, request-context route IDs, response contracts,
validation, guard behavior, DB ownership, logging behavior, admin UI behavior,
and Shopify dashboard work. T-317 scoped the next API route-builder family to
admin update client fetcher paths. T-318 completed that source-only slice by
adding explicit article, artwork, blog, and collection update path builders and
moving admin update fetchers to them while preserving route handlers,
request-context route IDs, response contracts, validation, guard behavior, DB
ownership, logging behavior, admin UI behavior, and Shopify dashboard work.
T-320 is complete: admin create fetchers now use explicit client-safe path
builders for article, artwork, blog, and collection create URLs. Route
handlers, request-context route IDs, response contracts, validation, guard
behavior, DB ownership, logging behavior, admin UI behavior, and Shopify
dashboard work remain unchanged. Broader public/user API route-builder families
remain separate future scopes. T-327 is prepared to inventory public/user API
client fetcher paths and choose one safe implementation slice before any source
changes.

T-328 is complete: the Shopify catalog dry-run script reads only projected
MongoDB artwork fields (`_id`, `title`, `image`) and writes a local plan report
without mutating MongoDB or writing generated `shopifyProducts` links. Existing
product reconciliation and any MongoDB linking decision remain separate future
tasks.
