# T-299 Prune High-Confidence Unused Source Leaves

Status: Completed

Workstreams:

- [Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reduce A-014 code-health debt by deleting only high-confidence unused source
leaves, unused barrels, and starter assets after a fresh reference check.

## What This Does

This task re-validates the A-014 pruning candidates against the current
worktree, then removes the files that are still demonstrably unreachable:
unused leaf UI/components, unused WIP variants, unused `index.ts` barrels, and
the default `public/next.svg` and `public/vercel.svg` starter assets.

## Why This Exists

A-014 found dead source leaves and starter assets that obscure the production
surface. Package cleanup, auth/session cleanup, and broad import-boundary work
have already been handled in separate tasks, but the low-risk source-file
pruning pass remains open under F-031/R-011. This slice keeps the cleanup
small enough to verify without mixing in owner-decision areas.

## Context

- A-014 identified high-confidence unused leaf files, WIP variants, unused
  barrels, starter assets, and separate higher-risk cleanup areas.
- T-019 handled the stale auth/session route slice, including the old
  `LoginForm.tsx` path that A-014 listed as a candidate.
- T-022 handled unused direct package dependencies and lockfile cleanup.
- T-087, T-095, T-137, T-205, T-230, and T-291 removed other scoped stale
  source, commented debug code, import-boundary risks, and unused session
  helpers.

## Scope

In scope:

- Before deleting anything, run targeted reference checks for each candidate
  name/path and record any candidate that is now referenced or already missing.
- Delete current high-confidence unused leaf files if they still have no live
  references:
  - `src/components/animations/ArtworkImage.tsx`
  - `src/components/elements/overlays/DimmedOverlay.tsx`
  - `src/components/elements/overlays/RadialGradientOverlay.tsx`
  - `src/components/elements/skeletons/FeedSkeleton.tsx`
  - `src/components/elements/skeletons/SectionHeadingSkeleton.tsx`
  - `src/components/elements/skeletons/SkeletonP.tsx`
  - `src/components/layouts/admin/AdminContentLayout.tsx`
  - `src/components/layouts/admin/AdminPageContainer.tsx`
  - `src/components/layouts/public/ArtworkViewLayout.tsx`
  - `src/components/layouts/public/CollectionInfoLayout.tsx`
  - `src/components/modules/error/ErrorBoundary.tsx`
  - `src/components/modules/disclosures/FrameInfo.tsx`
  - `src/components/modules/sidebar/BlogSidebar.tsx`
  - `src/components/modules/tabs/AdminMobileTabs.tsx`
- Delete current high-confidence unused WIP or variant files if they still have
  no live references:
  - `src/components/modules/wip/ArtistProfile.tsx`
  - `src/components/modules/wip/ArtworkView.tsx`
  - `src/components/modules/wip/CroppedImages.tsx`
  - `src/components/modules/wip/ZoomWrapper.tsx`
  - `src/components/modules/cards/ArtworkMagazineCard.tsx`
  - `src/components/sections/BiographySectionVariations.tsx`
  - `src/components/modules/hero/HeroSlide.tsx`
  - `src/components/modules/hero/HeroSlides.tsx`
  - `src/components/modules/hero/PortraitCycleSlides.tsx`
  - `src/components/modules/hero/PortraitHeroSlides.tsx`
- Delete current unused barrels if they still have no importers:
  - `src/components/elements/typography/index.ts`
  - `src/components/features/adminDashboard/crudForms/read/index.ts`
  - `src/components/features/adminDashboard/feeds/index.ts`
  - `src/components/features/adminDashboard/inputs/index.ts`
  - `src/components/features/adminDashboard/operationTabs/index.ts`
  - `src/components/loaders/componentLoaders/index.ts`
  - `src/components/loaders/sectionLoaders/index.ts`
  - `src/components/modules/cards/index.ts`
  - `src/components/modules/forms/user/index.ts`
  - `src/components/modules/hero/slides/index.ts`
  - `src/lib/constants/translations/index.ts`
- Delete unused starter assets if still unreferenced:
  - `public/next.svg`
  - `public/vercel.svg`
- Update this task, the task index, architecture workstream, testing workstream,
  F-031/R-011 tracker notes if completion meaningfully changes them, and
  orchestration state after completion.

Out of scope:

- Do not delete or refactor `/protected`, route constants, auth/session helpers,
  sign-in/sign-up forms, `processLogin`, custom session files, or `jose`.
- Do not delete or refactor `TranslatedContent`, `useLanguage`,
  `GlobalFeaturesContext` language state, translation JSON directories, or the
  broader i18n pipeline.
- Do not delete `src/components/modules/wip/CollectionInfo.tsx`; it is still
  used by `CollectionViewPagination`.
- Do not delete `src/components/modules/artInfoTabs/ArtInfoTabs.tsx`; A-014
  marked it as requiring frontend/forms owner escalation.
- Do not edit `package.json`, `package-lock.json`, dependency versions, or
  installed package choices.
- Do not remove root `SHOP*.md` historical notes or archive docs.
- Do not change runtime behavior, UI styling, route behavior, auth behavior,
  commerce behavior, cache policy, CI workflow, or owner-decision packets.

## Concurrency

This task should not run in parallel with another task editing the same source
candidate files, task index, architecture workstream, testing workstream,
F-031/R-011 tracker notes, or orchestration state.

This task owns:

- the listed candidate files and starter assets if deletion remains justified;
- `docs/tasks/T-299-prune-high-confidence-unused-source-leaves.md`;
- `docs/tasks/README.md`;
- relevant architecture/testing workstream notes;
- related F-031/R-011 tracker notes only if completion changes their status;
- `docs/orchestration/state.md`.

Leave unrelated dirty files alone.

## Files Likely Touched

- Candidate source files and starter assets listed in Scope
- `docs/tasks/T-299-prune-high-confidence-unused-source-leaves.md`
- `docs/tasks/README.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md` if F-031 status/evidence changes
- `docs/risks/production-readiness.md` if R-011 mitigation status changes
- `docs/orchestration/state.md`

## Completion Contract

- Mark this task `Status: Completed` only after reference checks, deletion,
  tracker updates, and verification are complete.
- Record which candidates were deleted, which were already absent, and which
  were kept because a current reference or ownership concern was found.
- Record exact verification commands and outcomes.
- If verification fails for reasons unrelated to this deletion pass, record the
  failure and evidence without masking it.

## Acceptance Criteria

- Every deleted file had a fresh targeted reference check showing no live
  importer or asset reference.
- The task removes only high-confidence A-014 source leaves, unused barrels, and
  starter assets.
- Auth/session, i18n, dependency, root Shopify notes, commerce, route, and owner
  decision areas are unchanged.
- F-031/R-011 and workstream handoffs no longer imply this exact first pruning
  pass is still unassigned.

## Verification

Run the narrow reference checks first, then the standard source-deletion gate:

```bash
npm run lint
npm test
npm run build
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 after T-298 completed the sale-gallery tracker
  reconciliation and the owner-blocked sale-gallery path had no further
  unblocked implementation work.
- Completed on 2026-05-26. Fresh reference checks confirmed all scoped source
  candidates and starter assets were present before deletion and had no live
  runtime importers or asset references. `ErrorBoundary`, `BlogSidebar`, and
  `ArtworkMagazineCard` had test-only/source-hygiene references; those stale
  test references were removed with the deleted files.
- Deleted all scoped high-confidence unused leaves, WIP/variant files, unused
  barrels, and starter assets:
  `src/components/animations/ArtworkImage.tsx`,
  `src/components/elements/overlays/DimmedOverlay.tsx`,
  `src/components/elements/overlays/RadialGradientOverlay.tsx`,
  `src/components/elements/skeletons/FeedSkeleton.tsx`,
  `src/components/elements/skeletons/SectionHeadingSkeleton.tsx`,
  `src/components/elements/skeletons/SkeletonP.tsx`,
  `src/components/layouts/admin/AdminContentLayout.tsx`,
  `src/components/layouts/admin/AdminPageContainer.tsx`,
  `src/components/layouts/public/ArtworkViewLayout.tsx`,
  `src/components/layouts/public/CollectionInfoLayout.tsx`,
  `src/components/modules/error/ErrorBoundary.tsx`,
  `src/components/modules/disclosures/FrameInfo.tsx`,
  `src/components/modules/sidebar/BlogSidebar.tsx`,
  `src/components/modules/tabs/AdminMobileTabs.tsx`,
  `src/components/modules/wip/ArtistProfile.tsx`,
  `src/components/modules/wip/ArtworkView.tsx`,
  `src/components/modules/wip/CroppedImages.tsx`,
  `src/components/modules/wip/ZoomWrapper.tsx`,
  `src/components/modules/cards/ArtworkMagazineCard.tsx`,
  `src/components/sections/BiographySectionVariations.tsx`,
  `src/components/modules/hero/HeroSlide.tsx`,
  `src/components/modules/hero/HeroSlides.tsx`,
  `src/components/modules/hero/PortraitCycleSlides.tsx`,
  `src/components/modules/hero/PortraitHeroSlides.tsx`,
  `src/components/elements/typography/index.ts`,
  `src/components/features/adminDashboard/crudForms/read/index.ts`,
  `src/components/features/adminDashboard/feeds/index.ts`,
  `src/components/features/adminDashboard/inputs/index.ts`,
  `src/components/features/adminDashboard/operationTabs/index.ts`,
  `src/components/loaders/componentLoaders/index.ts`,
  `src/components/loaders/sectionLoaders/index.ts`,
  `src/components/modules/cards/index.ts`,
  `src/components/modules/forms/user/index.ts`,
  `src/components/modules/hero/slides/index.ts`,
  `src/lib/constants/translations/index.ts`, `public/next.svg`, and
  `public/vercel.svg`.
- Already absent: none. Kept from the scoped deletion list: none. Out-of-scope
  A-014 areas such as auth/session, i18n, package dependencies, root Shopify
  notes, `ArtInfoTabs`, and the remaining utility/import-level cleanup were not
  changed.
- Stale commented references to the deleted layout/variant files were removed
  from `ArtworkLoader`, `BiographySectionLoader`, and the collection layout.
- Reference verification after deletion found no remaining non-doc references
  to the deleted file paths, no remaining alias imports for the deleted
  components, and no importers for the deleted directory barrels.
- Verification:
  - `npm run lint`: passed.
  - `npm test`: first full run failed once in
    `__tests__/unit/visibleBreadcrumbs.test.tsx` because the artwork breadcrumb
    label stayed at the route fallback; the focused rerun of that file passed,
    and the second full `npm test` passed with 198 suites / 1405 tests.
  - `npm run build`: passed. Build emitted the existing Browserslist
    `caniuse-lite is outdated` advisory.
  - `git diff --check`: passed.
