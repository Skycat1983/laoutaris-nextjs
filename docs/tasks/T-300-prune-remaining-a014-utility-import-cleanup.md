# T-300 Prune Remaining A-014 Utility Import Cleanup

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Finish the remaining low-risk F-031 utility and import-level cleanup left after
T-299.

## What This Does

This task re-checks the A-014 utility/import candidates against the current
worktree, removes the still-unused helper/export or import/comment leftovers,
and updates the F-031/R-011 trackers if this closes the high-confidence A-014
source-pruning scope.

## Why This Exists

T-299 completed the first A-014 pruning pass for unused source leaves, WIP
variants, barrels, and starter assets. Its handoff left only the smaller
utility/import-level cleanup from F-031. This follow-up prevents the
source-pruning thread from staying half-open while still keeping higher-risk
auth, i18n, dependency, route, commerce, and owner-decision cleanup out of
scope.

## Context

- A-014 listed `filterWatchlerlist` in
  `src/lib/helpers/transformData.ts` as an unused export.
- A-014 listed saved-item action imports as candidates; in the current worktree,
  `revalidatePath` and saved-button state type imports are live, while the old
  debug `delay` imports are absent. Re-check before editing and record the
  outcome.
- A-014 listed commented/unused collection layout imports. T-299 removed many
  stale source candidates, but `src/app/collections/[slug]/layout.tsx` still
  contains old commented layout blocks and an import used only by comments.
- T-299 explicitly left auth/session, i18n, package dependencies, root Shopify
  notes, `ArtInfoTabs`, and broader owner-decision cleanup out of scope.

## Scope

In scope:

- Re-run targeted reference checks for:
  - `filterWatchlerlist`;
  - `src/lib/helpers/transformData.ts`;
  - `src/lib/actions/updateUserFavourites.ts`;
  - `src/lib/actions/updateUserWatchlist.ts`;
  - `src/app/collections/[slug]/layout.tsx`;
  - any imports or commented references removed by this task.
- Remove `filterWatchlerlist` if it remains unreferenced outside its
  declaration.
- Remove unused imports and stale commented layout/prototype blocks from
  `src/app/collections/[slug]/layout.tsx` if they are still disconnected from
  rendered behavior.
- Inspect the saved-item action import candidates and either:
  - leave them unchanged if `revalidatePath` and button state types are live;
    or
  - remove only genuinely unused imports if the fresh check finds any.
- Update this task, the task index, architecture workstream, testing workstream,
  F-031, R-011, and orchestration state after completion.

Out of scope:

- Do not delete or refactor `/protected`, route constants, auth/session helpers,
  sign-in/sign-up forms, `processLogin`, custom session files, or `jose`.
- Do not delete or refactor `TranslatedContent`, `useLanguage`,
  `GlobalFeaturesContext` language state, translation JSON directories, or the
  broader i18n pipeline.
- Do not edit `package.json`, `package-lock.json`, dependency versions, or
  installed package choices.
- Do not remove root `SHOP*.md` historical notes or archive docs.
- Do not delete or refactor `src/components/modules/artInfoTabs/ArtInfoTabs.tsx`.
- Do not change UI behavior, route behavior, auth behavior, commerce behavior,
  cache policy, CI workflows, owner-decision packets, or sale-gallery work.

## Concurrency

This task should not run in parallel with another task editing the same utility
files, collection layout, F-031/R-011 tracker rows, task index, architecture
workstream, testing workstream, or orchestration state.

This task owns:

- `src/lib/helpers/transformData.ts` if `filterWatchlerlist` is removed;
- `src/app/collections/[slug]/layout.tsx` for comment/import cleanup;
- `src/lib/actions/updateUserFavourites.ts` and
  `src/lib/actions/updateUserWatchlist.ts` only if fresh checks find genuinely
  unused imports;
- `docs/tasks/T-300-prune-remaining-a014-utility-import-cleanup.md`;
- `docs/tasks/README.md`;
- related F-031/R-011 tracker notes;
- relevant architecture/testing workstream notes;
- `docs/orchestration/state.md`.

Leave unrelated dirty files alone.

## Files Likely Touched

- `src/lib/helpers/transformData.ts`
- `src/app/collections/[slug]/layout.tsx`
- `src/lib/actions/updateUserFavourites.ts` only if fresh checks justify it
- `src/lib/actions/updateUserWatchlist.ts` only if fresh checks justify it
- `docs/tasks/T-300-prune-remaining-a014-utility-import-cleanup.md`
- `docs/tasks/README.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after fresh reference checks,
  cleanup, tracker updates, and verification are complete.
- Record exactly which utility/import candidates changed and which were left
  unchanged because they are live or out of scope.
- If F-031 is resolved by this cleanup, update F-031 and R-011 conservatively
  while keeping auth/i18n/package/root-note decisions separate.
- State that no behavior, package, auth, i18n, commerce, CI, or owner-decision
  changes were made.

## Acceptance Criteria

- `filterWatchlerlist` is either removed as unused or explicitly justified as
  still live.
- The collection slug layout no longer imports or preserves large commented WIP
  blocks for components removed by T-299.
- Saved-item action imports are not changed unless they are genuinely unused in
  the current source.
- F-031/R-011 and workstream handoffs no longer imply this utility/import
  cleanup remains unassigned.

## Verification

Run targeted reference checks first, then:

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

If saved-item action files change, also run:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts
```

## Handoff Notes

- Planned on 2026-05-26 after T-299 completed the first A-014 source-pruning
  pass and left only utility/import-level F-031 cleanup.
- Completed on 2026-05-26. Fresh reference checks found
  `filterWatchlerlist` still unreferenced outside its declaration, so
  `src/lib/helpers/transformData.ts` now keeps only the live `replaceMongoId`
  helper.
- Removed the stale commented layout/prototype blocks from
  `src/app/collections/[slug]/layout.tsx` and dropped the `HorizontalDivider`
  import that was referenced only by those comments. Rendered collection layout
  behavior is unchanged.
- Re-checked `src/lib/actions/updateUserFavourites.ts` and
  `src/lib/actions/updateUserWatchlist.ts`: `revalidatePath` and the saved
  button state type imports are live, and the old debug `delay` imports are not
  present. The saved-item action files were left unchanged, so the focused
  saved-item action suite was not required.
- F-031's staged high-confidence A-014 source-pruning scope is resolved by
  T-299 plus T-300. Auth/session, i18n, package, root Shopify note, route
  behavior, commerce, CI, and owner-decision cleanup were not changed.
- Verification: targeted `rg` reference checks passed; `npm run lint` passed;
  `npm run typecheck` passed; `npm run build` passed with the existing
  Browserslist `caniuse-lite is outdated` advisory; `git diff --check` passed.
