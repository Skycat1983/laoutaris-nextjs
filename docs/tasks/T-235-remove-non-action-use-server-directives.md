# T-235 Remove Non-Action Use-Server Directives

Status: Planned

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
  public cache/middleware sequence.

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

Run after higher-priority T-230 through T-233 unless there is a small,
non-overlapping implementation slot. Do not run in parallel with work editing
the same loaders/pages/components.

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
- Priority: low, after the A-022 safety and cache proof sequence.
