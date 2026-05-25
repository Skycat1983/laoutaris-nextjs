# T-242 Pilot Default Blog List Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the next narrow F-111/R-012 blog cache proof by caching only the
unfiltered `/blog` default grouped list reads while keeping sorted list pages,
comments, public APIs, and route-level blog rendering dynamic.

## Context

- T-240 compared blog cache candidates and deferred default grouped list
  caching until the primary blog detail proof landed.
- T-241 is complete: `/blog/[slug]` metadata, JSON-LD, and non-comments detail
  rendering now use a 10-minute cached primary blog detail wrapper.
- Before this task, `src/components/loaders/viewLoaders/BlogListLoader.tsx`
  called `getBlogList()` three times for the default unfiltered `/blog` view:
  featured page 1 limit 5, latest page 1 limit 6, and popular page 1 limit 8.
- Sorted `/blog?sortby=...&page=...` views make one query-driven list read and
  should stay direct in this proof.
- Popular ordering and blog list DTOs include comment-derived state. This proof
  accepts the same 10-minute stale window for the default grouped popular cards
  and server-rendered comment counts only; populated comments and comment
  mutations remain dynamic and out of scope.

## Scope

In scope:

- Add narrow cached non-`fetch` service wrapper(s) for the exact default grouped
  list reads used by the unfiltered `/blog` page.
- Prefer fixed no-argument wrappers for the three default groups over a broad
  parameterized `getBlogList()` cache, unless the implementation can prove the
  cache is impossible to use for sorted/query variants.
- Use the same 10-minute stale window as the biography, collections, and blog
  primary-detail proofs.
- Update `BlogListLoader` so only the no-`sortby` branch uses the cached default
  grouped list wrappers.
- Keep the sorted `sortby` branch on direct `getBlogList({ sortby, page,
  limit: 10 })`.
- Keep `/blog` explicitly dynamic, with no route-level `revalidate` and no
  `generateStaticParams()`.
- Update focused tests and rendering architecture notes to record the default
  grouped blog list cache proof.

Out of scope:

- Do not cache sorted blog list pages, query-driven page variants, public blog
  API routes, `BlogSectionLoader`, comments, comment counts separately,
  comments-mode detail rendering, search, Shopify data, artwork data,
  collection detail data, user/session state, admin routes, or account routes.
- Do not add route-level blog ISR, blog `generateStaticParams()`, cache tags,
  `revalidatePath()`, or `revalidateTag()`.
- Do not change pagination, sorting, featured/latest/popular semantics, API
  response contracts, comment mutation behavior, root providers, modal
  providers, or client islands.

## Concurrency

Run after T-241. Do not run in parallel with blog list route, `BlogListLoader`,
`getBlogList`, public blog API, comments, route-cache policy, provider, or
admin blog runtime edits.

Owned files:

- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- new narrow cached default blog list service wrapper module(s), if used
- `__tests__/unit/data/getCachedBlogListData.test.ts`, if a new wrapper module
  is added
- `__tests__/unit/loaders/BlogListLoader.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- The default unfiltered `/blog` grouped list reads use cached wrapper(s) with a
  10-minute stale window for exactly:
  - featured page 1 limit 5
  - latest page 1 limit 6
  - popular page 1 limit 8
- The cached wrapper(s) delegate to `getBlogList()` with those fixed parameters
  and do not call comments services.
- Sorted `/blog?sortby=...&page=...` rendering still calls direct
  `getBlogList()` with the requested sort and page.
- `/blog` remains `dynamic = "force-dynamic"` and defines no route-level
  `revalidate` or `generateStaticParams()`.
- Public blog API routes, `BlogSectionLoader`, comment rendering, and comment
  mutations keep their current direct service behavior.
- Focused tests guard the cached wrapper(s), default-versus-sorted
  `BlogListLoader` split, and route-cache policy invariants.
- Build output, if run, keeps `/blog` dynamic.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
npm run build
git diff --check
```

Run `npm run build` if route-cache policy expectations change, if route segment
config changes, or if fresh route-output evidence is needed for handoff.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-241.
- Completed on 2026-05-24.
- Implemented `src/lib/data/services/getCachedBlogListData.ts` with fixed
  10-minute cached wrappers for featured page 1 limit 5, latest page 1 limit
  6, and popular page 1 limit 8.
- Updated `BlogListLoader` so only the unfiltered grouped `/blog` branch uses
  those cached wrappers. Sorted list rendering still calls direct
  `getBlogList({ sortby, page, limit: 10 })`.
- Public blog APIs, `BlogSectionLoader`, comments, `/blog` route dynamic
  policy, route-level ISR, generated params, cache tags, and mutation
  revalidation were left out of scope.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogListData.test.ts __tests__/unit/loaders/BlogListLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`
  plus `npm run build` and `git diff --check`. Build output kept `/blog`
  dynamic.
- Orchestrator verification repeated on 2026-05-24 with the same focused Jest
  command, `npm run build`, and `git diff --check`; all passed. Build output
  kept `/blog` dynamic.
