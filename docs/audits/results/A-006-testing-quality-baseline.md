# A-006 Testing And Quality Baseline Result

Status: Complete

Audit goal: [A-006 Testing and quality baseline](../goals.md#a-006-testing-and-quality-baseline)

Workstream: [Testing and quality](../../workstreams/testing-and-quality.md)

Audit date: 2026-05-14

## Summary

The baseline commands are green only after distinguishing a sandbox network
failure from the real project state:

- `npm test` passes: 9 suites, 95 tests.
- `npm run lint` passes: no ESLint warnings or errors.
- `npm run build` fails in the default sandbox because `next/font` cannot fetch
  Google Fonts. After rerunning with approved network access, the build passes.

Testing is not yet a reliable production-refactor safety net. The Jest suite is
mostly utility coverage plus one heavily mocked home-view test, while the
production surface includes 31 page files and 53 API route handlers. A coverage
probe across `src/**/*.{ts,tsx}` reported only 1.78% statements, 2.02%
branches, 2.31% functions, and 1.76% lines. There are no coverage thresholds,
no API contract tests, no auth/admin flow tests, no Shopify integration tests,
and no browser/e2e script.

The build currently functions as the broadest integration check, but it is not a
stable isolated gate: it needs network access for Google Fonts and performs
production MongoDB connection attempts plus route/data fetch work during static
generation.

## Scope Inspected

- `package.json` scripts and test dependencies.
- `jest.config.js` and `jest.setup.js`.
- `__tests__/unit`, `__tests__/integration`, and their usage notes.
- Existing test files and the code areas they exercise.
- Route and API inventory from `src/app`.
- Build, lint, and Jest behavior.
- Coverage shape using a temporary coverage run.
- Related testing workstream, testing runbook, route/API architecture, and
  production risk docs.

## Current Configuration

- Scripts: `dev`, `build`, `start`, `lint`, `test`, and `test:watch`.
- No dedicated `test:coverage`, `test:ci`, browser smoke, Playwright, Cypress,
  or e2e script is defined.
- Jest uses `next/jest` with `testEnvironment: "jsdom"`.
- `jest.setup.js` imports `@testing-library/jest-dom`, adds `TextEncoder` and
  `TextDecoder`, and assigns `global.fetch = jest.fn()`.
- Jest aliases map `@/`, `@components/`, `@ui/`, and `@loaders/`.
- No `collectCoverageFrom`, `coverageThreshold`, test database setup, API route
  harness setup, or global mock reset policy is configured.
- `next-test-api-route-handler` is installed but not referenced by tests.
- ESLint extends `next/core-web-vitals`.

## Current Test Inventory

- 9 Jest test files:
  - 8 unit files under `__tests__/unit`.
  - 1 integration file under `__tests__/integration/views`.
- Unit coverage is concentrated on helpers/utilities:
  - `routeUtils`
  - `colourUtils`
  - `dateUtils`
  - `urlUtils`
  - `textUtils`
  - `userUtils`
  - `copy_id`
  - `createSubnavLink`
- The only integration test, `Home.test.tsx`, mocks `@/components/views/Home`
  itself and mocks the child modules. It proves the mock renders the expected
  test IDs, not that the production `Home` implementation composes loaders and
  sections correctly.
- One `Home.test.tsx` case named "renders content layout with correct
  background colors" calls `screen.getAllByTestId(...)` but does not assert the
  count, classes, or background behavior.

## Baseline Command Results

### `npm test`

Result: pass.

Key output:

```text
Test Suites: 9 passed, 9 total
Tests:       95 passed, 95 total
Snapshots:   0 total
Time:        6.491 s
Ran all test suites.
```

Notes:

- The run prints expected `console.error` output from
  `src/lib/utils/dateUtils.ts` invalid-date test cases.
- This is not a failure, but it makes test output noisier.

### `npm run build`

Default sandbox result: fail due environment/network restriction.

Key output:

```text
request to https://fonts.googleapis.com/css2?family=Archivo+Black:wght@400&display=swap failed, reason: getaddrinfo ENOTFOUND fonts.googleapis.com
...
Failed to compile.

src/lib/styles/fonts.ts
`next/font` error:
Failed to fetch `Archivo` from Google Fonts.
...
> Build failed because of webpack errors
```

Escalated rerun with approved network access: pass.

Key output:

```text
✓ Compiled successfully
Linting and checking validity of types ...
Collecting page data ...
Generating static pages (43/43)
Route (app) ...
ƒ Middleware 48.5 kB
```

Warnings and reliability signals from the successful rerun:

- `Browserslist: caniuse-lite is outdated`.
- Static generation logs many production MongoDB connection messages:
  `Raw MongoDB Driver - Environment: production`,
  `MONGO_URI exists: true`, `Production: Creating new MongoDB client
  connection`, `MongoDB connection attempt 1/3`, `DB Connect called`, and
  `Using existing connection`.
- Static generation also logs route/data-fetch debug output such as
  `Fetcher called`, `Branch verification test - deployed from main branch`,
  `Collection fetch request received`, `Starting article GET request`, and
  repeated `links [...]` output.

Classification:

- The first failure is an environment issue in the sandbox, not a confirmed code
  failure.
- The need for Google Fonts network access and a live `MONGO_URI` during build
  is a project reliability issue for repeatable commissioning and CI.

Additional completion-audit note:

- A later shell search command accidentally used unescaped backticks in the
  search pattern. The shell expanded those sections and reran `npm test`,
  `npm run build`, and `npm run lint` before `rg` failed to parse the expanded
  pattern.
- In that unintended sandbox build rerun, cached fonts let compilation progress
  to static generation, but MongoDB DNS access failed with
  `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net`.
- The rerun emitted `Error occurred prerendering page "/"`,
  `Error occurred prerendering page "/project"`,
  `Error occurred prerendering page "/project/contact"`, and
  `Error occurred prerendering page "/shop/products"`, followed by
  `Export encountered errors on following paths:` for routes including `/`,
  `/project`, `/project/contact`, `/shop/products`, `/biography`,
  `/_not-found`, and several public API routes.
- This remains classified as an environment/network failure in the sandbox, but
  it reinforces that build verification is coupled to live MongoDB access during
  prerendering.

### `npm run lint`

Result: pass.

Key output:

```text
✔ No ESLint warnings or errors
```

### Coverage Probe

Command:

```bash
npm test -- --coverage --coverageReporters=text --coverageDirectory=/private/tmp/laoutaris-a006-coverage --collectCoverageFrom='src/**/*.{ts,tsx}'
```

Result: pass.

Key output:

```text
All files | 1.78 | 2.02 | 2.31 | 1.76
Test Suites: 9 passed, 9 total
Tests:       95 passed, 95 total
Time:        59.658 s
Ran all test suites.
```

Notes:

- Coverage was run as an audit probe, not as an existing project script.
- The text reporter did not leave a persistent report directory at
  `/private/tmp/laoutaris-a006-coverage`.
- Low coverage does not fail because no coverage threshold is configured.

## Findings

### A-006-F01: Jest Passing Does Not Exercise Production-Critical Surfaces

Severity: High

The project has 53 API route handlers, including 25 admin handlers, 19 public
handlers, and 8 user handlers under `/api/v2`, but the Jest suite has no API
route contract tests. There are also no tests for auth/session helpers,
admin permission boundaries, Shopify fetch and product transforms, form
validation flows, MongoDB model behavior, route loader behavior, or user
features such as favourites, watchlist, profile, and comments.

Why this matters:

- `npm test` can pass while production-critical route behavior, status codes,
  auth checks, data transforms, and upstream service handling are broken.
- This directly supports existing risks R-005 and R-013.

Next action:

- Commission focused tests for route utilities/auth guards first, then add API
  contract tests for public, user, and admin route groups.

### A-006-F02: The Only Integration Test Is Mostly A Mock Test

Severity: Medium

`__tests__/integration/views/Home.test.tsx` mocks the `Home` component under
test and all of its child modules. The suite verifies mocked test IDs and
fallbacks, not the real server component composition, data loading, or route
rendering behavior. One test title mentions background colors but does not make
a class or style assertion.

Why this matters:

- The integration label overstates the safety provided by the test.
- A future home route regression could pass this test if the mock remains
  unchanged.

Next action:

- Replace or supplement this with a test that renders the actual component
  boundary intended to be protected, with only external data/service calls
  mocked.

### A-006-F03: Coverage Is Not A Gate

Severity: Medium

Jest has no `collectCoverageFrom` or `coverageThreshold` configuration, and
`package.json` has no coverage script. The audit coverage probe reported 1.78%
statement coverage and 1.76% line coverage across `src/**/*.{ts,tsx}`.

Why this matters:

- The current suite gives no automated signal when production code lacks tests.
- Utility coverage can look healthy locally while app, API, auth, admin,
  database, and Shopify code remains almost entirely uncovered.

Next action:

- Add a documented coverage command and begin with targeted thresholds for
  high-risk utilities, route guards, transforms, and API contract helpers rather
  than applying a broad repo-wide threshold immediately.

### A-006-F04: Build Verification Depends On External Services And Local Env

Severity: High

The build failed without network access because `src/lib/styles/fonts.ts` uses
`next/font/google`. With network access, the build passed but executed
production MongoDB connection code and route/data fetches during static page
generation.

Why this matters:

- A build gate can fail because Google Fonts or database connectivity is
  unavailable, even when TypeScript and application code are otherwise valid.
- A passing build may depend on a developer's `.env` and live data, making it
  hard for a new agent or CI runner to reproduce safely.

Next action:

- Decide whether the production build should be isolated from live data and
  external font fetches for CI, then document the chosen approach in the testing
  and deployment runbooks.

### A-006-F05: Test And Build Output Is Noisy

Severity: Low

Tests print expected invalid-date `console.error` logs. Builds print many
application debug logs, including fetcher stack traces, DB connection messages,
route debug messages, and branch verification timestamps.

Why this matters:

- Important failures are harder to spot in baseline output.
- Noisy logs make automated CI summaries less useful.

Next action:

- During implementation work, separate expected error-path logging from test
  output and remove or gate debug logs before turning these commands into CI
  requirements.

## Test Gaps To Prioritize

- Middleware and route utility behavior for protected, public, and admin routes.
- Auth/session helpers and admin role decisions.
- Public API contracts: artwork, collections, blog, article, search, enquiry,
  navigation, and shop products.
- User API contracts: comments, profile, favourites, watchlist, and navigation.
- Admin API contracts: create, read, update, delete, user deletion, comment
  deletion, and Cloudinary signing.
- Data transforms and Mongoose document normalization.
- Shopify client behavior, product listing/detail transforms, error handling,
  and artwork-to-product linking.
- Form validation and submission flows for login, registration, enquiry,
  contact, comments, subscription, and admin CRUD forms.
- Loader/server component behavior where build-time data fetching is expected.
- Browser smoke coverage for public archive browsing and shop product flows.

## Command Log

All commands were run from the repository root unless noted otherwise.

- `sed -n '1,220p' docs/README.md`: read canonical documentation index; exit 0.
- `sed -n '1,260p' docs/workstreams/testing-and-quality.md`: read testing
  workstream; exit 0.
- `sed -n '1,260p' docs/runbooks/testing.md`: read testing runbook; exit 0.
- `sed -n '1,260p' docs/audits/goals.md`: read audit goals including A-006;
  exit 0.
- `sed -n '1,220p' docs/workstreams/README.md`: read workstream index; exit 0.
- `sed -n '1,280p' docs/architecture/routes-and-api.md`: read route/API map;
  exit 0.
- `sed -n '1,320p' docs/risks/production-readiness.md`: read production risks;
  exit 0.
- `sed -n '1,260p' docs/audits/results/A-006-testing-quality-baseline.md`:
  inspected existing placeholder result; exit 0.
- `git status --short`: showed pre-existing `M README.md`, `?? AGENTS.md`, and
  `?? docs/`; exit 0.
- `sed -n '1,240p' package.json`: inspected scripts and dependencies; exit 0.
- `sed -n '1,240p' jest.config.js`: inspected Jest config; exit 0.
- `sed -n '1,240p' jest.setup.js`: inspected Jest setup; exit 0.
- `rg --files -g '*test*' -g '*spec*' -g '!node_modules'`: listed test/spec
  files; exit 0.
- `find __tests__ -maxdepth 4 -type f -print`: listed test tree files; exit 0.
- `sed -n '1,220p' __tests__/unit/USAGE.md`: inspected unit testing guide;
  exit 0.
- `sed -n '1,220p' __tests__/integration/USAGE.md`: inspected integration
  testing guide; exit 0.
- `sed -n '1,240p' __tests__/integration/views/Home.test.tsx`: inspected home
  integration test; exit 0.
- `sed -n '1,260p' __tests__/unit/utils/routeUtils.test.ts`: inspected route
  utility tests; exit 0.
- `sed -n '1,220p' __tests__/unit/copy_id.test.ts`: inspected clipboard helper
  tests; exit 0.
- `sed -n '1,220p' __tests__/unit/createSubnavLink.test.ts`: inspected subnav
  helper tests; exit 0.
- `sed -n '1,220p' __tests__/unit/utils/colourUtils.test.ts`: inspected color
  utility tests; exit 0.
- `sed -n '1,220p' __tests__/unit/utils/dateUtils.test.ts`: inspected date
  utility tests; exit 0.
- `sed -n '1,240p' __tests__/unit/utils/urlUtils.test.ts`: inspected URL
  utility tests; exit 0.
- `sed -n '1,240p' __tests__/unit/utils/textUtils.test.ts`: inspected text
  utility tests; exit 0.
- `sed -n '1,220p' __tests__/unit/utils/userUtils.test.ts`: inspected user
  utility tests; exit 0.
- `rg --files -g '!node_modules' -g '!docs' | sed -n '1,260p'`: sampled repo
  file inventory; exit 0.
- `find src/app -type f \( -name 'page.tsx' -o -name 'route.ts' -o -name 'layout.tsx' -o -name 'loading.tsx' -o -name 'error.tsx' \) -print`:
  listed app route, layout, loading, and error files; exit 0.
- `sed -n '1,240p' tsconfig.json`: inspected TypeScript config; exit 0.
- `sed -n '1,240p' next.config.mjs`: inspected Next config; exit 0.
- `ls -la`: inspected repo root and environment artifacts; exit 0.
- `sed -n '1,200p' .eslintrc.json`: inspected ESLint config; exit 0.
- `find src/app/api -type f -name route.ts | wc -l`: counted 53 API route
  handlers; exit 0.
- `find src/app -type f -name page.tsx | wc -l`: counted 31 page files; exit 0.
- `find __tests__ -type f \( -name '*.test.ts' -o -name '*.test.tsx' -o -name '*.spec.ts' -o -name '*.spec.tsx' \) | wc -l`:
  counted 9 test files; exit 0.
- `rg -n "coverage|testEnvironment|setupFilesAfterEnv|collectCoverage|coverageThreshold|next-test-api-route-handler|@testing-library|jest\.mock|it\.skip|test\.skip|describe\.skip|TODO|FIXME" jest.config.js jest.setup.js __tests__ package.json src -g '!node_modules'`:
  checked test config, mocks, coverage gates, skips, and TODO markers; exit 0.
- `find scripts -maxdepth 3 -type f -print`: inspected scripts directory; exit 0.
- `npm test`: baseline test run passed; exit 0.
- `npm run build`: baseline build failed in sandbox because Google Fonts could
  not be resolved; exit 1.
- `npm run build` with approved network access: rerun passed; exit 0.
- `npm run lint`: lint passed; exit 0.
- `npm test -- --coverage --coverageReporters=text --coverageDirectory=/private/tmp/laoutaris-a006-coverage --collectCoverageFrom='src/**/*.{ts,tsx}'`:
  coverage probe passed with 1.78% statement coverage; exit 0.
- `find /private/tmp/laoutaris-a006-coverage -maxdepth 2 -type f -print`:
  verified the text-only coverage probe did not leave a report directory; exit 1
  with `No such file or directory`.
- `find src/lib/api src/app/api src/lib/transforms src/lib/session src/lib/validation -type f \( -name '*.ts' -o -name '*.tsx' \) | wc -l`:
  counted 107 high-risk API/transform/session/validation files; exit 0.
- `find src/components -type f \( -name '*.ts' -o -name '*.tsx' \) | wc -l`:
  counted 250 component files; exit 0.
- `find src/lib/transforms -type f \( -name '*.ts' -o -name '*.tsx' \) | wc -l`:
  counted 17 transform files; exit 0.
- `find src/lib/api -type f \( -name '*.ts' -o -name '*.tsx' \) | wc -l`:
  counted 27 API helper files; exit 0.
- `sed -n '1,140p' src/lib/styles/fonts.ts`: confirmed
  `next/font/google` usage; exit 0.
- `rg -n "next-test-api-route-handler|testApiHandler|from ['\"]next-test-api-route-handler|supertest|playwright|cypress|vitest|msw|mongodb-memory|mongo-memory|jest --coverage|coverageThreshold|collectCoverageFrom" package.json jest.config.js __tests__ src -g '!node_modules'`:
  found only the installed `next-test-api-route-handler` dependency; exit 0.
- `rg -n "console\.log|console\.error|Branch verification|Fetcher called|DB Connect called|MongoDB connection attempt|Raw MongoDB Driver" src -g '!node_modules'`:
  inspected sources for logs seen in test/build output; exit 0.
- `find src/app/api/v2/admin -type f -name route.ts | wc -l`: counted 25 admin
  API route handlers; exit 0.
- `find src/app/api/v2/user -type f -name route.ts | wc -l`: counted 8 user
  API route handlers; exit 0.
- `find src/app/api/v2/public -type f -name route.ts | wc -l`: counted 19
  public API route handlers; exit 0.
- `sed -n '1,260p' docs/audits/results/A-006-testing-quality-baseline.md`:
  reread the updated result file first section; exit 0.
- `sed -n '261,560p' docs/audits/results/A-006-testing-quality-baseline.md`:
  reread the updated result file second section; exit 0.
- `git status --short`: checked post-edit worktree status; exit 0.
- `rg -n "^(Status|Audit goal|Workstream|Audit date|## Summary|## Scope Inspected|## Current Configuration|## Current Test Inventory|## Baseline Command Results|### `npm test`|### `npm run build`|### `npm run lint`|### Coverage Probe|## Findings|### A-006-F|## Command Log|## Findings Register Updates|## Risks Updated|## Workstream Updates|## Next Action)" docs/audits/results/A-006-testing-quality-baseline.md`:
  completion-audit search command with unescaped backticks; shell command
  substitution reran `npm test` successfully, reran `npm run build` in the
  sandbox and failed on MongoDB DNS `ECONNREFUSED` during prerendering, reran
  `npm run lint` successfully, then `rg` exited 2 with
  `regex parse error` and `repetition quantifier expects a valid decimal`.
- `rg -n "package\\.json|jest\\.config\\.js|jest\\.setup\\.js|__tests__|31 page files|53 API route handlers|npm test|npm run build|npm run lint|1\\.78|Google Fonts|MongoDB|Do not|None\\. The assignment limited edits" docs/audits/results/A-006-testing-quality-baseline.md`:
  verified key artifact evidence was present; exit 0.
- `git status --short docs/audits/results/A-006-testing-quality-baseline.md docs/workstreams/testing-and-quality.md docs/runbooks/testing.md docs/audits/goals.md docs/audits/findings-register.md docs/audits/reconciliation.md docs/risks/production-readiness.md`:
  verified scoped docs status; exit 0, with those docs still reported as
  untracked in the existing untracked `docs/` tree.

## Findings Register Updates

None. The assignment limited edits to this result file and explicitly avoided
shared reconciliation files.

Candidate findings for later reconciliation:

- A-006-F01: Jest passing does not exercise production-critical surfaces.
- A-006-F02: The only integration test is mostly a mock test.
- A-006-F03: Coverage is not a gate.
- A-006-F04: Build verification depends on external services and local env.
- A-006-F05: Test and build output is noisy.

## Risks Updated

None. The assignment limited edits to this result file.

Existing risks supported by this audit:

- R-005: Test coverage is narrow for APIs, auth, Shopify, and admin flows.
- R-013: Testing has been attempted but is not yet proven as a reliable safety
  net for production refactors.

## Workstream Updates

None. The assignment limited edits to this result file.

Recommended workstream update after reconciliation:

- Mark A-006 baseline discovery complete.
- Record the command baseline above.
- Add backlog items for API contract tests, auth/admin tests, Shopify tests,
  coverage policy, and isolated CI build strategy.

## Next Action

Reconcile A-006 findings into the findings register, then commission the first
implementation slice: stabilize the verification baseline by adding focused
tests for route protection/auth helpers and one representative API route group
before broadening to Shopify, admin CRUD, and browser smoke coverage.
