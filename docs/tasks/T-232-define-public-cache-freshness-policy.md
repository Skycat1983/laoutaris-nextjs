# T-232 Define Public Cache Freshness Policy

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Define the accepted freshness policy for mutable public Next.js surfaces before
any runtime ISR, `generateStaticParams()`, or cached service wrapper changes.

## Context

- A-022 found the largest Next.js efficiency saving is controlled public
  caching/ISR, but the app intentionally keeps public route behavior
  conservative today.
- `sitemap.ts`, `/biography`, and `/collections` currently prerender while
  reading mutable MongoDB/Shopify-backed data, so freshness is deploy-bound by
  implication rather than documented policy.
- `publicRouteCachePolicy` currently enforces no public `revalidate` and
  deferred `generateStaticParams()`.
- T-233 depends on this policy before making one runtime cache/ISR proof route.

## Scope

In scope:

- Update `docs/architecture/rendering-and-data-fetching.md` with a route-family
  freshness matrix covering sitemap, default biography redirect, default
  collections redirect, blog list/detail, biography article list/detail,
  artwork browse/detail, search, shop listing/detail, and session-aware UI.
- Choose the first runtime proof route family for T-233, preferably blog or
  biography unless the evidence points elsewhere.
- State whether the proof should use route `revalidate`, cached non-`fetch`
  service wrappers, `generateStaticParams()`, or a staged subset.
- State what remains intentionally dynamic and why.
- Update source-invariant tests only as needed to align with the documented
  policy, without changing runtime route behavior.

Out of scope:

- Do not change route `dynamic`, `revalidate`, or `generateStaticParams()`
  exports in runtime source.
- Do not add `unstable_cache`, cache tags, `revalidatePath`, or
  `revalidateTag` in this task.
- Do not change Shopify product availability, checkout, admin mutation, or
  account/session behavior.

## Concurrency

Run after T-230 and T-231 unless the orchestrator explicitly decides this
docs-only task can proceed independently. Do not run in parallel with any task
editing the rendering architecture doc or public route cache tests.

Owned files:

- `docs/architecture/rendering-and-data-fetching.md`
- `__tests__/unit/publicRouteCachePolicy.test.ts` only if policy assertions need
  to distinguish "current runtime" from "approved next proof"
- `__tests__/unit/deployment/publicDynamicSitemap.test.ts`
- `__tests__/unit/deployment/publicMetadataDiscovery.test.ts`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Public freshness policy is explicit enough for a runtime implementation agent
  to know which route can change first and which surfaces must remain dynamic or
  deploy-bound.
- Sitemap/default redirect behavior is no longer implicit.
- T-233 has a clear first-route scope, cache mechanism, fallback behavior, and
  verification plan.
- Runtime source behavior is unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts
git diff --check
```

## Handoff Notes

- Findings: F-111 and F-114.
- Risk: R-012.
- Completed 2026-05-23: `docs/architecture/rendering-and-data-fetching.md`
  now has an accepted public freshness matrix for sitemap, default biography
  redirect, default collections redirect, blog list/detail, biography article
  list/detail, artwork browse/detail, search, shop listing/detail, and
  session-aware UI.
- Current runtime remains unchanged: public route `revalidate`,
  `generateStaticParams()`, and segment config source were not edited.
- T-233 first proof route is biography. It should start with cached
  non-`fetch` service wrappers for biography article detail and biography
  navigation, target a short 10-minute stale window, and avoid
  `generateStaticParams()` in the first proof. Route-level `revalidate` should
  be limited to the `/biography` default redirect only if that subset is
  included and verified.
- Sitemap, `/biography`, and `/collections` deploy-bound behavior is now
  explicit for current runtime; later runtime tasks may move sitemap to
  approximately 1-hour ISR and default redirects to approximately 10-minute ISR
  after the biography proof.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/deployment/publicDynamicSitemap.test.ts __tests__/unit/deployment/publicMetadataDiscovery.test.ts`
  and `git diff --check`.
- Next task after this is accepted: T-233 runtime proof route.
