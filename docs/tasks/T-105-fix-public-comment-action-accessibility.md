# T-105 Fix Public Comment Action Accessibility

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Convert public comment edit, save, cancel, and delete icon actions into
semantic labelled controls without changing comment ownership checks, edit
state, mutation routes, validation, callbacks, or visible layout.

## Context

- F-062 remains partially mitigated after T-013 and T-104.
- T-104 resolved the public search, drawer, mobile navigation, and
  unauthenticated artwork intent control slice.
- `src/components/modules/cards/CommentCard.tsx` still renders owner-only
  icon-only `Button` controls for edit, delete, cancel, and save using Lucide
  icons without stable accessible names.
- Comment route validation, ownership enforcement, and mutation behavior were
  already handled separately by T-012 and should not be changed here.

## Scope

- In scope:
  - Add stable accessible names to `CommentCard` owner action buttons for edit,
    delete, cancel editing, and save updated comment.
  - Ensure icon-only comment action buttons are explicit non-submit buttons
    where appropriate.
  - Mark decorative Lucide icons as hidden from assistive technology when the
    button text alternative is supplied by the control.
  - Preserve existing owner-only rendering, loading disabled state, edit-mode
    transitions, delete/update callbacks, and modal error behavior.
  - Add focused component or source tests for the accessible names and button
    semantics.
  - Update this task brief and relevant workstreams after completion.
- Out of scope:
  - Comment API route validation, ownership, persistence, or response shapes.
  - Comment posting notice, moderation/reporting policy, privacy/retention
    copy, or other A-020 policy work.
  - Broader landmark/heading cleanup, metadata/JSON-LD, image tuning, or
    route-local cache policy.
  - Visual redesign of comment cards or comment forms.

## Files Likely Touched

- `src/components/modules/cards/CommentCard.tsx`
- Existing or new focused tests under `__tests__/unit/`
- `docs/tasks/T-105-fix-public-comment-action-accessibility.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`

## Acceptance Criteria

- Owner-only comment edit/delete buttons are keyboard-focusable buttons with
  stable accessible names.
- Edit-mode cancel/save buttons are keyboard-focusable buttons with stable
  accessible names.
- Icon-only controls do not rely on icon SVG names for their accessible names.
- Existing edit, save, cancel, delete, loading, callback, and error behavior is
  preserved.
- Focused tests cover the changed controls or source-level invariants.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/commentActionAccessibility.test.tsx
npm run lint
npm run build
git diff --check
```

## Handoff Notes

- Prepared after T-104 resolved F-088/R-031 and the search/navigation slice of
  F-062.
- Completed on 2026-05-18. `CommentCard` owner edit/delete and edit-mode
  cancel/save controls now have stable accessible names, explicit non-submit
  button semantics, and decorative hidden Lucide icons.
- Added `__tests__/unit/commentActionAccessibility.test.tsx` for owner-only
  rendering, button names/types, edit-mode action names, and hidden icon
  source independence.
- Verification passed: focused Jest, `npm run lint`, `npm run build`, and
  `git diff --check`.
- Keep public policy notices, comment moderation/reporting, and retention
  expectations separate under A-020/F-075.
