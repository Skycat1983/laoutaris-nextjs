# Current Orchestration State

Last updated: 2026-05-26

## Current Priority

T-262 through T-292 are complete. A-026 through A-028 and A-030 through A-035
are completed in their result files; A-025 and A-029 remain superseded. T-267
reconciled the recalibration findings into F-123 through F-146, R-034 through
R-038, relevant workstream handoffs, and the task/orchestration trackers. T-274
created the
owner-facing production-ops decision packet, but monitoring, incident-role,
Vercel-operator, smoke-account, public-smoke variable, and policy decisions
remain owner-blocked. T-281, T-283, and T-284 resolved the current shop
import-boundary regression and the remaining F-146 build-time live-read
surfaces. T-282 then rebaselined local verification: full Jest, build, lint, and
whitespace passed under the pinned runtime; explicit TypeScript `noEmit` failed
only on the T-285 lazy MongoDB client test `NODE_ENV` typing regression. T-285
fixed that final typecheck regression, and T-286 added repo-owned
`npm run typecheck` and `npm run verify:local` commands for the local gate.
T-287 selected a staged CI policy, and T-288 added the non-secret Main CI
local-gate workflow for PRs to `main`, pushes to `main`, and manual dispatch
without adding public smoke, secrets, Vercel operations, rollback automation, or
monitoring. T-289 resolved F-141 with focused OAuth/provider-shaped role/session
callback coverage. T-290 completed the `src/lib/session` helper inventory and
T-291 resolved F-142 by deleting the unused legacy session/admin helpers and
stale test-only references while preserving the active session/admin guards.
T-194 completed targeted `/prototype/frame` visual QA and found the desktop
room/material/modal direction usable for internal review, but narrow/mobile room
and modal previews cropped the framed object. T-292 fixed those responsive
blockers, making `/prototype/frame` owner-review-ready for the scoped frame,
room, and modal review while product-page rail adoption remains paused. T-293
is the next prepared agent-actionable task: a narrow live sale-gallery visual
QA pass for T-261 using named print, original artwork, and book handles.

The prepared implementation waves after A-011, A-017, and A-018 are complete:
T-134, T-135, T-136, T-137, T-138, T-140, T-141, T-142, and T-144 through
T-186 are done and reconciled. F-070, F-095, F-096, F-102, and F-092 are
resolved. F-095 is resolved after T-174 through T-182 because all six main
admin read tabs now consume route-backed pagination metadata, normal
article/artwork/blog/collection maintenance has direct Update/Delete handoff,
and comment/user cards can hand off to the guarded delete flow. T-183 then
removed the duplicated pagination-control code from those read tabs without
changing behavior. F-103 is partially mitigated because runtime validation is
complete while collection section launch policy remains an owner decision.

T-157 through T-162 are complete. `/prototype/home` now has the isolated
full-width prototype route plus image-guided biography, blog, and shop teaser
sections backed by real data. T-161 added the style-system audit without
runtime changes. T-162 recorded visual QA and owner-decision notes before
production migration. T-166 and T-167 widened the prototype review canvas and
rebalanced the biography, blog, and shop sections. T-168 marked the expanded
prototype owner-review-ready while keeping production migration and the
semantic style-system pilot blocked on owner approval.

T-169 prepared the owner-facing `/prototype/home` review packet. T-170 added
the no-visual-change semantic style map scaffold. T-171 found all audited
article, blog, and collection image URLs already use the configured Cloudinary
delivery path. T-172 documented safe delete-audit receipt verification. T-173
audited admin read-list pagination/search gaps and produced the next admin
archive implementation split.

T-174 through T-183 completed the current admin archive
pagination/search/delete-handoff sequence. T-184 audited the existing strict
TypeScript `noEmit` failures and found 46 top-level diagnostics across 18
files, all under `__tests__/`. T-185 removed the stale public navigation DTO
fixture group. T-186 then cleared the over-narrow loader/form `never` fixture
group; no diagnostics remain in the five T-186 files. T-197 synced shared
orchestration trackers after that cleanup, and T-198 cleared the remaining
test-only strict TypeScript diagnostics. `npx tsc --noEmit --pretty false
--skipLibCheck` now passes, but no CI or release gate was added.

T-187 through T-194 completed the framed print preview track through targeted
visual QA, and T-292 fixed the narrow/mobile room and modal crop found by
T-194. `/prototype/frame` is owner-review-ready for the scoped frame, room, and
modal review. Keep product-page rail adoption, Shopify option mapping,
checkout/cart work, enquiry mutation, physical dimension migration, real
texture assets, and room-background selection paused until later scoped tasks
or owner decisions.

A-005 is complete and reconciled. F-105 through F-110 now track frontend
route/component-boundary follow-ups, R-032 records the mitigated public
fallback/error-state risk, and R-033 tracks the mixed-barrel risk. T-199
defined the public detail route not-found/error contract, T-200 completed the
first runtime implementation slice for standalone and collection-scoped
artwork detail routes, T-201 completed the article/blog runtime slice, and
T-202 completed the remaining Shopify product detail route-local not-found UI
slice. F-105 is resolved. T-203 resolved F-106 home section fallback states,
and T-204 resolved F-107 public browsing client fetch error states. R-032 is
mitigated for the reconciled A-005 fallback scope. T-205 resolved F-108 and
mitigated R-033 for scoped mixed component barrel cleanup in server
routes/loaders. T-206 resolved F-109 account subnav mounting. T-207 resolved
F-110 by documenting the public route loading/fallback pattern and replacing
the `/project/aims` generic inline loading fallback with a route-local neutral
fallback. T-208 completed the R-001 Shopify-hosted purchase handoff slice, and
T-209 resolved the visible shared-banner commerce assurance copy slice for
F-078/R-018. T-210 completed the first F-098/R-016 public search discovery
slice by adding MongoDB-backed artwork results to `/search`. T-211 completed
the remaining Shopify product search slice, resolving F-098. T-212
prepared the R-018 owner/legal compliance decision packet and now records
Heron Laoutaris / hlaoutaris@gmail.com as the approved owner/privacy contact,
with recommendations approved for implementation scoping. T-213 completed the
first runtime compliance slice by adding public `/privacy`, `/terms`, and
footer legal links. T-214 completed newsletter consent/source metadata and
unsubscribe behavior. T-215 completed account privacy/terms acknowledgement
metadata, app-owned provider sign-in notices, and a manual account privacy
request handoff for delete/export/correction requests. T-216 completed public
comment posting notice, privacy/terms links, and manual moderation/removal/
correction request handoff. T-217 completed contact/product and artwork
enquiry privacy/retention notice and manual privacy/legal handoff. T-218 is
complete for footer placeholder social-link cleanup and stale copyright text.
T-219 completed the docs-only owner-input packet for remaining R-018 blockers.
T-139 completed the blocked monitoring decision record in ADR 0005: no provider
and no explicit no-provider interim launch policy are approved, so monitoring
implementation remains blocked until owner/platform approval.

A-022 is complete and reconciled. F-111 through F-117 now route the Next.js
feature-utilization findings: controlled public caching/ISR and sitemap/default
redirect freshness, the T-230-resolved client import-boundary regression, broad
middleware matching, global public client-provider cost, duplicate monitoring
instrumentation blocker, and low-priority non-action `"use server"` cleanup.
T-230, T-231, T-232, T-233, T-235, and T-236 are complete, and T-234 scoped
the first client-island proof. The A-022 implementation sequence is complete;
future broad static/ISR or provider/modal work should be newly scoped. T-237
completed that docs-only scoping pass and selected T-238 as the next safe
route-family cache proof: `/collections` default redirect ISR plus cached
route-local collection navigation reads, while keeping collection detail routes
dynamic and root header navigation direct. T-238 is now complete. T-239 is
complete: `/sitemap.xml` now explicitly owns one-hour ISR in
`src/app/sitemap.ts` without changing sitemap content. T-240 is complete as a
docs-only scoping task for the blog primary-data cache split. It selected
T-241 as the next runtime proof: cache primary blog detail reads for
`/blog/[slug]` metadata, JSON-LD, and non-comments detail rendering while
keeping optional comments, blog lists, route-level blog ISR, and generated
params out of scope. T-241 is complete and verified. T-242 is also complete
and verified: only the default grouped `/blog` list reads use fixed cached
wrappers while sorted pages, public APIs, comments, and route output remain
dynamic. T-243 is complete: it rejected immediate sorted-list caching and
selected T-244 to normalize and bound `/blog` page and public blog API query
inputs before any sorted blog list cache implementation. T-244 is complete and
verified. T-245 is also complete and verified: only sorted `/blog` first-page
list reads are cached while later pages, public APIs, comments, and route
output remain dynamic. T-246 completed the bounded sorted page-2-plus scoping
pass, and T-247 completed the runtime proof for `latest`, `oldest`, and
`featured` sorted `/blog` pages 2-5 while keeping `popular` page 2-plus,
sorted page 6-plus, public APIs, comments, and route output dynamic. T-248 is
planned as the next docs-only scoping pass before any additional public cache
runtime work.

A-011, A-017, and A-018 result files are complete and reconciled. Their
candidate findings are now visible in the findings register, production risks,
workstream backlogs, and implementation briefs T-141 through T-165.

T-140 is complete:
[Reconcile admin discovery taxonomy findings](../tasks/T-140-reconcile-admin-discovery-taxonomy-findings.md).
It added F-091 through F-104, updated existing F-013/F-023/F-033/F-049, updated
R-002/R-005/R-006/R-007/R-014/R-016/R-018, refreshed relevant workstreams, and
prepared T-141, T-142, and T-143.

T-141 is complete:
[Protect admin user deletion](../tasks/T-141-protect-admin-user-deletion.md).
It blocks current-admin self-deletion with `403`, blocks last-admin deletion
with `409`, preserves guard and invalid-ID ordering, and keeps existing
non-admin user cascade cleanup covered by focused tests.

T-142 is complete:
[Verify admin artwork relationships](../tasks/T-142-verify-admin-artwork-relationships.md).
It adds route-local artwork existence checks for admin article create/update
and collection `artworksToAdd` writes, while intentionally preserving
`artworksToRemove` filter semantics.

T-144 is complete:
[Surface admin collection form errors](../tasks/T-144-surface-admin-collection-form-errors.md).
It surfaces structured collection create/update route errors in admin forms,
restores the collection create success callback, and preserves structured
error-envelope fields through the client fetcher.

T-145 is complete:
[Align artwork page query parsing](../tasks/T-145-align-artwork-page-query-parsing.md).
It routes `/artwork` page search params through the shared artwork list query
schema so page defaults, valid filter normalization, invalid-query fallback,
and API defaults now match.

T-146 is complete:
[Preserve sorted blog loading](../tasks/T-146-preserve-sorted-blog-loading.md).
It preserves sorted blog `sortby` through loader/view props and follow-up
client blog requests, and renders the existing sorted pagination links.

T-147 is complete:
[Render resilient main nav fallbacks](../tasks/T-147-render-resilient-main-nav-fallbacks.md).
It keeps the public main navigation visible with `/biography` and
`/collections` route-root fallbacks when dynamic navigation data is missing,
empty, or unexpectedly unavailable.

T-148 is complete:
[Standardize admin article blog form errors](../tasks/T-148-standardize-admin-article-blog-form-errors.md).
It applies the T-144 structured API error display pattern to article and blog
create/update forms using a client-safe form-error helper.

T-149 is complete:
[Add admin content operations runbook](../tasks/T-149-add-admin-content-operations-runbook.md).
It adds the admin content operations runbook, links it from the runbooks index,
and documents the production destructive delete safeguards that were later
implemented through T-156, T-163, T-164, and T-165.

