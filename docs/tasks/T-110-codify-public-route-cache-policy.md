# T-110 Codify Public Route Cache Policy

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make public route rendering and cache ownership explicit after T-102 by
documenting the route-local policy, adding conservative route segment
configuration where appropriate, and pinning the policy with focused source
tests.

## Context

- F-084 and R-012 remain partially mitigated: T-102 removed global root-layout
  DB/session work and public middleware token parsing, but many public routes
  are still dynamic for route-local reasons.
- T-102 build output recorded dynamic public routes including `/`, `/artwork`,
  `/artwork/[artworkId]`, `/biography/[slug]`, `/blog`, `/blog/[slug]`,
  `/collections/[slug]`, `/collections/[slug]/[artworkId]`,
  `/project/contact`, `/search`, `/shop/products`, and
  `/shop/products/[productHandle]`.
- Remaining blockers include route-local search params, MongoDB/Shopify
  loaders, and session-aware UI such as subscription or saved-item state.
- This task should not promise static rendering for content that depends on
  session state, query params, or owner-controlled data freshness until an
  explicit policy exists.

## Scope

- In scope:
  - Create or update durable rendering/cache documentation with a public route
    matrix covering stable static shells, query-driven routes, DB-backed
    content/detail routes, Shopify-backed routes, and session-aware routes.
  - For touched public route files, add conservative explicit route segment
    config only where the current behavior is intentional and low-risk, such as
    `dynamic = "force-dynamic"` for session-aware or query-driven pages that
    must not be silently treated as static.
  - Identify any obvious safe ISR candidates in docs, but only add
    `revalidate` or static generation when existing data freshness, build-time
    DB access, and route params make the change clearly safe.
  - Preserve current route output, metadata, JSON-LD, search params, user
    session behavior, Shopify data behavior, and build route list unless a
    documented explicit segment config intentionally changes it.
  - Add focused tests or source invariants for the public route cache policy
    and any segment configs added by this slice.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Broad static/ISR migration for all public routes.
  - Adding `generateStaticParams()` for content collections.
  - Rewriting MongoDB, Shopify, or session-aware loader behavior.
  - Artwork-to-shop SSR discovery from F-090.
  - Metadata/JSON-LD, sitemap expansion, image delivery, landmark/heading, or
    accessibility control changes.
  - Account/admin route cache policy.

## Files Likely Touched

- `docs/architecture/rendering-and-data-fetching.md`
- `src/app/page.tsx`
- `src/app/artwork/page.tsx`
- `src/app/artwork/[artworkId]/page.tsx`
- `src/app/biography/[slug]/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/collections/[slug]/page.tsx`
- `src/app/collections/[slug]/[artworkId]/page.tsx`
- `src/app/project/contact/page.tsx`
- `src/app/search/page.tsx`
- `src/app/shop/products/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-110-codify-public-route-cache-policy.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- A durable public route rendering/cache matrix exists and distinguishes static
  shell routes, query-driven routes, DB-backed routes, Shopify-backed routes,
  and session-aware routes.
- Any route segment config added by the task is conservative, explicit, and
  backed by the documented matrix.
- Current public behavior is preserved: search/filter params, saved-item or
  subscription session state, metadata/JSON-LD, and Shopify/product rendering
  are not changed by accident.
- Focused tests or source invariants cover the route cache policy and touched
  route segment configs.
- Build output is recorded in the handoff so remaining dynamic routes are
  visible.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts
npm run lint
npm run build
git diff --check
```

Completed verification:

- `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts`
  passed.
- `npm run lint` passed.
- `npm run build` passed.
- `git diff --check` passed.

Build output after this slice:

- Static public routes remain `/biography`, `/collections`, `/project`,
  `/project/about`, `/project/aims`, `/project/film`, and `/shop`.
- Dynamic public routes remain `/`, `/artwork`, `/artwork/[artworkId]`,
  `/biography/[slug]`, `/blog`, `/blog/[slug]`, `/collections/[slug]`,
  `/collections/[slug]/[artworkId]`, `/project/contact`, `/search`,
  `/shop/products`, and `/shop/products/[productHandle]`.
- The dynamic public routes now own explicit
  `dynamic = "force-dynamic"` route segment config. No public route was moved
  to `revalidate` or `generateStaticParams()`.

## Handoff Notes

- Prepared after T-109 completed public landmark/heading cleanup.
- Keep artwork-to-shop SSR discovery, richer metadata/discovery work,
  Cloudinary delivery-transform centralization, account/admin cache policy,
  and broad static/ISR migrations separate.
- Completed on 2026-05-18 by adding the public route rendering/cache matrix to
  `docs/architecture/rendering-and-data-fetching.md`, adding conservative
  `force-dynamic` segment config to the public routes already dynamic after
  T-102, and adding `__tests__/unit/publicRouteCachePolicy.test.ts` source
  invariants for the matrix, route configs, and deferred ISR/static params
  policy.
