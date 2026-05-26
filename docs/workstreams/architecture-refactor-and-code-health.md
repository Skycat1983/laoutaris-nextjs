# Architecture Refactor And Code Health Workstream

Status: Active

Goal: identify and execute structural refactors that make the app easier to
scale, safer to test, and simpler for agents to modify without carrying unused
or inconsistent code forward.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Rendering and data fetching](../architecture/rendering-and-data-fetching.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-013 Architecture refactor scope](../audits/goals.md#a-013-architecture-refactor-scope)
- [A-014 Unused code and dependency pruning](../audits/goals.md#a-014-unused-code-and-dependency-pruning)
- [A-015 SSR and data-fetching strategy](../audits/goals.md#a-015-ssr-and-data-fetching-strategy)
- [A-022 Next.js feature utilization](../audits/goals.md#a-022-nextjs-feature-utilization)

## Blocks

- Safe large-scale refactors.
- Reliable server-side rendering strategy.
- Dead-code pruning without accidental behavior loss.
- Stable reusable patterns for future Shopify and admin work.

## Related Code Areas

- `src/app/`
- `src/components/`
- `src/lib/`
- `src/hooks/`
- `src/contexts/`
- `package.json`
- `__tests__/`

## Current Facts

- The app already uses Next.js App Router and server components in some routes.
- Loader, view, composition, module, and element patterns exist but need
  ownership boundaries and consistency checks.
- Historical shop notes show that client/server import boundaries have already
  caused runtime problems.
- Project owner reports that server-side rendering and testing have been
  attempted but are not yet successfully established as reliable patterns.
- Root and component-level code likely contains WIP, historical, or unused paths
  that should be audited before pruning.
- A-013, A-014, and A-015 are complete and reconciled.
- A-022 is complete and reconciled. It confirmed the app is using App Router,
  server loaders, direct server data services, metadata conventions, image/font
  optimization, and source guards well, but needs a staged Next.js efficiency
  sequence: repair the client import-boundary regression, narrow middleware
  matching, define public data freshness, then pilot ISR/cached public reads.
  T-230 completed the import-boundary repair, T-231 narrowed middleware
  matching, T-232 defined public freshness, T-233 completed the biography
  cached-service proof, T-238 completed the collections redirect/navigation
  proof, and T-239 made `/sitemap.xml` one-hour ISR source-owned.
- [ADR 0004](../decisions/0004-server-data-access-ownership.md) is accepted:
  server loaders, API routes, and server actions should share direct
  server-only data-access services instead of same-app HTTP fetches.
- A-002 found the admin API action-segment convention is not documented as
  canonical.
- A-007 found production URL construction is hard-coded and inconsistent across
  server fetchers, shop loaders, and redirects.
- T-007 completed a small ADR 0004-aligned slice for the shop product detail
  page: linked artwork now uses a server-only artwork-by-ID data service shared
  by the public artwork detail API route and product detail page.
- T-014 created T-015 to audit the Next major migration surface before package
  edits, including App Router, middleware, image optimization, server-side
  rendering, Node runtime, and verification risks.
- T-015 inventoried the Next 14 -> 16 code risk: synchronous App Router
  `params`/`searchParams`, synchronous `cookies()`/`headers()` usage,
  `middleware.ts` -> `proxy.ts`, custom webpack config under Turbopack default
  (removed on 2026-05-24 after Next.js reverted the dev `devtool` override),
  `next/image` default changes, and lint/tooling migration.
- T-018 completed the broader `/artwork` list proof route for ADR 0004:
  `ArtworkListLoader` and `GET /api/v2/public/artwork` now share the
  server-only `getArtworkList` data service instead of relying on same-app HTTP
  for the initial artwork list.
- T-021 applied the ADR 0004 service-adapter pattern to public search:
  `/search` and `GET /api/v2/public/search` now share the server-only
  `getPublicSearchResults` service instead of relying on same-app HTTP for the
  initial search render.
- T-070 applied the ADR 0004 service-adapter pattern to the collections subnav:
  `CollectionsSubnavLoader` and
  `GET /api/v2/public/navigation/collections` now share the server-only
  `getCollectionNavigationList` service instead of same-app HTTP for the
  initial navigation links.
- T-071 completed the next ADR 0004 service-adapter slice for article
  navigation: `BiographySubnavLoader`, the then-dynamic `MainNavLoader`, and
  `GET /api/v2/public/navigation/articles/[section]` shared the server-only
  `getArticleNavigationList` service, and `MainNavLoader` reused
  `getCollectionNavigationList` for its collection link. T-283 later made the
  global header nav static-safe by moving `MainNavLoader` to route-root links
  for `/biography` and `/collections`.
- T-072 finished the current article-navigation cleanup by moving the biography
  default redirect page and `ArticleLoader` navigation path to
  `getArticleNavigationList` while leaving article detail fetching separate.
- T-073 completed the collection navigation redirect service-adapter slice:
  `/collections`, `/collections/[slug]`, and
  `GET /api/v2/public/navigation/collections/[slug]` now share server-only
  collection navigation services instead of same-app HTTP for redirect data.
- T-074 completed the next ADR 0004 service-adapter slice:
  `ArticleLoader` and `GET /api/v2/public/article/[slug]` now share
  `getArticleBySlugPopulated` for populated article detail data.
- T-075 completed the next ADR 0004 service-adapter slice:
  `BlogDetailLoader`, `GET /api/v2/public/blog/[slug]`, and
  `GET /api/v2/public/blog/[slug]/comments` now share server-only blog detail
  services.
- T-076 completed the ADR 0004 service-adapter slice for `BlogListLoader`,
  `BlogSectionLoader`, and `GET /api/v2/public/blog`.
- T-077 completed the loader-only ADR 0004 slice for `ArtworkLoader`, reusing
  the existing `getArtworkById` service that already backs the public artwork
  detail route.
- T-078 completed the next ADR 0004 route-family slice:
  `CollectionArtworkLoader`, `CollectionArtworksPaginationLoader`, and the
  public collection artwork routes now share server-only collection artwork
  services.
- T-079 completed the next ADR 0004 slice for `BiographySectionLoader`
  and `GET /api/v2/public/article`, which now share `getArticleList`.
- T-080 completed the next ADR 0004 slice for `CollectionSectionLoader`
  and `GET /api/v2/public/collection`, which now share `getCollectionList`.
- T-081 completed the ADR 0004 slice for `AccountSubnavLoader` and
  `GET /api/v2/user/navigation`.
- T-083 completed the ADR 0004 slice for account favourites/watchlist loaders
  and protected user saved-artwork read routes.
- T-084 completed the ADR 0004 slice for account settings/comments loaders and
  protected user profile/comment read routes.
- T-085 completed the ADR 0004 slice for the initial public shop product list:
  `ShopProductsLoader` and `GET /api/v2/public/shop/products` now share
  server-only `getShopProductList` service logic instead of same-app HTTP.
- A targeted source search after T-085 found no remaining same-app HTTP imports
  or direct same-app `fetch()` calls under `src/components/loaders`. Remaining
  localhost/base URL occurrences are in shared server API helpers, an auth
  redirect comment, and `src/app/project/page.tsx`; those are separate URL
  policy tasks.
- T-086 removed hard-coded same-app origins from `LogoutForm`,
  `MobileNavDrawer`, and the `/project` redirect by using relative app paths.
  That left the shared server API helper policy path and a historical OAuth
  callback comment for later cleanup.
- T-087 retired the server-side same-app API wrapper entrypoints after the
  route-critical callers were migrated. `src/app/account/favourites/page.tsx`
  now keeps only the current `/account/settings` redirect, active source no
  longer imports the retired wrappers, and `src/lib/api` no longer owns
  runtime `VERCEL_ENV`/`VERCEL_URL`/localhost base URL construction.
- T-137 added a recursive static client runtime import-graph guard for current
  and future `"use client"` entries, and the first inventory passes without an
  allowlist.
- A-010 found the next rendering architecture gap: despite completed self-HTTP
  cleanup, public routes still build as dynamic because root layout performs
  request-time DB/session work and middleware parses tokens before protected
  route checks. T-111 closed the artwork-to-shop discovery client-fetch gap for
  artwork detail pages.
- T-088 removed direct DB helper logging and stale commented MongoDB
  connection/OAuth callback examples from `src/lib/db` while preserving the
  existing connection/retry/cache behavior and adapter-created user defaults.
- T-089 removed direct render logging from root layout, `Subnav`, article
  views, and account comments without changing the current root-layout
  DB/session ownership or public/account component contracts.
- T-090 removed the remaining scoped user-facing public/account direct
  `console.log()` output and added source-hygiene coverage. The only adjacent
  contract cleanup was renaming `ArtworkGallery`'s callee-facing starting-data
  and filter-default props while preserving the loader and filter-control
  behavior.
- T-095 removed the stale commented `console.log()` snippets from scoped auth,
  session provider, public collection, main navigation, and admin layout
  source. Full-source source-hygiene coverage now keeps `src` free of direct or
  commented `console.log()` calls.
- T-125 documented the non-route logging/redaction policy for services,
  loaders, server actions, client components, utilities, and provider clients,
  including the 2026-05-18 source inventory and migration order. T-126 is the
  first planned implementation slice for public server loaders and App Router
  pages.
- T-126 completed the first policy-aligned non-route logging implementation
  slice by adding a requestless server structured logger and routing public
  loader/App Router page failure paths through it without changing current
  fallback, redirect, or rendering/cache contracts.
- T-127 completed the next policy-aligned provider/data service logging slice
  for scoped Shopify client and product resolver failures without changing
  product DTOs, Storefront cache policy, linked-product fallback behavior, or
  public shop contracts.
- T-128 completed the next policy-aligned server-side logging slice for scoped
  server actions and the development test-header session helper without
  changing action return contracts, saved-item mutation/revalidation behavior,
  or normal/development session-helper behavior.
- T-129 completed the remaining account saved-artwork server-loader logging
  slice without changing the favourite artwork detail fallback UI, success
  rendering, saved-artwork service behavior, no same-app HTTP/fetch behavior, or
  Next.js control-flow error handling.
- T-022 completed the package-focused cleanup for confirmed-unused direct
  dependency candidates, keeping lockfile churn out of source-pruning tasks.
  A-014 source-file pruning remains a separate follow-up.
- The 2026-05-14 Vercel bcrypt incident showed another root-layout ownership
  problem: at incident time `src/app/layout.tsx` imported `authOptions`, which
  eagerly imported the credentials authorize path and native bcrypt for every
  public page render.
- T-023 completed the auth import-boundary slice: root-layout/session auth
  imports no longer load credentials password verification or native bcrypt
  unless a credentials authorize flow is running.
- T-273 added the admin dashboard frontend persisted-role guard as a server-only
  session helper imported only by the admin dashboard server layout, preserving
  the client/server import-boundary guard.
- T-283 made the global root header main navigation static-safe by removing
  live biography and collection navigation service reads from `MainNavLoader`.
  The header now links to stable `/biography` and `/collections` route roots,
  leaving first-item redirect behavior with those route pages.

## Backlog

- Use the completed T-007, T-018, and T-021 proof routes as templates to migrate
  remaining route-critical loaders off same-app HTTP in small slices and retire
  `serverApi` usage from server loaders/actions.
- Maintain the T-137 client/server import-boundary guard when new client
  components, barrels, or data-service modules are added. T-230 restored the
  guard after the A-022 `SignUpForm` -> `@/lib/constants` regression.
- Plan scoped adoption of the T-170 semantic style map only after owner review
  accepts the expanded homepage prototype direction.
- Ensure every MongoDB-backed API route and server action reaches the database
  only through a service or shared wrapper that calls `dbConnect()`.
- Move route-neutral DB/session work out of the root layout so dynamic rendering
  and cache policy can be owned by the routes that need them.
- Document route-specific cache/revalidation policy for public archive,
  authenticated, admin, and Shopify data. T-232 completed the docs-first
  public freshness decision for sitemap/default redirects and selected
  biography as the first cache proof route; T-233 completed that first runtime
  ISR/cache proof with cached biography wrappers and `/biography` redirect ISR.
- Scope public client-provider/client-island reductions after the import-boundary
  and cache policy work. T-234 measured the current root provider/client island
  cost and scoped T-236 as the first runtime proof: lazy-load public mobile
  search/navigation drawers before root provider moves.
- Remove non-action top-level `"use server"` directives in a low-risk cleanup
  slice after higher-priority boundary/cache work. T-235 owns that cleanup.
- Consolidate taxonomy/filter option sources across constants, schemas, public
  filters, admin forms, and shop filters.
- Centralize app route builders, API route builders, and auth path constants;
  remove hard-coded localhost/same-app absolute routes.
- Document whether admin action-segment API routes are canonical, or open an ADR
  for migration to resource-oriented routes before mixing conventions.
- Use T-015's inventory before any future Next major package edit; especially
  convert async request APIs, middleware/proxy, and fetch/cache behavior in a
  package-owner implementation task after the owner accepts a stable target.

## Acceptance Criteria

- Architecture refactor scope is documented with priority and risk.
- Dead-code candidates are listed with evidence before removal.
- Rendering and data-fetching patterns are documented and linked from relevant
  workstreams.
- Refactors preserve public behavior and improve testability.
- Deleted code has verification evidence or a clear reason it is unreachable.

## Verification

```bash
npm test
npm run build
npm run lint
```

Use targeted import/reference searches for pruning tasks.

## Progress

- Workstream created to make architecture refactor, pruning, SSR, and scalable
  patterns first-class production-readiness scope.
- 2026-05-25: Completed T-284. `/prototype/home` now has an explicit
  `force-dynamic` route policy, preserving live prototype data at request time
  while removing its MongoDB/Shopify prototype loaders from production static
  generation.
- 2026-05-14: A-013, A-014, and A-015 findings reconciled into
  `docs/audits/findings-register.md`, production risks,
  [ADR 0004](../decisions/0004-server-data-access-ownership.md), and this
  backlog.
- 2026-05-14: [ADR 0004](../decisions/0004-server-data-access-ownership.md)
  accepted direct server data-access services as the canonical pattern for
  loaders, API routes, and server actions. No runtime code was changed in the
  decision task.
- 2026-05-14: Reconciled A-002/A-007 architecture-adjacent findings into F-030
  and F-050, production risks, and this backlog.
- 2026-05-14: Prepared T-007 to remove one same-app HTTP path from Shopify
  product detail without broadening into the full `/artwork` list migration.
- 2026-05-14: Completed T-007; added `getArtworkById` as a server-only
  MongoDB/transform helper, reused it from the public artwork detail API route,
  and removed `/shop/products/[productHandle]` linked artwork same-app HTTP.
- 2026-05-14: T-014 added T-015 as a Next major migration preflight audit so
  framework/runtime architecture risks are scoped before dependency edits.
- 2026-05-14: Completed T-015; it found no accepted stable Next target that
  clears both residual advisories yet, and documented the App Router,
  middleware/proxy, headers/cookies, image, webpack/Turbopack, lint, caching,
  and verification surfaces for the future migration.
- 2026-05-24: Removed the obsolete `next.config.mjs` development `devtool`
  webpack override. `next dev` no longer reports the improper-devtool warning;
  remaining Next migration surfaces still need a scoped package-upgrade task.
- 2026-05-14: Prepared T-018 to extract the public artwork list query into a
  shared server-only data service used by both `ArtworkListLoader` and
  `GET /api/v2/public/artwork`.
- 2026-05-14: Completed T-018; added `getArtworkList`, refactored the public
  artwork list API route and `ArtworkListLoader` to share it, removed the
  loader's same-app HTTP dependency, and added focused service/API/loader tests.
- 2026-05-14: Prepared T-021 to migrate public search to a server-only service
  and T-022 to handle unused dependency cleanup separately from source
  refactors.
- 2026-05-14: Completed T-021; added `getPublicSearchResults`, refactored the
  public search API route and `/search` page to share it, removed the search
  page's same-app HTTP dependency, and added focused service/API/page tests.
- 2026-05-14: Completed T-022 by removing unused direct dependencies from the
  manifest and lockfile while leaving A-014 runtime/source pruning for a later
  staged task.
- 2026-05-14: Recorded the Vercel bcrypt native trace incident as new evidence
  for root-layout blast radius and prepared T-023 to lazy/decouple credentials
  bcrypt imports from public session reads.
- 2026-05-14: Completed T-023 by lazy-loading the credentials authorize
  implementation inside the NextAuth credentials provider, keeping bcrypt out of
  normal root-layout public imports, and adding focused auth/root-layout
  import-boundary tests.
- 2026-05-16: Prepared T-069 as a no-behavior-change cleanup for shared fetcher
  and server API URL-helper debug logs. It intentionally preserves same-app HTTP
  and base URL construction while leaving the next ADR 0004 migration separate.
- 2026-05-16: Completed T-069; shared fetcher and server API URL-helper direct
  `console.log` debug output and stale URL debug blocks are removed, with
  focused source hygiene and fetcher behavior coverage. Same-app HTTP and base
  URL construction remain intentionally unchanged for later ADR 0004 slices.
- 2026-05-16: Prepared T-070 as the next focused ADR 0004/F-021 migration. It
  moves `CollectionsSubnavLoader` off same-app HTTP by sharing collection
  navigation data access with the public collection navigation route.
- 2026-05-16: Completed T-070; added `getCollectionNavigationList`, refactored
  the public collection navigation API route and `CollectionsSubnavLoader` to
  share it, removed the loader's same-app HTTP dependency, and added focused
  service/API/loader tests.
- 2026-05-16: Prepared T-071 as the next focused ADR 0004/F-021 migration. It
  moves `BiographySubnavLoader` and `MainNavLoader` off article-navigation
  same-app HTTP by sharing article navigation data access with the public
  article navigation route, and it reuses T-070's collection navigation service
  for the main nav collection link.
- 2026-05-16: Completed T-071; added `getArticleNavigationList`, refactored
  the public article navigation API route, `BiographySubnavLoader`, and
  `MainNavLoader` to share it, reused `getCollectionNavigationList` from the
  main nav, removed those loaders' navigation same-app HTTP dependency, and
  added focused service/API/loader tests.
- 2026-05-16: Prepared T-072 to remove the remaining article-navigation
  same-app HTTP calls from `src/app/biography/page.tsx` and the navigation path
  in `ArticleLoader`, while leaving article-detail service extraction separate.
- 2026-05-16: Completed T-072; `src/app/biography/page.tsx` now calls
  `getArticleNavigationList("biography")` directly for its default redirect,
  and `ArticleLoader` now calls `getArticleNavigationList(section)` for
  previous/next navigation while intentionally keeping article detail on
  `serverApi.public.article.singlePopulated(slug)`.
- 2026-05-16: Completed T-073; added `getCollectionNavigationItem`, refactored
  the collection navigation item API route and collection redirect pages to use
  server-only collection navigation services, removed the slug page debug
  `console.log`, and added focused service/API/page tests.
- 2026-05-16: Completed T-074; added `getArticleBySlugPopulated`,
  refactored the public article detail API route and `ArticleLoader` to share
  it, removed the loader's `serverApi.public.article.singlePopulated(slug)`
  same-app HTTP dependency, and added focused service/API/loader tests.
- 2026-05-16: Completed T-075; added `getBlogBySlugWithAuthor` and
  `getBlogBySlugWithComments`, refactored both public blog detail routes and
  `BlogDetailLoader` to share them, removed the loader's `serverPublicApi`
  blog detail dependency, removed direct result debug logging, and added
  focused service/API/loader tests.
- 2026-05-16: Prepared T-076 to move `BlogListLoader` and
  `BlogSectionLoader` off same-app HTTP by sharing blog list data access with
  `GET /api/v2/public/blog`, while keeping blog detail/comment behavior,
  unrelated loaders, route URL/base URL policy, root-layout ownership, and
  cache policy separate.
- 2026-05-16: Completed T-076; added `getBlogList`, refactored the public blog
  list route, `BlogListLoader`, and `BlogSectionLoader` to share it, removed
  the loaders' same-app blog list HTTP dependency, removed the touched route
  query debug log, and added focused service/API/loader tests.
- 2026-05-16: Prepared T-077 to move `ArtworkLoader` off same-app HTTP by
  reusing the existing `getArtworkById` service, while keeping the public
  artwork detail route, collection artwork loaders/routes, route URL/base URL
  policy, root-layout ownership, and cache policy separate.
- 2026-05-16: Completed T-077; `ArtworkLoader` now calls
  `getUserIdFromSession()` and `getArtworkById(params.id, userId)` directly,
  no longer imports `serverApi`, no longer waits on the debug `delay`, and no
  longer emits direct result `console.log` output.
- 2026-05-16: Prepared T-078 to move the collection artwork detail and
  pagination loaders off same-app HTTP by sharing server-only collection
  artwork service logic with
  `GET /api/v2/public/collection/[slug]/artwork` and
  `GET /api/v2/public/collection/[slug]/artwork/[id]`.
- 2026-05-16: Completed T-078; added `getCollectionWithArtworks` and
  `getCollectionArtwork`, refactored the two public collection artwork routes
  and the two collection artwork loaders to share them, removed the loaders'
  collection artwork same-app HTTP dependencies, and added focused
  service/API/loader tests.
- 2026-05-16: Prepared T-079 to move `BiographySectionLoader` off same-app
  HTTP by sharing article list service logic with
  `GET /api/v2/public/article`, while keeping `CollectionSectionLoader`,
  article detail/navigation routes, account/shop loaders, cache policy, and
  route URL/base URL policy separate.
- 2026-05-16: Completed T-079; added `getArticleList`, refactored
  `BiographySectionLoader` and `GET /api/v2/public/article` to share it,
  removed the loader's article list same-app HTTP dependency, removed touched
  article list route debug logs, and added focused service/API/loader tests.
- 2026-05-16: Prepared T-080 to move `CollectionSectionLoader` off same-app
  HTTP by sharing collection list service logic with
  `GET /api/v2/public/collection`, while keeping collection detail/artwork/
  navigation routes, account/shop loaders, cache policy, and route URL/base URL
  policy separate.
- 2026-05-16: Completed T-080; added `getCollectionList`, refactored
  `CollectionSectionLoader` and `GET /api/v2/public/collection` to share it,
  removed the loader's collection list same-app HTTP dependency, preserved the
  public route's success/missing-list/public-safe failure bodies and empty-list
  success semantics, and added focused service/API/loader tests.
- 2026-05-17: Prepared T-081 to move `AccountSubnavLoader` off same-app HTTP
  by sharing account navigation service logic with
  `GET /api/v2/user/navigation`, while keeping favourites/watchlist loaders,
  user comments/settings loaders, shop loaders, middleware/global auth policy,
  cache policy, and route URL/base URL policy separate.
- 2026-05-17: Completed T-081; added `getOwnUserNavigation`, refactored
  `AccountSubnavLoader` and `GET /api/v2/user/navigation` to share it, removed
  the loader's user-navigation same-app HTTP dependency, preserved the route's
  `requireApiUser()` guard and response envelopes, and added focused service,
  route, and loader tests.
- 2026-05-17: Completed T-083; added saved-artwork server-only services for
  current-user favourites/watchlist list and detail reads, refactored the four
  protected user saved-artwork read routes and four account saved-artwork
  loaders to share them, removed those loaders' same-app HTTP dependencies,
  and added focused service, route-adapter, loader, parity, and guard-inventory
  coverage.
- 2026-05-17: Completed T-084; added `getOwnUserProfile` and
  `getOwnUserComments`, refactored the protected user profile/comment GET
  routes and account settings/comments loaders to share them, removed those
  loaders' same-app HTTP dependencies, and added focused service,
  route-adapter, loader, parity, and guard-inventory coverage.
- 2026-05-17: Completed T-085; added `getShopProductList`, refactored
  `GET /api/v2/public/shop/products` and `ShopProductsLoader` to share it,
  removed the loader's `NEXT_PUBLIC_BASE_URL`/localhost same-app HTTP
  dependency, preserved route query validation and success/error envelopes, and
  added focused service, route-adapter, and loader no-self-fetch tests.
- 2026-05-17: Prepared T-086 as the next F-030 URL ownership slice. It should
  replace hard-coded same-app origins in `LogoutForm`, `MobileNavDrawer`, and
  `src/app/project/page.tsx` with relative app paths, while leaving shared
  server API helper base URL policy and broad route-builder centralization
  separate.
- 2026-05-17: Completed T-086; `LogoutForm`, `MobileNavDrawer`, and
  `src/app/project/page.tsx` now use relative app paths for home navigation,
  auth account links, and the `/project/about` redirect. The shared server API
  helper base URL policy remains separate.
- 2026-05-17: Prepared T-087 to retire the unused server-side same-app API
  wrappers after confirming no active route-critical caller remains. It should
  remove the stale account favourites import/commented block, delete the server
  wrapper entrypoints, and preserve client API wrappers plus route-specific
  fetcher factories.
- 2026-05-17: Completed T-087; deleted the retired server-side same-app API
  wrapper entrypoints, removed the stale account favourites import/commented
  self-fetch block, preserved client API wrappers and route-specific fetcher
  factories, and added source hygiene coverage for deleted wrappers, retired
  imports, and retired same-app server URL construction.
- 2026-05-17: Prepared T-088 to remove direct debug logging and stale commented
  connection/OAuth callback examples from the MongoDB helper layer while
  preserving DB connection, retry, cache, and auth adapter behavior.
- 2026-05-17: Completed T-088; `src/lib/db/mongodb.ts`,
  `clientPromise.ts`, `connectWithRetry.ts`, and `adapter.ts` no longer contain
  direct console calls, `mongodb.ts` no longer carries stale old connection
  blocks or OAuth callback URL examples, and focused source hygiene plus DB
  helper behavior tests cover the cleaned contracts.
- 2026-05-17: Prepared T-089 to remove direct public/account render debug logs
  from root layout, `Subnav`, article views, and account comments while
  preserving behavior and leaving root-layout DB/session ownership separate.
- 2026-05-17: Completed T-089; the scoped public/account render files no
  longer contain direct `console.log()` calls or retired branch/link/article/
  title/comments debug strings, with focused source-hygiene coverage.
- 2026-05-17: Prepared T-090 to remove remaining user-facing public/account
  `console.log()` output from scoped client components and account pages while
  leaving admin dashboard logging and global logging policy separate.
- 2026-05-17: Completed T-090; the scoped public/account client/page files no
  longer contain direct `console.log()` calls or retired debug strings, and
  focused source hygiene covers the invariant. `ArtworkListLoader` still owns
  the initial search-param-derived sort/filter inputs, while `ArtworkGallery`
  consumes them through neutral starting-data/default prop names.
- 2026-05-17: Prepared T-093 as a small shared UI/public fetcher source
  hygiene slice. It should remove direct debug output from `Feed`, `NavItem`,
  `RefreshButton`, `YoutubeEmbedding`, and the public artwork fetcher while
  preserving component contracts and artwork query construction.
- 2026-05-17: Completed T-093; the scoped shared UI components and public
  artwork fetcher no longer contain direct `console.log()` calls, and the
  public artwork fetcher URL-construction contract is covered by focused tests.
- 2026-05-17: Prepared T-095 as a source-hygiene cleanup for stale commented
  `console.log()` snippets after T-094 removed the last active direct
  `console.log()` calls.
- 2026-05-17: Completed T-095 by removing the stale commented `console.log()`
  snippets from the scoped auth, session provider, public collection, main
  navigation, and admin layout source. Full-source source-hygiene coverage now
  keeps `src` free of direct or commented `console.log()` calls.
- 2026-05-18: Reconciled A-010 architecture findings into F-084 and F-090.
  Next architecture work should separate public/auth layout and middleware
  ownership before promising static/ISR behavior, and treat server-rendered
  artwork-to-shop discovery as a focused service/loader follow-up.
- 2026-05-18: Prepared T-102 for the public/auth layout and middleware
  boundary. It removes the global root-layout DB/session blocker first and
  records any remaining route-local dynamic blockers rather than attempting a
  full static/ISR migration.
- 2026-05-18: Completed T-102 by moving DB/session ownership out of the root
  layout and behind route-local loaders/pages, and by making middleware return
  early for unprotected public paths before calling `getToken()`. Remaining
  dynamic public routes are now explicit route-local cache/data/session follow-
  ups instead of global shell blockers.
- 2026-05-18: Prepared T-110 to codify route-local public rendering/cache
  policy, document the public route matrix, and add conservative segment
  configs or source invariants where current dynamic behavior is intentional.
- 2026-05-18: Completed T-110 by making route-local public rendering/cache
  ownership explicit in the rendering architecture doc, adding conservative
  `force-dynamic` segment config to public pages already dynamic after T-102,
  and adding source invariants that prevent accidental ISR/static-param claims.
- 2026-05-18: Prepared T-111 to replace artwork-to-shop client fetches with a
  server-side resolver feeding the artwork detail view path.
- 2026-05-18: Completed T-111 by adding a server-only artwork-linked Shopify
  product resolver and threading its grouped summaries through the artwork
  detail loader/view path, removing `ArtworkShopSection` browser product
  fetches.
- 2026-05-18: Prepared T-115 as the narrow F-026 Shopify fetch cache policy
  cleanup for the `cache`/`next.revalidate` conflict surfaced by sitemap
  builds. Keep broader static/ISR migration and account/admin cache policy
  separate.
- 2026-05-18: Completed T-115; the shared Shopify client now owns a valid
  environment-specific Storefront fetch policy without combining `cache` and
  `next.revalidate`. Broader static/ISR migration and account/admin cache
  policy remain separate.
- 2026-05-18: Prepared T-125 to document the non-route logging/redaction policy
  and migration inventory before changing service, loader, action, client,
  utility, or provider-client console behavior.
- 2026-05-18: Completed T-125 by adding the logging/redaction architecture
  policy and grouping the remaining non-route direct `console.error()`/
  `console.warn()` calls into migration surfaces. T-126 later completed the
  first policy-aligned implementation slice for public server loaders and App
  Router pages.
- 2026-05-18: Completed T-126 by adding `createServerLogger()` and migrating
  the scoped public server loader/App Router page failure paths away from
  direct `console.error()` calls while preserving existing route behavior.
  Remaining logging implementation slices should follow the T-125 migration
  order and avoid broad rewrites.
- 2026-05-18: Prepared T-127 as the next policy-aligned provider/data service
  logging slice for Shopify client and product resolver failures.
- 2026-05-18: Completed T-127 by routing scoped Shopify provider/data service
  failure paths through requestless structured server logging and adding
  focused source hygiene for the touched files.
- 2026-05-18: Prepared T-128 as the next policy-aligned server-side logging
  slice for subscription, saved-item, and development test-header session
  helper failures.
- 2026-05-18: Completed T-128 by routing scoped subscription, saved-item, and
  development test-header session helper failure paths through requestless
  structured server logging with focused source hygiene.
- 2026-05-18: Prepared T-129 as the next policy-aligned server-loader logging
  slice for `FavouritedArtworkLoader`.
- 2026-05-18: Completed T-129 by routing `FavouritedArtworkLoader` recoverable
  failure logs through requestless structured server logging with focused
  source hygiene.
- 2026-05-18: Prepared T-130 as the first public browsing client console-error
  cleanup slice for artwork, blog, infinite-scroll, and shop browsing
  components.
- 2026-05-18: Completed T-130 and prepared T-131 as the next smaller
  account/user client console-error cleanup slice before admin dashboard or
  shared fetcher cleanup.
- 2026-05-18: Completed T-131 and prepared T-132 as the next smaller shared
  fetcher and low-value utility/helper console cleanup slice before the larger
  admin dashboard client cleanup.
- 2026-05-18: Completed T-132 by removing the scoped shared fetcher and
  low-value utility/helper direct `console.error()`/`console.warn()` calls
  without changing fetcher contracts, fallback strings, copy attempts, color
  fallback rendering, or blog sidebar state.
- 2026-05-19: Prepared T-133 as the remaining known non-route direct console
  cleanup slice for admin dashboard clients.
- 2026-05-19: Completed T-133 by removing the remaining known admin dashboard
  client direct `console.error()`/`console.warn()` calls without changing CRUD
  form, feed/list, copy, upload, operation-tab, or document-reader behavior.
- 2026-05-19: Completed T-137 by adding a recursive client runtime import graph
  guard, splitting `NavBarLink` into a client-safe type module, replacing
  scoped mixed-barrel imports with direct imports, and converting DTO/data
  imports to type-only imports where appropriate.
- 2026-05-20: Prepared T-161 as a read-only audit for a future central style
  system point of truth. It should inventory current Tailwind, global CSS,
  shadcn variables, font setup, typography helpers, layout components, and
  repeated class patterns before any runtime style migration.
- 2026-05-20: Completed T-161. The audit is now linked from the architecture
  index and recommends introducing a pure client-safe semantic class map with
  exact current class strings, piloted on `/prototype/home` before any Tailwind
  or global CSS token changes.
- 2026-05-20: Completed T-170. `src/lib/styles/semanticStyles.ts` now provides
  a pure client-safe semantic class map with exact existing class strings and
  focused source/invariant coverage. It is intentionally not adopted by runtime
  components yet.
- 2026-05-22: Prepared T-205 as the focused F-108/R-033 cleanup for remaining
  mixed component barrel value imports in server routes/loaders. T-137 still
  guards the current client runtime graph; T-205 is a preventive direct-import
  cleanup and source-hygiene slice, not a broad barrel deletion.
- 2026-05-22: Completed T-205. Scoped `src/app` and
  `src/components/loaders` server callers now avoid value imports from the
  mixed component barrels, and source-hygiene coverage guards the cleaned
  scopes. R-033 is mitigated for the reconciled A-005 route/loader scope.
- 2026-05-22: Prepared T-207 as the remaining A-005 route-local rendering
  follow-up. It should document route loading/fallback patterns in
  `docs/architecture/rendering-and-data-fetching.md` and replace the
  `/project/aims` generic inline loading fallback without changing broader
  cache, not-found, or route-builder policy.
- 2026-05-23: Completed T-207. The rendering/data-fetching architecture doc now
  owns the public route fallback pattern, and `/project/aims` no longer uses
  generic inline loading copy for the desktop image Suspense boundary.
- 2026-05-23: Reconciled A-022 into the findings register, R-012/R-025,
  `docs/architecture/rendering-and-data-fetching.md`, this backlog, and planned
  tasks T-230 through T-235. No runtime implementation was performed.
- 2026-05-23: Completed T-230. `SignUpForm` now imports account privacy
  acknowledgement field constants directly from
  `src/lib/constants/accountPrivacyAcknowledgement.ts`, restoring the
  recursive client/server import-boundary guard without changing the broad
  constants barrel or registration behavior.
- 2026-05-23: Completed T-231. `src/middleware.ts` now matches only protected
  frontend/API prefixes, and route protection utilities use exact-or-nested
  prefix semantics so public prefix lookalikes do not enter protected route
  behavior. The future `middleware.ts` -> `proxy.ts` rename remains in the
  Next major migration track.
- 2026-05-23: Completed T-232. The rendering/data-fetching architecture doc
  now defines explicit current and target freshness for sitemap, default
  redirects, public browse/detail/search/shop surfaces, and session-aware UI.
  T-233 should use biography as the first staged cached non-`fetch` service
  proof before generated params or broad route ISR.
- 2026-05-23: Completed T-233. Biography route-local detail, metadata,
  structured data, subnav, default redirect, and previous/next navigation now
  use cached non-`fetch` wrappers with a 10-minute stale window. `/biography`
  is the only route-level redirect ISR export added in the proof, and
  `/biography/[slug]` remains explicitly dynamic with no
  `generateStaticParams()`. Build verification recorded `/biography`
  `initialRevalidateSeconds: 600` while unrelated stable shells stayed
  deploy-bound; `MainNavLoader` stayed on the direct navigation service at this
  point to avoid root-header cache propagation across unrelated static routes.
- 2026-05-23: Scoped T-234. Provider movement remained deferred because
  `SessionProvider` and modal state are cross-cutting; T-236 was selected as
  the first runtime proof to defer only the public mobile search/navigation
  drawer implementations from the initial header path.
- 2026-05-23: Completed T-236. Public mobile search and navigation drawer
  bodies now lazy-load after first open intent while the labelled header
  triggers stay in the initial path. Root providers were not moved. Build
  evidence showed the root layout client chunk dropped from the T-234
  `35,174` byte baseline to `27,772` bytes, with separate `1,273` byte search
  and `7,433` byte mobile navigation drawer chunks.
- 2026-05-23: Completed T-235. Top-level `"use server"` directives were removed
  from ordinary App Router layouts/pages and server component/loader/navigation
  modules under `src/app` and `src/components`; actual action/session helper
  directives remain under `src/lib`.
- 2026-05-23: Completed T-237 as a docs-only scoping pass. Remaining F-111 and
  F-115 options were compared against source, docs, and current build output;
  T-238 was selected as the next safe route-family cache proof for
  `/collections` default redirect ISR and route-local collection navigation
  caching.
- 2026-05-24: Completed T-238. `/collections` now uses a 10-minute cached
  collection navigation wrapper plus matching route-level ISR for the default
  redirect, and `CollectionsSubnavLoader` uses the same cached wrapper for
  route-local navigation. Collection detail routes remain explicitly dynamic
  with no generated params. T-283 later removed global-header collection
  first-item resolution entirely in favor of static route-root links.
- 2026-05-24: Completed T-239. `/sitemap.xml` now exports
  `SITEMAP_REVALIDATE_SECONDS = 3600` plus matching route-level ISR, focused
  tests guard route-level `revalidate` drift outside `/biography`,
  `/collections`, and `/sitemap.xml`, and build/prerender-manifest evidence
  records `/sitemap.xml` as static with `initialRevalidateSeconds: 3600`.
- 2026-05-24: Completed T-240 as a docs-only A-022 efficiency planning slice.
  It selected T-241 as the first blog cache proof: cache primary blog detail
  reads for metadata, JSON-LD, and non-comments detail rendering while keeping
  `/blog`, `/blog/[slug]`, optional comments, list query variants, route-level
  blog ISR, and generated params separate.
- 2026-05-24: Completed T-241. Primary blog detail reads now use a 10-minute
  cached non-`fetch` wrapper for `/blog/[slug]` metadata, blog JSON-LD, and
  non-comments detail rendering. `/blog` and `/blog/[slug]` remain explicitly
  dynamic with no route-level blog ISR or generated params, comments remain on
  the direct comments service, and public blog API routes still use direct
  services.
- 2026-05-24: Completed T-242. The unfiltered `/blog` default grouped list now
  uses fixed 10-minute cached wrappers only for featured page 1 limit 5, latest
  page 1 limit 6, and popular page 1 limit 8. Sorted blog list rendering,
  `BlogSectionLoader`, public blog APIs, comments, route-level blog ISR,
  generated params, cache tags, and mutation revalidation remain direct or
  deferred.
- 2026-05-24: Completed T-243 as a docs-only sorted blog list scoping pass.
  Sorted list caching is deferred until public blog list query parsing is
  canonical and bounded. T-244 is the selected prerequisite to prevent `NaN`,
  malformed, or oversized `page`/`limit` inputs from becoming future sorted
  cache variants.
- 2026-05-24: Completed T-244. `/blog` and `GET /api/v2/public/blog` now use
  shared query parsing so page and API limit values are finite and bounded
  before reaching `BlogListLoader` or `getBlogList()`. No cache behavior,
  route-level blog ISR, generated params, cache tags, or mutation revalidation
  was added.
- 2026-05-24: Completed T-245. Sorted `/blog` first-page rendering now uses
  fixed 10-minute cached wrappers for latest, oldest, featured, and popular
  page 1 limit 10. Sorted pages beyond page 1, public blog APIs,
  `BlogSectionLoader`, comments, route-level blog ISR, generated params, cache
  tags, and mutation revalidation remain direct or deferred.
- 2026-05-24: Completed T-246 as a docs-only bounded sorted-page cache
  scoping pass. It selected T-247 to cache only `latest`, `oldest`, and
  `featured` sorted `/blog` pages 2-5 with fixed keys, while keeping `popular`
  pages beyond page 1 direct because comment-derived ordering can drift across
  page boundaries.
- 2026-05-24: Completed T-247. Sorted `/blog` rendering now uses fixed
  10-minute cached wrappers for `latest`, `oldest`, and `featured` pages 2-5
  with limit 10. Sorted page 1 still uses the T-245 dispatcher, and `popular`
  page 2-plus, sorted page 6-plus, public blog APIs, `BlogSectionLoader`,
  comments, route-level blog ISR, generated params, cache tags, and mutation
  revalidation remain direct or deferred.
- 2026-05-24: Completed T-248 as a docs-only next-cache-target scoping pass.
  It selected T-249 to cache only the default `/artwork` browse list read with
  a fixed 10-minute wrapper, while keeping artwork detail, filtered artwork
  browsing, public APIs, browser follow-up fetches, search, shop routes,
  Shopify product links, user/session state, cache tags, and mutation
  revalidation direct or deferred.
- 2026-05-24: Completed T-249. `ArtworkListLoader` now uses a fixed
  10-minute cached wrapper only for the default `/artwork` browse list shape:
  `mostRecent` page 1 limit 10, `filterMode: "ALL"`, no taxonomy filters, and
  no `sortColor`. Filtered variants, page 2-plus, non-default limits,
  `mostPopular`, `mostFeatured`, `colorProximity`, public artwork APIs,
  browser follow-up fetches, artwork detail, metadata/JSON-LD detail reads,
  saved-item/session-aware reads, and Shopify product links remain direct.
- 2026-05-24: Completed T-250 as a docs-only cache-efficiency scoping pass. It
  selected T-251 as the next narrow F-111 runtime proof: cache only fixed
  unfiltered `mostRecent` `/artwork` pages 2-5 with limit 10 while keeping
  artwork detail, collection-scoped detail, broader browse variants, search,
  shop, saved-item/session state, public APIs, browser follow-up fetches,
  route-level ISR, generated params, cache tags, and mutation revalidation
  deferred.
- 2026-05-24: Completed T-251. `ArtworkListLoader` now routes exact unfiltered
  `mostRecent` `/artwork` pages 1-5 with limit 10 through fixed 10-minute
  cached service wrappers, with page 1 still using the T-249 wrapper. Page
  6-plus, non-default limits, taxonomy filters, `filterMode: "ANY"`,
  `mostPopular`, `mostFeatured`, `colorProximity`, public APIs, browser
  follow-up fetches, detail reads, saved-item/session state, Shopify product
  links, route-level artwork ISR, generated params, cache tags, and mutation
  revalidation remain direct or deferred.
- 2026-05-24: Completed T-252 as a docs-only post-browse efficiency scoping
  pass. It paused F-111 runtime cache expansion because the remaining cache
  candidates now carry higher personalization, query-cardinality, Shopify, or
  mutation-revalidation risk, and selected T-253 as the next F-115
  provider/modal client-island scoping task.
- 2026-05-24: Completed T-253 as a docs-only root provider/modal scoping pass.
  It selected T-254 as the next F-115 runtime task: remove unused language
  state from the active root modal provider path and lazy-load the modal dialog
  host while keeping `ClientContextBoundary`, `SessionProvider`, and modal
  provider ownership at the existing root boundary.
- 2026-05-24: Completed T-254. `GlobalFeaturesProvider` is now modal-only,
  `TranslatedContent` owns its deferred language hook directly, and the
  root-mounted modal host lazy-loads the Headless UI dialog body only after
  modal intent. The root layout chunk measured `27,498` bytes uncompressed
  versus the T-236 `27,772` byte baseline; the Headless UI dialog code is in a
  lazy chunk, so the remaining above-target root size belongs to existing
  root/header client code outside T-254.
- 2026-05-24: Completed T-255 as a docs-only post-modal efficiency scoping
  pass. It selected T-256 as the next provider-preserving F-115 runtime slice:
  lazy-load the public header account navigation menu implementation after
  account-menu intent while keeping `ClientContextBoundary`, `SessionProvider`,
  and modal provider ownership rooted.
- 2026-05-24: Completed T-256. `AccountNav` now keeps a stable public header
  trigger shell and lazy-loads the account dropdown implementation after
  account-menu intent. `ClientContextBoundary`, `SessionProvider`, and modal
  provider ownership remain rooted. The root layout chunk measured `22,313`
  bytes uncompressed versus the T-254 `27,498` byte baseline, and the account
  dropdown implementation split to lazy chunk `1833.254d53090d3e3f31.js`.
- 2026-05-25: Completed T-273. The new admin frontend persisted-role guard is
  server-only and consumed by the admin dashboard server layout. Required
  client/server import-boundary coverage passed, including a small repair to an
  already-dirty shop-gallery WIP so `shopTypes` remains type-only in the client
  import graph.
- 2026-05-25: Completed T-281. Runtime public shop sort options moved from the
  unsafe data-types directory to `src/lib/data/options/shopSortOptions.ts`, and
  the focused client/server import-boundary suite passed.
- 2026-05-25: Completed T-278. Protected `/account*` routes no longer perform
  layout-level MongoDB work during release builds, the NextAuth raw MongoDB
  client promise is lazy on import, and MongoDB-backed `/project/about` now has
  an explicit dynamic route policy. Default-sandbox `npm run build` passed with
  `/account*` and `/project/about` rendered on demand.
- 2026-05-25: Completed T-283. `MainNavLoader` now builds the global header
  links from static route roots instead of reading biography and collection
  navigation services during root header rendering. `npm run build` passed
  without `loader.public.main_nav.failed` output.
- 2026-05-25: Completed T-290. The `src/lib/session` helper inventory
  classified `getUserIdFromSession.ts` and `requireAdminFrontendAccess.ts` as
  active, and routed unused `createUserFromSession.ts`,
  `getUserFromSession.ts`, and `isAdmin.ts` deletion to T-291.
- 2026-05-26: Completed T-291. The unused legacy
  `createUserFromSession.ts`, `getUserFromSession.ts`, and `isAdmin.ts`
  helpers were deleted with stale test-only references removed. Active
  `getUserIdFromSession.ts`, `requireAdminFrontendAccess.ts`, and protected API
  guard inventory coverage remained in place.
- 2026-05-26: Prepared T-299 as the first A-014 source pruning pass. It should
  re-verify and delete only high-confidence unused source leaves, unused
  barrels, and starter assets while keeping auth/session, i18n, dependency,
  route, commerce, and owner-decision cleanup separate.
- 2026-05-26: Completed T-299. The first A-014 source pruning pass deleted the
  scoped high-confidence unused source leaves, WIP/variant files, unused
  barrels, and starter assets after fresh reference checks. Auth/session, i18n,
  dependency, commerce, route, and owner-decision areas were left out of scope.
- 2026-05-26: Prepared T-300 as the remaining F-031 utility/import cleanup
  after T-299. It should re-check `filterWatchlerlist`, collection layout
  comment/import leftovers, and saved-item action import candidates while
  keeping auth/session, i18n, packages, root Shopify notes, route behavior,
  commerce, and owner decisions out of scope.
- 2026-05-26: Completed T-300. The remaining F-031 utility/import cleanup
  removed the unreferenced `filterWatchlerlist` helper and the stale collection
  slug layout comment/import leftovers after fresh reference checks. Saved-item
  action imports were left unchanged because `revalidatePath` and saved-button
  state type imports remain live.
- 2026-05-26: Prepared T-302 as a parallel-safe route-builder centralization
  scoping task. It should inventory current app/API/auth route construction and
  propose a narrow first implementation slice without editing runtime source or
  shared trackers during the parallel run.
- 2026-05-26: Completed T-302. The source-backed route-builder result selected
  public app route builders as the first implementation slice and deferred
  auth/protected routes, API route IDs/builders, admin action route
  conventions, smoke route constants, and cache policy.
- 2026-05-26: Prepared T-305 as the public app route-builder implementation
  slice. It can run in parallel with T-304/T-306 and should not edit shared
  trackers.

## Next Agent Action

T-278, T-279, T-283, and T-284 are complete. Keep `/biography`,
`/collections`, and `/sitemap.xml` on the T-279 external-build evidence policy
unless a new route-rendering task explicitly changes those paths. Use T-282 to
rebaseline local verification after the build-coupling repairs.

T-256 is complete. Do not make additional A-022/F-115 provider, session,
modal, or root-header runtime edits without a new scoped task that defines the
owned files, expected bundle target, account/auth/modal blast radius, and
focused verification. Keep `ClientContextBoundary`, `SessionProvider`, and
modal provider ownership rooted unless a later architecture decision explicitly
changes that contract.
Keep saved-item actions, auth/session behavior, account routes, admin dashboard
behavior, comment UI, contact/enquiry forms, shop behavior, cache policy, route
segment config, package files, Playwright setup, and CI workflows unchanged
unless a later task scopes one of those paths.
Keep page 6-plus artwork browse variants, non-default limits, taxonomy filters,
`filterMode: "ANY"`, `mostPopular`, `mostFeatured`, `colorProximity`, artwork
detail routes, collection-scoped artwork detail, public artwork APIs, browser
follow-up fetches, metadata/JSON-LD detail reads, optional Shopify product-link
reads, user/session state, route-level `/artwork` ISR, generated params, cache
tags, mutation revalidation, search, and shop routes separate unless a later
task explicitly owns one of those paths.
Keep `popular` blog pages beyond page 1, sorted blog page 6-plus, route-level
blog ISR, comment caching, provider moves, Shopify fetch changes, and broader
ISR separate unless a new task scopes them.

Do not reassign route-local rendering fallback documentation unless the
documented pattern or `/project/aims` source hygiene regresses. Broad
static/ISR and route-builder work remain separate architecture tasks outside
T-232/T-233.

Keep global CSS, Tailwind config, shadcn primitives, prototype runtime
adoption, and live homepage migration separate until owner review accepts the
expanded prototype direction and a visual-parity migration task is prepared.
Other architecture slices remain broad route-builder work, staged
source-pruning work, and remaining route-local rendering follow-ups. T-291
completed the scoped legacy `src/lib/session` helper pruning after T-290
inventory.
Do not reassign T-081, T-082, T-083, T-084, T-085, T-086, T-087, T-088,
T-089, T-090, T-091, T-092, T-093, T-094, T-095, T-137, T-205, T-230, or
T-231 unless a regression is opened.

Keep client API wrappers, route-specific fetcher factories, the MongoDB driver
`serverApi` option, DB connection semantics, broad route-builder centralization,
favourite/watchlist server actions, account navigation, cache policy,
root-layout session ownership, middleware/global auth policy, artwork-to-shop
SSR discovery, and remaining logging implementation slices outside the
completed T-126, T-127, T-128, and T-129 scopes separate
unless explicitly scoped.

Keep broader root-layout session/cache refactors separate from the completed
T-023 import-boundary mitigation. T-299 and T-300 resolved the scoped F-031
A-014 high-confidence source and utility/import pruning sequence. Do not
reassign that cleanup unless the deleted files/helpers or stale collection
layout comment/import leftovers reappear. Keep auth/session, i18n, package,
root Shopify note, route behavior, commerce, and owner-decision cleanup
separate. If Next dependency work takes priority, wait for
owner/orchestrator acceptance of a Next target, then use
[T-015 Audit Next Major Migration Preflight](../tasks/T-015-next-major-migration-preflight.md)
as the migration inventory for the package implementation task.

T-305 is ready to run in parallel with T-304 and T-306. It should add the first
client-safe public app route-builder slice and migrate only the selected public
route consumers. Do not touch auth/protected routes, API route IDs/builders,
admin action route conventions, smoke route constants, cache policy,
redirects, or shared trackers during the parallel run.