T-150 is complete:
[Surface admin artwork form errors](../tasks/T-150-surface-admin-artwork-form-errors.md).
It applies structured API error display to artwork create/update forms, routes
`shopifyProducts` failures into the product-link controls, and keeps success
callbacks limited to successful API responses.

T-151 is complete:
[Add current-scope search empty and pagination states](../tasks/T-151-add-current-scope-search-empty-pagination.md).
It adds per-type search metadata for articles, blogs, and collections, visible
no-results states, and selected-type pagination without deciding site-wide
search scope.

T-152 is complete:
[Improve admin archive entry points](../tasks/T-152-improve-admin-archive-entry-points.md).
It adds read-list Update/Delete actions for articles, artwork, blogs, and
collections that seed existing update/delete workflows while keeping manual
ObjectId lookup available as an escape hatch.

T-153 is complete:
[Add admin blog pinned tag controls](../tasks/T-153-add-admin-blog-pinned-tag-controls.md).
It exposes blog `pinned` and canonical `tags` controls in admin create/update
forms, initializes existing values safely, and derives admin blog read-filter
years from returned blog data.

T-154 is complete:
[Validate public taxonomy sections](../tasks/T-154-validate-public-taxonomy-sections.md).
It validates public article list `section`, article navigation `[section]`,
and collection list `section` inputs against canonical constants before service
calls and returns public-safe `400` validation responses for invalid values.

T-155 is complete:
[Render content-aware visible breadcrumbs](../tasks/T-155-render-content-aware-visible-breadcrumbs.md).
It makes targeted detail-route visible breadcrumb labels content-aware by
reading the server-rendered `BreadcrumbList` JSON-LD already emitted by those
pages, while preserving route-derived links and avoiding client fetches.

T-156 is complete:
[Add admin delete cascade preview contract](../tasks/T-156-add-admin-delete-cascade-preview-contract.md).
It added read-only preview routes and a typed preview contract for current
admin delete resources without changing destructive delete execution, delete
confirmation UI, backup gate inputs, or audit-event persistence.

T-162 is complete:
[Review homepage prototype visual QA](../tasks/T-162-review-homepage-prototype-visual-qa.md).
It recorded owner-review readiness and refinement notes for the biography,
blog, and shop prototype sections, plus owner decisions needed before
production migration or style-system implementation.

T-163 is complete:
[Surface admin delete preview UI](../tasks/T-163-surface-admin-delete-preview-ui.md).
It renders the T-156 preview contract in admin delete confirmations and blocks
confirmation while preview loading, failed, or blocked, without changing
destructive delete route execution.

T-164 is complete:
[Require admin delete evidence gate](../tasks/T-164-require-admin-delete-evidence-gate.md).
It requires backup/export and owner/delegated review evidence in admin delete
confirmations and validates that evidence at each admin delete route before
destructive mutation.

T-165 is complete:
[Persist admin delete audit events](../tasks/T-165-persist-admin-delete-audit-events.md).
It adds a server-only redacted audit event model/helper and wires article,
artwork, blog, collection, comment, and user delete routes to create audit
receipts before destructive mutation, return public-safe failure without
mutation when receipt creation fails, and best-effort record success, blocked,
not-found, or handled-failure outcomes.

T-166 is complete:
[Expand homepage prototype width](../tasks/T-166-expand-homepage-prototype-width.md).
It adds a route-local `max-w-[1920px]` prototype frame so `/prototype/home`
sections can be reviewed wider than the live page wrapper while keeping
full-bleed section backgrounds and leaving the live homepage untouched.

T-167 is complete:
[Rebalance expanded homepage prototype sections](../tasks/T-167-rebalance-expanded-homepage-prototype-sections.md).
It refines the biography, blog, and shop prototype section compositions for
the widened canvas while preserving real data, fallback behavior, and
enquiry-safe shop wording.

T-168 is complete:
[Review expanded homepage prototype](../tasks/T-168-review-expanded-homepage-prototype.md).
It confirms the widened `/prototype/home` direction is ready for owner review,
with no page-level horizontal overflow observed at checked desktop/mobile
viewports and with remaining production-migration decisions captured for
biography order, canonical dates, blog strategy, shop wording, mobile density,
and anchor/header behavior.

T-169 is complete:
[Prepare homepage prototype owner review packet](../tasks/T-169-prepare-homepage-prototype-owner-review-packet.md).
It adds the owner-facing review packet at
`docs/prototypes/homepage-owner-review-packet.md` so `/prototype/home` can be
reviewed in plain language before production migration.

T-170 is complete:
[Create semantic style map scaffold](../tasks/T-170-create-semantic-style-map-scaffold.md).
It adds `src/lib/styles/semanticStyles.ts` and focused source/invariant
coverage as a client-safe no-visual-change style point-of-truth scaffold,
without adopting it in runtime components.

T-171 is complete:
[Audit existing content image URLs](../tasks/T-171-audit-existing-content-image-urls.md).
It adds a read-only audit script and result showing all audited article, blog,
and collection image URLs use the configured Cloudinary delivery path; no
scoped image URL migration is indicated.

T-172 is complete:
[Document admin delete audit receipt verification](../tasks/T-172-document-admin-delete-audit-receipt-verification.md).
It updates the admin content operations runbook with safe audit-receipt fields,
excluded private fields, a placeholder-only query shape, and a sanitized
handoff example.

T-173 is complete:
[Audit admin read-list pagination needs](../tasks/T-173-audit-admin-read-list-pagination-needs.md).
It records that all six admin read-list routes return pagination metadata but
main CRUD read tabs do not consume it, and it recommends the T-174 through
T-178 implementation sequence.

T-174, T-175, T-176, T-177, T-178, T-179, T-180, T-181, and T-182 are complete:
[Harden admin read-list query bounds](../tasks/T-174-harden-admin-read-list-query-bounds.md),
[Pilot admin blog read pagination](../tasks/T-175-pilot-admin-blog-read-pagination.md),
[Route-back admin read filters](../tasks/T-176-route-back-admin-read-filters.md),
[Pilot admin read search](../tasks/T-177-pilot-admin-read-search.md),
[Add comment user delete entry points](../tasks/T-178-add-comment-user-delete-entry-points.md),
[Apply collection admin read pagination search](../tasks/T-179-apply-collection-admin-read-pagination-search.md),
[Apply article admin read pagination filter search](../tasks/T-180-apply-article-admin-read-pagination-filter-search.md),
[Apply artwork admin read pagination search](../tasks/T-181-apply-artwork-admin-read-pagination-search.md), and
[Add comment user admin read pagination](../tasks/T-182-add-comment-user-admin-read-pagination.md).
T-177 added bounded route-backed blog search over title/slug while preserving
pagination, filters, and card actions. T-179 added route-backed collection
pagination and bounded title/slug search while preserving card actions. T-180
added route-backed article pagination, existing filters, and bounded title/slug
search while preserving article cards and handoff. T-181 added route-backed
artwork pagination, constrained artwork filters, and bounded title search while
preserving artwork cards and handoff. T-182 added route-backed comment/user
pagination while preserving Copy ID and Delete handoff. T-183 extracted the
shared previous/next pagination control and metadata normalization helper
without route, fetcher, search, filter, card action, or delete workflow changes.

T-184 is complete:
[Audit TypeScript noEmit test errors](../tasks/T-184-audit-typescript-noemit-test-errors.md).
It recorded the current strict TypeScript failure set as test-only, with 46
top-level diagnostics across 18 files and no top-level runtime `src/` errors.
It recommends fixing stale navigation DTO fixtures first before addressing
over-narrow `never` fixtures and isolated test-helper typing issues.

T-185 is complete:
[Fix navigation DTO test fixtures](../tasks/T-185-fix-navigation-dto-test-fixtures.md).
It updated public navigation test fixtures to match current article and
collection navigation DTOs, including the additional biography/collection page
tests where the same stale fixture pattern appeared. Focused navigation tests
passed, and strict TypeScript now reports 26 remaining unrelated test-only
diagnostics.

T-134 is complete:
[Complete incident owner matrix](../tasks/T-134-complete-incident-owner-matrix.md).
No owner-approved named owners, team aliases, or permanent backups were
available, so the incident-response runbook now records each required owner row
as a blocked owner-decision handoff with interim owner/orchestrator escalation,
next owner action, and authority boundaries. Rollback, release changes,
provider checks, MongoDB restore, credential rotation, and privacy/legal
communication remain blocked on owner-approved operators.

T-135 is complete:
[Harden content image URL validation](../tasks/T-135-harden-content-image-url-validation.md).
It added a shared content image URL validator and wired admin article, blog,
and collection image schemas so unsupported hosts, malformed URLs, credentials,
non-default ports, unsupported protocols, and mismatched Cloudinary cloud paths
are rejected before persistence.

T-137 is complete:
[Add client server import boundary guard](../tasks/T-137-add-client-server-import-boundary-guard.md).
It added a recursive static client runtime import-graph guard, split the
client-safe `NavBarLink` type out of the server loader, replaced scoped mixed
barrel imports with direct imports, and currently requires no allowlist.

T-136 is complete:
[Centralize Cloudinary delivery transformations](../tasks/T-136-centralize-cloudinary-delivery-transformations.md).
It added `src/lib/images/cloudinaryDelivery.ts` with named variants for current
card, gallery-list, admin-preview, and blog section transforms. Scoped cards,
blog sections, masonry artwork lists, and admin read-list previews now call the
helper instead of direct `/upload/` string replacement.

T-138 is complete:
[Document admin bootstrap and recovery](../tasks/T-138-document-admin-bootstrap-recovery.md).
It extended the auth runbook with first-admin bootstrap, routine promotion,
lockout recovery, role-change evidence, sign-out/sign-in verification,
rollback, and secret-handling rules. Runtime self-delete and last-admin
deletion guards remain a separate implementation gap.

T-133 is complete:
[Remove admin dashboard client console errors](../tasks/T-133-remove-admin-dashboard-client-console-errors.md).
It removed the remaining admin dashboard client `console.error()`/
`console.warn()` calls while preserving CRUD form behavior, feed/list loading
behavior, delete confirmations, document-reader behavior, upload handling, copy
attempts, validation display, and operator-visible failure UI. The known
non-route direct console error/warn inventory is clear except the approved
structured logger sink.

T-132 is complete:
[Remove shared fetcher utility console errors](../tasks/T-132-remove-shared-fetcher-utility-console-errors.md).
It removed scoped shared fetcher and low-value utility/helper direct
`console.error()`/`console.warn()` calls while preserving fetcher return
contracts, fallback values, copy behavior, color-icon rendering, and blog
sidebar state.

T-131 is complete:
[Remove account user client console errors](../tasks/T-131-remove-account-user-client-console-errors.md).
It removed scoped account/user client `console.error()` calls while preserving
contact/comment form behavior, logout and account navigation behavior, owner
comment action behavior, and client error-boundary fallback behavior without
introducing a monitoring provider or client reporting SDK.

T-130 is complete:
[Remove public browsing client console errors](../tasks/T-130-remove-public-browsing-client-console-errors.md).
It removed scoped public browsing client `console.error()` calls while
preserving existing artwork/blog/shop UI state, modals, sorting, loading, and
fallback behavior without introducing a monitoring provider or client reporting
SDK.

T-129 is complete:
[Migrate account saved artwork loader logging](../tasks/T-129-migrate-account-saved-artwork-loader-logging.md).
It migrated the remaining account saved-artwork server loader `console.error()`
call to structured redacted server logging while preserving the current account
favourite artwork detail fallback UI, saved-artwork service behavior, and
Next.js control-flow error handling.

