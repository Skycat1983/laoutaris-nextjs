# T-240 Scope Blog Primary Data Cache Split

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Define the next safe F-111/R-012 blog cache implementation slice without making
runtime source changes.

## Context

- T-233 proved the biography cache pattern.
- T-238 proved the collections redirect/navigation cache pattern.
- T-239 made `/sitemap.xml` one-hour ISR freshness explicit in source.
- Blog remains a higher-risk cache target because `/blog` is query-driven and
  `/blog/[slug]` combines cacheable primary post data with optional comment
  rendering from `?comments=true`.
- Current source evidence:
  - `src/app/blog/page.tsx` is `force-dynamic` and parses `sortby`/`page`.
  - `BlogListLoader` calls `getBlogList()` once for sorted pages, but calls it
    three times for the default grouped page: featured, latest, and popular.
  - `src/app/blog/[slug]/page.tsx` is `force-dynamic`; `generateMetadata()`,
    `BlogPostStructuredData`, and `BlogDetailLoader` all read primary blog
    detail data through `getBlogBySlugWithAuthor()`.
  - `BlogDetailLoader` optionally calls `getBlogBySlugWithComments()` when
    comments are requested, and already degrades to the primary blog when
    comment loading fails.

## Scope

In scope:

- Compare candidate blog cache slices:
  - cached primary blog detail data for metadata, JSON-LD, and
    non-comments detail rendering
  - cached default grouped blog lists for the unfiltered `/blog` view
  - cached sorted blog list pages for `sortby`/`page` variants
  - separating optional comment reads from cacheable primary blog data
- Rank candidates by impact, implementation risk, freshness constraints,
  blast radius, and available focused tests.
- Recommend one next implementation slice and create or update the follow-up
  implementation task brief if the scope is clear.
- Record why other blog cache candidates should wait.
- Preserve the current public route policy until a runtime task is assigned:
  `/blog` and `/blog/[slug]` stay `force-dynamic`, no blog route-level
  `revalidate`, and no blog `generateStaticParams()`.
- Identify exact tests that should prove the selected implementation slice.

Out of scope:

- Do not add `unstable_cache`, route `revalidate`, cache tags,
  `revalidatePath`, `revalidateTag`, or `generateStaticParams()`.
- Do not change `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`,
  `BlogListLoader`, `BlogDetailLoader`, blog services, comments services, or
  metadata/JSON-LD runtime behavior.
- Do not cache comments, user/session state, public search, Shopify data,
  sitemap output, artwork data, or collection detail data.
- Do not move root providers, modal providers, session ownership, or client
  islands.

## Concurrency

Run after T-239. Do not run in parallel with blog route, blog loader, blog
service, blog metadata/JSON-LD, comments, route-cache policy, or provider
runtime edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally the selected follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if needed

Do not edit runtime source in this task.

## Acceptance Criteria

- Blog cache candidates are compared with concrete source/test/build evidence.
- The selected next blog implementation slice has explicit cache boundaries,
  freshness target, owned files, out-of-scope boundaries, acceptance criteria,
  and verification commands.
- The plan keeps optional comments dynamic and does not cache session/user
  state.
- The plan explains whether `/blog`, `/blog/[slug]`, or neither should receive
  route-level `revalidate` in the selected first implementation slice.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source searches and focused file reads for:

- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/components/loaders/viewLoaders/BlogListLoader.tsx`
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
- `src/components/metadata/PublicDetailJsonLd.tsx`
- `src/lib/data/services/getBlogList.ts`
- `src/lib/data/services/getBlogBySlugWithAuthor.ts`
- `src/lib/data/services/getBlogBySlugWithComments.ts`
- existing blog loader, metadata, structured-data, route-cache, and browsing
  client tests

Run `npm run build` only if the scoping pass needs fresh route-size evidence.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-239.
- This is a planning task because blog cache boundaries cross primary content,
  query pagination/sorting, metadata/JSON-LD, and optional comments.

## Source And Test Evidence

- `src/app/blog/page.tsx` remains `dynamic = "force-dynamic"` and derives
  `sortby`/`page` from query params before rendering `BlogListLoader`.
- `BlogListLoader` makes one `getBlogList()` call for sorted pages, but the
  default unfiltered `/blog` view makes three parallel `getBlogList()` calls
  for featured, latest, and popular groups.
- `src/app/blog/[slug]/page.tsx` remains `dynamic = "force-dynamic"`.
  `generateMetadata()` reads primary detail data with
  `getBlogBySlugWithAuthor()`, and the page renders
  `BlogPostStructuredData` plus `BlogDetailLoader`.
- `BlogPostStructuredData` and `BlogPostJsonLd` both read primary blog detail
  data with `getBlogBySlugWithAuthor()`.
- `BlogDetailLoader` reads `getBlogBySlugWithAuthor()` first for every detail
  request, calls `getBlogBySlugWithComments()` only when
  `showComments === true`, and already falls back to the primary blog when
  comment loading fails.
- `getBlogBySlugWithAuthor()` owns DB connection setup, author population, and
  public transformation. Its public transform includes `commentCount`, so the
  first primary-detail cache slice must explicitly accept a short stale window
  for the server-rendered comment count while keeping populated comments
  dynamic.
- Existing focused tests cover the relevant seams:
  `BlogDetailLoader.test.tsx`, `BlogListLoader.test.tsx`,
  `getBlogBySlugWithAuthor.test.ts`, `getBlogBySlugWithComments.test.ts`,
  `getBlogList.test.ts`, `publicDetailMetadataStructuredData.test.tsx`,
  `publicBreadcrumbStructuredData.test.tsx`, and
  `publicRouteCachePolicy.test.ts`.

## Candidate Comparison

| Candidate | Impact | Risk / blast radius | Testability | Decision |
| --- | --- | --- | --- | --- |
| Cached primary blog detail data for metadata, JSON-LD, and non-comments detail rendering | High. The same slug can be read through metadata, structured data, and visible detail rendering, and the comments-mode path can still reuse the primary fallback when comments fail. | Medium-low if implemented as a route-local cached service wrapper. The main caveat is the existing `commentCount` field, which should share the short primary-data stale window while populated comments stay dynamic. | Strong. Existing metadata, structured-data, loader, service, and route-cache policy suites cover the behavior, and a new cached-wrapper test can mirror the biography proof. | Select next. Create T-241. |
| Cached default grouped blog lists for unfiltered `/blog` | Medium-high. The default page currently performs three list reads for featured/latest/popular. | Medium. The grouped page combines three independent list freshness windows and includes `commentCount`/popularity ordering, so stale comment counts can affect both labels and ordering. | Good, but needs list-specific cache keys and route/query policy tests. | Wait until primary detail cache lands. |
| Cached sorted blog list pages for `sortby`/`page` variants | Medium. Sorted pages make one list read, and popular/latest/featured variants are public archive content. | Medium-high. Query variants increase cache cardinality, page bounds and popularity ordering depend on mutable comments, and `/blog` should remain route-dynamic. | Good after a dedicated list cache boundary is designed. | Wait. |
| Separating optional comment reads from cacheable primary blog data | High as a boundary requirement. Source already separates `getBlogBySlugWithComments()` behind `showComments`, but primary detail still carries `commentCount`. | Low if treated as an invariant for the selected primary-detail slice; higher if it tries to redesign comment count, mutations, or client comment loading. | Strong in `BlogDetailLoader.test.tsx` and public comment route/client tests. | Include as a hard boundary in T-241, not a standalone slice. |

## Recommendation

Create T-241 as the next runtime task:
[Pilot blog primary detail cache proof](T-241-pilot-blog-primary-detail-cache-proof.md).

The first implementation slice should cache only primary blog detail reads used
by `/blog/[slug]` metadata, JSON-LD, and non-comments detail rendering. It
should use the same 10-minute stale window as the biography and collections
proofs, keep `/blog` and `/blog/[slug]` explicitly dynamic, and add no route
`revalidate`, `generateStaticParams()`, cache tags, `revalidatePath()`, or
`revalidateTag()`.

Neither `/blog` nor `/blog/[slug]` should receive route-level `revalidate` in
this first blog slice. `/blog` is query-driven, and `/blog/[slug]` uses
`?comments=true` to opt into dynamic populated comment rendering. A cached
non-`fetch` primary service wrapper gives the repeated primary-data benefit
without making the route output itself ISR-owned or freezing comment-mode
behavior.

## Completion Notes

- Completed 2026-05-24 as a docs-only scoping task.
- No runtime source files were changed.
- Created T-241 for the selected implementation slice.
- Verification passed: `git diff --check`; untracked task briefs were checked
  for trailing whitespace.
- Orchestrator verification repeated `git diff --check` on 2026-05-24; it
  passed.
- Default grouped blog lists, sorted list pages, route-level blog ISR, blog
  generated params, cache tags, and comment caching remain separate future
  scopes.
