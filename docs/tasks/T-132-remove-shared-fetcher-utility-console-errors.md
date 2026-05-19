# T-132 Remove Shared Fetcher Utility Console Errors

Status: Completed

Workstream:
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining shared fetcher and low-value utility/helper
`console.error()`/`console.warn()` slice without changing fetcher return
contracts, date/translation fallback behavior, color icon rendering, blog
sidebar state, or copy-to-clipboard behavior.

## Context

- T-130 and T-131 completed the scoped public browsing and account/user client
  console-error cleanup slices.
- The remaining non-route inventory is now concentrated in admin dashboard
  clients plus a smaller shared fetcher/utility/helper slice.
- This task handles the smaller shared slice before the larger admin dashboard
  cleanup:
  - `src/lib/api/core/createFetcher.ts`
  - `src/lib/utils/dateUtils.ts`
  - `src/lib/utils/translationUtils.ts`
  - `src/lib/helpers/copy_id.ts`
  - `src/components/modules/cards/ArtworkFeedCard.tsx`
  - `src/components/elements/icons/TailwindColorIcon.tsx`
  - `src/components/modules/sidebar/BlogSidebar.tsx`
- These paths already return API error envelopes, fallback strings, empty
  rendering, local UI state, or silent copy behavior. Browser/shared utility
  console output should not be the production reporting path.

## Scope

In scope:

- Remove direct `console.error()` and `console.warn()` calls from the scoped
  shared fetcher/utility/helper files.
- Preserve:
  - `createFetcher()` success shape, `ApiErrorResponse` failure shape, Next
    control-flow rethrow behavior, header merging, and JSON parsing behavior;
  - `formatDate()` returning `"Invalid Date"` for invalid inputs;
  - `getTranslation()` returning the key for missing keys or missing language
    variants;
  - `copy_id()` and `ArtworkFeedCard` copy attempts without visible UI changes;
  - `TailwindColorIcon` returning no element for unknown colors;
  - `BlogSidebar` active option state and rendered navigation/sidebar behavior.
- Add focused source-hygiene coverage for the scoped file list.
- Add or update focused behavior tests where removing console output could
  accidentally change fallback behavior.
- Update related workstream, task, risk, and finding docs after completion.

Out of scope:

- Do not change admin dashboard clients.
- Do not implement a monitoring provider, client reporting SDK, or generic
  browser reporting wrapper.
- Do not change API route contracts, fetcher caller contracts, translation
  catalogs, date formatting semantics, clipboard UI, or blog sidebar UX.

## Likely Files

- `src/lib/api/core/createFetcher.ts`
- `src/lib/utils/dateUtils.ts`
- `src/lib/utils/translationUtils.ts`
- `src/lib/helpers/copy_id.ts`
- `src/components/modules/cards/ArtworkFeedCard.tsx`
- `src/components/elements/icons/TailwindColorIcon.tsx`
- `src/components/modules/sidebar/BlogSidebar.tsx`
- `__tests__/unit/security/renderSourceHygiene.test.ts`
- `__tests__/unit/sharedFetcherUtilityFallbacks.test.tsx`
- Existing focused tests for fetchers/helpers/components where available
- Related docs under `docs/`

## Acceptance Criteria

- The scoped shared fetcher/utility/helper files contain no direct
  `console.error()` or `console.warn()` calls.
- Existing fallback values, return contracts, copy behavior, and component
  rendering behavior are preserved.
- No raw caught errors, endpoints beyond existing public error envelopes,
  translation keys beyond returned fallback values, colors, or copied IDs are
  logged from the scoped code.
- Focused source-hygiene coverage guards the scoped file list.
- Related tracking docs record the remaining non-route logging cleanup category:
  admin dashboard clients.

## Verification

```bash
rg -n "console\.(error|warn)\(" src/lib/api/core/createFetcher.ts src/lib/utils/dateUtils.ts src/lib/utils/translationUtils.ts src/lib/helpers/copy_id.ts src/components/modules/cards/ArtworkFeedCard.tsx src/components/elements/icons/TailwindColorIcon.tsx src/components/modules/sidebar/BlogSidebar.tsx
npm test -- --runTestsByPath __tests__/unit/security/renderSourceHygiene.test.ts
git diff --check
```

Run any new or existing focused tests added for fetcher, date, translation,
copy, color icon, or blog sidebar behavior if touched beyond source-hygiene
cleanup.

## Handoff Notes

- Planned on 2026-05-18 after T-131 completed the account/user client
  console-error cleanup slice.
- Completed on 2026-05-18 by removing direct `console.error()`/
  `console.warn()` calls from the scoped shared fetcher, utility/helper, and
  component files without changing their return, fallback, copy, or rendering
  contracts.
- Added focused source-hygiene coverage in
  `__tests__/unit/security/renderSourceHygiene.test.ts` and behavior coverage
  in `__tests__/unit/sharedFetcherUtilityFallbacks.test.tsx`; updated existing
  fetcher, date, and copy helper tests to assert silent fallback behavior.
- Remaining non-route direct `console.error()`/`console.warn()` cleanup is now
  concentrated in admin dashboard clients.
- Verification passed:
  `rg -n "console\\.(error|warn)\\(" ...scoped files`, focused Jest for
  source hygiene/fallback behavior, and `git diff --check`.
