# T-012 Harden User Comment Validation

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Fix user comment create/update parsing, validation, status codes, and response
DTOs using the T-010 public enquiry pattern as the nearest proven route slice.

## Why Now

A-016 found the user comment flow has a concrete functional bug and validation
gap: comment creation reads the request body twice, bypasses the existing Zod
schema, returns body-level statuses instead of real HTTP statuses, and returns
raw documents. Comment edit also bypasses the max-length and trim schema used by
the UI.

This task addresses:

- [F-056](../audits/findings-register.md): user comment creation reads the
  request body twice and bypasses the existing schema.
- [F-061](../audits/findings-register.md): comment edit bypasses the max-length
  and trim schema used by the UI.
- [R-006](../risks/production-readiness.md): API validation/status/DTO drift.
- [R-015](../risks/production-readiness.md): remaining input-flow validation
  gaps after T-010.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [T-010 Harden public enquiry validation](T-010-public-enquiry-validation.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

## Scope

In scope:

- Fix `POST /api/v2/user/comment` so it reads JSON once, validates with the
  shared comment schema or a route-safe equivalent, trims parsed text, validates
  `blogSlug`, and returns real HTTP 401/400/404/500 statuses.
- Fix `PATCH /api/v2/user/comment/[commentId]` so it validates the route param
  and request body with the existing update schema or a route-safe equivalent,
  persists the parsed trimmed text, and returns real HTTP statuses.
- Return transformed frontend comment DTOs instead of raw Mongoose documents
  where the route contract expects frontend data.
- Keep ownership and authorization behavior intact.
- Add focused route tests for unauthenticated, invalid body, unknown blog,
  invalid comment ID, forbidden edit, overlong/blank text, successful create,
  successful edit, and rollback/failure behavior where practical.
- Update this task, Data/API, Auth/Admin, Testing, findings, and risk notes
  after completion.

Out of scope:

- Do not redesign comment UI or add rich text.
- Do not change delete behavior unless tests need minimal fixture support.
- Do not create a broad shared API response-helper refactor unless the route
  cannot be fixed safely without it.
- Do not change sign-in behavior; T-013 owns that flow.

## Concurrency

You are not alone in the repo. Keep edits scoped to comment routes, comment
schemas/transforms if needed, focused tests, and directly related docs. Avoid
touching package files or sign-in form files in this task.

## Acceptance Criteria

- Comment create reads the request body once and rejects invalid input before
  starting persistence work.
- Comment create/update use real HTTP statuses for auth, validation, not-found,
  forbidden, and server failure paths.
- Comment create/update persist parsed and trimmed text only.
- Success responses return the expected frontend DTO shape or the route contract
  is explicitly updated.
- Focused tests cover the fixed behavior.

## Outcome

Completed on 2026-05-14.

- Added route-safe comment schemas for create input, update body input, and
  update route params while preserving the existing client form schemas.
- Updated `POST /api/v2/user/comment` to authenticate, read JSON once, validate
  and trim `text`/`blogSlug`, return real 401/400/404/500 statuses, persist only
  parsed text, keep transactional blog/user linkage, abort on linked write
  failure, and return a transformed frontend comment DTO.
- Updated `PATCH /api/v2/user/comment/[commentId]` to authenticate, validate the
  ObjectId route param, validate and trim request text, enforce ownership,
  persist only parsed text with validators, return real HTTP statuses, and
  return a transformed frontend comment DTO.
- Added `__tests__/unit/api/userCommentRoute.test.ts` covering unauthenticated
  create/update, invalid JSON/body, unknown blog, invalid comment ID, forbidden
  edit, blank/overlong text, successful create/edit, DTO transforms, one-read
  parsing, and transaction abort behavior.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm run lint
```

Run `npm test` if shared comment schemas, transforms, or auth helpers are
changed.

Verification run on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/api/userCommentRoute.test.ts`
  passed.
- `npm run lint` passed.
- `npm test` passed with 20 suites and 175 tests. Existing `dateUtils`
  invalid-date console output still appears in the full suite.
- `npm run build` passed. Existing build noise remains from live MongoDB/static
  generation and debug fetcher logs.

## Escalate

Escalate to the orchestrator if:

- Transforming the created/updated comment requires a wider route contract
  decision.
- Existing clients depend on raw comment documents.
- Transaction setup makes route-handler testing require a broader database test
  harness.
