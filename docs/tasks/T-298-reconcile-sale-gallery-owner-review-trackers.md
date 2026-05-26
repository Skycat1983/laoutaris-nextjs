# T-298 Reconcile Sale Gallery Owner Review Trackers

Status: Completed

Workstreams:

- [Shopify Commerce](../workstreams/shopify-commerce.md)
- [Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)
- [Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Reconcile the shared finding, risk, workstream, task, and orchestration trackers
after the completed sale-gallery owner-review chain.

## What This Does

This task updates the shared project trackers so they reflect the current
post-T-297 state: the print and original sale-gallery routes are scoped
owner-review-ready, the book candidate remains blocked on durable Shopify
metadata, and further commerce/design implementation must wait for owner
decisions recorded in the owner packet.

## Why This Exists

T-293 through T-297 completed the agent-side sale-gallery follow-up work, but
the durable finding and production-risk rows still describe the earlier
pre-review state from T-261/T-267. Without reconciliation, a future agent could
reassign completed visual QA or start broader commerce work before the owner
has approved the decision packet.

## Context

- T-293 completed the first narrow live sale-gallery visual QA pass.
- T-294 hardened product-kind classification so ambiguous untyped products do
  not render as originals from generic `artwork` fallback wording.
- T-295 rechecked the named original route and marked it scoped
  owner-review-ready.
- T-296 documented the Shopify metadata required before repeat book
  sale-gallery QA.
- T-297 created the owner-facing packet at
  [sale-gallery-owner-review-packet.md](../prototypes/sale-gallery-owner-review-packet.md).

## Scope

In scope:

- Update F-131 in
  [findings-register.md](../audits/findings-register.md) with the T-293 through
  T-297 outcome.
- Update R-037 in
  [production-readiness.md](../risks/production-readiness.md) with the same
  distinction between completed scoped QA and remaining owner/data blockers.
- Update the Shopify, frontend, and testing workstream progress/next-action
  notes only as needed to prevent reassigning completed sale-gallery work.
- Update this task brief, [docs/tasks/README.md](README.md), and
  [orchestration state](../orchestration/state.md) after completion.

Out of scope:

- Do not edit runtime source, tests, sale-gallery components, frame-preview
  components, CSS, Shopify data, product data, product images, room
  backgrounds, or the owner packet content except for link or typo fixes needed
  by tracker references.
- Do not mark F-131 or R-037 fully resolved unless the tracker evidence clearly
  supports it. The expected conservative outcome is that scoped review is
  complete while owner/data decisions remain open.
- Do not create implementation tasks for rail adoption, material assets,
  Shopify option mapping, physical dimensions, checkout/cart behavior, enquiry
  mutation, or repeat book QA.

## Concurrency

This docs-only task should not run in parallel with another task editing shared
trackers for F-131, R-037, the sale-gallery workstreams, the task index, or
orchestration state.

This task owns:

- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/tasks/T-298-reconcile-sale-gallery-owner-review-trackers.md`
- `docs/tasks/README.md`
- `docs/orchestration/state.md`
- relevant Shopify/frontend/testing workstream notes

Leave unrelated dirty files alone.

## Files Likely Touched

- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`
- `docs/tasks/T-298-reconcile-sale-gallery-owner-review-trackers.md`
- `docs/tasks/README.md`
- `docs/orchestration/state.md`
- `docs/workstreams/shopify-commerce.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Completion Contract

- Mark this task `Status: Completed` only after the tracker updates and
  verification are complete.
- Record exactly how F-131 and R-037 were updated.
- Keep the remaining owner decisions and Shopify metadata blocker visible.
- State that no runtime source, tests, product data, or Shopify metadata changed.

## Acceptance Criteria

- F-131 and R-037 reference the T-293 through T-297 sale-gallery outcomes.
- Trackers clearly distinguish completed print/original scoped review from the
  blocked book metadata path and owner-gated implementation decisions.
- The next-action text routes future work through the owner packet and avoids
  reassigning completed T-293 through T-297 work.
- No runtime behavior or product data changes are made.

## Verification

```bash
git diff --check
```

## Handoff Notes

- Planned on 2026-05-26 after T-297 completed the owner-facing sale-gallery
  review packet.
- Completed on 2026-05-26 as a docs-only tracker reconciliation.
- F-131 was updated to reference T-293 through T-297, mark the print/original
  sale-gallery routes as scoped owner-review-ready, keep the book candidate
  blocked on durable Shopify metadata, and route further rail/material/option/
  dimension/cart/enquiry/repeat-book work through the owner packet.
- R-037 was updated with the same distinction: A-028 runtime hotspots are mostly
  mitigated, scoped sale-gallery QA is complete for print/original, and
  remaining commerce/design implementation is owner/data gated.
- No runtime source, tests, product data, product images, Shopify metadata,
  sale-gallery components, frame-preview components, CSS, or owner packet
  content changed.
- Verification: `git diff --check` passed.
