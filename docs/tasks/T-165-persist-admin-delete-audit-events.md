# T-165 Persist Admin Delete Audit Events

Status: Completed

Workstream:
[Content Assets And Admin Operations](../workstreams/content-assets-and-admin-ops.md),
[Data Models And API](../workstreams/data-models-and-api.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Persist a redacted audit event for admin destructive delete attempts that pass
the evidence gate, so production delete activity has a durable receipt without
storing private records or secrets.

## Context

- T-156 added read-only delete previews for article, artwork, blog, collection,
  comment, and user deletes.
- T-163 renders those previews in the admin delete confirmation UI and blocks
  confirmation while the preview is loading, failed, or blocked.
- T-164 requires backup/export and owner/delegated review evidence in the admin
  delete confirmation UI and validates that evidence at each delete route before
  destructive mutation.
- F-092/R-007 still require redacted audit-event persistence before production
  destructive deletes are repeatable.
- This task should create the durable delete receipt. It should not introduce a
  monitoring provider, browser reporting SDK, Cloudinary deletion, or new
  cascade behavior.

## Scope

In scope:

- Add a server-only redacted admin delete audit event persistence path. A small
  Mongoose model plus helper is expected unless an existing repo pattern is a
  better fit after inspection.
- Persist only safe fields, such as route, method, request ID when present,
  timestamp, resource type, resource ID, actor class or role, evidence reference
  strings from the T-164 gate, preview summary counts, blocker codes, outcome,
  and response status.
- Summarize the T-156 preview contract without storing full preview records,
  labels, image URLs, Cloudinary URLs, raw MongoDB documents, comments, user
  names, emails, request bodies, cookies, tokens, stacks, or secrets.
- Wire the audit helper into article, artwork, blog, collection, comment, and
  user admin delete routes after auth, ObjectId, and evidence validation.
- Create the audit event before destructive mutation. If the audit event cannot
  be created, return a public-safe failure and do not mutate records.
- Update the event outcome after route success, blocked/conflict, not-found, or
  handled failure when practical. A persisted started event is acceptable if a
  post-mutation outcome update fails, but the route should log a redacted
  server event for that audit-update failure.
- Preserve existing route responses, evidence validation, cascade behavior,
  transaction ordering, and Cloudinary asset preservation.
- Add focused tests for successful persistence, no mutation when audit creation
  fails, redacted/summarized audit payload shape, and existing representative
  delete outcomes.

Out of scope:

- Do not add a monitoring provider, `instrumentation.ts`, alerting, or client
  reporting SDK.
- Do not change the delete preview response shape unless a tiny shared summary
  helper type is necessary.
- Do not store raw documents, full preview records, user/email details, private
  contact data, request bodies, cookies, tokens, secrets, or raw errors.
- Do not change destructive cascade semantics.
- Do not delete Cloudinary assets.
- Do not redesign admin UI or change the evidence controls added by T-164.
- Do not edit shared trackers while running in parallel.

## Concurrency

Do not run in parallel with another task editing admin delete routes, admin
delete preview helpers, delete evidence validation, admin delete models/helpers,
or admin delete route tests.

Can run in parallel with prototype-only owner-decision work if agents avoid
shared tracker edits.

Owned files:

- new audit event model/helper files under `src/lib/data/models/` and/or
  `src/lib/api/admin/delete/`
- `src/lib/data/models/index.ts` if a new model is added
- admin delete route files under `src/app/api/v2/admin/*/delete/[id]/route.ts`
- focused admin delete audit event tests
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- A valid admin destructive delete attempt that passes T-164 evidence validation
  creates a durable redacted audit event before any destructive mutation.
- If audit-event creation fails, the route returns a public-safe error and no
  destructive mutation occurs.
- Successful deletes update the audit event outcome to succeeded; blocked,
  not-found, and handled failure outcomes are recorded where the route reaches
  those states.
- Stored audit payloads contain summarized counts and safe references only, not
  raw documents, full preview records, emails, image URLs, cookies, tokens,
  secrets, request bodies, stacks, or raw caught errors.
- Existing delete responses, route guards, evidence validation, cascade
  behavior, and Cloudinary preservation remain unchanged except for the new
  public-safe audit-persistence failure path.
- Focused tests cover the audit path for representative transactional and
  non-transactional delete routes.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts
npm run lint
npm run build
git diff --check
```

Add any new focused audit-event test files to the Jest command.

## Agent Prompt

You are working on T-165. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-156, T-163, T-164, the admin content operations runbook, and
`docs/architecture/logging-and-redaction.md`. Persist redacted audit events for
admin destructive delete attempts that pass the T-164 evidence gate. Add a
server-only audit event model/helper, summarize the existing preview impact
without raw records or private fields, wire it into article/artwork/blog/
collection/comment/user delete routes before destructive mutation, and update
outcomes after success/block/not-found/handled failure where practical. If audit
event creation fails, return a public-safe failure before mutation. Do not add a
monitoring provider, change cascade behavior, delete Cloudinary assets, redesign
admin UI, or edit shared trackers. Add focused tests, run the focused tests
plus lint, build, and `git diff --check`, and update only this task handoff.

## Handoff Notes

- Prepared after T-164 completion and orchestrator reconciliation.
- Completed 2026-05-20: added the server-only
  `AdminDeleteAuditEventModel` collection model and
  `src/lib/api/admin/delete/audit.ts` helper for redacted destructive admin
  delete receipts.
- Audit events store route, method, request ID, timestamp, resource type/ID,
  admin actor class/role, sanitized backup and review evidence references,
  summarized T-156 preview counts, blocker codes, and outcome/status only.
  They do not store preview records, labels, image URLs, Cloudinary URLs, raw
  documents, user names, emails, request bodies, cookies, tokens, stacks, or raw
  caught errors.
- Wired article, artwork, blog, collection, comment, and user admin delete
  routes to parse sanitized T-164 evidence, create the audit event before
  destructive mutation, return a public-safe `500` without mutation if audit
  creation fails, and best-effort update outcomes for success, blocked,
  not-found, and handled failure paths.
- Preserved existing delete response bodies and cascade behavior. User
  current-admin delete attempts now create and complete a blocked audit event
  before returning the existing `403`, still before transaction/destructive
  work.
- Added focused coverage in
  `__tests__/unit/api/adminDeleteAuditEvent.test.ts` for summary redaction,
  persisted payload shape, and audit outcome update failure logging. Updated
  `__tests__/unit/api/adminDeleteRouteGuard.test.ts` for audit create ordering,
  success/not-found/blocked outcome updates, and no mutation when audit create
  fails.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/adminDeleteAuditEvent.test.ts`,
  `npm run lint`, `npm run build`, and `git diff --check`.
- Candidate tracker updates for the orchestrator: F-092/R-007 and the
  content/admin, data/API, testing, admin-content runbook, and production-risk
  trackers can mark redacted destructive admin delete audit-event persistence as
  implemented. Production delete approval may still need owner policy review
  outside this task.
