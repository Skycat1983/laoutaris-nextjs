# Audit Findings Register

This register tracks cross-audit findings through review and reconciliation.

Do not use this as a replacement for detailed audit results. Use it to dedupe,
prioritize, and route actionable findings.

## Register

| Finding ID | Source Audit | Severity | Status | Finding | Evidence | Destination | Reviewer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-001 | A-012 | Medium | Resolved | Documentation system needed a review pass after the first real audit to confirm agents can follow it without chat context. | A-012 completed link, audit/result consistency, workstream contract, and result-section checks with no broken relative links reported. | [A-012 result](results/A-012-documentation-knowledge-base.md) | Reconciled 2026-05-14 |
| F-002 | A-013 | High | Resolved | Architecture refactor scope had to be audited before broad code changes began. | A-013 completed with evidence-backed scope findings, preservation patterns, ADR escalation, and next implementation splits. | [A-013 result](results/A-013-architecture-refactor-scope.md), [architecture backlog](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-003 | A-006 | High | Converted | Testing is not yet proven as a reliable safety net for production refactors. | A-006 found 9 passing suites but only 1.78% statement coverage across `src/**/*.{ts,tsx}` and no API, auth/admin, Shopify, or route-loader coverage. | [A-006 result](results/A-006-testing-quality-baseline.md), [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-004 | A-012 | Medium | Resolved | Audit entry order was split between workstream-first and audit-goal-first instructions. | A-012 cited conflicting audit entry instructions in `AGENTS.md`, `docs/README.md`, and `docs/audits/README.md`. | [AGENTS.md](../../AGENTS.md), [docs README](../README.md), [audits README](README.md) | Reconciled 2026-05-14 |
| F-005 | A-012 | Medium | Resolved | Shared-file update rules were ambiguous in concurrent audit mode. | A-012 cited general handoff rules that conflicted with scoped audit-result instructions. | [AGENTS.md](../../AGENTS.md), [audits README](README.md) | Reconciled 2026-05-14 |
| F-006 | A-012 | Medium | Resolved | Status synchronization ownership was unclear when audit agents were scoped to one result file. | A-012 cited `docs/orchestration/state.md` and `docs/audits/results/README.md` as requiring sync without assigning ownership. | [audits README](README.md), [audit goals](goals.md), [results index](results/README.md), [orchestration state](../orchestration/state.md) | Reconciled 2026-05-14 |
| F-007 | A-012 | Low | Resolved | Shared trackers did not define a default reviewer or owner for `Unassigned` rows. | A-012 cited `Unassigned` rows in this register and the production risk tracker. | [this register](findings-register.md), [production risks](../risks/production-readiness.md) | Reconciled 2026-05-14 |
| F-008 | A-001, A-015 | High | Converted | Product detail pages fetch linked artwork from a non-existent `/api/artworks/:id` route and cannot reliably render archive context. | A-001 and A-015 both found `/shop/products/[productHandle]` uses `/api/artworks/:id`; the live route is `/api/v2/public/artwork/[id]` and returns an envelope. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-009 | A-001 | High | Converted | Checkout/cart handoff is undefined while product detail shows an `Add to Cart` affordance. | A-001 found the product detail button has no handler, cart mutation, checkout URL, or variant selection. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-010 | A-001, A-003 | High | Converted | Admin Shopify product-linking workflow and validation are missing. | A-001 found `shopifyProducts` exists in the model while schemas/admin forms lack a dedicated validated workflow; A-003 confirmed artwork create/update schemas still omit Shopify product links. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md) | Reconciled 2026-05-14 |
| F-011 | A-001, A-007, A-008 | High | Partially mitigated | Shopify credential handling violates the env-only documentation expectation. | T-009 removed the concrete Storefront-token-shaped comment from `src/lib/config/shopifyConfig.ts` and added a focused source-comment regression check. Owner verification of whether the removed value was real, and rotation if needed, remains open. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-009](../tasks/T-009-remove-credential-logging-and-source-secret.md) | T-009 2026-05-14 |
| F-012 | A-001, A-002, A-003 | Medium | Converted | Shopify product ID shape is documented as numeric but not validated or migrated. | A-001 found docs/types expect numeric IDs while the model accepts any string and the listing API blindly prefixes stored values as Shopify GIDs; A-002 found the single product route accepts arbitrary path segments; A-003 confirmed schemas omit product-link validation. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-013 | A-001, A-013 | Medium | Converted | Shop filters, pagination, and sorting expose UI behavior that is not backed by canonical API data. | A-001 found color/dimension filters are not sent, pagination controls are hard-coded, and type sorting depends on title keywords; A-013 found duplicated filter sentinels. | [Shopify workstream](../workstreams/shopify-commerce.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-014 | A-001 | Medium | Converted | Shopify product transformation drops fields needed for product detail and checkout hardening. | A-001 found GraphQL queries include variants, product type, tags, and descriptions, but the simple transform drops variant IDs, availability, type, tags, and description HTML. | [Shopify workstream](../workstreams/shopify-commerce.md), [data/API workstream](../workstreams/data-models-and-api.md) | Reconciled 2026-05-14 |
| F-015 | A-001, A-002, A-003, A-013 | High | Partially mitigated | API response and transform contracts are uneven across public, user, admin, and shop routes. | A-001 found inconsistent shop listing versus single-product envelopes; A-013 found raw errors, missing statuses, and raw Mongoose documents; A-002 and A-003 expanded this to public, user, admin, shop, profile, comment, enquiry, and admin write routes. T-044 introduced shared API response helpers and applied them to protected user profile/navigation/favourite/watchlist read routes while preserving existing success contracts. T-045 applied the helpers to public artwork/article/blog detail routes while preserving transformed DTO success envelopes. T-046 applied the helpers to public collection list/detail/artwork routes while preserving current success contracts. T-047 applied the helpers to public article/collection navigation routes while preserving current navigation success contracts. T-048 applied the helpers to admin article/artwork/blog/collection/comment/user read list/detail routes while preserving admin success DTOs and metadata. T-049 applied the helpers to admin article/artwork/blog/collection/comment/user delete routes while preserving delete success messages, `data: null`, conflict handling, cascade behavior, and transaction ordering. T-050 applied the helpers to admin article/artwork/blog/collection create/update routes while preserving validation bodies, success DTOs, create statuses, not-found/conflict handling, and allowlisted persistence. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-016 | A-002, A-003, A-004, A-006, A-007, A-015, A-016 | High | Converted | Production-critical APIs, auth/admin flows, Shopify paths, deployment smoke checks, SSR behavior, and input persistence boundaries lack reliable tests. | A-006 found no API/auth/admin/Shopify coverage; A-015 found no route handler, server loader, Shopify cache, or page-render tests; A-002, A-003, A-004, and A-007 added route contract, transform, auth/session, and deployment smoke coverage gaps; A-016 found no focused tests for enquiry, subscription, comments, admin write validation, or search query parsing. | [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-017 | A-006 | Medium | Converted | The only integration test mostly verifies mocks rather than production Home behavior. | A-006 found `Home.test.tsx` mocks the component under test and its child modules. | [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-018 | A-006 | Medium | Converted | Coverage is not a documented or enforced gate. | A-006 found no coverage script, no coverage thresholds, and a probe showing 1.78% statement coverage across `src`. | [testing workstream](../workstreams/testing-and-quality.md), [testing runbook](../runbooks/testing.md) | Reconciled 2026-05-14 |
| F-019 | A-006, A-007 | High | Converted | Build verification is coupled to external Google Fonts and live MongoDB/environment access. | A-006 found sandbox build failure on Google Fonts and successful network build that still performed production MongoDB connection and route/data fetch work; A-007 found a sandbox build failed on MongoDB DNS/egress and the external-access build passed while still using live MongoDB. | [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing runbook](../runbooks/testing.md) | Reconciled 2026-05-14 |
| F-020 | A-001, A-002, A-006, A-007, A-013, A-015 | Low | Partially mitigated | Debug logs, expected error output, and debug-only delays make tests, builds, SSR, API, upload, and commerce paths noisy. | Completed audits found console output in tests/builds, fetcher stack logs, DB logs, route logs, product logs, upload widget logs, root layout logs, and an `ArtworkLoader` delay. T-041 removed the always-on middleware path/token/role debug logs; other build, DB, fetcher, upload, commerce, and SSR noise remains. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md) | T-041 2026-05-15 |
| F-021 | A-013, A-015 | High | Partially mitigated | Server-side data access has competing ownership models and relies on same-app HTTP self-fetching. | T-007, T-018, and T-021 proved the ADR 0004 service pattern for artwork-by-ID, `/artwork` list, and `/search`; other route-critical loaders/actions still need staged migration off same-app HTTP wrappers. | [ADR 0004](../decisions/0004-server-data-access-ownership.md), [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [rendering architecture](../architecture/rendering-and-data-fetching.md), [T-018](../tasks/T-018-artwork-list-server-data-proof.md), [T-021](../tasks/T-021-public-search-query-service.md) | T-021 2026-05-14 |
| F-022 | A-013, A-015 | High | Converted | Client/server import boundaries are leaky and can pull server/model modules into client components. | A-013 and A-015 found client components importing `serverApi`, Mongoose model types as values, broad barrels, and server/model modules. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [frontend workstream](../workstreams/frontend-routes-and-components.md) | Reconciled 2026-05-14 |
| F-023 | A-013 | Medium | Converted | Domain taxonomy and filter state are duplicated across constants, schemas, public filters, admin forms, and shop filters. | A-013 found repeated artwork option literals and separate shop sentinel values. | [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-024 | A-002, A-013, A-015 | High | Partially mitigated | Several MongoDB-backed API routes used by SSR omit route-local `dbConnect()` setup. | T-018, T-021, T-027, and T-028 added explicit DB ownership to the public artwork list, public search, user saved read-route, and favourite/watchlist account action slices. T-046 added explicit route-local `dbConnect()` ownership before model reads in public collection list/detail/artwork routes. T-047 added explicit route-local `dbConnect()` ownership before model reads in public collection navigation detail and collection artworks navigation routes while preserving existing ownership in the list routes. A-002's broader inventory still includes remaining public/admin routes without explicit connection ownership. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-018](../tasks/T-018-artwork-list-server-data-proof.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-027](../tasks/T-027-user-saved-routes-shared-guard.md), [T-028](../tasks/T-028-saved-item-actions-db-revalidation.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md) | T-047 2026-05-15 |
| F-025 | A-015 | High | Partially mitigated | Root layout DB/session work forces global dynamic rendering and blocks route-specific cache policy. | A-015 found `RootLayout` calls `dbConnect()` and `getServerSession()` on every root render. The 2026-05-14 Vercel bcrypt incident added evidence that root-layout `authOptions` imports also pulled credentials password verification and native bcrypt into public page bundles. T-023 lazy-loads the credentials authorize implementation so public auth/session imports no longer eagerly load bcrypt; broader root DB/session ownership remains open. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [ADR 0004](../decisions/0004-server-data-access-ownership.md), [T-023](../tasks/T-023-root-layout-auth-bcrypt-decoupling.md), [bcrypt incident](../tasks/incident-2026-05-14-vercel-bcrypt-native-trace.md) | T-023 2026-05-14 |
| F-026 | A-015 | Medium | Converted | Cache and revalidation policy is inconsistent across MongoDB, Shopify, public, user, and admin reads. | A-015 found Shopify production revalidation, `no-store` shop listing/detail fetches, dynamic navigation APIs, and mostly implicit public API cache behavior. | [rendering architecture](../architecture/rendering-and-data-fetching.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-027 | A-015 | Medium | Resolved | Account favourite/watchlist server actions lack explicit DB connection setup and route revalidation. | Resolved by T-028 on 2026-05-14: favourite/watchlist actions now reject missing or non-string `artworkId` values before DB/model work, call `dbConnect()` before Mongoose reads/writes on valid authenticated requests, revalidate affected account/artwork routes only after successful toggles, and have focused action tests. | [auth workstream](../workstreams/auth-admin-and-permissions.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-028](../tasks/T-028-saved-item-actions-db-revalidation.md) | T-028 2026-05-14 |
| F-028 | A-015 | Medium | Converted | Loader error, empty, and not-found behavior is inconsistent across route types. | A-015 found route-critical loaders throwing, swallowing errors to `null`, or returning no explicit state, with only a root error boundary. | [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-029 | A-013 | Medium | Converted | Admin feature isolation is good, but entity operations are repeated across tabs, read lists, feeds, and clients. | A-013 compared repeated admin operation tab and feed/read-list patterns across entity types. | [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-030 | A-007, A-013 | Medium | Converted | Route URL ownership is split across helpers and hard-coded paths. | A-013 found localhost UI links, same-app redirects using absolute URLs, and non-v2 artwork endpoints in product detail; A-007 found hard-coded production base URLs, separate `NEXT_PUBLIC_BASE_URL` shop behavior, and a `VERCEL_URL` redirect without protocol handling. | [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [Shopify workstream](../workstreams/shopify-commerce.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |
| F-031 | A-014 | Medium | Converted | High-confidence unused leaf files, WIP variants, barrels, starter assets, and import cleanup need staged pruning with verification. | A-014 listed zero-import UI/WIP files, unused barrels, starter assets, and unused exports/imports with targeted reference-search evidence. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-032 | A-004, A-014 | Medium | Resolved | Auth/session cleanup and stale `/protected` route deletion need auth-owner confirmation before pruning. | Resolved by T-019 on 2026-05-14: `LoginForm`, `processLogin`, the custom JWT cookie session helpers, unreferenced duplicate/test-header session helpers, `src/app/protected/page.tsx`, and the stale protected-route constant were removed after reference searches confirmed no active owner workflow; focused sign-in/route utility tests and lint passed. Package cleanup remains separate. | [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-019](../tasks/T-019-legacy-auth-session-pruning.md) | T-019 2026-05-14 |
| F-033 | A-014 | Medium | Converted | The translation pipeline is mostly unused and needs owner direction before pruning or integration. | A-014 found `TranslatedContent` and translation data have no live rendered consumers beyond global language state. | [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md) | Reconciled 2026-05-14 |
| F-034 | A-014, A-019 | Medium | Resolved | Unused direct dependencies need a package-focused cleanup with lockfile and full verification. | Resolved by T-022 on 2026-05-14: removed unused direct `jose`, `next-test-api-route-handler`, `@types/uuid`, Shopify/GraphQL client packages, and the direct `@radix-ui/react-dialog` manifest entry; refreshed `package-lock.json`; confirmed `core-js` is gone and remaining `jose`/Radix dialog paths are transitive only; full Jest, lint, npm tree, and audit verification passed. T-021 later cleared the unrelated public-search schema build blocker and `npm run build` passed. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-022](../tasks/T-022-prune-unused-package-candidates.md) | T-022 2026-05-14 |
| F-035 | A-014 | Low | Converted | Root Shopify historical notes should not be deleted until useful facts are consolidated. | A-014 found six root `SHOP*.md` notes totaling 1,555 lines and `docs/archive/README.md` says filtering/sorting history still needs review. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-036 | A-002, A-004 | High | Partially mitigated | API failures and protected API auth responses do not consistently return real HTTP status codes. | T-026 added shared route-local user/admin API guards and migrated admin collection create/update plus user profile auth-status behavior to real JSON `401`/`403` responses. T-027 applied the user guard to navigation, favourites, and watchlist read routes so unauthenticated callers receive real JSON `401` before DB/model work. T-033 migrated user comment delete to the shared user guard before DB/transaction work, added route-param validation before DB work, and fixed the typed delete envelope. T-039 migrated admin article/artwork/blog/collection/comment/user read routes to `requireApiAdmin()`, added target-read `dbConnect()` ownership, and added JSON `400` detail ID handling before target reads. T-040 migrated admin article/artwork/blog/collection/comment/user delete routes to `requireApiAdmin()`, added destructive ID validation before target/session work, route-local DB ownership, and focused cascade/delete coverage. T-041 changed middleware so unauthenticated protected API requests receive shared JSON `401` responses instead of browser redirects while frontend redirects are preserved. T-042 migrated user comment GET/POST/PATCH to `requireApiUser()` before body, DB, model, or transaction work, and made GET missing-user/internal failures return real `404`/`500` statuses. T-043 added static protected user/admin guard inventory coverage so protected route files must keep shared guard imports/calls, avoid direct session/admin helper checks, and call guards before body, DB, model, or transaction work. T-044 changed protected user profile/navigation/favourite/watchlist missing-resource and internal-failure paths to real `404`/`500` statuses through shared response helpers. T-045 changed public artwork/article/blog detail missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-046 changed public collection missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-047 changed public navigation missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-048 changed admin read empty-list, missing-resource, and internal-failure paths to real `404`/`500` statuses through the same helpers while preserving auth and invalid-ID behavior. T-049 changed admin delete missing-resource, artwork conflict, and internal-failure paths to real `404`/`409`/`500` statuses through the same helpers while preserving auth, invalid-ID, cascade, and transaction behavior. T-050 changed admin create/update success, missing-resource, blog slug conflict, and internal-failure paths to shared helper envelopes with real `201`/`200`/`404`/`409`/`500` statuses while preserving validation and guard ordering. Other response-helper and logging cleanup remains separate. | [A-002 result](results/A-002-api-contracts.md), [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-026](../tasks/T-026-shared-api-route-guards.md), [T-027](../tasks/T-027-user-saved-routes-shared-guard.md), [T-033](../tasks/T-033-harden-user-comment-delete-route.md), [T-039](../tasks/T-039-migrate-admin-read-routes-shared-guard.md), [T-040](../tasks/T-040-migrate-admin-delete-routes-shared-guard.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md), [T-042](../tasks/T-042-migrate-user-comment-read-write-shared-guard.md), [T-043](../tasks/T-043-add-protected-api-guard-inventory.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-037 | A-002 | High | Resolved | API client fetchers expose unsupported route paths and methods. | Resolved by T-032 on 2026-05-15: T-029 made these mismatches measurable with a focused route/fetcher parity test and self-checking known-gap allowlist; T-030 added the active admin user/comment detail read routes; T-031 removed unused favourite/watchlist write fetchers; and T-032 removed the unused profile update fetcher. `KNOWN_ROUTE_FETCHER_GAP_IDS` is now empty and the parity test passes with all inventoried fetcher operations backed by matching route methods. | [A-002 result](results/A-002-api-contracts.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-029](../tasks/T-029-route-fetcher-parity-inventory.md), [T-030](../tasks/T-030-admin-user-comment-detail-read-routes.md), [T-031](../tasks/T-031-prune-unused-saved-item-write-fetchers.md), [T-032](../tasks/T-032-prune-unused-profile-update-fetcher.md) | T-032 2026-05-15 |
| F-038 | A-002, A-003 | High | Converted | Create/update routes bypass validation or convert validation failures to 500 and return raw documents under typed result contracts. | A-002 found admin and user create/update validation is uneven and often caught as 500; A-003 found exported Zod schemas are bypassed in several admin writes and route responses are typed as transformed results while returning raw Mongoose documents. | [A-002 result](results/A-002-api-contracts.md), [A-003 result](results/A-003-data-models-transforms.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-039 | A-003 | High | Converted | Required and optional field contracts disagree across Mongoose models, Zod schemas, and TypeScript types. | A-003 found article `section`, blog `imageUrl`/`pinned`/`tags`, and user `password` are defined inconsistently across persistence, validation, frontend types, and auth adapter behavior. | [A-003 result](results/A-003-data-models-transforms.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md) | Reconciled 2026-05-14 |
| F-040 | A-003 | Medium | Resolved | Public transform extenders can emit defaults or `undefined` values that conflict with frontend contracts. | Resolved by T-051 on 2026-05-15: blog transforms derive `readTime` from text, collection transforms return `firstArtworkId: null` instead of `undefined` for empty collections, public user transforms compute `isOwner` while filtering `email` and `password`, and populated comment/blog transforms preserve supplied `userId` ownership context. | [A-003 result](results/A-003-data-models-transforms.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-051](../tasks/T-051-add-public-transform-contract-coverage.md) | T-051 2026-05-15 |
| F-041 | A-003 | Medium | Converted | Public artwork image payloads bypass Cloudinary sanitization and include undocumented image fields. | A-003 found `transformArtwork` does not use `transformImage`, so public artwork can expose `image.public_id`; the color-proximity route also injects untyped `image.similarityScore`, and Cloudinary schemas use loose color validation. | [A-003 result](results/A-003-data-models-transforms.md), [data/API workstream](../workstreams/data-models-and-api.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-042 | A-004 | High | Resolved | Credentials admin sessions did not persist the database role into JWT/session state. | Resolved by T-002 on 2026-05-14: credentials auth now returns the persisted role, the JWT/session callbacks preserve it, and `npm test`, targeted auth/route tests, `npm run lint`, and `npm run build` passed. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md) | T-002 2026-05-14 |
| F-043 | A-004 | High | Resolved | User ownership checks depended on mutable display names and could create users during protected reads. | Resolved by T-003 on 2026-05-14: `getUserIdFromSession()` now returns stable `session.user.id`, the normal session user helper no longer resolves by `session.user.name` or creates users, and focused auth tests cover the helper behavior. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md) | T-003 2026-05-14 |
| F-044 | A-002, A-004, A-007, A-008 | High | Partially mitigated | Cloudinary signing bypasses standard admin/API/upload configuration controls. | T-005 added a route-local API admin guard, JSON 401/403 responses, request and `paramsToSign` validation, missing-secret handling, an additive success envelope, and focused route tests; A-007 and A-008 confirm Cloudinary env variables, upload preset ownership, allowed params, and asset lifecycle policy remain open. | [A-002 result](results/A-002-api-contracts.md), [A-004 result](results/A-004-auth-admin-permissions.md), [A-007 result](results/A-007-deployment-environment.md), [A-008 result](results/A-008-security-headers-cors-logging.md), [T-005](../tasks/T-005-cloudinary-signing-api-guard.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | T-005 2026-05-14 |
| F-045 | A-004 | Medium | Converted | Admin bootstrap and recovery are not documented as repeatable operations. | A-004 found the auth runbook keeps admin bootstrap/recovery open, OAuth adapter-created users default to `role: "user"`, and no admin promotion, seed, or recovery script was found. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md) | Reconciled 2026-05-14 |
| F-046 | A-007 | High | Converted | A server-only MongoDB connection string is exposed through Next config `env`. | A-007 found `next.config.mjs` assigns `MONGO_URI: process.env.MONGO_URI` under `env` while `MONGO_URI` is a secret used by server DB helpers. | [A-007 result](results/A-007-deployment-environment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |
| F-047 | A-007 | High | Converted | The environment runbook is missing active variables and decisions for legacy or platform-provided values. | A-007 found active usage or local keys for `JWT_SECRET`, `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, `VERCEL_URL`, Cloudinary variables, and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` that are not fully documented or decisioned. | [A-007 result](results/A-007-deployment-environment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md) | Reconciled 2026-05-14 |
| F-048 | A-007 | Medium | Partially mitigated | Deployment smoke checks, runtime version, Vercel settings, and rollback steps are not repeatable. | T-025 expanded the deployment runbook with exact smoke evidence fields, minimum route/status expectations, credentials smoke secret handling, targeted Vercel log requirements, concrete rollback triggers, and added `npm run smoke:public` for unauthenticated public-route status checks. Remaining runtime and Vercel project-setting pins stay open under F-064/R-028. | [A-007 result](results/A-007-deployment-environment.md), [deployment runbook](../runbooks/deployment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [T-024](../tasks/T-024-verify-vercel-bcrypt-redeploy-smoke.md), [T-025](../tasks/T-025-repeatable-vercel-smoke-checklist.md) | T-025 2026-05-14 |
| F-049 | A-002 | Medium | Partially mitigated | Public list and search route semantics are under-specified. | T-021 made public search honor the fetcher's `type` parameter while preserving the existing success envelope; search pagination metadata and broader empty-list semantics remain under-specified. | [A-002 result](results/A-002-api-contracts.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-021](../tasks/T-021-public-search-query-service.md) | T-021 2026-05-14 |
| F-050 | A-002 | Medium | Converted | The admin API action-segment route convention is not documented or decisioned. | A-002 found admin APIs use `/admin/{entity}/create`, `/read`, `/update/[id]`, and `/delete/[id]`, while the architecture docs only describe admin CRUD at a high level and do not state whether action segments are canonical. | [A-002 result](results/A-002-api-contracts.md), [data/API workstream](../workstreams/data-models-and-api.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-051 | A-008 | High | Resolved | Registration logs expose raw password, hashed password, and saved user document data. | Resolved by T-009 on 2026-05-14: `registerUser` no longer emits direct console logs, and a focused source hygiene test fails if registration console logging returns. | [A-008 result](results/A-008-security-headers-cors-logging.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-009](../tasks/T-009-remove-credential-logging-and-source-secret.md) | T-009 2026-05-14 |
| F-052 | A-008 | Medium | Converted | Global API CORS and CSP policy are too broad for the production admin, auth, and commerce surface. | A-008 found `next.config.mjs` applies wildcard API CORS with credentials and allows broad CSP sources, unsafe script behavior, and missing hardening directives. | [A-008 result](results/A-008-security-headers-cors-logging.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |
| F-053 | A-008 | Medium | Partially mitigated | Production logging and API error responses need redaction and public-safe exception handling. | A-008 found always-on middleware/session/fetcher/DB/API logs and public/admin routes returning raw exception messages, including public enquiry and public artwork detail errors. T-041 removed middleware debug logs and returned public-safe shared auth-error envelopes for middleware API `401`/`403` responses. T-044 added public-safe `500` response bodies for protected user profile/navigation/favourite/watchlist read-route internal failures. T-045 added public-safe `500` response bodies for public artwork/article/blog detail internal failures and removed touched public blog detail debug logs. T-046 added public-safe `500` response bodies for public collection route internal failures and removed touched collection request debug logging. T-047 added public-safe `500` response bodies for public navigation route internal failures and removed touched navigation request/found/no-results debug logging. T-048 added public-safe `500` response bodies for admin read route internal failures. T-049 added public-safe `500` response bodies for admin delete route internal failures and removed touched admin delete debug logs. T-050 added public-safe `500` response bodies for admin create/update route internal failures and preserved private-message redaction; broader session, fetcher, DB, API exception, and logging-policy work remains. | [A-008 result](results/A-008-security-headers-cors-logging.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-054 | A-008 | Medium | Duplicate | Cloudinary signing allowed params, upload preset ownership, and lifecycle policy remain incomplete. | A-008 confirmed the signing route still signs arbitrary plain-object params and needs A-009 policy follow-up after T-005's route guard hardening. | F-044, [A-008 result](results/A-008-security-headers-cors-logging.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md) | Reconciled 2026-05-14 |
| F-055 | A-016 | High | Resolved | Public enquiry accepts and logs raw request bodies without route validation. | Resolved by T-010 on 2026-05-14: `POST /api/v2/public/enquiry` now validates a shared normalized DTO with `safeParse`, persists only parsed fields, removes request-body logging, returns real HTTP 400 field errors and public-safe 500s, and has focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-010](../tasks/T-010-public-enquiry-validation.md) | T-010 2026-05-14 |
| F-056 | A-016 | High | Resolved | User comment creation reads the request body twice and bypasses the existing comment schema. | Resolved by T-012 on 2026-05-14: `POST /api/v2/user/comment` now authenticates, reads JSON once, validates and trims route-safe comment input, returns real 401/400/404/500 statuses, persists only parsed text, keeps transactional blog/user linkage, returns a transformed frontend DTO, and has focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-012](../tasks/T-012-user-comment-validation.md) | T-012 2026-05-14 |
| F-057 | A-016 | High | Resolved | Admin create/update route validation is inconsistent and invalid input often becomes a 500. | Resolved by T-020, T-034, T-037, and T-038: collection, article, artwork, and blog create/update routes now use strict route schemas, parsed allowlisted persistence, route-param validation where applicable, shared admin guards before body reads, route-local `dbConnect()` before model writes, structured validation responses, session-owned create authors, public-safe persistence failures, and focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [testing workstream](../workstreams/testing-and-quality.md), [T-020](../tasks/T-020-admin-collection-write-validation.md), [T-034](../tasks/T-034-harden-admin-article-write-validation.md), [T-037](../tasks/T-037-harden-admin-artwork-write-validation.md), [T-038](../tasks/T-038-harden-admin-blog-write-validation.md) | T-038 2026-05-15 |
| F-058 | A-016 | High | Resolved | Current sign-in UI bypasses the validation/auth action path and calls `signIn()` without field values. | Resolved by T-013 on 2026-05-14: `SignInForm` now validates username/password through the shared credentials schema, calls `signIn("credentials", { username, password, redirect: false })`, shows field and generic auth errors, updates the session after success, and has focused component tests for validation, success wiring, bad credentials, accessible fields, and modal switching. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-013](../tasks/T-013-sign-in-flow-repair.md) | T-013 2026-05-14 |
| F-059 | A-016 | Medium | Resolved | Subscription server action accepts any non-empty email string. | Resolved by T-017 on 2026-05-14: `submitSubscription` now validates defensive `FormData` input with the subscriber schema before MongoDB access, trims and lowercases accepted email values, owns `dbConnect()`, duplicate-checks and persists the normalized DTO, removes direct input logging, returns stable public-safe failures, and has focused action tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-017](../tasks/T-017-subscription-validation.md) | T-017 2026-05-14 |
| F-060 | A-016 | Medium | Resolved | Public search, artwork browse, and shop browse APIs need query parsing and bounds. | Resolved by T-021, T-035, and T-036: public search now validates and bounds `q`/`type`/`page`/`limit` and escapes regex input; public artwork browse now validates filter/sort/color/pagination params before session or service work; public shop browse now validates repeated filters, product-type boolean strings, and optional `sortBy` before `dbConnect()`, MongoDB query construction, or Shopify product fan-out. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-035](../tasks/T-035-bound-public-artwork-browse-query.md), [T-036](../tasks/T-036-bound-public-shop-browse-query.md) | T-036 2026-05-15 |
| F-061 | A-016 | Medium | Resolved | Comment edit bypasses the max-length and trim schema used by the UI. | Resolved by T-012 on 2026-05-14: `PATCH /api/v2/user/comment/[commentId]` now validates the ObjectId route param and route-safe body schema, trims persisted text, enforces ownership, returns real 401/400/403/404/500 statuses, returns a transformed frontend DTO, and has focused route tests for blank/overlong/forbidden/success paths. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-012](../tasks/T-012-user-comment-validation.md) | T-012 2026-05-14 |
| F-062 | A-016 | Medium | Partially mitigated | Legacy auth, search, and comment controls need accessible labels and button semantics. | T-013 fixed the sign-in slice by adding labels/accessible names to the credential fields and converting the sign-in/sign-up modal switches from clickable spans to buttons; search drawer/icon controls and comment icon actions remain open. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-013](../tasks/T-013-sign-in-flow-repair.md) | T-013 2026-05-14 |
| F-063 | A-019 | High | Partially mitigated | Production dependency audit reports high runtime vulnerabilities that need major-migration decisions. | T-016 upgraded `bcrypt` to `6.0.0` and removed the `bcrypt -> @mapbox/node-pre-gyp -> tar` production advisory path. T-015 confirmed `npm audit --omit=dev --json` now exits `1` with only residual `next@14.2.35` and nested `next/node_modules/postcss` advisories. npm recommends stable `next@16.2.6`, but isolated metadata/audit checks show that stable release still bundles vulnerable `postcss@8.4.31`; canary `16.3.0-canary.6+` declares `postcss@8.5.10` and clears an isolated audit. No stable target or residual production advisory is accepted for launch until the owner/orchestrator chooses the path. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [T-011](../tasks/T-011-production-dependency-security-patch.md), [T-014](../tasks/T-014-residual-dependency-advisory-decision.md), [T-015](../tasks/T-015-next-major-migration-preflight.md), [T-016](../tasks/T-016-bcrypt-6-compatibility.md) | T-015 2026-05-14 |
| F-064 | A-019 | High | Converted | Package-manager, Node runtime, CI, and automated dependency-update controls are missing. | A-019 found no `packageManager`, `engines`, `.nvmrc`, `.node-version`, `.npmrc`, `.github` workflow, Dependabot, or Renovate config; setup docs use `npm install`. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-065 | A-019 | Medium | Partially mitigated | Required install lifecycle scripts need an explicit policy. | A-019 found required install scripts for `bcrypt` and `core-js`, with `core-js` pulled by unused `next-test-api-route-handler` and `bcrypt` tied to the high `tar` advisory path. T-016 removed the `bcrypt -> @mapbox/node-pre-gyp -> tar` advisory path, T-022 removed `next-test-api-route-handler` plus the `core-js` install-script path, and T-023 removed bcrypt from normal public-page imports. T-024 confirmed `origin/main` contains T-023 and production `GET /` returns `HTTP/2 200`, closing the bcrypt native-load crash; native `bcrypt` runtime policy remains open for future dependency/runtime changes. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-016](../tasks/T-016-bcrypt-6-compatibility.md), [T-022](../tasks/T-022-prune-unused-package-candidates.md), [T-023](../tasks/T-023-root-layout-auth-bcrypt-decoupling.md), [T-024](../tasks/T-024-verify-vercel-bcrypt-redeploy-smoke.md), [bcrypt incident](../tasks/incident-2026-05-14-vercel-bcrypt-native-trace.md) | T-024 2026-05-14 |
| F-066 | A-019 | Medium | Converted | Dev/test tooling carries critical/high advisories and deprecated transitive packages. | A-019 full `npm audit --json` reported 31 total vulnerabilities, including dev-only critical `form-data` through `jest-environment-jsdom`/`jsdom`, and 15 deprecated transitive packages. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |

## Reconciliation Notes

2026-05-14: Reconciled completed audits A-001, A-006, A-012, A-013, A-014, and
A-015 into this register, production risks, relevant workstream backlogs,
[ADR 0004](../decisions/0004-server-data-access-ownership.md), and the
[testing runbook](../runbooks/testing.md). No runtime implementation was
performed.

2026-05-14: [ADR 0004](../decisions/0004-server-data-access-ownership.md) was
accepted and chooses direct server data-access services as the canonical
server-side pattern.

2026-05-14: Reconciled completed audits A-002, A-003, A-004, and A-007 into
this register, production risks, and relevant workstream backlogs. Existing
findings were updated where the audits added evidence for Shopify credentials,
Shopify product IDs, API/transform contracts, DB connection ownership, URL
ownership, auth/session pruning, build coupling, and noisy logs; new findings
F-036 through F-050 capture distinct follow-up work. No runtime implementation
was performed.

2026-05-14: Reconciled completed audits A-008, A-016, and A-019 into this
register, production risks, workstream backlogs, and ready task briefs T-009,
T-010, and T-011. Existing findings were updated where these audits added
evidence for Shopify credential handling, Cloudinary signing policy, missing
tests, and unused dependencies; new findings F-051 through F-066 capture
security logging, CORS/CSP, input validation, accessibility, and dependency
supply-chain work. No runtime implementation was performed by this
reconciliation.

2026-05-14: T-012, T-013, T-014, T-015, and T-016 updated this register and the
risk/workstream trackers. F-056, F-058, and F-061 are resolved; F-062 is
partially mitigated by the sign-in accessibility slice; F-063 is partially
mitigated because T-016 removed the bcrypt advisory path while T-015 found no
accepted stable target that clears both residual Next/PostCSS advisories; F-065
is partially mitigated because the bcrypt tar advisory path is gone while
install-script policy remains open.

2026-05-14: Prepared ready task briefs T-017, T-018, and T-019 for the next
implementation batch. F-059 is routed to T-017, F-021 is routed to T-018, and
F-032 was resolved by T-019.

2026-05-14: T-017 resolved F-059 by hardening subscription server-action
validation, normalization, DB ownership, public-safe failures, and focused
action tests.

2026-05-14: T-018 partially mitigated F-021 by extracting the public artwork
list read into `getArtworkList`, sharing it between `ArtworkListLoader` and
`GET /api/v2/public/artwork`, and adding service/API/loader tests that do not
require a live same-app HTTP server.

2026-05-14: Prepared ready task briefs T-020, T-021, and T-022 for the next
implementation batch. F-057 is routed to T-020, F-060 and the next F-021 slice
are routed to T-021, and F-034/F-065 package cleanup is routed to T-022.

2026-05-14: T-020 partially mitigated F-057 by hardening admin collection
create/update validation, allowlisted persistence, ObjectId checks, real
validation statuses, and focused route tests. Remaining F-057 work covers
article, artwork, and blog admin write routes.

2026-05-14: T-021 partially mitigated F-021, F-049, and F-060 by extracting
public search into `getPublicSearchResults`, sharing it between `/search` and
`GET /api/v2/public/search`, adding bounded route/page query parsing, honoring
`type`, escaping regex input, and covering the service/API/page path with
focused tests. Artwork browse and shop browse query bounds remain open.

2026-05-14: T-022 resolved F-034 by removing confirmed-unused direct package
candidates and refreshing the lockfile. T-022 also partially mitigated F-065 by
removing the unused `next-test-api-route-handler -> core-js` install-script
path; native `bcrypt` install/build policy remains open.

2026-05-14: The Vercel bcrypt native trace incident added new evidence for
F-025 and F-065. The immediate fix traces bcrypt prebuilds into serverless
functions; T-023 was prepared to remove bcrypt from the normal public-page
import path by decoupling root-layout session reads from credentials password
verification imports.

2026-05-14: T-023 partially mitigated F-025 and F-065 by lazy-loading the
credentials authorize implementation inside the NextAuth credentials provider.
Focused tests now prove `authOptions` import and root-layout public-shell render
do not load the bcrypt helper or native package, while credentials authorize
still reaches the existing password verification path when it runs. Broader
root-layout DB/session ownership and native bcrypt deployment policy remain
open.

2026-05-14: T-024 captured partial Vercel smoke evidence: the public production
alias returned `HTTP/2 200` for `GET /`, and an intentionally invalid
credentials callback returned `401 CredentialsSignin` instead of `500`. The
incident remains open because the observed `origin/main` SHA did not yet include
the local T-023 auth import-boundary change, Vercel logs were unavailable, and no
known smoke credentials account was documented.

2026-05-14: T-024 was completed after `origin/main` advanced to
`820d45f1e155ddc700879f6afef803bea57cbf02`, matching local `HEAD` with the
T-023 dynamic credentials import. The owner reported the Vercel deployment no
longer crashes, and `curl -I https://laoutaris-nextjs.vercel.app/` returned
`HTTP/2 200` for `/`. The bcrypt incident is closed; T-025 tracks the remaining
repeatable smoke checklist, Vercel log access, secret-channel credentials smoke,
and rollback evidence gap from F-048.

2026-05-14: T-025 partially mitigated F-048 by expanding the deployment runbook
with repeatable Vercel smoke evidence fields, route/status expectations,
secret-channel credentials smoke handling, targeted log requirements, rollback
triggers, and a dependency-free `npm run smoke:public` helper for
unauthenticated route checks. Runtime and Vercel project-setting pins remain
open under F-064/R-028.

2026-05-14: T-026 partially mitigated F-036 by adding shared route-local
`requireApiUser()`/`requireApiAdmin()` guards, preserving persisted admin-role
verification, migrating admin collection create/update and user profile
auth-status behavior, and covering the slice with focused guard and route tests.
The broader protected API and middleware auth-status cleanup remains open.

2026-05-14: T-027 partially mitigated F-036 and F-024 by applying
`requireApiUser()` to user navigation, favourite, and watchlist read routes
before DB/model work; adding explicit `dbConnect()` ownership to watchlist
list/detail reads; and covering the slice with focused saved-route guard tests.
Unsupported favourite/watchlist methods, middleware API redirects, broader
protected route migration, and account server-action DB ownership remain open.

2026-05-14: Prepared T-028 for F-027/F-024 follow-up. It scopes favourite and
watchlist server actions to explicit `dbConnect()` ownership, route
revalidation after successful saved-item toggles, defensive invalid `artworkId`
handling, and focused action tests. Unsupported favourite/watchlist API methods
remain separate under F-037.

2026-05-14: T-028 resolved F-027 and further mitigated F-024 by adding
favourite/watchlist server-action `dbConnect()` ownership before model
reads/writes, defensive invalid `artworkId` short-circuiting, route
revalidation after successful saved-item toggles, and focused action tests.
Unsupported favourite/watchlist API method parity remains separate under F-037.

2026-05-14: Completed T-029 for F-037. It added a static route/fetcher parity
inventory test with a self-checking allowlist for the seven known unsupported
favourite/watchlist, profile, and admin read fetcher methods, without changing
runtime route or fetcher behavior.

2026-05-15: T-030 implemented the active admin user/comment detail read routes
and removed `admin.read.user` and `admin.read.comment` from the T-029
route/fetcher parity allowlist. Favourite/watchlist method parity and profile
update remain separate F-037 follow-ups.

2026-05-15: Prepared T-031 and T-032 to remove the remaining unused
favourite/watchlist write fetchers and profile update fetcher from F-037 instead
of adding unused write routes. T-031 should be commissioned first; T-032 should
follow after T-031 is reconciled.

2026-05-15: T-031 removed the unused favourite/watchlist write fetchers and the
four corresponding route/fetcher parity inventory and known-gap allowlist
entries. The remaining F-037 allowlist entry is `user.profile.update`, owned by
T-032.

2026-05-15: T-032 resolved F-037 by removing the unused profile update fetcher,
removing `user.profile.update` from the route/fetcher parity inventory, and
leaving `KNOWN_ROUTE_FETCHER_GAP_IDS` empty with focused test, lint, build, and
reference-check verification.

2026-05-15: Prepared ready task briefs T-033, T-034, and T-035. T-033 is the
next protected API guard/status cleanup for user comment delete. T-034 is the
next F-057 admin write validation slice for article create/update. T-035 is the
next F-060 query-bounds slice for public artwork browse.

2026-05-15: T-033 partially mitigated F-036 and F-015 by migrating user comment
delete to `requireApiUser()` before DB/transaction work, validating the comment
ID before DB work, returning real `400`/`401`/`403`/`404`/`500` statuses with
`error` bodies, and returning the typed delete fetcher envelope. Broader
protected API and middleware auth-status cleanup remains open.

2026-05-15: T-034 further mitigated F-057 by hardening admin article
create/update validation with strict route schemas, parsed allowlisted
persistence, ObjectId validation for article/artwork IDs, session-owned create
author, route-local `dbConnect()` before article model writes, structured
validation responses, public-safe persistence failures, and focused route tests.
Remaining F-057 work covers artwork and blog admin write routes.

2026-05-15: T-035 further mitigated F-060 by adding a route-safe public artwork
browse query parser for filter mode, sort option, optional hex color, repeated
artwork filters, and bounded pagination before session lookup or artwork list
service calls. Focused route/service tests, lint, and build passed. Shop browse
query bounds remained the next F-060 slice until T-036.

2026-05-15: Prepared T-036 as the remaining F-060 shop browse query-bounds
slice. It scopes validation for repeated shop filters, product-type booleans,
and optional `sortBy` before MongoDB or Shopify work, while leaving checkout,
server-side sorting/pagination, Shopify product ID migration, and admin product
linking separate.

2026-05-15: T-036 resolved F-060 by adding route-safe public shop listing query
parsing for repeated artwork-derived filters, product-type boolean strings, and
optional `sortBy` before `dbConnect()`, MongoDB query construction, or Shopify
product fan-out. Focused route tests, lint, and build passed.

2026-05-15: Prepared T-037 and T-038 as the remaining F-057 admin write
validation queue. T-037 owns artwork create/update validation first because
artwork is the core archive entity and future Shopify links attach there; T-038
owns blog create/update validation after T-037 is reconciled.

2026-05-15: T-037 further mitigated F-057 by hardening admin artwork
create/update validation with strict route schemas, canonical artwork taxonomy
constants, parsed allowlisted persistence, update ID validation before body
reads, optional replacement-image updates, session-owned create author,
structured validation responses, public-safe persistence failures, and focused
route tests. Remaining F-057 work covers blog admin write routes in T-038.

2026-05-15: T-038 resolved F-057 by hardening admin blog create/update
validation with strict route schemas, parsed allowlisted persistence, update ID
validation before body reads, request validation before existing-blog lookup,
session-owned create author, title-based slug updates and conflict responses,
structured validation responses, public-safe persistence failures, and focused
route tests.

2026-05-15: Prepared T-039 and T-040 as the next F-036 protected admin API
guard migration queue. T-039 owns remaining admin read routes still using
`isAdmin()`; T-040 owns admin delete routes and destructive ID validation after
T-039 is reconciled.

2026-05-15: T-039 partially mitigated F-036 by migrating admin
article/artwork/blog/collection/comment/user read routes to `requireApiAdmin()`
with real JSON `401`/`403` guard responses, explicit target-read DB ownership,
structured JSON `400` invalid-ID responses before detail target reads, and
focused route tests. Admin delete route guard migration remains queued in T-040.

2026-05-15: T-040 further mitigated F-036 by migrating admin
article/artwork/blog/collection/comment/user delete routes to
`requireApiAdmin()`, adding ObjectId validation before destructive target work
and transaction session startup, adding route-local `dbConnect()` ownership, and
covering guard, invalid-ID, cascade, transaction-abort, and public-safe failure
paths with focused route tests. Middleware API redirect behavior and broader
protected API cleanup remain separate.

2026-05-15: Prepared T-041 as the next F-036 middleware slice. It scopes
protected API JSON `401` behavior, preserves frontend redirects and admin API
`403`, removes always-on middleware debug logs, and requires focused middleware
and route utility tests before lint/build.

2026-05-15: T-041 further mitigated F-036, F-020, and F-053 by returning
shared JSON `401` middleware responses for unauthenticated protected API
requests, preserving frontend redirects and admin API/frontend denial behavior,
removing direct middleware debug logs, and covering middleware/route utility
behavior with focused tests before lint/build. Remaining protected API
migrations, response-helper standardization, and broader production logging
policy stay separate.

2026-05-15: Prepared T-042 as the next F-036 route-local protected API slice.
It scopes user comment GET/POST/PATCH migration to `requireApiUser()`, real GET
failure statuses, and focused user comment route tests while leaving public
optional-session routes and shared response-helper standardization separate.

2026-05-15: T-042 further mitigated F-036 and F-015 by moving user comment
GET/POST/PATCH handlers to `requireApiUser()` before body, DB, model, or
transaction work, preserving comment validation/DTO behavior, and changing user
comment GET missing-user/internal failures to real `404`/`500` statuses.

2026-05-15: Prepared T-043 to close the protected user/admin guard migration
track with a static inventory test. It should prove protected route files use
`requireApiUser()`/`requireApiAdmin()` and do not reintroduce direct
`getServerSession()`, `getUserIdFromSession()`, or `isAdmin()` route-boundary
checks.

2026-05-15: T-043 added the protected API guard inventory test. Protected
`/api/v2/user` and `/api/v2/admin` route files are now statically checked for
shared guard imports/calls, banned direct session/admin helper checks, and
guard ordering before body, DB, model, or transaction work in exported HTTP
handlers. Existing protected routes passed without runtime behavior changes.
Remaining F-036 work is shared response-helper cleanup and broader
logging/error-response policy.

2026-05-15: Prepared T-044 as the first shared response-helper cleanup slice
for F-015, F-036, and F-053. It is scoped to a small `src/lib/api` response
helper plus protected user profile/navigation/favourite/watchlist read routes,
with real `404`/`500` statuses and public-safe error envelopes. Comments,
admin/public/Shopify routes, field contracts, and global logging policy remain
separate.

2026-05-15: T-044 partially mitigated F-015, F-036, and F-053 by adding
`src/lib/api/apiResponse.ts`, delegating `apiAuthError()` without changing its
envelope, and migrating protected user profile/navigation/favourite/watchlist
read routes to shared success/error helpers with real `404`/`500` statuses and
public-safe internal-failure bodies. User comments, admin/public/Shopify route
migrations, field contracts, and global logging policy remain separate.

2026-05-15: Prepared T-045 as the next shared response-helper cleanup slice for
F-015, F-036, and F-053. It is scoped to public artwork/article/blog detail
routes, real missing-resource/internal-failure statuses, public-safe `500`
response bodies, and focused public route tests. Public list/search/navigation,
admin routes, field contracts, and global logging policy remain separate.

2026-05-15: T-045 partially mitigated F-015, F-036, and F-053 by migrating
public artwork/article/blog detail routes and populated blog-comment detail
routes to shared success/error helpers, replacing body-only `statusCode`
failures with real `404`/`500` statuses, adding public-safe internal-failure
bodies, and removing touched public blog detail debug logs. Public
list/search/navigation, admin routes, field contracts, and global logging policy
remain separate.

2026-05-15: Prepared T-046 as the next shared response-helper cleanup slice for
F-015, F-024, F-036, and F-053. It is scoped to public collection routes,
route-local DB ownership, real missing-resource/internal-failure statuses, and
focused public collection route tests. Public navigation, admin routes, field
contracts, and global logging policy remain separate.

2026-05-15: T-046 partially mitigated F-015, F-024, F-036, and F-053 by
migrating public collection list/detail/artwork routes to shared
success/error helpers, adding route-local `dbConnect()` ownership before model
reads, replacing body-only `statusCode` failures with real `404`/`500`
responses, adding public-safe internal-failure bodies, and removing touched
collection request debug logging. Public navigation, admin routes, field
contracts, and global logging policy remain separate.

2026-05-15: Prepared T-047 as the next shared response-helper cleanup slice for
F-015, F-024, F-036, and F-053. It is scoped to public navigation
article/collection routes, route-local DB ownership, real
missing-resource/internal-failure statuses, touched debug-log removal, and
focused public navigation route tests. Admin routes, field contracts, Shopify
product ID/admin-linking, and global logging policy remain separate.

2026-05-15: T-047 partially mitigated F-015, F-024, F-036, and F-053 by
migrating public article/collection navigation routes to shared success/error
helpers, adding route-local `dbConnect()` ownership before model reads where it
was missing, replacing body-only `statusCode` failures with real `404`/`500`
responses, adding public-safe internal-failure bodies, and removing touched
navigation request/found/no-results debug logging. Admin routes, field
contracts, Shopify product ID/admin-linking, and global logging policy remain
separate.

2026-05-15: Prepared T-048 as the next shared response-helper cleanup slice for
F-015, F-036, and F-053. It is scoped to admin article, artwork, blog,
collection, comment, and user read list/detail routes, shared helper usage,
stable real statuses, public-safe internal-failure bodies, and focused admin
read route tests while preserving `requireApiAdmin()` guard behavior,
invalid-ID `400` contracts, success DTOs, metadata, and DB/auth ordering. Admin
write/delete routes, field contracts, Shopify product ID/admin-linking, and
global logging policy remain separate.

2026-05-15: T-048 partially mitigated F-015, F-036, and F-053 by migrating
admin article/artwork/blog/collection/comment/user read list/detail routes to
shared success/list/error response helpers, preserving `requireApiAdmin()`,
invalid-ID `400` responses, transformed DTOs, list metadata, empty-list and
missing-resource `404`s, DB-before-model ordering, and public-safe internal
`500` bodies. Admin create/update/delete response-helper work, field contracts,
Shopify product ID/admin-linking, and global logging policy remain separate.

2026-05-15: Prepared T-049 as the next shared response-helper cleanup slice for
F-015, F-036, and F-053. It is scoped to admin article, artwork, blog,
collection, comment, and user delete routes, shared helper usage, stable real
statuses, public-safe internal-failure bodies, touched debug-log removal, and
focused admin delete route tests while preserving `requireApiAdmin()` guard
behavior, invalid-ID `400` contracts, success messages, `data: null`, conflict
handling, cascade behavior, transactions, and DB/auth ordering. Admin
create/update routes, field contracts, Shopify product ID/admin-linking, and
global logging policy remain separate.

2026-05-15: T-049 partially mitigated F-015, F-036, and F-053 by migrating
admin article/artwork/blog/collection/comment/user delete routes to shared
success/error response helpers, preserving `requireApiAdmin()`, invalid-ID
`400` responses, route-specific success messages, `data: null`,
missing-resource `404`s, artwork conflict `409`, cascade behavior, transaction
abort/commit/end behavior, DB-before-model ordering, and public-safe internal
`500` bodies. Touched direct delete-handler debug logs were removed. Admin
create/update response-helper work, field contracts, Shopify product
ID/admin-linking, and global logging policy remain separate.

2026-05-15: T-050 partially mitigated F-015, F-036, and F-053 by migrating
admin article/artwork/blog/collection create/update routes to shared
success/error response helpers, preserving `requireApiAdmin()` guard behavior,
structured validation `400` bodies, create `201` statuses, update success DTOs,
missing-resource `404`s, blog slug conflict `409`, allowlisted persistence,
DB/auth ordering, and public-safe internal `500` bodies. Field contracts,
Shopify product ID/admin-linking, and global logging policy remain separate.

2026-05-15: T-051 resolved F-040 with focused public transform contract tests
and fixes for blog `readTime`, collection `firstArtworkId`, public user
`isOwner`, and comment ownership-state propagation through populated
blog/comment paths. Broader F-039 field matrix work, F-041 artwork image
sanitization, Shopify product ID/admin-linking, and global logging policy remain
separate.

2026-05-15: T-052 was prepared to address the focused F-041 public artwork
image contract drift for `image.public_id` sanitization, explicit
color-proximity `similarityScore` behavior, and Cloudinary color schema
validation. Broader Cloudinary upload policy, Shopify product ID/admin-linking,
global logging policy, and the F-039 field matrix remain separate.

Unresolved owner/orchestrator decisions remain:

- First-release checkout scope and product listing source of truth.
- Admin Shopify product-linking workflow.
- Whether the mostly unused i18n pipeline is in production-launch scope.
- Whether the credential-like Shopify value in source comments was real and
  needs rotation.
- Whether admin action-segment API paths are canonical or should be migrated.
- Whether now-unused `JWT_SECRET`, `AUTH_SECRET`, and
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are active, deprecated, or mistakes.
- Whether to wait for a stable Next release that bundles `postcss@8.5.10+`,
  accept a partial stable `next@16.2.6` migration with residual PostCSS risk, or
  accept canary framework risk to clear the current isolated audit.

## Owner Rule

The orchestrator is the default reviewer for `Unassigned` findings until a
specific reviewer is recorded. The risk tracker uses the same default owner
rule for `Unassigned` risks.

## ID Rules

- Use `F-NNN`.
- Keep one finding per row.
- Link the source audit result.
- Link a destination before setting status to `Converted`.
- Keep detailed evidence in the audit result when it is too long for this table.
