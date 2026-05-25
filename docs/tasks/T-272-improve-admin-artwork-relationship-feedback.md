# T-272 Improve Admin Artwork Relationship Feedback

Status: Completed

Workstream: [Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md).

## Goal

Improve article and collection artwork relationship controls so manual ObjectId
lookup failures, duplicate adds, and unchanged states are visible to operators.

## Context

- A-031 found article update silently ignores failed linked-artwork fetches.
- A-031 found collection update silently ignores duplicate adds and failed
  lookups, with TODOs already present in the form.
- A full picker/search experience can wait; visible lookup feedback is the
  smallest useful operator improvement.

## Scope

In scope:

- Add visible lookup failure, duplicate, and unchanged/ready states for article
  and collection artwork relationship controls.
- Keep manual ObjectId entry as an escape hatch.
- Preserve existing route validation and submit contracts.
- Add focused form tests.

Out of scope:

- Full searchable relationship picker.
- Create-collection artwork attachment unless trivial and already supported by
  existing route contracts.
- Relationship changes outside article/collection artwork links.

## Concurrency

Can run in parallel with T-271 only if it does not touch shared form helpers
both tasks need. Avoid parallel edits to article/collection admin forms.

## Files Likely Touched

- Article create/update form files
- Collection update form files
- Focused admin form tests
- This task and `docs/tasks/README.md`

## Completion Contract

- Update this task and task index.
- Record verification and any deferred full-picker task.

## Acceptance Criteria

- Operators receive visible feedback for not-found artwork IDs, duplicate adds,
  and no-op relationship states.
- Existing successful relationship add/remove behavior remains intact.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx
git diff --check
```

## Completion Notes

- Added visible article artwork replacement feedback for empty lookup,
  not-found lookup, lookup failure, unchanged current artwork, and ready-to-save
  replacement states.
- Added visible collection artwork relationship feedback for empty lookup,
  not-found lookup, lookup failure, duplicate adds, ready adds, ready removals,
  and remove-then-restore no-op states.
- Preserved manual ObjectId entry and the existing article/collection submit
  contracts.
- Kept a full searchable relationship picker out of scope; that remains a
  future archive-maintenance improvement.
- Added focused form tests for the new article and collection relationship
  feedback states.

## Verification Results

```bash
npm test -- --runTestsByPath __tests__/unit/forms/adminArticleBlogForms.test.tsx __tests__/unit/forms/adminCollectionForms.test.tsx
# Passed: 2 suites, 23 tests

git diff --check
# Passed
```

## Handoff Notes

- Completed from A-031 F-A031-002.
- `__tests__/unit/forms/adminArticleBlogForms.test.tsx` now has a file-local
  `jest.setTimeout(20000)` because this existing combined article/blog form
  suite exceeds Jest's 5-second default per-test timeout under parallel jsdom
  workers.
