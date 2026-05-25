# T-284 Set Prototype Home Production Build Policy

Status: Completed

Workstreams:

- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Give `/prototype/home` an explicit production-build policy so the noindex
prototype route does not add hidden MongoDB or Shopify static-generation work.

## Context

A-035 and F-146 found `/prototype/home` prerenders through live biography, blog,
collection, and Shopify-backed shop prototype loaders. The route is noindex and
can render degraded empty/fallback sections, but it still performs live external
reads during production build.

## Scope

In scope:

- Decide the smallest policy for `/prototype/home`: force-dynamic rendering,
  static fixtures, or another explicit noindex prototype strategy.
- Implement that policy and add focused source/test coverage.
- Preserve the existing prototype review experience as much as the chosen
  policy allows.
- Record the policy in the relevant docs if behavior changes.

Out of scope:

- Moving `/prototype/home` into the live homepage.
- Owner review of prototype content or visual direction.
- `/prototype/frame` review work.
- Root header build safety, covered by T-283.

## Concurrency

Can run in parallel with T-281 and T-283. Coordinate with any agent editing
prototype home loaders or route files. T-282 should wait for this task if it is
already active.

## Files Likely Touched

- `src/app/prototype/home/page.tsx`
- `src/components/prototypes/home/*`
- Prototype home tests under `__tests__/unit/`
- `docs/tasks/T-284-set-prototype-home-production-build-policy.md`
- `docs/tasks/README.md`
- Relevant prototype/frontend/deployment docs if the policy changes

## Completion Contract

- Mark this task `Status: Completed` only after the route policy is explicit
  and verified.
- Update `docs/tasks/README.md`.
- Record whether `/prototype/home` still performs live data reads during
  production build.

## Acceptance Criteria

- `/prototype/home` has an intentional build/rendering policy visible in source
  and docs.
- The policy avoids hidden production-build dependency on live prototype data,
  or explicitly documents why that dependency is accepted.
- No live homepage behavior changes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/prototypeHomePage.test.tsx __tests__/unit/prototypeHomeSections.test.tsx
npm run build
git diff --check
```

Adjust the focused test list to the actual existing prototype home suites.

## Handoff Notes

- Planned from F-146 after A-035 identified prototype live reads during
  production build.
- Completed on 2026-05-25. `/prototype/home` now exports
  `dynamic = "force-dynamic"`, so the noindex owner-review route keeps live
  MongoDB/Shopify-backed prototype data at request time and no longer performs
  those prototype section reads during production static generation.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`,
  `npm run build`, and `git diff --check`. The first build attempt compiled
  but failed while collecting page data because
  `.next/server/middleware-manifest.json` was missing; after clearing the stale
  `.next` artifact, the rerun passed and listed `/prototype/home` as dynamic.
