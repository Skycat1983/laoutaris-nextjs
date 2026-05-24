# T-247 Pilot Bounded Sorted Blog Page Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the T-246 bounded sorted `/blog` cache expansion by caching only
`latest`, `oldest`, and `featured` server-rendered sorted pages 2-5 with fixed
`limit: 10`, while keeping `popular` page 2+, public APIs, browser follow-up
loading, comments, and route output direct/dynamic.

## Context

- T-241 cached primary blog detail reads.
- T-242 cached the unfiltered `/blog` default grouped list reads.
- T-244 bounded `/blog` page values to `1..1000` and public blog API limits to
  `1..25`.
- T-245 cached sorted `/blog` first-page reads for `latest`, `oldest`,
  `featured`, and `popular` with fixed `limit: 10`.
- T-246 selected only less comment-sensitive sorted pages 2-5 for expansion.
  It rejected `popular` beyond page 1 because comment mutations can change both
  ordering and page boundaries during the stale window.

## Scope

In scope:

- Add fixed cached non-`fetch` service wrappers for sorted `/blog` route reads:
  - `latest`, pages 2-5, `limit: 10`
  - `oldest`, pages 2-5, `limit: 10`
  - `featured`, pages 2-5, `limit: 10`
- Use the existing `BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS` 10-minute stale
  window.
- Prefer fixed no-argument wrappers and a fixed dispatcher over a broad
  parameterized cache.
- Update `BlogListLoader` so:
  - page 1 keeps using the T-245 sorted first-page cache dispatcher;
  - `latest`, `oldest`, and `featured` pages 2-5 use the new bounded cached
    dispatcher;
  - `popular` pages greater than 1 remain direct `getBlogList()` reads;
  - any sorted page greater than 5 remains direct `getBlogList()` reads.
- Update focused wrapper, loader, and public route-cache policy tests.
- Update rendering architecture notes and this task brief after completion.

Out of scope:

- Do not cache `popular` sorted pages beyond page 1.
- Do not cache sorted pages greater than 5.
- Do not cache public blog API routes, `BlogSectionLoader`, home/prototype blog
  sections, browser continuous-loading requests, comments, comment counts
  separately, comment mutations, search, Shopify data, artwork data, admin
  routes, account routes, or user/session state.
- Do not add route-level blog ISR, `generateStaticParams()`, cache tags,
  `revalidatePath()`, or `revalidateTag()`.
- Do not change query parsing/bounds, pagination UI, sort semantics, default
  grouped cache keys, public API behavior, or comment behavior.

## Concurrency

Run after T-246. Do not run in parallel with blog route, blog loader, blog list
service, cached blog list wrappers, public blog API, comments, route-cache
policy, provider, or admin blog runtime edits.

Owned files:

- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- `src/lib/data/services/getCachedBlogListData.ts`
- `__tests__/unit/data/getCachedBlogListData.test.ts`
- `__tests__/unit/loaders/BlogListLoader.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Sorted `/blog?sortby=latest&page=2..5`, `oldest`, and `featured` rendering
  uses cached wrappers with a 10-minute stale window and fixed `limit: 10`.
- Sorted `/blog?sortby=popular&page=2` and other `popular` pages greater than 1
  still call direct `getBlogList()`.
- Sorted page values greater than 5 still call direct `getBlogList()` with the
  canonical `sortby`, `page`, and `limit: 10`.
- Existing sorted page 1 wrappers for `latest`, `oldest`, `featured`, and
  `popular` keep the T-245 behavior.
- The unfiltered default grouped `/blog` branch keeps using the T-242 fixed
  cached wrappers.
- Public blog API routes, `BlogSectionLoader`, browser continuous-loading
  requests, comments, and comment mutations keep current direct/dynamic
  behavior.
- `/blog` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Focused tests guard new fixed cache keys, cached pages 2-5 for selected sort
  modes, direct `popular` page 2 reads, direct page 6 reads, default grouped
  behavior, and route-cache policy invariants.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
git diff --check
```

Run `npm run build` if route-cache policy expectations change, if route segment
config changes, or if fresh route-output evidence is needed for handoff.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-246.
- Selected by T-246 as the next fixed-key implementation slice because it
  increases sorted archive server-render cache coverage without multiplying the
  comment-derived freshness risk of `popular` pages beyond page 1.
- Completed 2026-05-24. Added fixed cached non-`fetch` wrappers for
  `latest`, `oldest`, and `featured` sorted `/blog` pages 2-5 with `limit: 10`
  and the existing 10-minute stale window.
- `BlogListLoader` now routes sorted page 1 through the T-245 dispatcher,
  selected pages 2-5 through the bounded dispatcher, and `popular` page 2-plus
  or page 6-plus through direct `getBlogList()` reads.
- Public blog API routes, `BlogSectionLoader`, browser follow-up loading,
  comments, comment mutations, route-level blog ISR, generated params, cache
  tags, and mutation revalidation remain out of scope and unchanged.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`
  passed with 3 suites and 55 tests; `git diff --check` passed;
  `npm run build` passed and kept `/blog` and `/blog/[slug]` dynamic in the
  route output.
