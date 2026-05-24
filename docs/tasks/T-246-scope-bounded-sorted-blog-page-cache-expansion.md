# T-246 Scope Bounded Sorted Blog Page Cache Expansion

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide whether the A-022/F-111/R-012 blog cache track should expand sorted
`/blog?sortby=...&page=...` caching beyond page 1, and define a safe bounded
policy before any runtime implementation.

## Context

- T-241 cached primary blog detail reads.
- T-242 cached the unfiltered `/blog` default grouped list reads.
- T-243 required query hygiene before sorted-list cache expansion.
- T-244 bounded `/blog` page values to `1..1000` and public blog API limits to
  `1..25`.
- T-245 cached only sorted `/blog` first-page reads for `latest`, `oldest`,
  `featured`, and `popular` with fixed `limit: 10`.
- Sorted pages greater than 1, public blog APIs, home/prototype blog sections,
  comments, route output, cache tags, and mutation revalidation remain
  direct/dynamic.

## Scope

In scope:

- Review source and tests for:
  - `src/app/blog/page.tsx`
  - `src/components/loaders/viewLoaders/BlogListLoader.tsx`
  - `src/lib/data/services/getCachedBlogListData.ts`
  - `src/lib/data/schemas/blogListQuerySchema.ts`
  - public blog API, home `BlogSectionLoader`, and continuous-loading behavior
  - blog cache wrapper, loader, API, page, and route-cache policy tests
- Compare at least these candidates:
  - cache no additional sorted pages and switch to another F-111/F-115 route or
    provider/client-island option
  - cache sorted pages 2-5 for all four sort modes with fixed bounded keys
  - cache only less comment-sensitive sorted pages 2-5, leaving `popular`
    beyond page 1 direct
  - introduce a broader parameterized sorted page cache with a hard page cap
    and explicit key policy
- Rank candidates by impact, implementation risk, cache cardinality, freshness
  constraints, popularity/comment-count staleness, blast radius, and
  testability.
- Recommend one next implementation slice and create the follow-up task brief if
  the boundary is clear.
- Record why rejected candidates should wait.

Out of scope:

- Do not make runtime source changes.
- Do not add or broaden `unstable_cache`, route-level blog ISR,
  `generateStaticParams()`, cache tags, `revalidatePath()`, `revalidateTag()`,
  provider moves, or query parser changes in this task.
- Do not cache comments, public blog API routes, home/prototype blog sections,
  search, Shopify data, artwork data, admin/account routes, or user/session
  state.

## Concurrency

Run after T-245. Do not run in parallel with blog route, blog loader, blog list
service, cached blog list wrappers, public blog API, comments, route-cache
policy, provider, or admin blog runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally the selected follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if needed

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass states whether sorted blog page caching should expand beyond
  page 1, pause, or move to a different Next.js efficiency target.
- Any selected cache expansion plan defines allowed sort modes, page range,
  stale window, cache key shape, excluded callers, and direct/dynamic fallbacks.
- The plan explicitly addresses `popular` sort staleness from comment-derived
  ordering/counts.
- The plan keeps `/blog` route output dynamic and does not add route-level ISR,
  generated params, cache tags, or mutation revalidation.
- The plan keeps public blog APIs, `BlogSectionLoader`, comments, and comment
  mutations direct/dynamic.
- A follow-up implementation task is created only if the boundary is clear.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source/test reads and `rg` searches for blog list route parsing,
sorted page cache wrappers, public blog API callers, direct home-section
callers, and route-cache policy coverage. Run `npm run build` only if fresh
route evidence is needed for the decision.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-245.
- This is intentionally docs-only because expanding from four first-page cache
  entries to page-range variants increases cache cardinality and freshness risk.

## Source Review

- `src/lib/data/services/getCachedBlogListData.ts` currently owns seven fixed
  no-argument cached wrappers: three unfiltered default grouped list reads and
  four sorted first-page reads. All use the accepted 10-minute stale window.
- `BlogListLoader` now has a clear branch: sorted page 1 uses
  `getCachedSortedFirstPageBlogList(sortby)`, while sorted pages greater than
  1 call direct `getBlogList({ sortby, page, limit: 10 })`.
- `/blog` parses `sortby` and bounded finite `page` values before rendering the
  loader, and remains `dynamic = "force-dynamic"` with no route-level
  `revalidate` or `generateStaticParams()`.
- The public blog API parses bounded `page`/`limit` values but still calls the
  direct blog list service. This should remain true because browser
  continuous-loading requests depend on request-time list freshness.
- `BlogSectionLoader` and home/prototype blog sections still call direct
  `getBlogList()` with fixed small limits and should remain excluded from the
  sorted `/blog` page cache policy.
- Focused tests already guard the split:
  `getCachedBlogListData.test.ts`, `BlogListLoader.test.tsx`,
  `BlogPage.test.tsx`, `publicBlogListRoute.test.ts`,
  `BlogSectionContinuous.test.tsx`, `BlogSectionLoader.test.tsx`,
  `BlogListView.test.tsx`, and `publicRouteCachePolicy.test.ts`.

