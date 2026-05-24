# T-243 Scope Sorted Blog List Cache And Query Hygiene

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide the next safe F-111/R-012 blog efficiency slice after T-241 and T-242 by
scoping whether sorted `/blog?sortby=...&page=...` list caching is ready, or
whether query canonicalization/page bounds must land first.

## Context

- T-241 cached primary blog detail reads while keeping comments and blog routes
  dynamic.
- T-242 cached only the unfiltered `/blog` default grouped featured/latest/
  popular reads with fixed no-argument wrappers.
- Sorted blog list pages remain direct `getBlogList({ sortby, page, limit:
  10 })` reads.
- `src/app/blog/page.tsx` accepts only known `sortby` values, but its `page`
  parsing should be reviewed before any parameterized sorted-list cache is
  introduced. A broad cache over arbitrary page input could create avoidable
  cache cardinality and freshness risk.
- Popular sorting and list DTOs include comment-derived state, so any sorted
  cache proposal must explicitly accept or avoid stale popularity/comment-count
  behavior.

## Scope

In scope:

- Review source and tests for:
  - `src/app/blog/page.tsx`
  - `src/components/loaders/viewLoaders/BlogListLoader.tsx`
  - `src/lib/data/services/getBlogList.ts`
  - `src/lib/data/services/getCachedBlogListData.ts`
  - public blog API and home `BlogSectionLoader` behavior
  - blog list, browse/query, and route-cache policy tests
- Compare at least these next candidates:
  - cache no sorted pages yet; first normalize/canonicalize blog page query
    parsing and bounds
  - cache only a small fixed set of sorted first pages
  - cache bounded sorted page variants with explicit page cardinality policy
  - stop blog caching and return to provider/client-island or other F-111/F-115
    options
- Rank candidates by impact, implementation risk, cache cardinality,
  freshness constraints, blast radius, and testability.
- Recommend one next implementation slice and create the follow-up task brief if
  the scope is clear.
- Record why rejected candidates should wait.

Out of scope:

- Do not make runtime source changes.
- Do not add `unstable_cache`, route-level blog ISR, `generateStaticParams()`,
  cache tags, `revalidatePath()`, `revalidateTag()`, provider moves, or query
  parser changes in this task.
- Do not cache comments, public blog APIs, home blog sections, search, Shopify
  data, artwork data, admin/account routes, or user/session state.

## Concurrency

Run after T-242. Do not run in parallel with blog route, blog loader, blog list
service, public blog API, comments, route-cache policy, provider, or admin blog
runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally the selected follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if needed

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass states whether sorted blog list caching is safe now or
  requires a prerequisite query canonicalization/page-bound task.
- Any selected sorted-list cache plan defines allowed sort values, page
  cardinality, stale window, cache key shape, and excluded callers.
- The plan keeps `/blog` route output dynamic and does not add route-level ISR,
  generated params, cache tags, or mutation revalidation.
- The plan keeps public blog APIs, `BlogSectionLoader`, comments, and
  comment mutations direct/dynamic.
- A follow-up implementation task is created only if the boundary is clear.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source/test reads and `rg` searches for blog list route parsing,
sorted list calls, cached blog list wrappers, public blog API callers, and
route-cache policy coverage. Run `npm run build` only if fresh route evidence
is needed for the decision.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-242.
- This is intentionally docs-only because sorted list caching has more cache
  cardinality and freshness risk than the fixed default grouped list proof.

## Source And Test Evidence

- `src/app/blog/page.tsx` keeps `/blog` explicitly dynamic and allowlists
  `sortby` to `latest`, `oldest`, `popular`, or `featured` before rendering
  `BlogListLoader`.
- The same page parses `page` with `Math.max(1, parseInt(..., 10))`.
  Negative page values normalize to `1`, but non-numeric values become `NaN`
  and can be passed through to `BlogListLoader`.
- `BlogListLoader` now has a clear cache split: sorted
  `/blog?sortby=...&page=...` rendering calls direct
  `getBlogList({ sortby, page, limit: 10 })`, while only the unfiltered
  grouped default view calls the fixed cached featured/latest/popular wrappers.
- `getBlogList()` assumes trusted numeric `page` and `limit` values. It applies
  them directly to MongoDB `skip()` and `limit()` and returns the same values in
  pagination metadata.
