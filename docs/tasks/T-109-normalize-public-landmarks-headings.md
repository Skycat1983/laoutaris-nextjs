# T-109 Normalize Public Landmarks And Headings

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Normalize public-page main landmark ownership and heading hierarchy without
changing visible layout, copy, route data, commerce behavior, or admin/account
workflows.

## Context

- F-089 found `src/app/layout.tsx` wraps every route in a global `<main>` while
  several public pages and views also render their own `<main>`, creating nested
  main landmarks.
- F-089 also found repeated public UI pieces using presentational `h1`
  elements, which makes the heading outline noisy for archive, blog, hero, and
  shop pages.
- T-102 removed root-layout DB/session work but intentionally left layout
  semantics separate.
- T-104 and T-105 handled labelled public controls; this task should focus on
  landmarks and headings only.

## Scope

- In scope:
  - Choose and apply one public-page main landmark ownership pattern. Prefer
    route/view-level `<main>` ownership with the root layout retaining spacing
    and min-height through a non-landmark wrapper unless the existing code
    clearly supports a narrower pattern.
  - Remove nested `<main>` landmarks from high-value public routes covered by
    the A-010 finding, including blog/article detail, project/static pages, shop
    listing/detail, artwork/detail views, and home/hero composition where
    touched.
  - Demote repeated presentational `h1` elements in touched public cards,
    sidebars, hero slides, and section links to the appropriate `h2`, `h3`, or
    non-heading element while preserving class names and visual appearance.
  - Preserve the single meaningful page-level `h1` for routes that already have
    one, or add a visually appropriate/hidden one only where needed to avoid a
    headingless public route after landmark cleanup.
  - Add focused source/component tests or inventories proving the corrected
    public landmark and heading expectations.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Visual redesign, copy rewrite, spacing/layout refactors, or navigation
    restructuring.
  - Admin dashboard, authenticated account pages, dropdown menu internals, and
    WIP modules unless a touched public route directly requires them.
  - ARIA role rewrites beyond what is needed to avoid duplicate main landmarks.
  - Route cache/ISR policy, metadata/JSON-LD, image sizing, and artwork-to-shop
    SSR discovery.
  - Browser automation unless a layout-sensitive regression cannot be proven
    with focused tests or source checks.

## Files Likely Touched

- `src/app/layout.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/shop/products/page.tsx`
- `src/app/shop/products/[productHandle]/page.tsx`
- `src/app/project/aims/page.tsx`
- `src/app/project/film/page.tsx`
- `src/components/views/ArticleView.tsx`
- `src/components/views/DesktopArticleView.tsx`
- `src/components/views/BlogDetail.tsx`
- `src/components/views/ArtworkView.tsx`
- `src/components/modules/hero/**/*.tsx`
- `src/components/modules/cards/**/*.tsx`
- `src/components/sections/**/*.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-109-normalize-public-landmarks-headings.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Public routes touched by this task no longer render nested `<main>` landmarks.
- The root layout no longer forces a second main landmark around pages/views
  that own their page landmark.
- Repeated public hero/card/sidebar/section UI no longer uses `h1` only for
  styling where the element is not the route's page title.
- Visual classes, visible text, links, form behavior, image behavior, and route
  data fetching remain unchanged.
- Focused tests or source invariants cover the corrected landmark ownership and
  heading hierarchy.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/publicLandmarksHeadings.test.ts
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared after T-108 completed public image preload/sizing work.
- Completed on 2026-05-18. The root layout now keeps its spacing/min-height
  wrapper as a non-landmark `div`, while touched public routes or
  route-specific views own their `<main>` landmark.
- Added route/view main wrappers or hidden page-level `h1`s where the root
  layout was previously the only page landmark/title source, including home,
  artwork list/detail, collection artwork detail, blog list, project film, and
  search states.
- Demoted repeated presentational `h1` usage in touched article/project
  views, home hero slides, blog sections/sidebar, public cards, and related
  public pagination/section UI while preserving existing class names and
  visible text.
- Added `__tests__/unit/publicLandmarksHeadings.test.ts` to pin root
  non-landmark ownership, route/view main ownership, and public visual-module
  heading expectations.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/publicLandmarksHeadings.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- Keep route-local cache/ISR policy, remaining metadata/discovery work,
  Cloudinary delivery-transform centralization, and artwork-to-shop SSR
  discovery separate.
