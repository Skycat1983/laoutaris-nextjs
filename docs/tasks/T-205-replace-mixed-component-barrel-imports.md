# T-205 Replace Mixed Component Barrel Imports

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace remaining mixed component barrel value imports in server routes and
loaders with direct file imports, and add source-hygiene coverage so the
cleanup does not regress.

## Context

- A-005/F-108 found that the T-137 recursive client import-boundary guard
  passes for current client entries, but some server routes/loaders still
  value-import broad mixed barrels.
- R-033 tracks the preventive architecture risk: these imports are not in the
  current client runtime graph, but they can reintroduce client/server boundary
  risk if a caller is later converted into a client entry or reused from one.
- Current source evidence from 2026-05-22:
  - `src/components/loaders/viewLoaders/ArtworkLoader.tsx` imports
    `SubscribeSection` from `@/components/sections` and `ArtworkView` from
    `@/components/views`.
  - `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx` imports
    `ArtworkView` from `@/components/views`.
  - `src/app/blog/layout.tsx` and `src/app/collections/[slug]/layout.tsx`
    import `SubscribeSection` from `@/components/sections`.
  - `src/app/project/contact/page.tsx` imports `ArticleLoader` from
    `@/components/loaders/viewLoaders`.
  - A few focused tests mock or import the same barrels and should be updated
    if their production imports change.

## Scope

In scope:

- Replace the listed production value imports from `@/components/sections`,
  `@/components/views`, and `@/components/loaders/viewLoaders` with direct file
  imports.
- Update focused test imports/mocks that rely on those barrel paths so the test
  setup matches the production import path.
- Add or extend source-hygiene coverage that fails if `src/app` or
  `src/components/loaders` reintroduces those mixed component barrel value
  imports.
- Preserve all route, loader, layout, and rendered component behavior.

Out of scope:

- Do not delete the component barrel files or perform broad source pruning.
- Do not change the T-137 client runtime graph algorithm beyond any focused
  source-hygiene assertion needed for this cleanup.
- Do not change public detail not-found behavior, client fetch retry states,
  account subnavigation, route loading-state documentation, homepage
  prototypes, or framed-preview behavior.
- Do not refactor unrelated imports just because they are nearby.

## Concurrency

Run this task alone with other work touching the listed production imports,
their focused tests, or import-boundary/source-hygiene tests.

Owned files:

- `src/components/loaders/viewLoaders/ArtworkLoader.tsx`
- `src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx`
- `src/app/blog/layout.tsx`
- `src/app/collections/[slug]/layout.tsx`
- `src/app/project/contact/page.tsx`
- focused tests that import or mock the same barrel paths
- import-boundary/source-hygiene tests for mixed component barrels
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Production server routes/loaders no longer value-import from
  `@/components/sections`, `@/components/views`, or
  `@/components/loaders/viewLoaders`.
- Focused tests import/mock the direct files used by the production code.
- A source-hygiene test or equivalent static assertion guards the cleaned
  `src/app` and `src/components/loaders` scopes from reintroducing those mixed
  barrel imports.
- The existing T-137 client/server import-boundary guard still passes.
- Existing route/loader behavior is unchanged.

## Verification

```bash
rg -n 'from "@/components/(sections|views|loaders/viewLoaders)"' src/app src/components/loaders __tests__
npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx
npm run lint
git diff --check
```

If a new source-hygiene test file is added, include it in the focused Jest
command before handoff.

## Agent Prompt

You are working on T-205. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
F-108 in `docs/audits/findings-register.md`, R-033 in
`docs/risks/production-readiness.md`, and the frontend and architecture
workstreams. Replace only the remaining mixed component barrel value imports in
server routes/loaders with direct file imports, update matching focused
test imports/mocks, and add source-hygiene coverage for the cleaned scopes.
Preserve all runtime behavior and keep this separate from broad barrel deletion,
account subnav, loading-state docs, homepage prototype work, framed-preview
work, and route-builder refactors. Run the verification commands plus any new
focused source-hygiene test, then update this handoff with candidate tracker
updates.

## Handoff Notes

- Prepared after T-204 resolved F-107 public browsing client fetch error
  states.
- Completed on 2026-05-22. Replaced the remaining exact mixed component barrel
  value imports in the scoped production server routes/loaders:
  `ArtworkLoader`, `CollectionArtworkLoader`, blog layout, and contact page now
  use direct component/loader file imports. The stale collection layout
  `SubscribeSection` barrel import was removed because that subscription block
  remains commented out.
- Updated focused test imports/mocks to match the direct production import
  paths for `ArtworkView`, `SubscribeSection`, `ArticleLoader`, and the touched
  `BlogCommentsList` mock.
- Extended `__tests__/unit/security/clientServerImportBoundary.test.ts` with an
  AST source-hygiene assertion that fails if `src/app` or
  `src/components/loaders` reintroduces runtime imports from
  `@/components/sections`, `@/components/views`, or
  `@/components/loaders/viewLoaders`.
- Verification passed:
  `rg -n 'from "@/components/(sections|views|loaders/viewLoaders)"' src/app src/components/loaders __tests__`
  returned no matches;
  `npm test -- --runTestsByPath __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/loaders/ArtworkLoader.test.tsx __tests__/unit/loaders/CollectionArtworkLoader.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx`
  passed with 5 suites and 22 tests; `npm run lint` passed; `git diff --check`
  passed.
- Candidate shared tracker updates, not applied because this task forbids
  parallel shared-tracker edits: mark F-108 resolved, mark R-033 mitigated for
  the scoped server route/loader cleanup, and update the frontend,
  architecture, and testing workstreams to record T-205 completion and move the
  next owner-independent action away from mixed component barrel cleanup.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark F-108
  resolved, R-033 mitigated for the scoped A-005 route/loader cleanup, T-205
  complete, and T-206 prepared for F-109 account subnav mounting.
