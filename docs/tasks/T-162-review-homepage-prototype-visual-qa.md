# T-162 Review Homepage Prototype Visual QA

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Review `/prototype/home` against the owner-provided design-guide images and
produce a concise refinement/owner-feedback handoff before any production
homepage migration.

## Context

- T-157 created the isolated full-width `/prototype/home` route.
- T-158, T-159, and T-160 added image-guided biography, blog, and shop teaser
  sections backed by real data.
- T-161 audited the style-system point of truth and recommends a semantic
  style-map pilot only after the prototype visual direction settles.
- The guide images live in `to_prototype/biography.png`,
  `to_prototype/blog.png`, and `to_prototype/shop.png`.

## Scope

In scope:

- Run the prototype route locally and inspect `/prototype/home`.
- Compare the biography, blog, and shop prototype sections against their guide
  images at desktop and a narrow/mobile viewport.
- Check for obvious text overlap, broken image states, unreadable type,
  awkward cropping, horizontal overflow, and misleading shop/commerce copy.
- Verify that the live homepage remains unchanged.
- Produce a concise section-by-section handoff with accepted areas, refinements,
  and owner decisions needed.

Out of scope:

- Do not redesign or edit prototype section code in this task.
- Do not migrate prototype sections into the live homepage.
- Do not create the semantic style map yet.
- Do not run broad traces, videos, full DOM dumps, or large screenshot sets.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-156 because it is read-only and limited to prototype
QA. Do not run in parallel with another task actively editing
`src/components/prototypes/home/*` unless the QA agent is told to review a
specific commit after edits land.

Owned files:

- this task brief handoff section
- optional concise QA note under `docs/assessments/` if screenshots or findings
  need a durable location

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `to_prototype/biography.png`
- `to_prototype/blog.png`
- `to_prototype/shop.png`
- `src/app/prototype/home/page.tsx`
- `src/components/prototypes/home/*`

## Acceptance Criteria

- The handoff identifies whether each prototype section is ready for owner
  review, needs visual refinement, or needs content/data correction.
- The handoff records any owner-facing decisions in simple terms.
- Browser/screenshot evidence is tightly scoped and not noisy.
- No runtime code changes are made.

## Verification

```bash
npm run lint
git diff --check
```

If browser automation is used, keep it to targeted `/prototype/home` desktop
and mobile screenshots or viewport checks only.

## Agent Prompt

You are working on T-162. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Review `/prototype/home` against
`to_prototype/biography.png`, `to_prototype/blog.png`, and
`to_prototype/shop.png`. This is a QA/owner-feedback task only: do not edit the
prototype implementation, global CSS, live homepage, or shared trackers. Use
tightly scoped browser/screenshot checks if needed, avoiding traces, videos,
full DOM dumps, and large screenshot sets. Produce a concise section-by-section
handoff that says what is ready, what needs refinement, and what decisions the
owner needs to make before production migration. Run lint only if source files
were touched unexpectedly; otherwise run `git diff --check` and update only
this task handoff.

## Handoff Notes

- 2026-05-20 QA pass against `/prototype/home` at 1448px desktop and 390px
  mobile using section-scoped screenshots only.
- Ready for owner review:
  - Biography: the desktop timeline/card composition is structurally close to
    `to_prototype/biography.png`; type is readable, images render, and no
    page-level horizontal overflow was observed.
  - Blog: the split lead story plus four-card grid is stable at desktop and
    stacks cleanly on mobile; no text overlap or page-level horizontal overflow
    was observed.
  - Shop: the horizontal product rail, controls, product cards, and prices
    render at desktop and mobile; rail overflow is contained inside the
    scroller and does not create body-level horizontal overflow.
- Needs visual refinement:
  - Biography: the featured item currently differs from the guide because the
    first rendered article is `Later Years`, not `Early Years`; this also
    changes the featured image from the sketch in the guide to the magenta work.
  - Blog: the implemented layout matches the broad split-hero/grid structure,
    but the guide image uses biography copy and biography article imagery while
    the prototype uses real blog posts. Owner should confirm whether this guide
    is meant to be a blog section or a second biography layout.
  - Shop: product cards are visually usable, but the current data produces
    generic `ARCHIVE PRODUCT` labels and title truncation on longer products;
    this is less polished than the guide's medium/year treatment.
  - Mobile: all sections are readable, but anchor-style section positioning can
    place large headings under the existing app header/breadcrumb chrome during
    screenshot capture. Before migration, decide whether prototype sections need
    scroll-margin or live-homepage chrome adjustments.
- Needs content/data correction:
  - Biography article ordering needs to be curated or sorted if the guide order
    is canonical: `Early Years`, `Meeting Beryl`, `Later Years`, `Obituary`,
    `Ethos`.
  - Blog lead content shows `In Loving Memory of Joseph Laoutaris` with
    `1935 - 2023`, while other prototype/biography content references
    `1935 - 2022`; confirm and correct the canonical dates before production
    migration.
  - Blog card imagery/content does not match `to_prototype/blog.png` because the
    prototype is using latest blog entries rather than curated guide content.
  - Shop product metadata should be completed or mapped before migration so
    cards can show meaningful type/medium/year labels instead of generic
    `ARCHIVE PRODUCT`.
- Owner decisions needed before production migration:
  - Decide whether the guide images define exact curated content/order or only
    layout direction.
  - Decide whether the blog section should feature real latest posts, curated
    posts, or the biography-style content shown in `to_prototype/blog.png`.
  - Approve commerce wording before launch: `Available now`, `Explore the shop`,
    `View full shop`, visible prices, and `Details` imply purchasable products.
    If checkout, inventory, shipping, refunds, or enquiry-only flows are not
    production-approved, revise the copy/CTA model first.
  - Decide whether mobile homepage teasers should remain fully stacked or use a
    more compact carousel/rail treatment for biography and blog cards.
- Verification: local `npm run dev` on `http://localhost:3000`,
  section-scoped headless Chrome screenshots/metrics, and `git diff --check`.
