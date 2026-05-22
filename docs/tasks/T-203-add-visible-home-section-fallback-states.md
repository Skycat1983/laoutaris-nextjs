# T-203 Add Visible Home Section Fallback States

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace silent home section `null` fallbacks with visible unavailable or empty
states for the biography, collections, and blog homepage sections.

## Context

- A-005/F-106 found that `Home` wraps collection, biography, and blog sections
  in Suspense skeletons, but their server loaders catch non-Next failures, log
  server events, and return `null`.
- Once a loader resolves to `null`, the skeleton disappears and the page loses
  the whole section without user-facing empty or unavailable state.
- Public detail route not-found/error work is complete through T-199, T-200,
  T-201, and T-202. This task should stay focused on homepage section fallback
  rendering only.

## Scope

In scope:

- Add a small shared public section fallback view or route-local section
  fallback helper that preserves homepage structure for unavailable or empty
  noncritical sections.
- Update these loaders so non-Next failures and empty/missing results render a
  visible fallback instead of `null`:
  - `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
  - `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
  - `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx`
- Preserve Next control-flow error rethrow behavior.
- Preserve existing successful section rendering, service inputs, Suspense
  skeletons, layout wrappers, and no same-app HTTP behavior.
- Add or update focused loader tests for service failures, empty/missing
  results, visible fallback output, structured logging, and successful rendering.

Out of scope:

- Do not redesign homepage sections or migrate the prototype homepage work into
  production.
- Do not change project or subscribe section loaders unless tests prove they are
  required for shared fallback integration.
- Do not change public detail not-found/error behavior, client follow-up fetch
  states, mixed component barrels, account subnavigation, route loading-state
  documentation, Shopify checkout, or framed-preview behavior.

## Concurrency

Run this task alone with other runtime work touching the homepage section
loaders, homepage section components, or shared public fallback components.

Owned files:

- `src/components/loaders/sectionLoaders/BiographySectionLoader.tsx`
- `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx`
- `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx`
- shared fallback component/helper path chosen by the agent
- focused tests for those loaders/fallbacks
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Biography, collections, and blog homepage section loaders no longer return
  `null` for non-Next service failures or empty/missing results.
- Each affected fallback is visible, section-appropriate, and preserves the page
  structure after the Suspense skeleton resolves.
- Successful section rendering and service query inputs are unchanged.
- Next control-flow errors still rethrow.
- Focused tests pass and same-app HTTP remains absent from these loaders.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/loaders/BiographySectionLoader.test.tsx __tests__/unit/loaders/CollectionSectionLoader.test.tsx __tests__/unit/loaders/BlogSectionLoader.test.tsx
git diff --check
```

Add any new focused fallback component test paths to the command before handoff.

## Agent Prompt

You are working on T-203. Read `AGENTS.md`, `docs/README.md`, the A-005 result,
F-106 in `docs/audits/findings-register.md`, and the frontend workstream.
Implement only visible fallback states for the biography, collections, and blog
homepage section loaders. Replace silent `null` returns for non-Next failures
or empty/missing results with section-appropriate visible fallbacks, preserve
successful rendering and service inputs, rethrow Next control-flow errors, and
keep same-app HTTP out of the loaders. Do not redesign homepage sections or
touch public detail, client follow-up fetch, Shopify, account, or framed-preview
work. Run the verification commands plus any new focused tests, then update
this handoff with candidate tracker updates.

## Handoff Notes

- Prepared after T-202 completed the final public detail not-found/error slice
  and F-105 was reconciled as resolved.
- Completed 2026-05-22. Added shared `HomeSectionFallback` rendering through
  the existing homepage `SectionLayout`, then updated biography, collections,
  and blog section loaders so missing service results and non-Next failures
  render visible unavailable states, while empty result arrays render
  section-specific empty states.
- Successful section rendering and service inputs were preserved:
  `getArticleList({ section: "biography" })`,
  `getCollectionList({ section: "collections", limit: 9 })`, and
  `getBlogList({ sortby: "latest", limit: 4 })`.
- Focused loader tests now cover successful rendering, missing results, empty
  results, non-Next failure fallbacks, structured server logging for failures,
  Next control-flow rethrows, and no same-app HTTP usage.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/loaders/BiographySectionLoader.test.tsx __tests__/unit/loaders/CollectionSectionLoader.test.tsx __tests__/unit/loaders/BlogSectionLoader.test.tsx`
  (3 suites, 18 tests), `git diff --check`, and `npm run lint`.
- Candidate tracker updates: mark F-106 resolved; append T-203 completion to
  frontend routes/components and testing/quality workstreams; remove T-203 as
  the next frontend action and choose the next owner-independent slice.
- Reconciled by the orchestrator on 2026-05-22: shared trackers now mark T-203
  complete, F-106 resolved, and T-204 prepared for the F-107 public browsing
  client fetch error-state slice.
