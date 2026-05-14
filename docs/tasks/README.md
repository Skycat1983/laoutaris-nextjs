# Tasks

Task briefs are used for bounded implementation or review work after audits have
been reconciled.

Use task briefs when a workstream backlog item is ready to commission and the
orchestrator needs a one-line `/task ... details:` assignment.

## Active Tasks

| Task | Status | Purpose |
| --- | --- | --- |
| [T-001 Remove MONGO_URI from Next config](T-001-remove-mongo-uri-next-config.md) | Completed | Stopped exposing a server-only MongoDB secret through `next.config.mjs` and updated deployment docs. |
| [T-002 Persist credentials role into JWT session](T-002-credentials-role-session.md) | Completed | Ensured credentials admin users carry their persisted database role into JWT/session state. |
| [T-003 Use stable session user ID for ownership](T-003-stable-session-user-id.md) | Completed | Made `session.user.id` the canonical ownership source for protected user helpers. |
| [T-004 Standardize single Shopify product API contract](T-004-single-shopify-product-api-contract.md) | Completed | Applied the shared API envelope and numeric Shopify product ID validation to the public single-product shop route and its direct consumer. |
| [T-005 Harden Cloudinary signing API guard](T-005-cloudinary-signing-api-guard.md) | Ready | Add a route-local admin guard, request validation, and focused tests to the Cloudinary signing endpoint without breaking `next-cloudinary`'s top-level `signature` contract. |

## Rules

- Keep one task brief scoped to one implementation slice.
- Link the findings, risks, and workstreams that justify the task.
- Include verification commands before assigning the task.
- Update status and outcome after completion.
