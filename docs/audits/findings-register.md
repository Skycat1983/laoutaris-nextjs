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
| F-009 | A-001 | High | Partially mitigated | Checkout/cart handoff remains undefined after fake cart removal. | A-001 found the product detail button had no handler, cart mutation, checkout URL, or variant selection. T-008 removed the fake cart affordance. T-208 added a real Shopify-hosted purchase handoff for available products with a valid `onlineStoreUrl`, while preserving enquiry fallback and keeping app-owned cart/checkout ownership, variant selection, line-item construction, payment, shipping, refund, and fulfilment behavior separate. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-208](../tasks/T-208-implement-shopify-hosted-purchase-handoff.md) | T-208 completed 2026-05-22 |
| F-010 | A-001, A-003 | High | Resolved | Admin Shopify product-linking workflow and validation are missing. | T-082 added strict admin artwork create/update route validation for optional `shopifyProducts` writes: numeric product IDs, known types, and no within-artwork duplicate product IDs. T-097 added the visible admin create/update form workflow for adding, editing, removing, and clearing canonical Shopify product links with shared form-schema validation and focused tests. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-082](../tasks/T-082-harden-admin-shopify-product-link-validation.md), [T-097](../tasks/T-097-add-admin-shopify-product-link-workflow.md) | T-097 completed 2026-05-17 |
| F-011 | A-001, A-007, A-008 | High | Partially mitigated | Shopify credential handling violates the env-only documentation expectation. | T-009 removed the concrete Storefront-token-shaped comment from `src/lib/config/shopifyConfig.ts` and added a focused source-comment regression check. Owner verification of whether the removed value was real, and rotation if needed, remains open. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-009](../tasks/T-009-remove-credential-logging-and-source-secret.md) | T-009 2026-05-14 |
| F-012 | A-001, A-002, A-003 | Medium | Resolved | Shopify product ID shape is documented as numeric but not fully validated or migrated. | T-004 validated the public single-product path ID. T-057 centralized public-read numeric product ID normalization/GID construction, kept invalid path IDs at `400` before Shopify calls, and made the listing route skip malformed stored IDs before Shopify fan-out. T-058 added a read-only MongoDB audit command for existing artwork `shopifyProducts` links. T-059 completed the live read-only audit against the owner-approved `laoutarisDB` target with 0 invalid IDs, 0 unknown types, 0 within-artwork duplicates, and 1 review-only cross-artwork book duplicate group. T-082 recorded that shared book links are allowed when legitimate, and admin artwork create/update now reject malformed IDs, unknown/missing types, and within-artwork duplicate product IDs before persistence. No product-ID cleanup or migration is indicated. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-057](../tasks/T-057-normalize-shopify-product-ids.md), [T-058](../tasks/T-058-audit-shopify-product-link-data.md), [T-059](../tasks/T-059-run-shopify-product-link-audit.md), [T-082](../tasks/T-082-harden-admin-shopify-product-link-validation.md) | T-082 completed 2026-05-17 |
| F-013 | A-001, A-013, A-017 | Medium | Partially mitigated | Shop filters, pagination, and sorting expose UI behavior that is not backed by canonical API data. | T-060 removed unsupported colour/dimension filters, removed hard-coded placeholder pagination, removed stale client-only colour/dimension filter state, and added focused component coverage for absent unsupported controls plus preserved backed controls. T-061 replaced title-keyword default type sorting with explicit Shopify `productType` metadata sorting and focused gallery coverage. A-017 confirmed that product sorting is still client-only and not deep-linkable even though the public shop query schema accepts `sortBy`; future real pagination and any server-side/deep-linkable sorting contracts remain open. | [A-017 result](results/A-017-search-navigation-discovery.md), [Shopify workstream](../workstreams/shopify-commerce.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-060](../tasks/T-060-remove-unsupported-shop-controls.md), [T-061](../tasks/T-061-use-explicit-shop-product-type-sorting.md) | T-061 2026-05-16; A-017 reconciled 2026-05-19 |
| F-014 | A-001 | Medium | Partially mitigated | Shopify product transformation drops fields needed for product detail and checkout hardening. | T-061 carries Shopify `productType` and `tags` through `SimpleProduct` for list, handle, and ID reads with focused transform coverage. T-062 adds a stable `variants` array that preserves queried variant IDs, titles, availability, price money, compare-at price money, and optional variant image URL/alt text. T-063 preserves queried `descriptionHtml` for list, handle, and ID reads. Checkout/cart ownership, line-item construction, rich HTML rendering policy, and UI variant selection remain intentionally out of scope. | [Shopify workstream](../workstreams/shopify-commerce.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-061](../tasks/T-061-use-explicit-shop-product-type-sorting.md), [T-062](../tasks/T-062-preserve-shopify-variant-metadata.md), [T-063](../tasks/T-063-preserve-shopify-description-html.md) | T-063 2026-05-16 |
| F-015 | A-001, A-002, A-003, A-013 | High | Partially mitigated | API response and transform contracts are uneven across public, user, admin, and shop routes. | A-001 found inconsistent shop listing versus single-product envelopes; A-013 found raw errors, missing statuses, and raw Mongoose documents; A-002 and A-003 expanded this to public, user, admin, shop, profile, comment, enquiry, and admin write routes. T-044 introduced shared API response helpers and applied them to protected user profile/navigation/favourite/watchlist read routes while preserving existing success contracts. T-045 applied the helpers to public artwork/article/blog detail routes while preserving transformed DTO success envelopes. T-046 applied the helpers to public collection list/detail/artwork routes while preserving current success contracts. T-047 applied the helpers to public article/collection navigation routes while preserving current navigation success contracts. T-048 applied the helpers to admin article/artwork/blog/collection/comment/user read list/detail routes while preserving admin success DTOs and metadata. T-049 applied the helpers to admin article/artwork/blog/collection/comment/user delete routes while preserving delete success messages, `data: null`, conflict handling, cascade behavior, and transaction ordering. T-050 applied the helpers to admin article/artwork/blog/collection create/update routes while preserving validation bodies, success DTOs, create statuses, not-found/conflict handling, and allowlisted persistence. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-016 | A-002, A-003, A-004, A-006, A-007, A-015, A-016 | High | Converted | Production-critical APIs, auth/admin flows, Shopify paths, deployment smoke checks, SSR behavior, and input persistence boundaries lack reliable tests. | A-006 found no API/auth/admin/Shopify coverage; A-015 found no route handler, server loader, Shopify cache, or page-render tests; A-002, A-003, A-004, and A-007 added route contract, transform, auth/session, and deployment smoke coverage gaps; A-016 found no focused tests for enquiry, subscription, comments, admin write validation, or search query parsing. | [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-017 | A-006 | Medium | Converted | The only integration test mostly verifies mocks rather than production Home behavior. | A-006 found `Home.test.tsx` mocks the component under test and its child modules. | [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-018 | A-006 | Medium | Converted | Coverage is not a documented or enforced gate. | A-006 found no coverage script, no coverage thresholds, and a probe showing 1.78% statement coverage across `src`. | [testing workstream](../workstreams/testing-and-quality.md), [testing runbook](../runbooks/testing.md) | Reconciled 2026-05-14 |
| F-019 | A-006, A-007 | High | Converted | Build verification is coupled to external Google Fonts and live MongoDB/environment access. | A-006 found sandbox build failure on Google Fonts and successful network build that still performed production MongoDB connection and route/data fetch work; A-007 found a sandbox build failed on MongoDB DNS/egress and the external-access build passed while still using live MongoDB. | [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing runbook](../runbooks/testing.md) | Reconciled 2026-05-14 |
| F-020 | A-001, A-002, A-006, A-007, A-013, A-015 | Low | Partially mitigated | Debug logs, expected error output, and debug-only delays make tests, builds, SSR, API, upload, and commerce paths noisy. | Completed audits found console output in tests/builds, fetcher stack logs, DB logs, route logs, product logs, upload widget logs, root layout logs, and an `ArtworkLoader` delay. T-041 removed the always-on middleware path/token/role debug logs. T-067 removed the admin Cloudinary upload widget debug logs, availability polling, and DOM/iframe inspection with source/component regression coverage. T-068 removed direct public shop products route, gallery, and loader `console.log` debug output, replaced the loader's console-directed public error hint, and added focused source/API/component/loader regression coverage. T-069 removed the shared fetcher request/URL/response `console.log` debug output plus server public/user/admin API URL-helper logs and stale commented URL debug blocks, with focused source hygiene and fetcher behavior coverage. T-076 removed the public blog list route's touched MongoDB query `console.log` while leaving global logging policy separate. T-077 removed the touched `ArtworkLoader` debug delay and result log. T-079 removed the public article list route's touched direct `console.log` debug output and stack log. T-088 removed direct MongoDB helper and auth adapter debug logs plus stale MongoDB connection/OAuth callback examples, with focused source hygiene and DB helper behavior coverage. T-089 removed root-layout branch verification, navigation-link, article, title, and account-comments render `console.log()` output, with focused render source-hygiene coverage. T-090 removed remaining scoped user-facing public/account client/page `console.log()` output from `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`, `EnquiryForm`, `SubscribeSectionLoader`, the account favourite artwork page, and `CollectionViewPagination`, with focused source-hygiene coverage. T-091 removed direct admin dashboard create/update form and artwork-filter `console.log()` output from the scoped admin dashboard files, with focused source-hygiene coverage. T-092 removed success-path admin read-list copy, `ArtworkFeedCard`, shared `copy_id()`, and `ReadArtworkList` render `console.log()` output, with helper and source-hygiene coverage. T-093 removed direct shared UI/public artwork fetcher `console.log()` output from `Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`, and the public artwork fetcher, with source-hygiene and artwork fetcher URL-construction coverage. T-094 removed the remaining active direct `getUserFromSession` development test-header `console.log()` output, with focused session helper behavior and source-hygiene coverage. T-095 removed stale commented-out `console.log()` snippets from auth callbacks, credentials auth, the session provider, collection section, main navigation, and admin content layout, with full-source source-hygiene coverage proving `src` has no direct or commented `console.log()` calls. Other build, commerce, SSR, route-level API, and expected error-path noise remains. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md), [T-067](../tasks/T-067-remove-cloudinary-upload-debug-logs.md), [T-068](../tasks/T-068-remove-public-shop-debug-logs.md), [T-069](../tasks/T-069-remove-shared-fetcher-debug-logs.md), [T-076](../tasks/T-076-migrate-blog-list-section-loaders-service.md), [T-077](../tasks/T-077-migrate-artwork-detail-loader-service.md), [T-079](../tasks/T-079-migrate-biography-section-loader-service.md), [T-088](../tasks/T-088-remove-mongodb-db-helper-debug-logs.md), [T-089](../tasks/T-089-remove-public-render-debug-logs.md), [T-090](../tasks/T-090-remove-user-facing-client-debug-logs.md), [T-091](../tasks/T-091-remove-admin-dashboard-form-debug-logs.md), [T-092](../tasks/T-092-remove-admin-read-copy-debug-logs.md), [T-093](../tasks/T-093-remove-shared-ui-public-fetcher-debug-logs.md), [T-094](../tasks/T-094-remove-session-test-header-debug-logs.md), [T-095](../tasks/T-095-remove-commented-debug-log-leftovers.md) | T-095 2026-05-17 |
| F-021 | A-013, A-015 | High | Partially mitigated | Server-side data access has competing ownership models and relies on same-app HTTP self-fetching. | T-007, T-018, T-021, T-070, T-071, T-072, T-073, T-074, T-075, T-076, T-077, T-078, T-079, T-080, T-081, T-083, T-084, and T-085 proved the ADR 0004 service pattern for artwork-by-ID, `/artwork` list, `/search`, collection navigation, article navigation, collection redirect pages, populated article detail data, blog detail data, blog list data, `ArtworkLoader` detail data, collection artwork list/detail data, biography article list data, collection section list data, account navigation data, account saved-artwork data, account profile/comment data, and public shop product listing data. `BiographySubnavLoader`, `BiographySectionLoader`, `CollectionSectionLoader`, `MainNavLoader`, `AccountSubnavLoader`, `FavouritesPaginationLoader`, `WatchlistPaginationLoader`, `FavouritedArtworkLoader`, `WatchlistedArtworkLoader`, `UserSettingsLoader`, `UserCommentsLoader`, `ShopProductsLoader`, the biography default redirect page, `ArticleLoader` previous/next navigation and article detail data, `BlogDetailLoader`, `BlogListLoader`, `BlogSectionLoader`, `ArtworkLoader`, `CollectionArtworkLoader`, `CollectionArtworksPaginationLoader`, `/collections`, `/collections/[slug]`, the collection navigation item route, the public collection list route, the public shop products route, the user navigation route, the user favourite/watchlist read routes, the user profile/comment read routes, and the collection artwork routes now use shared server-only services instead of same-app HTTP for those paths. T-087 deleted the retired server-side same-app API wrapper layer after those callers were migrated. Broader root-layout DB/session ownership, cache policy, and any future action/service ownership cleanup remain separate. | [ADR 0004](../decisions/0004-server-data-access-ownership.md), [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [rendering architecture](../architecture/rendering-and-data-fetching.md), [T-018](../tasks/T-018-artwork-list-server-data-proof.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-070](../tasks/T-070-migrate-collections-subnav-loader-service.md), [T-071](../tasks/T-071-migrate-article-navigation-loaders-service.md), [T-072](../tasks/T-072-migrate-article-navigation-page-consumers.md), [T-073](../tasks/T-073-migrate-collection-redirect-pages-service.md), [T-074](../tasks/T-074-migrate-article-detail-loader-service.md), [T-075](../tasks/T-075-migrate-blog-detail-loader-service.md), [T-076](../tasks/T-076-migrate-blog-list-section-loaders-service.md), [T-077](../tasks/T-077-migrate-artwork-detail-loader-service.md), [T-078](../tasks/T-078-migrate-collection-artwork-loaders-service.md), [T-079](../tasks/T-079-migrate-biography-section-loader-service.md), [T-080](../tasks/T-080-migrate-collection-section-loader-service.md), [T-081](../tasks/T-081-migrate-account-subnav-loader-service.md), [T-083](../tasks/T-083-migrate-account-saved-artwork-loaders-service.md), [T-084](../tasks/T-084-migrate-account-profile-comments-loaders-service.md), [T-085](../tasks/T-085-migrate-shop-products-loader-service.md), [T-087](../tasks/T-087-retire-server-api-self-fetch-wrappers.md) | T-087 completed 2026-05-17 |
| F-022 | A-013, A-015 | High | Resolved | Client/server import boundaries are leaky and can pull server/model modules into client components. | Resolved by T-137: the static guard discovers `"use client"` entries, walks runtime local imports and re-exports, stops at explicit `"use server"` action boundaries, and fails when the client runtime graph reaches server-only imports, DB/model/data-service files, server session/auth helpers, data type modules through value imports, or known mixed barrels. The current inventory has no allowlist entries. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [T-137](../tasks/T-137-add-client-server-import-boundary-guard.md) | T-137 completed 2026-05-19 |
| F-023 | A-013, A-018 | Medium | Converted | Domain taxonomy and filter state are duplicated across constants, schemas, public filters, admin forms, and shop filters. | A-013 found repeated artwork option literals and separate shop sentinel values. A-018 added current evidence that public shop filters omit canonical artwork taxonomy values such as `paint`, `pastel`, and `2020s`, while admin artwork forms and read filters still repeat option arrays manually instead of deriving value+label options from canonical constants. | [A-018 result](results/A-018-translations-content-taxonomy.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [Shopify workstream](../workstreams/shopify-commerce.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md) | Reconciled 2026-05-14; A-018 reconciled 2026-05-19 |
| F-024 | A-002, A-013, A-015 | High | Partially mitigated | Several MongoDB-backed API routes used by SSR omit route-local `dbConnect()` setup. | T-018, T-021, T-027, and T-028 added explicit DB ownership to the public artwork list, public search, user saved read-route, and favourite/watchlist account action slices. T-046 added explicit route-local `dbConnect()` ownership before model reads in public collection list/detail/artwork routes. T-047 added explicit route-local `dbConnect()` ownership before model reads in public collection navigation detail and collection artworks navigation routes while preserving existing ownership in the list routes. A-002's broader inventory still includes remaining public/admin routes without explicit connection ownership. | [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-018](../tasks/T-018-artwork-list-server-data-proof.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-027](../tasks/T-027-user-saved-routes-shared-guard.md), [T-028](../tasks/T-028-saved-item-actions-db-revalidation.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md) | T-047 2026-05-15 |
| F-025 | A-015 | High | Partially mitigated | Root layout DB/session work forces global dynamic rendering and blocks route-specific cache policy. | A-015 found `RootLayout` calls `dbConnect()` and `getServerSession()` on every root render. The 2026-05-14 Vercel bcrypt incident added evidence that root-layout `authOptions` imports also pulled credentials password verification and native bcrypt into public page bundles. T-023 lazy-loads the credentials authorize implementation so public auth/session imports no longer eagerly load bcrypt; broader root DB/session ownership remains open. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [ADR 0004](../decisions/0004-server-data-access-ownership.md), [T-023](../tasks/T-023-root-layout-auth-bcrypt-decoupling.md), [bcrypt incident](../tasks/incident-2026-05-14-vercel-bcrypt-native-trace.md) | T-023 2026-05-14 |
| F-026 | A-015 | Medium | Partially mitigated | Cache and revalidation policy is inconsistent across MongoDB, Shopify, public, user, and admin reads. | T-110 codified the public route rendering/cache matrix and made route-local dynamic public pages explicit without adding ISR or generated params. T-115 cleaned up the Shopify Storefront fetch option conflict surfaced by T-113/T-114 build verification: production fetches now send only `next.revalidate: 3600`, development fetches send only `cache: "no-store"`, and build no longer warns on `/sitemap.xml`. Account/admin cache policy, build-time DB/Shopify availability, and broad static/ISR migration remain separate. | [rendering architecture](../architecture/rendering-and-data-fetching.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-110](../tasks/T-110-codify-public-route-cache-policy.md), [T-115](../tasks/T-115-clean-up-shopify-fetch-cache-policy.md) | T-115 completed 2026-05-18 |
| F-027 | A-015 | Medium | Resolved | Account favourite/watchlist server actions lack explicit DB connection setup and route revalidation. | Resolved by T-028 on 2026-05-14: favourite/watchlist actions now reject missing or non-string `artworkId` values before DB/model work, call `dbConnect()` before Mongoose reads/writes on valid authenticated requests, revalidate affected account/artwork routes only after successful toggles, and have focused action tests. | [auth workstream](../workstreams/auth-admin-and-permissions.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-028](../tasks/T-028-saved-item-actions-db-revalidation.md) | T-028 2026-05-14 |
| F-028 | A-015 | Medium | Converted | Loader error, empty, and not-found behavior is inconsistent across route types. | A-015 found route-critical loaders throwing, swallowing errors to `null`, or returning no explicit state, with only a root error boundary. | [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-029 | A-013 | Medium | Converted | Admin feature isolation is good, but entity operations are repeated across tabs, read lists, feeds, and clients. | A-013 compared repeated admin operation tab and feed/read-list patterns across entity types. | [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-030 | A-007, A-013 | Medium | Partially mitigated | Route URL ownership is split across helpers and hard-coded paths. | T-087 deleted the retired server-side same-app API wrappers that owned the remaining `VERCEL_ENV`/`VERCEL_URL`/localhost server self-fetch URL construction. T-086 removed hard-coded same-app origins from `LogoutForm`, `MobileNavDrawer`, and the `/project` redirect by using relative app paths. T-085 removed the shop listing loader's `NEXT_PUBLIC_BASE_URL`/localhost dependency. Remaining URL policy work is scoped to broader route-builder ownership and historical OAuth callback documentation. | [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [Shopify workstream](../workstreams/shopify-commerce.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-086](../tasks/T-086-remove-hard-coded-localhost-navigation-urls.md), [T-087](../tasks/T-087-retire-server-api-self-fetch-wrappers.md) | T-087 completed 2026-05-17 |
| F-031 | A-014 | Medium | Converted | High-confidence unused leaf files, WIP variants, barrels, starter assets, and import cleanup need staged pruning with verification. | A-014 listed zero-import UI/WIP files, unused barrels, starter assets, and unused exports/imports with targeted reference-search evidence. | [production risks](../risks/production-readiness.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-032 | A-004, A-014 | Medium | Resolved | Auth/session cleanup and stale `/protected` route deletion need auth-owner confirmation before pruning. | Resolved by T-019 on 2026-05-14: `LoginForm`, `processLogin`, the custom JWT cookie session helpers, unreferenced duplicate/test-header session helpers, `src/app/protected/page.tsx`, and the stale protected-route constant were removed after reference searches confirmed no active owner workflow; focused sign-in/route utility tests and lint passed. Package cleanup remains separate. | [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-019](../tasks/T-019-legacy-auth-session-pruning.md) | T-019 2026-05-14 |
| F-033 | A-014, A-018 | Medium | Converted | The translation pipeline is mostly unused and needs owner direction before pruning or integration. | A-014 found `TranslatedContent` and translation data have no live rendered consumers beyond global language state. A-018 confirmed the visible language picker is local UI state that does not change rendered copy or document locale, while active and legacy translation assets remain split across multiple locations. | [A-018 result](results/A-018-translations-content-taxonomy.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md) | Reconciled 2026-05-14; A-018 reconciled 2026-05-19 |
| F-034 | A-014, A-019 | Medium | Resolved | Unused direct dependencies need a package-focused cleanup with lockfile and full verification. | Resolved by T-022 on 2026-05-14: removed unused direct `jose`, `next-test-api-route-handler`, `@types/uuid`, Shopify/GraphQL client packages, and the direct `@radix-ui/react-dialog` manifest entry; refreshed `package-lock.json`; confirmed `core-js` is gone and remaining `jose`/Radix dialog paths are transitive only; full Jest, lint, npm tree, and audit verification passed. T-021 later cleared the unrelated public-search schema build blocker and `npm run build` passed. | [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-022](../tasks/T-022-prune-unused-package-candidates.md) | T-022 2026-05-14 |
| F-035 | A-014 | Low | Converted | Root Shopify historical notes should not be deleted until useful facts are consolidated. | A-014 found six root `SHOP*.md` notes totaling 1,555 lines and `docs/archive/README.md` says filtering/sorting history still needs review. | [production risks](../risks/production-readiness.md), [Shopify workstream](../workstreams/shopify-commerce.md) | Reconciled 2026-05-14 |
| F-036 | A-002, A-004 | High | Partially mitigated | API failures and protected API auth responses do not consistently return real HTTP status codes. | T-026 added shared route-local user/admin API guards and migrated admin collection create/update plus user profile auth-status behavior to real JSON `401`/`403` responses. T-027 applied the user guard to navigation, favourites, and watchlist read routes so unauthenticated callers receive real JSON `401` before DB/model work. T-033 migrated user comment delete to the shared user guard before DB/transaction work, added route-param validation before DB work, and fixed the typed delete envelope. T-039 migrated admin article/artwork/blog/collection/comment/user read routes to `requireApiAdmin()`, added target-read `dbConnect()` ownership, and added JSON `400` detail ID handling before target reads. T-040 migrated admin article/artwork/blog/collection/comment/user delete routes to `requireApiAdmin()`, added destructive ID validation before target/session work, route-local DB ownership, and focused cascade/delete coverage. T-041 changed middleware so unauthenticated protected API requests receive shared JSON `401` responses instead of browser redirects while frontend redirects are preserved. T-042 migrated user comment GET/POST/PATCH to `requireApiUser()` before body, DB, model, or transaction work, and made GET missing-user/internal failures return real `404`/`500` statuses. T-043 added static protected user/admin guard inventory coverage so protected route files must keep shared guard imports/calls, avoid direct session/admin helper checks, and call guards before body, DB, model, or transaction work. T-044 changed protected user profile/navigation/favourite/watchlist missing-resource and internal-failure paths to real `404`/`500` statuses through shared response helpers. T-045 changed public artwork/article/blog detail missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-046 changed public collection missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-047 changed public navigation missing-resource and internal-failure paths to real `404`/`500` statuses through the same helpers. T-048 changed admin read empty-list, missing-resource, and internal-failure paths to real `404`/`500` statuses through the same helpers while preserving auth and invalid-ID behavior. T-049 changed admin delete missing-resource, artwork conflict, and internal-failure paths to real `404`/`409`/`500` statuses through the same helpers while preserving auth, invalid-ID, cascade, and transaction behavior. T-050 changed admin create/update success, missing-resource, blog slug conflict, and internal-failure paths to shared helper envelopes with real `201`/`200`/`404`/`409`/`500` statuses while preserving validation and guard ordering. Other response-helper and logging cleanup remains separate. | [A-002 result](results/A-002-api-contracts.md), [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-026](../tasks/T-026-shared-api-route-guards.md), [T-027](../tasks/T-027-user-saved-routes-shared-guard.md), [T-033](../tasks/T-033-harden-user-comment-delete-route.md), [T-039](../tasks/T-039-migrate-admin-read-routes-shared-guard.md), [T-040](../tasks/T-040-migrate-admin-delete-routes-shared-guard.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md), [T-042](../tasks/T-042-migrate-user-comment-read-write-shared-guard.md), [T-043](../tasks/T-043-add-protected-api-guard-inventory.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-037 | A-002 | High | Resolved | API client fetchers expose unsupported route paths and methods. | Resolved by T-032 on 2026-05-15: T-029 made these mismatches measurable with a focused route/fetcher parity test and self-checking known-gap allowlist; T-030 added the active admin user/comment detail read routes; T-031 removed unused favourite/watchlist write fetchers; and T-032 removed the unused profile update fetcher. `KNOWN_ROUTE_FETCHER_GAP_IDS` is now empty and the parity test passes with all inventoried fetcher operations backed by matching route methods. | [A-002 result](results/A-002-api-contracts.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-029](../tasks/T-029-route-fetcher-parity-inventory.md), [T-030](../tasks/T-030-admin-user-comment-detail-read-routes.md), [T-031](../tasks/T-031-prune-unused-saved-item-write-fetchers.md), [T-032](../tasks/T-032-prune-unused-profile-update-fetcher.md) | T-032 2026-05-15 |
| F-038 | A-002, A-003 | High | Converted | Create/update routes bypass validation or convert validation failures to 500 and return raw documents under typed result contracts. | A-002 found admin and user create/update validation is uneven and often caught as 500; A-003 found exported Zod schemas are bypassed in several admin writes and route responses are typed as transformed results while returning raw Mongoose documents. | [A-002 result](results/A-002-api-contracts.md), [A-003 result](results/A-003-data-models-transforms.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md) | Reconciled 2026-05-14 |
| F-039 | A-003 | High | Resolved | Required and optional field contracts disagreed across Mongoose models, Zod schemas, and TypeScript types. | Resolved by T-053 through T-056: T-053 documented the authoritative article, blog, and user field contracts; T-054 completed article `section` runtime alignment; T-055 completed blog `imageUrl`/`pinned`/`tags` runtime alignment; and T-056 completed user `password` runtime alignment by making persisted user passwords optional, preserving credentials registration/login password requirements, denying credentials auth for users without stored hashes before bcrypt verification, preserving hashed-user role propagation, and keeping public/own password sanitization intact. New required/optional drift outside this scoped matrix should be tracked separately. | [A-003 result](results/A-003-data-models-transforms.md), [data field contracts](../architecture/data-field-contracts.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-054](../tasks/T-054-align-article-section-options.md), [T-055](../tasks/T-055-align-blog-field-contracts.md), [T-056](../tasks/T-056-align-user-password-oauth-contract.md) | T-056 2026-05-15 |
| F-040 | A-003 | Medium | Resolved | Public transform extenders can emit defaults or `undefined` values that conflict with frontend contracts. | Resolved by T-051 on 2026-05-15: blog transforms derive `readTime` from text, collection transforms return `firstArtworkId: null` instead of `undefined` for empty collections, public user transforms compute `isOwner` while filtering `email` and `password`, and populated comment/blog transforms preserve supplied `userId` ownership context. | [A-003 result](results/A-003-data-models-transforms.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-051](../tasks/T-051-add-public-transform-contract-coverage.md) | T-051 2026-05-15 |
| F-041 | A-003 | Medium | Resolved | Public artwork image payloads bypass Cloudinary sanitization and include undocumented image fields. | Resolved by T-052 on 2026-05-15: `transformArtwork.toFrontend()` and populated artwork transforms now sanitize Cloudinary image payloads, public DTOs omit `image.public_id`, `similarityScore` is typed as optional public-only image metadata, and Cloudinary color schemas validate strict `{ color, percentage }` entries. | [A-003 result](results/A-003-data-models-transforms.md), [data/API workstream](../workstreams/data-models-and-api.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [testing workstream](../workstreams/testing-and-quality.md), [T-052](../tasks/T-052-sanitize-public-artwork-image-contracts.md) | T-052 2026-05-15 |
| F-042 | A-004 | High | Resolved | Credentials admin sessions did not persist the database role into JWT/session state. | Resolved by T-002 on 2026-05-14: credentials auth now returns the persisted role, the JWT/session callbacks preserve it, and `npm test`, targeted auth/route tests, `npm run lint`, and `npm run build` passed. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md) | T-002 2026-05-14 |
| F-043 | A-004 | High | Resolved | User ownership checks depended on mutable display names and could create users during protected reads. | Resolved by T-003 on 2026-05-14: `getUserIdFromSession()` now returns stable `session.user.id`, the normal session user helper no longer resolves by `session.user.name` or creates users, and focused auth tests cover the helper behavior. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md) | T-003 2026-05-14 |
| F-044 | A-002, A-004, A-007, A-008 | High | Partially mitigated | Cloudinary signing bypasses standard admin/API/upload configuration controls. | T-005 added a route-local API admin guard, JSON 401/403 responses, request and `paramsToSign` validation, missing-secret handling, an additive success envelope, and focused route tests. T-065 documented Cloudinary env ownership/status. T-066 restricted signed params for the current admin upload widget to `timestamp`, `upload_preset: "laoutaris_art"`, and `source: "uw"`, rejecting unknown and malformed values before signing. T-101 documented the interim asset lifecycle and upload ownership policy. Upload preset environment ownership, signed folder policy, and runtime cleanup implementation remain open. | [A-002 result](results/A-002-api-contracts.md), [A-004 result](results/A-004-auth-admin-permissions.md), [A-007 result](results/A-007-deployment-environment.md), [A-008 result](results/A-008-security-headers-cors-logging.md), [T-005](../tasks/T-005-cloudinary-signing-api-guard.md), [T-065](../tasks/T-065-update-environment-inventory.md), [T-066](../tasks/T-066-harden-cloudinary-signing-params.md), [T-101](../tasks/T-101-define-cloudinary-asset-lifecycle-policy.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | T-101 2026-05-18 |
| F-045 | A-004 | Medium | Resolved | Admin bootstrap and recovery are not documented as repeatable operations. | Resolved by T-138: the auth runbook now documents first-admin bootstrap, routine admin promotion, lockout recovery, MongoDB role-change evidence, sign-out/sign-in verification, rollback, and secret-handling rules. Runtime current-admin and last-admin deletion protections remain separate. | [A-004 result](results/A-004-auth-admin-permissions.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-138](../tasks/T-138-document-admin-bootstrap-recovery.md) | T-138 completed 2026-05-19 |
| F-046 | A-007 | High | Converted | A server-only MongoDB connection string is exposed through Next config `env`. | A-007 found `next.config.mjs` assigns `MONGO_URI: process.env.MONGO_URI` under `env` while `MONGO_URI` is a secret used by server DB helpers. | [A-007 result](results/A-007-deployment-environment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |
| F-047 | A-007 | High | Partially mitigated | The environment runbook is missing active variables and decisions for legacy or platform-provided values. | T-065 updated the environment runbook from current source-search evidence without secret values or runtime config changes. T-086 refreshed the URL variable inventory after T-085 and the `/project` redirect cleanup: `NEXT_PUBLIC_BASE_URL` is now deprecated current-source configuration, and `VERCEL_URL` no longer names the current `/project` redirect. T-087 removed the retired server wrappers that were the remaining current-source users of `VERCEL_ENV`/`VERCEL_URL` URL construction, and the environment runbook now classifies those Vercel names as not required by current source. Owner decisions for unused legacy/public candidates and credential rotation remain separate. | [A-007 result](results/A-007-deployment-environment.md), [environment runbook](../runbooks/environment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-065](../tasks/T-065-update-environment-inventory.md), [T-086](../tasks/T-086-remove-hard-coded-localhost-navigation-urls.md), [T-087](../tasks/T-087-retire-server-api-self-fetch-wrappers.md) | T-087 completed 2026-05-17 |
| F-048 | A-007 | Medium | Partially mitigated | Deployment smoke checks, runtime version, Vercel settings, and rollback steps are not repeatable. | T-025 expanded the deployment runbook with exact smoke evidence fields, minimum route/status expectations, credentials smoke secret handling, targeted Vercel log requirements, concrete rollback triggers, and added `npm run smoke:public` for unauthenticated public-route status checks. T-064 added repo runtime/package-manager pins and `npm ci` install docs. Vercel project-setting ownership remains open under R-028. | [A-007 result](results/A-007-deployment-environment.md), [deployment runbook](../runbooks/deployment.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [T-024](../tasks/T-024-verify-vercel-bcrypt-redeploy-smoke.md), [T-025](../tasks/T-025-repeatable-vercel-smoke-checklist.md), [T-064](../tasks/T-064-pin-node-npm-runtime.md) | T-064 2026-05-16 |
| F-049 | A-002, A-017 | Medium | Partially mitigated | Public list and search route semantics are under-specified. | T-021 made public search honor the fetcher's `type` parameter while preserving the existing success envelope. T-151 added current-scope search metadata, selected-type pagination, and explicit no-results states for supported article, blog, and collection searches. Broader public list empty-state semantics and the F-098 site-wide search-scope decision remain separate. | [A-002 result](results/A-002-api-contracts.md), [A-017 result](results/A-017-search-navigation-discovery.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-151](../tasks/T-151-add-current-scope-search-empty-pagination.md) | T-151 completed 2026-05-19 |
| F-050 | A-002 | Medium | Converted | The admin API action-segment route convention is not documented or decisioned. | A-002 found admin APIs use `/admin/{entity}/create`, `/read`, `/update/[id]`, and `/delete/[id]`, while the architecture docs only describe admin CRUD at a high level and do not state whether action segments are canonical. | [A-002 result](results/A-002-api-contracts.md), [data/API workstream](../workstreams/data-models-and-api.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md) | Reconciled 2026-05-14 |
| F-051 | A-008 | High | Resolved | Registration logs expose raw password, hashed password, and saved user document data. | Resolved by T-009 on 2026-05-14: `registerUser` no longer emits direct console logs, and a focused source hygiene test fails if registration console logging returns. | [A-008 result](results/A-008-security-headers-cors-logging.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-009](../tasks/T-009-remove-credential-logging-and-source-secret.md) | T-009 2026-05-14 |
| F-052 | A-008 | Medium | Partially mitigated | Global API CORS and CSP policy are too broad for the production admin, auth, and commerce surface. | T-096 removed the global API CORS header rule from `next.config.mjs`, eliminating the wildcard-origin plus credential pairing and wildcard allowed request headers, and added baseline hardening headers plus low-risk CSP `object-src`, `base-uri`, `form-action`, and `frame-ancestors` directives. A-008's broader strict CSP allowlist, unsafe script behavior, broad source allowances, dynamic route-level CORS, HSTS, CSP reporting, and monitoring follow-ups remain open. | [A-008 result](results/A-008-security-headers-cors-logging.md), [T-096](../tasks/T-096-harden-baseline-security-headers-cors.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | T-096 2026-05-17 |
| F-053 | A-008 | Medium | Partially mitigated | Production logging and API error responses need redaction and public-safe exception handling. | A-008 found always-on middleware/session/fetcher/DB/API logs and public/admin routes returning raw exception messages, including public enquiry and public artwork detail errors. T-041 removed middleware debug logs and returned public-safe shared auth-error envelopes for middleware API `401`/`403` responses. T-044 added public-safe `500` response bodies for protected user profile/navigation/favourite/watchlist read-route internal failures. T-045 added public-safe `500` response bodies for public artwork/article/blog detail internal failures and removed touched public blog detail debug logs. T-046 added public-safe `500` response bodies for public collection route internal failures and removed touched collection request debug logging. T-047 added public-safe `500` response bodies for public navigation route internal failures and removed touched navigation request/found/no-results debug logging. T-048 added public-safe `500` response bodies for admin read route internal failures. T-049 added public-safe `500` response bodies for admin delete route internal failures and removed touched admin delete debug logs. T-050 added public-safe `500` response bodies for admin create/update route internal failures and preserved private-message redaction; broader session, fetcher, DB, API exception, and logging-policy work remains. | [A-008 result](results/A-008-security-headers-cors-logging.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-041](../tasks/T-041-harden-middleware-api-auth-responses.md), [T-044](../tasks/T-044-introduce-api-response-helpers-user-read-routes.md), [T-045](../tasks/T-045-apply-api-response-helpers-public-content-detail-routes.md), [T-046](../tasks/T-046-apply-api-response-helpers-public-collection-routes.md), [T-047](../tasks/T-047-apply-api-response-helpers-public-navigation-routes.md), [T-048](../tasks/T-048-apply-api-response-helpers-admin-read-routes.md), [T-049](../tasks/T-049-apply-api-response-helpers-admin-delete-routes.md), [T-050](../tasks/T-050-apply-api-response-helpers-admin-create-update-routes.md) | T-050 2026-05-15 |
| F-054 | A-008 | Medium | Duplicate | Cloudinary signing allowed params, upload preset ownership, and lifecycle policy remain incomplete. | A-008 confirmed the signing route still signed arbitrary plain-object params after T-005. T-066 completed the allowed signing params slice under F-044, and T-101 documented the interim lifecycle and upload ownership policy. Upload preset environment ownership, signed folder policy, and runtime cleanup implementation remain under F-044/R-008/F-067/F-068. | F-044, [A-008 result](results/A-008-security-headers-cors-logging.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-066](../tasks/T-066-harden-cloudinary-signing-params.md), [T-101](../tasks/T-101-define-cloudinary-asset-lifecycle-policy.md) | T-101 2026-05-18 |
| F-055 | A-016 | High | Resolved | Public enquiry accepts and logs raw request bodies without route validation. | Resolved by T-010 on 2026-05-14: `POST /api/v2/public/enquiry` now validates a shared normalized DTO with `safeParse`, persists only parsed fields, removes request-body logging, returns real HTTP 400 field errors and public-safe 500s, and has focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-010](../tasks/T-010-public-enquiry-validation.md) | T-010 2026-05-14 |
| F-056 | A-016 | High | Resolved | User comment creation reads the request body twice and bypasses the existing comment schema. | Resolved by T-012 on 2026-05-14: `POST /api/v2/user/comment` now authenticates, reads JSON once, validates and trims route-safe comment input, returns real 401/400/404/500 statuses, persists only parsed text, keeps transactional blog/user linkage, returns a transformed frontend DTO, and has focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-012](../tasks/T-012-user-comment-validation.md) | T-012 2026-05-14 |
| F-057 | A-016 | High | Resolved | Admin create/update route validation is inconsistent and invalid input often becomes a 500. | Resolved by T-020, T-034, T-037, and T-038: collection, article, artwork, and blog create/update routes now use strict route schemas, parsed allowlisted persistence, route-param validation where applicable, shared admin guards before body reads, route-local `dbConnect()` before model writes, structured validation responses, session-owned create authors, public-safe persistence failures, and focused route tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [testing workstream](../workstreams/testing-and-quality.md), [T-020](../tasks/T-020-admin-collection-write-validation.md), [T-034](../tasks/T-034-harden-admin-article-write-validation.md), [T-037](../tasks/T-037-harden-admin-artwork-write-validation.md), [T-038](../tasks/T-038-harden-admin-blog-write-validation.md) | T-038 2026-05-15 |
| F-058 | A-016 | High | Resolved | Current sign-in UI bypasses the validation/auth action path and calls `signIn()` without field values. | Resolved by T-013 on 2026-05-14: `SignInForm` now validates username/password through the shared credentials schema, calls `signIn("credentials", { username, password, redirect: false })`, shows field and generic auth errors, updates the session after success, and has focused component tests for validation, success wiring, bad credentials, accessible fields, and modal switching. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-013](../tasks/T-013-sign-in-flow-repair.md) | T-013 2026-05-14 |
| F-059 | A-016 | Medium | Resolved | Subscription server action accepts any non-empty email string. | Resolved by T-017 on 2026-05-14: `submitSubscription` now validates defensive `FormData` input with the subscriber schema before MongoDB access, trims and lowercases accepted email values, owns `dbConnect()`, duplicate-checks and persists the normalized DTO, removes direct input logging, returns stable public-safe failures, and has focused action tests. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-017](../tasks/T-017-subscription-validation.md) | T-017 2026-05-14 |
| F-060 | A-016 | Medium | Resolved | Public search, artwork browse, and shop browse APIs need query parsing and bounds. | Resolved by T-021, T-035, and T-036: public search now validates and bounds `q`/`type`/`page`/`limit` and escapes regex input; public artwork browse now validates filter/sort/color/pagination params before session or service work; public shop browse now validates repeated filters, product-type boolean strings, and optional `sortBy` before `dbConnect()`, MongoDB query construction, or Shopify product fan-out. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-021](../tasks/T-021-public-search-query-service.md), [T-035](../tasks/T-035-bound-public-artwork-browse-query.md), [T-036](../tasks/T-036-bound-public-shop-browse-query.md) | T-036 2026-05-15 |
| F-061 | A-016 | Medium | Resolved | Comment edit bypasses the max-length and trim schema used by the UI. | Resolved by T-012 on 2026-05-14: `PATCH /api/v2/user/comment/[commentId]` now validates the ObjectId route param and route-safe body schema, trims persisted text, enforces ownership, returns real 401/400/403/404/500 statuses, returns a transformed frontend DTO, and has focused route tests for blank/overlong/forbidden/success paths. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-012](../tasks/T-012-user-comment-validation.md) | T-012 2026-05-14 |
| F-062 | A-016 | Medium | Resolved | Legacy auth, search, and comment controls need accessible labels and button semantics. | Resolved by T-013, T-104, and T-105: sign-in fields and modal switches now have accessible labels/button semantics, public search/drawer/mobile navigation and unauthenticated artwork intent controls use labelled semantic buttons, and owner-only comment edit/delete plus edit-mode cancel/save icon controls are labelled non-submit buttons with hidden decorative icons. Focused tests, lint, build, and `git diff --check` passed for each slice. | [A-016 result](results/A-016-forms-validation-inputs.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [T-013](../tasks/T-013-sign-in-flow-repair.md), [T-104](../tasks/T-104-fix-public-search-navigation-accessibility.md), [T-105](../tasks/T-105-fix-public-comment-action-accessibility.md) | T-105 completed 2026-05-18 |
| F-063 | A-019 | High | Partially mitigated | Production dependency audit reports high runtime vulnerabilities that need major-migration decisions. | T-016 upgraded `bcrypt` to `6.0.0` and removed the `bcrypt -> @mapbox/node-pre-gyp -> tar` production advisory path. T-015 confirmed `npm audit --omit=dev --json` now exits `1` with only residual `next@14.2.35` and nested `next/node_modules/postcss` advisories. npm recommends stable `next@16.2.6`, but isolated metadata/audit checks show that stable release still bundles vulnerable `postcss@8.4.31`; canary `16.3.0-canary.6+` declares `postcss@8.5.10` and clears an isolated audit. No stable target or residual production advisory is accepted for launch until the owner/orchestrator chooses the path. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [T-011](../tasks/T-011-production-dependency-security-patch.md), [T-014](../tasks/T-014-residual-dependency-advisory-decision.md), [T-015](../tasks/T-015-next-major-migration-preflight.md), [T-016](../tasks/T-016-bcrypt-6-compatibility.md) | T-015 2026-05-14 |
| F-064 | A-019 | High | Partially mitigated | Package-manager, Node runtime, CI, and automated dependency-update controls are missing. | T-064 committed `packageManager: "npm@10.9.2"`, a Node engine policy of `>=22.14.0 <23`, `.nvmrc`, `.node-version`, `.npmrc` engine enforcement, lockfile root metadata, and `npm ci` setup/deployment/testing docs. CI/dependency-update automation and Vercel project-setting ownership remain open. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [T-064](../tasks/T-064-pin-node-npm-runtime.md) | T-064 2026-05-16 |
| F-065 | A-019 | Medium | Partially mitigated | Required install lifecycle scripts need an explicit policy. | A-019 found required install scripts for `bcrypt` and `core-js`, with `core-js` pulled by unused `next-test-api-route-handler` and `bcrypt` tied to the high `tar` advisory path. T-016 removed the `bcrypt -> @mapbox/node-pre-gyp -> tar` advisory path, T-022 removed `next-test-api-route-handler` plus the `core-js` install-script path, and T-023 removed bcrypt from normal public-page imports. T-024 confirmed `origin/main` contains T-023 and production `GET /` returns `HTTP/2 200`, closing the bcrypt native-load crash; native `bcrypt` runtime policy remains open for future dependency/runtime changes. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-016](../tasks/T-016-bcrypt-6-compatibility.md), [T-022](../tasks/T-022-prune-unused-package-candidates.md), [T-023](../tasks/T-023-root-layout-auth-bcrypt-decoupling.md), [T-024](../tasks/T-024-verify-vercel-bcrypt-redeploy-smoke.md), [bcrypt incident](../tasks/incident-2026-05-14-vercel-bcrypt-native-trace.md) | T-024 2026-05-14 |
| F-066 | A-019 | Medium | Converted | Dev/test tooling carries critical/high advisories and deprecated transitive packages. | A-019 full `npm audit --json` reported 31 total vulnerabilities, including dev-only critical `form-data` through `jest-environment-jsdom`/`jsdom`, and 15 deprecated transitive packages. | [A-019 result](results/A-019-dependencies-supply-chain.md), [production risks](../risks/production-readiness.md), [testing workstream](../workstreams/testing-and-quality.md), [deployment workstream](../workstreams/deployment-security-and-observability.md) | Reconciled 2026-05-14 |
| F-067 | A-009 | High | Partially mitigated | Cloudinary asset deletion, orphan cleanup, backup, restore, and rollback are not defined or implemented. | A-009 found admin delete routes remove MongoDB records and relationships without Cloudinary cleanup, and no `cloudinary.uploader.destroy` or equivalent source path exists. T-101 now defines the interim policy in the Cloudinary runbook: preserve assets on MongoDB deletion, keep automatic cleanup disabled until backup/restore and owner approval are in place, use manual orphan-review evidence before deletion, and document rollback expectations. Runtime cleanup implementation remains open. | [A-009 result](results/A-009-cloudinary-assets.md), [production risks](../risks/production-readiness.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [Cloudinary runbook](../runbooks/cloudinary.md), [T-101](../tasks/T-101-define-cloudinary-asset-lifecycle-policy.md) | T-101 completed 2026-05-18 |
| F-068 | A-009 | Medium | Partially mitigated | Cloudinary upload preset, cloud, folder, and delivery ownership remain split between hard-coded source, environment docs, and open policy notes. | A-009 found `UploadButton` and the signing route hard-code `laoutaris_art`, signed `folder` is rejected, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is unused, and `next.config.mjs` delivery allowlists one Cloudinary cloud while the signer reads the public cloud name from env. T-101 documents those as current source facts, keeps the preset hard-coded until owner decision, keeps folder signing disabled until folder rules are approved, and requires the upload cloud to stay aligned with the delivery allowlist. Runtime config centralization remains open. | [A-009 result](results/A-009-cloudinary-assets.md), [production risks](../risks/production-readiness.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [environment runbook](../runbooks/environment.md), [Cloudinary runbook](../runbooks/cloudinary.md), [T-101](../tasks/T-101-define-cloudinary-asset-lifecycle-policy.md) | T-101 completed 2026-05-18 |
| F-069 | A-009 | Medium | Converted | Artwork upload metadata parsing is brittle and can leave orphaned Cloudinary assets after failed MongoDB persistence. | A-009 found admin upload code checks only for `result.info.colors` before casting to `CloudinaryUploadInfo`; persisted image schemas validate later, after an asset may already exist; failed create/update flows do not mark pending uploads, retry, or clean up orphans. | [A-009 result](results/A-009-cloudinary-assets.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [data/API workstream](../workstreams/data-models-and-api.md) | Reconciled 2026-05-18 |
| F-070 | A-009 | Medium | Resolved | Blog and collection images are arbitrary URLs rather than Cloudinary-owned asset references or allowed-host validated assets. | A-009 found blog and collection forms accept free-text `imageUrl` values and schemas validate only URL shape/length, while Next image optimization allows only configured Cloudinary, Flaticon, and Shopify CDN hosts. T-101 documented the interim decision table. T-135 added shared runtime validation so admin article, blog, and collection image URL writes accept only the configured Cloudinary delivery path or documented Flaticon/Shopify CDN external hosts before persistence. T-171 completed the existing-data review: all 30 audited article, blog, and collection `imageUrl` values use the configured Cloudinary delivery path, with no malformed, unsupported-host, or mismatched-cloud entries found. No image URL migration is indicated for this scoped finding. | [A-009 result](results/A-009-cloudinary-assets.md), [T-171 result](results/T-171-content-image-url-audit.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [data/API workstream](../workstreams/data-models-and-api.md), [Cloudinary runbook](../runbooks/cloudinary.md), [T-101](../tasks/T-101-define-cloudinary-asset-lifecycle-policy.md), [T-135](../tasks/T-135-harden-content-image-url-validation.md), [T-171](../tasks/T-171-audit-existing-content-image-urls.md) | T-171 completed 2026-05-20 |
| F-071 | A-009 | Low | Resolved | Cloudinary delivery transformations are duplicated string replacements instead of a shared, documented delivery policy. | Resolved by T-136: `src/lib/images/cloudinaryDelivery.ts` owns named variants for current card, gallery-list, admin-preview, and blog section transforms; scoped component call sites use the helper; and source-hygiene coverage blocks new direct upload-path replacement in those areas. | [A-009 result](results/A-009-cloudinary-assets.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [Cloudinary runbook](../runbooks/cloudinary.md), [T-136](../tasks/T-136-centralize-cloudinary-delivery-transformations.md) | T-136 completed 2026-05-19 |
| F-072 | A-020 | High | Partially mitigated | Public privacy, cookie, terms, and commerce policy pages are missing for active data collection and commerce surfaces. | T-213 added public `/privacy` and `/terms` routes, footer legal links, owner/contact details, owner approval version display, factual current-behavior privacy copy, cookie/session/third-party disclosure, terms/account/comment expectations, artwork/content ownership language, and Shopify-hosted purchase boundary language. Remaining commerce-policy gaps include Shopify policy target URLs and any jurisdiction/audience-specific legal claims after explicit owner input. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [T-213](../tasks/T-213-add-owner-approved-policy-routes-and-footer-links.md) | T-213 completed 2026-05-22 |
| F-073 | A-020 | High | Resolved | Newsletter subscription lacks consent/source metadata and unsubscribe workflow. | Resolved by T-214: the newsletter form now requires explicit consent and links to `/privacy` and `/terms`; new subscriber records persist consent version/text/source metadata, consent acceptance time, sanitized source path, `unsubscribed: false`, `unsubscribedAt: null`, and a generated public unsubscribe identifier; `/newsletter/unsubscribe` provides a public-safe unsubscribe flow with redacted logging and focused coverage. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [T-214](../tasks/T-214-add-newsletter-consent-source-unsubscribe.md) | T-214 completed 2026-05-22 |
| F-074 | A-020 | High | Partially mitigated | Account signup and OAuth data collection needed terms/privacy acknowledgement and account privacy request handling. | A-020 found `UserModel` stores account, role, comment, watchlist, and favourite data; credentials signup collected email/password/username with no terms/privacy acknowledgement; OAuth profile persistence existed; and the visible delete-account button was inert while deletion was admin-only. T-215 added owner-approved credentials signup acknowledgement with `/privacy` and `/terms` links, blocks missing acknowledgement before registration, persists acknowledgement metadata for new credentials and OAuth-created users, adds an app-owned `/sign-in` provider notice, and replaces the inert account delete control with a manual delete/export/correction request handoff to hlaoutaris@gmail.com. Future self-service deletion/export/correction workflows and broader retention automation remain separate. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-215](../tasks/T-215-add-account-privacy-acknowledgement-manual-request.md) | T-215 completed 2026-05-22 |
| F-075 | A-020 | Medium | Partially mitigated | Public comments need posting notice, moderation/reporting policy, and deletion/retention expectations. | A-020 found comment forms and public displays expose user-generated text and usernames without a posting notice, moderation/reporting workflow, or documented retention/deletion policy. T-216 added owner-approved visible comment posting notice in `CommentForm`, `/privacy` and `/terms` links, and a manual moderation/removal/correction handoff to hlaoutaris@gmail.com while preserving comment submission, display, and owner edit/delete behavior. Real moderation/reporting workflows, request persistence, and retention automation remain separate. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-216](../tasks/T-216-add-comment-posting-notice-moderation-handoff.md) | T-216 completed 2026-05-22 |
| F-076 | A-020 | Medium | Resolved | Contact and product enquiry flows collect personal data without notice and previously dropped product context before persistence. | Resolved by T-100 and T-217. T-100 preserves normalized Shopify product handles from `/project/contact?product=...` through contact form defaults and public enquiry persistence, and rejects invalid product context. T-217 added visible privacy/retention notice copy to contact/product and artwork enquiry forms, links to `/privacy` and `/terms`, and provides hlaoutaris@gmail.com for privacy/legal questions, correction, or deletion requests while preserving existing enquiry validation, payloads, modal behavior, and draft retry behavior. Stored notice metadata, operator workflow changes, and retention automation remain separate optional future work. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [Shopify workstream](../workstreams/shopify-commerce.md), [data/API workstream](../workstreams/data-models-and-api.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-100](../tasks/T-100-preserve-product-context-in-enquiries.md), [T-217](../tasks/T-217-add-contact-enquiry-privacy-notice.md) | T-217 completed 2026-05-22 |
| F-077 | A-020 | Medium | Resolved | Cookie/session and third-party processing disclosures are incomplete. | Resolved by T-213: `/privacy` now includes factual cookie/session and third-party disclosure for NextAuth sessions, OAuth providers, Cloudinary, Shopify product data/hosted purchase handoff, and YouTube embeds, with focused coverage guarding the disclosed surfaces and blocking unsupported jurisdiction-specific claims. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [production risks](../risks/production-readiness.md), [T-213](../tasks/T-213-add-owner-approved-policy-routes-and-footer-links.md) | T-213 completed 2026-05-22 |
| F-078 | A-020 | Medium | Resolved | Commerce assurance copy is ahead of implemented checkout/cart and public sale policies. | Resolved for the visible shared-banner scope by T-209: shared security banners and matching security translation files no longer advertise unsupported payment, buyer-protection, money-back, guarantee, insured/global-shipping, or payment-method assurances. Owner/legal-approved policy pages, consent records, third-party disclosure, and app-owned checkout/cart remain separate R-018/R-001 work. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [Shopify workstream](../workstreams/shopify-commerce.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-209](../tasks/T-209-align-commerce-assurance-copy.md) | T-209 completed 2026-05-22 |
| F-079 | A-020 | Low | Resolved | A stale Shopify credential TODO remained in the product listing page comments. | Resolved by T-100: the stale credential TODO was removed from `src/app/shop/products/page.tsx` without adding credential values to source or docs. | [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [Shopify workstream](../workstreams/shopify-commerce.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-100](../tasks/T-100-preserve-product-context-in-enquiries.md) | T-100 completed 2026-05-18 |
| F-080 | A-021 | High | Partially mitigated | Production monitoring and error reporting are not implemented. | A-021 found no monitoring/error-reporting dependency, no `instrumentation.ts`, no monitoring env contract, and client/server error surfaces only log to console. T-123 added the decision-ready monitoring/error-reporting architecture plan with required capture surfaces, T-099 request ID and structured-log integration points, provider decision questions, environment-variable classification rules, and the post-approval implementation contract. T-124 added unauthenticated public smoke workflow automation separately. Provider-specific SDK installation, `instrumentation.ts`, alert automation, owner matrix completion, client/server instrumentation, credentialed/admin smoke, and provider log/alert monitoring remain open. | [A-021 result](results/A-021-observability-incident-response.md), [monitoring architecture](../architecture/monitoring-and-error-reporting.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-123](../tasks/T-123-define-monitoring-provider-plan.md), [T-124](../tasks/T-124-add-public-smoke-github-actions-workflow.md) | T-124 completed 2026-05-18 |
| F-081 | A-021 | High | Partially mitigated | Request/correlation IDs and structured redacted logging were missing. | T-099 added provider-neutral request ID generation/propagation, structured redacted API logging, optional public `requestId`/`X-Request-Id` response helper support, and migrated representative public/user/admin failure paths. T-117 migrated public content API article, blog, artwork, and collection internal-failure paths. T-118 migrated public search, navigation, and shop product API internal/upstream failure paths. T-119 migrated protected user favourite, watchlist, and comment API internal-failure paths. T-120 migrated admin read list/detail API internal-failure paths. T-121 migrated admin create/update/delete API internal-failure paths. T-122 locked a recursive API-v2 route source-hygiene guard against direct route-level `console.error()`/`console.warn()`. T-125 defined the lower-level service/client logging policy and grouped the remaining 86 non-route direct `console.error()`/`console.warn()` calls across 66 files into migration surfaces. T-126 migrated the first public loader/page implementation slice to requestless server structured logging with focused source hygiene. T-127 migrated the scoped Shopify provider/data service slice to requestless server structured logging with focused source hygiene. T-128 migrated the scoped server action/session-helper slice to requestless server structured logging with focused source hygiene. T-129 migrated the remaining account saved-artwork server loader failure path to requestless server structured logging with focused source hygiene. T-130 removed scoped public browsing client console failures while preserving existing UI state, modals, loading reset, and fallback/current-result behavior with focused source hygiene. T-131 removed scoped account/user client console failures while preserving contact/comment/logout/account-nav/comment-card/error-boundary failure state with focused source hygiene. T-132 removed scoped shared fetcher and low-value utility/helper console failures while preserving fallback/return contracts with focused source hygiene. T-133 removed the remaining known admin-dashboard client direct console failures while preserving dashboard form, feed, list, copy, upload, operation, and document-reader behavior with recursive admin dashboard source hygiene. The known non-route direct `console.error()`/`console.warn()` inventory is clear except the approved structured logger sink. Monitoring provider integration, alerts, owner matrix completion, admin reporting, and provider-backed client reporting remain open. T-116 created the incident-response runbook separately. | [A-021 result](results/A-021-observability-incident-response.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [data/API workstream](../workstreams/data-models-and-api.md), [auth/admin workstream](../workstreams/auth-admin-and-permissions.md), [Shopify workstream](../workstreams/shopify-commerce.md), [logging architecture](../architecture/logging-and-redaction.md), [T-099](../tasks/T-099-add-request-id-structured-logging.md), [T-116](../tasks/T-116-create-incident-response-runbook.md), [T-117](../tasks/T-117-migrate-public-content-api-structured-logging.md), [T-118](../tasks/T-118-migrate-public-discovery-shop-api-structured-logging.md), [T-119](../tasks/T-119-migrate-protected-user-api-structured-logging.md), [T-120](../tasks/T-120-migrate-admin-read-api-structured-logging.md), [T-121](../tasks/T-121-migrate-admin-write-delete-api-structured-logging.md), [T-122](../tasks/T-122-lock-api-route-logging-source-hygiene.md), [T-125](../tasks/T-125-define-service-client-logging-policy.md), [T-126](../tasks/T-126-migrate-public-loader-page-logging.md), [T-127](../tasks/T-127-migrate-shopify-provider-service-logging.md), [T-128](../tasks/T-128-migrate-server-action-session-logging.md), [T-129](../tasks/T-129-migrate-account-saved-artwork-loader-logging.md), [T-130](../tasks/T-130-remove-public-browsing-client-console-errors.md), [T-131](../tasks/T-131-remove-account-user-client-console-errors.md), [T-132](../tasks/T-132-remove-shared-fetcher-utility-console-errors.md), [T-133](../tasks/T-133-remove-admin-dashboard-client-console-errors.md) | T-133 completed 2026-05-19 |
| F-082 | A-021 | High | Resolved | Incident-response ownership, severity, triage, escalation, communication, and postmortem process are missing outside deploy-smoke rollback checks. | Resolved by T-116: `docs/runbooks/incident-response.md` now defines SEV-1 through SEV-4 classification, first-15-minute triage, intake sources, service-specific checks, rollback/defer/mitigate rules linked to the deployment runbook, evidence redaction/retention rules, explicit `TBD` owner placeholders, communication notes, post-incident review template, follow-up task rules, and closure criteria. Monitoring provider selection, alert automation, CI/scheduled smoke, and broad route-level logging migration remain separate. | [A-021 result](results/A-021-observability-incident-response.md), [incident response runbook](../runbooks/incident-response.md), [production risks](../risks/production-readiness.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-116](../tasks/T-116-create-incident-response-runbook.md) | T-116 completed 2026-05-18 |
| F-083 | A-021 | Medium | Partially mitigated | Public smoke checks are repeatable but not complete enough to cover credentialed, admin, content, or Vercel-log verification without owner action. | A-021 confirmed `npm run smoke:public` is useful but not scheduled or CI-gated in this repo, and its documented scope excludes credentials sign-in, admin dashboard access, and Vercel log inspection. T-124 added `.github/workflows/public-smoke.yml` so unauthenticated public smoke can run manually with a required `base_url` and on a schedule after repository variable `SMOKE_BASE_URL` is configured. Optional detail route variables remain non-secret owner inputs, and skipped optional checks are not complete production evidence. | [A-021 result](results/A-021-observability-incident-response.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [testing workstream](../workstreams/testing-and-quality.md), [production risks](../risks/production-readiness.md), [T-124](../tasks/T-124-add-public-smoke-github-actions-workflow.md) | T-124 completed 2026-05-18 |
| F-084 | A-010 | High | Partially mitigated | Public routes are globally dynamic because root layout and middleware perform request-time auth/database work. | T-102 removed root-layout `dbConnect()`, `getServerSession(authOptions)`, and related imports; made public middleware paths return before `getToken()`; and added focused middleware/root-layout source checks. Build now prerenders shell-only public routes such as `/biography`, `/collections`, `/project`, `/project/about`, `/project/aims`, `/project/film`, and `/shop`, while data/search/session-aware public routes remain dynamic from route-local blockers. T-110 codified those route-local dynamic blockers in the rendering/cache matrix and added explicit `force-dynamic` segment config to the remaining dynamic public pages without forcing broad static/ISR conversion. | [A-010 result](results/A-010-performance-seo-accessibility.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [T-102](../tasks/T-102-split-public-shell-auth-work.md), [T-110](../tasks/T-110-codify-public-route-cache-policy.md) | T-110 completed 2026-05-18 |
| F-085 | A-010 | High | Resolved | Production metadata, sitemap, robots, canonical/social previews, and structured data are missing. | Resolved by T-103, T-106, T-107, T-112, T-113, and T-114: root metadata now describes the archive, `robots.ts` and `sitemap.ts` exist, build emits static `/robots.txt` and `/sitemap.xml`, public article/blog/artwork/collection-artwork/product detail pages have route-specific metadata plus conservative JSON-LD, high-value detail pages emit breadcrumb JSON-LD, `sitemap()` includes best-effort dynamic public detail URLs, and `npm run smoke:public` now asserts deployed discovery endpoint status and minimal safe content. | [A-010 result](results/A-010-performance-seo-accessibility.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [deployment workstream](../workstreams/deployment-security-and-observability.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-103](../tasks/T-103-add-public-metadata-discovery.md), [T-106](../tasks/T-106-add-article-blog-detail-metadata.md), [T-107](../tasks/T-107-add-artwork-product-detail-metadata.md), [T-112](../tasks/T-112-add-public-breadcrumb-structured-data.md), [T-113](../tasks/T-113-expand-dynamic-detail-sitemap.md), [T-114](../tasks/T-114-add-discovery-endpoint-smoke-assertions.md) | T-114 completed 2026-05-18 |
| F-086 | A-010 | Medium | Resolved | The home hero preloads multiple large carousel images at quality 100. | Resolved by T-108: only the initially visible active home hero image remains prioritized, active hero `quality={100}` usage was removed, and touched home hero `fill` images now declare responsive `sizes`. | [A-010 result](results/A-010-performance-seo-accessibility.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-108](../tasks/T-108-tune-public-image-preload-sizing.md) | T-108 completed 2026-05-18 |
| F-087 | A-010 | Medium | Resolved | Product and artwork detail image behavior can fetch oversized or duplicate image payloads. | Resolved by T-108: touched shop banner, product detail, and product-detail featured artwork `fill` images now declare responsive `sizes`, and `MagnifierImage` waits for hover/focus intent before instantiating its high-resolution zoom image. | [A-010 result](results/A-010-performance-seo-accessibility.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [Cloudinary runbook](../runbooks/cloudinary.md), [T-108](../tasks/T-108-tune-public-image-preload-sizing.md) | T-108 completed 2026-05-18 |
| F-088 | A-010 | High | Resolved | Public search, drawer, mobile navigation, and unauthenticated artwork action controls have keyboard and accessible-name gaps. | Resolved by T-104 on 2026-05-18: `Searchbar` now submits through a labelled submit button, `SearchDrawer` and `MobileNavDrawer` use labelled button children for Radix trigger/close controls, and unauthenticated favourite/watchlist intent controls are explicit non-submit buttons that open the existing login-required modal. Focused accessibility/source tests, lint, build, and `git diff --check` passed. | [A-010 result](results/A-010-performance-seo-accessibility.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-104](../tasks/T-104-fix-public-search-navigation-accessibility.md) | T-104 completed 2026-05-18 |
| F-089 | A-010 | Medium | Resolved | Public pages expose nested main landmarks and noisy heading hierarchy. | Resolved by T-109: root layout now keeps spacing/min-height as a non-landmark wrapper, touched public route/view surfaces own their `<main>` landmarks, and repeated public hero/card/sidebar/section presentation headings were demoted away from `h1` with focused source invariants. | [A-010 result](results/A-010-performance-seo-accessibility.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [T-109](../tasks/T-109-normalize-public-landmarks-headings.md) | T-109 completed 2026-05-18 |
| F-090 | A-010 | Medium | Resolved | Artwork-to-shop product discovery depends on client-side product fetches. | Resolved by T-111: artwork and collection-scoped artwork detail loaders now resolve grouped Shopify product summaries server-side and pass them into `ArtworkView`; `ArtworkShopSection` renders from those summaries without `useEffect`, browser `fetch()`, or `/api/v2/public/shop/products/[productId]` calls. | [A-010 result](results/A-010-performance-seo-accessibility.md), [Shopify workstream](../workstreams/shopify-commerce.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [T-111](../tasks/T-111-render-artwork-shop-links-server-side.md) | T-111 completed 2026-05-18 |
| F-091 | A-011 | High | Resolved | Admin user deletion can remove the current admin or the last remaining admin account. | Resolved by T-141: the admin user delete route now blocks current-admin self-deletion with `403`, blocks last-admin deletion with `409`, preserves invalid-ID short-circuiting before DB work, and keeps non-admin user cascade cleanup covered. | [A-011 result](results/A-011-admin-content-operations.md), [production risks](../risks/production-readiness.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-141](../tasks/T-141-protect-admin-user-deletion.md) | T-141 completed 2026-05-19 |
| F-092 | A-011 | High | Resolved | Destructive admin hard deletes need operator-visible cascade previews, backup gates, and audit evidence. | T-156 added read-only admin delete preview routes and a typed preview contract for article, artwork, blog, collection, comment, and user deletes. T-163 renders that preview in the existing admin delete confirmation UI and disables destructive confirmation while the preview is loading, failed, or blocked. T-164 requires backup/export and owner/delegated review evidence in the UI and validates that evidence at each admin delete route before destructive mutation. T-165 now persists redacted admin delete audit events before destructive mutation for attempts that pass the evidence gate, stores only safe evidence references and preview counts, and records success, blocked, not-found, or handled failure outcomes where practical. Production delete use still requires the owner-approved operating procedure in the admin content runbook. | [A-011 result](results/A-011-admin-content-operations.md), [production risks](../risks/production-readiness.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [data/API workstream](../workstreams/data-models-and-api.md), [T-156](../tasks/T-156-add-admin-delete-cascade-preview-contract.md), [T-163](../tasks/T-163-surface-admin-delete-preview-ui.md), [T-164](../tasks/T-164-require-admin-delete-evidence-gate.md), [T-165](../tasks/T-165-persist-admin-delete-audit-events.md) | T-165 completed 2026-05-20 |
| F-093 | A-011 | Medium | Resolved | Article and collection relationship writes can persist dangling artwork references. | Resolved by T-142: admin article create/update now reject missing-but-valid `artwork` IDs, and collection update rejects missing-but-valid `artworksToAdd` IDs before persistence. `artworksToRemove` remains a filter operation by design. | [A-011 result](results/A-011-admin-content-operations.md), [data/API workstream](../workstreams/data-models-and-api.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [testing workstream](../workstreams/testing-and-quality.md), [T-142](../tasks/T-142-verify-admin-artwork-relationships.md) | T-142 completed 2026-05-19 |
| F-094 | A-011 | Medium | Resolved | Admin create/update forms hide route validation failures and collection create bypasses its success callback. | Resolved by T-144, T-148, and T-150: collection, article, blog, and artwork create/update forms now surface structured route field/form errors, `CreateCollectionForm` calls `onSuccess` after successful persistence, artwork/product-link validation failures are visible in the artwork forms, and `createFetcher()` preserves structured error-envelope fields for client forms. | [A-011 result](results/A-011-admin-content-operations.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-144](../tasks/T-144-surface-admin-collection-form-errors.md), [T-148](../tasks/T-148-standardize-admin-article-blog-form-errors.md), [T-150](../tasks/T-150-surface-admin-artwork-form-errors.md) | T-150 completed 2026-05-19 |
| F-095 | A-011 | Medium | Resolved | Admin archive maintenance relies on manual ObjectId copy/paste and shallow unpaginated read lists. | Resolved by T-152, T-173 through T-182. T-152 added direct read-list Update/Delete actions for articles, artwork, blogs, and collections, leaving manual ObjectId lookup as an escape hatch. T-173 audited the remaining list gaps. T-174 hardened admin read-list `page`/`limit` parsing across all six read-list routes with bounded structured `400` behavior before resource list queries. T-178 added comment/user read-list delete handoff into the existing preview/evidence/confirmation workflow. T-175 through T-177 added metadata-driven pagination, route-backed filters, and bounded title/slug search to the main blog read tab. T-179 added route-backed collection pagination and bounded title/slug search. T-180 added route-backed article pagination, existing filters, and bounded title/slug search. T-181 added route-backed artwork pagination, constrained filters, and bounded title search. T-182 added route-backed pagination to the main comment and user read tabs while preserving Copy ID and Delete handoff. Comment/user search remains out of scope until privacy/product policy exists, but normal archive maintenance no longer depends on shallow first-page lists. | [A-011 result](results/A-011-admin-content-operations.md), [T-173 result](results/T-173-admin-read-list-pagination-needs.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [T-152](../tasks/T-152-improve-admin-archive-entry-points.md), [T-173](../tasks/T-173-audit-admin-read-list-pagination-needs.md), [T-174](../tasks/T-174-harden-admin-read-list-query-bounds.md), [T-175](../tasks/T-175-pilot-admin-blog-read-pagination.md), [T-176](../tasks/T-176-route-back-admin-read-filters.md), [T-177](../tasks/T-177-pilot-admin-read-search.md), [T-178](../tasks/T-178-add-comment-user-delete-entry-points.md), [T-179](../tasks/T-179-apply-collection-admin-read-pagination-search.md), [T-180](../tasks/T-180-apply-article-admin-read-pagination-filter-search.md), [T-181](../tasks/T-181-apply-artwork-admin-read-pagination-search.md), [T-182](../tasks/T-182-add-comment-user-admin-read-pagination.md), [T-183](../tasks/T-183-extract-admin-read-pagination-control.md) | T-182 completed 2026-05-20 |
| F-096 | A-011, A-018 | Medium | Resolved | Blog pinned/tag taxonomy is route-supported but not manageable in visible admin workflows, and blog read filters are stale. | Resolved by T-153: admin blog create/update forms now expose `pinned` and canonical `BLOG_TAGS` controls, initialize existing values safely, submit route-supported values, and the admin blog read filter derives year options from returned blog data instead of a stale fixed list. | [A-011 result](results/A-011-admin-content-operations.md), [A-018 result](results/A-018-translations-content-taxonomy.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-153](../tasks/T-153-add-admin-blog-pinned-tag-controls.md) | T-153 completed 2026-05-20 |
| F-097 | A-011 | Medium | Resolved | Admin content CRUD and archive maintenance lack a dedicated operator runbook. | Resolved by T-149 and refreshed after T-165: `docs/runbooks/admin-content-operations.md` now covers create/update preparation, post-change smoke checks, validation-error handling, Cloudinary image URL policy, Shopify product-link verification, manual ObjectId lookup as an escape hatch, failure recovery, and production delete approval using the implemented cascade preview, backup/review evidence gate, and redacted audit-event controls. | [A-011 result](results/A-011-admin-content-operations.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [auth runbook](../runbooks/auth.md), [database runbook](../runbooks/database.md), [Cloudinary runbook](../runbooks/cloudinary.md), [admin content operations runbook](../runbooks/admin-content-operations.md), [T-149](../tasks/T-149-add-admin-content-operations-runbook.md), [T-165](../tasks/T-165-persist-admin-delete-audit-events.md) | T-165 refresh completed 2026-05-20 |
| F-098 | A-017 | High | Resolved | Global public search excludes artworks and shop products from a site-wide discovery entry point. | Resolved by T-210 and T-211. Public `/search` and `/api/v2/public/search` now include articles, blogs, collections, MongoDB-backed artworks, and Shopify product results. T-210 added artwork results, and T-211 added Shopify product results through the existing public shop product-list data path without adding checkout/cart, product detail handoff, shop listing control, or commerce policy changes. | [A-017 result](results/A-017-search-navigation-discovery.md), [production risks](../risks/production-readiness.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [data/API workstream](../workstreams/data-models-and-api.md), [Shopify workstream](../workstreams/shopify-commerce.md), [T-143](../tasks/T-143-decide-public-search-scope.md), [T-210](../tasks/T-210-add-artwork-results-to-public-search.md), [T-211](../tasks/T-211-add-shopify-product-results-to-public-search.md) | T-211 completed 2026-05-22 |
| F-099 | A-017 | Medium | Resolved | The `/artwork` page parses browse query parameters differently from the validated public artwork API. | Resolved by T-145: `/artwork` now parses App Router search params through `parseArtworkListQuery`, shares the API default sort/filter behavior, normalizes valid repeated filters, and falls back to safe shared defaults for invalid page queries. | [A-017 result](results/A-017-search-navigation-discovery.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [T-145](../tasks/T-145-align-artwork-page-query-parsing.md) | T-145 completed 2026-05-19 |
| F-100 | A-017 | Medium | Resolved | Blog sorted discovery pages do not preserve sort through follow-up loading or pagination UI. | Resolved by T-146: sorted blog pages forward active `sortby` into continuous loading, follow-up client blog requests preserve that sort, and sorted pages render the existing `prev`/`next` pagination contract. | [A-017 result](results/A-017-search-navigation-discovery.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-146](../tasks/T-146-preserve-sorted-blog-loading.md) | T-146 completed 2026-05-19 |
| F-101 | A-017 | Medium | Resolved | Main navigation fails closed when dynamic biography or collection nav data is unavailable. | Resolved by T-147: `MainNavLoader` now renders stable `/biography` and `/collections` route-root fallbacks when dynamic nav data is missing, empty, or unexpectedly unavailable, while preserving richer dynamic targets when service data exists. | [A-017 result](results/A-017-search-navigation-discovery.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-147](../tasks/T-147-render-resilient-main-nav-fallbacks.md) | T-147 completed 2026-05-19 |
| F-102 | A-017 | Medium | Resolved | Visible breadcrumbs use mechanical URL segments while content-aware breadcrumbs exist only in JSON-LD. | Resolved by T-155: visible breadcrumbs now read the server-rendered `BreadcrumbList` JSON-LD already emitted on targeted detail pages, preserve route-derived links, avoid client fetching, and suppress raw 24-character ID labels such as `artworkId`. | [A-017 result](results/A-017-search-navigation-discovery.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-155](../tasks/T-155-render-content-aware-visible-breadcrumbs.md) | T-155 completed 2026-05-20 |
| F-103 | A-018 | Medium | Partially mitigated | Collection section taxonomy needs a launch policy and runtime validation at public boundaries. | T-154 mitigated the runtime-validation boundary: public article list `section`, article navigation `[section]`, and collection list `section` inputs now validate against canonical constants before service calls and invalid values return public-safe `400` responses. The owner launch policy for non-`collections` collection sections and any i18n/label direction remain undecided. | [A-018 result](results/A-018-translations-content-taxonomy.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [data/API workstream](../workstreams/data-models-and-api.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-154](../tasks/T-154-validate-public-taxonomy-sections.md) | T-154 completed 2026-05-20 |
| F-104 | A-018, A-020 | Low | Converted | Footer placeholder social links, stale copyright text, and commerce assurance copy need owner-approved cleanup. | A-018 found footer social anchors still use `href="#"` and the footer copyright is fixed at 2024. T-213 added footer legal links to `/privacy` and `/terms`, and T-209 removed unsupported shared-banner commerce assurance copy. T-218 is prepared to remove or hide placeholder social targets and refresh stale copyright text without inventing real social URLs. | F-078, [A-018 result](results/A-018-translations-content-taxonomy.md), [A-020 result](results/A-020-privacy-consent-commerce-compliance.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [content/admin workstream](../workstreams/content-assets-and-admin-ops.md), [T-209](../tasks/T-209-align-commerce-assurance-copy.md), [T-213](../tasks/T-213-add-owner-approved-policy-routes-and-footer-links.md), [T-218](../tasks/T-218-remove-footer-placeholder-social-links.md) | T-218 prepared 2026-05-22 |
| F-105 | A-005 | High | Resolved | Public detail routes need a consistent not-found/error contract. | Resolved by T-199 through T-202: T-199 defined the route-family contract; T-200 implemented standalone and collection-scoped artwork not-found/error handling and shared UI; T-201 implemented article/blog primary-content not-found handling, optional navigation/comment degradation, and route-local UI; and T-202 added Shopify product detail route-local not-found UI while preserving existing missing-product `notFound()` behavior and optional related-content degradation. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [production risks](../risks/production-readiness.md), [T-199](../tasks/T-199-define-public-detail-not-found-contract.md), [T-200](../tasks/T-200-implement-artwork-detail-not-found-contract.md), [T-201](../tasks/T-201-implement-article-blog-detail-not-found-contract.md), [T-202](../tasks/T-202-add-shopify-product-detail-not-found-ui.md) | T-202 completed 2026-05-22 |
| F-106 | A-005 | Medium | Resolved | Home section loaders silently drop sections on failures or empty data. | Resolved by T-203: biography, collections, and blog homepage section loaders now render visible section-preserving unavailable fallbacks for missing service results or non-Next failures, visible empty fallbacks for empty result arrays, and still rethrow Next control-flow errors while preserving successful rendering and service inputs. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [production risks](../risks/production-readiness.md), [T-203](../tasks/T-203-add-visible-home-section-fallback-states.md) | T-203 completed 2026-05-22 |
| F-107 | A-005 | Medium | Resolved | Client browse, filter, and infinite-scroll fetch failures need visible user states. | Resolved by T-204: artwork filter and load-more failures now show visible retryable errors while preserving the current artwork list, shop product filter failures show a visible retryable error while preserving the current grid or empty state, blog continuous-loading failures render a visible retry control while keeping already-rendered posts, and stale errors clear after retry/recovery actions with focused source-hygiene coverage. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [data/API workstream](../workstreams/data-models-and-api.md), [testing workstream](../workstreams/testing-and-quality.md), [production risks](../risks/production-readiness.md), [T-204](../tasks/T-204-add-public-browsing-client-fetch-error-states.md) | T-204 completed 2026-05-22 |
| F-108 | A-005 | Medium | Resolved | Mixed component barrels remain in server callers despite the current client graph guard passing. | Resolved by T-205: remaining scoped server route/loader value imports from `@/components/sections`, `@/components/views`, and `@/components/loaders/viewLoaders` were replaced with direct file imports; matching focused tests were updated; and `clientServerImportBoundary.test.ts` now includes a source-hygiene assertion that guards `src/app` and `src/components/loaders` against reintroducing those mixed barrel value imports. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [architecture workstream](../workstreams/architecture-refactor-and-code-health.md), [production risks](../risks/production-readiness.md), [T-205](../tasks/T-205-replace-mixed-component-barrel-imports.md) | T-205 completed 2026-05-22 |
| F-109 | A-005 | Medium | Resolved | Account subnav is preserved by loader/tests but not mounted in the account layout. | Resolved by T-206: `src/app/account/layout.tsx` now actively renders `AccountSubnavLoader` inside `Suspense` with `SubnavSkeleton` fallback before account route content, the old commented-out mount is gone, and layout-level coverage proves the mount stays active while existing loader tests preserve link and no-self-fetch behavior. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [auth workstream](../workstreams/auth-admin-and-permissions.md), [testing workstream](../workstreams/testing-and-quality.md), [T-206](../tasks/T-206-restore-account-subnav-mount.md) | T-206 completed 2026-05-22 |
| F-110 | A-005 | Low | Converted | Route loading states need a documented public-route fallback pattern. | A-005 found only root and admin-feed App Router loading files, route-specific public Suspense fallbacks with mixed patterns, an inline `Loading...` fallback on `/project/aims`, and JSON-LD Suspense boundaries with `fallback={null}`. T-207 captures this work but is explicitly deferred behind higher-value commerce, search, compliance, monitoring, and asset-lifecycle work. | [A-005 result](results/A-005-frontend-routes-components.md), [frontend workstream](../workstreams/frontend-routes-and-components.md), [testing workstream](../workstreams/testing-and-quality.md), [T-207](../tasks/T-207-document-route-fallback-patterns.md) | T-207 deferred 2026-05-22 |

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
unauthenticated route checks. At that point, runtime and Vercel project-setting
pins remained open under F-064/R-028.

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

2026-05-15: T-052 resolved the focused F-041 public artwork image contract
drift. Public artwork transforms now sanitize nested Cloudinary image DTOs,
omit `image.public_id`, keep `similarityScore` as optional public-only metadata
for color-proximity results, and validate persisted color arrays as strict
`{ color, percentage }` objects. Broader Cloudinary upload policy, Shopify
product ID/admin-linking, global logging policy, and the F-039 field matrix
remain separate.

2026-05-15: T-053 was prepared as the documentation-first F-039 field contract
matrix for article `section`, blog `imageUrl`/`pinned`/`tags`, and user
`password`. Runtime model/schema/type/auth/form alignment remains separate
until the matrix records concrete recommendations and follow-up tasks.

2026-05-15: T-053 created
[data-field-contracts.md](../architecture/data-field-contracts.md), recording
the authoritative F-039 contracts and follow-up candidates for article
`section`, blog `imageUrl`/`pinned`/`tags`, and user `password`. F-039 remains
open because no runtime model/schema/type/auth/form alignment was implemented.

2026-05-15: T-054 was prepared as the first F-039 runtime alignment slice. It
targets article `section` by deriving admin article filter options from
`ARTICLE_SECTION_OPTIONS` and adding focused regression coverage that
`"collections"` remains invalid for article sections while collection routes
remain separate.

2026-05-15: T-054 completed the article `section` runtime alignment slice.
Admin article filter section options now derive from
`ARTICLE_SECTION_OPTIONS`, focused tests prove create/update article schemas
reject `section: "collections"`, and collection route/search behavior stayed
out of scope. F-039 remains open for the blog `imageUrl`/`pinned`/`tags` and
user `password` follow-up slices.

2026-05-15: T-055 was prepared as the next F-039 runtime alignment slice. It
targets blog `imageUrl`, `pinned`, and `tags` model/schema/admin route
contracts while leaving visible admin workflow controls, public blog filtering,
and user `password` credentials/OAuth behavior separate.

2026-05-15: T-055 completed the blog `imageUrl`/`pinned`/`tags` runtime
alignment slice. Blog persistence now requires `imageUrl` and defaults `tags`
to `[]`; admin blog route schemas accept/default create `pinned` and `tags`,
accept optional update replacements, reject invalid tags before blog
reads/writes, and persist only parsed allowlisted fields. Existing visible admin
blog forms, public filtering semantics, and user `password` behavior stayed out
of scope. At that point, the user `password` credentials/OAuth slice still
remained for T-056.

2026-05-15: T-056 was prepared as the remaining F-039 runtime alignment slice.
It targets optional persisted user password typing and credentials/OAuth
authentication behavior while preserving credentials registration/login password
requirements, public/own password sanitization, and leaving password setup or
account-linking workflows separate.

2026-05-15: T-056 completed the remaining scoped F-039 runtime alignment slice.
`UserBase.password` is optional to match OAuth-created persisted users,
credentials authentication fails closed before bcrypt verification when a user
has no stored hash, hashed credentials users still authorize with persisted
roles, and public/own user DTOs continue omitting `password`. The scoped
article/blog/user F-039 matrix is resolved; future required/optional drift
outside that matrix should be tracked separately.

2026-05-15: T-057 was prepared as a focused F-012 Shopify product ID
normalization slice. It targets shared numeric product ID validation/GID
construction for public single-product and product-listing reads while leaving
admin product-linking workflow, existing-data migration, checkout/cart, product
transforms, sorting, and pagination separate.

2026-05-15: T-057 partially mitigated F-012 by centralizing public Shopify
product ID normalization and GID construction, preserving invalid path-ID
`400`s before Shopify work, and skipping malformed stored listing IDs before
Shopify fan-out. Admin product-linking validation and existing-data
audit/migration remain open.

2026-05-15: T-058 was prepared as the next F-012 existing-data step. It adds a
read-only audit for persisted artwork `shopifyProducts` links so invalid IDs,
duplicates, unknown product types, and migration needs can be reported before
any mutation or admin-linking workflow is assigned.

2026-05-15: T-058 partially mitigated F-012 by adding
`npm run audit:shopify-products`, a read-only MongoDB audit over artwork `_id`,
`title`, and `shopifyProducts`. The command reports invalid product IDs,
unknown product types, within-artwork duplicates, and cross-artwork duplicates
without data mutation or Shopify API calls. Live audit execution, admin write
validation, and data migration remain open.

2026-05-15: T-059 was prepared to run the T-058 audit against the
owner-approved MongoDB environment and record the resulting Shopify product-link
evidence in the A-001 Shopify audit result before any cleanup, migration, or
admin-write validation task is assigned.

2026-05-15: T-059 was attempted, but the task shell had no `MONGO_URI`.
`npm run audit:shopify-products` exited `1` before connecting to MongoDB with
the missing-environment message. Existing-data audit evidence is still
incomplete; the next action is to obtain the owner-approved MongoDB target and
rerun the read-only audit.

2026-05-17: T-059 completed against the owner-approved MongoDB Atlas
`laoutarisDB` target. The approved-network run of
`npm run audit:shopify-products` exited `0` after scanning 215 artworks,
including 92 artworks with Shopify links and 99 total Shopify links. It found 0
invalid product IDs, 0 unknown product types, and 0 within-artwork duplicates.
It reported one review-only cross-artwork duplicate group:
`type=book`, `productId=10538937319688`, `artworkCount=92`, and `linkCount=92`.
No current data cleanup or product-ID migration is indicated by this evidence.
T-082 is prepared to confirm the shared book-link policy and harden admin
product-link validation.

2026-05-17: T-082 partially mitigated F-010 and resolved F-012. Admin artwork
create/update route validation now accepts only canonical `shopifyProducts`
links with trimmed numeric product IDs, known product types, and no
within-artwork duplicate product IDs. The shared book-link policy is recorded:
cross-artwork book product duplicates are allowed when the book legitimately
features those artworks. The visible admin UI workflow for adding/removing
links remained open under F-010/R-021 until T-097 completed it.

2026-05-16: T-060 was prepared as the first focused F-013 shop UI alignment
slice. It removes visible colour/dimension filters and hard-coded pagination
controls that are not backed by public shop API behavior while preserving backed
filters, product-type checkboxes, result count, and sort controls. F-013 remains
open for title-keyword product type sorting and any future real pagination or
sorting contract work.

2026-05-16: T-060 partially mitigated F-013 by removing the unsupported public
shop colour/dimension filters, removing fake pagination controls, removing
stale client-only colour/dimension state, and adding focused component tests for
the removed and preserved controls. F-013 remains open for title-keyword product
type sorting and any future real pagination or sorting contract work.

2026-05-16: T-061 was prepared as the next focused F-013/F-014 shop slice. It
targets the title-keyword product type sorting gap by carrying Shopify
`productType` and `tags` through product DTOs and using explicit metadata for
default shop type sorting while leaving variant/checkout fields, real
pagination, and admin product-linking separate.

2026-05-16: T-061 partially mitigated F-013 and F-014 by adding
`productType` and `tags` to `SimpleProduct`, preserving those fields in Shopify
list/handle/ID transforms, and making default shop type sorting use normalized
`productType` metadata without title fallback. Future real pagination,
server-side sorting contracts, variant/checkout fields, description HTML, and
admin product-linking remain separate.

2026-05-16: T-062 was prepared as the next focused F-014 Shopify transform
slice. It targets variant metadata already queried from Shopify by preserving
variant IDs, titles, availability, prices, compare-at prices, and variant images
in product DTOs while leaving checkout/cart behavior, product-detail CTA
changes, description HTML, real pagination, and admin product-linking separate.

2026-05-16: T-062 partially mitigated F-014 by adding
`SimpleProduct.variants` and preserving queried variant IDs, titles,
availability, price money, compare-at price money, and optional variant image
URL/alt text across Shopify list, handle, and ID transforms. Checkout/cart
ownership, line-item behavior, visible variant selection, description HTML,
pagination, and admin product-linking remain separate.

2026-05-16: T-063 was prepared as the next focused F-014 Shopify transform
slice. It targets queried `descriptionHtml` preservation in product DTOs while
leaving rich HTML rendering, sanitization policy, product-detail UI,
checkout/cart, real pagination, and admin product-linking separate.

2026-05-16: T-063 partially mitigated F-014 by adding
`SimpleProduct.descriptionHtml` and preserving queried Shopify
`descriptionHtml` across list, handle, and ID transforms. Plain `description`,
product metadata, variant metadata, product-detail UI, checkout/cart, and
variant selection remained unchanged. Rich HTML rendering and sanitization
policy remain separate.

2026-05-16: T-064 partially mitigated F-064 by committing the npm package
manager pin, Node 22 runtime policy, root Node version files, npm engine
enforcement, lockfile metadata, and `npm ci` setup/deployment/testing docs. The
slice leaves CI/dependency-update automation, Vercel project settings, and the
residual Next/PostCSS owner decision separate.

2026-05-16: T-065 completed the next F-047 deployment-environment slice. It
updated the environment runbook from source-search evidence and prior A-007
context without reading local `.env` files, recording secret values, changing
runtime config, or deciding credential rotation. F-047 is partially mitigated:
the inventory is documented, while owner-managed cleanup and credential
rotation decisions remain separate.

2026-05-16: T-066 was prepared as the next F-044/F-054 Cloudinary
upload-security slice. It targets an explicit signing-param allowlist for the
current admin upload widget while leaving upload preset ownership, folder
policy, asset lifecycle, credential rotation, and broader Cloudinary operations
separate.

2026-05-16: T-066 completed the F-044/F-054 allowed signing params slice. The
Cloudinary signing route now signs only `timestamp`, exact
`upload_preset: "laoutaris_art"`, and exact `source: "uw"` for the current
admin widget, with focused tests covering accepted params, unknown params,
invalid allowed-param shapes, auth/body-shape/missing-secret, and success
contracts. Upload preset ownership, folder policy, and asset lifecycle remain
open under F-044/R-008 at this point; T-101 later documented the interim
lifecycle and upload ownership policy while leaving runtime cleanup and signed
folder implementation separate.

2026-05-16: T-067 completed the focused F-020/R-019 upload-widget cleanup
slice. `src/components/elements/buttons/UploadButton.tsx` no longer has direct
debug logging, Cloudinary availability polling, or DOM/iframe inspection, and
focused tests preserve current widget props, loading/open behavior, and success
forwarding. Global logging/redaction policy and broader Cloudinary upload
policy remain separate.

2026-05-16: T-068 was prepared as the next focused F-020/R-019 cleanup slice.
It targets direct public shop `console.log` debug output in the products route,
gallery, and loader while leaving same-app HTTP migration, pagination,
checkout/cart, admin linking, and global logging/redaction policy separate.

2026-05-16: T-068 completed the focused F-020/R-019 public shop cleanup slice.
`src/app/api/v2/public/shop/products/route.ts`,
`src/components/compositions/ShopProductGallery.tsx`, and
`src/components/loaders/viewLoaders/ShopProductsLoader.tsx` no longer contain
direct `console.log` debug output, the loader no longer tells public users to
check the console, and focused source/API/component/loader tests preserve the
existing shop behavior. Same-app HTTP migration, pagination, checkout/cart,
admin linking, broader commerce noise, and global logging/redaction policy
remain separate.

2026-05-16: T-069 was prepared as the next focused F-020/R-019 cleanup slice.
It targets direct request/URL/response debug logging in `createFetcher` and URL
construction debug logs in the server public/user/admin API helpers while
leaving ADR 0004 same-app HTTP migrations, base URL policy, Next `headers()`,
and global logging/redaction policy separate.

2026-05-16: T-069 completed the focused F-020/R-019 shared fetcher cleanup
slice. `src/lib/api/core/createFetcher.ts`,
`src/lib/api/public/serverPublicApi.ts`,
`src/lib/api/user/serverUserApi.ts`, and
`src/lib/api/admin/serverAdminApi.ts` no longer contain direct `console.log`
debug output or stale commented URL-construction debug blocks, and focused
source hygiene plus fetcher behavior tests preserve the existing fetch
contract. ADR 0004 same-app HTTP migrations, base URL policy, Next
`headers()`, remaining build/DB/SSR noise, and global logging/redaction policy
remain separate.

2026-05-16: T-070 was prepared as the next focused F-021/ADR 0004 migration.
It targets `CollectionsSubnavLoader` by sharing collection navigation data
access with `GET /api/v2/public/navigation/collections` while preserving route
and UI contracts.

2026-05-16: T-070 completed the focused F-021/ADR 0004 collection navigation
slice. `CollectionsSubnavLoader` and
`GET /api/v2/public/navigation/collections` now share
`getCollectionNavigationList`, preserving route envelopes, no-results behavior,
and rendered subnav links.

2026-05-16: T-071 completed the focused F-021/ADR 0004 article navigation
slice. `BiographySubnavLoader`, `MainNavLoader`, and
`GET /api/v2/public/navigation/articles/[section]` now share
`getArticleNavigationList`, and `MainNavLoader` reuses
`getCollectionNavigationList` for the collections link. Route envelopes,
no-results behavior, public-safe failures, and rendered navigation link formats
were preserved.

2026-05-16: T-072 completed the current article-navigation cleanup by moving
`src/app/biography/page.tsx` and the navigation path in `ArticleLoader` to
`getArticleNavigationList`. Article detail service extraction, collection
redirect pages, blog loaders, root-layout ownership, and cache policy remain
separate.

2026-05-16: T-073 completed the collection redirect page migration.
`/collections` now uses `getCollectionNavigationList`, `/collections/[slug]`
and `GET /api/v2/public/navigation/collections/[slug]` now use
`getCollectionNavigationItem`, and the slug redirect page debug
`console.log` was removed. Collection artworks navigation, collection detail
pages, blog loaders, root-layout ownership, and cache policy remain separate.

2026-05-16: T-074 was prepared to move `ArticleLoader` populated article detail
data off same-app HTTP by sharing article detail data access with
`GET /api/v2/public/article/[slug]`. Blog loaders, blog detail service
extraction, article list routes, collection detail pages, root-layout
ownership, and cache policy remain separate.

2026-05-16: T-074 completed the populated article detail migration.
`ArticleLoader` and `GET /api/v2/public/article/[slug]` now share
`getArticleBySlugPopulated`; the route preserves its optional session lookup
and response envelopes, and the loader preserves `ArticleView` props plus
previous/next navigation behavior. Blog loaders, blog detail service
extraction, article list routes, collection detail pages, root-layout
ownership, and cache policy remain separate.

2026-05-16: T-075 was prepared to move `BlogDetailLoader` off same-app HTTP by
sharing service logic with the public blog detail routes. Blog list/section
loaders, comment mutation behavior, route URL/base URL policy, root-layout
ownership, and cache policy remain separate.

2026-05-16: T-075 completed the blog detail migration. `BlogDetailLoader`,
`GET /api/v2/public/blog/[slug]`, and
`GET /api/v2/public/blog/[slug]/comments` now share
`getBlogBySlugWithAuthor` and `getBlogBySlugWithComments`; both route
contracts and both `showComments` loader modes are preserved, and the loader's
direct result debug logs are removed. Blog list/section loaders, comment
mutation behavior, route URL/base URL policy, root-layout ownership, and cache
policy remain separate.

2026-05-16: T-076 was prepared to move `BlogListLoader` and
`BlogSectionLoader` off same-app HTTP by sharing blog list service logic with
`GET /api/v2/public/blog`. Blog detail/comment behavior, unrelated loaders,
route URL/base URL policy, root-layout ownership, cache policy, and global
logging/redaction policy remain separate.

2026-05-16: T-076 completed the blog list/section loader migration.
`getBlogList` now owns public blog list DB connection setup, current
sort/filter behavior, pagination, transform, and metadata;
`GET /api/v2/public/blog`, `BlogListLoader`, and `BlogSectionLoader` share it.
The two loaders no longer use same-app HTTP for blog lists, and the public blog
list route's touched MongoDB query `console.log` was removed. Focused
service/API/loader tests, lint, build, and `git diff --check` passed.

2026-05-16: T-077 was prepared to move `ArtworkLoader` off same-app HTTP by
reusing the existing `getArtworkById` service that already backs
`GET /api/v2/public/artwork/[id]`. Collection artwork routes/loaders,
account/user loaders, shop loaders, route URL/base URL policy, root-layout
ownership, cache policy, and global logging/redaction policy remain separate.

2026-05-16: T-077 completed the artwork detail loader migration.
`ArtworkLoader` now reads optional user context with `getUserIdFromSession()`
and calls `getArtworkById(params.id, userId)` directly. It no longer imports
`serverApi`, uses the debug `delay`, or emits direct artwork load result logs.
Focused loader/service/API tests, lint, build, and `git diff --check` passed.

2026-05-16: T-078 was prepared to move `CollectionArtworkLoader` and
`CollectionArtworksPaginationLoader` off same-app HTTP by sharing collection
artwork service logic with the public collection artwork routes. Keep
`CollectionSectionLoader`, collection list/detail pages, account/user loaders,
shop loaders, route URL/base URL policy, root-layout ownership, cache policy,
and global logging/redaction policy separate.

2026-05-16: T-078 completed the collection artwork loader service migration.
`getCollectionWithArtworks` now owns the transformed populated collection
artwork list query, and `getCollectionArtwork` now owns the selected
artwork-in-collection lookup while preserving the public route's current
success data shape. `CollectionArtworkLoader`,
`CollectionArtworksPaginationLoader`, and the two public collection artwork
routes share those services; the loaders no longer use same-app HTTP for
collection artwork reads. Focused service/API/loader tests, no-self-fetch
source checks, lint, build, and `git diff --check` passed.

2026-05-16: T-079 was prepared to move `BiographySectionLoader` off same-app
HTTP by sharing article list service logic with `GET /api/v2/public/article`.
Keep `CollectionSectionLoader`, article detail/navigation routes, account/shop
loaders, route URL/base URL policy, root-layout ownership, cache policy, and
global logging/redaction policy separate.

2026-05-16: T-079 completed the biography section loader service migration.
`getArticleList` now owns the public article list query, optional section and
field selection, pagination, transform, metadata, no-results service behavior,
and DB connection setup. `BiographySectionLoader` and
`GET /api/v2/public/article` share that service; the loader no longer uses
same-app HTTP, and the route preserves its current success, no-results, and
public-safe `500` bodies while removing touched direct debug logs.

2026-05-16: T-080 was prepared to move `CollectionSectionLoader` off same-app
HTTP by sharing collection list service logic with
`GET /api/v2/public/collection`. Keep collection detail/artwork/navigation
routes, account/user loaders, shop loaders, route URL/base URL policy,
root-layout ownership, cache policy, and global logging/redaction policy
separate.

2026-05-16: T-080 completed the collection section loader service migration.
`getCollectionList` now owns the public collection list query, optional section
filter, pagination, transform, metadata, missing-list service behavior,
empty-array success semantics, and DB connection setup.
`CollectionSectionLoader` and `GET /api/v2/public/collection` share that
service; the loader no longer uses same-app HTTP, and the route preserves its
current success, missing-list, and public-safe `500` bodies.

2026-05-17: T-081 was prepared to move `AccountSubnavLoader` off same-app HTTP
by sharing account navigation service logic with
`GET /api/v2/user/navigation`. Keep favourites/watchlist loaders, user
comments/settings loaders, shop loaders, middleware/global auth policy,
root-layout ownership, cache policy, and global logging/redaction policy
separate.

2026-05-17: T-081 completed the account subnav loader service migration.
`getOwnUserNavigation` now owns the user account navigation query, selected
`favourites`/`watchlist`/`comments` fields, transform, missing-user service
behavior, and DB connection setup. `AccountSubnavLoader` and
`GET /api/v2/user/navigation` share that service; the loader no longer uses
same-app HTTP, and the route preserves its `requireApiUser()` guard, success
envelope, user-missing `404`, and public-safe `500` body.

2026-05-17: T-083 completed the account saved-artwork loader service
migration. `getOwnSavedArtwork` now owns current-user favourites/watchlist list
and detail reads, selected/populated user saved-item fields, artwork detail
lookup, user-aware saved-state transforms, list metadata, missing-user,
missing-artwork, and not-saved service behavior. The four account
favourites/watchlist loaders and four protected user saved-artwork read routes
share those services; the loaders no longer use same-app HTTP, and the routes
preserve their `requireApiUser()` guard, success envelopes, saved-list
metadata, `404`s, and public-safe `500` bodies.

2026-05-17: T-084 completed the account profile/comment read-loader service
migration. `getOwnUserProfile` now owns current-user profile DB connection
setup, password exclusion, and own-user frontend DTO transformation.
`getOwnUserComments` now owns current-user populated comment reads, transformed
comment DTOs, list metadata, missing-user service behavior, and DB connection
setup. `UserSettingsLoader`, `UserCommentsLoader`,
`GET /api/v2/user/profile`, and `GET /api/v2/user/comment` share those
services; the loaders no longer use same-app HTTP, and the routes preserve
their `requireApiUser()` guard, success envelopes, failure statuses, comment
metadata, and public-safe `500` bodies.

2026-05-17: T-085 completed the public shop products read-loader service
migration. `getShopProductList` now owns the MongoDB artwork filter,
`shopifyProducts` extraction, product-type filtering, numeric Shopify product
ID normalization/skipping, product ID deduplication, Shopify fan-out,
per-product fetch failure skipping, metadata construction, and DB connection
setup. `ShopProductsLoader` and `GET /api/v2/public/shop/products` share that
service; the loader no longer reads `NEXT_PUBLIC_BASE_URL`, falls back to
localhost, or calls same-app `fetch()` for initial products, and the route
 preserves validation `400`s plus public-safe `500`s.

2026-05-17: T-086 completed the hard-coded localhost navigation URL cleanup.
`LogoutForm` now navigates home with `/`, `MobileNavDrawer` now uses
`/api/auth/signin` for its current Sign Up and Log In account links, and
`src/app/project/page.tsx` now redirects to `/project/about` without
`VERCEL_URL` or localhost origin construction. The environment runbook now
records `NEXT_PUBLIC_BASE_URL` as deprecated current-source configuration after
T-085 and notes that `VERCEL_URL` no longer owns the `/project` redirect.

2026-05-17: T-087 completed retired server API wrapper cleanup. The stale
account favourites `serverApi` import/commented self-fetch block was removed,
the server-side same-app wrapper entrypoints were deleted, active source has no
retired wrapper imports, and `src/lib/api` no longer contains
`VERCEL_ENV`/`VERCEL_URL`/localhost same-app server URL construction. The
environment runbook now records `VERCEL_ENV` and `VERCEL_URL` as not required
by current source.

2026-05-17: T-090 completed the focused F-020/R-019 user-facing client/page
debug-log cleanup. `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`,
`EnquiryForm`, `SubscribeSectionLoader`, the account favourite artwork page,
and `CollectionViewPagination` no longer contain direct `console.log()` calls
or the retired scoped debug strings, and focused source-hygiene coverage
prevents those logs from returning. Route-level API error logging, admin
dashboard logs, and broader production logging/redaction policy remain
separate.

2026-05-17: T-091 was prepared as the next focused F-020/R-019 admin dashboard
form/filter debug-log cleanup. It targets direct `console.log()` output in the
scoped admin create/update form and artwork-filter components while keeping
admin read-list copy logs, shared helpers, route-level API error logging, and
global logging/redaction policy separate.

2026-05-17: T-091 completed the focused F-020/R-019 admin dashboard
form/filter debug-log cleanup. The scoped admin create/update form and artwork
filter dropdown files no longer contain direct `console.log()` calls, focused
source-hygiene coverage prevents those logs from returning, and admin read-list
copy logs, shared helpers, route-level API error logging, and broader
production logging/redaction policy remain separate.

2026-05-17: T-092 was prepared as the next focused F-020/R-019 admin
read/copy debug-log cleanup. It targets success-path `console.log()` output in
scoped admin read-list copy flows, `ArtworkFeedCard`, and the shared
`copy_id()` helper while keeping clipboard failure logging, public artwork
fetcher logs, test-session override logs, shared UI click logs, route-level API
logging, and global logging/redaction policy separate.

2026-05-17: T-092 completed the focused F-020/R-019 admin read/copy debug-log
cleanup. The scoped admin read-list copy flows, `ArtworkFeedCard`,
`ReadArtworkList`, and shared `copy_id()` helper no longer contain direct
success-path `console.log()` output, helper success tests assert clipboard
behavior without success logging, and focused source-hygiene coverage prevents
those direct logs from returning. Public artwork fetcher logs, shared UI click
logs, test-session override logs, route-level API logging, and broader
production logging/redaction policy remain separate.

2026-05-17: T-093 was prepared as the next focused F-020/R-019 shared
UI/public fetcher debug-log cleanup. It targets direct `console.log()` output
in `Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`, and the public
artwork fetcher while keeping `getUserFromSession` development test-header
logs, commented-out debug logs later handled by T-095, route-level API logging,
and global logging/redaction policy separate.

2026-05-17: T-093 completed the focused F-020/R-019 shared UI/public fetcher
debug-log cleanup. `Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`, and
the public artwork fetcher no longer contain direct `console.log()` calls;
focused source hygiene prevents those logs from returning, and public artwork
fetcher tests cover default, repeated-filter, color-sort, and pagination URL
construction.

2026-05-17: T-094 was prepared as the next focused F-020/R-019 auth/session
helper debug-log cleanup. It targets the remaining active direct
`console.log()` output in `getUserFromSession` development test-header paths
while preserving test-header override behavior and keeping commented-out debug
lines later handled by T-095, route-level API logging, and global
logging/redaction policy separate.

2026-05-17: T-094 completed the focused F-020/R-019 auth/session helper
debug-log cleanup. `getUserFromSession` no longer contains active direct
`console.log()` output in development test-header paths, focused tests cover
persisted test-user lookup, missing/failing lookup fallback, test-admin
override, normal NextAuth fallback, delegated helper behavior, and source
hygiene. T-095 later handled the commented-out debug lines; route-level API
logging and broader production logging/redaction policy remain separate.

2026-05-17: T-095 was prepared as the final `console.log()` source-hygiene
cleanup slice. It targets stale commented-out debug snippets so
`rg -n "console\\.log\\(" src` returns no matches, while keeping route-level
API logging, `console.error()` handling, and broader production
logging/redaction policy separate.

2026-05-17: T-095 completed the final `console.log()` source-hygiene cleanup
slice. The scoped stale commented debug snippets are removed, the full-source
`rg -n "console\\.log\\(" src` search returns no matches, and focused
full-source source-hygiene coverage prevents direct or commented
`console.log()` calls from returning under `src`.

2026-05-17: T-096 was prepared as the first focused F-052/R-004 implementation
slice after the logging cleanup stream. It targets the invalid global API
wildcard credential CORS pairing, wildcard allowed headers, and missing
baseline hardening headers/CSP directives while leaving full strict CSP
allowlisting, dynamic CORS, HSTS, monitoring, Cloudinary lifecycle, and global
logging policy separate.

2026-05-17: T-096 completed the first focused F-052/R-004 baseline hardening
slice. `next.config.mjs` no longer defines global API CORS headers, removing
the invalid wildcard-origin plus credential pairing and wildcard allowed request
headers. It now sends `X-Content-Type-Options`, `Referrer-Policy`,
conservative `Permissions-Policy`, and CSP `object-src`, `base-uri`,
`form-action`, and `frame-ancestors` directives while preserving current
Cloudinary, Shopify CDN, YouTube, image, font, media, and connection
allowances. Full strict CSP allowlisting, HSTS, route-level dynamic CORS, CSP
reporting, monitoring, Cloudinary lifecycle, and global logging policy remain
separate.

2026-05-17: T-097 was prepared as the next larger F-010/R-021 implementation
slice. It bundles visible admin artwork form controls for Shopify product
links, shared form-schema wiring, focused tests, and operator documentation so
the remaining admin product-link workflow gap can close in one assignment.

2026-05-17: T-097 completed the F-010/R-021 admin Shopify product-link workflow
slice. Admin artwork create/update forms now expose reusable product-link
controls, shared form-schema validation trims and rejects malformed or duplicate
links before API submission, update forms initialize from existing links, and
submitting an empty update array clears all product links. Route validation from
T-082 remains authoritative.

2026-05-17: T-098 was prepared as a follow-up Shopify/admin hardening task.
It does not reopen F-010/R-021; it adds optional product-existence
verification UX so operators can check linked Shopify product IDs before
saving without making Shopify availability a persistence dependency.

2026-05-18: Reconciled completed audits A-009, A-020, and A-021 into this
register, production risks, workstream backlogs, and the Cloudinary runbook.
New findings F-067 through F-083 cover Cloudinary lifecycle/ownership,
privacy/consent/commerce compliance, and observability/incident-response
follow-ups. No runtime implementation was performed by this reconciliation.

2026-05-18: T-099 partially mitigated F-081 by adding request ID
generation/propagation, structured redacted API logging, optional public
`requestId`/`X-Request-Id` helper support, and representative public/user/admin
failure-path migration. T-100 partially mitigated F-076 by preserving product
context in public enquiry submissions and resolved F-079 by removing the stale
Shopify credential TODO. T-101 partially mitigated F-067/F-068 by documenting
the interim Cloudinary lifecycle and upload ownership policy before runtime
cleanup, signed folder params, or image-host changes.

2026-05-18: Reconciled completed A-010 into F-084 through F-090, production
risks, and frontend/shopify/content/deployment workstream backlogs. The highest
priority follow-ups are public route rendering/cache ownership, production
metadata/discovery output, and accessible public search/navigation controls. No
runtime implementation was performed by this reconciliation.

2026-05-19: Reconciled completed A-011, A-017, and A-018 into new findings
F-091 through F-104, existing finding updates for F-013, F-023, F-033, and
F-049, production risks, relevant workstream backlogs, and ready task briefs
T-141, T-142, and T-143. The next highest-confidence runtime slice is T-141
admin user deletion protection. T-139 remains blocked on the monitoring
provider/no-provider owner decision. No runtime implementation was performed by
this reconciliation.

2026-05-18: T-102 partially mitigated F-084 by removing global root-layout
DB/session work, short-circuiting public middleware before token parsing,
adding focused boundary tests, and documenting remaining route-local dynamic
blockers from build output.

2026-05-18: T-103 partially mitigated F-085 by replacing scaffolded root
metadata, adding baseline crawler rules and a stable public-route sitemap, and
covering the discovery contract with focused tests. Route-specific metadata and
structured data remain open.

2026-05-18: T-106 further mitigated F-085 by adding route-specific metadata,
canonical/social previews, and conservative `Article`/`BlogPosting` JSON-LD for
public biography article and blog detail pages. Artwork/product detail metadata,
breadcrumb/product/artwork structured data, route cache policy, and discovery
smoke automation remain separate.

2026-05-18: T-107 further mitigated F-085 by adding route-specific metadata,
canonical/social previews, and conservative artwork/product JSON-LD for
standalone artwork, collection-scoped artwork, and Shopify product detail pages.
Richer breadcrumb structured data, dynamic-detail sitemap expansion, route
cache policy, and discovery smoke assertions remain open.

2026-05-18: T-112 and T-113 further mitigated F-085 by adding conservative
breadcrumb structured data to high-value public detail pages and expanding
`sitemap()` with best-effort dynamic public detail URLs. T-114 later added
deployed `/robots.txt` and `/sitemap.xml` smoke assertions.

2026-05-18: T-114 resolved F-085 by extending `npm run smoke:public` to check
deployed `/robots.txt` and `/sitemap.xml` status plus minimal safe discovery
content. The remaining build warning from `/sitemap.xml` Shopify lookups is
routed separately through F-026/T-115.

2026-05-18: T-115 further mitigated F-026 by making Shopify Storefront fetches
use a single valid cache policy per environment: `cache: "no-store"` in
development and `next.revalidate: 3600` in production. Build passed without
the prior `/sitemap.xml` Shopify fetch warning. T-116 later resolved the
F-082 incident-response runbook gap.

2026-05-18: T-116 resolved F-082 by adding the durable incident-response
runbook with severity levels, first triage steps, service checks, rollback/
defer/mitigate rules, evidence retention and redaction rules, explicit `TBD`
owner matrix placeholders, and post-incident review/follow-up requirements.
R-019 remains partially mitigated because monitoring/error-reporting
instrumentation, alert automation, broad route logging migration, and
continuous smoke remain separate.

2026-05-18: Prepared T-117 as the next F-081 route migration slice for public
content API internal-failure paths that still use direct route-level
`console.error()` instead of the T-099 request context and structured logger
pattern.

2026-05-18: T-117 further mitigated F-081 by migrating public article, blog,
artwork, and collection API internal-failure paths to request-context
structured logging and public request IDs. Prepared T-118 as the next public
route migration slice for search, navigation, and shop product routes that
still use direct route-level `console.error()`.

2026-05-18: T-118 further mitigated F-081 by migrating public search,
navigation, and shop product API internal/upstream failure paths to
request-context structured logging and public request IDs. Monitoring provider
integration, alert automation, protected/admin route migration, broader route
migration, and direct `console.error()`/`console.warn()` policy remain open.

2026-05-18: Prepared T-119 as the next F-081 route migration slice for
protected user favourite, watchlist, and comment routes that still use direct
route-level `console.error()` instead of the T-099 request context and
structured logger pattern.

2026-05-18: T-119 further mitigated F-081 by migrating protected user
favourite, watchlist, and comment API internal-failure paths to request-context
structured logging and request IDs. Prepared T-120 as the next admin read route
logging migration slice; admin write/delete route migration remains separate.

2026-05-18: T-120 further mitigated F-081 by migrating admin read list/detail
API internal-failure paths to request-context structured logging and request
IDs. Prepared T-121 as the next admin create/update/delete route logging
migration slice; monitoring provider integration and lower-level service/client
logging policy remain separate.

2026-05-18: T-121 further mitigated F-081 by migrating admin create/update/
delete API internal-failure paths to request-context structured logging and
request IDs. T-122 then locked a recursive API-v2 route source-hygiene guard for
direct route-level `console.error()`/`console.warn()` while keeping monitoring
provider integration, alert automation, owner matrix completion, and lower-level
service/client logging policy separate.

2026-05-18: T-123 partially mitigated F-080/R-019 by adding the docs-only
monitoring provider decision and instrumentation plan. Provider/env/alert-owner
decisions are now actionable without installing an SDK or creating
`instrumentation.ts` before owner/platform approval.

2026-05-18: T-124 partially mitigated F-083/R-028 by adding the
`.github/workflows/public-smoke.yml` GitHub Actions workflow for
unauthenticated manual and scheduled public smoke checks. Manual runs require a
`base_url` input, scheduled runs use non-secret repository variable
`SMOKE_BASE_URL`, and optional detail inputs remain non-secret repository
variables. Credential/admin smoke, Vercel log inspection, provider alerting,
and rollback automation remain separate.

2026-05-18: T-125 completed the lower-level service/client logging policy and
inventory task for F-081/R-019. It added the logging/redaction architecture
policy, recorded 86 direct non-route `console.error()`/`console.warn()` calls
across 66 files, defined request-context and redaction expectations, and
prepared T-126 as the first public loader/page implementation slice.

2026-05-18: T-126 further mitigated F-081/R-019 by adding a requestless
server-only structured logger and migrating the scoped public server loader and
App Router page failure paths from direct `console.error()` calls to redacted
structured events. Focused source hygiene now guards that slice; remaining
non-route logging work covers provider/data services, server actions/session
helpers, public/account client components, admin dashboard clients, shared
fetcher/client reporting, and utility/helper warnings.

2026-05-18: T-127 further mitigated F-081/R-019 by migrating the scoped Shopify
provider/data service failure paths in `shopifyClient`,
`getArtworkShopProducts`, and `getShopProductList` to requestless structured
server logging. Focused source hygiene guards the slice; remaining non-route
logging work covers server actions/session helpers, public/account client
components, admin dashboard clients, shared fetcher/client reporting, and
utility/helper warnings.

2026-05-18: T-128 further mitigated F-081/R-019 by migrating scoped
subscription, favourite, watchlist, and development test-header session-helper
failure logging to structured redacted server events without changing action
return contracts, saved-item mutation/revalidation behavior, normal session
lookup, or development-only test-header semantics. Focused source hygiene now
guards the T-128 file list; remaining non-route logging work covers
public/account client components, admin dashboard clients, the account
saved-artwork loader, shared fetcher/client reporting, and utility/helper
warnings.

2026-05-18: T-129 was prepared as the next F-081/R-019 implementation slice for
the remaining account saved-artwork server loader. It should migrate
`FavouritedArtworkLoader` failure logging to structured redacted server events
without changing account favourite artwork detail fallback UI, saved-artwork
service behavior, or Next.js control-flow error handling.

2026-05-18: T-129 further mitigated F-081/R-019 by migrating
`FavouritedArtworkLoader` recoverable failure logging to requestless structured
server events with coarse status categories and normalized generic errors.
Focused source hygiene guards the T-129 file; remaining non-route logging work
covers public/account client components, admin dashboard clients, shared
fetcher/client reporting, and utility/helper warnings.

2026-05-18: T-130 was prepared as the next F-081/R-019 implementation slice for
public browsing client console-error cleanup across artwork filtering/loading,
blog continuous loading/comments, infinite scroll, and shop product filters.
It should preserve existing UI state, modals, sorting, loading, and fallback
behavior without adding a monitoring provider or client reporting SDK.

2026-05-18: T-130 further mitigated F-081/R-019 by removing direct
`console.error()` calls from the scoped public browsing client files and adding
focused source-hygiene and behavior coverage for infinite-scroll error state,
blog comment failure modals, and shop filter failure fallback. Remaining
non-route logging work covers account/user client forms and navigation,
`CommentCard` owner actions, admin dashboard clients, shared fetcher/client
reporting, `ErrorBoundary`, and utility/helper warnings or copy failures.

2026-05-18: T-131 was prepared as the next F-081/R-019 implementation slice for
account/user client console-error cleanup across contact/comment forms, logout,
account navigation, comment-owner actions, and the client error boundary.

2026-05-18: T-131 further mitigated F-081/R-019 by removing direct
`console.error()` calls from the scoped account/user client files and adding
focused source-hygiene and behavior coverage for contact failure modal/reset
behavior, comment retry state, logout and account-nav failure modal/loading
behavior, comment-card owner edit/delete failure behavior, and error-boundary
fallback behavior. Remaining non-route logging work covers admin dashboard
clients, shared fetcher/client reporting, and utility/helper warnings or copy
failures.

2026-05-18: T-132 was prepared as the next F-081/R-019 implementation slice for
shared fetcher and low-value utility/helper console cleanup before the larger
admin dashboard client cleanup.

2026-05-18: T-132 further mitigated F-081/R-019 by removing direct
`console.error()`/`console.warn()` calls from the scoped shared fetcher,
date/translation utilities, copy helper/card, color icon, and blog sidebar
files. Focused source-hygiene and fallback behavior coverage preserves fetcher
contracts, date/translation fallback strings, copy attempts, unknown-color empty
rendering, and blog sidebar state. Remaining non-route direct
`console.error()`/`console.warn()` cleanup is concentrated in admin dashboard
clients.

2026-05-19: T-133 was prepared as the next F-081/R-019 implementation slice for
the remaining admin dashboard client direct `console.error()` cleanup across
CRUD forms, read lists, operation tabs, feeds, upload handling, and the document
reader.

2026-05-19: T-133 further mitigated F-081/R-019 by removing direct
`console.error()`/`console.warn()` calls from admin dashboard CRUD forms, read
lists, operation tabs, feeds, upload handling, and the document reader. Focused
source hygiene now recursively guards `src/components/features/adminDashboard`;
the known non-route direct console error/warn inventory is clear except the
approved structured logger sink. Monitoring provider integration, alert
automation, owner matrix completion, credentialed/admin smoke, Vercel log
inspection, and provider-backed client reporting remain open.

2026-05-18: T-104 resolved F-088 and mitigated R-031 by converting public
search, drawer, mobile navigation, and unauthenticated artwork intent controls
to labelled semantic buttons.

2026-05-18: T-105 resolved F-062 and mitigated R-015 for the reconciled A-016
scope by converting owner-only comment edit/delete and edit-mode cancel/save
icon actions to labelled non-submit controls with hidden decorative icons.

2026-05-20: T-153, T-154, and T-155 were reconciled after the concurrent
implementation wave. F-096 and F-102 are resolved; F-103 is partially
mitigated because runtime validation is complete while collection-section
launch policy and i18n/label direction remain owner decisions.

2026-05-22: A-005 was reconciled into F-105 through F-110, R-032/R-033, the
frontend workstream backlog, and ready task brief T-199. No runtime
implementation was performed by this reconciliation. T-199 then completed the
documentation-only public detail not-found/error contract. T-200 completed the
standalone and collection-scoped artwork runtime implementation slice, and
T-201 completed the article/blog runtime implementation slice. T-202 was
prepared for the remaining Shopify product detail route-local not-found UI
slice, then completed. F-105 is resolved. T-203 resolved F-106. T-204 resolved
F-107. T-205 resolved F-108. T-206 resolved F-109. T-207 captured F-110 but
was deferred as low-value fallback polish. T-208 completed the hosted Shopify
purchase handoff slice for F-009/R-001, and T-209 resolved the visible shared
commerce assurance copy slice for F-078/R-018. T-210 completed the
MongoDB-backed artwork public-search slice for F-098/R-016. T-211 completed
the Shopify product public-search slice, resolving F-098. T-212 was prepared
as the next R-018 compliance decision-packet task.

Unresolved owner/orchestrator decisions remain:

- First-release checkout scope and product listing source of truth.
- Privacy, cookie, terms, sale, refund, shipping, newsletter consent,
  unsubscribe, account privacy, and comment publication requirements from
  owner/legal review.
- Cloudinary runtime cleanup implementation, upload-result metadata hardening,
  image URL validation/migration, delivery transformation centralization, and
  any owner decision to change preset/cloud/folder configuration.
- Monitoring/error-reporting provider choice, incident-response ownership,
  alert owner matrix, and smoke automation cadence.
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
