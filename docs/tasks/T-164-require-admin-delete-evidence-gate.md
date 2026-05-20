# T-164 Require Admin Delete Evidence Gate

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Require operator backup/review evidence in the admin delete confirmation flow
and at the admin delete route boundary before destructive delete execution.

## Context

- T-156 added read-only delete previews for article, artwork, blog, collection,
  comment, and user deletes.
- T-163 renders those previews in the admin delete confirmation UI and blocks
  confirmation while the preview is loading, failed, or blocked.
- F-092/R-007 still require backup/export evidence and owner/delegated review
  evidence before production destructive deletes are repeatable.
- Redacted audit-event persistence remains a later task; this task should make
  the evidence gate explicit before mutation, not invent a full audit trail.

## Scope

In scope:

- Define a client/server-safe delete evidence payload for admin destructive
  deletes. Keep fields sanitized and do not include secrets, account details,
  cookies, private contact data, or raw database documents.
- Extend admin delete fetchers to send the evidence payload with existing
  `DELETE` requests.
- Add evidence controls to `DeleteConfirmation` after the preview impact so an
  operator must confirm backup/export evidence and owner/delegated review
  evidence before confirming deletion.
- Disable destructive confirmation until the preview is unblocked and the
  required evidence fields are valid.
- Validate evidence at each admin delete route before destructive DB mutation.
  Use a shared helper/schema where practical and preserve existing guard and
  invalid-ID ordering.
- Return structured, operator-readable validation errors when evidence is
  missing or invalid.
- Add focused route, fetcher, and component tests for missing evidence, valid
  evidence, guard ordering, and existing delete success behavior.

Out of scope:

- Do not persist redacted audit events yet.
- Do not change the cascade behavior of existing delete routes.
- Do not delete Cloudinary assets.
- Do not change the T-156 preview response shape unless a small type adjustment
  is strictly necessary.
- Do not add broad admin dashboard redesigns.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run in parallel with another task editing admin delete routes,
`DeleteConfirmation`, admin delete fetchers, or admin delete tests.

Can run in parallel with prototype-only owner-decision work if agents avoid
shared tracker edits.

Owned files:

- admin delete evidence type/schema/helper files under `src/lib/api/admin/delete/`
- `src/lib/api/admin/delete/fetchers.ts`
- admin delete route files under `src/app/api/v2/admin/*/delete/[id]/route.ts`
- `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx`
- focused admin delete evidence tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- Destructive admin delete confirmation cannot be submitted until backup/export
  evidence and owner/delegated review evidence are supplied.
- Admin delete routes reject missing or invalid evidence before destructive
  mutation while preserving existing auth guard and invalid-ID ordering.
- Existing delete behavior remains unchanged after valid evidence is supplied.
- Route responses surface structured evidence validation errors that the admin
  UI can display.
- Tests prove missing evidence blocks mutation and valid evidence preserves the
  current delete behavior for representative resources.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/forms/adminDeleteConfirmation.test.tsx
npm run lint
git diff --check
```

Add any new focused evidence/fetcher test files to the Jest command. Run
`npm run build` because this task touches client components and App Router
route handlers.

## Agent Prompt

You are working on T-164. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-156, T-163, and the linked workstreams. Require admin delete evidence before
destructive deletes can run. Add a client/server-safe evidence payload, extend
delete fetchers to send it, add evidence controls to `DeleteConfirmation`, and
validate evidence in each admin delete route before destructive DB mutation
while preserving auth guard and invalid-ID ordering. Do not persist audit
events yet, change cascade behavior, delete Cloudinary assets, redesign the
admin dashboard, or edit shared trackers. Add focused route/fetcher/component
tests, run the focused tests plus lint, build, and `git diff --check`, and
update only this task handoff.

## Handoff Notes

- Prepared after T-163 completion and orchestrator reconciliation.
- Completed 2026-05-20: added a client/server-safe
  `AdminDeleteEvidence` payload for destructive admin deletes with two required
  gates: backup/export confirmation plus reference, and owner/delegated review
  confirmation plus reference.
- Extended the admin delete fetchers so article, artwork, blog, collection,
  comment, and user `DELETE` calls send the evidence payload while preview
  fetchers continue to use the read-only `GET` preview routes.
- Updated `DeleteConfirmation` to render required evidence controls after a
  loaded delete preview. Confirmation now remains disabled while the preview is
  loading, failed, blocked, or while either evidence confirmation/reference is
  incomplete; submitted references are trimmed before being sent.
- Added shared route evidence validation in
  `src/lib/api/admin/delete/routeValidation.ts` and wired it into each admin
  delete route after `requireApiAdmin()` and ObjectId validation, before
  route-local DB mutation/session work. Missing, malformed, unchecked, short,
  overlong, or unknown evidence fields return structured `400` validation
  envelopes without changing cascade behavior, Cloudinary asset handling, or
  audit persistence.
- Added/updated focused tests in
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts`,
  `__tests__/unit/api/adminDeleteFetchers.test.ts`, and
  `__tests__/unit/forms/adminDeleteConfirmation.test.tsx` for missing evidence,
  invalid-ID ordering, evidence fetcher bodies, UI gating, sanitized evidence
  submission, and existing successful delete behavior with valid evidence.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/adminDeleteFetchers.test.ts __tests__/unit/forms/adminDeleteConfirmation.test.tsx`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- Orchestrator reconciliation completed 2026-05-20: F-092/R-007 now note that
  route-enforced backup/export and owner/delegated review evidence gates are
  implemented. Redacted audit-event persistence remains open in
  [T-165](T-165-persist-admin-delete-audit-events.md) before production
  destructive deletes are fully repeatable.
