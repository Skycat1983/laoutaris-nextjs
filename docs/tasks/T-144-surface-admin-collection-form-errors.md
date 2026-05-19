# T-144 Surface Admin Collection Form Errors

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make admin collection create/update failures visible to operators, and ensure a
successful collection create invokes its operation success callback.

## Context

- A-011/F-094 found admin create/update forms often catch route validation
  failures and return without surfacing API field/form errors.
- `CreateCollectionForm` accepts `onSuccess` from `CollectionOperations`, but
  currently resets and refreshes after persistence without calling it.
- Admin collection routes now return structured validation errors, including
  image URL and relationship errors that should be visible at the form boundary.
- T-020 and T-135/T-142 hardened collection route validation, so this task
  should treat route errors as authoritative instead of duplicating route logic
  in the client.

## Scope

In scope:

- Update `CreateCollectionForm` so successful persistence calls `onSuccess`
  after preserving the existing reset/refresh behavior as appropriate.
- Surface failed collection create API responses through React Hook Form
  field-level or form-level errors instead of silently returning.
- Surface failed collection update API responses, including `artworksToAdd`
  relationship failures, without swallowing rejected responses or exceptions.
- Add focused form tests for:
  - create success calls `onSuccess`;
  - create route validation failures are visible to the operator;
  - update route validation failures are visible to the operator;
  - existing submit/loading behavior is not regressed.

Out of scope:

- Do not change admin route schemas, persistence contracts, or relationship
  verification semantics.
- Do not redesign collection artwork selection UI beyond the minimum error
  display needed for this task.
- Do not migrate article, blog, artwork, or Shopify product-link forms unless a
  tiny local helper is unavoidable and covered by this task's tests.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-145 and T-146 because it owns only admin collection
form behavior and focused form tests.

Owned files:

- `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- a focused admin collection form test file, likely under
  `__tests__/unit/forms/`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/components/features/adminDashboard/crudForms/create/CreateCollectionForm.tsx`
- `src/components/features/adminDashboard/crudForms/update/UpdateCollectionForm.tsx`
- `__tests__/unit/forms/adminCollectionForms.test.tsx`
- `docs/tasks/T-144-surface-admin-collection-form-errors.md`

## Acceptance Criteria

- Collection create success triggers the parent success callback used by
  `CollectionOperations`.
- Collection create/update route validation failures are displayed in the form
  and are not hidden by empty catches.
- Field-specific route errors land on the matching visible field when possible;
  otherwise a visible form-level error is shown.
- Focused tests cover success and failed-response behavior.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminCollectionForms.test.tsx
git diff --check
```

Run broader `npm run lint` or adjacent admin form tests if extracting a shared
form-error helper or touching shared form components.

## Handoff Notes

- Prepared after T-141/T-142 reconciliation from A-011/F-094.
- Completed collection form slice:
  - `CreateCollectionForm` now clears stale errors on submit, maps structured
    route field/form errors into visible React Hook Form errors, preserves
    reset/refresh behavior on success, and calls `onSuccess`.
  - `UpdateCollectionForm` now maps structured route errors into visible
    field/form errors, including `artworksToAdd` relationship failures, and
    surfaces rejected update submissions.
  - `createFetcher()` now preserves structured error-envelope fields such as
    `fieldErrors` and `formErrors` instead of returning only `error`; this was
    required for route-authored validation details to reach client forms through
    the existing API client.
- Added focused coverage in
  `__tests__/unit/forms/adminCollectionForms.test.tsx` and updated
  `__tests__/unit/api/createFetcher.test.ts`.
- Verification:
  - `npm test -- --runTestsByPath __tests__/unit/forms/adminCollectionForms.test.tsx __tests__/unit/api/createFetcher.test.ts`
    passed.
  - `git diff --check` passed.
  - `npx tsc --noEmit --pretty false` was attempted and failed on existing
    unrelated repository-wide type errors in admin read route tests, navigation
    loader/page tests, session header tests, and other baseline areas; no new
    collection-form errors were reported.
- Candidate follow-up: standardize the same structured admin API error display
  pattern across article, blog, artwork, and Shopify product-link admin forms.