## Candidate Comparison

| Candidate | Impact | Implementation risk | Cache cardinality | Freshness constraints | Testability | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Cache no additional sorted pages and switch to another F-111/F-115 target | Low-medium. It avoids extra blog risk but leaves direct server reads for every sorted page-2-plus route render. | Low for blog runtime. | No new entries. | Best freshness, but no additional blog efficiency. | Existing provider/client-island tasks are separate from the blog list seams. | Reject for this sequence unless owner priorities move away from blog cache work. |
| Cache sorted pages 2-5 for all four sort modes with fixed bounded keys | Medium. It reduces direct server reads for the first few manually navigated sorted archive pages. | Medium. Fixed wrappers are straightforward, but `popular` beyond page 1 can reorder when comments change. | Bounded: 16 new entries for four sorts across pages 2-5, plus the four existing first-page entries. | Accepts 10-minute staleness for comment-derived `popular` ordering and counts across multiple pages, where page-boundary drift can duplicate or hide posts. | Strong with wrapper, loader, route-cache, and source-policy tests. | Wait. The `popular` freshness cost is not worth broadening yet. |
| Cache only less comment-sensitive sorted pages 2-5, leaving `popular` beyond page 1 direct | Medium. It covers `latest`, `oldest`, and `featured` archive browsing where ordering changes are owner-controlled rather than comment-driven. | Medium-low. The runtime change can keep the existing fixed-wrapper/dispatcher pattern and direct fallback. | Bounded: 12 new entries for three sorts across pages 2-5. Page 1 remains the T-245 policy, including existing cached `popular` page 1. | Uses the accepted 10-minute stale window for owner-controlled publication/featured ordering and server-rendered list card data. `popular` page 2+ stays request-time because comment mutations can change both ordering and page boundaries. | Strong. Tests can assert cached pages 2-5 for `latest`/`oldest`/`featured`, direct `popular` page 2, direct page 6, direct public API and home section behavior, and unchanged `/blog` route policy. | Select next. Create T-247. |
| Introduce a broader parameterized sorted page cache with a hard page cap and explicit key policy | Medium-high if the archive grows and repeated deep-page browsing matters. | Medium-high. It changes from fixed no-argument wrappers to an argumented cache policy and raises review burden around key normalization. | Bounded only if the dispatcher rejects values outside the cap before entering the cached function. | Same staleness issues as fixed wrappers, plus broader future temptation to raise the cap or add API callers. | Good, but more complex than the current proof style. | Reject for now. Prefer fixed wrappers until there is evidence that deep sorted pages are hot. |

## Recommendation

Expand sorted `/blog` caching beyond page 1 only for the less
comment-sensitive sort modes: `latest`, `oldest`, and `featured`, pages 2-5,
with fixed `limit: 10` and the existing 10-minute stale window. Create
[T-247 Pilot bounded sorted blog page cache proof](T-247-pilot-bounded-sorted-blog-page-cache-proof.md)
as the next runtime implementation slice.

The selected policy is:

- Allowed sort modes: `latest`, `oldest`, and `featured` for pages 2-5.
- Existing policy retained: page 1 remains cached for `latest`, `oldest`,
  `featured`, and `popular` from T-245.
- Excluded sorted route reads: `popular` pages greater than 1 and any sorted
  page greater than 5 remain direct `getBlogList()` reads.
- Stale window: 10 minutes, using
  `BLOG_DEFAULT_LIST_CACHE_REVALIDATE_SECONDS`.
- Cache key shape: fixed no-argument wrappers with keys that encode the
  bounded route shape, for example
  `public-blog-sorted-page-latest-2-limit-10`.
- Excluded callers: public blog API routes, `BlogSectionLoader`, home and
  prototype blog sections, browser continuous-loading requests, comments,
  comment mutations, admin/account routes, and user/session state.
- Route policy: `/blog` remains `dynamic = "force-dynamic"`; do not add
  route-level ISR, `generateStaticParams()`, cache tags, `revalidatePath()`, or
  `revalidateTag()`.

`popular` beyond page 1 should wait because comment mutations can change both
the sort order and page boundaries. The first-page `popular` cache remains an
accepted short-stale proof, but multiplying that risk across pages 2-5 creates
more visible duplicate/missing-post risk when readers navigate between cached
pages after comments change.

The broader parameterized cache should wait until there is evidence that sorted
pages past page 5 are hot enough to justify the extra key-policy complexity.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source files were changed.
- Created T-247 for the selected bounded implementation slice.
- Rejected caching `popular` pages beyond page 1 because comment-derived
  ordering and counts can drift across page boundaries during the stale window.
- Rejected a broader parameterized sorted-page cache because fixed keys keep
  the current proof easier to review, test, and cap.
- Verification passed: `git diff --check`.
