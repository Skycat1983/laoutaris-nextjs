# T-305 Add Public App Route Builders

Status: Planned

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Create the first client-safe public app route-builder slice.

## What This Does

This task adds a small route module for public app routes and migrates a narrow
set of low-risk consumers to it. The first slice should centralize stable public
root/detail builders without touching auth, API routes, middleware, admin
action routes, smoke route lists, redirects, or cache policy.

## Why This Exists

T-302 found route path ownership spread across constants, metadata, sitemap,
navigation, UI links, tests, and scripts. It recommended starting with public
app route builders because that centralizes repeated links without changing
auth or API behavior.

## Parallel Assignment Rules

This task can run in parallel with T-304 and T-306. It owns the new public route
builder module plus the specific public route consumers and tests it changes.
Do not edit shared trackers, workstreams, task index, or orchestration state
while running in parallel; list candidate shared updates in the handoff.

## Scope

In scope:

- Use
  [T-302 Route Builder Centralization Scope](../audits/results/T-302-route-builder-centralization-scope.md)
  as the source of truth.
- Add a client-safe route module with no server-only imports for stable public
  app paths and small encoded builders, likely under `src/lib/routes/`.
- Include public roots and detail builders for the first slice:
  - `/`, `/artwork`, `/biography`, `/collections`, `/blog`, `/project`,
    `/shop`, `/shop/products`, `/search`, `/privacy`, `/terms`, `/sign-in`;
  - artwork detail, biography article detail, blog detail, collection detail,
    collection artwork detail, and shop product detail builders.
- Move or re-export the existing public detail path helpers from
  `src/lib/metadata/publicDetailMetadata.ts` through the new module, then update
  metadata/sitemap consumers to use the new source.
- Migrate a narrow low-risk UI set:
  - `MainNavLoader.tsx`;
  - `MainNav.tsx` skeleton routes;
  - footer/legal links only if they can use the same route constants without
    changing copy or behavior.
- Add focused unit coverage for route builder outputs, encoding, and selected
  migrated consumers.

Out of scope:

- Do not centralize middleware matchers, protected route constants, NextAuth
  options/callbacks, admin dashboard redirects, API route builders, route
  logging IDs, smoke route lists, sitemap freshness, redirects, cache policy,
  generated params, or taxonomy/filter option sources.
- Do not introduce a broad barrel that could be imported by client components
  and pull server-only modules into the client graph.
- Do not change route behavior, visible link labels, auth behavior, or public
  smoke contracts.

## Concurrency

This task owns:

- the new public route builder module and its focused tests;
- `src/lib/metadata/publicDetailMetadata.ts` and
  `src/lib/metadata/publicDynamicSitemap.ts` only for route-builder imports;
- `src/components/loaders/componentLoaders/MainNavLoader.tsx`;
- `src/components/modules/navigation/mainNav/MainNav.tsx`;
- footer/legal link source only if changed;
- `docs/tasks/T-305-add-public-app-route-builders.md`.

Leave unrelated dirty files and shared trackers alone.

## Files Likely Touched

- `src/lib/routes/*`
- `src/lib/metadata/publicDetailMetadata.ts`
- `src/lib/metadata/publicDynamicSitemap.ts`
- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- `src/components/modules/navigation/mainNav/MainNav.tsx`
- relevant focused tests
- `docs/tasks/T-305-add-public-app-route-builders.md`

## Completion Contract

- Mark this task `Status: Completed` only after implementation and verification
  are complete.
- Record which consumers were migrated and which route-builder areas remain
  deferred.
- List candidate shared tracker updates for orchestrator reconciliation.

## Acceptance Criteria

- Public route constants/builders are client-safe and covered by focused tests.
- Metadata/sitemap detail path consumers use the canonical public route module.
- The selected main navigation consumers use the new module without behavior
  changes.
- Auth/protected, API, admin action, smoke, redirect, and cache concerns remain
  untouched.

## Verification

Run focused route-builder tests plus any touched consumer tests, then:

```bash
npm run lint
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Include any new route-builder test file and touched metadata/sitemap/main-nav
tests in the focused `npm test -- --runTestsByPath` command.

## Handoff Notes

- Planned on 2026-05-26 after T-302 completed route-builder centralization
  scoping.