T-128 is complete:
[Migrate server action session logging](../tasks/T-128-migrate-server-action-session-logging.md).
It migrated scoped subscription, saved-item, and development test-header
session helper `console.error()` calls to structured redacted server events
while preserving public action return values, saved-item mutation/revalidation
behavior, and development-only test-header session semantics.

T-127 is complete:
[Migrate Shopify provider service logging](../tasks/T-127-migrate-shopify-provider-service-logging.md).
It migrated scoped Shopify provider and product service `console.error()` calls
to structured redacted server events while preserving Shopify DTOs, Storefront
cache policy, partial fan-out behavior, and public shop contracts.

T-126 is complete:
[Migrate public loader page logging](../tasks/T-126-migrate-public-loader-page-logging.md).
It migrated the first public server loader and App Router page `console.error()`
slice to the T-125 logging/redaction policy while preserving current fallback
UI, redirects, and route rendering/cache behavior.

T-125 is complete:
[Define service client logging policy](../tasks/T-125-define-service-client-logging-policy.md).
It added the durable
[logging and redaction architecture policy](../architecture/logging-and-redaction.md),
recorded the 2026-05-18 non-route direct `console.error()`/`console.warn()`
inventory, and grouped 86 calls across 66 files into migration surfaces for
future implementation tasks.

T-124 is complete:
[Add public smoke GitHub Actions workflow](../tasks/T-124-add-public-smoke-github-actions-workflow.md).
It added `.github/workflows/public-smoke.yml` so `npm run smoke:public` can run
from GitHub Actions manually with a required `base_url` input and on a schedule
after non-secret repository variable `SMOKE_BASE_URL` is configured. The
workflow uses Node `22.14.0`, `npm ci`, and optional non-secret `SMOKE_*` route
input variables without adding credentials, provider alerting, Vercel log
access, or committed production URLs.

T-139 is complete:
[Record monitoring provider decision](../tasks/T-139-record-monitoring-provider-decision.md).
It added [ADR 0005](../decisions/0005-monitoring-provider-decision.md), which
records the current blocked state: no monitoring provider and no explicit
no-provider interim launch policy are approved. SDKs, `instrumentation.ts`,
provider variables, source-map/release tracking, dashboards, uptime checks, and
alert routing remain blocked until owner/platform approval.

T-123 is complete:
[Define monitoring provider plan](../tasks/T-123-define-monitoring-provider-plan.md).
It added the provider-neutral
[monitoring and error-reporting architecture plan](../architecture/monitoring-and-error-reporting.md)
with required capture surfaces, T-099 request ID/logging integration points,
provider decision questions, environment-variable classification rules, and the
post-approval implementation contract. T-139 later recorded the blocked
decision state in ADR 0005.

T-122 is complete. It added a recursive static guard for current and future
`src/app/api/v2` route handler files so direct route-level `console.error()`
and `console.warn()` calls cannot return after the T-117 through T-121 request
ID and structured logging migrations.

T-121 is complete. It moved admin create, update, and delete route
internal-failure logging from direct route-level `console.error()` to the
T-099 request-context and structured redacted logger pattern while preserving
shared admin guards, validation, write allowlists, cascade, and transaction
contracts.

T-120 is complete. It moved admin read route internal-failure paths to
request-context structured logging while preserving shared admin guards,
invalid-ID handling, empty-list/not-found semantics, pagination, transforms,
and success contracts.

T-119 is complete. It moved protected user favourite, watchlist, and comment
API internal-failure paths to request-context structured logging while
preserving shared guard, ownership, validation, and transaction contracts.

T-118 is complete:
[Migrate public discovery and shop API structured logging](../tasks/T-118-migrate-public-discovery-shop-api-structured-logging.md).
It moved public search, navigation, and shop product API internal/upstream
failure logging from direct route-level `console.error()` to the T-099
request-context and structured redacted logger pattern, preserving existing
public and Shopify status contracts.

T-117 is complete. It migrated public article, blog, artwork, and collection
API internal-failure paths to request-context structured logging with public
request IDs and `X-Request-Id` where applicable.

T-116 is complete. It added the durable incident-response runbook with severity
levels, first triage steps, service checks, rollback/defer/mitigate rules,
evidence handling, owner matrix placeholders, and post-incident follow-up.
T-134 later converted those placeholders into blocked owner-decision rows.

T-115 is complete. It removed the Shopify Storefront fetch option conflict that
made `/sitemap.xml` builds warn about specifying both `cache: default` and
`next.revalidate: 3600`; build now passes without that warning.

T-114 is complete. It extended `npm run smoke:public` so deployed
`/robots.txt` and `/sitemap.xml` discovery endpoints are checked for status and
minimal safe content.

T-113 is complete. It expanded the public sitemap with best-effort dynamic
detail URLs from current archive and linked Shopify data without changing
route rendering, ISR/static params, or commerce claims.

T-112 is complete. It added conservative `BreadcrumbList` JSON-LD to
high-value public detail pages without changing visible UI, route cache policy,
or commerce claims.

T-111 is complete. It renders linked Shopify product summaries for artwork
detail pages in initial server output instead of relying on
`ArtworkShopSection` client-side product fetches after mount.

T-110 is complete. It made public route rendering/cache ownership explicit
after T-102 by documenting the route-local policy, adding conservative
`force-dynamic` segment configuration to remaining dynamic public pages, and
pinning the policy with focused source tests.

T-109 is complete. It normalized public-page main landmark ownership and
demoted presentational repeated `h1` usage without changing visible layout,
route data, commerce behavior, or admin/account workflows.

T-108 is complete. It tuned current public image priority, responsive sizes,
and artwork magnifier intent-loading behavior across the home hero, shop pages,
and artwork detail view without changing visible layout or Cloudinary
ownership policy.

T-107 is complete. It added route-specific metadata, canonical/social previews,
and conservative artwork/product JSON-LD for public artwork, collection-scoped
artwork, and Shopify product detail pages without adding commerce/legal claims.

T-106 is complete. It added route-specific metadata, canonical/social previews,
and conservative `Article`/`BlogPosting` JSON-LD for public biography article
and blog detail pages while preserving visible page behavior and route cache
policy.

T-105 is complete. It converted owner-only comment edit/delete and edit-mode
cancel/save icon actions into labelled non-submit controls with hidden
decorative icons while preserving comment mutation behavior. F-062 and R-015
are resolved/mitigated for the reconciled A-016 scope.

T-104 is complete. It converted public search submit, mobile search drawer
trigger/close, mobile navigation drawer trigger/close, and unauthenticated
favourite/watchlist controls to labelled semantic buttons. F-088 and R-031 are
resolved.

T-103 is complete. It replaced scaffolded root metadata with production-safe
Joseph Laoutaris archive metadata and added baseline `robots.ts`/`sitemap.ts`
discovery files for stable public routes. T-114 later added discovery endpoint
smoke assertions.

T-102 is complete. It removed global root-layout DB/session work, avoided
middleware token parsing for unprotected public routes, and recorded remaining
route-local dynamic blockers from build output. Build now prerenders shell-only
public routes including `/biography`, `/collections`, `/project`,
`/project/about`, `/project/aims`, `/project/film`, and `/shop`.

A-010 is complete and reconciled into F-084 through F-090, R-012/R-014/R-030/
R-031, relevant workstreams, T-102 through T-114. F-085/R-030 are resolved by
the metadata, structured data, sitemap, robots, and discovery-smoke sequence.

T-101 is complete. It documented the interim Cloudinary asset lifecycle,
backup/restore, orphan cleanup, upload preset/cloud/folder ownership, delivery
allowlist alignment, and image-host policy before any destructive Cloudinary
runtime work is assigned.

T-099 and T-100 are complete:

- T-099 added a provider-neutral request/correlation ID and structured redacted
  logging foundation for representative API failures.
- T-100 preserved Shopify product context from product-detail enquiry links in
  public enquiry submissions while checkout remains enquiry-based.
- Orchestrator takeover verification on 2026-05-18 reran the combined focused
  T-099/T-100 Jest slice, lint, `git diff --check`, and build; all passed.
  `docs/workstreams/testing-and-quality.md` was corrected to record that the
  earlier T-100 build blocker was transient concurrent T-099 work and passed
  after T-099 completed.

