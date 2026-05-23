# T-235 Remove Non-Action Use-Server Directives

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Remove misleading top-level `"use server"` directives from server component,
loader, and layout files where no server function export is intended.

## Context

- A-022 found top-level `"use server"` in server component/loader files such as
  `src/components/views/Home.tsx`,
  `src/components/loaders/viewLoaders/BlogListLoader.tsx`, and
  `src/app/biography/layout.tsx`.
- In the App Router, ordinary Server Components do not need `"use server"`.
  The directive should be reserved for server functions/actions that may be
  imported by clients.
- This is lower priority than the current import-boundary failure and the
  public cache/middleware/client-island sequence. T-230 through T-234 and
  T-236 are now complete or scoped, so this is the remaining A-022 cleanup.
- A pre-assignment source inventory still finds top-level `"use server"` in
  ordinary route/layout/loader/component files such as
  `src/app/biography/layout.tsx`,
  `src/app/collections/[slug]/layout.tsx`,
  `src/components/loaders/viewLoaders/BlogListLoader.tsx`,
  `src/components/views/Home.tsx`, `src/components/modules/navigation/header/Header.tsx`,
  and `src/components/modules/navigation/mainNav/MainNav.tsx`.
- The same inventory also finds likely keepers under `src/lib/actions` and
  session helper modules. Classify each hit before removing directives.

## Scope

In scope:

- Inventory top-level `"use server"` directives in `src/app` and
  `src/components`.
- Remove directives from files that are ordinary Server Components, layouts, or
  loaders and are not exporting Server Functions for client use.
- Keep or add `server-only` imports only where a module truly needs explicit
  server-only protection and the local pattern supports it.
- Preserve runtime behavior and imports.

Out of scope:

- Do not touch actual server actions or server function modules that require
  `"use server"`.
- Do not refactor data services, route cache policy, component boundaries, or
  public UI.
- Do not combine this cleanup with dead-code pruning.

## Concurrency

Run after higher-priority T-230 through T-234 and T-236. Do not run in
parallel with work editing the same loaders/pages/components.

Owned files:

- scoped server component/layout/loader files with unnecessary top-level
  `"use server"` directives
- focused source-hygiene tests if an existing test does not already cover the
  cleanup

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- Ordinary Server Component, layout, and loader files no longer use top-level
  `"use server"` solely to indicate server rendering.
- Actual server action/function files keep the directive where needed.
- Build and focused route/cache/source tests still pass.

## Verification

```bash
rg -n "^[\"']use server[\"'];?" src/app src/components src/lib
npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts
npm run build
```

## Handoff Notes

- Finding: F-117.
- Completed 2026-05-23: removed top-level `"use server"` from ordinary
  App Router layouts/pages, server component loaders, navigation components,
  public views, and prototype loader helper modules under `src/app` and
  `src/components`.
- Kept the remaining directives in `src/lib/actions` and `src/lib/session`,
  where they were classified as action/session helper boundaries rather than
  ordinary Server Component markers. Removed the stale directive from
  `src/lib/utils/debugUtils.ts`.
- Added focused `clientServerImportBoundary` coverage proving non-action
  modules stay free of top-level `"use server"` directives.
- Verification passed:
  `rg -n "^[\"']use server[\"'];?" src/app src/components src/lib`;
  `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts`;
  `npm run build`.
