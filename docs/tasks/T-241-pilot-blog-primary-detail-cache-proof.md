# T-241 Pilot Blog Primary Detail Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the first narrow F-111/R-012 blog cache proof by caching primary blog
detail reads for `/blog/[slug]` metadata, JSON-LD, and non-comments detail
rendering while keeping comments, query-driven blog lists, and route-level blog
rendering dynamic.

## Context

- T-233 proved the 10-minute cached primary-detail pattern for biography.
- T-238 proved the same stale window for route-local collection navigation.
- T-239 made `/sitemap.xml` one-hour ISR freshness source-owned.
- T-240 selected primary blog detail data as the safest first blog cache slice.
- Current source reads primary blog detail data through
  `getBlogBySlugWithAuthor()` from `generateMetadata()`,
  `BlogPostStructuredData`, and `BlogDetailLoader`.
- `BlogDetailLoader` already calls `getBlogBySlugWithComments()` only when
  `showComments` is true and already falls back to primary blog data when
  comments are unavailable.

## Scope

In scope:

- Add a narrow cached non-`fetch` service wrapper for primary blog detail reads,
  wrapping the existing `getBlogBySlugWithAuthor(slug)` service path.
- Use a 10-minute stale window matching the biography and collections proof
  unless the rendering architecture is updated first with a different accepted
  value.
- Use the cached primary blog wrapper from:
  - `src/app/blog/[slug]/page.tsx` `generateMetadata()`
  - blog JSON-LD/structured-data helpers in
    `src/components/metadata/PublicDetailJsonLd.tsx`
  - `BlogDetailLoader` for the primary detail read and comments-failure
    fallback
- Preserve `BlogDetailLoader` comment behavior: when `showComments` is true,
  populated comments still come from the direct
  `getBlogBySlugWithComments(slug)` service, and failures still degrade to the
  primary blog.
- Keep the server-rendered primary `commentCount` on the same short stale
  window as the primary blog DTO unless a separate accepted comment-count split
  task is created.
- Update focused tests and rendering architecture notes to record the blog
  primary-detail proof.

Out of scope:

- Do not cache `getBlogBySlugWithComments()`, populated comments, user/session
  state, comment mutations, or client follow-up comment loads.
- Do not cache `/blog` list data, default grouped blog lists, sorted blog list
  pages, public search, sitemap output, Shopify data, artwork data, collection
  detail data, or admin/account data.
- Do not add route-level `revalidate` to `/blog` or `/blog/[slug]`.
- Do not add `generateStaticParams()` for blog slugs.
- Do not add cache tags, `revalidatePath()`, or `revalidateTag()` for blog
  mutations in this first proof.
- Do not change public API route behavior for
  `GET /api/v2/public/blog/[slug]` or
  `GET /api/v2/public/blog/[slug]/comments`.
- Do not move root providers, modal providers, session ownership, or client
  islands.

## Concurrency

Run after T-240. Do not run in parallel with blog route, blog loader, blog
service, blog metadata/JSON-LD, comments, route-cache policy, provider, or
admin comment-mutation runtime edits.

Owned files:

- `src/app/blog/[slug]/page.tsx`
- `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`
- `src/components/metadata/PublicDetailJsonLd.tsx`
- new narrow cached blog primary-detail service wrapper module(s), if used
- `__tests__/unit/data/getCachedBlogPrimaryData.test.ts`, if a new wrapper
  module is added
- `__tests__/unit/loaders/BlogDetailLoader.test.tsx`
- `__tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx`
- `__tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Primary blog detail reads for metadata, JSON-LD, and non-comments detail
  rendering use the cached primary blog wrapper.
- The cached wrapper delegates to `getBlogBySlugWithAuthor(slug)`, uses a
  10-minute stale window, and does not call the comments service.
- `/blog` and `/blog/[slug]` remain `dynamic = "force-dynamic"`, define no
  route-level `revalidate`, and define no `generateStaticParams()`.
- `?comments=true` rendering still calls `getBlogBySlugWithComments(slug)` for
  populated comments, and comment-read failures still render the primary blog.
- Public blog API routes continue to use direct services and keep current
  response behavior.
- Focused tests guard the cached wrapper, metadata/JSON-LD use, loader
  comments split, and route-cache policy.
- Build output, if run, does not show blog routes adopting route-level ISR.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/loaders/BlogDetailLoader.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
git diff --check
```

Add and include a focused cached-wrapper test if the implementation creates a
new module, for example:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogPrimaryData.test.ts
```

Run `npm run build` only if the implementation changes route segment config,
public route cache-policy expectations, or needs fresh route-output evidence.

Result 2026-05-24:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogPrimaryData.test.ts __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/loaders/BlogDetailLoader.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
```

Passed: 5 suites, 30 tests. Jest emitted the existing Node `punycode`
deprecation warnings.

```bash
git diff --check
```

Passed.

```bash
npm run build
```

Passed. Build output kept `/blog` and `/blog/[slug]` as dynamic (`ƒ`) routes.

Orchestrator verification repeated on 2026-05-24:

```bash
npm test -- --runTestsByPath __tests__/unit/data/getCachedBlogPrimaryData.test.ts __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/loaders/BlogDetailLoader.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx
npm run build
git diff --check
```

Passed: 6 Jest suites, 38 tests; build kept `/blog` and `/blog/[slug]`
dynamic. Jest emitted the existing Node `punycode` deprecation warnings.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-240.
- Selected by T-240 as the safest first blog cache slice because it reduces
  repeated primary detail reads without caching comments, query variants, or
  route output.
- Completed by T-241 with `getCachedBlogPrimaryData.ts`, a 10-minute cached
  primary blog detail wrapper used by `/blog/[slug]` metadata, blog JSON-LD,
  and `BlogDetailLoader` primary detail reads.
- `/blog` and `/blog/[slug]` remain explicitly dynamic with no route-level
  `revalidate` and no `generateStaticParams()`. Comment-mode rendering and
  public blog API routes remain on direct services.
