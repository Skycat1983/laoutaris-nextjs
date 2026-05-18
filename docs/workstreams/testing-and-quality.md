# Testing And Quality Workstream

Status: Active

Goal: build a dependable verification baseline that supports production
refactoring without turning every change into a manual QA pass.

## Depends On

- [Testing runbook](../runbooks/testing.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Production-readiness risks](../risks/production-readiness.md)

## Blocks

- Safe refactoring across shared modules.
- Production release confidence.
- CI readiness.

## Related Code Areas

- `jest.config.js`
- `jest.setup.js`
- `__tests__/`
- `package.json`
- Any route, transform, helper, or component touched by refactors.

## Current Facts

- Existing scripts are `npm test`, `npm run build`, `npm run lint`, and
  `npm run dev`.
- Jest uses `next/jest` with `jsdom`.
- Current tests are mostly utilities plus a small home view integration test.
- No dedicated end-to-end script is present in `package.json`.
- Project owner reports testing has been attempted but is not yet successfully
  established as a reliable production-readiness practice.
- A-006 baseline: `npm test` passed with 9 suites and 95 tests, `npm run lint`
  passed, and `npm run build` passed only after approved network access.
- A-006 coverage probe across `src/**/*.{ts,tsx}` reported 1.78% statements and
  1.76% lines, with no coverage gate.
- The build is currently environment-sensitive because it fetches Google Fonts
  and performs live MongoDB/data work during static generation.
- A-002, A-003, and A-004 added concrete missing coverage for route status
  contracts, route/fetcher parity, DB ownership checks, validation/transform
  outputs, credentials role persistence, stable ownership helpers, and
  representative user/admin APIs.
- A-007 found deployment smoke checks are manual and not backed by a script or
  evidence checklist.
- A-016 found no focused tests for enquiry, subscription, comment create/update,
  admin create/update validation, or search query parsing.
- A-019 found the dev/test dependency tree carries advisories and deprecated
  transitive packages, while the production dependency patch task needs full
  verification coverage.
- T-010 added focused public enquiry route tests for invalid email,
  missing/short fields, invalid JSON, normalized DTO persistence, unknown-field
  stripping, and public-safe internal failure.
- T-011 restored the full Jest baseline after the Mongoose update by making
  `userUtils`'s Mongoose `ObjectId` import type-only; full `npm test` passed
  with 18 suites and 157 tests.
- T-013 added focused `SignInForm` component coverage for accessible fields,
  username/password validation, credentials `signIn` wiring, bad credentials,
  and modal switching.
- T-012 added focused user comment route coverage for unauthenticated,
  invalid-body, unknown-blog, invalid-ID, forbidden-edit, blank/overlong,
  success, DTO transform, one-read parsing, and transaction rollback paths.
- T-014 kept the residual Next major migration out of package edits until
  T-015 defines a test/build verification plan.
- T-016 added focused bcrypt helper coverage for new hashes, existing bcrypt
  hashes, failed verification, malformed hashes, and no helper console logging.
- T-015 defined the future Next major migration verification baseline and found
  that no accepted stable Next target currently clears both residual
  Next/PostCSS advisories; any Next package edit needs owner target approval
  before the test/build plan is executed.
- T-017 added focused subscription server-action tests for missing, invalid,
  non-string, duplicate, normalized success, persistence failure, DB call
  ordering, and direct input logging behavior.
- T-018 added focused artwork list service, API route, and loader tests proving
  the `/artwork` initial server render path no longer requires a live
  `localhost:3000` same-app fetch.
- T-019 added route utility coverage for the retired protected test route and
  reran the focused sign-in form test.
- T-020 added focused admin collection create/update route coverage for
  unauthenticated, invalid JSON, invalid fields, invalid update id, not found,
  success, rejected unknown-field behavior, and public-safe internal failures.
- T-021 added focused public search service, API route, and page coverage for
  query validation, pagination bounds, `type` filtering, escaped regex input,
  and no same-app fetch requirement.
- T-022 completed package cleanup verification with full Jest, lint, npm tree,
  and audit checks. T-021 later cleared the public-search schema issue that had
  blocked package-cleanup build verification.
- The Vercel bcrypt native trace incident showed a verification gap: local
  bcrypt helper tests and lint/build checks did not prove that Vercel's
  serverless bundle could load native bcrypt on `GET /`.
- T-023 added focused import-boundary tests plus deployment smoke expectations
  for `GET /` and credentials sign-in.
- T-024 confirmed the Vercel bcrypt native-load crash is resolved for `GET /`
  after T-023 reached `origin/main`; an intentionally invalid credentials
  callback also returned controlled `401 CredentialsSignin` instead of `500`.
- T-025 made deployment smoke evidence, auth smoke handling, targeted log
  checks, and rollback decisions repeatable in the deployment runbook, and added
  `npm run smoke:public` for unauthenticated public-route status checks.
- T-026 added focused shared route-guard tests and representative admin/user API
  auth-status tests.
- T-027 added focused saved-route tests for user navigation, favourites, and
  watchlist read-route guard behavior.
- T-028 added focused saved-item action tests for unauthenticated and invalid
  input short-circuiting, DB call ordering, add/remove route revalidation, and
  no revalidation on persistence failure.
- T-029 added static route/fetcher parity coverage with a documented
  self-checking known-gap allowlist.
- T-030 added focused admin user/comment detail read route tests and removed the
  two backed admin operations from the T-029 parity allowlist.
- T-031 removed unused favourite/watchlist write fetchers and kept the
  route/fetcher parity inventory current, with focused action/parity tests,
  lint, build, and reference-check verification.
- T-032 removed the remaining unused F-037 profile write fetcher and left the
  route/fetcher parity allowlist empty, with focused profile/parity tests, lint,
  build, and reference-check verification.
- T-033 added focused user comment delete route tests for unauthenticated and
  invalid-ID short-circuiting, missing/forbidden comments, typed success
  envelope, and transaction abort on linked update failure.
- T-036 added focused public shop listing route tests before broadening to lint
  and build.
- T-037 added focused admin artwork create/update route tests.
- T-038 added focused admin blog create/update route tests.
- T-039 added focused admin read route guard tests covering shared guard
  `401`/`403` short-circuiting, invalid detail IDs, representative success,
  empty-list/not-found, and public-safe target-read failure paths.
- T-040 added focused admin delete route guard/cascade tests covering shared
  guard short-circuiting, invalid IDs before target/session work, representative
  not-found/conflict/success paths, cascade behavior, transaction abort, and
  public-safe failures.
- T-041 added focused middleware and route utility coverage for API `401`,
  frontend redirects, admin API `403`, `/api/auth` bypass, authenticated
  pass-through behavior, and removal of direct middleware debug logs.
- T-042 extended focused user comment route tests for shared-guard
  GET/POST/PATCH auth short-circuiting, GET list/status behavior, and preserved
  create/update/delete behavior.
- T-043 added focused static protected API guard inventory coverage for
  user/admin route files.
- T-044 added focused helper/profile/saved-route coverage for shared API
  response helpers and protected user read-route status behavior.
- T-047 added focused public navigation route coverage for preserved success
  contracts, real missing-resource `404`s, public-safe internal `500`s,
  private-message redaction, no direct debug logging in covered success/404
  paths, and DB-before-model ordering.
- T-048 updated focused admin read route coverage for shared helper envelopes,
  preserved list/detail success contracts, empty-list and missing-resource
  `404`s, unchanged invalid-ID `400` bodies, public-safe internal `500`s,
  private-message redaction, auth short-circuiting, and DB-before-model
  ordering.
- T-049 updated focused admin delete route coverage for shared helper envelopes,
  preserved success messages and `data: null`, unchanged invalid-ID `400`
  bodies, missing-resource `404`s, artwork conflict `409`, public-safe internal
  `500`s, private-message redaction, direct debug-log removal in covered paths,
  and preserved auth/DB/transaction/cascade ordering.
- T-054 added focused article section contract coverage proving
  `"collections"` is rejected by article create/update schemas and admin article
  filter section options derive from `ARTICLE_SECTION_OPTIONS`.
- T-055 extended focused admin blog route coverage for missing `imageUrl`,
  omitted/defaulted `pinned` and `tags`, explicit create/update replacements,
  invalid tag rejection before blog reads/writes, and unknown-field rejection.
- T-060 added focused public shop component coverage for removed unsupported
  colour/dimension filters, removed fake pagination, and preserved backed shop
  controls.
