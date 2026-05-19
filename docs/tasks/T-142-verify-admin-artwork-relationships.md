# T-142 Verify Admin Artwork Relationships

Status: Completed

Workstream:
[Data Models And API](../workstreams/data-models-and-api.md),
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add route-local existence checks so admin article and collection relationship
writes cannot persist valid-looking but missing artwork references.

## Context

- A-011/F-093 found article create/update and collection update validate
  ObjectId shape but do not verify referenced artwork records exist before
  persistence.
- Existing UI lookups are helpful but not authoritative; the API boundary must
  protect persisted relationships.
- T-020/T-034 already established strict admin route schemas and focused route
  tests for collection and article writes.

## Scope

In scope:

- Verify article `artwork` references exist before article create/update
  persistence.
- Verify collection `artworksToAdd` references exist before collection update
  persistence.
- Preserve existing `artworksToRemove` semantics unless current code already
  treats missing IDs as an error; document any intentionally unchanged behavior
  in the task handoff.
- Return structured `400` or `404` field/form errors for missing-but-valid
  artwork IDs.
- Add focused route tests for missing referenced artwork IDs and preserved
  success paths.

Out of scope:

- Do not redesign collection relationship semantics or admin UI selection
  workflows.
- Do not add cascade previews or delete behavior changes.
- Do not change Shopify product-link validation or persistence-time Shopify API
  calls.
- Do not change public article/collection routes.

## Concurrency

Can run in parallel with T-141 or T-143 if edits remain scoped to article and
collection admin write routes/tests.

Owned files:

- `src/app/api/v2/admin/article/create/route.ts`
- `src/app/api/v2/admin/article/update/[id]/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- focused admin article/collection route tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Touched

- `src/app/api/v2/admin/article/create/route.ts`
- `src/app/api/v2/admin/article/update/[id]/route.ts`
- `src/app/api/v2/admin/collection/update/[id]/route.ts`
- `__tests__/unit/api/adminArticleRoute.test.ts`
- `__tests__/unit/api/adminCollectionRoute.test.ts`
- `docs/tasks/T-142-verify-admin-artwork-relationships.md`

## Acceptance Criteria

- Admin article create/update reject a valid ObjectId when no matching artwork
  exists.
- Admin collection update rejects adding a valid ObjectId when no matching
  artwork exists.
- Existing valid relationship writes still succeed.
- Focused tests cover missing-reference failures and unchanged success paths.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts
git diff --check
```

Run broader checks only if shared schema/helpers are changed.

## Handoff Notes

- Prepared by T-140 after reconciling A-011.
- Keep admin management UI, delete cascade previews, and collection section
  taxonomy decisions separate.
- Completed route-local artwork existence checks for admin article
  create/update and collection update `artworksToAdd` writes.
- Missing-but-valid article `artwork` IDs now return structured `400`
  validation errors on the `artwork` field before article persistence.
- Missing-but-valid collection `artworksToAdd` IDs now return structured `400`
  validation errors on the `artworksToAdd` field before collection lookup/save.
- `artworksToRemove` semantics are intentionally unchanged: valid-looking IDs
  that are not present in the collection, or no longer exist as artwork records,
  are treated as removal filters and do not fail the update.
- Candidate tracker/workstream updates, for a non-parallel reconciliation pass:
  mark the content/admin backlog item for server-verifying article and
  collection artwork relationships complete; record T-142 progress in Data
  Models And API, Content Assets And Admin Operations, and Testing And Quality;
  close or annotate the related A-011/F-093 finding as implemented.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts`
  and `git diff --check`.