A-009, A-020, and A-021 are complete and reconciled into findings F-067 through
F-083, R-008/R-014/R-018/R-019/R-028, relevant workstreams, and the Cloudinary
runbook. Owner/legal or owner/platform decisions remain required for policy
pages, newsletter consent/unsubscribe, account privacy actions, comment
publication policy, commerce assurance copy, Cloudinary runtime cleanup,
upload-result metadata hardening, image-field validation, monitoring-provider
selection, incident-response ownership, and smoke automation cadence.
T-098 is complete: admin artwork product-link rows now verify Shopify product
IDs through the existing public single-product route on operator action, display
returned product context on success, show invalid/not-found/upstream states on
failure, clear stale verification when rows change, and keep artwork save
governed by local and route validation.
T-097 is complete: admin artwork create/update forms now manage canonical
Shopify product links with add/remove controls, numeric ID/type validation,
duplicate prevention, existing-link initialization, empty-array submission for
clearing links, focused form tests, and operator docs. F-010/R-021's visible
admin workflow gap is closed.
T-096 is complete: `next.config.mjs` no longer defines global API CORS
headers, removing the invalid wildcard-origin plus credentialed CORS pairing
and wildcard allowed headers. Baseline `X-Content-Type-Options`,
`Referrer-Policy`, conservative `Permissions-Policy`, and low-risk CSP
`object-src`, `base-uri`, `form-action`, and `frame-ancestors` directives are
now covered by static Next config tests. Full strict CSP allowlist design,
dynamic route-level CORS, HSTS, CSP reporting, monitoring, Cloudinary upload
lifecycle, and broader production logging/redaction policy remain separate.
T-095 is complete: stale commented-out `console.log()` snippets were removed
from auth callbacks, credentials auth, session provider, collection section,
main navigation, and admin content layout source. The full-source
`rg -n "console\\.log\\(" src` search now returns no matches, and focused
source-hygiene coverage prevents direct or commented `console.log()` calls from
returning under `src`. Keep route-level API error logging, `console.error()`
handling, and broader production logging/redaction policy separate.
T-094 is complete: the remaining active direct `console.log()` output was
removed from `src/lib/session/getUserFromSession.ts` development test-header
paths while preserving `X-Test-User-Id`, `X-Test-Admin-Id`, normal NextAuth
session lookup, `getUserIdFromSession()`, `isUserAdmin()`, and the existing
test-user lookup failure `console.error()` behavior. Focused session helper
tests now cover the development test-header paths and source hygiene. T-095
later handled the commented-out debug lines; keep route-level API error
logging and broader production logging/redaction policy separate.
T-093 is complete: direct `console.log()` output was removed from shared UI
components (`Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`) and the
public artwork fetcher while preserving feed rendering, navigation state,
refresh behavior, YouTube embed behavior, and artwork query URL construction.
Focused source hygiene and public artwork fetcher URL-construction coverage
were added. T-094 later handled the `getUserFromSession` development
test-header logs, and T-095 later handled commented-out debug logs; keep
route-level API error logging and broader production logging/redaction policy
separate.
T-092 is complete: direct success-path `console.log()` output was removed from
admin read-list copy flows, `ArtworkFeedCard`, and the shared `copy_id()`
helper; `ReadArtworkList` no longer logs artwork arrays during render.
Clipboard behavior, read-list fetch/filter/loading/error states, and clipboard
failure `console.error()` behavior were preserved. T-093 and T-094 later
handled the public artwork fetcher, shared UI, and test-session override logs;
keep route-level API error logging and broader production logging/redaction
policy separate.
T-091 is complete: direct admin dashboard create/update form and artwork-filter
`console.log()` output was removed from the scoped admin dashboard files while
preserving validation, upload-state handoff, submit/update, success/error, and
filter callback behavior. Focused source-hygiene coverage now prevents those
direct logs from returning. Keep admin read-list copy logs, shared helpers,
route-level API error logging, and broader production logging/redaction policy
separate from T-091; T-092 handled the admin read-list and shared copy helper
logs.
T-090 is complete: remaining scoped user-facing public/account `console.log()`
debug output was removed from `ClientContextBoundary`, `ArtworkGallery`,
`BlogDetail`, `EnquiryForm`, `SubscribeSectionLoader`,
`src/app/account/favourites/[artworkId]/page.tsx`, and
`CollectionViewPagination`. Focused source hygiene now prevents the retired
client/page debug strings from returning. Pick the next scoped
production-readiness task from the remaining open findings and risks. Keep
route-level API error logging, admin dashboard logs, and global logging/
redaction policy separate.
T-089 is complete: high-noise public/account render `console.log()` calls were
removed from `src/app/layout.tsx`, `Subnav`, `ArticleView`,
`DesktopArticleView`, and `UserCommentsView`; focused render source-hygiene
coverage now prevents the retired branch verification, link, article, title,
and comments debug strings from returning. Pick the next scoped
production-readiness task from the remaining open findings and risks. Keep
root-layout DB/session ownership, route-level API error logging, non-touched
admin/gallery debug logs, and broader production logging/redaction policy
separate.
T-088 is complete: direct MongoDB helper and auth adapter debug logs were
removed from `src/lib/db/mongodb.ts`, `src/lib/db/clientPromise.ts`,
`src/lib/db/connectWithRetry.ts`, and `src/lib/db/adapter.ts`; stale MongoDB
connection and OAuth callback examples were removed from `mongodb.ts`; focused
source hygiene and DB helper behavior tests cover the preserved contracts. Pick
the next scoped production-readiness task from the remaining open findings and
risks. Keep broader production logging/redaction, request correlation,
monitoring, route-level API logging, and build-time live MongoDB/static
generation coupling separate.
T-087 is complete: the retired server-side same-app API wrapper entrypoints
were deleted after T-070 through T-086 removed their route-critical callers.
`src/app/account/favourites/page.tsx` now keeps only the current
`/account/settings` redirect, client API wrappers and route-specific fetcher
factories remain intact, and the environment runbook now records
`VERCEL_ENV`/`VERCEL_URL` as not required by current source.
T-086 is complete: `LogoutForm`, `MobileNavDrawer`, and the `/project` redirect
now use relative same-app paths, and the environment runbook no longer treats
`NEXT_PUBLIC_BASE_URL` as required current-source configuration or names
`VERCEL_URL` as the `/project` redirect owner. Keep NextAuth callback policy,
OAuth callback configuration, and broad route-builder centralization separate.
T-085 is complete: `ShopProductsLoader` and
`GET /api/v2/public/shop/products` now share server-only
`getShopProductList` service logic. The loader no longer reads
`NEXT_PUBLIC_BASE_URL`, falls back to localhost, or calls same-app `fetch()`;
the route preserves query validation, success metadata, validation `400`s, and
public-safe `500`s. Keep real shop pagination, server-side sorting,
checkout/cart, variant selection, product detail UI, admin product-linking
workflow, global route URL/base URL policy, hard-coded auth redirects, and
Shopify API validation separate.
T-084 is complete: account settings/comments loaders and protected user
profile/comment GET routes now share server-only `getOwnUserProfile` and
`getOwnUserComments` services; the loaders are off same-app HTTP, and the user
profile/comment routes preserve their `requireApiUser()` guards, success
envelopes, failure statuses, comment list metadata, and public-safe `500`
bodies. Keep comment mutations, profile editing, favourite/watchlist server
actions, account navigation, shop loaders, root-layout data access, cache
policy, base URL policy, middleware/global auth policy, and global
logging/redaction policy separate.
T-083 is complete: account favourites/watchlist loaders and protected user
saved-artwork read routes now share server-only `getOwnSavedArtwork` services;
the loaders are off same-app HTTP, and the user saved-artwork routes preserve
their `requireApiUser()` guards, success envelopes, list metadata, `404`s, and
public-safe `500` bodies. Keep favourite/watchlist server actions, account
navigation, shop loaders, middleware/global auth policy, root-layout data
access, cache policy, and base URL policy separate.
T-059 is complete: the read-only Shopify product-link audit ran against the
owner-approved MongoDB Atlas `laoutarisDB` target and exited `0` with 215
artworks scanned, 92 artworks with Shopify links, 99 total Shopify links, 0
invalid IDs, 0 unknown product types, 0 within-artwork duplicates, and 1
review-only cross-artwork book duplicate group. T-082 is complete: the shared
book-link policy is recorded, and admin artwork create/update now rejects
malformed Shopify product IDs, missing/unknown product types, and
within-artwork duplicate product IDs before persistence.
Keep automatic data mutation, Shopify API validation, checkout/cart ownership,
broader Cloudinary upload policy, global logging/redaction policy, visible blog
pinned/tag admin workflow, CI/dependency-update automation, Vercel
project-setting ownership, credential rotation, and the residual Next/PostCSS
owner decision separate unless priority changes.

## Active Phase

T-134 incident owner-matrix handoff task is complete.
T-133 admin dashboard client console-error cleanup task is complete.
T-132 shared fetcher/utility console-error cleanup task is complete.
T-131 account/user client console-error cleanup task is complete.
T-130 public browsing client console-error cleanup task is complete.
T-129 account saved-artwork loader logging migration task is complete.
T-128 server action/session helper logging migration task is complete.
T-127 Shopify provider service logging migration task is complete.
T-126 public loader/page logging migration task is complete.
T-125 service/client logging policy task is complete.
T-124 public smoke GitHub Actions workflow task is complete.
T-123 monitoring provider plan task is complete.
T-122 API route logging source-hygiene task is complete.
T-121 admin write/delete API structured logging migration task is complete.
T-120 admin read API structured logging migration task is complete.
T-119 protected user API structured logging migration task is complete.
T-118 public discovery/shop API structured logging migration task is complete.
T-117 public content API structured logging migration task is complete.
T-116 incident-response runbook task is complete.
T-115 Shopify fetch cache policy cleanup task is complete.
T-114 discovery endpoint smoke assertion task is complete.
T-113 dynamic detail sitemap task is complete.
T-112 public breadcrumb structured data task is complete.
T-111 artwork-to-shop SSR discovery task is complete.
T-110 public route cache policy task is complete.
T-109 public landmark/heading cleanup task is complete.
T-108 public image preload/sizing task is complete.
T-107 artwork/product detail metadata task is complete.
T-106 article/blog detail metadata task is complete.
T-105 public comment action accessibility task is complete.
T-104 public search/navigation accessibility task is complete.
T-103 public metadata/discovery task is complete.
T-102 public shell/auth boundary task is complete.
A-010 performance/SEO/accessibility audit is complete and reconciled.
T-101 Cloudinary asset lifecycle policy is complete.
T-100 product enquiry context persistence is complete.
T-099 request ID and structured logging foundation is complete.
A-009 Cloudinary/assets audit is complete and reconciled.
A-020 privacy/consent/commerce compliance audit is complete and reconciled.
A-021 observability/incident response audit is complete and reconciled.
T-098 admin Shopify product-link verification is complete.
T-097 admin Shopify product-link workflow is complete.
T-096 baseline security headers/API CORS hardening is complete.
T-095 commented debug-log leftovers cleanup is complete.
T-094 session test-header debug-log cleanup is complete.
T-093 shared UI/public artwork fetcher debug-log cleanup is complete.
T-092 admin read-list/copy debug-log cleanup is complete.
T-091 admin dashboard form/filter debug-log cleanup is complete.
T-090 user-facing client debug-log cleanup is complete.
T-089 public/account render debug-log cleanup is complete.
T-088 MongoDB DB helper debug-log cleanup is complete.
T-087 server API self-fetch wrapper retirement is complete.
T-086 hard-coded localhost navigation URL cleanup is complete.
T-085 public shop products loader service migration is complete. T-084 account
profile/comments loader service migration is complete. T-083
account saved-artwork loader service migration is complete. T-082 admin Shopify
product-link validation is complete. T-081 account subnav loader service
migration is complete. T-059 Shopify product link audit
execution is complete. T-080 collection section loader service migration is
complete. T-079 biography
section loader service migration is complete. T-078 collection artwork loader
service migration is complete. T-077 artwork detail loader service migration is
complete. T-076 blog list/section loader service migration is complete. T-075
blog detail loader service migration is complete. T-074 article detail loader
service migration is complete. T-073 collection redirect page service migration
is complete. T-072 article navigation page-consumer migration is complete.
T-071 article navigation loader service migration is complete. T-070
collections subnav loader service migration is complete. T-069 shared fetcher
debug-log cleanup is complete. T-068 public shop debug-log cleanup is complete.
T-067 Cloudinary upload debug-log cleanup is complete. T-066 Cloudinary signing
param hardening is complete. No product-ID cleanup or migration task is
indicated by T-059/T-082.

## Successor Takeover Snapshot

Use this section as the first operational handoff for a new orchestrator.

- Current orchestrator role: sequence agent tasks, keep docs canonical, and
  reconcile returned work into task/workstream/risk/finding trackers.
- No active audits are recorded.
- No active running agent is recorded in docs.
- Immediate handoff: assign
  [T-293 Review live sale gallery visual QA](../tasks/T-293-review-live-sale-gallery-visual-qa.md):
  `/task effort: high details: docs/tasks/T-293-review-live-sale-gallery-visual-qa.md`.
- `/prototype/frame` is owner-review-ready for the T-194/T-292 scoped frame,
  room, and modal review. Product-page rail adoption remains paused until a
  later task or owner decision explicitly scopes it.
- Recent orchestration wave: T-206 restored the account subnav mount; T-207
  completed route fallback documentation and `/project/aims` fallback cleanup;
  T-139 recorded the blocked monitoring provider/no-provider decision; T-208
  completed the Shopify-hosted purchase handoff for available products with valid
  `onlineStoreUrl`; T-209 removed unsupported commerce assurance claims from
  shared security banners and matching security translation files; T-210 added
  MongoDB-backed artwork results to public search; T-211 added Shopify product
  results to public search; T-212 prepared the R-018 owner/legal decision
  packet, and the owner approved its recommendations for implementation
  scoping; T-213 added public privacy/terms routes and footer legal links;
  T-214 added newsletter consent/source metadata and unsubscribe behavior;
  T-215 added account privacy/terms acknowledgement metadata, app-owned
  provider sign-in notices, and manual delete/export/correction request
  handoff; T-216 added public comment posting notice, privacy/terms links, and
  manual moderation/removal/correction handoff; T-217 added contact/product
  and artwork enquiry privacy/retention notice and manual privacy/legal
  handoff; T-218 removed footer social placeholders and stale copyright text;
  T-219 recorded the remaining R-018 owner-input blockers; T-207 documented
  the public route fallback pattern and replaced the `/project/aims` generic
  inline loading fallback.
- Public search direction: staged site-wide widening is now selected for
  T-143 and completed by T-210/T-211. Public search now covers articles, blogs,
  collections, artworks, and Shopify products. Checkout/cart, product detail
  handoff, shop listing controls, and commerce policy claims remain separate.
