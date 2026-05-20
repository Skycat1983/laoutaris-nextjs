# T-163 Surface Admin Delete Preview UI

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Render the T-156 admin delete preview contract in the existing admin delete
confirmation flow before destructive delete requests can be confirmed.

## Context

- T-156 added read-only `GET` preview routes for article, artwork, blog,
  collection, comment, and user deletes.
- The current `DeleteConfirmation` UI is still generic and does not show
  related-record impact, blockers, preserved assets, or production evidence
  reminders.
- Production destructive deletes remain blocked until operators can see cascade
  impact and later tasks add backup/review evidence capture and redacted audit
  evidence.

## Scope

In scope:

- Add client-safe delete preview fetchers for article, artwork, blog,
  collection, comment, and user resources.
- Keep preview contract types client-safe. If needed, split shared preview
  types out of server/model-backed preview implementation files.
- Update the existing admin delete confirmation flow to request and render the
  preview for the selected document.
- Show the target, blocked state, blocking conditions, records that would be
  deleted, records that would be detached or updated, preserved records/assets,
  and production evidence reminders in operator-readable language.
- Disable destructive confirmation while the preview is loading, when preview
  loading fails, or when the preview reports `blocked: true`.
- Preserve the existing successful delete behavior once an unblocked preview is
  loaded.
- Add focused component/fetcher tests for loading, failure, blocked, unblocked,
  and preview rendering states.

Out of scope:

- Do not change existing `DELETE` route execution.
- Do not add backup-note input, owner review capture, or audit-event
  persistence.
- Do not delete Cloudinary assets.
- Do not redesign the broader admin dashboard.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run in parallel with another task editing
`DeleteConfirmation`, admin delete operation tabs, admin delete fetchers, or
admin delete preview contract files.

Can run in parallel with prototype-only QA tasks such as T-162 if agents avoid
shared tracker edits.

Owned files:

- `src/lib/api/admin/delete/fetchers.ts`
- client-safe admin delete preview type files, if added
- `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx`
- admin delete operation tabs that pass preview fetchers into
  `DeleteConfirmation`
- focused admin delete preview UI/fetcher tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `src/lib/api/admin/delete/preview.ts`
- `src/lib/api/admin/delete/fetchers.ts`
- `src/components/features/adminDashboard/crudForms/delete/DeleteConfirmation.tsx`
- `src/components/features/adminDashboard/operationTabs/*Operations.tsx`
- `__tests__/unit/api/adminDeletePreviewRoute.test.ts`
- existing admin dashboard component tests

## Acceptance Criteria

- Admin delete confirmation visibly shows the preview impact before a delete
  can be confirmed.
- Blocked previews prevent confirmation and show the blocker reason.
- Preview loading and preview failure states prevent accidental destructive
  confirmation.
- Existing delete success and cancel behavior remain intact.
- Client components do not import server/model-backed modules at runtime.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts
npm run lint
git diff --check
```

Add focused UI/fetcher test paths to the Jest command after implementing them.
Run `npm run build` if preview contract types are moved or new route/client
imports affect App Router boundaries.

## Agent Prompt

You are working on T-163. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-156, and the linked workstreams. Surface the T-156 read-only admin delete
preview contract in the existing admin delete confirmation UI. Add client-safe
preview fetchers and split preview types away from server/model-backed code if
needed. The confirmation UI must show target identity, blockers, delete impact,
detach/update impact, preserved records/assets, and production evidence
reminders. Disable destructive confirmation while preview is loading, if preview
loading fails, or when the preview is blocked. Do not change DELETE route
behavior, backup/review evidence capture, audit-event persistence, Cloudinary
lifecycle behavior, or shared trackers. Add focused UI/fetcher tests, run the
focused tests plus lint and `git diff --check`, and update only this task
handoff.

## Handoff Notes

- Prepared after T-156 completion and orchestrator reconciliation.
- Completed 2026-05-20: surfaced the T-156 delete preview contract in the
  existing admin delete confirmation flow for article, artwork, blog,
  collection, comment, and user deletes.
- Added client-safe preview contract types in
  `src/lib/api/admin/delete/previewTypes.ts`, moved shared resource typing to
  that module, and kept server/model-backed preview implementation imports out
  of the client fetcher/UI path.
- Added admin delete preview fetchers under
  `clientApi.admin.delete.preview.*`; existing destructive delete fetchers still
  call the same `DELETE` routes with `method: "DELETE"`.
- Updated `DeleteConfirmation` to fetch preview data for the selected document,
  show target identity, blocking conditions, delete impact, detach/update
  impact, preserved records/assets, and production evidence reminders, and
  disable confirmation while preview loading, after preview failure, when
  deleting, or when `blocked: true`.
- Wired the article, artwork, blog, collection, comment, and user delete
  operation tabs to pass the matching preview fetcher into `DeleteConfirmation`
  without changing delete handlers or route behavior.
- Added focused coverage in
  `__tests__/unit/api/adminDeleteFetchers.test.ts` and
  `__tests__/unit/forms/adminDeleteConfirmation.test.tsx`, and kept
  `__tests__/unit/api/routeFetcherParity.test.ts` aligned with the new preview
  fetcher operations.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts __tests__/unit/api/adminDeleteFetchers.test.ts __tests__/unit/forms/adminDeleteConfirmation.test.tsx __tests__/unit/api/routeFetcherParity.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- `npm run build` emitted the existing Browserslist caniuse-lite age warning but
  completed successfully.
- Shared tracker updates were reconciled by the orchestrator after completion:
  content/admin, data/API, testing, F-092, R-007, and orchestration state now
  note that visible preview UI is implemented while backup/review evidence
  capture and redacted audit-event persistence remain open.
