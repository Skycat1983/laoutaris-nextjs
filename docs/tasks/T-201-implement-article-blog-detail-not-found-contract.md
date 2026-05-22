# T-201 Implement Article And Blog Detail Not-Found Contract

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Extend the accepted public detail not-found/error contract to biography article
detail and blog detail routes after the T-200 artwork slice.

## Context

- A-005 found inconsistent public detail not-found/error behavior across
  artwork, collection-scoped artwork, article/blog, and Shopify product detail
  pages.
- T-199 recorded the accepted route-family contract in
  [Rendering and data fetching](../architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract).
- T-200 completed the first runtime slice for `/artwork/[artworkId]` and
  `/collections/[slug]/[artworkId]`.
- `ArticleLoader` currently throws generic article or navigation errors when
  primary article content or optional navigation data is missing.
- `BlogDetailLoader` currently throws `Blog entry not found` for missing primary
  content and logs/throws failures from the selected blog detail service.

## Scope

In scope:

- Add route-local not-found UI using the shared `PublicDetailNotFound`
  presentation for:
  - `src/app/biography/[slug]/not-found.tsx`
  - `src/app/blog/[slug]/not-found.tsx`
- Map valid-but-missing primary biography article detail content to
  `notFound()`.
- Map valid-but-missing primary blog detail content to `notFound()`.
- Preserve upstream/service failures as error-boundary failures, not 404s.
- Treat article navigation as optional related content for a found primary
  article: navigation lookup failures or empty navigation should degrade to
  `prev: null` and `next: null` with structured server logging rather than
  failing the page.
- Treat blog comments as optional related content for a found primary blog post:
  comment-loading failures must not make a found post 404.
- Keep existing missing/unavailable metadata behavior aligned with
  `buildMissingPublicDetailMetadata()` and
  `buildUnavailablePublicDetailMetadata()`.
- Add or update focused tests for missing primary content, upstream failures,
  optional navigation/comment degradation, route-local not-found presentation,
  and no same-app HTTP regressions.

Out of scope:

- Do not change the T-200 artwork routes except for shared helper imports that
  are unavoidable.
- Do not change Shopify product detail routes.
- Do not change home section loader fallback states, client follow-up fetch
  states, mixed component barrels, account subnavigation, or route loading-state
  documentation.
- Do not redesign public article/blog layouts or alter SEO copy beyond
  preserving the existing metadata contract.
- Do not add a CI/release `noEmit` gate.

## Concurrency

Run this task alone with other runtime work touching article/blog detail routes,
`ArticleLoader`, `BlogDetailLoader`, shared public not-found UI, public detail
metadata tests, or public article/blog detail tests.

Owned files:

- `src/app/biography/[slug]/page.tsx`
- `src/app/biography/[slug]/not-found.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/[slug]/not-found.tsx`
- `src/components/loaders/viewLoaders/ArticleLoader.tsx`
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
- focused tests for the touched routes/loaders
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Missing primary biography article content calls `notFound()`.
- Missing primary blog detail content calls `notFound()`.
- Upstream/service failures still reach the App Router error boundary path.
- Found biography article details still render if optional navigation loading is
  unavailable.
- Found blog details still render if optional comment loading is unavailable.
- Route-local not-found UI exists for the converted biography and blog detail
  routes and reuses shared public presentation.
- Focused tests pass and existing no-same-app-fetch/source-hygiene expectations
  remain intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/loaders/BlogDetailLoader.test.tsx
npm test -- --runTestsByPath __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
git diff --check
```

Add any new focused route/not-found component test paths to the command before
handoff.

## Agent Prompt

You are working on T-201. Read `AGENTS.md`, `docs/README.md`, T-199, T-200,
the A-005 result,
`docs/architecture/rendering-and-data-fetching.md#public-detail-not-found-and-error-contract`,
and the frontend workstream. Implement only the accepted not-found/error
contract for biography article and blog detail routes. Reuse the shared public
not-found presentation, map missing primary content to `notFound()`, keep
upstream failures as errors, and make article navigation/blog comments degrade
as optional related content when primary content is found. Do not touch artwork,
Shopify product detail, home section loaders, client follow-up fetches, account
subnav, or shared trackers. Run the verification commands plus any new focused
tests, then update this handoff with candidate tracker updates.

## Handoff Notes

- Prepared after T-200 completed the artwork detail runtime slice.
- Completed on 2026-05-22.
- Added route-local not-found UI for `/biography/[slug]` and `/blog/[slug]`
  using the shared `PublicDetailNotFound` presentation.
- Updated `ArticleLoader` so missing primary article content calls
  `notFound()`, primary article service failures still throw into the App
  Router error path, and optional previous/next navigation failures or empty
  navigation degrade to `prev: null` and `next: null` with structured server
  logging.
- Updated `BlogDetailLoader` so missing primary blog content calls
  `notFound()`, primary blog service failures still throw into the App Router
  error path, and comment loading for a found post degrades to the non-comment
  detail render with structured server logging.
- Added focused coverage in
  `__tests__/unit/pages/ArticleBlogDetailNotFoundContract.test.tsx` and updated
  the article/blog loader tests for missing primary content, upstream failures,
  optional related-content degradation, route-local not-found UI, and no
  same-app HTTP regressions.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/loaders/BlogDetailLoader.test.tsx __tests__/unit/pages/ArticleBlogDetailNotFoundContract.test.tsx`
  passed.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
  passed.
- Verification: `npm run lint` passed.
- Verification: `git diff --check` passed.
- Test runs emitted the existing Node `punycode` deprecation warning.
- Candidate tracker updates for the orchestrator: mark the biography article
  and blog runtime slice of the public detail not-found/error contract complete;
  keep the broader public-detail finding open for Shopify route-local UI
  follow-up; note that shared workstream, risk, audit, and orchestration
  trackers were intentionally not edited by this implementation task.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark T-201
  complete, and T-202 was created for the remaining Shopify product detail
  route-local not-found UI slice.
- Orchestration follow-up on 2026-05-22: corrected the optional article
  navigation missing-result log reason to match the
  `getArticleNavigationList()` success-or-null service contract. The focused
  ArticleLoader test and strict TypeScript `noEmit` pass after the correction.
