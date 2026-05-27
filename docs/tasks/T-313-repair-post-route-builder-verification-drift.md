# T-313 Repair Post Route Builder Verification Drift

Status: Completed

Workstreams:

- [Testing And Quality](../workstreams/testing-and-quality.md)
- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Restore the explicit typecheck and full Jest gate after the T-307 through T-312
route-builder wave and T-310 Sentry baseline.

## Context

T-310 focused verification passed, but broader verification found two
route-builder-era test drifts:

- `npm run typecheck` fails on untracked
  `__tests__/unit/components/PublicRouteBuilderConsumers.test.tsx:41` fixture
  typing.
- Full `npm test` fails on
  `__tests__/unit/publicRouteCachePolicy.test.ts:147` because
  `MainNavLoader` now uses `publicAppRoutes` rather than the older
  `BIOGRAPHY_PATH`/`COLLECTIONS_PATH` constants expected by the source-hygiene
  assertion.

## Scope

In scope:

- Inspect the failing assertions before editing.
- Repair the `PublicRouteBuilderConsumers` fixture typing without weakening the
  encoded-route and consumer-wiring assertions.
- Update `publicRouteCachePolicy.test.ts` so it preserves the intended
  invariant: `MainNavLoader` must stay static-safe, use route-root links, and
  avoid dynamic biography/collection navigation reads.
- Keep changes test-focused unless inspection proves a real runtime route bug.
- Record exact verification in this task brief.

Out of scope:

- Do not change runtime route destinations, cache policy, route segment config,
  Sentry behavior, package files, middleware, auth behavior, API fetchers,
  Shopify dashboard data, checkout/cart, or Vercel settings.
- Do not remove the public route cache policy invariant. Update it to match the
  current route-builder ownership instead.

## Concurrency

Do not run in parallel with another task editing
`PublicRouteBuilderConsumers.test.tsx`, `publicRouteCachePolicy.test.ts`,
`MainNavLoader`, or public route-builder tests.

## Files Likely Touched

- `__tests__/unit/components/PublicRouteBuilderConsumers.test.tsx`
- `__tests__/unit/publicRouteCachePolicy.test.ts`
- `docs/tasks/T-313-repair-post-route-builder-verification-drift.md`

## Acceptance Criteria

- `PublicRouteBuilderConsumers` remains typed without masking invalid route
  fixture shape.
- `publicRouteCachePolicy` still proves `MainNavLoader` is static-safe and not
  coupled to dynamic biography/collection navigation services.
- No runtime behavior changes are made unless a real bug is identified and
  documented in the handoff.
- Explicit typecheck and full Jest are green again.

## Verification

```bash
npm run typecheck # passed
npm test -- --runTestsByPath __tests__/unit/components/PublicRouteBuilderConsumers.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts # passed, 2 suites / 14 tests
npm test # passed on rerun, 202 suites / 1427 tests
npm run lint # passed, no ESLint warnings or errors
git diff --check # passed
```

Notes:

- The first full `npm test` attempt passed the T-313 suites but hit one
  unrelated transient timeout in
  `__tests__/unit/adminArchiveEntryPoints.test.tsx`; that suite passed
  immediately in isolation, and the exact full `npm test` rerun passed.

## Handoff Notes

- Prepared by the orchestrator on 2026-05-27 after T-310 reported broad
  verification drift unrelated to the Sentry focused tests.
- This is source/test-only and does not require Shopify dashboard work,
  privileged Vercel access, or network access.
- Repaired `PublicRouteBuilderConsumers` by making the blog fixture satisfy the
  full `BlogEntryFrontend` shape instead of casting a partial object.
- Updated `publicRouteCachePolicy` to assert that `MainNavLoader` uses
  `publicAppRoutes` route-root links for biography and collections while still
  rejecting detail builders and dynamic navigation service reads.
- No runtime route, cache, auth, Sentry, API, Shopify, package, or deployment
  behavior changed.
