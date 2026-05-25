# A-034 Current Jest Failure Triage

Status: Completed

Audit goal:
[A-034 Current Jest failure triage](../goals.md#a-034-current-jest-failure-triage).

Workstream: [Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Classify the current full `npm test` failures under the pinned repo runtime
into small fixable slices without changing runtime or test source.

## Summary

Under the pinned runtime, the current full `npm test` gate is red but smaller
than the prior A-027 snapshot: 7 failed suites and 10 failed tests out of 195
suites and 1,381 tests. The failures split into three small classes:

- 2 deterministic source-contract assertion drifts.
- 4 admin/form suites that time out only during the full concurrent run and pass
  when rerun in-band.
- 1 socket-binding sandbox artifact in the public smoke discovery endpoint
  suite, confirmed green outside the sandbox.

No runtime code, test code, package scripts, or CI files were changed for this
audit.

## Scope Inspected

- `docs/audits/goals.md#a-034-current-jest-failure-triage`
- `docs/workstreams/testing-and-quality.md`
- `docs/runbooks/testing.md`
- `docs/audits/results/A-027-verification-gate-snapshot.md`
- `package.json`
- Current failing Jest output from `npm test`
- Failing test files and representative touched source paths:
  - `__tests__/unit/publicImagePreloadSizing.test.tsx`
  - `__tests__/unit/styles/semanticStyles.test.ts`
  - `__tests__/unit/adminCollectionReadPagination.test.tsx`
  - `__tests__/unit/adminArticleReadPagination.test.tsx`
  - `__tests__/unit/adminBlogReadPagination.test.tsx`
  - `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
  - `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
  - `src/app/shop/products/[productHandle]/page.tsx`
  - `src/components/shop/product-detail/ShopProductSaleGallery.tsx`
  - `src/lib/styles/semanticStyles.ts`

## Commands Run

| Command | Outcome | Notes |
| --- | --- | --- |
| `git status --short` | Informational | Worktree was already dirty with modified shared docs and untracked A-034/A-035/task docs before this audit. This audit edited only this result file. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 && node -v && npm -v` | Passed | Confirmed pinned runtime: Node `v22.14.0`, npm `10.9.2`. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm test` | Failed | Full Jest failed with 7 failed suites, 188 passed suites, 195 total; 10 failed tests, 1,371 passed tests, 1,381 total; runtime about 278s. |
| `npm test -- --runInBand --runTestsByPath __tests__/unit/adminCollectionReadPagination.test.tsx __tests__/unit/adminArticleReadPagination.test.tsx __tests__/unit/adminBlogReadPagination.test.tsx __tests__/unit/forms/adminArticleBlogForms.test.tsx` | Passed | The four suites that timed out in the full run passed in-band: 26 tests passed in about 69s. This points to full-run contention/performance, not assertion breakage. |
| `npm test -- --runInBand --runTestsByPath __tests__/unit/publicImagePreloadSizing.test.tsx __tests__/unit/styles/semanticStyles.test.ts` | Failed | Confirmed both source-contract assertion drifts are deterministic outside full-run concurrency. |
| `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` | Passed with escalated socket permission | The suite passed outside the sandbox with 3 tests green in about 7.5s, confirming the full-run `listen EPERM 127.0.0.1` error is a sandbox socket artifact. |

## Failure Triage

| Suite or group | Failure class | Representative evidence | Likely owner | Recommended follow-up |
| --- | --- | --- | --- | --- |
| `__tests__/unit/publicImagePreloadSizing.test.tsx` | Deterministic assertion drift | Test line 100 expects `sizes="(max-width: 1024px) 100vw, 576px"` in `src/app/shop/products/[productHandle]/page.tsx`; current page no longer contains it. Product page still has book artwork `sizes` at line 287, while sale gallery image sizing now lives in `src/components/shop/product-detail/ShopProductSaleGallery.tsx` with `sizes="(max-width: 1279px) 100vw, 45vw"` at line 463. | Frontend routes/components plus Shopify commerce image/performance owner. | Decide whether the new gallery sizing is intended. If yes, update the source-contract test to the current component boundary and expected sizes. If not, restore the intended product detail image sizing. |
| `__tests__/unit/styles/semanticStyles.test.ts` | Deterministic assertion drift | Test line 152 requires every semantic style value to appear in existing source. `src/lib/styles/semanticStyles.ts` line 5 defines `displayTitle` as `font-cormorant text-5xl font-semibold leading-none text-slate sm:text-6xl lg:text-7xl xl:text-[82px] 2xl:text-[96px]`, but `rg` finds that exact class string only in the semantic style module and test. | Architecture/code health or frontend style-system owner. | Decide whether the semantic scaffold may contain future-only values. If yes, relax the provenance assertion. If no, either adopt that exact class string in a runtime component or adjust the scaffold to a class pattern still present in source. |
| `__tests__/unit/adminCollectionReadPagination.test.tsx`, `__tests__/unit/adminArticleReadPagination.test.tsx`, `__tests__/unit/adminBlogReadPagination.test.tsx`, `__tests__/unit/forms/adminArticleBlogForms.test.tsx` | Full-run timeout/performance contention | Full run hit Jest's 5s per-test timeout at collection line 123, article line 251, blog lines 230 and 261, and admin article/blog forms line 252. The same four suites passed in-band with 26 tests green. | Testing and quality plus admin UI test owners. | Split this from assertion fixes. Profile why concurrent full Jest starves these React/admin tests, then either reduce per-suite work, improve async waits/mocks, or configure a deliberate Jest worker/concurrency policy. |
| `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` | Sandbox socket artifact | Full run reported `listen EPERM: operation not permitted 127.0.0.1` and timeout at lines 143, 159, and 185. The same suite passed with escalated socket permission. | Testing/deployment smoke owner. | Keep this class separate from runtime regressions. Either document that this suite requires socket permission in sandboxed agent runs or refactor the fixture to avoid real localhost binding if local sandbox green is required. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Full Jest remains red under the pinned runtime. | `npm test` failed with 7 failed suites and 10 failed tests under Node `22.14.0` / npm `10.9.2`. | Restore the deterministic assertion drifts first, then address full-run timeout/concurrency and sandbox-socket handling as separate slices. |
| High | Two source-contract tests fail deterministically and are not caused by sandboxing or full-suite contention. | In-band rerun of `publicImagePreloadSizing.test.tsx` and `semanticStyles.test.ts` still failed on missing expected source strings. | Create a focused assertion-drift task covering product detail/gallery image sizing and semantic style provenance. |
| Medium | Four admin/form suites are vulnerable to full-run concurrency or worker contention. | The full run timed out five tests across four suites, while the targeted in-band rerun passed all 26 tests. | Profile or configure Jest execution for slow React/admin suites before treating these as product regressions. |
| Medium | One public smoke discovery suite cannot bind `127.0.0.1` in the default sandbox. | Full run failed with `listen EPERM: operation not permitted 127.0.0.1`; escalated rerun passed. | Record socket permission needs for this suite, or replace the socket fixture if sandbox-only green full Jest is a requirement. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A034-C1 | High | Candidate | Full `npm test` is red under Node `22.14.0` / npm `10.9.2` with 7 failed suites and 10 failed tests. | Testing and quality. |
| A034-C2 | High | Candidate | Product image sizing and semantic style source-contract tests have deterministic assertion drift. | Frontend routes/components, Shopify commerce, and architecture/code health. |
| A034-C3 | Medium | Candidate | Admin pagination/form tests pass in-band but time out in the full concurrent Jest run. | Testing and quality plus admin UI test owners. |
| A034-C4 | Medium | Candidate | Public smoke discovery endpoint tests require socket permission in sandboxed agent runs. | Deployment/security/observability plus testing and quality. |

## Risks Updated

- Candidate update for R-005/R-013: full Jest is still red, but the current
  failure surface is now triaged into deterministic assertion drift,
  full-run timeout/performance contention, and a sandbox socket artifact.
- Candidate update for deployment smoke risks: the public smoke discovery
  endpoint suite is green with socket permission but cannot bind `127.0.0.1` in
  the default sandbox.

## Workstream Updates

- Candidate testing workstream update: current pinned-runtime `npm test`
  baseline is 7 failed suites / 10 failed tests / 195 suites total. The smallest
  fixable slices are:
  1. product image sizing source-contract drift;
  2. semantic style provenance drift;
  3. admin React test full-run timeout/concurrency stabilization;
  4. sandbox socket handling for public smoke discovery endpoint tests.
- Candidate frontend/Shopify update: product detail sale image sizing appears to
  have moved from `src/app/shop/products/[productHandle]/page.tsx` into
  `ShopProductSaleGallery`, leaving the older page-level source-contract test
  stale or exposing a missing intended `sizes` value.

## Next Action

Create the smallest Jest restoration task for the deterministic assertion drift:
align `publicImagePreloadSizing.test.tsx` and `semanticStyles.test.ts` with the
intended current source contracts, without mixing in Jest concurrency tuning.
After those two suites are green, run full `npm test` again under Node
`22.14.0`; then handle the admin timeout/concurrency class and public-smoke
socket-permission class as separate follow-up tasks.
