# Current Orchestration State

Last updated: 2026-05-18

## Current Priority

T-109 is prepared as the next implementation slice from F-089:
[Normalize public landmarks and headings](../tasks/T-109-normalize-public-landmarks-headings.md).
It should normalize public-page main landmark ownership and demote
presentational repeated `h1` usage without changing visible layout, route data,
commerce behavior, or admin/account workflows.

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
discovery files for stable public routes. Richer breadcrumb structured data,
dynamic-detail sitemap expansion, deployment smoke assertions, and route cache
policy remain separate.

T-102 is complete. It removed global root-layout DB/session work, avoided
middleware token parsing for unprotected public routes, and recorded remaining
route-local dynamic blockers from build output. Build now prerenders shell-only
public routes including `/biography`, `/collections`, `/project`,
`/project/about`, `/project/aims`, `/project/film`, and `/shop`.

A-010 is complete and reconciled into F-084 through F-090, R-012/R-014/R-030/
R-031, relevant workstreams, T-102 through T-109. Remaining owner-independent
follow-ups after T-109 include route-local cache/ISR policy, artwork-to-shop
SSR discovery, and richer discovery structured data.

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

T-109 public landmark/heading cleanup task is prepared and ready to assign.
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
- T-109 is prepared and ready to assign: normalize public main landmark
  ownership and presentational heading hierarchy without visual redesign.
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

None currently active.

Completed and reconciled:

- [A-001 Shopify commerce readiness](../audits/results/A-001-shopify-commerce.md)
- [A-006 Testing and quality baseline](../audits/results/A-006-testing-quality-baseline.md)
- [A-012 Documentation and handoff quality](../audits/results/A-012-documentation-knowledge-base.md)
- [A-013 Architecture refactor scope](../audits/results/A-013-architecture-refactor-scope.md)
- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [A-015 SSR and data-fetching strategy](../audits/results/A-015-ssr-data-fetching.md)
- [A-002 Public, user, and admin API contracts](../audits/results/A-002-api-contracts.md)
- [A-003 Data models, schemas, and transforms](../audits/results/A-003-data-models-transforms.md)
- [A-004 Auth, admin, and permission boundaries](../audits/results/A-004-auth-admin-permissions.md)
- [A-007 Deployment and environment readiness](../audits/results/A-007-deployment-environment.md)
- [A-008 Security headers, CORS, and logging](../audits/results/A-008-security-headers-cors-logging.md)
- [A-016 Forms, validation, and user input](../audits/results/A-016-forms-validation-inputs.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [A-009 Cloudinary and asset operations](../audits/results/A-009-cloudinary-assets.md)
- [A-010 Performance, SEO, and accessibility](../audits/results/A-010-performance-seo-accessibility.md)
- [A-020 Privacy, consent, and commerce compliance](../audits/results/A-020-privacy-consent-commerce-compliance.md)
- [A-021 Observability and incident response](../audits/results/A-021-observability-incident-response.md)

## Recommended Next Audits

Good follow-up audits after the next implementation batch is assigned or
completed:

1. [A-011 Admin content operations](../audits/goals.md#a-011-admin-content-operations)
2. [A-017 Search, navigation, and content discovery](../audits/goals.md#a-017-search-navigation-and-content-discovery)
3. [A-018 Translations, copy, and content taxonomy](../audits/goals.md#a-018-translations-copy-and-content-taxonomy)

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
- Keep A-002, A-003, A-004, A-007, A-008, A-009, A-010, A-016, A-019, A-020,
  and A-021 reconciled findings linked when assigning implementation work.
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

Assign the next implementation task:

```text
/task effort: high details: docs/tasks/T-109-normalize-public-landmarks-headings.md
```

After T-109 is assigned or completed, choose route-local cache/ISR policy from
the T-102 build output, artwork-to-shop SSR discovery from F-090, A-011 admin
content operations, A-017 search/navigation discovery, richer breadcrumb/
dynamic-detail discovery work from F-085/R-030, the next Cloudinary follow-up
from T-101, or another owner-independent implementation slice from reconciled
findings.

T-059, T-066, T-067, T-068, T-069, T-070, T-071, T-072, T-073, T-074, T-075,
T-076, T-077, T-078, T-079, T-080, T-081, T-082, T-083, T-084, T-085, T-086,
T-087, T-088, T-089, T-090, T-091, and T-092 are complete; do not reassign
them unless a regression or explicit follow-up is opened. T-093 is also
complete and should not be reassigned unless a regression is opened. T-094 is
complete and should not be reassigned unless a regression is opened. T-095,
T-096, T-097, T-098, T-099, T-100, T-101, T-102, T-103, T-104, T-105, T-106,
T-107, and T-108 are complete and
should not be reassigned unless a regression is opened.

Keep automatic data mutation, persistence-time Shopify API validation,
checkout/cart ownership, Cloudinary runtime deletion, signed folder params,
image-field migrations, delivery-transform helper extraction, full strict CSP
allowlist design, dynamic per-origin CORS, HSTS rollout, global production
logging/redaction policy, visible blog pinned/tag admin workflow,
CI/dependency-update automation, Vercel project-setting ownership, credential
rotation, and the residual Next/PostCSS owner decision separate unless priority
changes.

Keep the immediate bcrypt tracing include in `next.config.mjs` until a future
native-dependency policy explicitly replaces it. Use the T-025 deployment smoke
checklist for future deployment, runtime, auth, Shopify, and route-contract
changes.