- T-061 added focused Shopify transform and shop gallery sorting coverage for
  explicit `productType`/`tags`, metadata type sorting, unknown type ordering,
  and preserved price/title sort modes.
- T-062 extended focused Shopify transform coverage for variant metadata across
  list, handle, and ID reads, including multiple variants, compare-at
  price/image handling, no-variant fallback behavior, and preserved
  `productType`/`tags`.
- T-063 extended focused Shopify transform coverage for preserving plain
  `description` and Shopify `descriptionHtml` across list, handle, and ID
  reads while keeping metadata and variant behavior covered.
- T-064 pinned the local runtime/install baseline and added the lockfile install
  dry-run to setup, deployment, and testing docs. Verification passed with Node
  `v22.14.0`, npm `10.9.2`, `npm ci --dry-run --ignore-scripts`, full Jest,
  lint, and build.
- T-066 added focused Cloudinary signing route coverage for accepted
  current-widget params, rejected unknown params, rejected invalid allowed-param
  value shapes, and preserved auth/body-shape/missing-secret/success behavior.
- T-067 added focused source hygiene and component coverage proving
  `UploadButton` has no direct console debugging, no availability polling or
  DOM inspection, and still preserves current Cloudinary widget props, open
  behavior, loading state, and success forwarding.
- T-068 added focused public shop source/API/component/loader coverage proving
  the products route, gallery, and loader have no direct `console.log` debug
  output while preserving the shop route contract, metadata sorting, loader
  fetch behavior, and neutral loader error copy.
- T-070 added focused collection navigation service, API route, and loader
  coverage proving the collections subnav no longer requires same-app HTTP
  while preserving route envelope/status behavior and `Subnav` links.
- T-071 added focused article navigation service, API route, and loader
  coverage for `BiographySubnavLoader` and `MainNavLoader` no-self-fetch
  behavior.
- T-072 added focused page and loader coverage for the remaining article
  navigation page consumers.
- T-073 added focused service, route, and page coverage for the collection
  redirect page migration.
- T-074 added focused populated article detail service, route, and loader
  coverage.
- T-075 added focused blog detail service, route, and loader coverage for both
  `showComments` modes.
- T-076 added focused blog list service, route, and loader coverage for
  `BlogListLoader` and `BlogSectionLoader` no-self-fetch behavior.
- T-077 added focused `ArtworkLoader` coverage for direct `getArtworkById`
  usage, user-context service calls, no same-app HTTP, generic failure
  behavior, and no debug delay/result logging.
- T-078 added focused collection artwork service, route, and loader coverage
  for detail and pagination no-self-fetch behavior.
- T-079 added focused article list service, route, and
  `BiographySectionLoader` coverage for no-self-fetch behavior and touched
  debug-log cleanup.
- T-080 added focused collection list service, route, and
  `CollectionSectionLoader` coverage for no-self-fetch behavior.
- T-081 added focused account navigation service, user route, and
  `AccountSubnavLoader` coverage for no-self-fetch behavior.
- T-084 added focused account profile/comment service, protected user
  route-adapter, loader no-self-fetch, route/fetcher parity, and protected API
  guard-inventory coverage.
- T-086 added focused navigation/redirect URL coverage for `LogoutForm`,
  `MobileNavDrawer`, and `src/app/project/page.tsx`, including source hygiene
  checks that the touched files do not contain hard-coded same-app origins.
- T-087 updated source hygiene coverage so deleted retired server API wrapper
  entrypoints stay deleted, active source has no retired wrapper imports, and
  `src/lib/api` has no retired same-app server URL construction.
- T-088 added focused DB helper behavior coverage for `withDbConnect()` and
  `CustomMongoDBAdapter.createUser()`, plus source hygiene coverage proving the
  scoped DB helper files have no direct console calls, retired MongoDB URI
  debug strings, raw OAuth profile/user logging strings, or stale callback URL
  examples.
- T-089 added focused render source-hygiene coverage proving root layout,
  `Subnav`, article views, and account comments no longer contain direct
  `console.log()` calls or retired render debug strings.
- T-090 extended focused render/source-hygiene coverage to the remaining scoped
  user-facing public/account client files and account page, proving they no
  longer contain direct `console.log()` calls or retired debug strings.
- T-091 extended focused render/source-hygiene coverage to the scoped admin
  dashboard create/update form and artwork-filter files, proving they no
  longer contain direct `console.log()` calls.
- T-092 updated `copy_id()` unit coverage so success paths prove clipboard
  writes without expecting `console.log()` output and extended focused source
  hygiene to the scoped admin read-list, `ArtworkFeedCard`, and `copy_id()`
  files.
- T-093 extended focused source hygiene to the scoped shared UI/public artwork
  fetcher files and added public artwork fetcher URL-construction coverage for
  default, repeated-filter, color-sort, and pagination params.
- T-094 added focused `getUserFromSession` development test-header coverage
  for persisted test-user lookup, missing/failing lookup fallback, test-admin
  override behavior, normal NextAuth session fallback, delegated helper
  behavior, and source hygiene preventing direct `console.log()` calls from
  returning to the helper.
- T-095 added full-source source-hygiene coverage in
  `__tests__/unit/security/consoleLogSourceHygiene.test.ts` so direct or
  commented `console.log()` calls cannot return under `src`.
- T-096 added static Next config coverage in
  `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts` for the
  resolved `headers()` output, including the absence of wildcard credential
  CORS and wildcard allowed request headers, presence of baseline hardening
  headers and CSP directives, and preserved Cloudinary/Shopify/YouTube
  allowances.
- T-097 added focused form/schema workflow coverage for admin artwork Shopify
  product-link add/edit/remove behavior, and preserved existing admin artwork
  route validation coverage.
- T-098 added focused coverage for product-link verification fetcher behavior
  and admin input verification states.
- T-105 added focused component coverage for public comment owner action
  accessible names, non-submit button semantics, edit-mode controls, hidden
  decorative icons, and owner-only rendering.
- T-106 added
  `__tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx` for
  public biography article and blog detail metadata, canonical URLs,
  scaffold-text absence, conservative JSON-LD, missing-content noindex
  metadata, and source invariants.
- T-107 is prepared with focused metadata/structured-data coverage expectations
  for public artwork, collection-scoped artwork, and Shopify product detail
  pages.

## Backlog

- Establish which commands must pass before each handoff and document
  environment limitations for build checks.
- Add API contract tests for one representative public, user, and admin route
  group before broad refactors.
- Add route/action tests for admin create/update validation and search query
  parsing as those flows are hardened.
- Add tests for shared response helpers, body-level status cleanup, and
  unauthenticated/forbidden JSON 401/403 behavior.
- Keep the T-029 route/fetcher parity check current as fetcher modules and
  route handlers are added, removed, or backed by new methods.
- Add a DB ownership check for MongoDB-backed route handlers and server actions
  once the shared wrapper/service pattern is chosen.
- Continue adding auth/route-protection tests around high-risk session helpers
  and route-local protected API migrations.
- Add credentials admin, credentials non-admin, OAuth user, middleware admin,
  and representative user/admin API route-guard tests.
- Add transform/schema tests for field matrix decisions, profile/comment/enquiry
  DTOs, admin write DTOs, blog `readTime`, collection `firstArtworkId`,
  user/comment ownership state, and artwork image sanitization.
- Replace or supplement the mocked Home integration test with a test that
  exercises the intended production component boundary.
- Add remaining Shopify transformation and product detail tests before
  commerce implementation work; product-link audit helper coverage exists from
  T-058.
- Add SSR/server-loader tests that do not require a live `localhost:3000`
  server.
- Add a documented coverage command and targeted thresholds for route guards,
  transforms, API helpers, and Shopify/data contracts before considering a
  repo-wide threshold.
- Keep deployment smoke checks current through the evidence-based manual
  checklist and the `npm run smoke:public` unauthenticated status helper added
  by T-025.
- Decide whether `npm run smoke:public` should remain manual, become CI-gated,
  or run on a schedule; A-021 confirmed it is not continuous monitoring and
  does not cover credentialed/admin/log evidence.
- Add native-package/runtime smoke expectations when bcrypt, Next, auth
  configuration, or deployment tracing changes.
- Isolate or document Google Fonts and live MongoDB dependencies for CI build
  verification.
- Reduce expected test/build noise by gating debug logs and expected
  error-path logging.
