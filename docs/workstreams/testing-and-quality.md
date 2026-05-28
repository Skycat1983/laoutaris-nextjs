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

- Existing scripts include `npm test`, `npm run typecheck`,
  `npm run verify:local`, `npm run build`, `npm run lint`, and `npm run dev`.
- Jest uses `next/jest` with `jsdom`.
- Current tests are mostly utilities plus a small home view integration test.
- No dedicated end-to-end script is present in `package.json`.
- Playwright is not installed. The testing runbook now treats Playwright as a
  scoped, decision-gated tool for browser-only risks, with explicit route,
  fixture, secret-handling, and artifact limits required before adoption.
- Project owner reports testing has been attempted but is not yet successfully
  established as a reliable production-readiness practice.
- A-006 baseline: `npm test` passed with 9 suites and 95 tests, `npm run lint`
  passed, and `npm run build` passed only after approved network access.
- A-006 coverage probe across `src/**/*.{ts,tsx}` reported 1.78% statements and
  1.76% lines, with no coverage gate.
- The build is currently environment-sensitive because it fetches Google Fonts
  and performs live MongoDB/data work during static generation.
- Framed print preview coverage now includes pure geometry tests, standalone
  preview component tests, modal control tests, prototype route tests, product
  eligibility tests, and product-page launcher tests. T-193 specifically
  asserts the rail renderer uses non-repeating material panel backgrounds
  instead of repeated stripe gradients.
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
- T-124 added a GitHub Actions `Public Smoke` workflow for the existing
  unauthenticated public-route smoke script. Manual runs require a `base_url`;
  scheduled runs require repository variable `SMOKE_BASE_URL` and skip until it
  is configured.
- T-280 removed the localhost socket requirement from the public smoke discovery
  endpoint unit test. The suite still spawns the real public smoke CLI, but
  uses a preloaded in-process `fetch` fixture instead of binding
  `127.0.0.1`, so default-sandbox focused Jest is expected to pass without
  escalated socket permission.
- T-026 added focused shared route-guard tests and representative admin/user API
  auth-status tests.
- T-289 added focused provider-shaped OAuth callback coverage proving the
  default persisted OAuth role reaches JWT and session state.
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
- T-314 extended focused admin read fetcher coverage for the new client-safe
  path builders, explicit supported read resources, encoded detail URLs, and
  preserved pagination/search/filter query-string behavior. Route/fetcher
  parity remained explicit and green.
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
- T-208 extended focused Shopify transform, product detail page, public
  shop-product API, and public shop fetcher coverage for hosted
  `onlineStoreUrl` preservation, invalid/missing URL fallback, external
  Shopify purchase CTA behavior, enquiry fallback behavior, and unavailable
  product behavior.
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
- T-107 added focused metadata/structured-data coverage for public artwork,
  collection-scoped artwork, and Shopify product detail pages.
- T-108 added focused coverage for public image priority, quality, responsive
  sizes, and magnifier intent-loading behavior.
- T-109 added focused source invariant coverage for public landmark ownership
  and repeated visual-module heading cleanup.

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
- Keep the GitHub Actions `Public Smoke` workflow and `npm run smoke:public`
  route inputs current as route contracts and approved smoke records change;
  it remains unauthenticated and does not cover credentialed/admin/log evidence.
- Evaluate Playwright only through a scoped adoption task before installing it:
  identify no more than three first browser-only journeys, the required data or
  smoke account, the command/CI posture, and strict artifact limits.
- Add A-024 loading-state coverage as the implementation lands: source/render
  tests for accessible loading primitives and route-shaped `/search`,
  `/artwork`, and `/shop/products` loading shells, then one targeted delayed
  route-transition check after the shells exist. Phase 1 completed focused
  render coverage for the shared primitive and converted public in-page
  loaders. Phase 2 completed focused render coverage for the `/search` and
  `/artwork` route shells. Phase 3 completed focused render coverage for
  `/shop/products`. T-257 completed focused coverage for programmatic
  navigation pending feedback in desktop search, mobile drawer search, and the
  home artwork filter hero. T-258 completed focused coverage for the admin
  dashboard `@main` loading skeleton. T-259 completed the targeted delayed
  route-transition check. T-260 completed focused coverage for account-menu
  internal route `Link` semantics, disabled authenticated/unauthenticated
  states, logout behavior, and the lazy account island source boundary.
- Add native-package/runtime smoke expectations when bcrypt, Next, auth
  configuration, or deployment tracing changes.
- Isolate or document Google Fonts and live MongoDB dependencies for CI build
  verification.
- Reduce expected test/build noise by migrating remaining non-route direct
  `console.error()`/`console.warn()` calls in policy-aligned slices, starting
  with T-126 public loader/page logging. T-127 completed the scoped Shopify
  provider/data service slice. T-128 completed the scoped server
  action/session-helper slice. T-129 completed the account saved-artwork loader
  slice. T-130 completed the first public browsing client console-error
  cleanup with focused source-hygiene and behavior coverage. T-131 completed
  the account/user client console-error cleanup with focused source-hygiene and
  behavior coverage for forms, logout, account navigation, comment owner
  actions, and the error boundary. T-132 completed the shared fetcher and
  low-value utility/helper slice with source-hygiene and focused fallback
  behavior coverage. T-133 completed the remaining admin dashboard client
  source-hygiene slice.
- Keep the GitHub Actions `Main CI` workflow current as the local gate command
  set, expected build limitations, and expected durations stabilize.
- Track residual production and dev-only dependency advisories after T-011 so
  future audits can distinguish accepted residual risk from newly introduced
  vulnerabilities.
- When the owner accepts a stable Next target, apply T-015's Next major
  verification plan: focused auth/admin/public archive/shop/Jest coverage, full
  Jest, env guard, lint after the `next lint` migration, and build.
- Add focused coverage for reconciled A-011/A-017/A-018 gaps as they are
  implemented: public search scope, destructive-delete preview behavior, and
  future taxonomy/i18n option parity.

## Acceptance Criteria

- Every production-critical workstream lists its required verification commands.
- Test failures are documented with owner and next action.
- New refactors include focused tests when behavior changes.
- Build and test commands can be run by a new agent without extra context.
- Any browser automation added to the repo has an explicit route list,
  fixture/credential plan, and artifact budget before the dependency or script is
  introduced.

## Verification

