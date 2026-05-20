# T-155 Render Content-Aware Visible Breadcrumbs

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Replace mechanical visible breadcrumb labels on high-value detail routes with
content-aware labels from existing server data.

## Context

- F-102 found the visible breadcrumb component maps URL segments directly and
  labels 24-character hex segments as `artworkId`.
- T-112 added content-aware breadcrumb JSON-LD for article, blog, artwork,
  collection-scoped artwork, and product detail pages.
- The global header breadcrumb is currently client-rendered from layout
  segments, so this task should avoid client self-fetching and avoid duplicating
  misleading visible breadcrumbs.

## Scope

In scope:

- Add visible content-aware breadcrumb labels for high-value detail pages that
  already have server data available: biography article, blog post, artwork
  detail, collection-scoped artwork detail, and Shopify product detail.
- Prefer reusing existing server data lookups or metadata/breadcrumb helpers
  rather than adding same-app HTTP fetches.
- Ensure raw ObjectIds and mechanical route-param labels are not shown on the
  targeted detail routes.
- Preserve existing breadcrumb links and public route rendering behavior.
- Add focused tests for at least artwork and one slug-based detail route, plus
  a source/behavior guard that raw 24-character IDs are not rendered as
  `artworkId` on targeted detail breadcrumbs.

Out of scope:

- Do not change breadcrumb JSON-LD semantics unless a shared helper requires a
  no-op refactor.
- Do not add new metadata claims, sitemap behavior, or route cache changes.
- Do not implement translated breadcrumb labels.
- Do not edit blog admin controls owned by T-153 or taxonomy validation owned
  by T-154.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-153 and T-154 because it owns public breadcrumb UI
and focused breadcrumb tests.

Owned files:

- `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx`
- detail page or metadata helper files needed to pass content-aware labels
- focused breadcrumb tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx`
- `src/lib/metadata/publicDetailMetadata.ts`
- `src/components/metadata/PublicDetailJsonLd.tsx`
- selected detail page files under `src/app/`
- focused tests under `__tests__/unit/`
- `docs/tasks/T-155-render-content-aware-visible-breadcrumbs.md`

## Acceptance Criteria

- Targeted detail routes show human-readable content labels rather than raw
  route params or `artworkId`.
- Breadcrumb links remain valid and point to existing public route levels.
- No client same-app HTTP fetch is added for breadcrumb labels.
- Focused tests cover content-aware labels and raw-ID suppression.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx
git diff --check
```

Add or substitute focused visible-breadcrumb tests for the files touched, and
run `npm run lint`.

## Handoff Notes

- Prepared after T-150 through T-152 reconciliation.
- Implemented visible breadcrumb label overrides in
  `src/components/modules/navigation/breadcrumbs/Breadcrumbs.tsx` by reading the
  server-rendered `BreadcrumbList` JSON-LD already emitted by targeted detail
  pages. The component keeps route-derived links, avoids client fetching, and
  uses readable fallbacks that no longer render 24-character IDs as `artworkId`.
- Added `__tests__/unit/visibleBreadcrumbs.test.tsx` covering artwork detail
  labels, one slug detail route, delayed JSON-LD insertion, raw-ID suppression,
  and the no-client-fetch/source guard.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/visibleBreadcrumbs.test.tsx`;
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicBreadcrumbStructuredData.test.tsx`;
  `npm run lint`; `git diff --check`.
- Additional check attempted: `./node_modules/.bin/tsc --noEmit --pretty false`
  failed on existing unrelated type errors in admin route guard tests,
  navigation/loader/page test fixtures, `sessionTestHeaders`, `dbHelpers`,
  `uploadButton`, `clientServerImportBoundary`, `src/app/artwork/page.tsx`, and
  `BlogListView`. No reported error referenced the T-155 breadcrumb component or
  new visible breadcrumb test.
- Candidate shared-tracker update: mark F-102 resolved if all targeted detail
  routes stop rendering mechanical visible breadcrumb labels.
