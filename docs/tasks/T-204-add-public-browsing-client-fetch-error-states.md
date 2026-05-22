# T-204 Add Public Browsing Client Fetch Error States

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add visible retry/error states for public browsing client fetch failures in
artwork browse, shop product filtering, and blog continuous loading.

## Context

- A-005/F-107 found artwork filtering/load-more, shop product follow-up
  fetching, and blog continuous loading can swallow failures or preserve stale
  data without a visible error or retry state.
- `ArtworkGallery` catches filter and load-more failures without exposing a
  user-visible state.
- `ShopProductGallery` catches product filter failures without exposing a
  user-visible state.
- `BlogSectionContinuous` uses `useInfiniteScroll`, but does not render the
  hook error for failed follow-up blog loading.
- T-203 resolved F-106 by replacing silent homepage section-loader `null`
  fallbacks with visible fallback states. Keep this task scoped to client
  follow-up fetch states only.

## Scope

In scope:

- Add visible error and retry affordances for artwork filter failures while
  preserving the current artwork list.
- Add visible error and retry affordances for artwork load-more failures while
  preserving already-rendered artworks and existing infinite-scroll behavior.
- Add visible error and retry affordances for shop product filter failures while
  preserving the current product grid or empty state.
- Render a visible blog continuous-loading error state when follow-up blog
  loading fails, without removing already-rendered posts.
- Clear stale error state after successful retries, filter changes, clear-filter
  actions, or successful load-more actions as appropriate.
- Preserve existing API contracts, query params, sort/filter controls, no
  same-app server loader regressions, and existing direct-console source hygiene.
- Add or update focused tests covering failure, retry, stale-data preservation,
  successful recovery, and no direct console error output.

Out of scope:

- Do not change server loaders, public detail not-found/error behavior, home
  section server fallbacks, Shopify checkout/cart/enquiry behavior, search
  scope, product API contracts, route loading-state documentation, mixed barrel
  cleanup, account subnavigation, or framed-preview behavior.
- Do not redesign artwork, shop, or blog browsing layouts beyond the minimal
  visible error/retry UI required for the failure states.

## Concurrency

Run this task alone with other runtime work touching public browsing client
components, public browsing client error-state tests, or the infinite-scroll
hook.

Owned files:

- `src/components/artwork/ArtworkGallery.tsx`
- `src/components/layouts/public/MasonryLayout.tsx` if needed for load-more
  error rendering/retry wiring
- `src/components/compositions/ShopProductGallery.tsx`
- `src/components/sections/BlogSectionContinuous.tsx`
- focused tests for those client failure states
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Artwork filter fetch failures show a visible error/retry state and keep the
  previous artwork list visible.
- Artwork load-more failures show a visible error/retry state and keep
  already-rendered artworks visible.
- Shop product filter fetch failures show a visible error/retry state and keep
  the previous product grid or empty state visible.
- Blog continuous-loading failures show a visible error state and keep existing
  posts visible.
- Successful retry or subsequent successful fetch clears the visible error.
- Existing successful sort/filter/load-more behavior is preserved.
- Focused tests pass and public browsing client source hygiene still avoids
  direct console error output.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicBrowsingClientErrorStates.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx
npm test -- --runTestsByPath __tests__/unit/observability/publicBrowsingClientLoggingSourceHygiene.test.ts
git diff --check
```

Add any new focused artwork gallery or shop gallery test paths to the command
before handoff.

## Agent Prompt

You are working on T-204. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
F-107 in `docs/audits/findings-register.md`, and the frontend workstream.
Implement only visible public browsing client fetch error states for artwork
browse/filter/load-more, shop product filtering, and blog continuous loading.
Keep existing rendered content visible on failure, provide retry affordances
where the user can reasonably repeat the failed action, clear errors after
successful retries or follow-up actions, and preserve existing API contracts,
query params, sorting/filtering behavior, and source-hygiene expectations. Do
not touch server loaders, public detail not-found behavior, home section
fallbacks, checkout/enquiry behavior, account UI, mixed barrel cleanup, or
framed-preview work. Run the verification commands plus any new focused tests,
then update this handoff with candidate tracker updates.

## Handoff Notes

- Prepared after T-203 resolved the home section loader fallback-state finding
  F-106.
- Completed 2026-05-22.
- Runtime changes:
  - `ArtworkGallery` now shows visible retryable filter-fetch and load-more
    errors while keeping the current artwork list rendered, and clears those
    errors after successful retries, successful follow-up fetches, or clearing
    filters.
  - `MasonryLayout` now awaits load-more callbacks and can render a
    retryable load-more error near the infinite-scroll observer.
  - `ShopProductGallery` now shows a visible retryable product-filter error
    while preserving the current product grid or empty state, and clears the
    error after successful retry or reset.
  - `useInfiniteScroll` now exposes a retry callback and clears stale hook
    errors before/successfully after follow-up loads.
  - `BlogSectionContinuous` now renders the hook's follow-up loading error and
    retry control without removing already-rendered posts.
- Focused tests updated:
  - `__tests__/unit/publicBrowsingClientErrorStates.test.tsx`
  - `__tests__/unit/sections/BlogSectionContinuous.test.tsx`
  - `__tests__/unit/shopProductGallerySorting.test.tsx`
- Verification passed:
  - `npm test -- --runTestsByPath __tests__/unit/publicBrowsingClientErrorStates.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/shopProductGallerySorting.test.tsx`
  - `npm test -- --runTestsByPath __tests__/unit/observability/publicBrowsingClientLoggingSourceHygiene.test.ts`
  - `npm run lint`
  - `git diff --check`
- Additional check:
  - Orchestrator reconciliation cleared the unrelated ArticleLoader no-emit
    diagnostic by aligning missing-navigation logging with the
    `getArticleNavigationList()` success-or-null service contract.
  - `npm test -- --runTestsByPath __tests__/unit/loaders/ArticleLoader.test.tsx`
    passed.
  - `./node_modules/.bin/tsc --noEmit --pretty false` passed.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark F-107
  and T-204 complete, R-032 mitigated for the reconciled A-005 fallback scope,
  and T-205 prepared for F-108/R-033 mixed component barrel cleanup.
