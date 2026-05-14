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
| [T-005 Harden Cloudinary signing API guard](T-005-cloudinary-signing-api-guard.md) | Completed | Added a route-local admin guard, request validation, missing-secret handling, and focused tests to the Cloudinary signing endpoint without breaking `next-cloudinary`'s top-level `signature` contract. |
| [T-006 Add server-only Next config env guard](T-006-server-only-next-config-env-guard.md) | Completed | Added an automated guard that fails if known server-only secrets are exposed through `next.config.mjs` `env`. |
| [T-007 Fix shop product detail linked artwork fetching](T-007-shop-product-detail-linked-artwork-fetching.md) | Completed | Replaced the non-existent `/api/artworks/:id` self-fetches on product detail pages with a server-only artwork data path. |
| [T-008 Make product detail purchase CTA safe](T-008-product-detail-purchase-cta-safety.md) | Completed | Replaced the nonfunctional `Add to Cart` affordance with a first-release safe purchase/contact handoff until checkout is implemented. |
| [T-009 Remove credential logging and source secret](T-009-remove-credential-logging-and-source-secret.md) | Completed | Removed registration credential logs and the Shopify token-shaped source comment, with a focused source hygiene regression test. |
| [T-010 Harden public enquiry validation](T-010-public-enquiry-validation.md) | Completed | Added shared server-side validation, normalized DTO persistence, public-safe errors, and focused route tests for the public enquiry API. |
| [T-011 Patch production dependency security baseline](T-011-production-dependency-security-patch.md) | Completed | Patched current-major A-019 production dependency advisories and documented residual Next/bcrypt major-migration advisories. |
| [T-012 Harden user comment validation](T-012-user-comment-validation.md) | Completed | Fixed comment create/update parsing, validation, HTTP statuses, DTOs, and focused route tests. |
| [T-013 Repair sign-in flow](T-013-sign-in-flow-repair.md) | Completed | Made the active sign-in form submit username/password through the tested NextAuth credentials path with accessible fields and user-visible errors. |
| [T-014 Decide residual dependency advisories](T-014-residual-dependency-advisory-decision.md) | Completed | Decided to run a Next major preflight audit first and schedule a focused bcrypt 6 compatibility task. |
| [T-015 Audit Next major migration preflight](T-015-next-major-migration-preflight.md) | Completed | Found no accepted stable Next target that clears both residual Next/PostCSS advisories; documented the owner decision path and future verification plan. |
| [T-016 Upgrade bcrypt 6 compatibility](T-016-bcrypt-6-compatibility.md) | Completed | Upgraded bcrypt to 6.0.0, removed the vulnerable transitive path, removed helper credential logging, and verified credential hashing behavior. |
| [T-017 Harden subscription validation](T-017-subscription-validation.md) | Completed | Validated and normalized the subscription server action before subscriber lookup or persistence. |
| [T-018 Create artwork list server data service proof](T-018-artwork-list-server-data-proof.md) | Completed | Proved ADR 0004 on `/artwork` by sharing a server-only artwork list data service between the loader and API route. |
| [T-019 Prune legacy auth session path](T-019-legacy-auth-session-pruning.md) | Completed | Removed the stale custom login/session code and `/protected` after the active NextAuth sign-in flow repair. |
| [T-020 Harden admin collection write validation](T-020-admin-collection-write-validation.md) | Completed | Validated admin collection create/update input, persisted allowlisted fields, and added focused route tests. |
| [T-021 Harden public search query service](T-021-public-search-query-service.md) | Completed | Bound public search query input and moved `/search` server rendering to a direct server-only data service. |
| [T-022 Prune unused package candidates](T-022-prune-unused-package-candidates.md) | Completed | Removed confirmed-unused direct packages such as `jose`, `next-test-api-route-handler`, Shopify/GraphQL clients, and redundant type packages with lockfile verification. |
| [T-023 Decouple root layout auth from bcrypt](T-023-root-layout-auth-bcrypt-decoupling.md) | Completed | Removed bcrypt and credentials verification from the normal public-page import path after the Vercel native bcrypt incident. |
| [T-024 Verify Vercel bcrypt redeploy smoke](T-024-verify-vercel-bcrypt-redeploy-smoke.md) | Completed | Confirmed the Vercel bcrypt native-load crash no longer affects `GET /` after T-023 reached `origin/main`; repeatable smoke/log handling remains a separate deployment task. |
| [T-025 Make Vercel smoke checks repeatable](T-025-repeatable-vercel-smoke-checklist.md) | Completed | Added deployment smoke evidence fields, credential handling rules, Vercel log requirements, rollback triggers, and `npm run smoke:public`. |
| [T-026 Introduce shared API route guards](T-026-shared-api-route-guards.md) | Completed | Added shared user/admin API guard helpers and migrated admin collection create/update plus user profile auth-status behavior to real JSON `401`/`403` responses. |
| [T-027 Migrate user saved routes to shared guard](T-027-user-saved-routes-shared-guard.md) | Completed | Applied `requireApiUser()` to user navigation, favourites, and watchlist read routes with real JSON `401` responses and focused tests. |
| [T-028 Harden saved item actions DB ownership and revalidation](T-028-saved-item-actions-db-revalidation.md) | Completed | Added explicit MongoDB connection ownership and route revalidation to favourite/watchlist server actions with focused action tests. |
| [T-029 Add route fetcher parity inventory](T-029-route-fetcher-parity-inventory.md) | Completed | Added a focused static route/fetcher parity test with an explicit self-checking known-gap allowlist for F-037 mismatches. |
| [T-030 Implement admin user and comment detail read routes](T-030-admin-user-comment-detail-read-routes.md) | Ready | Add missing admin user/comment detail read routes and remove those two entries from the route/fetcher parity allowlist. |

## Rules

- Keep one task brief scoped to one implementation slice.
- Link the findings, risks, and workstreams that justify the task.
- Include verification commands before assigning the task.
- Update status and outcome after completion.