- Reconciliation status: F-009/R-001 mention the hosted Shopify handoff;
  F-078 is resolved for the visible shared-banner assurance-copy scope; R-018
  still tracks policy, consent, retention, third-party disclosure, and legal
  page work. F-074 is partially mitigated by T-215, F-075 is partially
  mitigated by T-216, F-076 is resolved by T-100/T-217, and F-104 is resolved
  by T-209/T-213/T-218. T-219 records that remaining R-018 runtime work is
  blocked on owner inputs; F-073 and F-077 are resolved, F-072 is partially mitigated,
  F-098 is resolved after T-210/T-211, and R-016 no longer tracks Shopify
  product search as an open discovery gap.
- T-131 is complete: scoped account/user client console-error output is removed
  while preserving existing UI behavior.
- T-130 is complete: scoped public browsing client console-error output is
  removed while preserving existing UI behavior.
- T-129 is complete: the remaining account saved-artwork server loader logging
  is migrated to structured redacted server events.
- T-128 is complete: scoped server action and session-helper logging is
  migrated to structured redacted server events.
- T-127 is complete: scoped Shopify provider/data service logging is migrated
  to structured redacted server events.
- T-126 is complete: the first public server loader/page console-error slice is
  migrated to the T-125 logging/redaction policy.
- T-125 is complete: the non-route production logging/redaction policy and
  migration inventory are documented.
- T-124 is complete: GitHub Actions can run manual and scheduled
  unauthenticated public smoke checks once repository variables are configured.
- T-123 is complete: the monitoring/error-reporting architecture plan and
  environment-variable classification rules are documented before
  provider-specific SDK work.
- T-122 is complete: recursive API-v2 route source hygiene now guards against
  direct route-level `console.error()` and `console.warn()` calls after the
  logging migrations.
- T-121 is complete: admin create, update, and delete route failure paths now
  use request IDs and structured redacted logging instead of direct
  route-level `console.error()`.
- T-120 is complete: admin read route failure paths now use request IDs and
  structured redacted logging.
- T-119 is complete: protected user favourite, watchlist, and comment API
  failure paths now use request IDs and structured redacted logging.
- T-118 is complete: public search, navigation, and shop product API failure
  paths now use request IDs and structured redacted logging instead of direct
  route-level `console.error()`.
- T-117 is complete: public article, blog, artwork, and collection API
  internal-failure paths now use request-context structured logging and public
  request IDs where applicable.
- T-116 is complete: the incident-response runbook now covers severity, triage,
  blocked owner-decision escalation rows, evidence, rollback/defer/mitigate
  rules, and post-incident follow-up after T-134's matrix update.
- T-115 is complete: Shopify Storefront fetches no longer combine `cache` and
  `next.revalidate`, and build no longer warns during `/sitemap.xml`.
- T-114 is complete: public smoke checks now assert deployed `/robots.txt` and
  `/sitemap.xml` status plus minimal safe content.
- T-113 is complete: `sitemap()` now includes best-effort dynamic public detail
  URLs without route rendering changes.
- T-112 is complete: conservative breadcrumb structured data is added to
  high-value public detail pages.
- T-111 is complete: linked Shopify product summaries render on artwork
  details server-side instead of client fetching after mount.
- T-110 is complete: public route rendering/cache policy and conservative route
  segment ownership are codified after the public shell split.
- T-109 is complete: public main landmark ownership and presentational heading
  hierarchy were normalized without visual redesign.
- T-108 is complete: public image priority, quality, responsive sizes, and
  artwork magnifier intent-loading behavior were tuned.
- T-107 is complete: public artwork, collection-scoped artwork, and Shopify
  product detail pages now have route-specific metadata, canonical/social
  previews, and conservative artwork/product JSON-LD.
- T-106 is complete: public biography article and blog detail pages now have
  route-specific metadata, canonical/social previews, and conservative
  `Article`/`BlogPosting` JSON-LD.
- T-105 is complete: owner-only comment edit/delete and edit-mode cancel/save
  icon actions now use labelled non-submit controls with hidden decorative
  icons; F-062 is resolved and R-015 is mitigated for the reconciled A-016
  scope.
- T-104 is complete: public search submit, search drawer trigger/close, mobile
  nav drawer trigger/close, and unauthenticated artwork intent controls now use
  semantic labelled buttons; F-088 and R-031 are resolved.
- T-103 is complete: root metadata now describes the Joseph Laoutaris archive,
  robots and sitemap files exist for stable public routes, focused tests
  passed, and build emits static `/robots.txt` and `/sitemap.xml`.
- T-102 is complete: root layout no longer performs global DB/session work,
  public middleware paths bypass token parsing, focused boundary tests passed,
  and build output now shows route-local dynamic blockers explicitly.
- A-010 is complete and reconciled: F-084 through F-090 now route public route
  cacheability, metadata/discovery, image performance, accessibility controls,
  landmark/heading cleanup, and artwork-to-shop SSR discovery.
- T-101 is complete: the Cloudinary runbook now documents the conservative
  asset lifecycle, backup/restore, orphan cleanup, upload preset/cloud/folder
  ownership, delivery allowlist alignment, and image-host policy before runtime
  Cloudinary cleanup work.
- T-099 is complete: request/correlation IDs and structured redacted logging
  were added across a representative public/user/admin API route slice without
  choosing a monitoring provider or migrating every route.
- T-100 is complete: Shopify product context is preserved in enquiry
  submissions and the stale Shopify credential TODO was removed while policy
  pages and checkout/cart remain separate.
- A-009, A-020, and A-021 are complete and reconciled. Findings F-067 through
  F-083 route Cloudinary lifecycle/ownership, compliance, and observability
  follow-ups.
- T-098 is complete: admin product-link rows now verify Shopify product IDs
  through the existing public single-product route on operator action, display
  returned product context on success, show invalid/not-found/upstream states on
  failure, clear stale verification when rows change, and keep save behavior
  advisory rather than persistence-blocking.
- T-097 is complete: admin artwork create/update forms can add, edit, remove,
  and clear canonical `shopifyProducts` links, shared form schema validation
  covers trimming/numeric IDs/types/duplicates, T-082 route validation remains
  covered, and Shopify operator docs were updated.
- T-096 is complete: global API CORS headers were removed from
  `next.config.mjs`, baseline hardening headers and missing low-risk CSP
  directives were added, current Cloudinary/Shopify/YouTube allowances were
  preserved, and focused static Next config tests passed.
- T-095 is complete: stale commented `console.log()` snippets were removed from
  the scoped auth, session provider, public collection, main navigation, and
  admin layout source while preserving runtime behavior. The full-source
  `console.log()` search returns no matches, and route-level API logging,
  `console.error()` handling, and global logging policy remain separate.
- T-094 is complete: `getUserFromSession` development test-header paths no
  longer contain active direct `console.log()` calls. Focused tests cover
  persisted test-user lookup, missing/failing lookup fallback, test-admin
  override behavior, normal NextAuth fallback, delegated helper behavior, and
  source hygiene. Commented-out debug lines, route-level API logging, and
  global logging policy remain separate.
- T-093 is complete: `Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`,
  and the public artwork fetcher no longer contain direct `console.log()`
  calls. Focused source hygiene covers the scoped files, public artwork fetcher
  URL construction is covered, and T-094 later handled the `getUserFromSession`
  development test-header logs. Commented-out debug logs, API logging, and
  global logging policy remain separate.
- T-092 is complete: scoped admin read-list files, `ArtworkFeedCard`,
  `ReadArtworkList`, and `copy_id()` no longer contain direct success-path
  `console.log()` output. `copy_id()` unit tests now assert clipboard success
  without success logging, focused source hygiene covers the read/copy files,
  and T-093 plus T-094 later handled the public artwork fetcher, shared UI
  click, and test-session override logs. API logging and global logging policy
  remain separate.
- T-091 is complete: the scoped admin dashboard create/update form and
  artwork-filter components no longer contain direct `console.log()` calls,
  focused source-hygiene coverage was added, and dashboard validation,
  upload-state handoff, submit/update, success/error, and filter callback
  behavior were preserved. Read-list copy logs, shared helpers, route-level API
  error logging, and global logging policy remain separate.
- T-085 is complete: public shop product-list reads now share
  `getShopProductList` between `ShopProductsLoader` and
  `GET /api/v2/public/shop/products`, removing the loader's
  `NEXT_PUBLIC_BASE_URL`/localhost same-app HTTP dependency while preserving
  route validation, metadata, ID skipping/deduplication, Shopify fan-out, and
  focused service/route/loader coverage.
- T-086 is complete: `LogoutForm` pushes `/`, `MobileNavDrawer` uses
  `/api/auth/signin` for its current Sign Up and Log In links, and
  `src/app/project/page.tsx` redirects to `/project/about` without
  `VERCEL_URL` or localhost origin construction. Environment docs now mark
  `NEXT_PUBLIC_BASE_URL` as deprecated current-source configuration. Do not
  fold NextAuth/OAuth callback policy into this completed task.
- T-087 is complete: retired server-side same-app API wrapper entrypoints are
  deleted, the stale account favourites import/commented self-fetch block is
  removed, active source has no retired wrapper imports, and `src/lib/api` no
  longer carries `VERCEL_ENV`/`VERCEL_URL`/localhost same-app URL construction.
  Keep client API wrappers, route-specific fetcher factories, the MongoDB
  driver `serverApi` option, and OAuth callback policy separate.
- T-088 is complete: direct DB helper console calls, stale commented MongoDB
  connection blocks, and OAuth callback URL examples are removed from the
  scoped DB helper layer. `withDbConnect()` sequencing/rethrow behavior and
  `CustomMongoDBAdapter.createUser()` defaults/delegation are covered by
  focused tests. Keep global logging policy and build-time DB coupling
  separate.
- T-089 is complete: root-layout branch verification, Subnav link, ArticleView
  article/title, and UserCommentsView comments `console.log()` output were
  removed without changing rendering behavior, and
  `__tests__/unit/security/renderSourceHygiene.test.ts` covers the retired
  strings.
- T-090 is complete: direct public/account `console.log()` output was removed
  from the scoped client components and account page without changing
  filtering, comments, enquiry, subscription, saved-artwork, provider/session
  handoff, or pagination behavior. Focused source hygiene covers the removed
  debug strings.
- T-030 is complete and reconciled: it added the missing admin user/comment
  detail read routes, added focused route tests, and removed
  `admin.read.user` plus `admin.read.comment` from the T-029 route/fetcher
  parity allowlist.
- T-031 is complete and reconciled: it removed the unused favourite/watchlist
  API write fetchers, removed those four operations from the route/fetcher
  parity inventory and allowlist, and preserved the T-028 server-action
  saved-item mutation path.
- T-032 is complete: it removed the unused profile update fetcher, removed
  `user.profile.update` from the route/fetcher parity inventory, left
  `KNOWN_ROUTE_FETCHER_GAP_IDS` empty, and resolved F-037.
- T-033 is complete: it migrated user comment delete to the shared user guard
  before DB/transaction work, validates the comment ID before DB work, preserves
  transactional delete behavior, and returns the typed delete envelope.
- T-034 is complete: it hardened admin article create/update validation with
  strict route schemas, parsed allowlisted persistence, route-local
  `dbConnect()`, and focused route tests.
- T-035 is complete: it added route-safe public artwork browse query parsing
  for filter/sort/color/pagination params before session or artwork service
  work.
- T-036 is complete: it added route-safe public shop listing query parsing for
  repeated filters, product-type boolean strings, and optional `sortBy` before
  `dbConnect()`, MongoDB query construction, or Shopify product fan-out.
- T-037 is complete: it hardened admin artwork create/update validation with
  strict route schemas, canonical artwork constants, allowlisted persistence,
  optional replacement-image updates, route-local DB ownership, and focused
  route tests while leaving Shopify product-link editing separate.
