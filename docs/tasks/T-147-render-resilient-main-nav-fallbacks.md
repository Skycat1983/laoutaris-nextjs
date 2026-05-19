# T-147 Render Resilient Main Nav Fallbacks

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Keep the public main navigation visible with stable route-root fallbacks when
dynamic biography or collection navigation data is missing or empty.

## Context

- A-017/F-101 found `MainNavLoader` depends on the first biography article and
  first collection to build nav paths.
- The current catch path logs and returns no `MainNav`, which removes primary
  navigation when dynamic data is unavailable.
- Static route roots already exist for `/artwork`, `/biography`,
  `/collections`, `/blog`, `/project/about`, and `/shop`.

## Scope

In scope:

- Update `MainNavLoader` so missing or empty biography navigation falls back to
  `/biography`.
- Update `MainNavLoader` so missing or empty collection navigation falls back
  to `/collections`.
- Preserve the richer `/biography/[slug]` and
  `/collections/[slug]/[artworkId]` links when service data is available.
- Preserve structured server logging for unexpected service failures without
  hiding the whole nav for ordinary empty-list states.
- Add focused loader tests for complete dynamic data, missing biography data,
  missing collection data, empty data arrays, and unexpected service failures.

Out of scope:

- Do not change `MainNav` layout, link labels, mobile drawer behavior, search,
  breadcrumbs, or public route redirects.
- Do not change article or collection navigation services.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-148 and T-149 because it owns only the main-nav
loader and focused loader tests.

Owned files:

- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- `__tests__/unit/loaders/MainNavLoader.test.tsx`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/loaders/componentLoaders/MainNavLoader.tsx`
- `__tests__/unit/loaders/MainNavLoader.test.tsx`
- `docs/tasks/T-147-render-resilient-main-nav-fallbacks.md`

## Acceptance Criteria

- Primary public navigation still renders when biography navigation data is
  missing or empty.
- Primary public navigation still renders when collection navigation data is
  missing or empty.
- Available dynamic biography and collection targets are still preferred over
  route-root fallbacks.
- Focused tests cover fallback and normal data paths.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/MainNavLoader.test.tsx
git diff --check
```

## Handoff Notes

- Prepared after T-144 through T-146 reconciliation from A-017/F-101.
- Keep visible breadcrumb labels and public search scope separate.
- Completed by updating `MainNavLoader` to render static public navigation with
  `/biography` and `/collections` route-root fallbacks when navigation service
  results are missing, empty, or rejected.
- Dynamic biography and collection targets are still preferred when service
  data is available, including the existing collection-without-artwork
  `/collections/[slug]` path.
- Unexpected article or collection navigation service rejections now emit
  structured server logs with a `source` field while the nav renders fallback
  links.
- Focused coverage added for complete dynamic data, missing biography data,
  missing collection data, empty arrays, collection-without-artwork behavior,
  and unexpected service failures.
- Verification: `npm test -- --runTestsByPath
  __tests__/unit/loaders/MainNavLoader.test.tsx` passed on 2026-05-19.
- Candidate tracker update: frontend/testing workstreams can note T-147 closed
  the A-017/F-101 main navigation fail-closed finding.
