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
| [T-030 Implement admin user and comment detail read routes](T-030-admin-user-comment-detail-read-routes.md) | Completed | Added missing admin user/comment detail read routes, focused route tests, and removed those two entries from the route/fetcher parity allowlist. |
| [T-031 Prune unused saved item write fetchers](T-031-prune-unused-saved-item-write-fetchers.md) | Completed | Removed unused favourite/watchlist write fetchers and reduced the route/fetcher parity allowlist to the profile update gap. |
| [T-032 Prune unused profile update fetcher](T-032-prune-unused-profile-update-fetcher.md) | Completed | Removed the unused profile update fetcher and emptied the route/fetcher parity allowlist. |
| [T-033 Harden user comment delete route](T-033-harden-user-comment-delete-route.md) | Completed | Moved user comment delete to the shared user guard, validates params before DB work, preserves the transaction, and returns the typed delete envelope. |
| [T-034 Harden admin article write validation](T-034-harden-admin-article-write-validation.md) | Completed | Applied strict admin article create/update validation, allowlisted persistence, route-local DB ownership, and focused route tests. |
| [T-035 Bound public artwork browse query](T-035-bound-public-artwork-browse-query.md) | Completed | Validated and bounded public artwork browse query params before artwork list service calls. |
| [T-036 Bound public shop browse query](T-036-bound-public-shop-browse-query.md) | Completed | Validated and bounded public shop listing query params before MongoDB query construction or Shopify product fan-out. |
| [T-037 Harden admin artwork write validation](T-037-harden-admin-artwork-write-validation.md) | Completed | Applied strict admin artwork create/update validation, allowlisted persistence, route-local DB ownership, and focused route tests. |
| [T-038 Harden admin blog write validation](T-038-harden-admin-blog-write-validation.md) | Completed | Applied strict admin blog create/update validation, allowlisted persistence, route-local DB ownership, slug-conflict handling, and focused route tests. |
| [T-039 Migrate admin read routes to shared guard](T-039-migrate-admin-read-routes-shared-guard.md) | Completed | Moved remaining admin read routes from `isAdmin()` to `requireApiAdmin()` with focused route tests. |
| [T-040 Migrate admin delete routes to shared guard](T-040-migrate-admin-delete-routes-shared-guard.md) | Completed | Moved admin delete routes to `requireApiAdmin()`, added destructive ID validation and DB ownership, and preserved cascade behavior with focused tests. |
| [T-041 Harden middleware API auth responses](T-041-harden-middleware-api-auth-responses.md) | Completed | Make middleware return JSON `401` for unauthenticated protected API requests while preserving frontend redirects and admin API `403` behavior. |
| [T-042 Migrate user comment read/write routes to shared guard](T-042-migrate-user-comment-read-write-shared-guard.md) | Completed | Moved user comment GET/POST/PATCH onto `requireApiUser()` and added focused route coverage. |
| [T-043 Add protected API guard inventory](T-043-add-protected-api-guard-inventory.md) | Completed | Added a static regression test proving protected user/admin API routes use shared guards and no direct session/admin checks. |
| [T-044 Introduce API response helpers for user read routes](T-044-introduce-api-response-helpers-user-read-routes.md) | Completed | Added shared API response helpers and migrated protected user profile/navigation/favourite/watchlist read routes to real status-bearing error envelopes. |
| [T-045 Apply API response helpers to public content detail routes](T-045-apply-api-response-helpers-public-content-detail-routes.md) | Completed | Migrated public artwork/article/blog detail routes to shared response helpers with real public-safe `404`/`500` envelopes. |
| [T-046 Apply API response helpers to public collection routes](T-046-apply-api-response-helpers-public-collection-routes.md) | Completed | Migrated public collection routes to shared response helpers with explicit DB ownership and real public-safe `404`/`500` envelopes. |
| [T-047 Apply API response helpers to public navigation routes](T-047-apply-api-response-helpers-public-navigation-routes.md) | Completed | Applied shared response helpers to public navigation routes with explicit DB ownership and real public-safe `404`/`500` envelopes. |
| [T-048 Apply API response helpers to admin read routes](T-048-apply-api-response-helpers-admin-read-routes.md) | Completed | Applied shared response helpers to admin read routes while preserving guards, invalid-ID validation, DTOs, and metadata. |
| [T-049 Apply API response helpers to admin delete routes](T-049-apply-api-response-helpers-admin-delete-routes.md) | Completed | Applied shared response helpers to admin delete routes while preserving success messages, cascade behavior, conflict handling, and transaction ordering. |
| [T-050 Apply API response helpers to admin create update routes](T-050-apply-api-response-helpers-admin-create-update-routes.md) | Completed | Applied shared response helpers to admin create/update routes while preserving validation, DTOs, create statuses, and allowlisted persistence. |
| [T-051 Add public transform contract coverage](T-051-add-public-transform-contract-coverage.md) | Completed | Added focused tests and fixes for blog read time, collection first artwork, user ownership, and comment ownership transform contracts. |
| [T-052 Sanitize public artwork image contracts](T-052-sanitize-public-artwork-image-contracts.md) | Completed | Sanitized public artwork image DTOs, typed color-proximity metadata, and tightened Cloudinary color validation. |
| [T-053 Create core field contract matrix](T-053-create-core-field-contract-matrix.md) | Completed | Created the authoritative F-039 field matrix for article, blog, and user required/optional contract drift. |
| [T-054 Align article section options](T-054-align-article-section-options.md) | Completed | Aligned admin article section filter options with shared constants and added regression coverage rejecting stale collection article sections. |
| [T-055 Align blog field contracts](T-055-align-blog-field-contracts.md) | Completed | Aligned blog imageUrl, pinned, and tags model/schema/admin route contracts with focused validation and persistence coverage. |
| [T-056 Align user password OAuth contract](T-056-align-user-password-oauth-contract.md) | Completed | Aligned optional persisted user passwords with OAuth users while preserving credentials password requirements and auth tests. |
| [T-057 Normalize Shopify product IDs](T-057-normalize-shopify-product-ids.md) | Completed | Centralized numeric Shopify product ID validation/GID construction and applied it to public product reads. |
| [T-058 Audit Shopify product link data](T-058-audit-shopify-product-link-data.md) | Completed | Added a read-only audit for existing artwork Shopify product links before migration or admin-linking work. |
| [T-059 Run Shopify product link audit](T-059-run-shopify-product-link-audit.md) | Completed | Ran the read-only Shopify product-link audit against the owner-approved MongoDB target and recorded follow-up evidence. |
| [T-060 Remove unsupported shop controls](T-060-remove-unsupported-shop-controls.md) | Completed | Removed public shop colour/dimension filters and fake pagination that are not backed by API behavior. |
| [T-061 Use explicit shop product type sorting](T-061-use-explicit-shop-product-type-sorting.md) | Completed | Carried Shopify productType/tags through product DTOs and sorted shop products by explicit metadata instead of title keywords. |
| [T-062 Preserve Shopify variant metadata](T-062-preserve-shopify-variant-metadata.md) | Completed | Carried queried Shopify variant metadata through product DTOs without implementing checkout or variant-selection UI. |
| [T-063 Preserve Shopify description HTML](T-063-preserve-shopify-description-html.md) | Completed | Carried queried Shopify descriptionHtml through product DTOs without rendering rich HTML or changing product-detail UI. |
| [T-064 Pin Node and npm runtime](T-064-pin-node-npm-runtime.md) | Completed | Pinned the Node/npm install baseline and updated setup/deployment docs to use lockfile-based installs. |
| [T-065 Update environment inventory](T-065-update-environment-inventory.md) | Completed | Updated the environment runbook from current env usage without recording secret values or changing runtime config. |
| [T-066 Harden Cloudinary signing params](T-066-harden-cloudinary-signing-params.md) | Completed | Restricted Cloudinary upload signing to explicit current-widget params and documented remaining preset/folder/lifecycle decisions. |
| [T-067 Remove Cloudinary upload debug logs](T-067-remove-cloudinary-upload-debug-logs.md) | Completed | Removed always-on debug logging, polling, and DOM inspection from the admin Cloudinary upload button while preserving widget behavior. |
| [T-068 Remove public shop debug logs](T-068-remove-public-shop-debug-logs.md) | Completed | Removed always-on debug logging from public shop route/gallery/loader paths while preserving backed shop behavior. |
| [T-069 Remove shared fetcher debug logs](T-069-remove-shared-fetcher-debug-logs.md) | Completed | Removed always-on debug logging from the shared API fetcher and server API URL helper files without changing fetch behavior. |
| [T-070 Migrate collections subnav loader service](T-070-migrate-collections-subnav-loader-service.md) | Completed | Moved the collections subnav loader off same-app HTTP by sharing a server-only collection navigation service with the public route. |
| [T-071 Migrate article navigation loaders service](T-071-migrate-article-navigation-loaders-service.md) | Completed | Moved biography and main navigation loaders off same-app HTTP by sharing a server-only article navigation service with the public route and reusing the collection navigation service in the main nav. |
| [T-072 Migrate article navigation page consumers](T-072-migrate-article-navigation-page-consumers.md) | Completed | Finished article navigation same-app HTTP cleanup in the biography default page and ArticleLoader navigation path. |
| [T-073 Migrate collection redirect pages service](T-073-migrate-collection-redirect-pages-service.md) | Completed | Moved collection redirect pages off same-app HTTP by sharing collection navigation list and item services with the public routes. |
| [T-074 Migrate article detail loader service](T-074-migrate-article-detail-loader-service.md) | Completed | Moved ArticleLoader's populated article detail fetch off same-app HTTP by sharing a server-only article detail service with the public route. |
| [T-075 Migrate blog detail loader service](T-075-migrate-blog-detail-loader-service.md) | Completed | Moved BlogDetailLoader off same-app HTTP by sharing server-only blog detail service logic with the public detail routes. |
| [T-076 Migrate blog list section loaders service](T-076-migrate-blog-list-section-loaders-service.md) | Completed | Moved BlogListLoader and BlogSectionLoader off same-app HTTP by sharing server-only blog list service logic with the public blog list route. |
| [T-077 Migrate artwork detail loader service](T-077-migrate-artwork-detail-loader-service.md) | Completed | Moved ArtworkLoader off same-app HTTP by reusing the existing server-only artwork detail service that backs the public artwork detail route. |
| [T-078 Migrate collection artwork loaders service](T-078-migrate-collection-artwork-loaders-service.md) | Completed | Moved collection artwork detail and pagination loaders off same-app HTTP by sharing server-only collection artwork service logic with the public routes. |
| [T-079 Migrate biography section loader service](T-079-migrate-biography-section-loader-service.md) | Completed | Moved BiographySectionLoader off same-app HTTP by sharing server-only article list service logic with the public article list route. |
| [T-080 Migrate collection section loader service](T-080-migrate-collection-section-loader-service.md) | Completed | Moved CollectionSectionLoader off same-app HTTP by sharing server-only collection list service logic with the public collection list route. |
| [T-081 Migrate account subnav loader service](T-081-migrate-account-subnav-loader-service.md) | Completed | Moved AccountSubnavLoader off same-app HTTP by sharing server-only account navigation service logic with the user navigation route. |
| [T-082 Harden admin Shopify product link validation](T-082-harden-admin-shopify-product-link-validation.md) | Completed | Recorded the shared book-link policy and hardened admin artwork Shopify product-link validation. |
| [T-083 Migrate account saved artwork loaders service](T-083-migrate-account-saved-artwork-loaders-service.md) | Completed | Moved favourites/watchlist account loaders off same-app HTTP by sharing server-only saved-artwork services with the user read routes. |

## Rules

- Keep one task brief scoped to one implementation slice.
- Link the findings, risks, and workstreams that justify the task.
- Include verification commands before assigning the task.
- Update status and outcome after completion.