```bash
npm run typecheck
npm test
npm run build
npm run lint
git diff --check
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
- 2026-05-22: T-208 extended focused Shopify tests for `onlineStoreUrl`
  querying/preservation across list, handle, and ID reads, invalid or missing
  hosted URL normalization to `null`, product detail external Shopify CTA
  behavior, enquiry fallback behavior, unavailable-product behavior, and
  public shop API/fetcher fixture contracts.
- 2026-05-16: Prepared T-064 with install/runtime verification expectations:
  record Node/npm versions, prove the lockfile install path with
  `npm ci --dry-run --ignore-scripts`, then run the normal test, lint, and
  build baseline.
- 2026-05-16: T-064 completed install/runtime verification: Node `v22.14.0`,
  npm `10.9.2`, `npm ci --dry-run --ignore-scripts`, full Jest with 56 suites
  and 512 tests, lint, and build passed. Existing date utility console output,
  Browserslist notice, Google Fonts retries, MongoDB/static-generation logs,
  branch-verification logs, and fetcher debug logs remained expected noise.
- 2026-05-18: T-124 added `.github/workflows/public-smoke.yml` for
  unauthenticated public smoke in GitHub Actions using Node `22.14.0`,
  `npm ci`, manual `base_url`, scheduled `SMOKE_BASE_URL`, and optional
  non-secret `SMOKE_*` route variables. Verification used smoke-script help,
  workflow inspection, and `git diff --check`; no live GitHub Actions run was
  required without an owner-provided public base URL.
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
- 2026-05-18: Completed T-107 by adding
  `__tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx`
  for route-specific artwork/product metadata, canonical URLs, noindex
  missing/unavailable fallbacks, conservative artwork/product JSON-LD, absence
  of same-app HTTP in the metadata slice, and no product structured-data
  commerce/legal claims. Focused Jest, lint, build, scaffold-text search, and
  `git diff --check` passed.
- 2026-05-18: Prepared T-108 with focused coverage expectations for public
  image priority/quality/sizes and artwork magnifier intent-loading behavior.
- 2026-05-18: Completed T-108 by adding
  `__tests__/unit/publicImagePreloadSizing.test.tsx` for active hero
  priority/quality/sizes source invariants, touched shop/product image `sizes`,
  and magnifier hover/focus intent loading. Focused Jest, lint, build, and
  `git diff --check` passed.
- 2026-05-18: Prepared T-109 with focused landmark/heading source or component
  coverage expectations for public routes touched by the cleanup.
- 2026-05-18: Completed T-109 by adding
  `__tests__/unit/publicLandmarksHeadings.test.ts` for root non-landmark
  layout ownership, public route/view main ownership, and presentational
  public heading cleanup across touched hero/card/sidebar/section modules.
  Focused Jest, lint, build, and `git diff --check` passed.
- 2026-05-18: Prepared T-110 with focused source-invariant expectations for
  public route rendering/cache policy and any conservative route segment
  configs added by the slice.
- 2026-05-18: Completed T-110 with
  `__tests__/unit/publicRouteCachePolicy.test.ts`, covering explicit dynamic
  config on route-local dynamic public pages, absence of ISR/static-param
  promises on stable public shell routes, and the durable rendering/cache
  matrix.
- 2026-05-18: Prepared T-111 with focused coverage expectations for the
  server-side artwork-linked Shopify product resolver, refactored
  `ArtworkShopSection`, and touched artwork loaders.
- 2026-05-18: Completed T-111 with focused resolver, component, and loader
  tests covering server-side product grouping, skipped invalid/unavailable/
  failed links, removed browser product fetches, and grouped section rendering.
- 2026-05-18: Prepared T-112 with focused breadcrumb structured-data coverage
  expectations for helper output, rendered scripts, missing data, and preserved
  no-commerce-claims product JSON-LD.
- 2026-05-18: Completed T-112 by adding
  `__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx` for
  breadcrumb helper output, entity-plus-breadcrumb script rendering, missing
  and failed lookup null behavior, descriptive-only product structured data,
  and no same-app HTTP in the structured-data path. The focused metadata
  regression suites, lint, build, and `git diff --check` passed.
- 2026-05-18: Prepared T-113 with focused dynamic sitemap coverage
  expectations for stable plus detail URLs, duplicate/private exclusions, and
  graceful dynamic-source failure behavior.
- 2026-05-18: Completed T-113 with
  `__tests__/unit/deployment/publicDynamicSitemap.test.ts` covering stable plus
  dynamic public detail URLs, canonical URL generation, duplicate and malformed
  path exclusion, private path exclusion, and graceful scoped source failures.
  The existing public metadata discovery test now awaits the async sitemap
  output with dynamic data mocked out. Focused Jest, lint, build, and
  `git diff --check` passed.
- 2026-05-18: Prepared T-114 with focused public smoke-script coverage
  expectations for `/robots.txt` and `/sitemap.xml` status/content assertions,
  actionable failure output, and preserved existing route smoke behavior.
- 2026-05-18: Completed T-114 with
  `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` covering
  successful discovery endpoint output, missing robots sitemap-directive
  failure output without raw body dumping, and private sitemap path failure
  output. Focused Jest, `npm run smoke:public -- --help`, lint, build, and
  `git diff --check` passed.
- 2026-05-18: Prepared T-115 with focused Shopify fetch-policy coverage
  expectations for development and production request options, plus existing
  product transform and dynamic sitemap regression coverage.
- 2026-05-18: Completed T-115 by extending
  `__tests__/unit/shopifyClientTransform.test.ts` to cover Shopify Storefront
  fetch request options in development and production, plus preserved GraphQL
  request bodies for product list, handle, and ID reads. Focused Jest, lint,
  build, and `git diff --check` passed.
- 2026-05-18: Prepared T-116 as a docs-only incident-response runbook slice
  with verification limited to `git diff --check` unless the agent adds link
  checks or scripts.
- 2026-05-18: Completed T-116 as a docs-only incident-response runbook slice.
  Verification was limited to `git diff --check`; no tests, scripts, or runtime
  behavior changed.
- 2026-05-18: Prepared T-117 with focused observability/API coverage
  expectations for representative public content list/detail internal-failure
  paths, propagated/generated request IDs, `X-Request-Id`, and source hygiene
  against direct route-level `console.error()`.
- 2026-05-18: Completed T-117 by extending focused public content route tests
  for representative list/detail failure paths, propagated and generated
  request IDs, response `X-Request-Id`, structured log context, private-message
  redaction from public bodies, and source hygiene across the migrated public
  content route files. Focused Jest, lint, build, scoped `console.error()`
  source search, and `git diff --check` passed.
- 2026-05-18: Prepared T-118 with focused coverage expectations for public
  search, navigation, shop list, and shop detail internal/upstream failure
  paths, including propagated/generated request IDs, `X-Request-Id`, and source
  hygiene against direct route-level `console.error()`.
- 2026-05-18: Completed T-118 by extending focused public search, navigation,
  shop list, shop detail, and observability route tests for representative
  failure paths, propagated and generated request IDs, response
  `X-Request-Id`, structured log context, private-message redaction from public
  bodies, and source hygiene across the migrated public search/navigation/shop
  route files. Focused Jest, lint, build, scoped `console.error()` source
  search, and `git diff --check` passed.
- 2026-05-18: Prepared T-119 with focused coverage expectations for protected
  user saved-item and comment internal-failure paths, propagated/generated
  request IDs, `X-Request-Id`, preserved guard/ownership behavior, and source
  hygiene against direct route-level `console.error()`.
- 2026-05-18: Completed T-119 by extending focused saved-item, comment, and
  observability route tests for protected user internal-failure paths,
  propagated and generated request IDs, response `X-Request-Id`, structured log
  context, private-message redaction from public bodies, and source hygiene
  across migrated protected user route files. Focused Jest, lint, build, scoped
  `console.error()` source search, and `git diff --check` passed.
- 2026-05-18: Prepared T-120 with focused coverage expectations for admin read
  list/detail internal-failure paths, propagated/generated request IDs,
  `X-Request-Id`, preserved admin guard behavior, and source hygiene against
  direct route-level `console.error()`.
- 2026-05-18: Completed T-120 by extending focused admin read and
  observability route tests for representative list/detail failure paths,
  propagated and generated request IDs, response `X-Request-Id`, structured log
  context, private-message redaction from public bodies, preserved admin guard
  behavior, and source hygiene across migrated admin read route files. Focused
  Jest, lint, build, scoped `console.error()` source search, and
  `git diff --check` passed.
- 2026-05-18: Prepared T-121 with focused coverage expectations for
  representative admin create, update, and delete internal-failure paths,
  propagated/generated request IDs, `X-Request-Id`, preserved guard/validation/
  transaction behavior, and source hygiene against direct route-level
  `console.error()`.
- 2026-05-18: Completed T-121 by extending focused admin article, artwork,
  blog, collection, delete-route, and observability tests for representative
  create/update/delete failure paths, propagated and generated request IDs,
  response `X-Request-Id`, structured log context, private-message redaction
  from public bodies, preserved guard/validation/transaction behavior, and
  source hygiene across migrated admin mutation route files. Focused Jest,
  lint, build, scoped `console.error()` source search, and `git diff --check`
  passed.
- 2026-05-18: Prepared T-122 to consolidate route-level logging source hygiene
  with recursive API-v2 route handler coverage for direct `console.error()` and
  `console.warn()` calls, instead of maintaining only per-slice route lists.
- 2026-05-18: Completed T-122 by replacing per-slice API route source-hygiene
  lists with one recursive `src/app/api/v2/**/route.*` guard in the
  observability route test. Focused Jest passed and the confirming source
  search found no direct `console.error()`/`console.warn()` calls under
  `src/app/api/v2`.
- 2026-05-18: Prepared T-123 as a docs-only monitoring plan task. Its
  verification should stay to source/config/env evidence searches and
  `git diff --check`; provider-specific SDK tests and smoke coverage belong to
  later tasks after owner/platform approval.
- 2026-05-18: Completed T-123 as a docs-only monitoring plan task. The new
  architecture plan defines provider-neutral capture surfaces, request ID and
  structured-log integration expectations, environment-variable classification
  rules, and the post-approval implementation contract. Provider-specific SDK
  tests, smoke coverage, alert checks, and client/server instrumentation tests
  remain future work after owner/platform approval.
- 2026-05-27: Completed T-310 focused monitoring coverage. Added Sentry
  redaction/source-hygiene tests and extended structured logger coverage to
  prove Sentry receives only redacted context plus safe request ID, route, and
  method tags. Focused observability tests passed; explicit typecheck and full
  Jest are blocked by unrelated route-builder/cache-policy test drift noted in
  the deployment workstream handoff.
- 2026-05-18: Prepared T-124 to make `npm run smoke:public` available through
  GitHub Actions without credentials or provider alerting. Verification should
  cover smoke help output, workflow source review, and `git diff --check`; a
  live GitHub Actions run requires an owner-provided public base URL.
- 2026-05-18: Completed T-124 by adding the GitHub Actions `Public Smoke`
  workflow for manual and scheduled unauthenticated public smoke checks. The
  workflow uses Node `22.14.0`, `npm ci`, a required manual `base_url`, and
  scheduled non-secret repository variable `SMOKE_BASE_URL`; optional detail
  route inputs stay non-secret repository variables.
- 2026-05-18: Prepared T-125 as a policy/inventory task for remaining
  non-route direct `console.error()`/`console.warn()` calls. Verification should
  stay to targeted source inventory and `git diff --check`; source-hygiene
  enforcement belongs to later implementation slices once categories are set.
- 2026-05-18: Completed T-125 as a policy/inventory task. The logging/redaction
  architecture doc records 86 direct non-route `console.error()`/
  `console.warn()` calls across 66 files, grouped by migration surface. T-126 is
  prepared as the first source-hygiene implementation slice for public server
  loaders and App Router pages.
- 2026-05-18: Completed T-126 by extending focused logger/page/loader tests for
  structured redacted server events and preserved fallback behavior, plus a
  source-hygiene guard for the scoped public loader/App Router page file list.
- 2026-05-18: Prepared T-127 with focused coverage expectations for Shopify
  provider/data service structured logging, redaction, preserved product DTOs,
  preserved partial fan-out behavior, and source hygiene for the scoped files.
- 2026-05-18: Completed T-127 by adding focused Shopify provider/data service
  structured logging assertions and
  `shopifyProviderServiceLoggingSourceHygiene.test.ts`. Focused Jest, scoped
  source search, and `git diff --check` passed.
- 2026-05-18: Prepared T-128 with focused coverage expectations for server
  action/session-helper structured logging, preserved action return contracts,
  preserved saved-item mutation/revalidation behavior, preserved development
  test-header semantics, and scoped source hygiene.
- 2026-05-18: Completed T-128 by adding structured logging assertions for
  subscription, saved-item, and development test-header lookup failures plus
  `serverActionSessionLoggingSourceHygiene.test.ts`. Focused Jest, scoped
  source search, and `git diff --check` passed.
- 2026-05-18: Completed T-129 by adding structured logging assertions for
  account favourite artwork loader failure paths, preserved fallback/success/
  Next control-flow behavior checks, and
  `accountSavedArtworkLoaderLoggingSourceHygiene.test.ts`. Focused Jest,
  scoped source search, and `git diff --check` passed.
- 2026-05-18: Completed T-130 by adding
  `publicBrowsingClientLoggingSourceHygiene.test.ts`,
  `publicBrowsingClientErrorStates.test.tsx`, and a shop gallery filter
  failure regression in `shopProductGallerySorting.test.tsx`. Focused Jest and
  the scoped `console.error()`/`console.warn()` source search passed.
- 2026-05-18: Completed T-131 by adding
  `accountUserClientLoggingSourceHygiene.test.ts` and
  `accountUserClientErrorStates.test.tsx` for the scoped account/user client
  console-error cleanup. Focused Jest, adjacent contact/navigation/comment
  component tests, scoped source search, and `git diff --check` passed.
- 2026-05-18: Prepared T-132 with expected source-hygiene and focused behavior
  coverage for shared fetcher contracts, date/translation fallbacks, copy
  behavior, color icon fallback rendering, and blog sidebar state.
- 2026-05-18: Completed T-132 by extending
  `renderSourceHygiene.test.ts`, adding
  `sharedFetcherUtilityFallbacks.test.tsx`, and updating focused fetcher, date,
  and copy helper tests to assert silent fallback behavior. Focused Jest, the
  scoped `console.error()`/`console.warn()` source search, and
  `git diff --check` passed.
- 2026-05-19: Prepared T-133 with expected admin dashboard source-hygiene and
  focused behavior coverage for forms, feeds, read lists, operation tabs,
  upload handling, and the document reader.
- 2026-05-19: Completed T-133 by extending
  `renderSourceHygiene.test.ts` with a recursive admin dashboard
  `console.error()`/`console.warn()` guard. The focused admin dashboard source
  search, focused Jest pair, and `git diff --check` passed.
- 2026-05-19: Completed T-134 as a docs-only incident owner-matrix handoff.
  Verification was limited to the required runbook owner-placeholder search,
  runbook secret-pattern search, and `git diff --check`; no runtime behavior or
  automated test surface changed.
- 2026-05-19: Completed T-135 by adding
  `contentImageUrlValidation.test.ts` plus focused admin article, blog, and
  collection route coverage for allowed Cloudinary URLs, allowed
  Flaticon/Shopify CDN URLs, rejected arbitrary hosts, rejected malformed URLs,
  and unchanged successful persistence.
- 2026-05-19: Completed T-137 by adding
  `clientServerImportBoundary.test.ts`, a recursive static guard for client
  runtime import graphs. The current inventory covers 120 client entries and
  207 runtime-reachable local modules with no allowlist.
- 2026-05-19: T-140 reconciled A-011, A-017, and A-018 testing follow-ups into
  F-091 through F-104 and R-005. T-141 and T-142 include focused route tests in
  their acceptance criteria; T-143 later selected staged site-wide public search
  widening, and T-210/T-211 added the focused search service/API/page coverage
  for artwork and Shopify product results.
- 2026-05-19: Completed T-141 and T-142 with focused admin delete,
  article-write, and collection-write route coverage for current-admin/
  last-admin deletion guards and artwork relationship existence checks.
- 2026-05-19: Completed T-144, T-145, and T-146 with focused admin collection
  form, structured fetcher error, `/artwork` page/API query parity, blog
  loader/view, and continuous-loading tests. Combined focused verification
  passed across 8 suites and 30 tests.
- 2026-05-19: Completed T-147 and T-148 with focused main-nav fallback and
  admin article/blog form error-surface coverage. Combined focused verification
  with the T-144 collection form regression suite passed across 3 suites and
  15 tests.
- 2026-05-19: Prepared T-150, T-151, and T-152 with focused verification
  expectations for artwork form errors, current-scope search empty/pagination
  behavior, and admin archive entry-point handoffs.
- 2026-05-19: Completed T-150, T-151, and T-152 with focused artwork form,
  current-scope search service/API/page, admin archive entry-point, and
  regression form coverage. The combined focused suite passed across 7 suites
  and 42 tests after making the slow artwork component test timeout explicit.
- 2026-05-19: Prepared T-153, T-154, and T-155 with focused verification
  expectations for blog admin controls, taxonomy section runtime validation,
  and visible breadcrumb labels.
- 2026-05-20: Completed T-153, T-154, and T-155 with focused blog admin form,
  public article/navigation/collection route validation, loader regression,
  visible breadcrumb, and public breadcrumb structured-data coverage. Combined
  focused verification passed across 8 suites and 61 tests; lint and
  `git diff --check` passed.
- 2026-05-20: Prepared T-156 with focused verification expectations for admin
  delete cascade preview guard behavior, invalid-ID handling, cascade counts,
  blocker reporting, and no mutation on preview.
- 2026-05-20: Completed T-156 with focused admin delete preview route coverage
  for guard short-circuiting, invalid IDs, representative cascade counts,
  blocker reporting, production evidence reminders, and no mutation on preview.
  Orchestrator verification passed the focused delete route suites, lint,
  `git diff --check`, and `npm run build`.
- 2026-05-20: Prepared T-157 through T-161 for the homepage prototype and
  style-system audit track. Prototype implementation tasks should run lint and
  `git diff --check`, adding focused tests only when they introduce data
  mapping or fallback behavior that needs regression coverage. T-161 is
  audit-only and should verify with `git diff --check`.
- 2026-05-20: Completed T-157 through T-161. Prototype route, biography/blog/
  shop data loaders, route shell, fallback behavior, source-isolation guards,
  and style-system audit handoff are covered by focused verification. The
  orchestrator reran the combined prototype suite across 4 suites and 20 tests.
- 2026-05-20: Prepared T-162 as a tightly scoped visual QA/owner-feedback task
  for `/prototype/home`, with browser automation limited to targeted desktop
  and mobile checks if needed.
- 2026-05-20: Completed T-162. The visual QA handoff records section-level
  readiness, refinement notes, content/data corrections, and owner decisions
  for biography ordering, canonical dates, blog content strategy, shop wording,
  and mobile density before production migration.
- 2026-05-20: Completed T-163. Focused coverage now verifies admin delete
  preview fetchers, route/fetcher parity, and delete confirmation loading,
  failure, blocked, and unblocked preview states. Orchestrator verification
  passed the focused T-163 tests, lint, `git diff --check`, and `npm run build`.
- 2026-05-20: Completed T-164. Focused coverage now verifies admin delete
  evidence fetcher bodies, route rejection before destructive work when
  evidence is missing, UI evidence gating, trimmed evidence submission, and
  existing successful delete behavior with valid evidence. Orchestrator
  verification passed the focused T-164 tests, lint, `git diff --check`, and
  `npm run build`.
- 2026-05-20: Completed T-165, T-166, and T-167. Focused coverage now verifies
  redacted admin delete audit-event payload shape, audit create ordering,
  no-mutation-on-audit-failure, representative audit outcomes, and the wider
  route-local `/prototype/home` frame. Orchestrator verification passed the
  combined focused suites for admin delete audit routes and prototype home,
  lint, `git diff --check`, and `npm run build`.
- 2026-05-20: Completed T-168. Read-only visual QA used targeted desktop and
  mobile browser checks on `/prototype/home`, recorded no page-level horizontal
  overflow in the checked viewports, and kept evidence concise in the task
  handoff.
- 2026-05-20: Completed T-169 through T-173. T-170 added focused
  source/invariant coverage for the semantic style map, T-171 and T-173
  recorded read-only audit evidence, and T-174 through T-178 were prepared as
  the next admin archive maintenance sequence.
- 2026-05-20: Completed T-174 and T-178. Focused coverage now verifies invalid
  admin read-list pagination is rejected before resource list queries, default
  metadata is preserved, and comment/user read-list delete handoffs open the
  guarded confirmation flow without deleting before required evidence.
- 2026-05-20: Completed T-175. Focused coverage now verifies admin blog
  read-list previous/next pagination from route metadata, retained
  Copy/Update/Delete card actions on paginated results, and operator-visible
  empty/error states.
- 2026-05-20: Completed T-176. Focused coverage now verifies filtered admin
  blog route queries are used for both `find()` and `countDocuments()`, the
  read fetcher sends `filterKey`/`filterValue`, and the UI resets to page 1
  when sending route-backed filters.
- 2026-05-20: Completed T-177. Focused coverage now verifies bounded admin
  blog search validation, escaped title/slug route queries before counts and
  paginated reads, trimmed fetcher params, search reset-to-page-1 behavior,
  no-results messaging, and retained card actions.
- 2026-05-20: Completed T-179. Focused coverage now verifies bounded admin
  collection search validation, escaped title/slug route queries before counts
  and paginated reads, trimmed fetcher params, pagination controls, search
  reset-to-page-1 behavior, no-results/error states, artwork count display, and
  retained card actions.
- 2026-05-20: Completed T-180. Focused coverage now verifies bounded admin
  article search validation, route-backed section/overlay filters, escaped
  title/slug route queries before counts and paginated reads, trimmed fetcher
  params, pagination controls, search/filter reset-to-page-1 behavior,
  no-results/error states, image card display, and retained card actions.
- 2026-05-20: Completed T-181. Focused coverage now verifies bounded admin
  artwork title search validation, constrained route-backed artwork filters,
  escaped title route queries before counts and paginated reads, trimmed
  fetcher params, pagination controls, search/filter reset-to-page-1 behavior,
  no-results/error states, artwork card display, and retained card actions.
- 2026-05-20: Completed T-182. Focused coverage now verifies comment/user
  read-tab pagination from route metadata, empty/error states, and retained
  Copy ID plus guarded Delete handoff actions on paginated cards.
- 2026-05-20: Completed T-183. Focused admin read-list pagination coverage,
  archive entry-point coverage, and lint now pass after extracting the shared
  admin read pagination control with no behavior changes.
- 2026-05-20: Completed T-184. The strict TypeScript `noEmit` audit found 46
  top-level diagnostics across 18 files, all under `__tests__/`, and
  recommended fixing stale navigation DTO fixtures first.
- 2026-05-20: Completed T-185. Stale public navigation DTO fixtures were
  updated across navigation loader/page tests; focused navigation tests passed,
  and strict TypeScript now reports 26 remaining unrelated test-only
  diagnostics.
- 2026-05-20: Completed T-186. The loader/form `never` fixture group was
  replaced with current contract-based typed fixtures; focused loader/form
  tests passed, strict TypeScript no longer reports diagnostics in the five
  T-186 files, and remaining test-only `noEmit` cleanup moves to T-198.
- 2026-05-21: Completed T-193. Focused frame-preview tests now verify the rail
  renderer exposes panel mode, uses no-repeat full-size rail backgrounds, and
  does not emit `repeating-linear-gradient`; lint, build, and a targeted
  `/prototype/frame` route check passed for the slice.
- 2026-05-22: Completed T-198. The remaining test-only strict TypeScript
  `noEmit` diagnostics were cleared across admin read-route guard,
  session-header, DB helper, client/server import-boundary, shop product detail,
  and upload button tests. Focused tests passed, and
  `npx tsc --noEmit --pretty false --skipLibCheck` now passes without adding a
  CI or release gate.
- 2026-05-22: Completed T-203. Focused homepage section-loader tests now verify
  visible unavailable and empty fallbacks for biography, collections, and blog
  sections, structured server logging on non-Next failures, Next control-flow
  rethrows, preserved successful service inputs, and no same-app HTTP usage.
- 2026-05-22: Completed T-204. Focused public browsing client tests now verify
  visible retryable failure states for artwork filtering/load-more, shop
  product filtering, and blog continuous loading while preserving already
  rendered content; public browsing client source-hygiene coverage still
  passes. A reconciliation follow-up also cleared the ArticleLoader no-emit
  diagnostic, and strict TypeScript `noEmit` passes again.
- 2026-05-22: Completed T-205. The client/server import-boundary test now also
  guards `src/app` and `src/components/loaders` against mixed component barrel
  value imports, and focused loader/form tests pass after mocks were moved to
  direct file paths.
- 2026-05-22: Completed T-206. Account layout coverage now proves
  `AccountSubnavLoader` is mounted inside `Suspense` before account content and
  that the source cannot satisfy the invariant with a JSX-commented loader
  block; existing account subnav loader tests still pass.
- 2026-05-22: Completed T-210. Focused public search service, API route, and
  page tests now cover all-type artwork results, selected `type=artworks`,
  unsupported type validation copy, all-type artwork section rendering, and
  selected artwork no-results states.
- 2026-05-22: Prepared T-211 as the next public search quality slice, covering
  Shopify product search service/API/page behavior while preserving existing
  article, blog, collection, and artwork search coverage.
- 2026-05-22: Completed T-211. Focused public search service, API route, and
  page tests now cover all-type Shopify product results, selected
  `type=shop-products`, unsupported type validation copy, all-type Shop
  Products section rendering, selected product no-results states, lint, and
  strict TypeScript verification.
- 2026-05-22: Completed T-212 as the docs-only compliance decision-packet
  task. The owner later approved the packet recommendations for implementation
  scoping before T-213 was assigned.
- 2026-05-22: Completed T-213. `PolicyPages.test.tsx` covers `/privacy`,
  `/terms`, footer legal links, metadata, owner/contact details, approved
  version display, disclosed privacy surfaces, Shopify boundary copy, and
  source checks against unsupported jurisdiction-specific labels and commerce
  assurances.
- 2026-05-22: Completed T-214. Focused subscription, unsubscribe page, and
  newsletter form tests cover consent validation, persisted consent/source
  metadata, duplicate stability, public-safe unsubscribe behavior, source path
  hygiene, and redacted logging. Account acknowledgement and manual request
  handoff coverage remained separate until T-215.
- 2026-05-22: Completed T-215. Focused registration, user model/adapter,
  sign-up acknowledgement, provider sign-in notice, account privacy request,
  middleware, navigation, and smoke discovery tests cover the account
  acknowledgement/manual request slice. The focused Jest run emitted the
  existing `punycode` deprecation warning.
- 2026-05-22: Completed T-216. `CommentFormNotice.test.tsx` covers the public
  comment posting notice, policy links, manual request email link,
  moderation/removal/correction wording, and the preserved submit/reset
  contract. Adjacent account-user and public browsing client error-state tests
  also passed.
- 2026-05-22: Completed T-217. `ContactEnquiryNotice.test.tsx` covers contact
  and artwork enquiry notices, policy links, manual email handoff,
  product/artwork context wording, and preserved contact/artwork submit
  payloads. Adjacent product-context and account-user error-state tests also
  passed.
- 2026-05-23: Completed T-218. `PolicyPages.test.tsx` now covers preserved
  footer contact/legal links, absence of `href="#"` social placeholders,
  absence of Facebook/Twitter/Instagram placeholder links, current-year
  copyright rendering, stale 2024-only copyright removal, and source hygiene
  against placeholder social links.
- 2026-05-23: Completed T-219 as a docs-only owner-input blocker record. No
  runtime tests were added because no runtime behavior changed.
- 2026-05-23: Reactivated T-207 as the next unblocked fallback-pattern cleanup
  task. It should add focused documentation/source coverage for the accepted
  route fallback pattern and `/project/aims` generic loading fallback removal.
- 2026-05-23: Completed T-207. Added
  `__tests__/unit/publicRouteFallbackPatterns.test.ts` to guard the rendering
  architecture fallback-pattern section and prevent the `/project/aims` generic
  inline loading fallback from returning.
- 2026-05-23: Completed T-230. The existing recursive
  `clientServerImportBoundary` guard now passes after the `SignUpForm` constants
  import was narrowed, and the focused sign-up privacy acknowledgement test
  still passes.
- 2026-05-23: Completed T-231. `middleware.test.ts` now covers the narrowed
  protected matcher contract, preserved protected auth outcomes, public page/API
  exclusion, `/api/auth/*` exclusion, and protected prefix lookalikes.
  `routeUtils.test.ts` covers exact-or-nested protected route semantics.
- 2026-05-23: Completed T-233. Added
  `getCachedBiographyArticleData.test.ts` for the 10-minute `unstable_cache`
  wrapper contract and updated public route policy, biography page, biography
  loader, subnav, metadata, and structured-data coverage. Focused Jest and
  `npm run build` passed; build manifest evidence recorded `/biography`
  `initialRevalidateSeconds: 600` while unrelated stable shells stayed
  deploy-bound.
- 2026-05-23: Scoped T-234. Build evidence captured the public route
  first-load JavaScript baseline and root layout chunk contents before the
  planned T-236 lazy mobile drawer proof.
- 2026-05-23: Completed T-236. Focused source coverage now guards the lazy
  mobile drawer split, labelled trigger/close controls, relative account links,
  and client/server import boundary. Verification passed with the targeted
  Jest run, `npm run build`, and `git diff --check`; Jest still reported the
  existing `punycode` deprecation warnings.
- 2026-05-23: Completed T-235. `clientServerImportBoundary.test.ts` now guards
  `src/app` and `src/components` against non-action top-level `"use server"`
  directives. Verification passed with the required directive inventory,
  targeted Jest run, and `npm run build`; targeted Jest still reported the
  existing `punycode` deprecation warnings.
- 2026-05-23: Completed T-237 as a docs-only scoping pass. `npm run build`
  passed and supplied the current route-size evidence for selecting T-238 as
  the next collections redirect cache proof.
- 2026-05-24: Completed T-238. Added
  `getCachedCollectionNavigationData.test.ts`, updated public route policy,
  collections page, and collections subnav coverage for the 10-minute cached
  wrapper contract, and reran the focused collection/main-nav route policy
  suite. `npm run build` passed and the prerender manifest recorded
  `/collections` `initialRevalidateSeconds: 600` while collection detail routes
  stayed out of prerender entries.
- 2026-05-24: Completed T-239. `publicRouteCachePolicy.test.ts` now guards
  route-level `revalidate` drift outside `/biography`, `/collections`, and
  `/sitemap.xml`; metadata/dynamic sitemap/smoke tests preserve discovery
  output and fallback behavior. Verification passed with the focused Jest
  suite, `npm run build`, prerender-manifest evidence for `/sitemap.xml`
  `initialRevalidateSeconds: 3600`, and `git diff --check`.
- 2026-05-24: Completed T-240. It identified focused coverage for T-241's blog
  primary-detail cache proof: cached-wrapper coverage, metadata/JSON-LD use,
  `BlogDetailLoader` optional-comment separation, and public route cache policy
  invariants.
- 2026-05-24: Completed T-241. Added focused cached primary blog detail wrapper
  coverage, updated blog metadata/JSON-LD and `BlogDetailLoader` tests to use
  the cached primary wrapper, and extended public route cache policy coverage
  to keep `/blog` and `/blog/[slug]` dynamic with no route-level ISR or
  generated params while public blog APIs stay on direct services. Verification
  passed with the focused Jest suite, `npm run build`, and `git diff --check`;
  build output kept `/blog` and `/blog/[slug]` dynamic.
- 2026-05-24: Completed T-242. Added focused cached default blog list wrapper
  coverage, updated `BlogListLoader` coverage for default cached wrappers
  versus sorted direct `getBlogList()` reads, and extended public route cache
  policy coverage so `/blog` remains dynamic while public blog APIs and
  `BlogSectionLoader` stay direct. Verification passed with the focused Jest
  suite, `npm run build`, and `git diff --check`; build output kept `/blog`
  dynamic.
- 2026-05-24: Completed T-243 as a docs-only sorted blog list cache/query
  hygiene scoping pass. It selected T-244 to add focused query parsing and
  bounds coverage for `/blog`, `GET /api/v2/public/blog`, and adjacent blog
  list callers before any sorted-list cache wrapper is introduced.
- 2026-05-24: Completed T-244. Added focused public blog list query parsing
  coverage for page and API limit bounds, plus page/API route coverage proving
  canonical values reach `BlogListLoader` and `getBlogList()`.
- 2026-05-24: Completed T-245. Added focused cached sorted first-page blog
  list wrapper coverage, `BlogListLoader` coverage for page 1 cached reads
  versus page 2 direct reads, default grouped cache behavior, and public route
  cache policy invariants. Verification passed with the focused Jest suite,
  `npm run build`, and `git diff --check`; build output kept `/blog` dynamic.
- 2026-05-24: Completed T-247. Added focused cached bounded sorted-page
  wrapper coverage for `latest`, `oldest`, and `featured` pages 2-5, loader
  coverage for bounded cached reads plus direct `popular` page 2 and sorted
  page 6 fallbacks, and public route-cache policy assertions that `/blog`
  stays dynamic while public APIs and home section loaders stay direct.
  Verification passed with the focused Jest suite for the touched wrapper,
  loader, and route-cache policy tests, `git diff --check`, and
  `npm run build`; build output kept `/blog` and `/blog/[slug]` dynamic.
- 2026-05-24: Completed T-248 as a docs-only public cache target scoping pass.
  It selected T-249 and defined focused verification for a default-only
  `/artwork` browse cache proof: cached wrapper coverage, `ArtworkListLoader`
  default cached branch versus direct non-default branches, public artwork
  API/fetcher exclusion, and public route-cache policy invariants.
- 2026-05-24: Completed T-249. Added focused cached artwork list wrapper
  coverage, `ArtworkListLoader` default cached branch coverage, direct
  non-default branch coverage for filtered/page/limit/sort/`sortColor`
  variants, and public route-cache policy assertions that `/artwork` stays
  dynamic while public artwork APIs, fetchers, detail reads, saved-item reads,
  and Shopify product-link paths stay direct.
- 2026-05-24: Completed T-250 as a docs-only cache-efficiency scoping pass. It
  selected T-251 and defined focused verification for fixed unfiltered
  `mostRecent` `/artwork` pages 2-5: cached wrapper/dispatcher coverage,
  `ArtworkListLoader` cached page 2-5 branches, direct fallback branches for
  page 6-plus and non-default variants, public API/fetcher/detail exclusions,
  and public route-cache policy invariants.
- 2026-05-24: Completed T-251. Added focused cached artwork list wrapper and
  dispatcher coverage for fixed unfiltered `mostRecent` pages 1-5, loader
  coverage for cached pages 2-5 plus direct page 6/non-default fallbacks, and
  public route-cache policy assertions that `/artwork` stays dynamic while
  public APIs, fetchers, detail reads, saved-item reads, and Shopify
  product-link paths stay direct. Verification passed with the focused Jest
  command for the touched wrapper, loader, and route-cache policy tests, `git
  diff --check`, and `npm run build`; the first non-escalated build attempt
  failed on restricted Google Font downloads, and the escalated rerun passed.
- 2026-05-24: Completed T-252 as a docs-only post-browse efficiency scoping
  pass. It selected T-253 to scope the next F-115 provider/modal
  client-island task and kept remaining F-111 runtime cache candidates
  deferred pending separate policy decisions.
- 2026-05-24: Completed T-253 as a docs-only root provider/modal scoping pass.
  It selected T-254 and defined focused verification for the modal-provider
  cleanup/lazy-host runtime slice, including existing modal consumer behavior
  tests, client import-boundary coverage, `npm run build`, and root layout
  chunk comparison against the T-236 `27,772` byte baseline.
- 2026-05-24: Completed T-254. Added focused modal-provider/lazy-host coverage
  for the modal-only provider shape, `openModal`/`closeModal`/`setModalContent`
  behavior, language-state decoupling, SessionProvider/modal root ownership,
  and Headless UI dialog source isolation. Verification passed with the new
  modal test, the requested modal-consumer/import-boundary Jest slice,
  `npm run build`, `git diff --check`, targeted source searches, and root
  layout/lazy chunk byte checks.
- 2026-05-24: Completed T-255 as a docs-only post-modal efficiency scoping
  pass. It selected T-256 and defined focused verification for the account-nav
  lazy-island runtime slice: account navigation behavior, provider ownership,
  client import-boundary coverage, `npm run build`, `git diff --check`, and
  root layout chunk comparison against the T-254 `27,498` byte baseline.
- 2026-05-24: Completed A-024 Phase 0 reconciliation for loading-state UX.
  Testing follow-up is scoped to focused source/render coverage for loading
  primitives and route loading shells first, followed by one targeted delayed
  route-transition check after the runtime shells exist. Playwright remains
  uninstalled unless a later scoped task explicitly approves it.
- 2026-05-24: Completed A-024 Phase 1 coverage. Added focused Jest render tests
  for the shared loading primitive, `Spinner`, `PageLoading`, pending
  `SubmitButton`, shop product filter loading status, artwork masonry loading
  status, and blog follow-up loading status. Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/components/loadingStatus.test.tsx __tests__/unit/components/masonryLayoutLoadingStatus.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx`,
  `git diff --check`, and `npm run lint`.
- 2026-05-24: Completed A-024 Phase 2 coverage. Added focused render tests for
  the `/artwork` and `/search` route loading shells, including route-status
  semantics and regression coverage against generic `Loading...` copy.
  Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/publicRouteLoadingShells.test.tsx`,
  `git diff --check`, and `npm run lint`.
- 2026-05-24: Completed A-024 Phase 3 coverage. Extended the public route
  loading-shell render test to cover `/shop/products`, including route-status
  semantics and regression coverage against generic `Loading...` copy.
  Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/publicRouteLoadingShells.test.tsx`,
  `git diff --check`, and `npm run lint`.
- 2026-05-24: Completed T-257 coverage for A-024/F-119. Extended
  `publicSearchNavigationAccessibility` coverage for desktop search, mobile
  drawer search, App Router hero artwork navigation, pending-status source
  guards, and `window.location.href` regression coverage. Verification passed
  with the focused public search/navigation and route-shell Jest slice,
  `git diff --check`, and `npm run lint`.
- 2026-05-24: Completed T-258 coverage for A-024/F-121. Added
  `adminDashboardMainLoading.test.tsx` to render the admin `@main` route
  loading skeleton, assert accessible busy/status semantics, and guard against
  stale generic loader imports in `@main/default.tsx`. Verification passed
  with focused admin loading Jest coverage, `git diff --check`, and
  `npm run lint`.
- 2026-05-24: Completed T-259 coverage for A-024/F-122. Added
  `publicRouteTransitionLoading.test.tsx` to submit the real desktop search
  control, hold a representative `/search` route response in a suspended state,
  assert the route-local search loading shell appears, then resolve final route
  content and assert the shell is replaced. Verification passed with the
  focused route-transition/search/navigation Jest slice, `git diff --check`,
  and `npm run lint`.
- 2026-05-24: Added docs-only Playwright adoption guidance to the testing
  runbook and this workstream. Playwright remains uninstalled; future adoption
  must start from a scoped task or owner/orchestrator decision with named
  browser-only journeys, fixture/credential handling, and strict artifact
  limits.
- 2026-05-24: Completed T-256 coverage. Added
  `__tests__/unit/accountNavigationLazyIsland.test.tsx` for the public account
  trigger shell, click/focus intent loading behavior, source split boundaries,
  and rooted provider ownership. The focused account/navigation/import-boundary
  Jest slice, `npm run build`, targeted source/chunk searches, and
  `git diff --check` passed.
- 2026-05-24: Completed T-260 coverage. Extended focused account-nav tests for
  App Router `Link` semantics on enabled account dropdown routes, disabled
  authenticated/unauthenticated menu states, preserved logout behavior, and a
  source guard against raw account-menu `<a>`/`href="#"` route placeholders.
  Verification passed with
  `npm test -- --runTestsByPath __tests__/unit/accountNavigationLazyIsland.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts`,
  `git diff --check`, and `npm run lint`.
- 2026-05-24: Completed T-261 coverage. Extended
  `__tests__/unit/shopProductDetailPage.test.tsx` for the print sale gallery
  raw-artwork item, room selection, frame/mat dropdown updates, hosted Shopify
  purchase preservation, enquiry fallback preservation, and graceful fallback
  product states. Adjacent frame-preview and prototype tests were rerun after
  extracting shared room helpers.
- 2026-05-24: Extended T-261 coverage after owner clarification. Product detail
  tests now cover an unlinked print using Shopify product image dimensions in
  the sale gallery, linked originals and books using the same sale shell without
  print frame controls, graceful no-image preview behavior, and Shopify image
  dimension preservation in product transforms.
- 2026-05-24: Extended T-261 coverage for the carousel/title follow-up. Product
  detail tests now cover cropped visible print headings, directional gallery
  slide state, generated room previews for originals, book page images in the
  side gallery, and cropped featured artwork labels. Shopify transform tests now
  cover ordered product image preservation. Structured-data tests now cover the
  cropped print display title in product metadata, JSON-LD, and breadcrumbs.
- 2026-05-24: Verified the T-261 main-preview collapse fix with focused product
  detail tests, lint, build, and a headless Chrome screenshot confirming the
  selected artwork renders in the center viewport.
- 2026-05-24: Extended T-261 product-detail regression coverage so selected
  room previews and vertical room thumbnails both assert the fill-and-crop
  viewport classes used to keep wall-preview proportions consistent.
- 2026-05-24: Added T-261 frame-preview coverage for background-first room
  preview loading. The direct room-preview test asserts the framed overlay is
  hidden until the room background image load event marks it ready.
- 2026-05-25: Completed T-265 coverage. Added focused
  `ArtworkGalleryPaginationState` tests for non-page-1 initial load-more state
  and terminal-page behavior, and extended `ArtworkListLoader` coverage for the
  pagination metadata prop handoff.
- 2026-05-25: Completed T-268. Explicit `npx tsc --noEmit --pretty false
  --skipLibCheck` now passes under Node `22.14.0` after clearing the four A-027
  test-file diagnostics and one type-only public-search narrowing diagnostic.
  Focused Jest passed for the four scoped test files and the public search data
  service.
- 2026-05-25: After T-273 returned, explicit `npm exec tsc -- --noEmit
  --pretty false --skipLibCheck` regressed on
  `__tests__/unit/auth/adminFrontendGuard.test.tsx(51,22)` because the
  `redirect` mock is cast directly to a Jest mock type. T-275 is prepared as
  the narrow repair.
- 2026-05-25: Completed T-276. The deterministic A-034 source-contract drift is
  fixed by aligning product image sizing coverage with the current product-page
  to sale-gallery boundary and by allowing explicitly listed semantic style
  scaffold-only leaves. Focused in-band Jest passed for
  `publicImagePreloadSizing.test.tsx` and `semanticStyles.test.ts`.
- 2026-05-25: Completed T-277. The admin collection/article/blog read-list
  suites now use the same 20s per-test timeout policy already used by
  `adminArticleBlogForms.test.tsx`, based on profiling that showed default
  Jest workers can push these React admin interactions past the 5s default
  while in-band execution stays green. The scoped default-worker and in-band
  admin checks passed. Full `npm test` no longer reports the T-277 admin
  timeout class, though it remains red for unrelated
  `clientServerImportBoundary.test.ts`, `publicSmokeDiscoveryEndpoints.test.ts`,
  and `visibleBreadcrumbs.test.tsx` failures.
- 2026-05-25: Completed T-280. The public smoke discovery endpoint test no
  longer starts a localhost fixture server; it spawns
  `scripts/smoke-public-routes.mjs` with a preloaded route-map `fetch` fixture.
  Focused default-sandbox Jest passed for
  `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`, so this
  suite no longer requires escalated socket permission.
- 2026-05-25: Completed T-281. Runtime shop sort options now live in
  `src/lib/data/options/shopSortOptions.ts`, so `ShopProductGallery` no longer
  imports `src/lib/data/types/shopTypes.ts` at runtime. The focused
  import-boundary, shop gallery sorting, unsupported controls, and shop
  products page suites passed, and `git diff --check` passed.
- 2026-05-25: Completed T-282. Post-repair verification ran under Node
  `22.14.0` / npm `10.9.2` after T-281, T-283, and T-284 completed. Full Jest
  passed with 198 suites and 1405 tests; `npm run build` passed and listed
  `/prototype/home` as dynamic; `npm run lint` passed; `git diff --check`
  passed. Explicit `npm exec tsc -- --noEmit --pretty false --skipLibCheck`
  failed only on
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts(9,17)` and `(19,17)`
  because the test assigns to read-only `process.env.NODE_ENV`. T-285 is
  prepared as the narrow follow-up.
- 2026-05-25: Completed T-285. The lazy MongoDB client test now uses a
  test-local mutable env helper instead of directly assigning to read-only
  `process.env.NODE_ENV`. Focused Jest passed for
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts`, explicit
  `npm exec tsc -- --noEmit --pretty false --skipLibCheck` passed, and
  `git diff --check` passed under Node `22.14.0` / npm `10.9.2`.
- 2026-05-25: Completed T-286. Added `npm run typecheck` as the repo-owned
  explicit TypeScript `noEmit` gate and `npm run verify:local` as the aggregate
  local handoff gate for typecheck, full Jest, build, lint, and whitespace.
  `npm run verify:local` passed under Node `22.14.0` / npm `10.9.2`, including
  full Jest with 198 suites and 1,405 tests. The build passed in the default
  sandbox while still emitting expected MongoDB DNS/revalidation warnings for
  intentional external-data surfaces. The testing runbook now names the local
  baseline and keeps production smoke, credentialed/admin smoke, Vercel logs,
  and main CI ownership separate under F-126.
- 2026-05-25: Completed T-287 as a docs-only CI policy pass. The next
  implementation should add non-secret `Main CI` on pull requests to `main`,
  pushes to `main`, and manual dispatch. The workflow should run the
  `verify:local` command set with an event-aware whitespace check instead of
  invoking the local script verbatim. Release evidence, deployed public smoke,
  credentialed/admin smoke, Vercel log checks, and monitoring remain separate.
- 2026-05-25: Completed T-288. Added `.github/workflows/main-ci.yml` for
  pull requests targeting `main`, pushes to `main`, and manual dispatch. The
  workflow runs typecheck, full Jest, build, lint, and event-aware whitespace
  checks under Node `22.14.0` / npm `10.9.2` with `npm ci`, without secrets,
  public smoke, credentialed/admin smoke, Vercel operations, or monitoring.
- 2026-05-25: Completed T-289. Added an OAuth/provider-shaped callback test to
  `__tests__/unit/auth/credentialsRoleSession.test.ts` covering a Google OAuth
  account/profile fixture and adapter-defaulted `role: "user"`. Focused auth
  and DB helper Jest suites, explicit typecheck, and whitespace checks passed.
- 2026-05-26: Completed T-294 coverage. Added focused
  `__tests__/unit/shopProductClassification.test.ts` for T-293
  book-candidate fallback behavior, untyped `original-artwork`, explicit
  Shopify metadata, and book/catalog signals; extended
  `__tests__/unit/shopProductDetailPage.test.tsx` so the T-293 book-candidate
  shape renders as a generic product instead of original artwork.
- 2026-05-26: Completed T-296 as a docs-only Shopify book metadata readiness
  pass. No runtime source or tests changed; verification is limited to
  `git diff --check`.
- 2026-05-26: Prepared T-297 as a docs-only owner review packet for the
  sale-gallery follow-up chain. Verification should remain `git diff --check`.
- 2026-05-26: Completed T-297 as a docs-only owner review packet. No runtime
  source or tests changed; verification is limited to `git diff --check`.
- 2026-05-26: Prepared T-298 as a docs-only tracker reconciliation after the
  sale-gallery owner-review packet. Verification should remain `git diff
  --check`.
- 2026-05-26: Completed T-298 as docs-only tracker reconciliation. No runtime
  source, tests, product data, or Shopify metadata changed; verification is
  limited to `git diff --check`.
- 2026-05-26: Prepared T-299 as the first A-014 source pruning pass. Because it
  deletes source files and assets, verification should include targeted
  reference checks, `npm run lint`, `npm test`, `npm run build`, and
  `git diff --check`.
- 2026-05-26: Completed T-299. Targeted pre/post reference checks found no live
  importers for the deleted candidates. `npm run lint` passed. The first full
  `npm test` run failed once in `visibleBreadcrumbs.test.tsx`; the focused
  breadcrumb rerun passed, and a second full `npm test` passed with 198 suites /
  1405 tests. `npm run build` passed with the existing Browserslist
  `caniuse-lite is outdated` advisory, and `git diff --check` passed.
- 2026-05-26: Prepared T-300 as the remaining F-031 utility/import cleanup.
  Verification should include targeted reference checks, `npm run lint`,
  `npm run typecheck`, `npm run build`, and `git diff --check`; run the
  saved-item action suite too if saved-item actions change.
- 2026-05-26: Completed T-300. Targeted pre/post reference checks confirmed
  `filterWatchlerlist` had no live source references, collection layout
  comment/import leftovers were removed, and saved-item action imports remain
  live. `npm run lint`, `npm run typecheck`, `npm run build`, and
  `git diff --check` passed; the build emitted the existing Browserslist
  `caniuse-lite is outdated` advisory. Saved-item action files were unchanged,
  so the focused saved-item action suite was not required.
- 2026-05-26: Completed T-301/T-302/T-303 as docs-only scoping tasks. Their
  verification was limited to result/task documentation consistency and
  whitespace checks; no runtime source or test behavior changed.
- 2026-05-26: Prepared T-304/T-305/T-306 as parallel implementation tasks with
  focused verification: security-header tests/build for report-only CSP, route
  import-boundary/focused route tests for public route builders, and admin form
  plus URL-validation tests for content-image feedback.
- 2026-05-26: Completed T-304/T-305/T-306. T-304 added focused security-header
  assertions for enforced versus report-only CSP plus build verification; T-305
  added route-builder, main-nav skeleton, metadata/sitemap, policy-page, and
  client/server import-boundary coverage; T-306 added admin blog/collection
  form coverage for malformed/unsupported image URLs, preview suppression, and
  allowed-host preview behavior.

## Next Agent Action

T-286, T-287, and T-288 completed local gate ownership, CI policy scoping, and
the first Main CI workflow. T-289 completed the focused OAuth default-role
callback coverage. Do not reassign T-275, T-268, T-282, T-286, T-287, T-288,
or T-289 unless the local verification scripts, CI workflow, policy docs, or
OAuth role propagation coverage regress. Keep owner-blocked production smoke,
credentialed/admin smoke, Vercel log evidence, and scheduled/detail public
smoke under F-126/operations.

T-265 focused coverage is complete; do not reassign it unless artwork browse
pagination metadata handoff or deep-linked client load-more behavior regresses.

The A-024 loading-state and account-navigation coverage sequence is complete;
do not reassign F-118 through F-122 unless a regression appears. Do not install
Playwright for follow-up loading-state work unless a separate scoped task
approves the browser tooling, fixture plan, command posture, and artifact
budget.

T-261 shop product detail mockup coverage is complete, T-293 completed the
first live sale-gallery visual-QA follow-up, T-294 completed the focused
classifier/product-detail regression for the T-293 book-candidate
misclassification, T-295 signed off the named original route, and T-296
documented the book metadata readiness gate. Do not install or expand
Playwright for remaining book follow-up unless a separate scoped task approves
the browser tooling, fixture plan, command posture, and artifact budget. The
next book visual QA pass should wait until Shopify metadata is applied and
Storefront reads confirm a durable book marker.

T-297 is complete as a docs-only owner review packet. Keep any next
sale-gallery decision-packet edits to `git diff --check`; broaden verification
only when a follow-up task changes runtime source, tests, or browser-reviewed
behavior.

T-298 is complete. Keep any future owner-packet or tracker-only sale-gallery
updates to `git diff --check`; broaden verification only when a follow-up task
changes runtime source, tests, product data, Shopify metadata, or
browser-reviewed behavior.

T-299 and T-300 are complete. Do not reassign the A-014 high-confidence
source-leaf, starter-asset, or utility/import pruning sequence unless those
exact deleted paths/helpers or stale collection layout comment/import leftovers
reappear. Do not broaden related cleanup into auth/session, i18n, package
dependencies, commerce, route behavior, CI, or owner-decision work without a
new scoped task. If saved-item action files change in a future task, rerun
`npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts`.

T-304, T-305, and T-306 are complete. Do not reassign them unless their focused
coverage or behavior regresses. Next non-Shopify quality work should follow the
new scoped task brief for the selected route-builder or CSP evidence target and
should keep owner-blocked production smoke, credentialed/admin smoke, Vercel log
evidence, and scheduled/detail public smoke under F-126/operations.

T-307, T-308, and T-309 are complete. T-307 ran focused public route-builder
consumer tests, lint, the client/server import-boundary guard, and
`git diff --check`; T-308 and T-309 were docs-only scoping tasks verified with
`git diff --check`. T-312 ran the focused admin delete fetcher and
route/fetcher parity suites, `npm run lint`, and `git diff --check`. T-311 ran
focused route utils, middleware, admin frontend guard, client/server
import-boundary, lint, and `git diff --check` checks. T-310 focused
observability checks, build, lint, and whitespace passed. T-313 restored the
broad route-builder-era verification drift: explicit typecheck, focused
route-builder/cache-policy Jest, full Jest, lint, and whitespace checks now
pass again. T-314 focused admin read fetcher/parity tests, lint, typecheck, and
whitespace passed, T-315 used `git diff --check` for docs-only scoping, and
T-316 focused account route-builder, provider, navigation, import-boundary,
lint, and whitespace checks passed. T-317 used `git diff --check` for
docs-only scoping. T-318 focused admin update fetcher/parity tests passed, and
T-319 focused admin dashboard route/sidebar tests plus the import-boundary
guard passed. T-320 focused admin create fetcher/parity tests, lint, and
whitespace passed; T-321 docs-only scoping passed `git diff --check`. Next
non-Shopify verification should include the completed T-322 saved-item
action/account/public route-builder/import-boundary tests, T-323 docs-only
`git diff --check`, and T-324 focused auth callback redirect test. Keep
Playwright, production smoke, credentialed/admin smoke, Vercel log evidence,
and Shopify dashboard-dependent verification separate.

T-194 `/prototype/frame` visual QA is complete and T-292 fixed the two
narrow/mobile cropping blockers. T-292 verification used focused Jest suites,
lint, build, `git diff --check`, and targeted headless browser bounding-box
measurements at one desktop and one `390x844` viewport without traces, videos,
full DOM dumps, or screenshot sets.

T-230 import-boundary repair coverage is complete; do not reassign it unless
the client import-boundary guard or `SignUpForm` direct constants import
regresses. T-231 middleware matcher narrowing coverage is complete; do not
reassign it unless the matcher contract or exact protected prefix semantics
regress. T-232 public cache/freshness policy coverage is complete, and T-233
biography cache proof coverage is complete. T-234 planning/build evidence is
complete, T-236 lazy mobile drawer coverage is complete, T-235 non-action
`"use server"` cleanup coverage is complete, T-237 scoping/build evidence is
complete, T-238 collections redirect cache-proof coverage is complete, and
T-239 sitemap ISR ownership coverage is complete. T-240 blog cache scoping is
complete, T-241 cached primary blog detail coverage is complete, and T-242
default grouped `/blog` list cache-proof coverage is complete. T-243 sorted
blog list cache/query-hygiene scoping is complete, and T-244 query
normalization/bounds coverage is complete. T-245 sorted first-page cache
wrapper and loader coverage is complete, T-246 bounded sorted-page scoping is
complete, T-247 bounded sorted-page runtime coverage is complete, T-248
next-cache-target scoping is complete, and T-249 default artwork browse cache
coverage is complete. T-250 cache-efficiency scoping is complete, and T-251
fixed unfiltered `mostRecent` `/artwork` pages 2-5 cache expansion coverage is
complete. T-252 post-browse scoping, T-253 root provider/modal scoping,
T-254 modal-provider/lazy-host runtime coverage, T-255 post-modal scoping, and
T-256 account-navigation lazy-island runtime coverage are complete. Do not make
additional A-022/F-115 runtime edits without a new scoped task that names the
specific client island/provider target, expected build evidence, and focused
behavior/import-boundary coverage. Keep
optional comments, page 6-plus artwork, filtered artwork variants,
non-default artwork limits/sorts, `popular` pages beyond page 1, sorted page
6-plus, route-level blog or artwork ISR, static params, search, shop routes,
cache tags, mutation revalidation, and broader ISR behavior out of the
completed cache proofs. Keep provider runtime moves beyond the modal-only
cleanup/lazy-host slice unless explicitly scoped, auth/session behavior, saved-item actions,
account/admin/comment/form behavior, shop behavior, package files, Playwright
setup, CI workflows, and route cache policy unchanged unless a later task
explicitly owns those paths.

Playwright remains a consideration, not an approved dependency. Do not install
or run broad browser automation until a scoped adoption task names the first
browser-only journeys, fixture/credential plan, command/CI posture, and artifact
budget from the testing runbook.

T-209's commerce assurance copy coverage is complete. The focused
`securityBannerCommerceCopy` test fails if unsupported payment, shipping,
refund, guarantee, or buyer-protection claims return to shared security banners
or matching security translation files. T-210's public search artwork coverage
is complete. T-211's Shopify product public-search coverage is complete. T-207
fallback pattern coverage is complete. T-212's compliance owner
decision packet is complete; T-213 policy route/footer coverage is complete.
T-214 newsletter consent/unsubscribe coverage is complete. T-215 account
privacy/terms acknowledgement metadata and manual privacy request handoff
coverage is complete. T-216 comment posting notice and manual
moderation/removal handoff coverage is complete. T-217 contact/product and
artwork enquiry notice coverage is complete. T-218 footer placeholder
social-link/current-year coverage is complete. T-219 is complete as docs-only
owner-input blocker coverage. Later runtime compliance tests for Shopify policy
URLs and real social URLs remain separate.
The previous strict TypeScript `noEmit` backlog was clear after T-198, the
2026-05-22 ArticleLoader follow-up, and T-268, but T-273 introduced the narrow
admin frontend guard test mock typing regression now routed to T-275. Do not add
`noEmit` to CI or release verification until a separate quality-gate decision
task is prepared and assigned. T-157 through T-198 are complete and should not
be reassigned unless one of their recorded prototype, audit handoff, admin
read-list, strict TypeScript cleanup, or framed-preview contracts regresses.
T-143 now records staged public-search widening: T-210 completed artworks, and
T-211 completed Shopify product results. T-139 recorded the previous monitoring
provider/no-provider decision as blocked in ADR 0005; the owner later approved
Sentry and T-310 completed the first focused monitoring baseline. Keep provider
smoke, alert, source-map, replay, profiling, broad tracing, and uptime coverage
separate until owner-approved follow-up tasks scope them.
T-141 through T-168 are complete; do not reassign their
focused route/form/query/loading/nav/runbook/archive-entry/taxonomy/breadcrumb/
audit/prototype coverage unless it regresses.
Keep broader static/ISR migration separate from the
completed T-115 Shopify fetch-option cleanup, the docs-only T-116 runbook work,
and the completed T-117 through T-134 observability documentation, logging,
source-hygiene, public-smoke workflow, policy, public loader/page migration,
Shopify provider/data service migration, and server action/session-helper
migration, account saved-artwork loader migration, public/account client
cleanup, shared utility/fetcher cleanup, admin dashboard client cleanup, and
incident owner-matrix handoff tasks.

Keep the route/fetcher parity and protected API guard inventories current when
fetchers or route handlers change. Do not reassign T-081, T-082, T-083, T-084,
T-085, T-086, T-087, T-088, T-089, or T-090 unless a regression is opened.
Do not reassign T-091, T-092, or T-093 unless a regression is opened. T-094,
T-095, T-096, T-097, T-098, T-099, T-100, T-101, T-102, T-103, T-104, T-105,
T-106, T-107, T-108, T-109, T-110, T-111, T-112, T-113, T-114, T-115, T-116,
T-117, T-118, T-119, T-120, T-121, T-122, T-123, T-124, T-125, T-126, T-127,
T-128, T-129, T-130, T-131, T-132, T-133, and T-134 are complete; do not
reassign them unless a regression is opened. T-135 is also complete; do not
reassign it unless content image URL validation regresses. T-137 is complete;
do not reassign it unless the client import-boundary guard regresses.

Use the T-025 deployment smoke checklist when validating future deployment,
runtime, auth, Shopify, or route-contract changes. For Next dependencies, wait
for owner/orchestrator acceptance of a Next target, then execute the
verification plan in
[T-015](../tasks/T-015-next-major-migration-preflight.md) during the package
implementation task.

T-082 focused admin product-link validation coverage was added to
`__tests__/unit/api/adminArtworkRoute.test.ts` and passed.
T-271 added focused admin artwork update-form replacement image coverage,
preserved existing artwork update route replacement-image coverage, and added
upload-button form-safety coverage. The focused form, route, and upload-button
Jest suites passed.
T-311 added focused auth/protected route constants coverage in route utils,
middleware, admin frontend guard, and the client/server import-boundary suite.
The focused Jest suites, `git diff --check`, and `npm run lint` passed.
T-313 repaired the post-route-builder verification drift by making
`PublicRouteBuilderConsumers` use a fully typed blog fixture and updating the
`publicRouteCachePolicy` main-nav invariant for `publicAppRoutes` route-root
ownership. `npm run typecheck`, focused Jest, full `npm test`, `npm run lint`,
and `git diff --check` passed.
T-318 added focused admin update fetcher coverage for the new client-safe path
builders, explicit supported update resources, encoded update IDs, preserved
`PATCH` request options, and route/fetcher parity. The focused Jest suites
passed.
T-319 added focused admin dashboard route-builder/sidebar coverage for exact
dashboard segment paths, segment-builder parity, admin entry redirects,
sidebar hrefs, and nested-prefix active-state behavior. The focused route test
and client/server import-boundary suite passed, along with `git diff --check`
and `npm run lint`.
T-320 added focused admin create fetcher coverage for the new client-safe path
builders, explicit supported create resources, preserved `POST` options, and
route/fetcher parity. T-321 used docs-only `git diff --check` for the release
fixture/auth callback route ownership scope. T-322 passed focused saved-item
action/account/public route-builder/import-boundary tests plus lint and
whitespace. T-323 passed docs-only whitespace checks. T-324 passed focused auth
callback redirect coverage for the current contract plus `git diff --check`.
T-325 passed focused public smoke discovery tests for product not-found status
handling and a live production `npm run smoke:public` run with all approved
public values: 16 passed, 0 failed, 0 skipped.
T-326 completed as a docs-only alert/uptime owner-routing task with
verification limited to `git diff --check`; no runtime source, tests,
Playwright, provider dashboards, production browser checks, credentialed smoke,
or provider log collection were in scope. T-327 remains prepared as a
controlled docs/scoping task with the same narrow verification boundary unless
an assigned agent unexpectedly changes runtime source.
T-328 added focused pure-helper Jest coverage for the Shopify catalog dry-run
planner; the suite verifies handle generation, inventory defaults and
overrides, duplicate generated-handle warnings, safety flags, metafield shape,
and report structure without MongoDB or Shopify network access.
