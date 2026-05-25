# T-283 Make Root Header Nav Build Static Safe

Status: Completed

Workstreams:

- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)
- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)

## Goal

Stop the global root header navigation from performing live MongoDB reads during
production prerendering of otherwise static shells.

## Context

A-035 and F-146 found that `HeaderMainNavLoader` calls
`getArticleNavigationList("biography")` and `getCollectionNavigationList()` from
the global header. Failures are caught and route-root fallbacks are rendered,
but static generation still attempts live MongoDB reads and emits build-time
navigation errors.

The route-root pages for `/biography` and `/collections` already own the
first-item redirect behavior and release evidence policy.

## Scope

In scope:

- Make root header links static-safe by defaulting to stable route-root links or
  another small accepted pattern that avoids global live DB reads during build.
- Preserve visible public navigation labels and route-root fallbacks.
- Keep first biography/collection item resolution owned by the route pages, not
  by every static shell through the header.
- Add or update focused coverage for the header/main-nav contract.

Out of scope:

- Changing `/biography` or `/collections` redirect behavior.
- Changing sitemap or release evidence policy from T-279.
- Prototype route build policy, covered by T-284.

## Concurrency

Can run in parallel with T-281 and T-284. Coordinate with any task editing
`MainNavLoader`, `Header`, or public navigation tests. T-282 should wait for
this task if it is already active.

## Files Likely Touched

- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- Header/main-nav tests under `__tests__/unit/`
- `docs/tasks/T-283-make-root-header-nav-build-static-safe.md`
- `docs/tasks/README.md`
- Relevant workstream docs if the navigation contract changes

## Completion Contract

- Mark this task `Status: Completed` only after focused navigation tests and
  `npm run build` pass or any remaining build reads are explicitly documented.
- Update `docs/tasks/README.md`.
- Record whether build output still logs root-header navigation source failures.

## Acceptance Criteria

- Static shells no longer trigger live biography/collection navigation reads
  solely because the root header renders.
- Header links still route users to the public archive sections.
- Build verification no longer reports root-header main-nav data-source errors.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/mainNavFallbacks.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts
npm run build
git diff --check
```

Adjust the focused test list to the actual existing header/navigation suites.

## Handoff Notes

- Completed on 2026-05-25. `MainNavLoader` no longer imports or calls
  `getArticleNavigationList("biography")` or `getCollectionNavigationList()`;
  the global header now renders stable route-root links for `/biography` and
  `/collections`.
- First-item biography and collection target resolution remains owned by the
  `/biography` and `/collections` route pages.
- `npm run build` passed. Build output did not log
  `loader.public.main_nav.failed` or root-header navigation source failures.
  The build did still print the existing optional `sharp` recommendation,
  transient Google Fonts retry messages, Node `punycode` deprecation warnings,
  and a Browserslist stale-data notice.
- Focused verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/MainNavLoader.test.tsx __tests__/unit/publicRouteCachePolicy.test.ts`;
  `npm test -- --runTestsByPath __tests__/unit/observability/publicLoaderPageLoggingSourceHygiene.test.ts`;
  `npm run build`;
  `git diff --check`.
