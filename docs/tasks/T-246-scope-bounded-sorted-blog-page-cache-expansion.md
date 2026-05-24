# T-246 Scope Bounded Sorted Blog Page Cache Expansion

Status: Planned

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
