# T-009 Remove Credential Logging And Source Secret

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md),
[Shopify commerce](../workstreams/shopify-commerce.md)

## Goal

Remove credential-bearing debug output and the Storefront-token-shaped source
comment before broader logging or Shopify credential work continues.

## Why Now

This task addresses the highest-risk A-008 findings that can be fixed without a
larger policy migration:

- [F-011](../audits/findings-register.md): Shopify credential-like source
  comment remains.
- [F-051](../audits/findings-register.md): registration logs expose raw
  password, hashed password, and saved user document data.
- [R-022](../risks/production-readiness.md): Shopify credential-like value may
  require verification or rotation.
- [R-029](../risks/production-readiness.md): registration logging exposes
  credential material.

## Read First

- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Auth, admin, and permissions workstream](../workstreams/auth-admin-and-permissions.md)
- [Shopify commerce architecture](../architecture/shopify-commerce.md)

## Scope

In scope:

- Remove `password`, `hashedPassword`, and saved-user debug logging from
  `src/lib/actions/registerUser.ts`.
- Remove the token-shaped Shopify env-value comment from
  `src/lib/config/shopifyConfig.ts` and leave only placeholder-safe guidance if
  a comment is still needed.
- Add a focused static or unit-level regression check that would fail if the
  known credential-bearing log strings return.
- Update this task, the affected workstreams, and risks with completion notes.

Out of scope:

- Do not rotate credentials in code or invent a secret-rotation result. Record
  that owner verification/rotation remains open unless the owner confirms it.
- Do not implement the broader logging wrapper, CSP, CORS, or raw-error
  response policy.
- Do not change registration validation, authentication behavior, or Shopify
  API credentials.

## Concurrency

You are not alone in the repo. Keep edits scoped to the files above, focused
tests, and directly related docs. Do not touch dependency updates or public
enquiry validation in this task.

## Acceptance Criteria

- Registration no longer logs raw password, hashed password, or saved user
  document data.
- Source comments no longer contain a concrete Shopify token-shaped value.
- A focused regression check covers the removed credential-bearing output.
- Risks distinguish code cleanup from unresolved owner verification/rotation.

## Verification

```bash
npm test -- --runTestsByPath <new-or-updated-test-file>
npm run lint
```

Run `npm test` and `npm run build` if the implementation touches shared auth,
config, or build behavior beyond the scoped removals.

Completed verification on 2026-05-14:

```bash
npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts
npm run lint
```

Both commands passed.

## Completion Notes

- Removed all direct `console` output from `src/lib/actions/registerUser.ts`,
  including raw submitted password, hashed password, user document, save result,
  and caught error logging.
- Replaced the Shopify config token-shaped example comment with placeholder-safe
  guidance that names required environment variables without recording values.
- Added `__tests__/unit/security/credentialSourceHygiene.test.ts` to fail if
  direct registration console logging returns or if a concrete
  `SHOPIFY_STOREFRONT_ACCESS_TOKEN` example is reintroduced in Shopify config
  comments.
- Redacted the same token-shaped value from the historical A-008 audit result
  after the cleanup search found it duplicated there.
- Code cleanup is complete. Owner verification of whether the removed
  token-shaped Shopify value was real, and rotation if needed, remains open
  outside the repo.

## Escalate

Escalate to the orchestrator if:

- The owner confirms the Shopify value was real and wants rotation tracking
  handled in-repo.
- Removing a log changes a depended-on test or operator workflow.
- The credential-like value appears in additional committed files.
