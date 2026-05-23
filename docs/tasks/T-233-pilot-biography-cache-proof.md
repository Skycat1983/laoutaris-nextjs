# T-233 Pilot Biography Cache Proof

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement the approved public biography cache proof from T-232 without changing
unrelated public route families.

## Context

- A-022 ranks controlled public caching/ISR as the largest remaining Next.js
  efficiency opportunity.
- T-232 chose biography as the first proof route family.
- The accepted first mechanism is cached non-`fetch` service wrappers for
  biography article detail and biography navigation, targeting a 10-minute
  stale window.
- T-232 explicitly says not to add `generateStaticParams()` in this first proof.
- Route-level `revalidate` should be limited to `/biography` default redirect
  only if that subset is included and verified.
- Current public route policy is intentionally conservative and guarded by
  tests.

## Scope

In scope:

- Add narrow cached non-`fetch` service wrappers for biography article detail
  and biography article navigation. Prefer wrapping the existing
  `getArticleBySlugPopulated(slug)` and `getArticleNavigationList("biography")`
  service paths rather than rewriting their DB/transform logic.
- Target a 10-minute stale window for the cached biography service reads.
- Use the cached wrappers from biography route/loader call sites where the
  T-232 policy applies, including `/biography/[slug]`, `ArticleLoader` for the
  biography section, biography navigation loaders, and the `/biography` default
  redirect if included.
- Keep route-level `revalidate` limited to `/biography` only if the redirect
  page remains correct under build output and focused tests.
- Update the public cache policy test so it permits only the accepted biography
  proof and keeps other public route families under their current dynamic/no
  static-params policy.
- Preserve accepted not-found/error behavior from T-199 through T-202.
- Keep account/admin routes dynamic.
- Update tests to prove the new policy and prevent accidental broad static/ISR
  drift.
- Record build output evidence showing the intended route behavior.

Out of scope:

- Do not cache Shopify product availability or search across all route families.
- Do not add cache tags or admin mutation invalidation in this task.
- Do not add `generateStaticParams()`.
- Do not add route-level `revalidate` to `/biography/[slug]`, blog, artwork,
  search, shop, account, or admin routes.
- Do not split global providers or refactor unrelated client components.
- Do not change policy, privacy, or commerce behavior.

## Concurrency

Do not start until T-232 is complete. Run alone with any task touching the same
route family, shared data services, rendering architecture doc, or public cache
policy tests.

Owned files:

- `src/app/biography/page.tsx`
- `src/app/biography/[slug]/page.tsx`
- `src/components/loaders/viewLoaders/ArticleLoader.tsx`
- `src/components/loaders/componentLoaders/BiographySubnavLoader.tsx`
- `src/components/loaders/componentLoaders/MainNavLoader.tsx` only for the
  biography navigation read
- `src/lib/data/services/getArticleBySlugPopulated.ts`
- `src/lib/data/services/getArticleNavigationList.ts`
- new narrow cached service wrapper module(s), if used
- route-family tests selected by T-232
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Exactly the biography route family adopts the approved cached service-wrapper
  behavior.
- The runtime change matches T-232's freshness policy.
- Build output and focused tests prove the intended route behavior.
- Dynamic/session/account/admin surfaces remain unchanged.
- No public route gains `generateStaticParams()` in this proof.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/data/getArticleBySlugPopulated.test.ts __tests__/unit/data/getArticleNavigationList.test.ts __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/loaders/BiographySubnavLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/pages/BiographyPage.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx
npm run build
```

Add narrower cache-wrapper tests if the implementation introduces a new module
that is not covered by the listed suites.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-232.
- T-232 accepted biography as the first proof, with cached non-`fetch` service
  wrappers, a 10-minute stale window, no `generateStaticParams()`, and optional
  route-level `revalidate` only for `/biography` default redirect if included
  and verified.
- Completed 2026-05-23: added
  `src/lib/data/services/getCachedBiographyArticleData.ts` with cached wrappers
  around `getArticleBySlugPopulated(slug)` and
  `getArticleNavigationList("biography")`, using
  `BIOGRAPHY_CACHE_REVALIDATE_SECONDS = 600`.
- `/biography` now exports `revalidate = BIOGRAPHY_CACHE_REVALIDATE_SECONDS`
  and reads the cached biography navigation wrapper for the default redirect.
- `/biography/[slug]` remains `dynamic = "force-dynamic"` and does not define
  `generateStaticParams()`, but its metadata, JSON-LD, and biography
  `ArticleLoader` detail reads now use the cached biography detail wrapper.
- `BiographySubnavLoader` and biography `ArticleLoader` previous/next
  navigation use the cached biography navigation wrapper. `MainNavLoader`
  intentionally remains on the direct article navigation service because it is
  rendered from the root header; build verification showed that using the
  cached wrapper there made unrelated static shells inherit the 600-second
  prerender window.
- Build output evidence: `npm run build` passed. The route table kept
  `/biography` as prerendered static content and `/biography/[slug]` as dynamic.
  `.next/prerender-manifest.json` recorded `/biography`
  `initialRevalidateSeconds: 600`, while `/collections`, `/project`,
  `/project/about`, `/project/aims`, `/project/film`, `/shop`, `/privacy`, and
  `/terms` remained `false`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/data/getCachedBiographyArticleData.test.ts __tests__/unit/data/getArticleBySlugPopulated.test.ts __tests__/unit/data/getArticleNavigationList.test.ts __tests__/unit/loaders/ArticleLoader.test.tsx __tests__/unit/loaders/BiographySubnavLoader.test.tsx __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/pages/BiographyPage.test.tsx __tests__/unit/deployment/publicDetailMetadataStructuredData.test.tsx __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx __tests__/unit/deployment/publicArtworkProductMetadataStructuredData.test.tsx`
  and `npm run build`.
