# T-153 Add Admin Blog Pinned Tag Controls

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Expose the route-supported blog `pinned` and `tags` fields in admin create and
update workflows, and replace stale blog read filters with current options.

## Context

- T-055 aligned persisted blog `imageUrl`, `pinned`, and `tags` contracts at
  the model/schema/admin route boundary.
- F-096 remains open because visible blog create/update forms still omit
  `pinned` and `tags`, and `BlogFilterDropdowns` hard-codes stale year filter
  values instead of deriving current or data-backed options.
- `BLOG_TAGS` in `src/lib/constants/blogConstants.ts` is the canonical tag
  source.

## Scope

In scope:

- Add visible blog create controls for `pinned` and `tags`.
- Add visible blog update controls that initialize and persist existing
  `pinned` and `tags` values.
- Use `BLOG_TAGS` for tag options instead of duplicating tag literals.
- Update blog read filters to avoid stale hard-coded year options. Prefer
  deriving years from returned blog data or using current-year bounded options.
- Preserve existing image URL validation, display date behavior, successful
  callbacks, and structured error display.
- Add focused tests for create/update pinned/tag submission and read-filter
  option behavior.

Out of scope:

- Do not change blog route schemas or model persistence unless a current form
  type mismatch makes the visible controls impossible.
- Do not add public tag pages, tag search, or URL-backed blog tag filtering.
- Do not change public blog list sorting or pagination.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-154 and T-155 because it owns blog admin form and
blog read-filter UI behavior.

Owned files:

- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/inputs/BlogFilterDropdowns.tsx`
- focused blog admin form/read-list tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `src/components/features/adminDashboard/inputs/BlogFilterDropdowns.tsx`
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `docs/tasks/T-153-add-admin-blog-pinned-tag-controls.md`

## Acceptance Criteria

- Admin blog create can submit explicit `pinned` and `tags` values.
- Admin blog update initializes existing `pinned` and `tags` values and can
  persist replacements.
- Blog tag options come from `BLOG_TAGS`.
- Blog read filters no longer rely on the stale fixed `2020` through `2024`
  year list.
- Focused tests cover the new visible controls and preserved success/error
  behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx
git diff --check
```

Run `npm run lint` because this touches client form controls.

## Handoff Notes

- Prepared after T-150 through T-152 reconciliation.
- Completed blog create/update pinned and tag controls. Form schemas now include
  `pinned` and `tags`, create defaults submit `false`/`[]`, update initializes
  existing values with legacy-safe fallbacks, and tag checkboxes are generated
  from `BLOG_TAGS`.
- Replaced stale fixed blog read-filter year options with years derived from
  returned blog data.
- Added focused coverage for create submission, update initialization and
  replacement submission, canonical tag options, and read-filter year option
  derivation.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx`,
  `npm run lint`, and `git diff --check`.
- Candidate shared-tracker update: mark F-096 partially mitigated or resolved
  depending on whether both visible pinned/tag controls and stale read-filter
  behavior are addressed.
