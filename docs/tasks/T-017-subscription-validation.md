# T-017 Harden Subscription Validation

Status: Completed

Workstreams:
[Data models and API](../workstreams/data-models-and-api.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Validate and normalize newsletter subscription input at the server-action
boundary before any subscriber lookup or persistence.

## Why Now

A-016 found that `SubscribeForm` has a React Hook Form resolver, but the actual
submission goes through `useFormState(submitSubscription, ...)`. The server
action currently accepts any non-empty `email`, logs the create attempt, and
returns raw exception messages to the client.

This task addresses:

- [F-059](../audits/findings-register.md): subscription server action accepts
  any non-empty email string.
- [F-053](../audits/findings-register.md): public-safe error handling and
  logging redaction remain incomplete.
- [R-006](../risks/production-readiness.md): API/action validation and
  public-safe error behavior remain uneven.
- [R-015](../risks/production-readiness.md): public input validation gaps
  remain after the enquiry and comment slices.

## Read First

- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [T-010 Harden public enquiry validation](T-010-public-enquiry-validation.md)
- [Data models and API workstream](../workstreams/data-models-and-api.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)

## Scope

In scope:

- Add or reuse a route/action-safe subscriber validation schema.
- Update `submitSubscription` to treat `FormData` values defensively, validate
  the email, trim and lowercase accepted values, and reject invalid input before
  querying MongoDB.
- Call `dbConnect()` before using `SubscriberModel`.
- Check duplicates using the normalized email value.
- Persist only the normalized validated DTO.
- Remove direct subscription input logging and return stable public-safe
  failure messages instead of raw exception messages.
- Add focused server-action tests for missing email, invalid email, normalized
  success, duplicate email, database failure, and no direct input logging.
- Update this task, the Data/API workstream, Testing workstream, findings, and
  risk notes after completion.

Out of scope:

- Do not redesign `SubscribeForm` or the footer/contact layout.
- Do not add spam prevention, rate limiting, email delivery, consent tracking,
  or CRM integration.
- Do not change unrelated public enquiry, comment, or admin write routes.

## Concurrency

You are not alone in the repo. Keep edits scoped to the subscription server
action, any subscriber validation schema, focused tests, and directly related
docs. Avoid package edits and avoid touching the active sign-in or comment
routes.

## Acceptance Criteria

- Invalid or missing subscription email returns a stable failure state and does
  not query or write subscriber data.
- Valid email is trimmed, lowercased, duplicate-checked, and persisted in the
  normalized form.
- Duplicate email returns a stable non-sensitive failure message.
- Unexpected persistence failures do not expose raw exception messages to the
  client.
- Focused tests prove the success, validation, duplicate, failure, and logging
  behavior.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-subscription-test-file>
npm run lint
```

Run `npm test` if the task introduces shared schemas or touches shared action
test setup.

Verification run on 2026-05-14:

- `npm test -- --runTestsByPath __tests__/unit/actions/submitSubscription.test.ts`
  passed.
- `npm run lint` passed.
- `npm test` passed with 25 suites and 195 tests. Existing date utility
  error-path console output remains expected test noise.

## Outcome

Completed on 2026-05-14.

- Updated `subscriberSchema` to trim, lowercase, format-check, and length-bound
  newsletter email input with route/action-safe required/type errors.
- Updated `submitSubscription` to validate `FormData` before MongoDB access,
  call `dbConnect()`, duplicate-check and create subscribers with the normalized
  email, remove direct input logging, and return stable public-safe failure
  messages for validation, duplicate, and persistence failures.
- Added defensive trim/lowercase rules to the subscriber Mongoose model.
- Added `__tests__/unit/actions/submitSubscription.test.ts` covering missing,
  invalid, and non-string email input, normalized success, duplicate handling,
  persistence failure, DB call ordering, and no direct input logging.

## Escalate

Escalate to the orchestrator if:

- The subscriber model requires fields beyond email for valid persistence.
- The owner wants subscription consent/compliance requirements handled in the
  same change.
- A shared action response-helper refactor becomes necessary to finish safely.
