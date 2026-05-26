# T-194 Review Framed Print Preview Visual QA

Status: Completed

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
- Completed targeted visual QA on 2026-05-26 against local
  `http://localhost:3005/prototype/frame`.
- Outcome: `/prototype/frame` is not ready for owner review as-is. The desktop
  room and close-up direction is usable for internal review, but a targeted
  responsive refinement should run before owner signoff because narrow/mobile
  room and modal previews crop the framed object.
- Evidence scope was intentionally small: one desktop room/material pass, one
  desktop modal pass, one desktop bright-room switch pass, one narrow route
  pass, one narrow modal pass, and DOM/style measurements. No traces, videos,
  full DOM dumps, or large screenshot sets were collected or committed.
- Desktop findings:
  - Default `Modern Gallery` room context rendered with centered hanging
    placement and credible scale. The framed print stayed in the centered
    hanging zone, and the selected room label matched the loaded room.
  - Buffered room switching behaved as intended in DOM state: selecting `White
    Plaster Hallway` first left `data-room-transitioning="true"` while the
    previous room remained visible, then settled to
    `data-room-transitioning="false"` with the new room label after load.
  - Frame rails use non-repeating panel backgrounds across all five materials.
    DOM checks for `Black Wood`, `White Wood`, `Natural Oak`, `Walnut`, and
    `Brushed Metal` reported `backgroundRepeat: no-repeat` for every rail and
    no `repeating-linear-gradient` rail background.
  - Mat spacing was even on the inspected close-up states. The default warm
    mat measured equal top/right/bottom/left padding, and material changes kept
    mat padding balanced.
  - Mitred rail geometry, bevels, inner bevel, and the glass-sheen overlay were
    visible in the desktop modal. Natural Oak was the strongest reviewed
    material; Black Wood also reads cleanly in room context. Procedural material
    panels still look like a good prototype direction rather than final texture
    assets.
  - Desktop modal opened, fit within the viewport, rendered the artwork after
    image load, supported material swatches/previous/next controls, and closed
    with Escape.
- Narrow/mobile findings:
  - The route stacks controls correctly and keeps inputs/buttons usable at
    `390x844`.
  - The room-scale framed object overflows the room scene vertically on narrow
    width. Captured geometry: room scene `358x224`; room frame `169x220` with
    frame top at `y=151` while the scene begins at `y=172`, so the frame starts
    above the scene crop.
  - The mobile modal dialog fits the viewport, but the framed preview is too
    wide for the dialog and crops horizontally. Captured geometry: dialog
    `358x776`; frame `430x560` with frame `x=-20`.
  - These two narrow-width issues are the blocking refinement before owner
    review or product-page rail adoption.
- Room-context notes:
  - `Modern Gallery` is the strongest currently observed room for desktop
    review because furniture, wall tone, and cast shadow read naturally.
  - Bright white candidates remain useful for owner comparison, but they should
    be reviewed after the narrow room scaling fix. The owner still needs to
    choose which generated rooms should remain in the product-page subset.
- Shadow notes:
  - The verified default shadow values were right offset `6`, bottom offset
    `6`, edge blur `6`, diffusion `10`, spread `-1`, darkness `28`.
  - Those defaults read acceptable in the desktop `Modern Gallery` context.
    Do not hard-code alternate preferred values yet; ask the owner to choose
    shadow values after the room subset is selected and the mobile scale issue
    is fixed.
- Sample/product notes:
  - Prototype sample states reviewed: `Sample A` default, Natural Oak material,
    `White Plaster Hallway`, `Bright Loft`, desktop modal, mobile route, and
    mobile modal.
  - No live product handles were reviewed in this task because T-194 scopes
    owner review to `/prototype/frame` only.
- Owner decisions needed before the next implementation slice:
  - Which room backgrounds to keep for owner/product-page review, especially
    whether the current first four shared scenes are still preferred over the
    newer bright white-wall candidates.
  - Whether product pages should receive the rail renderer only after the
    mobile room/modal overflow fix.
  - Whether procedural material panels are acceptable for first product-page
    rollout, or whether a separate real texture-asset slice should happen
    first.
  - Whether the default wall shadow values above are acceptable for selected
    rooms, or whether the owner wants per-room shadow tuning.
  - Whether Shopify option mapping should remain paused until real frame
    material/availability ownership is decided. Recommendation from this
    review: keep Shopify option mapping and physical-dimension work paused.
- Candidate tracker updates for the orchestrator:
  - Mark T-194 complete in the task index.
  - Add a follow-up task for narrow/mobile framed preview scaling before owner
    review or product-page rail adoption.
  - Keep shared workstreams unchanged until that follow-up is assigned.
- Verification:
  - `curl -I http://localhost:3005/prototype/frame`: returned `200 OK`.
  - Targeted headless Chrome checks at `1440x1000` and `390x844`: completed
    with the observations above.
