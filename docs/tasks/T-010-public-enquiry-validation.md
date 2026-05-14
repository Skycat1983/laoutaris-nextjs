# T-010 Harden Public Enquiry Validation

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Make the public contact/enquiry write path validate and persist only a safe,
normalized DTO with real HTTP validation statuses.

## Why Now

T-008 now sends available product enquiries to `/project/contact?product=...`.
The public enquiry API is therefore on the first-release commerce path and must
not persist arbitrary request bodies.

This task addresses:

- [F-055](../audits/findings-register.md): public enquiry accepts and logs raw
  request bodies without route validation.
- [F-053](../audits/findings-register.md): routes expose raw exception messages
  and need public-safe responses.
- [R-015](../risks/production-readiness.md): user-input validation gaps are now
  confirmed by A-016.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Routes and API architecture](../architecture/routes-and-api.md)

## Scope

In scope:

- Add or reuse a shared enquiry validation schema for server-side parsing.
- Validate `POST /api/v2/public/enquiry` with `safeParse` or an equivalent
  server-side validation path.
- Trim/normalize accepted fields and persist only the validated DTO.
- Remove public enquiry body logging.
- Return real HTTP 400 validation responses with stable field-error payloads.
- Return public-safe 500 errors without exposing raw exception messages.
- Add focused route tests for invalid email, missing/short fields, success, and
  internal failure.
- Update this task, the Data/API workstream, and risk notes after completion.

Out of scope:

- Do not redesign the contact page or commerce enquiry UX.
- Do not change unrelated admin/user write routes.
- Do not implement spam prevention, rate limiting, email delivery, or CRM
  integration.

## Concurrency

You are not alone in the repo. Keep changes limited to the enquiry form/API
boundary, focused tests, and docs. Coordinate with any separate logging policy
or API response-helper task before introducing shared helpers.

## Acceptance Criteria

- Invalid public enquiry input returns HTTP 400 and does not write to MongoDB.
- Valid public enquiry input writes a normalized DTO.
- The route does not log request bodies.
- Public clients receive stable public-safe errors.
- Focused tests cover success and failure paths.

## Outcome

Completed on 2026-05-14.

- Added `src/lib/data/schemas/enquirySchema.ts` as the shared contact/enquiry
  DTO schema with trim, lowercase email normalization, minimum lengths, and
  conservative maximum lengths.
- Updated `POST /api/v2/public/enquiry` to parse JSON safely, validate with
  `safeParse`, return HTTP 400 `fieldErrors`/`formErrors`, call `dbConnect()`,
  persist only the parsed DTO, remove request-body logging, and return
  public-safe HTTP 500 errors.
- Updated the contact/enquiry forms and public enquiry fetcher to use the shared
  DTO type instead of importing the Mongoose model barrel into client code.
- Added `__tests__/unit/api/publicEnquiryRoute.test.ts` covering invalid email,
  missing/short fields, invalid JSON, normalized success, unknown-field
  stripping, and internal persistence failure.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm run lint
```

Run `npm test` if shared schemas or API helpers are introduced.

Verification run on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/api/publicEnquiryRoute.test.ts`
  passed.
- `npm run lint` passed. The first attempt failed before ESLint because Next
  could not resolve `next/dist/compiled/loader-runner`; a rerun resolved the
  module and completed with no warnings or errors.
- `npm test` was run because this task introduced a shared schema. The new
  public enquiry route tests passed, but the full suite failed in unrelated
  `__tests__/unit/utils/userUtils.test.ts` setup because Jest attempted to parse
  `node_modules/bson/lib/bson.mjs` through a Mongoose import and hit ESM syntax.
  T-011 later fixed that type-only import boundary and restored the full Jest
  baseline.

## Escalate

Escalate to the orchestrator if:

- The existing contact/enquiry forms submit fields that cannot be reconciled
  into one schema.
- The owner wants product enquiry to become a separate route or workflow.
- A shared API response-helper refactor becomes necessary to finish the task.
