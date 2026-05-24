# T-245 Pilot Sorted Blog First-Page Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the next narrow F-111/R-012 blog cache proof by caching only sorted
`/blog?sortby=...&page=1` list reads after T-244 query normalization, while
keeping later sorted pages, public APIs, comments, and route output dynamic.

## Context

- T-241 cached primary blog detail reads.
- T-242 cached the unfiltered `/blog` default grouped featured/latest/popular
  reads with fixed no-argument wrappers.
- T-243 rejected immediate broad sorted-list caching until query values were
  canonical and bounded.
- T-244 added shared public blog list query parsing so `/blog` now passes only
  finite page values in `1..1000`, and the public blog API passes bounded
  `page` and `limit` values to `getBlogList()`.
- Sorted `/blog` rendering still calls direct
  `getBlogList({ sortby, page, limit: 10 })` for every sorted page.

## Scope

In scope:

- Add narrow cached non-`fetch` service wrapper(s) for sorted first-page
  `/blog` list reads only:
  - latest page 1 limit 10
  - oldest page 1 limit 10
  - featured page 1 limit 10
  - popular page 1 limit 10
- Prefer fixed no-argument wrappers, or a fixed allowlisted dispatcher, over a
  broad parameterized sorted-list cache.
- Use the same 10-minute stale window as the existing blog cache proofs.
- Update `BlogListLoader` so `sortby` with `page === 1` uses the sorted
  first-page cached wrapper path, while `page > 1` stays on direct
  `getBlogList({ sortby, page, limit: 10 })`.
- Keep the existing default grouped no-`sortby` branch on the T-242 fixed
  cached wrappers.
- Accept a 10-minute stale window for the popular sorted first page and its
  comment-derived ordering/comment counts. Later popular pages remain direct.
- Update focused tests and rendering architecture notes.

Out of scope:

- Do not cache sorted pages beyond page 1.
- Do not cache public blog API routes, `BlogSectionLoader`, home/prototype blog
  sections, comments, comment counts separately, comment mutations, search,
  Shopify data, artwork data, admin routes, account routes, or user/session
  state.
- Do not add route-level blog ISR, `generateStaticParams()`, cache tags,
  `revalidatePath()`, or `revalidateTag()`.
- Do not change query parsing/bounds, pagination UI, sort semantics, default
  grouped cache keys, public API behavior, or comment behavior.

## Concurrency

Run after T-244. Do not run in parallel with blog route, blog loader, blog list
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

- Sorted `/blog?sortby=latest&page=1`, `oldest`, `featured`, and `popular`
  first-page rendering uses cached wrapper(s) with a 10-minute stale window and
  fixed `limit: 10`.
- Sorted page values greater than 1 still call direct `getBlogList()` with the
  canonical `sortby`, `page`, and `limit: 10`.
- The unfiltered default grouped `/blog` branch keeps using the T-242 fixed
  cached wrappers.
- Public blog API routes, `BlogSectionLoader`, comments, and comment mutations
  keep current direct/dynamic behavior.
- `/blog` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Focused tests guard sorted first-page cache keys, sorted page 2 direct reads,
  default grouped behavior, and route-cache policy invariants.

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
- Depends on: T-244.
- Completed: sorted `/blog` page 1 rendering now uses fixed cached wrappers for
  latest, oldest, featured, and popular with `limit: 10` and the existing
  10-minute stale window.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`.
- Additional verification passed: `npm run build`; build output kept `/blog`
  dynamic.
- This proof should stop at sorted first pages. Broader bounded sorted-page
  cache variants, route-level blog ISR, generated params, cache tags, mutation
  revalidation, and comment freshness remain separate future scopes.
- Orchestrator verification repeated on 2026-05-24:
  `npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`,
  `npm run build`, and `git diff --check`; all passed. Build output kept
  `/blog` dynamic.
