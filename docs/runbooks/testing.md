# Testing Runbook

## Commands

```bash
node -v
npm -v
npm ci --dry-run --ignore-scripts
npm run typecheck
npm test
npm run build
npm run lint
git diff --check
```

The expected runtime baseline is Node `22.14.0` and npm `10.9.2`. Use `npm ci`
for clean installs and `npm ci --dry-run --ignore-scripts` when verifying that
the lockfile install path is still reproducible without running lifecycle
scripts.

`npm run typecheck` owns explicit TypeScript `noEmit` checking for local
verification. It runs `tsc --noEmit --pretty false --skipLibCheck` without
emitting build artifacts.

For a full local handoff gate, run:

```bash
npm run verify:local
```

`npm run verify:local` runs typecheck, full Jest, production build, lint, and
`git diff --check`. It is local evidence only; production release evidence still
needs the external-access build notes and deployed smoke/log checks described
below.

## Main CI Local Gate

`.github/workflows/main-ci.yml` is the non-secret GitHub Actions `Main CI`
workflow for pull requests targeting `main`, pushes to `main`, and manual
dispatch.

Main CI uses Node `22.14.0`, npm `10.9.2`, `npm ci`, and npm dependency
caching, then runs the local gate command set:

```bash
npm run typecheck
npm test
npm run build
npm run lint
```

It also runs a whitespace check over the event range. Pull requests compare the
PR base SHA to the checked-out merge SHA; pushes compare the event `before` SHA
to the pushed SHA, with an empty-tree fallback for new refs; manual dispatch
checks the current commit against its parent when one exists. Do not run
`npm run verify:local` verbatim in CI for that final check: the script's
`git diff --check` is correct for a dirty local worktree, but a clean CI
checkout needs an event-aware commit-range check.

Main CI is allowed to run without repository secrets or production variables.
That means a restricted CI build is regression evidence, not complete release
evidence for intentional external-build surfaces. Keep external-access build
notes, deployed public smoke, credentialed/admin smoke, Vercel log checks, and
monitoring/alerting evidence separate.

## External-Access Build Evidence

Release verification must state whether `npm run build` ran with external
access to MongoDB, Shopify Storefront API, and required network resources. A
restricted local or CI build can be useful regression evidence, but it is not
complete release evidence for intentional external-build surfaces unless the
handoff records the restriction and the follow-up deployed smoke proves the
expected data-backed output.

This policy covers only intentional static/ISR build-time surfaces:

- `/biography`: record the default redirect target selected from cached
  biography navigation data, then smoke that biography detail route.
- `/collections`: record the default redirect target selected from cached
  collection navigation data, then smoke that collection/artwork route.
- `/sitemap.xml`: record a deployed or post-build sitemap check. When dynamic
  archive or shop entries are expected, verify representative expected URLs are
  present for the relevant biography, blog, artwork, collection, collection
  artwork, and Shopify product sources.

Do not classify accidental request-time route build failures as satisfying this
policy. If protected account routes, `/project/about`, or another dynamic
surface starts failing `npm run build` because external services are
unavailable, treat it as a build-isolation regression and route it through a
focused fix.

## Public Smoke In CI

`.github/workflows/public-smoke.yml` runs `npm run smoke:public` in GitHub
Actions with Node `22.14.0` and `npm ci`.

- Manual runs require the `workflow_dispatch` `base_url` input.
- Scheduled runs use repository variable `SMOKE_BASE_URL` and skip until that
  non-secret variable is configured.
- Optional non-secret repository variables can broaden coverage:
  `SMOKE_TIMEOUT_MS`, `SMOKE_SEARCH_QUERY`, `SMOKE_ARTWORK_ID`,
  `SMOKE_COLLECTION_SLUG`, `SMOKE_COLLECTION_ARTWORK_ID`, `SMOKE_BLOG_SLUG`,
  `SMOKE_PRODUCT_HANDLE`, and `SMOKE_MISSING_PRODUCT_HANDLE`.
