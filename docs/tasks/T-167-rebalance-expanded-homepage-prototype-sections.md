# T-167 Rebalance Expanded Homepage Prototype Sections

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Refine the biography, blog, and shop prototype section compositions after the
prototype width is expanded, so each section uses the wider canvas deliberately
instead of simply stretching the previous bounded layout.

## Context

- T-166 should first widen the `/prototype/home` prototype layout surface.
- Wider sections may expose composition issues that were hidden by the previous
  `max-w-[1440px]`/`max-w-[1536px]` containers.
- The owner wants the prototype sections to be reviewable as wider homepage
  sections before deciding whether the live homepage should remain bounded or
  adopt more full-width section behavior.

## Scope

In scope:

- Refine only the biography, blog, and shop prototype section components after
  T-166 is complete.
- Rebalance grids, image sizes, rails, spacing, and alignment so the expanded
  canvas looks intentional.
- Keep the current real-data approach: biography uses biography articles, blog
  uses blog entries, and shop uses enquiry-safe shop/product data.
- Preserve full-bleed section backgrounds and the width pattern introduced by
  T-166.
- Keep mobile responsive behavior stable.
- Add focused tests only where data mapping, fallback behavior, or important
  rendering assumptions change.

Out of scope:

- Do not change the live homepage.
- Do not change global CSS, Tailwind config, root layout, header, footer, or
  live page wrappers.
- Do not implement the semantic style-system pilot.
- Do not migrate prototype sections into production.
- Do not decide biography order, canonical dates, blog strategy, shop wording,
  or mobile density unless the owner has already answered those questions.
- Do not edit shared trackers while running in parallel.

## Concurrency

Depends on [T-166](T-166-expand-homepage-prototype-width.md). Do not assign
until T-166 is complete and reconciled.

Can run in parallel with admin-delete or backend-only tasks after T-166, as
long as agents avoid shared tracker edits.

Owned files:

- `src/components/prototypes/home/BiographyPrototypeSection.tsx`
- `src/components/prototypes/home/BlogPrototypeSection.tsx`
- `src/components/prototypes/home/ShopPrototypeSection.tsx`
- focused prototype tests, if updated or added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Biography, blog, and shop sections look intentional on the widened prototype
  canvas rather than appearing like narrow layouts stretched across more space.
- Images and cards remain correctly framed at desktop and mobile sizes.
- Text does not overlap, overflow, or become uncomfortably long.
- The shop rail benefits from wider desktop space without becoming crowded or
  implying checkout behavior that does not exist.
- Existing real-data/fallback behavior remains intact.

## Verification

```bash
npm run lint
npm run build
git diff --check
```

Run focused prototype tests if touched. If browser automation is used, keep it
targeted to `/prototype/home` at one desktop width and one mobile width.

## Agent Prompt

You are working on T-167. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-162, T-166, and the frontend/testing workstreams. After T-166 has widened
the prototype layout, refine only the biography, blog, and shop prototype
sections so they use the wider canvas intentionally. Preserve real data,
fallback behavior, full-bleed backgrounds, mobile stability, and enquiry-safe
shop behavior. Do not touch the live homepage, global CSS, root layout, header,
footer, production migration, semantic style-system work, or shared trackers.
Run lint, build, `git diff --check`, and focused prototype tests if touched,
then update only this task handoff.

## Handoff Notes

- Prepared as the follow-up to T-166. Do not assign before the width pass lands.
- Completed 2026-05-20.
- Rebalanced the widened biography prototype section without changing its data
  source or links: the featured article now scales more deliberately at `2xl`,
  the timeline rail keeps a controlled four-card rhythm, image `sizes` reflect
  the wider frame, and wide-screen heading/card spacing no longer reads as the
  old bounded layout stretched outward.
- Rebalanced the widened blog prototype section without changing real blog data
  mapping: the lead image becomes wider and shallower on large screens, the text
  column keeps a readable measure, secondary cards get a separated rail with
  larger desktop spacing, and summaries are clamped so long blog copy does not
  dominate the expanded canvas.
- Rebalanced the widened shop prototype section without adding checkout/cart
  implications: the header now uses title, description/CTA, and rail controls as
  separate desktop zones, product cards use viewport-aware widths so more of
  the rail is visible on wide screens without crowding mobile, and product meta
  labels are clamped for long Shopify metadata.
- Preserved the T-166 route-local `prototypeSectionFrameClassName`, full-bleed
  section backgrounds, existing fallback states, real biography/blog/shop data,
  and enquiry-safe shop copy constraints. The live homepage, global CSS, root
  layout, header, footer, and shared trackers were not edited.
- Browser automation was not run for this implementation slice; T-168 remains
  the assigned read-only visual QA checkpoint, and this repo does not currently
  have Playwright installed in `node_modules/.bin`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  (with the existing Node `punycode` deprecation warning), `npm run lint`,
  `npm run build` (with the existing Browserslist currency warning), and
  `git diff --check`.
- Candidate tracker updates for the orchestrator: mark T-167 complete in the
  frontend/testing workstreams and note that `/prototype/home` now has
  post-width desktop composition refinements for biography, blog, and shop
  before assigning T-168 visual QA.
