# T-130 Remove Public Browsing Client Console Errors

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the next public browsing client `console.error()` slice without adding a
monitoring provider or changing visible public archive, blog, or shop behavior.
Client components should keep using existing UI state, empty states, loading
states, and modals instead of treating browser console output as production
observability.

## Context

- T-125 defined the non-route logging/redaction policy and migration order.
- T-126 through T-129 completed the owner-independent server-side non-route
  logging slices for public loaders/pages, Shopify provider/data services,
  server actions/session helpers, and the remaining account saved-artwork
  server loader.
- The remaining non-route inventory is now client/admin/fetcher/helper focused.
- This task handles a bounded public browsing client slice before admin
  dashboard logging or shared fetcher policy work:
  - `src/hooks/useInfiniteScroll.ts`
  - `src/components/artwork/ArtworkGallery.tsx`
  - `src/components/sections/BlogSectionContinuous.tsx`
  - `src/components/views/BlogDetail.tsx`
  - `src/components/compositions/ShopProductGallery.tsx`
- These components already have user-visible loading, empty, fallback, or modal
  behavior. Do not introduce a new browser reporting abstraction until the
  monitoring/client-reporting decision is approved.

## Scope

In scope:

- Remove direct `console.error()` calls from the scoped public browsing client
  files.
- Preserve:
  - artwork filter URL updates, loading state, empty state, pagination, and
    duplicate suppression;
  - infinite-scroll `error` state and loading reset behavior;
  - blog continuous loading behavior and error propagation to
    `useInfiniteScroll`;
  - blog comment load/post modal behavior and comment refresh callbacks;
  - shop filter state, fetch behavior, loading overlay, sort behavior, empty
    product state, and reset behavior.
- Add focused source-hygiene coverage for the scoped files.
- Add or update focused behavior tests where removing console output could
  accidentally swallow existing UI state or error propagation.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not implement a monitoring provider, client reporting SDK, or generic
  browser reporting wrapper.
- Do not change admin dashboard clients, shared `createFetcher()`, user account
  forms/navigation, comment-card owner actions, `ErrorBoundary`, utility/helper
  warnings, or copy helper logging.
- Do not change API route contracts, public data services, Shopify product
  DTOs, route cache policy, or public copy beyond removing console-only
  diagnostics.

## Likely Files

- `src/hooks/useInfiniteScroll.ts`
- `src/components/artwork/ArtworkGallery.tsx`
- `src/components/sections/BlogSectionContinuous.tsx`
- `src/components/views/BlogDetail.tsx`
- `src/components/compositions/ShopProductGallery.tsx`
- `__tests__/unit/observability/`
- Existing focused tests such as:
  - `__tests__/unit/shopProductGallerySorting.test.tsx`
  - `__tests__/unit/security/renderSourceHygiene.test.ts`
  - loader tests that pin component props where relevant
- New focused behavior tests if needed
- Related docs under `docs/`

## Acceptance Criteria

- The scoped public browsing client files contain no direct `console.error()` or
  `console.warn()` calls.
- Existing visible UI/fallback behavior is preserved, including comment failure
  modals and infinite-scroll error state.
- No raw caught errors, API response bodies, comments, form values, or provider
  responses are logged from the scoped browser code.
- Focused source-hygiene coverage guards the scoped file list.
- Related tracking docs record remaining non-route logging cleanup categories:
  admin dashboard clients, shared fetcher/client reporting, user/account form
  clients, error boundary, and utility/helper warnings.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/hooks/useInfiniteScroll.ts src/components/artwork/ArtworkGallery.tsx src/components/sections/BlogSectionContinuous.tsx src/components/views/BlogDetail.tsx src/components/compositions/ShopProductGallery.tsx
npm test -- --runTestsByPath __tests__/unit/shopProductGallerySorting.test.tsx __tests__/unit/security/renderSourceHygiene.test.ts __tests__/unit/observability/publicBrowsingClientLoggingSourceHygiene.test.ts __tests__/unit/publicBrowsingClientErrorStates.test.tsx
git diff --check
```

Run any new or existing focused tests added for `useInfiniteScroll`,
`ArtworkGallery`, `BlogSectionContinuous`, or `BlogDetail` behavior if touched
beyond source-hygiene cleanup.

## Handoff Notes

- Planned on 2026-05-18 after T-129 completed the remaining server-loader
  structured logging slice.
- Completed on 2026-05-18 by removing direct `console.error()` calls from the
  scoped public browsing client files while preserving existing loading reset,
  empty/current-result fallback behavior, infinite-scroll error state, blog
  comment failure modals, shop sorting, and shop filter failure fallback.
- Added `publicBrowsingClientLoggingSourceHygiene.test.ts`,
  `publicBrowsingClientErrorStates.test.tsx`, and extended
  `shopProductGallerySorting.test.tsx` so the scoped files stay free of direct
  `console.error()`/`console.warn()` calls and key client failure states remain
  visible through existing UI state instead of browser console output.
- Remaining non-route logging cleanup categories are admin dashboard clients,
  shared fetcher/client reporting, account/user form and navigation clients,
  `CommentCard` owner actions, `ErrorBoundary`, and utility/helper warnings or
  copy failures.