- Skipped optional detail checks mean the workflow did not prove that detail
  route. They should be treated as missing production evidence, not as passing
  detail coverage.

The workflow is unauthenticated. It does not cover credential sign-in, admin
access, Vercel log inspection, provider alerting, or rollback automation.

The focused unit suite
`__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` does not bind
a localhost socket. It spawns the real `scripts/smoke-public-routes.mjs` CLI
with a preloaded in-process `fetch` fixture, so it is expected to pass in the
default sandbox without escalated socket permission while still proving the
robots and sitemap discovery output checks.

## Browser And Playwright Discipline

Browser-style checks can be useful for layout, routing, accessibility, and smoke
tests, but they can also produce excessive output.

Playwright is not part of the current baseline. Add it only after a scoped task
or owner/orchestrator decision names the browser behavior it must prove.
Good candidates are behavior that Jest, route-handler tests, and `curl` smoke
checks cannot prove, such as:

- Mobile and desktop layout regressions on high-value public archive routes.
- Real navigation, focus, history, modal, drawer, and responsive-menu behavior.
- Credentialed sign-in/admin smoke with an approved smoke account and no secrets
  in logs or artifacts.
- Shopify hosted-product handoff behavior in a real browser without app-owned
  checkout, shipping, refund, or guarantee claims.
- Deployed runtime failures that only appear after browser loading, hydration, or
  browser-managed redirects.

Do not add Playwright for broad content discovery, full DOM inventory,
unbounded accessibility dumps, full console/network harvesting, or exploratory
screenshots across many routes. Those uses should be narrowed into source
search, route tests, `npm run smoke:public`, or a small manual checklist first.

When using Playwright or similar tools:

- Define the exact route, interaction, selector, and expected observation before
  running the check.
- Capture only the screenshot, console line, network fact, or assertion needed.
- Avoid full traces, videos, full DOM dumps, or broad log ingestion unless the
  audit or task explicitly requires them.
- Record concise findings and file paths in the result doc; do not paste large
  raw outputs.

Before any Playwright dependency or script is added, document:

- The first route or journey list, ideally no more than three paths.
- Required local or deployed `baseURL` behavior.
- Required fixture data, test account handling, and secret redaction rules.
- The exact command name and whether it is local-only, CI-eligible, or scheduled.
- Artifact policy: traces and videos disabled by default; screenshots limited to
  the named assertion or failure state; console/network capture filtered to the
  expected signal.
- The owning workstream, result file, or task handoff location for any findings.

## Current Test Shape

- Jest is configured through `next/jest`.
- Test environment is `jsdom`.
- Existing tests cover utility helpers and a small home view integration test.
- No browser end-to-end script is currently defined in `package.json`.
- Playwright is not installed; browser automation remains decision-gated by the
  scoped discipline above.
- Project owner reports that testing has been attempted but is not yet
  successfully established as a reliable project practice.

## Baseline Snapshot

As of the [A-006 testing baseline](../audits/results/A-006-testing-quality-baseline.md)
on 2026-05-14:

- `npm test` passed with 9 suites and 95 tests.
- `npm run lint` passed with no ESLint warnings or errors.
- `npm run build` failed in the default sandbox when Google Fonts could not be
  fetched, then passed with approved network access.
- A coverage probe across `src/**/*.{ts,tsx}` reported 1.78% statements and
  1.76% lines. Coverage is not an enforced gate.

Treat the build as environment-sensitive until font and live-data dependencies
are isolated or explicitly documented for CI.

## When To Add Tests

Add or update tests when changing:

- Route utilities or auth protection behavior.
- Data transforms that map MongoDB models to frontend types.
- Shopify product link helpers or product transformation.
- API route response behavior.
- Shared component behavior that affects multiple public routes.
- SSR, data-fetching, or loader patterns once the preferred rendering strategy is
  documented.

## Handoff Requirement

Every workstream update should record:

- Commands run.
- Pass or fail result.
- Any environment limitation.
- Follow-up risk if a failure remains unresolved.