- Add CI documentation after the chosen checks are stable.
- Track residual production and dev-only dependency advisories after T-011 so
  future audits can distinguish accepted residual risk from newly introduced
  vulnerabilities.
- When the owner accepts a stable Next target, apply T-015's Next major
  verification plan: focused auth/admin/public archive/shop/Jest coverage, full
  Jest, env guard, lint after the `next lint` migration, and build.

## Acceptance Criteria

- Every production-critical workstream lists its required verification commands.
- Test failures are documented with owner and next action.
- New refactors include focused tests when behavior changes.
- Build and test commands can be run by a new agent without extra context.

## Verification

```bash
npm test
npm run build
npm run lint
```

## Progress

- Documentation scaffold created.
- 2026-05-14: A-006 baseline findings reconciled into
  `docs/audits/findings-register.md`, production risks, the testing runbook, and
  this backlog.
- 2026-05-14: Reconciled A-002, A-003, A-004, and A-007 testing gaps into
  F-016 plus related converted findings and this backlog.
- 2026-05-14: Reconciled A-016 into F-016 and F-055 through F-062, including
  concrete route/action validation test gaps.
- 2026-05-14: Reconciled A-019 into F-063 through F-066 and T-011, with full
  verification required for the production dependency patch task.
- 2026-05-14: T-010 added focused public enquiry route tests. Targeted tests and
  lint passed; T-011 later fixed the unrelated `userUtils`/Mongoose ESM parse
  failure and restored the full `npm test` baseline.
- 2026-05-14: T-011 ran dependency-focused smoke tests, full Jest, lint, and
  build after the production dependency patch. Remaining verification noise is
  limited to existing `punycode`, date utility error-log, Browserslist, MongoDB,
  and fetcher debug output.
- 2026-05-14: T-014 confirmed the residual dependency advisories are still
  semver-major only and created T-015/T-016 so Next migration verification and
  bcrypt compatibility checks stay separated.
- 2026-05-14: T-013 added
  `__tests__/unit/forms/SignInForm.test.tsx`; the focused form test, existing
  credentials/session test, and lint passed.
- 2026-05-14: T-012 added `__tests__/unit/api/userCommentRoute.test.ts`;
  targeted comment route tests, full Jest, lint, and build passed. Existing
  date utility test console noise and build-time MongoDB/fetcher logs remain.
- 2026-05-14: T-016 added
  `__tests__/unit/auth/bcryptHelper.test.ts`; focused auth/bcrypt tests, full
  Jest, lint, and build passed. Existing date utility test console noise,
  build-time MongoDB/fetcher logs, and Browserslist notice remain.
- 2026-05-14: T-015 documented the Next major migration verification plan,
  including focused auth/admin/public archive/shop tests, full Jest, env guard,
  lint after replacing `next lint`, and build. No tests were run because T-015
  did not edit package manifests or runtime code.
- 2026-05-14: Prepared T-017, T-018, and T-019 with focused test expectations
  for the next implementation batch.
- 2026-05-14: T-019 passed the legacy auth pruning reference search, focused
  `SignInForm` and `routeUtils` tests, and lint.
- 2026-05-14: T-017 added
  `__tests__/unit/actions/submitSubscription.test.ts`; focused subscription
  action tests, full Jest, and lint passed. Existing date utility error-path
  console output remains expected test noise.
- 2026-05-14: T-018 added
  `__tests__/unit/data/getArtworkList.test.ts`,
  `__tests__/unit/api/publicArtworkListRoute.test.ts`, and
  `__tests__/unit/loaders/ArtworkListLoader.test.tsx`; focused tests, full
  Jest, lint, and build passed. Existing date utility error-path console output
  and build-time Browserslist/MongoDB/fetcher/debug output remain expected
  verification noise.
- 2026-05-14: Prepared T-020, T-021, and T-022 with focused test expectations
  for admin collection route validation, public search service/API/page
  behavior, and package cleanup verification.
- 2026-05-14: T-020 added
  `__tests__/unit/api/adminCollectionRoute.test.ts`; the focused admin
  collection route test, lint, and final full Jest suite passed. Existing date
  utility error-path console output remains expected test noise.
- 2026-05-14: T-021 added
  `__tests__/unit/data/getPublicSearchResults.test.ts`,
  `__tests__/unit/api/publicSearchRoute.test.ts`, and
  `__tests__/unit/searchPage.test.tsx`; focused search tests, full `npm test`,
  lint, and build passed. Existing date utility error-path console output and
  build-time Browserslist/MongoDB/fetcher/debug output remain expected
  verification noise.
- 2026-05-14: T-022 removed unused direct package candidates and ran package
  verification. `npm test` passed with 25 suites and 195 tests, `npm run lint`
  passed, production audit still reports only the known residual Next/PostCSS
  advisories, and full audit reports the existing 11 Next/PostCSS/dev-tooling
  findings. `npm run build` was attempted twice during T-022; the second
  attempt compiled but failed during `/api/v2/public/search` page-data
  collection because public-search schema code still threw at runtime. T-021
  subsequently fixed that blocker and `npm run build` passed.
- 2026-05-14: Recorded the Vercel bcrypt native trace incident as a deployment
  verification gap and prepared T-023 with auth import-boundary tests plus
  redeploy smoke expectations for `GET /` and credentials sign-in.
- 2026-05-14: T-023 added
  `__tests__/unit/auth/authOptionsImportBoundary.test.tsx` for auth config
  import, lazy credentials authorize, and root-layout public-shell rendering
  without bcrypt imports. Focused auth/import-boundary tests, full Jest, lint,
  and build passed; existing date utility console output and build-time
  MongoDB/fetcher/root-layout debug output remain expected verification noise.
- 2026-05-14: Prepared T-024 so the deployment smoke gap is verified with
  remote `GET /`, credentials sign-in, deployed commit/runtime, and targeted
  Vercel log evidence.
- 2026-05-14: T-024 captured partial remote evidence: the public Vercel alias
  returned `HTTP/2 200` for `GET /`, and the credentials callback returned a
  controlled `401 CredentialsSignin` for invalid smoke values instead of `500`.
  At that point acceptance was blocked until a T-023-containing deployment,
  successful credentials sign-in, and targeted log evidence were available.
- 2026-05-14: Completed T-024 after `origin/main` matched local `HEAD` with
  T-023, the owner confirmed the deployment no longer crashes, and a fresh
  `curl -I /` returned `HTTP/2 200`.
- 2026-05-14: Prepared T-025 to convert the ad hoc Vercel smoke evidence into a
  repeatable checklist or lightweight public-route script.
- 2026-05-14: Completed T-025 by documenting repeatable Vercel smoke evidence,
  credentials smoke secret handling, targeted log checks, rollback triggers, and
  adding `npm run smoke:public` for unauthenticated public-route status checks.
- 2026-05-14: T-026 added
  `__tests__/unit/api/apiRouteGuards.test.ts` and
  `__tests__/unit/api/userProfileRoute.test.ts`, expanded
  `__tests__/unit/api/adminCollectionRoute.test.ts`, and passed focused API
  guard/route tests, lint, and build. Existing Google Fonts retry noise,
  Browserslist notice, MongoDB connection logs, and fetcher debug output remain
  expected build noise.
- 2026-05-14: T-027 added
  `__tests__/unit/api/userSavedRoutes.test.ts` for user navigation,
  favourite, and watchlist `requireApiUser()` behavior. Focused guard, profile,
  and saved-route tests, lint, and build passed. Existing MongoDB connection
  logs, branch verification logs, and fetcher debug output remain expected build
  noise.
- 2026-05-14: Prepared T-028 with focused saved-item action coverage
  expectations for unauthenticated and invalid input short-circuiting, DB call
  ordering, successful revalidation, and no revalidation on persistence
  failures.
- 2026-05-14: T-028 added
  `__tests__/unit/actions/savedItemActions.test.ts`; focused saved-item action
  tests, lint, and build passed. Existing MongoDB connection logs, branch
  verification logs, route fetcher debug output, and static-generation noise
  remain expected build noise.
- 2026-05-14: Prepared T-029 to add
  `__tests__/unit/api/routeFetcherParity.test.ts` or equivalent focused parity
  coverage for F-037 route/fetcher drift.
- 2026-05-14: T-029 added
  `__tests__/unit/api/routeFetcherParity.test.ts` for static route/fetcher
  parity coverage. The focused test, lint, and build passed; the test now
  checks all current fetcher modules, source call counts, non-allowlisted
  route/method backing, and stale F-037 allowlist entries.
