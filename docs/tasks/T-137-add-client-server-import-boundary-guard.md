# T-137 Add Client Server Import Boundary Guard

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add a static guard and initial cleanup for high-risk client/server import
boundary violations so client components cannot pull server-only data, database,
or model modules into the browser bundle through direct imports or broad mixed
barrels.

## Context

- A-013/A-015/F-022 found client/server import boundaries are leaky and can pull
  server/model modules into client components.
- Historical shop notes identify mixed barrel imports as a prior runtime risk.
- T-023 reduced one root-layout/auth native dependency blast radius, but broad
  client import boundary protection remains open.
- A-005 is still available for a broader frontend component-boundary audit; this
  task should keep to a concrete static guard and high-confidence cleanup.

## Scope

In scope:

- Inventory files with `"use client"` and their direct imports.
- Add a focused static test that rejects high-risk imports from client files,
  including server API wrappers, database helpers, Mongoose models, server-only
  data services, auth/server session helpers, and known mixed barrels that
  expose those modules.
- Fix current violations that are limited to type-only imports, direct
  client-safe imports, or moving imports to existing server loaders.
- Document any remaining violations as explicit allowlisted entries with owner,
  evidence, and follow-up task references.
- Update architecture/frontend/testing workstreams and this task handoff.

Out of scope:

- Do not broadly reorganize the component tree or all barrel exports in one
  pass.
- Do not migrate route data fetching, cache policy, or loader behavior unless a
  direct import violation requires a narrow fix.
- Do not delete unused files except for tiny import-only cleanup required by
  this guard.
- Do not touch API route contracts, Shopify checkout behavior, or admin CRUD
  behavior.

## Concurrency

Can run in parallel with T-134, T-135, T-138, or T-139 when kept to the static
guard and high-confidence import cleanup. Coordinate before running in parallel
with T-136 because both may touch shared frontend component imports.

Owned files in parallel-safe mode:

- client/server import-boundary static test;
- high-confidence import cleanup in scoped client files;
- any client-safe type/helper path created only for this guard;
- `docs/tasks/T-137-add-client-server-import-boundary-guard.md`.

When running in parallel, do not edit shared trackers unless explicitly
assigned: `docs/orchestration/state.md`, `docs/risks/production-readiness.md`,
`docs/workstreams/*`, `docs/audits/findings-register.md`, and index files. Put
candidate doc/tracker updates in this task's handoff notes for orchestrator
reconciliation.

## Likely Files

- `__tests__/unit/security/` or another static source-hygiene test path
- `src/components/`
- `src/app/`
- `src/lib/` barrel or frontend-safe type paths as needed
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/tasks/T-137-add-client-server-import-boundary-guard.md`

## Acceptance Criteria

- A static test inventories current client components and fails on banned
  server-only imports.
- Any allowlist is small, documented, self-checking, and tied to follow-up work.
- High-confidence current violations are fixed without broad behavior changes.
- Client components use direct client-safe imports or type-only imports where
  possible.
- The guard can be maintained when new client components are added.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts
npm run lint
npm run build
git diff --check
```

Adjust the focused test path if the implementation uses a different local test
name, and record the final command in this task's handoff notes.

## Handoff Notes

- Prepared from F-022/R-025 and the architecture/frontend workstream next-agent
  guidance.
- Added `__tests__/unit/security/clientServerImportBoundary.test.ts`. The guard
  discovers `"use client"` entry files, walks runtime local imports and
  re-exports, stops at explicit `"use server"` action boundaries, and fails if
  the client runtime graph reaches server-only imports, DB/model/data-service
  files, server session/auth helpers, data type modules through value imports,
  or known mixed barrels.
- Current inventory: 120 `"use client"` entries and 207 runtime-reachable local
  modules; no allowlist entries are required.
- Moved `NavBarLink` out of
  `src/components/loaders/componentLoaders/MainNavLoader.tsx` and into
  `src/components/modules/navigation/mainNav/types.ts` so client navigation
  components no longer import a server loader for a type.
- Replaced scoped client imports from mixed barrels with direct imports:
  `@/lib/constants` usages now point at the relevant constant module,
  `BlogDetail` imports `BlogCommentsList` directly, and touched client button
  imports point at the concrete button modules.
- Converted DTO/data-contract imports from `src/lib/data/types*` to
  `import type` where they were only used as TypeScript types, including
  client-reachable API fetchers and component modules.
- Candidate shared-doc updates for orchestrator reconciliation:
  Architecture workstream can record T-137 as the completed broad client import
  boundary guard; frontend workstream can record the direct-import cleanup for
  client components and the `NavBarLink` type split; testing workstream can
  record the new static client runtime graph guard and the passing verification
  below.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts`;
  `npm run lint`; `npm run build`; `git diff --check`.
