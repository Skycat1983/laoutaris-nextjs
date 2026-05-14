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
- T-024 captured partial remote Vercel smoke evidence on 2026-05-14: `GET /`
  returned `HTTP/2 200`, and an intentionally invalid credentials callback
  returned `401 CredentialsSignin` instead of `500`. The required successful
  credentials sign-in and targeted log check remain blocked by missing smoke
  credentials, missing Vercel log access, and no deployed T-023 commit.

## Backlog

- Establish which commands must pass before each handoff and document
  environment limitations for build checks.
- Add API contract tests for one representative public, user, and admin route
  group before broad refactors.
- Add route/action tests for admin create/update validation and search query
  parsing as those flows are hardened.
- Add tests for shared response helpers, body-level status cleanup, and
  unauthenticated/forbidden JSON 401/403 behavior.
- Add a route/fetcher parity check that compares `src/lib/api/**/fetchers.ts`
  paths and methods against exported handlers under `src/app/api/v2`.
- Add a DB ownership check for MongoDB-backed route handlers and server actions
  once the shared wrapper/service pattern is chosen.
- Add auth/route-protection tests around middleware utilities and high-risk
  session helpers.
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
- Convert deployment smoke checks into a scripted smoke suite or precise
  evidence-based manual checklist before production launch.
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
  Acceptance remains blocked until a T-023-containing deployment, successful
  credentials sign-in, and targeted log evidence are available.

## Next Agent Action

Support [T-024](../tasks/T-024-verify-vercel-bcrypt-redeploy-smoke.md) by
rerunning the remote smoke after the T-023 deployment is confirmed and a
secret-channel smoke account plus Vercel log access are available. Then convert
deployment smoke checks into a repeatable checklist or script. For Next
dependencies,
wait for owner/orchestrator acceptance of a Next target, then execute the
verification plan in
[T-015](../tasks/T-015-next-major-migration-preflight.md) during the package
implementation task.