- 2026-05-14: Prepared T-030 with focused route and parity-test expectations
  for the admin user/comment detail read mismatch cleanup.
- 2026-05-15: T-030 added
  `__tests__/unit/api/adminUserCommentReadRoute.test.ts` for admin
  user/comment detail read auth short-circuiting, success, not-found, and
  public-safe target-read failures. The focused route/parity tests, lint, and
  build passed; build retained existing MongoDB/fetcher/static-generation log
  noise.
- 2026-05-15: Prepared T-031 and T-032 with focused route/fetcher parity,
  saved-item action, profile route, lint, build, and reference-check
  verification requirements.
- 2026-05-15: T-031 removed the unused favourite/watchlist write fetchers and
  their four parity inventory/allowlist entries. The focused saved-item
  action/parity tests, lint, build, and reference check passed; build retained
  existing MongoDB/fetcher/static-generation log noise.
- 2026-05-15: T-032 removed the unused profile update fetcher and its final
  parity inventory/allowlist entry. Focused profile/parity tests, lint, build,
  and the profile-update reference check passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: Prepared T-033, T-034, and T-035 with focused route tests plus
  lint/build verification for the next protected API, admin validation, and
  public query-bounds slices.
- 2026-05-15: T-033 added focused user comment delete route coverage and passed
  the targeted comment route test, lint, and build. Build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: T-034 added
  `__tests__/unit/api/adminArticleRoute.test.ts` for admin article create/update
  auth short-circuiting, invalid JSON, invalid fields, unknown fields, invalid
  update IDs, not-found, success, and public-safe persistence failures. The
  focused route test, lint, and build passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: T-035 expanded
  `__tests__/unit/api/publicArtworkListRoute.test.ts` for public artwork browse
  query defaults, valid normalization, invalid enum/filter/color/pagination
  values, limit bounds, and invalid-query short-circuiting before session or
  service work. The focused route/service tests, lint, and build passed; build
  retained existing MongoDB/fetcher/static-generation log noise.
- 2026-05-15: Prepared T-036 with focused shop products route coverage
  expectations for defaults, valid filters, invalid repeated filters, invalid
  booleans, valid `false` product-type filters, invalid-query short-circuiting
  before DB/Shopify calls, and public-safe internal failure behavior.
- 2026-05-15: T-036 added
  `__tests__/unit/api/shopProductsRoute.test.ts` for public shop listing query
  defaults, valid filter normalization, valid `false` product-type filters,
  invalid repeated filters, invalid booleans/sort options, invalid-query
  short-circuiting before DB/Shopify calls, and public-safe internal failures.
  The focused route test, lint, and build passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: Prepared T-037 and T-038 with focused route-test expectations for
  admin artwork create/update validation and admin blog create/update
  validation.
- 2026-05-15: T-037 added
  `__tests__/unit/api/adminArtworkRoute.test.ts` for admin artwork
  create/update auth short-circuiting, invalid JSON, invalid fields, unknown
  fields, invalid update IDs before body reads, not-found, success, optional
  replacement-image updates, and public-safe persistence failures. The focused
  route test, lint, and build passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: T-038 added
  `__tests__/unit/api/adminBlogRoute.test.ts` for admin blog create/update auth
  short-circuiting, invalid JSON, invalid fields, unknown fields, invalid update
  IDs before body reads, not-found, slug conflict, success, unchanged-title
  updates, and public-safe persistence failures. The focused route test, lint,
  and build passed; build retained existing MongoDB/fetcher/static-generation
  log noise.
- 2026-05-15: Prepared T-039 and T-040 with focused route-test expectations for
  admin read route guard migration and admin delete route guard/ID validation.
