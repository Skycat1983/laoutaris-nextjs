# T-244 Normalize Public Blog List Query Parsing And Bounds

Status: Complete

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Normalize and bound public blog list query parsing before any sorted
`/blog?sortby=...&page=...` cache implementation.

## Context

- T-241 cached primary blog detail reads while keeping comments and blog routes
  dynamic.
- T-242 cached only the unfiltered `/blog` default grouped featured/latest/
  popular reads with fixed no-argument wrappers.
- T-243 concluded that sorted blog list caching should wait because `/blog`
  page parsing can pass `NaN` page values to `BlogListLoader`, the public blog
  API accepts unbounded parsed `page`/`limit` values, and `getBlogList()`
  assumes trusted numeric inputs before applying MongoDB `skip()` and
  `limit()`.
- Sorted blog list rendering, public blog API routes, home/prototype blog
  sections, comments, and mutation paths should stay direct/dynamic in this
  task.

## Scope

In scope:

- Add a small shared public blog list query parser, preferably under
  `src/lib/data/schemas/` to match the public search/artwork query schemas,
  that canonicalizes the accepted `sortby`, `page`, and API `limit` values
  before they reach `BlogListLoader` or `getBlogList()`.
- Keep accepted sort values aligned with `getBlogList()`:
  `latest`, `oldest`, `popular`, and `featured`.
- Normalize missing, blank, malformed, fractional, negative, zero, and
  oversized `page` values to a finite bounded page value. Use `1` as the
  default and `1000` as the maximum unless source evidence points to a better
  local public browse limit.
- Normalize public API `limit` to a finite bounded value while preserving the
  current default `10`. Use `25` as the maximum unless source evidence points
  to a better local public API limit.
- Preserve valid existing `/blog?sortby=...&page=...` behavior and valid public
  blog API behavior.
- Add focused tests for page/query normalization, API query bounds, sorted
  loader service arguments, continuous-loading API assumptions if affected, and
  public route cache-policy invariants.
- Keep `/blog` explicitly dynamic with no route-level `revalidate` and no
  `generateStaticParams()`.

Out of scope:

- Do not add `unstable_cache`, sorted-list cache wrappers, route-level blog
  ISR, `generateStaticParams()`, cache tags, `revalidatePath()`, or
  `revalidateTag()`.
- Do not change default grouped `/blog` cached wrapper keys or stale windows.
- Do not cache public blog API routes, `BlogSectionLoader`, home/prototype blog
  sections, comments, comment counts separately, comment mutations, search,
  Shopify data, artwork data, admin routes, account routes, or user/session
  state.
- Do not redesign pagination UI, blog sorting semantics, API response
  envelopes, or public not-found/error contracts.

## Concurrency

Run after T-243. Do not run in parallel with blog route, blog loader, blog list
service, public blog API, comments, route-cache policy, provider, or admin blog
runtime edits.

Owned files:

- `src/app/blog/page.tsx`
- `src/app/api/v2/public/blog/route.ts`
- optional `src/lib/data/schemas/blogListQuerySchema.ts`, if the implementation
  chooses a shared schema
- `__tests__/unit/api/publicBlogListRoute.test.ts`
- `__tests__/unit/pages/BlogPage.test.tsx`
- `__tests__/unit/loaders/BlogListLoader.test.tsx`, if loader arguments change
- `__tests__/unit/sections/BlogSectionContinuous.test.tsx`, if API assumptions
  change
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- `/blog` passes only finite, bounded page numbers to `BlogListLoader`.
- Unknown `sortby` values continue to avoid unsafe service inputs and fall back
  to the current default grouped behavior unless the implementation records and
  tests a different canonical behavior.
- `GET /api/v2/public/blog` passes only finite, bounded `page` and `limit`
  values to `getBlogList()`, with default `page = 1`, maximum `page = 1000`,
  default `limit = 10`, and maximum `limit = 25` unless the task records a
  tested alternative in source.
- The accepted sort values stay `latest`, `oldest`, `popular`, and `featured`.
- Valid current sorted blog list URLs and public API calls still return the
  same data shape and pagination metadata shape.
- `/blog` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Sorted blog list rendering, public blog APIs, `BlogSectionLoader`, comments,
  and comment mutations remain direct/dynamic with no new cache wrappers.
- Focused tests cover malformed, missing, negative/zero, oversized, and valid
  query values.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/pages/BlogPage.test.tsx __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
git diff --check
```

Run `npm run build` only if route segment config, route output policy, or
build-time route evidence changes.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-243.
- Completed: added `src/lib/data/schemas/blogListQuerySchema.ts` to normalize
  public blog list `sortby`, `page`, and API `limit` inputs before the page
  loader or public API service calls receive them.
- Completed: `/blog` now falls back to grouped behavior for unknown `sortby`
  values and clamps/defaults missing, blank, malformed, fractional,
  negative/zero, and oversized page values to `1..1000`.
- Completed: `GET /api/v2/public/blog` now preserves valid API behavior and the
  existing invalid-`sortby` error body while normalizing page to `1..1000` and
  limit to `1..25` with default `10`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/pages/BlogPage.test.tsx __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/data/getBlogList.test.ts`.
- Verification passed: `git diff --check`.
- Orchestrator verification repeated on 2026-05-24:
  `npm test -- --runTestsByPath __tests__/unit/api/publicBlogListRoute.test.ts __tests__/unit/pages/BlogPage.test.tsx __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/sections/BlogSectionContinuous.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/data/getBlogList.test.ts`,
  `npm run build`, and `git diff --check`.
- The first orchestrator build caught a missing `BlogListSortBy` type
  re-export from `getBlogList`. The service type re-export was restored, and
  the repeated focused tests, build, and diff check passed. Build output kept
  `/blog` dynamic.