- `src/app/api/v2/public/blog/route.ts` validates `sortby`, but parses `page`
  and `limit` directly from query params without finite-number checks, minimums,
  or maximums. Public API callers and the blog continuous-loading client should
  remain direct/dynamic, but the route still needs query bounds before broader
  list-cache work is safe.
- `BlogSectionLoader` and home/prototype blog loaders still call direct
  `getBlogList()` with fixed small limits and should remain excluded from the
  sorted-list cache work.
- Current tests guard the existing split:
  `BlogListLoader.test.tsx` expects sorted pages to call direct `getBlogList()`
  and the default grouped view to call the fixed cached wrappers;
  `getCachedBlogListData.test.ts` guards the three fixed default cache keys;
  `publicBlogListRoute.test.ts` covers sort validation and direct API service
  calls; `publicRouteCachePolicy.test.ts` keeps `/blog` dynamic and keeps the
  public blog API plus `BlogSectionLoader` off the default cached wrappers.

## Candidate Comparison

| Candidate | Impact | Implementation risk | Cache cardinality / freshness | Testability | Decision |
| --- | --- | --- | --- | --- | --- |
| Cache no sorted pages yet; first normalize/canonicalize blog page query parsing and bounds | Medium. It does not reduce reads immediately, but it removes the unsafe input shape that would make future sorted cache keys unbounded or invalid. | Low-medium. It touches query parsing and tests, but no cache, route ISR, or service semantics need to change. | Best. It prevents `NaN`, non-canonical, and oversized page/limit inputs from becoming future cache variants. | Strong. Page parser, public API route, loader, continuous-loading, and route-cache policy tests can prove the boundary. | Select next. Create T-244. |
| Cache only a small fixed set of sorted first pages | Medium. It would reduce first-page sorted archive reads for common navigation links. | Medium. It is safer than broad parameter caching, but still needs canonical route inputs first so `page=abc`, `page=1foo`, and duplicate query shapes do not drift around the cached path. | Small if limited to page 1, limit 10, and known sort values. Popular sorting would accept a 10-minute stale popularity/comment-count window. | Good after query hygiene lands. | Wait until T-244. |
| Cache bounded sorted page variants with explicit page cardinality policy | Medium-high for repeated archive browsing. | Medium-high. It needs a hard maximum page count, cache-key constants, and explicit stale behavior for popularity ordering. | Bounded only if the parser clamps to an approved max page. A candidate later policy could be `sortby` in `latest`/`oldest`/`featured`/`popular`, `page` 1-5, `limit` 10, 10-minute stale window, cache key `public-blog-sorted-list:{sortby}:page:{page}:limit:10`. | Good, but requires more route/API/parser coverage than the first sorted cache slice. | Wait. |
| Stop blog caching and return to provider/client-island or other F-111/F-115 options | Low for the immediate blog list read path. | Low for blog runtime because no cache changes occur, but it leaves known query-hygiene debt in place. | No new cache cardinality risk, but no progress on sorted blog list efficiency. | Existing provider/client-island coverage is separate from the blog list seams. | Reject for this sequence. |

## Recommendation

Sorted blog list caching is not safe as the next runtime change. T-244 should
first normalize the public blog list query boundary without adding any cache:
[Normalize public blog list query parsing and bounds](T-244-normalize-public-blog-list-query-parsing-and-bounds.md).

The later sorted-list cache plan should only be reconsidered after T-244 proves
canonical finite values. The first cacheable sorted-list shape should be
conservative: known sort values only, `limit` fixed at `10` for `/blog`, a
small bounded page range before broad pagination caching, a 10-minute stale
window, and explicit cache keys that include `sortby`, `page`, and `limit`.
Public blog API routes, `BlogSectionLoader`, home/prototype blog sections,
comments, comment mutations, search, admin routes, route-level blog ISR,
generated params, cache tags, `revalidatePath()`, and `revalidateTag()` should
remain excluded.

Popular sorted pages should not be cached until the implementation task accepts
the same stale popularity/comment-count behavior already accepted for the
default grouped popular cards, or explicitly leaves `popular` direct while
caching less comment-sensitive sort modes.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source files were changed.
- Created T-244 for the selected prerequisite query-hygiene implementation
  slice.
- Rejected immediate sorted-list caching because current page parsing can pass
  `NaN`, public API `page`/`limit` inputs are unbounded, and a parameterized
  cache should not be introduced before canonical finite query values exist.
- Verification passed: `git diff --check`.
- Orchestrator verification repeated `git diff --check` on 2026-05-24; it
  passed.