- 2026-05-15: T-039 added
  `__tests__/unit/api/adminReadRouteGuard.test.ts` and extended
  `adminUserCommentReadRoute` invalid-ID coverage. Focused admin read route
  tests, lint, and build passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: T-040 added
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts` covering admin delete
  shared guard behavior, invalid IDs before destructive work, cascade semantics,
  transaction abort, and public-safe failures. Focused admin delete route tests,
  lint, and build passed; build retained existing
  MongoDB/fetcher/static-generation log noise.
- 2026-05-15: Prepared T-041 with focused middleware/route utility coverage
  expectations for protected API JSON `401`, frontend redirects, admin API
  `403`, `/api/auth` bypass, authenticated pass-through, and middleware debug
  log removal.
- 2026-05-15: T-041 added `__tests__/unit/middleware.test.ts` and extended
  `__tests__/unit/utils/routeUtils.test.ts` for API route classification,
  protected API `401`, protected frontend redirect, admin API `403`, admin
  frontend redirect, `/api/auth` bypass, authenticated pass-through, and no
  direct middleware debug logging. Focused tests, lint, and build passed; build
  retained existing MongoDB/fetcher/static-generation log noise.
- 2026-05-15: Prepared T-042 with focused user comment route coverage
  expectations for GET/POST/PATCH shared-guard `401` short-circuiting, GET list
  success and failure statuses, and preservation of existing create/update/delete
  behavior.
- 2026-05-15: T-042 extended
  `__tests__/unit/api/userCommentRoute.test.ts` for GET shared-guard `401`
  short-circuiting before DB/model work, GET success/missing-user/internal
  failure statuses, and POST/PATCH shared-guard `401` before body reads.
  Focused tests, lint, and build passed; build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug log
  noise.
- 2026-05-15: Prepared T-043 with focused static coverage expectations for
  protected user/admin API route guard imports/calls and banned direct
  session/admin helper checks.
- 2026-05-15: T-043 added
  `__tests__/unit/api/protectedApiGuardInventory.test.ts` for protected
  user/admin route file inventory, shared guard import/call enforcement,
  banned direct session/admin helper checks, and guard ordering before body,
  DB, model, or transaction work in exported handlers. Focused tests, lint, and
  build passed; build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-044 with focused coverage expectations for
  `apiResponse` helpers, protected user profile missing-user/internal statuses,
  protected user navigation/favourite/watchlist missing-resource/internal
  statuses, preserved success envelopes, and the existing protected API guard
  inventory.
- 2026-05-15: T-044 added `__tests__/unit/api/apiResponse.test.ts` and extended
  `userProfileRoute` and `userSavedRoutes` coverage for missing-user,
  missing-artwork, saved-item not-in-set, public-safe internal failure, preserved
  success envelopes, and shared `401` guard behavior. Focused helper, profile,
  saved-route, and guard-inventory tests, lint, and build passed; build retained
  existing MongoDB/static-generation, branch-verification, link, and fetcher
  debug log noise.
- 2026-05-15: Prepared T-045 with focused public content detail route coverage
  expectations for public artwork/article/blog success, missing-resource `404`,
  public-safe internal `500`, and no raw private thrown message in response
  bodies.
- 2026-05-15: T-045 added
  `__tests__/unit/api/publicContentDetailRoutes.test.ts` and updated public
  artwork detail coverage for public artwork/article/blog success,
  missing-resource `404`, public-safe internal `500`, and raw private-message
  redaction. Focused public route/parity tests, lint, and build passed; build
  retained existing MongoDB/static-generation, branch-verification, link, and
  fetcher debug log noise.
- 2026-05-15: Prepared T-046 with focused public collection route coverage
  expectations for list/detail/artwork success paths, real missing-resource
  `404`s, public-safe internal `500`s, route-local DB ownership, and no private
  thrown messages in response bodies.
- 2026-05-15: T-046 added
  `__tests__/unit/api/publicCollectionRoutes.test.ts` for public collection
  list/detail/artwork success paths, missing collection `404`, missing
  artwork-in-collection `404`, public-safe internal `500`, private-message
  redaction, and route-local DB-before-model ordering. Focused
  collection/parity tests, lint, and build passed; build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug log
  noise.
- 2026-05-15: Prepared T-047 with focused public navigation route coverage
  expectations for article navigation, collection navigation list/detail,
  collection navigation artworks, missing-resource `404`s, public-safe internal
  `500`s, private-message redaction, and DB-before-model ordering.
- 2026-05-15: T-047 added
  `__tests__/unit/api/publicNavigationRoutes.test.ts` for public navigation
  article/collection success paths, missing-resource `404`s, public-safe
  internal `500`s, private-message redaction, no direct debug logging in
  covered success/404 paths, and route-local DB-before-model ordering. Focused
  navigation/parity tests, lint, and build passed; build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug log
  noise.
- 2026-05-15: Prepared T-048 with focused admin read route coverage
  expectations for representative list/detail success contracts, empty-list and
  missing-resource statuses, unchanged invalid-ID `400` bodies, public-safe
  internal `500`s, private-message redaction, and preserved auth/DB ordering.
- 2026-05-15: T-048 updated admin read route tests for shared response helper
  envelopes and reran focused admin read/parity tests, lint, and build
  successfully. Build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-049 with focused admin delete route coverage
  expectations for preserved success messages and `data: null`, invalid-ID
  `400` bodies, missing-resource `404`s, artwork conflict `409`, public-safe
  internal `500`s, private-message redaction, debug-log removal, and preserved
  auth/DB/transaction/cascade ordering.
- 2026-05-15: T-049 updated admin delete route and helper tests for shared
  response helper envelopes, optional success messages, private-message
  redaction, preserved cascade/transaction behavior, and no direct debug logs
  in covered success/not-found paths. Focused admin delete/helper/parity tests,
  lint, and build passed; build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: T-050 updated admin create/update route tests for shared response
  helper envelopes, preserved validation `400` bodies, create `201` statuses,
  update success contracts, not-found `404`s, blog slug conflict `409`,
  public-safe internal `500`s, private-message redaction, and preserved
  auth/body-read/DB-ordering and allowlisted persistence behavior. Focused
  admin create/update/helper/parity tests, lint, and build passed; build
  retained existing MongoDB/static-generation, branch-verification, link, and
  fetcher debug log noise.
- 2026-05-15: Prepared T-051 with focused public transform contract coverage
  expectations for blog `readTime`, collection `firstArtworkId`, public user
  `isOwner`, comment ownership state, sensitive-field filtering, and populated
  blog/comment user-context propagation.
- 2026-05-15: T-051 added
  `__tests__/unit/transforms/publicTransformContracts.test.ts` for blog
  `readTime`, collection empty-state `firstArtworkId`, public user/comment
  ownership, sensitive user-field filtering, and populated blog/comment
  user-context propagation. Focused transform tests, full Jest, lint, and build
  passed; full Jest retained existing `dateUtils` invalid-date console noise,
  and build retained existing MongoDB/static-generation, branch-verification,
  link, and fetcher debug log noise.
- 2026-05-15: Prepared T-052 with focused public artwork image contract
  coverage expectations for `image.public_id` sanitization, frontend image
  field preservation, color-proximity `similarityScore` behavior, Cloudinary
  color schema validation, and affected public/admin artwork route fixtures.
- 2026-05-15: T-052 added
  `__tests__/unit/transforms/publicArtworkImageContracts.test.ts` for direct
  and populated artwork image sanitization, frontend image field preservation,
  optional public-only `similarityScore`, and strict Cloudinary color schema
  validation. Focused artwork image/list/public route/admin route tests, lint,
  and build passed; build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-053 as a docs-only field contract matrix task. Runtime
  tests are intentionally out of scope; `git diff --check` is the verification
  baseline unless implementation code is changed by mistake.
- 2026-05-15: T-053 created the F-039 field contract matrix and follow-up test
  expectations for article section constants, blog `imageUrl`/`pinned`/`tags`,
  and user `password` credentials/OAuth behavior. Runtime tests remain assigned
  to the later implementation slices.
- 2026-05-15: Prepared T-054 with focused article section schema/UI option
  coverage expectations: article schemas should reject `"collections"` and
  admin article filter options should derive from `ARTICLE_SECTION_OPTIONS`.
- 2026-05-15: T-054 added
  `__tests__/unit/data/articleSectionContracts.test.ts` for article
  create/update schema rejection of `section: "collections"` and the admin
  article filter option contract. Focused article tests, lint, and build passed;
  build retained existing MongoDB/static-generation, branch-verification, link,
  and fetcher debug log noise.
- 2026-05-15: Prepared T-055 with focused blog model/schema/admin route
  coverage expectations for required `imageUrl`, optional/defaulted `pinned`,
  optional/defaulted `tags`, invalid tag rejection, allowlisted persistence, and
  preserved admin blog route behavior.
- 2026-05-15: T-055 updated
  `__tests__/unit/api/adminBlogRoute.test.ts` for missing `imageUrl`,
  defaulted and explicit `pinned`/`tags`, invalid tag rejection, and preserved
  unknown-field rejection. Focused admin blog route tests, lint, and build
  passed; build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-056 with focused credentials/OAuth password contract
  coverage expectations for optional persisted passwords, missing stored-hash
  credentials denial without bcrypt verification, existing credentials role
  propagation, and public/own password sanitization.
- 2026-05-15: T-056 extended
  `__tests__/unit/auth/credentialsRoleSession.test.ts` for OAuth-style
  missing-password credentials denial and no bcrypt verification, and
  `__tests__/unit/transforms/publicTransformContracts.test.ts` for own-user
  password sanitization. Focused auth/import-boundary/transform/profile tests,
  lint, and build passed; build retained existing MongoDB/static-generation,
  branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-057 with focused public Shopify route coverage
  expectations for shared numeric product ID normalization, invalid path-ID
  `400`s before Shopify calls, invalid stored listing IDs skipped before
  Shopify calls, and post-normalization deduplication.
- 2026-05-15: T-057 added focused public Shopify route coverage for malformed
  decoded path IDs, invalid stored listing IDs skipped before Shopify calls,
  and product listing deduplication after ID normalization. Focused route
  tests, lint, and build passed; build retained existing MongoDB/static
  generation, branch-verification, link, and fetcher debug log noise.
- 2026-05-15: Prepared T-058 with focused audit-helper coverage expectations
  for invalid Shopify product IDs, GID-style persisted values, duplicate
  within-artwork links, cross-artwork duplicates, unknown product types, and
  read-only command syntax.
- 2026-05-15: T-058 added
  `__tests__/unit/scripts/auditShopifyProductLinkHelpers.test.js` for invalid
  Shopify product IDs, GID-style persisted values, unknown product types,
  duplicate within-artwork links, cross-artwork duplicates, and duplicate-only
  non-failing behavior. Focused tests, script syntax checks, lint, and build
  passed; the live audit was not run because `MONGO_URI` was not set in the
  shell.
- 2026-05-15: Prepared T-059 to run the read-only Shopify product-link audit
  against the owner-approved MongoDB environment and record the command result
  as durable evidence. No new runtime tests are expected unless the audit
  command itself changes.
- 2026-05-15: T-059 attempted `npm run audit:shopify-products`, which exited
  `1` before MongoDB connection because `MONGO_URI` was not set. This confirms
  the environment precondition but does not provide data-quality evidence; rerun
  the same command after the owner-approved target is configured.
- 2026-05-17: T-059 completed the live read-only audit against the
  owner-approved MongoDB Atlas `laoutarisDB` target. The final
  `npm run audit:shopify-products` run exited `0` with 215 artworks scanned, 0
  invalid IDs, 0 unknown types, 0 within-artwork duplicates, and 1 review-only
  cross-artwork book duplicate group. No new runtime tests were added because
  the command behavior did not change.
- 2026-05-16: Prepared T-060 with focused shop component coverage expectations
  for removed unsupported colour/dimension filters, removed fake pagination, and
  preserved backed filters, result count, and sort controls.
- 2026-05-16: T-060 added
  `__tests__/unit/shopUnsupportedControls.test.tsx` for absent unsupported shop
  controls and preserved backed controls. Focused component tests, lint, and
  build passed; build retained existing MongoDB/fetcher/static-generation log
  noise.
- 2026-05-16: Prepared T-061 with focused Shopify transform and shop gallery
  sorting coverage expectations for explicit `productType`/`tags`, metadata
  type sorting, unknown type ordering, and preserved price/title sorting.
- 2026-05-16: T-061 added
  `__tests__/unit/shopifyClientTransform.test.ts` and
  `__tests__/unit/shopProductGallerySorting.test.tsx`. Focused Shopify
  transform/gallery/route/page tests, lint, and build passed; build retained
  existing MongoDB/fetcher/static-generation log noise.
- 2026-05-16: Prepared T-062 with focused Shopify transform coverage
  expectations for multiple variants, compare-at price, variant image handling,
  no-variant fallback behavior, and preservation of T-061 product metadata.
- 2026-05-16: T-062 extended
  `__tests__/unit/shopifyClientTransform.test.ts` for multiple variants,
  compare-at price, variant image handling, no-variant fallback behavior, and
  T-061 product metadata preservation. Focused Shopify transform plus adjacent
  shop page/gallery/API route tests, lint, and build passed; build retained
  existing MongoDB/fetcher/static-generation log noise.
- 2026-05-16: Prepared T-063 with focused Shopify transform coverage
  expectations for preserving `descriptionHtml` across list, handle, and ID
  reads while preserving plain descriptions, product metadata, and variant
  metadata.
- 2026-05-16: T-063 extended
  `__tests__/unit/shopifyClientTransform.test.ts` for preserving plain
  `description` and Shopify `descriptionHtml` across list, handle, and ID
  reads. Focused transform tests, lint, and build passed; build retained
  existing MongoDB/fetcher/static-generation log noise.
- 2026-05-16: Prepared T-064 with install/runtime verification expectations:
  record Node/npm versions, prove the lockfile install path with
  `npm ci --dry-run --ignore-scripts`, then run the normal test, lint, and
  build baseline.
- 2026-05-16: T-064 completed install/runtime verification: Node `v22.14.0`,
  npm `10.9.2`, `npm ci --dry-run --ignore-scripts`, full Jest with 56 suites
  and 512 tests, lint, and build passed. Existing date utility console output,
  Browserslist notice, Google Fonts retries, MongoDB/static-generation logs,
  branch-verification logs, and fetcher debug logs remained expected noise.
- 2026-05-16: Prepared T-065 as a documentation-only environment inventory
  slice. Verification should use targeted env-reference search, `npm run
  env:guard`, and `git diff --check`; no full runtime suite is required unless
  runtime code changes unexpectedly.
- 2026-05-16: Completed T-065 with documentation-only verification: targeted
  env-reference search, `npm run env:guard`, and `git diff --check`. No full
  runtime suite was required because no runtime code changed.
- 2026-05-16: Prepared T-066 with focused Cloudinary signing route coverage
  expectations for accepted current-widget signing params, rejected unknown
  params, rejected invalid allowed-param value shapes, and preserved auth,
  missing-secret, and success contracts.
- 2026-05-16: Completed T-066 focused coverage for Cloudinary signing allowed
  params, unknown params, invalid allowed-param shapes, auth/body validation,
  missing-secret handling, and top-level signature compatibility. Focused Jest,
  lint, build, and `git diff --check` passed; build retained existing
  MongoDB/static-generation and fetcher debug-log noise.
- 2026-05-16: Completed T-067 by adding
  `__tests__/unit/uploadButton.test.tsx` plus source hygiene coverage for
  `UploadButton`. Focused tests passed, proving current Cloudinary widget
  props, loading/open behavior, success forwarding, and the absence of direct
  console debugging/polling/DOM inspection in the upload button. Lint, build,
  and `git diff --check` passed; build retained existing
  MongoDB/static-generation/fetcher log noise.
- 2026-05-16: Prepared T-068 with focused source/API/component expectations
  for removing public shop `console.log` debug output while preserving the
  existing shop products route and gallery behavior.
- 2026-05-16: Completed T-068 focused coverage by extending
  `__tests__/unit/api/shopProductsRoute.test.ts`,
  `__tests__/unit/shopProductGallerySorting.test.tsx`, and
  `__tests__/unit/security/credentialSourceHygiene.test.ts`, and adding
  `__tests__/unit/loaders/ShopProductsLoader.test.tsx`. Focused Jest, lint,
  build, and `git diff --check` passed; build retained existing
  MongoDB/static-generation, branch-verification, link, and fetcher debug
  noise.
- 2026-05-16: Prepared T-069 with focused source hygiene expectations for
  shared fetcher and server API helper debug output while preserving current
  fetch behavior.
- 2026-05-16: Completed T-069 by adding
  `__tests__/unit/api/createFetcher.test.ts` and extending
  `__tests__/unit/security/credentialSourceHygiene.test.ts`. Focused coverage
  now proves the shared fetcher/server API helper files have no direct
  `console.log` debug output or stale URL debug phrases, while `createFetcher`
  still merges headers, executes fetch, parses JSON, returns success/error
  envelopes, handles fetch failures, and rethrows Next control-flow errors.
- 2026-05-16: Prepared T-070 with focused service, route, and loader coverage
  expectations for the collections subnav same-app HTTP migration.
- 2026-05-16: Completed T-070 focused coverage by adding
  `__tests__/unit/data/getCollectionNavigationList.test.ts` and
  `__tests__/unit/loaders/CollectionsSubnavLoader.test.tsx`, and updating
  `__tests__/unit/api/publicNavigationRoutes.test.ts`. Focused Jest, lint,
  build, and `git diff --check` passed; build retained existing
  MongoDB/static-generation, branch-verification, and link debug noise.
- 2026-05-16: Prepared T-071 with focused service, route, and loader coverage
  expectations for the article navigation same-app HTTP migration.
- 2026-05-16: Completed T-071 focused coverage by adding
  `__tests__/unit/data/getArticleNavigationList.test.ts`,
  `__tests__/unit/loaders/BiographySubnavLoader.test.tsx`, and
  `__tests__/unit/loaders/MainNavLoader.test.tsx`, and updating
  `__tests__/unit/api/publicNavigationRoutes.test.ts`. Focused Jest, lint,
  build, and `git diff --check` passed; build retained existing
  MongoDB/static-generation, branch-verification, and link debug noise.
- 2026-05-16: Prepared T-072 with focused biography default redirect and
  `ArticleLoader` navigation coverage expectations.
- 2026-05-16: Completed T-072 by adding
  `__tests__/unit/pages/BiographyPage.test.tsx` and
  `__tests__/unit/loaders/ArticleLoader.test.tsx`. Focused Jest, lint, build,
  and `git diff --check` passed; build retained existing
  MongoDB/static-generation, branch-verification, and navigation link debug
  noise.
- 2026-05-16: Completed T-073 focused coverage by adding
  `__tests__/unit/data/getCollectionNavigationItem.test.ts`,
  `__tests__/unit/pages/CollectionsPage.test.tsx`, and
  `__tests__/unit/pages/CollectionSlugPage.test.tsx`, and by updating
  `__tests__/unit/api/publicNavigationRoutes.test.ts`. Focused Jest, full
  Jest, lint, build, and `git diff --check` passed; build retained existing
  MongoDB/static-generation, branch-verification, and navigation link debug
  noise.
- 2026-05-16: Completed T-074 focused coverage by adding
  `__tests__/unit/data/getArticleBySlugPopulated.test.ts` and updating
  `__tests__/unit/api/publicContentDetailRoutes.test.ts` plus
  `__tests__/unit/loaders/ArticleLoader.test.tsx`. Focused Jest, full Jest,
  lint, build, and `git diff --check` passed. Full Jest retained existing
  expected `dateUtils` invalid-date console error output, and build retained
  existing MongoDB/static-generation, branch-verification, navigation link, and
  `ArticleView` debug noise.
- 2026-05-16: Completed T-075 focused coverage by adding
  `__tests__/unit/data/getBlogBySlugWithAuthor.test.ts`,
  `__tests__/unit/data/getBlogBySlugWithComments.test.ts`, and
  `__tests__/unit/loaders/BlogDetailLoader.test.tsx`, and updating
  `__tests__/unit/api/publicContentDetailRoutes.test.ts`. Focused Jest, full
  Jest, lint, build, and `git diff --check` passed. Full Jest retained
  existing expected `dateUtils` invalid-date console error output, and build
  retained existing MongoDB/static-generation, branch-verification, navigation
  link, and `ArticleView` debug noise.
- 2026-05-16: Prepared T-076 with expected focused coverage for the shared blog
  list service, public blog list route contract, `BlogListLoader` grouped and
  single-sort paths, and `BlogSectionLoader` no-self-fetch behavior.
- 2026-05-16: Completed T-076 focused coverage by adding
  `__tests__/unit/data/getBlogList.test.ts`,
  `__tests__/unit/api/publicBlogListRoute.test.ts`,
  `__tests__/unit/loaders/BlogListLoader.test.tsx`, and
  `__tests__/unit/loaders/BlogSectionLoader.test.tsx`. Focused Jest, lint,
  build, and `git diff --check` passed. Build retained existing
  MongoDB/static-generation, branch-verification, navigation link, and
  `ArticleView` debug noise.
- 2026-05-16: Prepared T-077 with expected focused coverage for
  `ArtworkLoader` successful rendering, `getArtworkById` call arguments,
  missing-artwork behavior, and no self-fetch/debug-delay dependency.
- 2026-05-16: Completed T-077 focused coverage by adding
  `__tests__/unit/loaders/ArtworkLoader.test.tsx` for successful rendering,
  user-context service arguments, anonymous service arguments, missing/failing
  artwork behavior, no same-app fetches, and source hygiene. Focused Jest,
  lint, build, and `git diff --check` passed.
- 2026-05-16: Prepared T-078 with expected focused coverage for collection
  artwork service success/not-found/failure behavior, public route envelope
  preservation, selected artwork rendering, collection artwork pagination link
  construction, and no-self-fetch loader behavior.
- 2026-05-16: Completed T-078 focused coverage by adding
  `__tests__/unit/data/getCollectionWithArtworks.test.ts`,
  `__tests__/unit/data/getCollectionArtwork.test.ts`,
  `__tests__/unit/loaders/CollectionArtworkLoader.test.tsx`, and
  `__tests__/unit/loaders/CollectionArtworksPaginationLoader.test.tsx`, plus
  route-adapter coverage in `__tests__/unit/api/publicCollectionRoutes.test.ts`.
  Focused Jest, no-self-fetch source checks, lint, build, and
  `git diff --check` passed. Build retained existing MongoDB/static-generation,
  branch-verification, navigation link, and `ArticleView` debug noise.
- 2026-05-16: Prepared T-079 with expected focused coverage for article list
  service success/no-results/failure behavior, public route envelope
  preservation, biography section filter behavior, loader no-self-fetch
  behavior, and touched article list debug-log cleanup.
- 2026-05-16: Completed T-079 focused coverage by adding
  `__tests__/unit/data/getArticleList.test.ts`,
  `__tests__/unit/api/publicArticleListRoute.test.ts`, and
  `__tests__/unit/loaders/BiographySectionLoader.test.tsx`. Focused Jest and
  no-self-fetch/debug-log source checks passed.
- 2026-05-16: Prepared T-080 with expected focused coverage for collection list
  service success/missing-list/failure behavior, public route envelope
  preservation, section filter and limit behavior, and loader no-self-fetch
  behavior.
- 2026-05-16: Completed T-080 focused coverage by adding
  `__tests__/unit/data/getCollectionList.test.ts` and
  `__tests__/unit/loaders/CollectionSectionLoader.test.tsx`, plus
  route-adapter coverage in `__tests__/unit/api/publicCollectionRoutes.test.ts`.
  Focused Jest, no-self-fetch source checks, lint, build, and
  `git diff --check` passed. Build retained existing MongoDB/static-generation
  and debug-log noise from unrelated paths.
- 2026-05-17: Prepared T-081 with expected focused coverage for account
  navigation service success/missing-user/failure behavior, user navigation
  route guard and envelope preservation, loader no-self-fetch behavior,
  unauthenticated loader behavior, and account subnav link construction.
- 2026-05-17: Completed T-081 focused coverage by adding
  `__tests__/unit/data/getOwnUserNavigation.test.ts` and
  `__tests__/unit/loaders/AccountSubnavLoader.test.tsx`, plus route-adapter
  coverage in `__tests__/unit/api/userSavedRoutes.test.ts`. Focused Jest,
  no-self-fetch source checks, lint, build, and `git diff --check` passed.
  Build retained existing MongoDB/static-generation and `Subnav` debug-log
  noise from unrelated paths.
- 2026-05-17: Completed T-082 focused coverage by extending
  `__tests__/unit/api/adminArtworkRoute.test.ts` for valid admin Shopify links,
  non-numeric IDs, GID-style IDs, missing/unknown types, and within-artwork
  duplicate product IDs on artwork create/update. The focused admin artwork
  route test passed with 29 tests, followed by lint, build, and
  `git diff --check`.
- 2026-05-17: Completed T-083 focused coverage by adding
  `__tests__/unit/data/getOwnSavedArtwork.test.ts` and
  `__tests__/unit/loaders/SavedArtworkLoaders.test.tsx`, plus route-adapter
  coverage in `__tests__/unit/api/userSavedRoutes.test.ts`. Focused Jest,
  route/fetcher parity, protected API guard inventory, no-self-fetch source
  checks, lint, build, and `git diff --check` passed. Build retained existing
  unrelated static-generation DB, branch-verification, `Subnav`, and
  `ArticleView` debug output.
- 2026-05-17: Completed T-084 focused coverage by adding
  `__tests__/unit/data/getOwnUserProfile.test.ts`,
  `__tests__/unit/data/getOwnUserComments.test.ts`, and
  `__tests__/unit/loaders/UserProfileCommentsLoaders.test.tsx`, and updating
  `__tests__/unit/api/userProfileRoute.test.ts` plus
  `__tests__/unit/api/userCommentRoute.test.ts`. Focused Jest, route/fetcher
  parity, protected API guard inventory, no-self-fetch source checks, lint,
  build, and `git diff --check` passed. Build retained existing unrelated
  static-generation DB, branch-verification, navigation-link, and `ArticleView`
  debug output.
- 2026-05-17: Completed T-085 focused coverage by adding
  `__tests__/unit/data/getShopProductList.test.ts` and updating
  `__tests__/unit/api/shopProductsRoute.test.ts` plus
  `__tests__/unit/loaders/ShopProductsLoader.test.tsx`. Focused Jest, loader
  no-self-fetch/source checks, lint, build, and `git diff --check` passed.
  Build retained existing unrelated static-generation MongoDB,
  branch-verification, navigation-link, and `ArticleView` debug output.
- 2026-05-17: Prepared T-086 with expected focused coverage or source hygiene
  checks proving touched navigation and redirect files no longer contain
  hard-coded app origins while preserving current route targets.
- 2026-05-17: Completed T-086 focused coverage by adding
  `__tests__/unit/navigationRelativeUrls.test.tsx` for the `/project/about`
  redirect target, logout success navigation to `/`, mobile auth link source
  hygiene, and absence of hard-coded same-app origins in the touched files.
  Focused Jest, lint, build, source search, and `git diff --check` passed.
- 2026-05-17: Prepared T-087 with expected source-hygiene coverage for retired
  server wrapper deletion, absence of active `serverApi` wrapper imports, and
  preservation of client API/fetcher modules.
- 2026-05-17: Completed T-087 source hygiene coverage in
  `__tests__/unit/security/credentialSourceHygiene.test.ts`; focused Jest
  passed, and the required retired-import plus retired URL-construction source
  searches returned no matches.
- 2026-05-17: Prepared T-088 with expected source-hygiene coverage proving DB
  helper files no longer contain direct console calls, MongoDB URI existence
  debug strings, raw adapter profile/user logs, or hard-coded OAuth callback URL
  examples.
- 2026-05-17: Completed T-088 by adding DB helper behavior coverage in
  `__tests__/unit/db/dbHelpers.test.ts` and MongoDB helper source hygiene
  coverage in `__tests__/unit/security/credentialSourceHygiene.test.ts`.
  Focused Jest passed for both files, followed by lint, build, required
  `src/lib/db` source search, and `git diff --check`. Build still emits
  unrelated branch-verification and navigation link logs.
- 2026-05-17: Prepared T-089 with expected source-hygiene coverage for the
  remaining high-noise render debug logs in root layout, `Subnav`, article
  views, and account comments.
- 2026-05-17: Completed T-089 by adding
  `__tests__/unit/security/renderSourceHygiene.test.ts` for the scoped render
  files. Focused Jest, lint, build, required render source search, and
  `git diff --check` passed.
- 2026-05-17: Prepared T-090 with expected source-hygiene coverage for the
  remaining user-facing public/account `console.log()` output in scoped client
  components and account pages.
- 2026-05-17: Completed T-090 by extending
  `__tests__/unit/security/renderSourceHygiene.test.ts` for the scoped
  user-facing client/page files and updating `ArtworkListLoader` focused
  coverage for the renamed `ArtworkGallery` prop handoff. Focused Jest,
  required source search, lint, and build passed.
- 2026-05-17: Prepared T-091 with expected source-hygiene coverage proving
  scoped admin dashboard create/update form and artwork-filter files no longer
  contain direct `console.log()` calls.
- 2026-05-17: Completed T-091 by extending
  `__tests__/unit/security/renderSourceHygiene.test.ts` for the scoped admin
  dashboard form/filter files. Focused Jest, required source search, lint,
  build, and `git diff --check` passed.
- 2026-05-17: Prepared T-092 with expected `copy_id()` unit-test updates and
  source-hygiene coverage proving scoped admin read/copy files no longer
  contain direct `console.log()` calls.
- 2026-05-17: Completed T-092 by updating
  `__tests__/unit/copy_id.test.ts` success-path assertions and extending
  `__tests__/unit/security/renderSourceHygiene.test.ts` to cover the scoped
  admin read/copy files. Focused Jest, required source search, lint, build,
  and `git diff --check` passed.
- 2026-05-17: Prepared T-093 with expected source-hygiene coverage, plus cheap
  behavior coverage where existing local patterns make it useful, for shared UI
  components and the public artwork fetcher.
- 2026-05-17: Completed T-093 by extending
  `__tests__/unit/security/renderSourceHygiene.test.ts` to the scoped shared
  UI/public fetcher files and adding
  `__tests__/unit/api/publicArtworkFetchers.test.ts` for artwork list URL
  construction.
- 2026-05-17: Prepared T-094 with expected source-hygiene coverage, plus cheap
  behavior coverage where practical, for the `getUserFromSession` development
  test-header paths.
- 2026-05-17: Completed T-094 by adding
  `__tests__/unit/auth/sessionTestHeaders.test.ts` for development test-header
  behavior and session helper source hygiene. Focused Jest passed, the scoped
  session helper `console.log()` search returned no matches, and the full
  source `console.log()` search reported only existing commented-out lines.
  `npm run lint`, `npm run build`, and `git diff --check` also passed.
- 2026-05-17: Prepared T-095 so the full-source `console.log()` search should
  return no matches after stale commented debug snippets are removed.
- 2026-05-17: Completed T-095 by adding
  `__tests__/unit/security/consoleLogSourceHygiene.test.ts`, which recursively
  checks `src` source files for direct or commented `console.log()` calls. The
  focused test passed and the full-source `rg -n "console\\.log\\(" src`
  search returned no matches.
- 2026-05-17: Prepared T-096 with focused static Next config tests expected
  for API CORS and baseline security-header invariants.
- 2026-05-17: Completed T-096 by adding
  `__tests__/unit/deployment/nextConfigSecurityHeaders.test.ts` to evaluate
  `next.config.mjs` `headers()` output for removed wildcard credential CORS,
  removed wildcard allowed request headers, baseline hardening headers, required
  CSP directives, and preserved Cloudinary/Shopify/YouTube allowances.
- 2026-05-17: Completed T-097 by adding
  `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx` for shared
  schema defaults, trim/type/duplicate validation, create-form submission,
  duplicate preflight rejection, and update-form link clearing. Existing
  `__tests__/unit/api/adminArtworkRoute.test.ts` now also covers empty-array
  update clearing while preserving T-082 route validation coverage.
- 2026-05-17: Prepared T-098 with expected tests for admin Shopify
  product-link verification success, invalid local input, missing/upstream
  failures, stale-state reset, and client fetcher URL behavior.
- 2026-05-17: Completed T-098 by adding
  `__tests__/unit/api/publicShopFetchers.test.ts` for public shop fetcher URL
  and response behavior, extending
  `__tests__/unit/forms/adminArtworkShopifyProductLinks.test.tsx` for
  verification success, local invalid input, missing/upstream failures,
  advisory save behavior, and stale-state reset, and updating the route/fetcher
  parity inventory for `clientPublicApi.shop.productById()`. The focused
  T-098/T-097/T-082 Jest set, `npm run lint`, `npm run build`, the scoped
  verification reference search, and `git diff --check` passed; build retained
  the existing Browserslist caniuse-lite notice.
- 2026-05-18: Reconciled A-021 smoke findings into F-083 and R-028. Future
  smoke automation work should keep credentialed/admin/Vercel-log checks
  separate until safe owner-approved accounts and access are available.
- 2026-05-18: Prepared T-099 and T-100 with focused test expectations for
  request ID/logger behavior and product enquiry context persistence.
- 2026-05-18: Completed T-100 by extending
  `__tests__/unit/api/publicEnquiryRoute.test.ts` for product-handle
  normalization/rejection and adding
  `__tests__/unit/forms/contactFormProductContext.test.tsx` for contact
  page/form product-context wiring and payload preservation. Focused Jest,
  product-detail regression Jest, lint, stale-TODO search, and
  `git diff --check` passed; `npm run build` initially hit concurrent T-099
  observability logger work, then passed after T-099 was completed.
- 2026-05-18: Completed T-099 by adding focused observability coverage for
  request ID generation/propagation, unsafe header rejection, helper
  `requestId`/`X-Request-Id` behavior, logger redaction, and migrated public/
  user/admin route `500` paths. Focused Jest, lint, build, request-ID source
  search, and `git diff --check` passed.
- 2026-05-18: Reconciled A-010 testing implications into F-088/R-031 and
  prepared T-102 with focused middleware/root-layout source-check expectations.
  Public accessibility controls need targeted component tests when that slice
  is assigned.
- 2026-05-18: Completed T-102 with focused middleware coverage proving public
  routes do not call `getToken()`, a static root-layout source check proving
  global DB/session helpers are absent, and existing render source-hygiene
  coverage. Focused Jest, lint, build, the required root-layout source search,
  and `git diff --check` passed.
- 2026-05-18: Prepared T-103 with focused metadata/discovery test
  expectations for root metadata, robots output, sitemap routes, and removal of
  scaffold metadata text.
- 2026-05-18: Completed T-103 by adding
  `__tests__/unit/deployment/publicMetadataDiscovery.test.ts` for root metadata
  source text, scaffold metadata absence, crawler rules, stable public sitemap
  routes, and discovery URL output.
- 2026-05-18: Prepared T-104 with focused accessibility/control coverage
  expectations for public search, mobile drawers, and unauthenticated artwork
  favourite/watchlist intent controls.
- 2026-05-18: Completed T-104 by adding
  `__tests__/unit/publicSearchNavigationAccessibility.test.tsx` for desktop
  search submit accessibility and URL behavior, unauthenticated saved-item
  modal buttons, labelled drawer trigger/close source invariants, and retired
  clickable-wrapper source hygiene. Focused Jest, lint, build, and
  `git diff --check` passed.
- 2026-05-18: Completed T-105 by adding
  `__tests__/unit/commentActionAccessibility.test.tsx` for owner-only comment
  action accessible names, non-submit button semantics, edit-mode action names,
  decorative hidden icons, and preserved owner-only rendering. Focused Jest,
  lint, build, and `git diff --check` passed.
- 2026-05-18: Prepared T-106 with focused metadata/structured-data coverage
  expectations for public biography article and blog detail pages.
- 2026-05-18: Completed T-106 by adding
  `__tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx` for
  route-specific metadata, canonical URLs, comment-query canonical exclusion,
  missing-content metadata, conservative JSON-LD, and source invariants.
  Focused Jest, lint, build, scaffold-text search, and `git diff --check`
  passed.
- 2026-05-18: Prepared T-107 with focused metadata/structured-data coverage
  expectations for public artwork, collection-scoped artwork, and Shopify
  product detail pages.

## Next Agent Action

Add focused artwork/product detail metadata and structured-data coverage with
T-107. After T-107, choose the next testing slice from the backlog with
targeted coverage for route-local cache policy, discovery endpoint smoke
checks, image tuning, landmark cleanup, or artwork-to-shop SSR discovery when
those implementation slices are assigned.

Keep the route/fetcher parity and protected API guard inventories current when
fetchers or route handlers change. Do not reassign T-081, T-082, T-083, T-084,
T-085, T-086, T-087, T-088, T-089, or T-090 unless a regression is opened.
Do not reassign T-091, T-092, or T-093 unless a regression is opened. T-094,
T-095, T-096, T-097, and T-098 are complete; do not reassign them unless a
regression is opened.

Use the T-025 deployment smoke checklist when validating future deployment,
runtime, auth, Shopify, or route-contract changes. For Next dependencies, wait
for owner/orchestrator acceptance of a Next target, then execute the
verification plan in
[T-015](../tasks/T-015-next-major-migration-preflight.md) during the package
implementation task.

T-082 focused admin product-link validation coverage was added to
`__tests__/unit/api/adminArtworkRoute.test.ts` and passed.
