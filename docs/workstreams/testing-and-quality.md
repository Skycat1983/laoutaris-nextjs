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
- Add Shopify transformation, product link, product detail, and public shop API
  tests before commerce implementation work.
- Add SSR/server-loader tests that do not require a live `localhost:3000`
  server.
- Add a documented coverage command and targeted thresholds for route guards,
  transforms, API helpers, and Shopify/data contracts before considering a
  repo-wide threshold.
- Keep deployment smoke checks current through the evidence-based manual
  checklist and the `npm run smoke:public` unauthenticated status helper added
  by T-025.
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

## Next Agent Action

Assign T-052 and start with focused transform/schema tests before
implementation:
`/task effort: high details: docs/tasks/T-052-sanitize-public-artwork-image-contracts.md`
Keep the route/fetcher parity and protected API guard inventories current when
fetchers or route handlers change.
Use the T-025 deployment smoke checklist when validating future deployment,
runtime, auth, Shopify, or route-contract changes. For Next dependencies, wait
for owner/orchestrator acceptance of a Next target, then execute the
verification plan in
[T-015](../tasks/T-015-next-major-migration-preflight.md) during the package
implementation task.