- T-038 is complete: it hardened admin blog create/update validation with
  strict route schemas, allowlisted persistence, route-local DB ownership,
  slug-conflict handling, and focused route tests.
- T-039 is complete: it migrated admin article, artwork, blog, collection,
  comment, and user read routes to `requireApiAdmin()`, added target-read DB
  ownership, detail ID validation, and focused route tests.
- T-040 is complete: it migrated admin article, artwork, blog, collection,
  comment, and user delete routes to `requireApiAdmin()`, added ID validation
  before destructive target/session work, added route-local DB ownership, and
  preserved existing cascade behavior with focused route tests.
- T-041 is complete: it fixed middleware API redirect cleanup by returning
  shared JSON `401` for unauthenticated protected API callers, preserving
  frontend redirects and admin API/frontend denial behavior, and removing
  always-on middleware debug logs. Do not fold remaining user comment route
  migration, shared response-helper standardization, or Shopify decisions into
  its follow-up docs.
- T-042 is complete: it migrated user comment GET/POST/PATCH route-local auth
  to `requireApiUser()`, moved GET auth before DB/model work, preserved
  create/update/delete behavior, added focused comment route tests, and passed
  focused tests, lint, and build.
- T-043 is complete: it added static protected API guard inventory coverage for
  `src/app/api/v2/user` and `src/app/api/v2/admin`. Shared response-helper
  standardization, public optional-session policy, and logging cleanup remain
  separate.
- T-044 is complete: it added `src/lib/api/apiResponse.ts`, delegated
  `apiAuthError()` without changing the auth envelope, and migrated protected
  user profile/navigation/favourite/watchlist read routes to shared helpers
  with real `404`/`500` missing-resource/internal-failure statuses.
- T-045 is complete: it migrated public artwork/article/blog detail routes and
  populated blog-comment detail routes to shared success/error helpers with real
  `404`/`500` statuses, public-safe internal-failure bodies, and focused public
  route tests.
- T-046 is complete: it migrated public collection list/detail/artwork routes
  to shared success/error helpers, added explicit `dbConnect()` ownership, and
  added focused collection route tests.
- T-047 is complete: it migrated public navigation article/collection routes to
  the same shared response helpers, real public-safe `404`/`500` statuses,
  route-local `dbConnect()` ownership, debug-log removal in touched handlers,
  and focused public navigation route tests.
- T-048 is complete: it migrated admin article/artwork/blog/collection/comment
  and user read list/detail routes to shared response helpers while preserving
  `requireApiAdmin()` guard behavior, invalid-ID `400` contracts, success DTOs,
  metadata, and DB/auth ordering.
- T-049 is complete: it migrated admin article/artwork/blog/collection/comment
  and user delete routes to shared response helpers while preserving success
  messages, `data: null`, invalid-ID `400` contracts, conflict and not-found
  statuses, cascade behavior, transactions, and guard/DB ordering.
- T-050 is complete: it migrated admin article/artwork/blog/collection
  create/update routes to shared response helpers while preserving structured
  validation responses, create/update success contracts, `201` create statuses,
  not-found/conflict statuses, allowlisted persistence, and guard/DB ordering.
- T-051 is complete: it added focused public transform contract tests and fixed
  blog `readTime`, collection `firstArtworkId`, public user `isOwner`, and
  populated comment/blog ownership-context drift.
- T-052 is complete: it resolved the focused F-041 public artwork image
  contract slice for Cloudinary image sanitization, color-proximity metadata
  typing, and Cloudinary color schema tightening.
- T-053 is complete: it created
  [data-field-contracts.md](../architecture/data-field-contracts.md), covering
  article `section`, blog `imageUrl`/`pinned`/`tags`, and user `password`.
- T-054 is complete: it removed the stale admin filter `"collections"` article
  option by deriving section filters from `ARTICLE_SECTION_OPTIONS`, exported a
  narrow `ARTICLE_FILTER_OPTIONS` contract for coverage, and added focused
  schema/options regression tests.
- T-055 is complete: it aligned blog `imageUrl`, `pinned`, and `tags` runtime
  contracts across the model, route schemas, allowlisted admin create/update
  persistence, and focused tests while leaving visible pinned/tag admin workflow
  controls out of scope.
- T-056 is complete: it made persisted user passwords optional, denied
  credentials auth for OAuth-style users without stored hashes before bcrypt
  verification, preserved hashed credentials role propagation, and kept
  public/own password sanitization intact.
- T-057 is complete: it added shared numeric Shopify product ID
  normalization/GID construction for public product reads, preserved invalid
  path-ID `400`s before Shopify work, and skips malformed stored listing IDs
  before Shopify fan-out.
- T-058 is complete: it added `npm run audit:shopify-products`, a read-only
  MongoDB audit for artwork `shopifyProducts` links. It reports invalid IDs,
  unknown product types, within-artwork duplicates, and cross-artwork
  duplicates without writes or Shopify API calls. The live audit was not run in
  the implementation shell because `MONGO_URI` was not set.
- T-059 is complete: `npm run audit:shopify-products` exited `0` against the
  owner-approved MongoDB Atlas `laoutarisDB` target after scanning 215 artworks.
  The audit found 92 artworks with Shopify links, 99 total Shopify links, 0
  invalid product IDs, 0 unknown product types, 0 within-artwork duplicates,
  and 1 review-only cross-artwork book duplicate group for product
  `10538937319688` across 92 artworks. No Shopify APIs were called and no
  MongoDB data was mutated.
- T-060 is complete: it removed unsupported shop colour/dimension filters,
  stale client-only colour/dimension state, and placeholder pagination while
  preserving backed listing filters, product-type checkboxes, result count, and
  sort controls. Focused component tests, lint, and build passed.
- T-061 is complete: it added Shopify `productType` and `tags` to
  `SimpleProduct`, preserved those fields in list/handle/ID transforms, and
  replaced title-keyword default type sorting with metadata-based sorting.
- T-062 is complete: `SimpleProduct.variants` now preserves queried Shopify
  variant IDs, titles, availability, price money, compare-at price money, and
  optional variant image URL/alt text while leaving checkout/cart,
  product-detail CTA, and visible variant selection separate.
- T-063 is complete: `SimpleProduct.descriptionHtml` now preserves queried
  Shopify `descriptionHtml` across list, handle, and ID transforms while
  leaving rendering/sanitization policy, product-detail UI, checkout/cart,
  variant selection, pagination, and admin product-linking separate.
- T-064 is complete: it added the npm package-manager pin, Node 22 runtime
  policy, root Node version files, npm engine enforcement, lockfile metadata,
  and `npm ci` install docs, while leaving CI/dependency-update automation,
  Vercel project-setting ownership, and Next/PostCSS package decisions
  separate.
- T-065 is complete: it updated the environment runbook from source-search
  evidence and A-007 context without reading local `.env` files, recording
  secret values, changing runtime config, or deciding credential rotation.
- T-066 is complete: it added a Cloudinary signing parameter allowlist for the
  current admin upload widget, restricted signing to `timestamp`,
  `upload_preset: "laoutaris_art"`, and `source: "uw"`, preserved
  `requireApiAdmin()` and top-level signature compatibility, and left upload
  preset ownership, folder policy, asset lifecycle, credential rotation, and
  broader Cloudinary operations separate.
- T-067 is complete: it removed direct debug logging, polling, and DOM/iframe
  inspection from `src/components/elements/buttons/UploadButton.tsx` while
  preserving the current `CldUploadWidget` preset, signing endpoint, options,
  loading/open behavior, and success callback. Focused source/component tests
  cover the preserved behavior and no-console invariant. Keep global logging
  policy and broader Cloudinary upload policy separate.
- T-068 is complete: it removed direct public shop `console.log` debug output
  from `src/app/api/v2/public/shop/products/route.ts`,
  `src/components/compositions/ShopProductGallery.tsx`, and
  `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`, replaced the
  loader's console-directed public error hint, and added focused
  source/API/component/loader regression coverage. Keep same-app HTTP
  migration, pagination, checkout/cart, admin linking, and global logging
  policy separate.
- T-069 is complete: it removed direct `console.log` request/URL/response debug
  output from `src/lib/api/core/createFetcher.ts` plus constructed/final URL
  logs and stale commented URL debug blocks from
  `src/lib/api/public/serverPublicApi.ts`,
  `src/lib/api/user/serverUserApi.ts`, and
  `src/lib/api/admin/serverAdminApi.ts`. Focused source hygiene and fetcher
  behavior tests preserve the existing fetch contract. ADR 0004 migrations,
  base URL policy, Next `headers()` migration, remaining build/DB/SSR noise,
  and global logging policy remain separate.
- T-070 is complete: it added the shared server-only
  `getCollectionNavigationList` service, reused it from both
  `GET /api/v2/public/navigation/collections` and
  `CollectionsSubnavLoader`, removed the loader's `serverPublicApi` same-app
  HTTP dependency, preserved route envelopes, metadata, `404`, public-safe
  `500`, link construction, selection, ordering, and transform behavior, and
  passed focused tests, lint, build, and diff-check verification.
- T-071 is complete: it added the shared server-only
  `getArticleNavigationList` service, reused it from
  `GET /api/v2/public/navigation/articles/[section]`,
  `BiographySubnavLoader`, and `MainNavLoader`, reused
  `getCollectionNavigationList` for the main nav collection link, removed those
  loader same-app HTTP dependencies, preserved route envelopes and link path
  formats, and passed focused tests, lint, build, and diff-check verification.
- T-072 is complete: `src/app/biography/page.tsx` and the navigation path in
  `src/components/loaders/viewLoaders/ArticleLoader.tsx` now use
  `getArticleNavigationList`. `ArticleLoader` article-detail fetching remains
  separate.
- T-073 is complete: `src/app/collections/page.tsx` now uses
  `getCollectionNavigationList`, `src/app/collections/[slug]/page.tsx` and
  `GET /api/v2/public/navigation/collections/[slug]` now use
  `getCollectionNavigationItem`, the slug debug `console.log` is removed, and
  collection artworks navigation/detail pages remain separate.
- T-074 is complete: `src/components/loaders/viewLoaders/ArticleLoader.tsx`
  and `GET /api/v2/public/article/[slug]` now share
  `getArticleBySlugPopulated`; the route preserves the optional session lookup
  before service work plus response envelopes, and `ArticleLoader` preserves
  `ArticleView` props, optional form rendering, and previous/next navigation.
- T-075 is complete: `src/components/loaders/viewLoaders/BlogDetailLoader.tsx`,
  `GET /api/v2/public/blog/[slug]`, and
  `GET /api/v2/public/blog/[slug]/comments` now share
  `getBlogBySlugWithAuthor` and `getBlogBySlugWithComments`; the route
  contracts and both `showComments` modes are preserved, and the loader's
  direct result debug logs are removed.
- T-076 is complete: `BlogListLoader`, `BlogSectionLoader`, and
  `GET /api/v2/public/blog` now share `getBlogList`; blog list/section props,
  current sort behavior, metadata, and route contracts are preserved, and the
  touched public blog list query `console.log` is removed.
- T-077 is complete: `ArtworkLoader` now calls `getUserIdFromSession()` and
  `getArtworkById(params.id, userId)` directly, preserving `ArtworkView` props,
  the subscribe section, and generic load-failure behavior while removing the
  touched debug delay and result log.
- T-078 is complete: `CollectionArtworkLoader`,
  `CollectionArtworksPaginationLoader`,
  `GET /api/v2/public/collection/[slug]/artwork`, and
  `GET /api/v2/public/collection/[slug]/artwork/[id]` now share
  `getCollectionWithArtworks` and `getCollectionArtwork`; the loaders no
  longer use same-app HTTP for collection artwork reads.
