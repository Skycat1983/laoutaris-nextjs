# T-020 Harden Admin Collection Write Validation

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Content, assets, and admin operations](../workstreams/content-assets-and-admin-ops.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Harden the admin collection create/update routes with route-boundary
validation, allowlisted persistence, real validation statuses, and focused
tests.

## Why Now

F-057 remains the highest-risk A-016 input-validation gap. Collection writes
are a good first admin slice because `create` currently accepts raw request
data and `update` uses arbitrary `Object.assign(collection, updateData)` after
splitting `artworksToAdd` and `artworksToRemove`.

This task addresses:

- [F-057](../audits/findings-register.md): admin create/update route validation
  is inconsistent and invalid input often becomes a 500.
- [R-006](../risks/production-readiness.md): API validation/status/DTO drift
  remains open across route groups.
- [R-015](../risks/production-readiness.md): admin input validation gaps remain
  after public/user input slices.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Content, assets, and admin operations workstream](../workstreams/content-assets-and-admin-ops.md)
- [T-010 Harden public enquiry validation](T-010-public-enquiry-validation.md)
- [T-012 Harden user comment validation](T-012-user-comment-validation.md)

## Scope

In scope:

- Update `POST /api/v2/admin/collection/create` to parse JSON safely, validate
  with `createCollectionSchema.safeParse` or a route-safe equivalent, generate
  the slug from parsed input, set `author` from the authenticated user, and
  persist only allowlisted parsed fields.
- Update `PATCH /api/v2/admin/collection/update/[id]` to validate the route
  `id`, parse JSON safely, validate update fields, validate
  `artworksToAdd`/`artworksToRemove` as object-id strings where practical, and
  avoid arbitrary `Object.assign` of unvalidated data.
- Add explicit `dbConnect()` ownership if the routes do not already reach
  MongoDB through an established DB-owned wrapper.
- Preserve existing admin auth behavior unless a local route bug blocks the
  validation work.
- Return real 400 validation responses with stable field/form errors, keep 401
  and 404 behavior explicit, and return public-safe 500 errors.
- Remove directly touched debug logging from the collection write routes.
- Add focused route tests for unauthenticated, invalid JSON, invalid fields,
  invalid update id, not found, create success, update success, and rejected
  unknown fields.
- Update this task, Data/API, Content/Admin, Testing, findings, and risk notes
  after completion.

Out of scope:

- Do not change article, artwork, or blog admin writes in this task.
- Do not redesign admin collection forms.
- Do not introduce broad shared API response helpers unless the route cannot be
  fixed safely without them.
- Do not change delete behavior or related-record cleanup.

## Concurrency

You are not alone in the repo. This task owns only the admin collection
create/update routes, collection validation schema if needed, focused tests, and
directly related docs. Avoid package edits, public search routes, and artwork
list data-service files.

## Acceptance Criteria

- Invalid collection create/update input returns HTTP 400 and does not write
  unvalidated fields.
- Valid collection create/update persists only parsed allowlisted data.
- Update route validates the collection id and artwork add/remove ids where
  practical.
- Unknown fields are ignored or rejected according to the chosen schema policy,
  and that policy is covered by tests.
- Focused route tests prove auth, validation, not-found, success, and failure
  behavior.

## Outcome

Completed on 2026-05-14.

- Added route-safe strict collection create/update schemas with trimmed string
  fields, collection id validation, and artwork add/remove ObjectId validation.
- Updated `POST /api/v2/admin/collection/create` to authenticate before body
  reads, parse JSON safely, validate with `safeParse`, generate the slug from
  parsed title, set `author` from the authenticated user, call `dbConnect()`,
  persist only allowlisted parsed fields, reject unknown fields, remove the
  collection-data debug log, and return real 400/401/500 statuses.
- Updated `PATCH /api/v2/admin/collection/update/[id]` to authenticate before
  body reads, validate the route id, parse JSON safely, validate a strict
  allowlisted body, apply only parsed fields plus validated artwork add/remove
  changes, call `dbConnect()`, preserve explicit 401/404 behavior, and return
  public-safe 500 errors.
- Added `__tests__/unit/api/adminCollectionRoute.test.ts` covering
  unauthenticated, invalid JSON, invalid fields, invalid update id, not found,
  create success, update success, rejected unknown fields, and public-safe
  internal failure responses.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-admin-collection-route-test-file>
npm run lint
```

Run `npm test` if shared schemas, route helpers, or admin test setup are
changed.

Verification run on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/api/adminCollectionRoute.test.ts`
  passed.
- `npm run lint` passed.
- `npm test` was run because the shared collection schema changed. The admin
  collection route tests passed in the full suite; after concurrent public
  search updates landed, the final full suite passed with 30 suites and 221
  tests.

## Escalate

Escalate to the orchestrator if:

- Existing admin UI payloads cannot be reconciled with the current
  `createCollectionSchema` or `updateCollectionSchema`.
- Collection artwork add/remove behavior requires a broader relation-management
  decision.
- A shared admin write DTO or response-helper refactor becomes necessary before
  this route can be hardened safely.
