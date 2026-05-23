# T-233 Pilot Blog Biography ISR Cache

Status: Planned

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Implement one approved public route-family caching/ISR proof after T-232 defines
the freshness policy.

## Context

- A-022 ranks controlled public caching/ISR as the largest remaining Next.js
  efficiency opportunity.
- T-232 must choose the first proof route and cache mechanism before this task
  starts.
- Blog or biography is the preferred first candidate because the data is
  MongoDB-backed, slug-shaped, and lower commerce risk than Shopify product
  availability.
- Current public route policy is intentionally conservative and guarded by
  tests.

## Scope

In scope:

- Apply only the route-family and cache mechanism accepted by T-232.
- Possible implementation shapes include route `revalidate`, a cached
  non-`fetch` data-service wrapper, a limited `generateStaticParams()` set, or a
  staged combination approved by T-232.
- Preserve accepted not-found/error behavior from T-199 through T-202.
- Keep account/admin routes dynamic.
- Update tests to prove the new policy and prevent accidental broad static/ISR
  drift.
- Record build output evidence showing the intended route behavior.

Out of scope:

- Do not cache Shopify product availability or search across all route families.
- Do not add cache tags or admin mutation invalidation unless T-232 explicitly
  selected that as part of the first proof.
- Do not split global providers or refactor unrelated client components.
- Do not change policy, privacy, or commerce behavior.

## Concurrency

Do not start until T-232 is complete. Run alone with any task touching the same
route family, shared data services, rendering architecture doc, or public cache
policy tests.

Owned files:

- The route-family files selected by T-232, likely under `src/app/blog/` or
  `src/app/biography/`
- The matching loaders/services under `src/components/loaders/` and
  `src/lib/data/services/`
- route-family tests selected by T-232
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/architecture/rendering-and-data-fetching.md`
- this task brief

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Exactly one approved public route family adopts explicit caching/ISR behavior.
- The runtime change matches T-232's freshness policy.
- Build output and focused tests prove the intended route behavior.
- Dynamic/session/account/admin surfaces remain unchanged.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts
npm run build
```

Add any route-family tests required by T-232 before running the build.

## Handoff Notes

- Finding: F-111.
- Risk: R-012.
- Depends on: T-232.