- T-079 is complete: `BiographySectionLoader` and
  `GET /api/v2/public/article` now share `getArticleList`; the loader no longer
  uses same-app HTTP for biography articles, and the route's current success,
  no-results, and public-safe `500` bodies are preserved.
- T-080 is complete: `CollectionSectionLoader` and
  `GET /api/v2/public/collection` now share `getCollectionList`; the loader no
  longer uses same-app HTTP for collection list reads, and the route's current
  success, missing-list, public-safe `500`, metadata, and empty-list semantics
  are preserved.
- T-081 is complete: `AccountSubnavLoader` and
  `GET /api/v2/user/navigation` now share `getOwnUserNavigation`; the loader no
  longer uses same-app HTTP for user navigation reads, and the route's current
  `requireApiUser()` guard, success envelope, user-missing `404`, and
  public-safe `500` body are preserved.
- The worktree is expected to be dirty from recent completed tasks and
  orchestration updates. Do not revert or overwrite unrelated files. Run
  `git status --short` before edits and treat existing changes as other agents'
  work unless the owner explicitly asks for cleanup.
- Chat history is not canonical. If chat and docs disagree, use the docs and
  update them before commissioning the next agent.

## Current Facts

- `AGENTS.md` is the first-read operating guide for all agents.
- `docs/README.md` is the canonical documentation index.
- Workstream briefs exist for production-readiness implementation areas.
- Audit goals and result files exist for discovery work.
- Architecture refactor, unused-code pruning, SSR/data-fetching, and testing
  reliability are first-class audit and workstream concerns.
- This orchestration guide now defines how a successor agent should take over.
- Audit reconciliation now has a dedicated findings register and review process.
- Orchestrator-assigned goals must start with `/goal` and include `effort:
  high` or `effort: xhigh`.
- Orchestrator assignments must be one-line pointers to canonical docs, not
  large prompt blocks.
- Because assignments are one-line pointers, the linked details doc must be
  complete before commissioning an agent.
- Concurrent audit agents should assume they are not alone in the repo and should
  keep edits scoped to assigned result files unless told otherwise.
- Completed audits A-001, A-006, A-012, A-013, A-014, and A-015 have been
  reconciled into the findings register, risk tracker, workstream backlogs, and
  required process/ADR/runbook docs.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md) is accepted and
  chooses direct server data-access services over same-app HTTP self-fetching for
  server loaders, API routes, and server actions.
- Completed audits A-002, A-003, A-004, and A-007 have been reconciled into the
  findings register, risk tracker, and workstream backlogs.
- T-001 through T-023 are complete. They removed `MONGO_URI` exposure from Next
  config, persisted credentials roles into JWT/session state, made stable
  `session.user.id` the protected-read ownership source, standardized the
  public single Shopify product API contract, hardened the Cloudinary signing
  route guard and validation, added the server-only Next config env guard,
  replaced product-detail linked artwork self-fetching with a server-only data
  path, and replaced the product detail `Add to Cart` placeholder with a
  first-release enquiry handoff. The latest batch removed registration
  credential logs and the Shopify token-shaped source comment, hardened public
  enquiry validation, patched the current-major production dependency baseline,
  hardened user comment create/update validation, repaired the active sign-in
  flow, split residual dependency advisories into explicit follow-up tasks,
  completed the Next major migration preflight, upgraded bcrypt to 6.0.0,
  hardened subscription validation, proved the `/artwork` list ADR 0004
  service pattern, pruned the legacy custom auth/session path, hardened admin
  collection writes, migrated public search to a server-only service, and
  removed confirmed-unused direct package candidates. T-023 removed bcrypt and
  credentials password verification from the normal public-page import path by
  lazy-loading credentials authorize inside the NextAuth credentials provider.
- Completed audits A-008, A-016, and A-019 have been reconciled into the
  findings register, risk tracker, workstream backlogs, result files, and task
  briefs.
- T-015 found no accepted stable Next target that clears both residual
  Next/PostCSS advisories: stable `next@16.2.6` still bundles vulnerable
  `postcss@8.4.31`, while canary `16.3.0-canary.6+` clears isolated audit
  output but requires explicit owner acceptance.
- T-016 removed the bcrypt production advisory path, removed helper credential
  logging, and verified bcrypt 6 hash compatibility.
- T-017 resolved subscription server-action validation and public-safe failure
  handling.
- T-018 partially mitigated the remaining same-app HTTP/server data-access risk
  by moving `/artwork` initial list loading to `getArtworkList`.
- T-019 resolved the stale custom login/session path and `/protected` route
  pruning; now-unused `jose` is a package-cleanup candidate.
- T-020 resolved the admin collection create/update validation slice, T-034
  resolved the admin article create/update validation slice, T-037 resolved the
  admin artwork create/update validation slice, and T-038 resolved the admin
  blog create/update validation slice.
- T-021 partially mitigated public query bounds and ADR 0004 migration by
  moving public search to `getPublicSearchResults`; T-035 completed artwork
  browse query bounds, and T-036 completed shop browse query bounds.
- T-022 resolved the package cleanup slice for confirmed-unused direct
  dependencies and removed the unused `core-js` install-script path.
- The Vercel bcrypt native trace incident is fixed locally by tracing bcrypt
  prebuilds in `next.config.mjs`; T-023 also removes bcrypt from the normal
  public-page import path locally.
- T-024 is complete. After `origin/main` advanced to
  `820d45f1e155ddc700879f6afef803bea57cbf02`, matching local `HEAD` with the
  T-023 auth import-boundary change, the owner reported the Vercel deployment no
  longer crashes and a fresh `curl -I /` returned `HTTP/2 200`.
- T-025 is complete. The deployment runbook now contains repeatable Vercel smoke
  evidence fields, route/status expectations, credentials smoke secret handling,
  targeted log requirements, and rollback triggers. `npm run smoke:public`
  covers unauthenticated public-route status checks without secrets.
- T-026 is complete. It introduced shared route-local user/admin API guards,
  migrated admin collection create/update plus user profile auth-status
  behavior, and passed focused route/guard tests, lint, and build.
- T-027 is complete. It applied `requireApiUser()` to user navigation,
  favourites, and watchlist read routes with real JSON `401` responses before
  DB/model work, added explicit watchlist read-route DB ownership, and passed
  focused saved-route guard tests, lint, and build.
- T-028 is complete. It added explicit favourite/watchlist server-action
  `dbConnect()` ownership before model work, affected-route revalidation after
  successful toggles, defensive saved-item input handling, and focused action
  tests.
- T-029 is complete. It added a static route/fetcher parity inventory test with
  a self-checking known-gap allowlist for F-037 and found no additional
  mismatches.
- T-030 is complete. It added the active admin user/comment detail read routes
  behind the shared admin guard, added focused route tests, and reduced the
  T-029 known-gap allowlist to the five remaining favourite/watchlist/profile
  entries.
- T-031 is complete. It removed the unused favourite/watchlist write fetchers
  and reduced the T-029 known-gap allowlist to only `user.profile.update`.
- T-032 is complete. It removed the unused profile update fetcher instead of
  adding an unscoped profile edit route, emptied the parity allowlist, and
  resolved F-037.
- T-033 is complete. It hardened user comment delete auth/status/envelope
  behavior without changing comment create/update or admin comment delete.
- T-034 is complete. It applies the T-020 admin write-validation pattern to
  article create/update with strict schemas, allowlisted persistence,
  route-local `dbConnect()`, session-owned create authors, structured validation
  errors, and focused route tests.
- T-035 is complete. It validates and bounds public artwork browse query params
  before session lookup and artwork list service calls, with focused route
  coverage.
- T-036 is complete. It validates public shop listing repeated filters,
  product-type boolean strings, and optional `sortBy` before DB or Shopify work,
  without changing checkout, product ID migration, server-side sorting, or
  pagination behavior.
- T-037 is complete. It applies the T-020/T-034 admin write-validation pattern
  to artwork create/update with strict route schemas, allowlisted persistence,
  route-local `dbConnect()`, optional replacement-image updates, structured
  validation errors, and focused route tests.
- T-038 is complete. It applies the T-020/T-034/T-037 admin write-validation
  pattern to blog create/update with strict route schemas, allowlisted
  persistence, route-local `dbConnect()`, structured validation errors,
  slug-conflict handling, and focused route tests.
- T-039 is complete. It migrated admin read routes from `isAdmin()` to
  `requireApiAdmin()`, added explicit target-read DB ownership, returned
  structured JSON `400` for invalid detail IDs before target reads, preserved
  existing read response semantics, and passed focused route tests, lint, and
  build.
- T-040 is complete. It migrated admin delete routes from `isAdmin()` to
  `requireApiAdmin()`, returned shared JSON `401`/`403` guard responses before
  destructive work, added structured JSON `400` invalid-ID handling before
  target/session work, preserved existing delete/cascade semantics, and passed
  focused route tests, lint, and build.
- T-041 is complete. It resolved the middleware-level F-036 auth-status gap so
  protected API callers receive JSON `401` responses rather than NextAuth
  sign-in redirects while frontend protected routes keep their redirect
  behavior.
- T-042 is complete. It moved user comment GET/POST/PATCH handlers to
  `requireApiUser()` before body, DB, model, or transaction work, preserved
  comment validation/DTO behavior, and returned real GET missing-user/internal
  failure statuses.
- T-043 is complete. It locks the protected route-local guard invariant with a
  static inventory test before moving on to response-helper or logging-policy
  work.
- T-044 is complete. It introduced a small shared API response helper and
  applied it only to protected user profile, navigation, favourite, and
  watchlist read routes before any broader response-helper migration.
- T-045 is complete. It applied the same helper to public content detail routes
  before broader public list/search/navigation, admin, or logging-policy work.
- T-046 is complete. It applied the same helper to public collection APIs before
  broader public navigation or admin response-helper work.
- T-047 is complete. It applied the same helper to public navigation APIs
  before broader admin response-helper, logging-policy, or field-contract work.
- T-048 is complete. It applied the same helper to admin read APIs before
  broader admin write/delete response-helper, logging-policy, or field-contract
  work.
- T-049 is complete. It applied the same helper pattern to admin delete APIs
  before broader admin create/update response-helper, logging-policy, or
  field-contract work.
- T-050 is complete. It applied the same helper pattern to admin create/update
  APIs before broader field-contract, Shopify product-linking, or logging-policy
  work.
- T-051 is complete. It resolved the focused F-040 public transform drift for
  blog `readTime`, collection `firstArtworkId`, public user `isOwner`, and
  comment ownership-state propagation through populated blog/comment paths.
- T-052 is complete: public artwork transforms now sanitize nested Cloudinary
  image DTOs, omit `image.public_id`, preserve `similarityScore` as optional
  public-only image metadata for color-proximity results, and validate
  persisted color arrays as strict `{ color, percentage }` objects without
  changing upload policy or Shopify behavior.
- T-053 is complete. It created the F-039 field contract matrix for article
  `section`, blog `imageUrl`/`pinned`/`tags`, and user `password` in
  [data-field-contracts.md](../architecture/data-field-contracts.md).
- T-054 is complete. It aligned admin article section UI options with
  `ARTICLE_SECTION_OPTIONS` and added focused regression coverage that
  `"collections"` remains invalid for article sections while collection routes
  remain separate.
- T-055 is complete. It aligned blog `imageUrl`, `pinned`, and `tags`
  model/schema/admin route contracts while leaving visible admin workflow and
  public filtering behavior separate.
- T-056 is complete. It aligned optional persisted user password typing and
  credentials/OAuth behavior while preserving credentials password requirements,
  hashed-user role propagation, and public/own password sanitization.
