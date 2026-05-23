# T-194 Review Framed Print Preview Visual QA

Status: Planned

Workstream:
[Shopify Commerce](../workstreams/shopify-commerce.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

Architecture:
[Framed print preview](../architecture/framed-print-preview.md)

## Goal

Run targeted visual QA and owner-decision capture for `/prototype/frame` after
the rail material-panel pass, before deciding whether to apply the rail renderer
to product pages, add real texture assets, or continue toward Shopify option
mapping.

## Context

- T-187 through T-191 built the frame preview foundation, modal shell,
  prototype route, and product-page preview launcher.
- T-192 added the prototype-only rail renderer with bevels, mitred joins,
  material intent, mat margin presets, generated room-wall backgrounds, fixed
  artwork sizing, centered hanging placement, buffered room switching, and
  prototype shadow controls.
- T-193 replaced repeated stripe textures with non-repeating material panel
  backgrounds in the prototype rail renderer.
- Product-page previews still use the simple renderer. `/prototype/frame` is
  the review surface for the rail treatment and room context.

## Scope

In scope:

- Run `/prototype/frame` locally and inspect the prototype at targeted desktop
  and mobile/narrow widths.
- Review close-up frame materials and room-context previews.
- Check buffered room switching, centered hanging placement, fixed-print mat
  behavior, even mat spacing, material panel appearance, mitred joins, bevels,
  corner shadows, right/down wall shadow controls, and modal behavior.
- Record eligible/ineligible product handles or sample states observed when
  useful for owner review.
- Capture concise owner decisions needed before the next implementation slice:
  room backgrounds to keep, whether the rail renderer should move to product
  pages now, whether real texture assets are needed first, and preferred shadow
  values across selected room backgrounds.
- Keep browser/screenshot evidence targeted. Summarize findings in this task
  handoff instead of pasting large logs, full DOM dumps, traces, or videos.

Out of scope:

- Do not edit runtime source, prototype components, product pages, frame
  profiles, room assets, global CSS, or shared trackers unless the orchestrator
  explicitly expands the task.
- Do not apply the rail renderer to product pages.
- Do not generate, add, or replace real texture image assets.
- Do not start Shopify option mapping, checkout/cart work, enquiry mutation,
  frame selection persistence, or physical dimension migration.
- Do not change commerce copy or imply selected frames are purchasable.

## Concurrency

Run this as a focused review task after T-193. It can run in parallel with
unrelated backend/docs tasks because it should be read-only.

Owned files:

- this task brief handoff section only
- optional concise assessment note if screenshot references or owner notes need
  a durable location

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `src/app/prototype/frame/page.tsx`
- `src/components/prototypes/frame/FramePreviewPrototype.tsx`
- `src/components/shop/frame-preview/FramedArtworkPreview.tsx`
- `src/components/shop/frame-preview/FramedPrintPreviewModal.tsx`
- `src/lib/framePreview/*`
- `public/prototypes/frame-backgrounds/*`
- `docs/architecture/framed-print-preview.md`
- `docs/tasks/framed-print-preview-implementation-plan.md`

## Acceptance Criteria

- Handoff states whether `/prototype/frame` is owner-review-ready, needs another
  targeted visual refinement, or should pause.
- Handoff records specific visual findings for close-up frame materials and room
  contexts.
- Handoff records owner decisions needed before product-page rail adoption,
  texture asset creation, Shopify option mapping, or physical-dimension work.
- Browser/screenshot evidence is targeted and summarized, with no broad traces,
  videos, full DOM dumps, or large screenshot sets.
- No runtime code changes are made.

## Verification

```bash
git diff --check
```

If browser automation is used, keep it targeted to `/prototype/frame` at one
desktop width and one mobile/narrow width, plus only the specific room/material
states needed for the review. Start a local dev server if one is not already
available.

## Agent Prompt

You are working on T-194. Read `AGENTS.md`, `docs/README.md`,
`docs/architecture/framed-print-preview.md`,
`docs/tasks/framed-print-preview-implementation-plan.md`, T-192, T-193, and the
Shopify/frontend/testing workstreams. Run targeted visual QA on
`/prototype/frame` after the material-panel rail pass. This is a review and
owner-decision task only: do not edit runtime code, prototype components,
product pages, frame profiles, room assets, global CSS, commerce behavior, or
shared trackers. Inspect desktop and mobile/narrow behavior, close-up frame
materials, room-context candidates, buffered room switching, centered hanging
placement, fixed-print mat behavior, even mat spacing, mitred joins, bevels,
corner shadows, wall shadow controls, and modal behavior. Record concise
findings, owner-review readiness, preferred room/shadow/material notes, and
decisions needed before product-page rail adoption, texture assets, Shopify
option mapping, checkout/cart work, enquiry mutation, or physical-dimension
migration. Run `git diff --check`.

## Handoff Notes

- Prepared 2026-05-23 after T-139 recorded the monitoring decision blocker and
  no other planned task brief remained open.
