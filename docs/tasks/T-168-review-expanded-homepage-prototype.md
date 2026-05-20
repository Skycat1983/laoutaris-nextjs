# T-168 Review Expanded Homepage Prototype

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Run a focused visual QA pass on the expanded `/prototype/home` sections and
record whether the wider direction is ready for owner review or needs another
targeted refinement pass.

## Context

- T-162 reviewed the first prototype pass and captured owner decisions.
- T-166 widens the prototype canvas.
- T-167 rebalances section compositions after the width change.
- This task is a read-only review checkpoint before any production homepage
  migration or style-system pilot.

## Scope

In scope:

- Inspect `/prototype/home` after T-166 and T-167.
- Compare the expanded biography, blog, and shop sections against the design
  guide intent and the owner feedback about width.
- Check desktop and mobile layout for horizontal scroll, overlap, awkward
  spacing, image framing, text measure, and CTA placement.
- Record concise findings and recommended next actions in this task handoff.

Out of scope:

- Do not edit runtime code.
- Do not edit global CSS, live homepage, prototype section code, route layouts,
  or shared trackers.
- Do not migrate prototype sections into production.
- Do not implement style-system changes.
- Do not resolve owner decisions unless the owner has already answered them.

## Concurrency

Depends on [T-166](T-166-expand-homepage-prototype-width.md) and
[T-167](T-167-rebalance-expanded-homepage-prototype-sections.md). Do not assign
until both implementation tasks are complete.

Can run in parallel with backend/admin tasks because this is read-only, but do
not edit shared trackers.

Owned files:

- this task brief handoff section only

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Handoff states whether the expanded prototype is ready for owner review.
- Handoff identifies any remaining section-specific refinement needed before
  production migration.
- Handoff keeps browser/screenshot evidence concise and does not paste large
  DOM dumps, traces, videos, or broad logs.

## Verification

```bash
git diff --check
```

If browser automation is used, keep it targeted to `/prototype/home` at one
desktop width and one mobile width.

## Agent Prompt

You are working on T-168. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-162, T-166, T-167, and the frontend/testing workstreams. Review the expanded
`/prototype/home` route after the width and section-rebalance work. This is a
read-only visual QA task: do not edit runtime code, global CSS, live homepage,
prototype components, or shared trackers. Check desktop and mobile for whether
the wider sections now answer the owner feedback, and record concise findings,
remaining refinements, and owner-review readiness in this task handoff. Run
`git diff --check`.

## Handoff Notes

- Prepared as the read-only checkpoint after the expanded-width prototype
  implementation pass.
- Completed 2026-05-20.
- QA scope: local `/prototype/home` review at 1448px desktop and 390px mobile
  using headless Chrome DevTools Protocol because Playwright is not installed
  in this repo. Evidence was limited to section-scoped screenshots/metrics plus
  a route smoke. No traces, videos, full DOM dumps, or broad browser logs were
  collected.
- Revalidated in the current pass with local `npm run dev`, a route smoke, and
  targeted headless Chrome CDP metrics at `1448x980` desktop and `390x844`
  mobile. Desktop Chrome reserved scrollbar width and reported document
  client/scroll width `1433px`; mobile reported `390px`. Neither viewport
  showed page-level horizontal overflow.
- Readiness: the expanded prototype is ready for owner review as a width and
  composition direction. The T-166/T-167 wider frame now reads as a genuinely
  broader homepage canvas rather than the old bounded page column, and the
  biography, blog, and shop sections look intentionally composed at desktop.
- Layout checks:
  - No document-level horizontal overflow was observed. The original desktop
    pass reported scroll width matching the `1448px` viewport; the current
    `1448x980` CDP recheck reported document client/scroll width `1433px`
    after Chrome reserved scrollbar width. Mobile reported document scroll
    width `390px`.
  - Section headings and CTAs did not report horizontal overflow. The shop rail
    intentionally overflows inside its own horizontal scroller, not the page.
  - Desktop and mobile visible section images loaded after their below-fold
    sections were scrolled into view. Offscreen shop rail images can remain
    unloaded until the rail is advanced, and remote optimized images can still
    leave blank image panels during the initial lazy-load window.
  - Desktop shop initially exposed five fully visible product cards and a
    partial sixth card in the rail; mobile exposed one full product card and a
    partial second card without creating page-level overflow.
- Biography:
  - The wider desktop grid now gives the featured card and timeline enough room
    to match the guide's full-width intent without stretched text or cards.
  - Mobile remains readable and contained, but fully stacked and tall.
  - Remaining refinement before migration: the first real article is still
    `Later Years`, not the guide's `Early Years`; biography ordering/content
    needs the owner decision already captured by T-162.
- Blog:
  - The split lead story and four-card row use the expanded desktop canvas well;
    text measure, CTA placement, image framing, and secondary-card spacing are
    stable after images load.
  - Mobile stacks cleanly without horizontal overflow.
  - Remaining refinement before migration: the section still uses latest real
    blog entries, including `In Loving Memory of Joseph Laoutaris` with
    `1935 - 2023`, while earlier notes reference `1935 - 2022` and the guide
    image reads as biography-style content. Owner still needs to confirm blog
    content strategy and canonical dates.
- Shop:
  - The widened rail benefits from the expanded canvas: desktop shows multiple
    complete product cards plus a partial next card, and mobile keeps the rail
    contained with reachable controls.
  - Product cards load and frame correctly after the section is reached, but
    remote Shopify image optimization can leave blank image panels during the
    initial lazy-load window; consider a production placeholder/perceived-load
    treatment if this prototype migrates.
  - Remaining refinement before migration: current product metadata still
    renders generic `ARCHIVE PRODUCT` labels and some truncated titles. Owner/
    commerce approval is still needed for `Available now`, visible prices,
    `View full shop`, `Explore the shop`, `Details`, and the broader commerce
    assurance copy visible below the section.
- Cross-section note: hash/`scrollIntoView` positioning can still tuck the
  first section label or heading under the fixed header/breadcrumb chrome.
  Before production migration, add section scroll-margin or adjust the live
  homepage chrome if anchor-style navigation will target these sections.
- Recommended next action: send the expanded prototype to the owner for visual
  direction review. Do not migrate to the live homepage or start the
  semantic style-system pilot until the owner accepts the wider direction and
  resolves the biography order, blog strategy/date, commerce wording, mobile
  density, and anchor/chrome decisions.
- Candidate tracker updates for the orchestrator: mark T-168 complete; record
  that `/prototype/home` is owner-review-ready as a widened prototype, with
  production migration and style-system pilot still blocked on owner approval
  and the remaining content/commerce refinements above.
- Verification: local `npm run dev` on `http://localhost:3000`,
  `curl -I http://localhost:3000/prototype/home` returned `HTTP/1.1 200 OK`,
  targeted headless Chrome desktop/mobile section checks, and
  `git diff --check`.