- The highest current blockers are residual Next/PostCSS production advisories,
  owner/legal privacy and commerce policy requirements, owner confirmation of
  whether the removed Shopify value requires rotation, Vercel project-setting
  and rollback ownership, monitoring/incident-response ownership, broader
  root-layout DB/session/cache ownership, staged ADR 0004 server data-access
  migrations, CI/dependency-update automation, Cloudinary lifecycle/preset
  policy, admin bootstrap/recovery, and the broader CORS/CSP and logging policy
  decisions.

## Active Audits

Prepared but not commissioned:

- None. Current follow-up work is scoped as implementation, docs, or
  reconciliation tasks.

Completed and reconciled:

- [A-001 Shopify commerce readiness](../audits/results/A-001-shopify-commerce.md)
- [A-002 Public, user, and admin API contracts](../audits/results/A-002-api-contracts.md)
- [A-003 Data models, schemas, and transforms](../audits/results/A-003-data-models-transforms.md)
- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [A-005 Frontend routes and component boundaries](../audits/results/A-005-frontend-routes-components.md)
- [A-006 Testing and quality baseline](../audits/results/A-006-testing-quality-baseline.md)
- [A-007 Deployment and environment readiness](../audits/results/A-007-deployment-environment.md)
- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [A-009 Cloudinary and asset operations](../audits/results/A-009-cloudinary-assets.md)
- [A-010 Performance, SEO, and accessibility](../audits/results/A-010-performance-seo-accessibility.md)
- [A-011 Admin content operations](../audits/results/A-011-admin-content-operations.md)
- [A-012 Documentation and handoff quality](../audits/results/A-012-documentation-knowledge-base.md)
- [A-013 Architecture refactor scope](../audits/results/A-013-architecture-refactor-scope.md)
- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [A-015 SSR and data-fetching strategy](../audits/results/A-015-ssr-data-fetching.md)
- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-017 Search, navigation, and content discovery](../audits/results/A-017-search-navigation-discovery.md)
- [A-018 Translations, copy, and content taxonomy](../audits/results/A-018-translations-content-taxonomy.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [A-020 Privacy, consent, and commerce compliance](../audits/results/A-020-privacy-consent-commerce-compliance.md)
- [A-021 Observability and incident response](../audits/results/A-021-observability-incident-response.md)
- [A-022 Next.js feature utilization](../audits/results/A-022-nextjs-feature-utilization.md)
- [A-023 Playwright adoption priorities](../audits/results/A-023-playwright-adoption-priorities.md)
- [A-024 Loading state UX](../audits/results/A-024-loading-state-ux.md)

Superseded recalibration goals:

- [A-025 Codebase progress and trajectory recalibration](../audits/results/A-025-codebase-trajectory-recalibration.md)
- [A-029 Admin, auth, and operations hotspot scan](../audits/results/A-029-admin-auth-ops-hotspots.md)

Completed recalibration audits, tracker-reconciled by T-262 and T-267:

- [A-026 Tracker alignment snapshot](../audits/results/A-026-tracker-alignment-snapshot.md)
- [A-028 Public archive and Shopify runtime hotspot scan](../audits/results/A-028-public-shopify-hotspots.md)
- [A-030 Admin delete integrity snapshot](../audits/results/A-030-admin-delete-integrity.md)
- [A-031 Admin content controls snapshot](../audits/results/A-031-admin-content-controls.md)
- [A-032 Auth and protected boundary snapshot](../audits/results/A-032-auth-protected-boundaries.md)
- [A-033 Deployment, monitoring, and smoke snapshot](../audits/results/A-033-deployment-monitoring-smoke.md)
- [A-027 Verification gate snapshot](../audits/results/A-027-verification-gate-snapshot.md)
- [A-034 Current Jest failure triage](../audits/results/A-034-current-jest-failure-triage.md)
- [A-035 Build-time external dependency map](../audits/results/A-035-build-external-dependency-map.md)
- Recalibration candidate findings and completed task outcomes from A-028,
  A-030, A-031, A-032, A-033, A-034, A-035, and T-263 through T-273 are
  reconciled into F-123 through F-146 and R-034 through R-038.

## Recommended Next Audits

No new audit is recommended before the current follow-up tasks. A-034 and A-035
already split the verification/build questions into smaller actionable slices.

## Open Coordination Tasks

- Use `/goal effort: high` by default when commissioning audit work; reserve
  `effort: xhigh` for broad, ambiguous, or high-risk cross-cutting audits.
- Update and review the relevant details doc first, then commission agents with a
  one-line `/goal` or `/task` pointer.
- Keep future audit result status in sync with `docs/audits/goals.md` and
  `docs/audits/results/README.md`.
- Keep [findings-register.md](../audits/findings-register.md) in sync with
  future completed audit results.
- Convert future completed audit findings into workstream backlog items before
  assigning implementation work.
- Keep completed-audit findings linked when assigning implementation work after
  reconciliation, including A-001 through A-024 and completed recalibration
  results A-026 through A-028 and A-030 through A-035.
- Add ADRs when architecture or process decisions become settled.
- Keep High severity risks visible and linked to active work.
- Resolve or escalate owner decisions captured in the findings register:
  checkout scope, admin Shopify linking, i18n scope, auth/session pruning,
  Shopify credential verification/rotation, residual Next/PostCSS dependency
  risk, public enquiry/commercial contact ownership, privacy/compliance policy
  requirements, Cloudinary runtime cleanup and image-field implementation
  ownership, monitoring provider choice, and incident-response ownership.
- Resolve or escalate the remaining A-002/A-007 decisions: admin API route
  convention, cleanup of unused legacy/public environment candidates, Vercel
  rollback owner, and Cloudinary upload preset ownership.

## Next Orchestrator Action

The recommended next assignments are:

- T-285, T-286, and T-287 are complete. Do not reassign the local typecheck,
  local verification ownership, or CI policy scoping tasks unless those package
  scripts or policy docs regress.
- T-288 is complete. Do not reassign the non-secret Main CI local-gate workflow
  unless the workflow, local-gate commands, or CI policy docs regress.
- T-289 and T-290 are complete. Do not reassign the OAuth role/session
  propagation coverage or legacy session-helper inventory unless those
  contracts regress.
- T-291 is complete. Do not reassign the legacy session-helper pruning task
  unless those deleted helpers or stale test references return.
- T-194 and T-292 are complete. Do not reassign the framed-preview visual QA or
  responsive scaling fix unless `/prototype/frame` room/modal fit regresses.
- The next prepared assignment is:
  `/task effort: high details: docs/tasks/T-293-review-live-sale-gallery-visual-qa.md`.
- T-274 is complete as a docs packet. Do not assign monitoring, Vercel,
  credentialed-smoke, scheduled-smoke, or incident-owner implementation until
  the owner answers
  [the production ops decision packet](../runbooks/production-ops-owner-decision-packet.md).
- Keep product-page rail adoption, Shopify option mapping, checkout/cart work,
  enquiry mutation, physical-dimension migration, real texture asset creation,
  and room-background selection paused until scoped owner decisions or later
  tasks. T-293 should only review the current live sale gallery.
- Keep scheduled/detail public smoke, credentialed/admin smoke, Vercel log
  evidence, and production ops ownership under the owner-blocked F-126/R-038
  path.

For the homepage prototype track, most section-content decisions from
[T-162 Review homepage prototype visual QA](../tasks/T-162-review-homepage-prototype-visual-qa.md)
remain open: biography order, canonical dates, blog content strategy,
shop/commerce wording, and mobile teaser density. Do not move prototype
sections into the live homepage or start the semantic style-map pilot until the
owner accepts the expanded prototype direction.

No further decision-light admin delete implementation task is open after
T-165/T-172/T-178. Production delete use remains an operating-policy question:
use the admin content runbook checklist and keep Cloudinary asset lifecycle,
monitoring-provider ownership, broader backup/restore/rollback decisions, and
owner approval separate unless explicitly assigned.

T-143 is complete: public search widening landed in stages through T-210 and
T-211. Do not reopen search scope unless a regression or new product
requirement is filed. T-212 is complete: the R-018 owner/legal compliance
decision packet records owner approval for implementation scoping. T-213 is
complete: public `/privacy`, `/terms`, and footer legal links are in place.
T-214 is complete: newsletter consent/source metadata and unsubscribe behavior
are in place. T-215 is complete: account privacy/terms acknowledgement and
manual privacy request handoff are in place. T-216 is complete: public comment
posting notice and manual moderation/removal request handoff are in place.
T-217 is complete: contact/product and artwork enquiry privacy and retention
notice is in place. T-218 is complete: footer placeholder social links are
removed and stale copyright text is refreshed. T-219 is complete: remaining
owner-input blockers are recorded before any more R-018 runtime work. T-207 is
complete: public route fallback patterns are documented and `/project/aims`
uses a route-local neutral fallback. Keep Shopify policy URL wiring, real
social URL wiring, jurisdiction/audience-specific legal work, future
self-service privacy workflows, and future comment moderation/reporting
workflows separate until those decisions exist.

T-139 is complete as ADR 0005. Do not reassign monitoring decision work unless
the owner/platform decision changes; implementation remains blocked until a
provider, no-provider launch posture, or launch-blocking decision is approved.
Owner-approved incident roles and backups remain a separate owner/orchestrator
decision after T-134's blocked handoff.

T-059, T-066, T-067, T-068, T-069, T-070, T-071, T-072, T-073, T-074, T-075,
T-076, T-077, T-078, T-079, T-080, T-081, T-082, T-083, T-084, T-085, T-086,
T-087, T-088, T-089, T-090, T-091, and T-092 are complete; do not reassign
them unless a regression or explicit follow-up is opened. T-093 is also
complete and should not be reassigned unless a regression is opened. T-094 is
complete and should not be reassigned unless a regression is opened. T-095,
T-096, T-097, T-098, T-099, T-100, T-101, T-102, T-103, T-104, T-105, T-106,
T-107, T-108, T-109, T-110, T-111, T-112, T-113, T-114, T-115, T-116, T-117,
T-118, T-119, T-120, T-121, T-122, T-123, T-124, T-125, T-126, T-127, T-128,
T-129, T-130, T-131, T-132, T-133, T-134, T-135, T-136, T-137, T-138, T-139, T-140,
T-141, T-142, T-144, T-145, T-146, T-147, T-148, T-149, T-150, T-151, T-152,
T-153, T-154, T-155, T-156, T-157, T-158, T-159, T-160, T-161, T-162, T-163,
T-164, T-165, T-166, T-167, T-168, T-169, T-170, T-171, T-172, T-173, T-174,
T-175, T-176, T-177, T-178, T-179, T-180, T-181, T-182, T-183, T-184, T-185,
T-186, T-197, T-198, T-199, T-200, T-201, T-202, T-203, T-204, T-205, T-206,
T-207, T-208, T-209, T-210, T-211, T-212, T-213, T-214, T-215, T-216, T-217,
T-218, and T-219 are complete and should not be reassigned unless a regression
is opened.

Keep automatic data mutation, persistence-time Shopify API validation,
checkout/cart ownership, Cloudinary runtime deletion, signed folder params,
future image-field model migrations, full strict CSP
allowlist design, dynamic per-origin CORS, HSTS rollout, global production
logging/redaction policy,
CI/dependency-update automation, Vercel project-setting ownership, credential
rotation, and the residual Next/PostCSS owner decision separate unless priority
changes.

Keep the immediate bcrypt tracing include in `next.config.mjs` until a future
native-dependency policy explicitly replaces it. Use the T-025 deployment smoke
checklist for future deployment, runtime, auth, Shopify, and route-contract
changes.
