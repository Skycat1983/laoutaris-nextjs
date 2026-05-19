# T-148 Standardize Admin Article Blog Form Errors

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Apply the T-144 structured admin API error-display pattern to article and blog
create/update forms.

## Context

- T-144 fixed the collection form slice from A-011/F-094 and preserved
  structured error-envelope fields through `createFetcher()`.
- Article and blog create/update forms still catch failed submissions or ignore
  unsuccessful API responses without surfacing route-authored field/form
  errors to operators.
- Admin article/blog routes already return structured validation responses for
  image URL, section, artwork relationship, slug conflict, and other write
  validation failures.

## Scope

In scope:

- Surface structured field/form errors in article create/update forms.
- Surface structured field/form errors in blog create/update forms.
- Ensure failed article/blog API responses do not call `onSuccess`.
- Preserve existing successful reset, refresh, preview, artwork lookup, and
  callback behavior.
- Extract a small shared form-error helper only if it reduces duplication and
  remains client-safe.
- Add focused form tests for representative article and blog field/form errors
  and preserved success callbacks.

Out of scope:

- Do not change admin route schemas, validation messages, or persistence.
- Do not change collection forms except for a tiny helper import if a shared
  helper is extracted.
- Do not change artwork or Shopify product-link forms in this slice.
- Do not add blog pinned/tag controls; that remains F-096.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-147 and T-149 because it owns only article/blog
admin forms, optional local form-error helper code, and focused form tests.

Owned files:

- `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- optional client-safe helper under
  `src/components/features/adminDashboard/crudForms/`
- focused admin article/blog form tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateArticleForm.tsx`
- `src/components/features/adminDashboard/crudForms/create/CreateBlogForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateBlogForm.tsx`
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx`
- `docs/tasks/T-148-standardize-admin-article-blog-form-errors.md`

## Acceptance Criteria

- Article create/update field or form errors from the API are visible in the
  form.
- Blog create/update field or form errors from the API are visible in the form.
- Failed article/blog responses do not invoke success callbacks.
- Existing successful submit behavior remains covered.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx
git diff --check
```

Run the T-144 collection form test too if a shared helper touches collection
forms.

## Handoff Notes

- Prepared after T-144 completed the collection form slice.
- Completed article/blog form slice:
  - Added a client-safe `applyApiFormErrors()` helper for mapping structured
    `fieldErrors`/`formErrors` into React Hook Form field or root errors.
  - Article create/update forms now clear stale errors on submit, surface
    structured API failures, show artwork relationship errors near the artwork
    controls, and only call `onSuccess` on `success: true`.
  - Blog create/update forms now surface structured API failures, preserve
    create reset/refresh behavior, and only call success callbacks on
    `success: true`.
  - Added focused coverage in
    `__tests__/unit/forms/adminArticleBlogForms.test.tsx` for representative
    article/blog field and form errors plus preserved success callbacks.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx`
    passed.
  - `git diff --check` passed.
- Candidate follow-up: keep artwork form/product-link error surfacing as a
  later separate slice if it remains useful after this task.
