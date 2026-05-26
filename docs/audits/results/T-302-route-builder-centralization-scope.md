# T-302 Route Builder Centralization Scope

Status: Completed
Date: 2026-05-26

## Assignment

Inventory app route, API route, auth/protected path, smoke-route, same-app URL,
and existing route-helper ownership so a future implementation task can
centralize builders without broad behavior churn.

Runtime source was not changed. This result owns only scoping and follow-up
recommendations.

## Source Discovery Commands

- `git status --short`
- `find src/app -maxdepth 6 -type f \( -name 'page.tsx' -o -name 'route.ts' -o -name 'layout.tsx' -o -name 'middleware.ts' -o -name 'sitemap.ts' -o -name 'robots.ts' \) | sort`
- `find src/app/api/v2 -type f -name 'route.ts' | sort`
- `rg -n "/api/v2/(public|user|admin)|/api/auth|/account|/admin|/sign-in|/artwork|/collections|/biography|/blog|/shop|/project|/search|/privacy|/terms|/newsletter|/prototype" src __tests__ scripts --glob '!**/*.json'`
- `rg -l "/api/v2" src __tests__ scripts --glob '!**/*.json' | sort`
- `rg -l "(/artwork|/collections|/biography|/blog|/shop|/project|/search|/account|/admin|/privacy|/terms|/sign-in|/newsletter|/prototype)" src __tests__ scripts --glob '!**/*.json' | sort`
- `rg -n "<Link|href=|redirect\\(|router\\.push|router\\.replace|useRouter|pathname\\.startsWith|canonical:|alternates" src/app src/components src/lib --glob '!**/*.json'`
- `rg -n "publicSite|PUBLIC_SITE|NEXT_PUBLIC_BASE_URL|VERCEL_URL|localhost|127\\.0\\.0\\.1|new URL\\(" src scripts __tests__ docs/tasks/T-302-scope-route-builder-centralization.md docs/architecture docs/workstreams --glob '!**/*.json'`
- Targeted reads of existing helpers, fetchers, middleware, sitemap/robots,
  smoke script, route-parity tests, and representative navigation/layout files.

## Current Source Map

### Existing Helpers And Constants

- `src/lib/constants/routeConstants.ts` owns partial auth/protection constants:
  `PROTECTED_FRONTEND_ROUTES`, `PROTECTED_API_ROUTES`, and a small
  `PUBLIC_ROUTES` set. It does not cover most public app routes, legal routes,
  prototype routes, admin dashboard segment routes, public API routes, or API
  action routes.
- `src/lib/utils/routeUtils.ts` consumes those constants for middleware-facing
  `isApiRoute`, `isProtectedRoute`, and `isAdminRoute`.
- `src/lib/utils/urlUtils.ts` owns generic `buildUrl()` and
  `buildArtworkSearchUrl()`. It builds raw segment arrays and is used by main
  navigation, subnav helpers, project/account pagination, and some filter links.
- `src/lib/metadata/publicDetailMetadata.ts` owns public detail path helpers:
  `articleDetailPath`, `blogDetailPath`, `artworkDetailPath`,
  `productDetailPath`, `collectionDetailPath`, and `collectionArtworkPath`.
  Those helpers also drive `src/lib/metadata/publicDynamicSitemap.ts`.
- `src/lib/config/publicSiteUrl.ts` owns the production public origin and
  absolute public URL building for metadata, robots, and sitemap output.

### App Page Routes

- Stable public roots and shell redirects are still mostly hard-coded or
  locally built:
  - `src/components/loaders/componentLoaders/MainNavLoader.tsx` uses
    `buildUrl()` for `/artwork`, `/biography`, `/collections`, `/blog`,
    `/project/about`, and `/shop`.
  - `src/components/modules/navigation/mainNav/MainNav.tsx` duplicates a
    disabled skeleton route list with `/artwork`, `/biography`, `/collections`,
    `/blog`, `/project`, and `/shop`.
  - `src/app/project/layout.tsx` builds `/project/about`, `/project/film`, and
    `/project/contact` from a local `stem`.
  - `src/app/project/page.tsx`, `src/app/shop/page.tsx`,
    `src/app/account/page.tsx`, `src/app/admin/page.tsx`, and
    `src/app/admin/dashboard/page.tsx` hard-code redirect targets.
- Public detail routes are partly centralized only for metadata/sitemap:
  public UI still builds many links inline, such as `/blog/${slug}`,
  `/biography/${slug}`, `/artwork/${id}`, `/collections/${slug}/${id}`, and
  `/shop/products/${handle}` across cards, sections, loaders, search results,
  prototypes, and product-detail views.
- Legal and auth routes are hard-coded in several UI surfaces:
  `/privacy`, `/terms`, `/sign-in`, `/sign-in?mode=signup`, and `/account`
  appear in footer, sign-up/sign-in notices, account nav, mobile nav, metadata,
  and tests.
- Prototype-specific route checks are local:
  `src/components/modules/navigation/mainNav/MainNavRouteSwitch.tsx` checks
  `/prototype/home` and `/prototype/home/`.

### API Routes

- The physical API route surface is under `src/app/api/v2` with public, user,
  and admin route groups. Current route families include public article,
  artwork, blog, collection, navigation, search, shop products, and enquiry;
  user comment/profile/favourite/watchlist/navigation; and admin create/read/
  update/delete/preview/signing routes.
- Client fetchers build the matching paths independently:
  - `src/lib/api/public/*/fetchers.ts` builds public API paths.
  - `src/lib/api/user/*/fetchers.ts` builds protected user API paths.
  - `src/lib/api/admin/create|read|update|delete/fetchers.ts` builds admin API
    paths.
  - `src/components/compositions/ShopProductGallery.tsx` directly fetches
    `/api/v2/public/shop/products`.
  - `src/components/elements/buttons/UploadButton.tsx` passes the Cloudinary
    signature endpoint literal `/api/v2/admin/sign-cloudinary-params`.
- API route handlers separately pass literal route IDs into
  `createRequestContext()` and `adminDeletePreviewResponse()`. These route IDs
  mirror external paths but use bracket tokens such as
  `/api/v2/admin/article/delete/[id]` and
  `/api/v2/public/collection/[slug]/artwork/[id]`.
- `__tests__/unit/api/routeFetcherParity.test.ts` already has a manual
  operation inventory that compares expected fetcher paths to physical route
  files. This is useful coverage but is itself another duplicated route list.

### Auth And Protected Paths

- `src/middleware.ts` combines helper-driven checks with hard-coded bypass,
  redirects, and matchers:
  - bypass: `/api/auth`
  - redirects: `/sign-in` and `/`
  - matchers: `/account/:path*`, `/admin/:path*`,
    `/api/v2/admin/:path*`, `/api/v2/user/:path*`
- `src/lib/config/authOptions.ts` hard-codes the NextAuth sign-in page
  `/sign-in`.
- `src/lib/config/authCallbacks.ts` inspects `/api/auth/signin` and
  `/api/auth/signout`, then returns base-URL redirects.
- `src/lib/session/requireAdminFrontendAccess.ts` redirects to `/sign-in` and
  `/`.
- Tests around route utils, middleware, auth frontend guard, and same-app origin
  hygiene all encode matching literals.

### Smoke, Discovery, And Absolute URL Construction

- `scripts/smoke-public-routes.mjs` owns an independent unauthenticated smoke
  route list, required sitemap paths, private sitemap prefixes, `/robots.txt`,
  `/sitemap.xml`, and optional detail-route builders.
- `src/app/sitemap.ts` owns `stablePublicSitemapRoutes`, an independent list of
  stable public paths.
- `src/app/robots.ts` owns crawler allow/disallow paths and the sitemap URL.
- `src/lib/metadata/publicDynamicSitemap.ts` uses the public detail path
  helpers for dynamic sitemap entries but keeps private path prefixes
  `/admin`, `/account`, and `/api` locally.
- Same-app origin cleanup appears mostly complete in current source. Current
  same-app URL construction is limited to public absolute URL generation,
  middleware redirects with `new URL(path, request.url)`, request parsing in
  tests/routes, smoke target requests, and placeholder/test URLs. The route
  centralization task should not reopen absolute same-app HTTP fetch patterns.

## Duplicate Or Drift-Prone Groups

1. Public route roots are duplicated across `routeConstants.ts`,
   `MainNavLoader.tsx`, `MainNav.tsx` skeleton links, `sitemap.ts`,
   `robots.ts`, smoke script paths, metadata breadcrumbs, sections, footer/legal
   UI, and tests.
2. Public detail builders are split: metadata/sitemap use helpers, while UI and
   search result DTOs still build the same paths inline.
3. Admin dashboard routes are duplicated between redirect pages,
   `AdminSidebar.tsx`, admin segment config consumers, smoke unauthenticated
   denial, and tests. These routes are coupled to UI segment names and should
   not be mixed with API action routes in the first slice.
4. API paths are duplicated across physical `src/app/api/v2` files, client
   fetchers, route logging context strings, preview helpers, route parity tests,
   protected API guard tests, and smoke/auth tests.
5. Auth paths are split between route constants, middleware bypass/matchers,
   NextAuth options/callbacks, account navigation, mobile navigation, frontend
   admin guard redirects, and tests.
6. Sitemap/smoke/discovery lists intentionally duplicate route contracts for
   external verification. These should consume route constants only after the
   constants are stable and after tests prove they still assert the external
   public contract.

## Recommended First Implementation Slice

Start with public app route builders that already have helper precedent and low
runtime risk:

- Add a server/client-safe route module that has no server-only imports and
  exports only string constants and small encoding builders for public app
  routes, for example:
  - root routes: home, artwork, biography, collections, blog, project, shop,
    shop products, search, privacy, terms, sign-in, account settings.
  - detail builders: artwork detail, biography article detail, blog detail,
    collection detail, collection artwork detail, shop product detail.
  - query builders only where behavior is already established:
    artwork search and search page query links.
- Move or re-export the existing public detail path helpers from
  `publicDetailMetadata.ts` into that route module, then update
  `publicDetailMetadata.ts` and `publicDynamicSitemap.ts` to consume them.
- Update a narrow public UI set that is not auth-sensitive:
  `MainNavLoader.tsx`, `MainNav.tsx` skeleton route list, public cards/sections
  that build `/blog`, `/biography`, `/artwork`, `/collections`, and
  `/shop/products` links, plus footer legal links if the module includes legal
  routes.
- Keep `routeConstants.ts` protected-route constants in place for this slice,
  or make them re-export from the new module only if import-boundary tests stay
  green.

Why this slice first:

- It centralizes the most repeated app-page builders without touching API
  status contracts, middleware auth behavior, NextAuth callbacks, admin CRUD
  actions, smoke target semantics, or route handler logging.
- Existing tests already cover public detail metadata/sitemap,
  public breadcrumbs, main navigation, policy links, visible breadcrumbs, and
  search result links.

## Deferred Areas

- Do not centralize middleware matchers and auth redirects in the first slice.
  Middleware behavior is high blast radius and should have a dedicated task with
  route utils, middleware, NextAuth options/callbacks, and protected route tests.
- Do not centralize `/api/v2` route builders before deciding whether the module
  should represent external paths, route logging IDs with `[param]` placeholders,
  or client fetcher builders with encoded values. Mixing those concerns could
  weaken request-context logging and route-parity coverage.
- Do not change the admin action-segment convention (`create`, `read`,
  `update`, `delete`, `preview`) while centralizing paths. The architecture
  backlog separately calls out whether that convention is canonical.
- Do not collapse smoke route lists into runtime route constants first. Smoke
  checks are external release contracts and should keep explicit expected
  statuses until route constants have independent tests.
- Do not change public cache policy, redirects, sitemap freshness, route
  dynamic/static exports, or `generateStaticParams()` as part of route-builder
  centralization.
- Do not use a broad barrel that client components import if it could pull in
  server-only metadata, data, auth, or model modules. The route builder module
  must stay value-only and client-safe.

## Verification Needed By Slice

- Public app route builder slice:
  - focused unit tests for every exported route builder, including encoded
    dynamic segments and query strings;
  - existing public metadata/sitemap/breadcrumb tests;
  - main navigation and policy link tests;
  - `__tests__/unit/security/clientServerImportBoundary.test.ts`;
  - `npm run lint`, `npm test -- --runTestsByPath` for focused route tests, and
    `git diff --check`.
- Auth/protected route slice:
  - `__tests__/unit/utils/routeUtils.test.ts`;
  - `__tests__/unit/middleware.test.ts`;
  - `__tests__/unit/auth/adminFrontendGuard.test.tsx`;
  - source hygiene coverage for no hard-coded same-app origins;
  - focused NextAuth sign-in/callback coverage if callbacks are edited.
- API route builder slice:
  - `__tests__/unit/api/routeFetcherParity.test.ts`;
  - admin/public/user fetcher tests;
  - protected API guard inventory tests;
  - request-context/logging route tests;
  - focused route tests for any touched route family.
- Smoke/discovery route slice:
  - public smoke discovery endpoint tests;
  - public metadata discovery and dynamic sitemap tests;
  - one actual `npm run smoke:public -- --base-url=...` run only when a valid
    target is available.

## Candidate Follow-Up Tasks

- Create a client-safe public app route builder module and migrate metadata,
  sitemap, main navigation, public cards/sections, and legal links in a narrow
  slice.
- Scope auth/protected route constant consolidation across `routeConstants.ts`,
  `routeUtils.ts`, `middleware.ts`, `authOptions.ts`, `authCallbacks.ts`, and
  admin frontend guard redirects.
- Scope API route builder and route-ID ownership separately, starting with
  admin delete/read paths because those already have helper patterns and route
  parity tests.
- Decide whether smoke and sitemap stable route lists should consume central
  public route constants or intentionally remain explicit release-contract
  fixtures with parity tests.

## Candidate Shared Tracker Updates

- Architecture refactor backlog: replace the broad "Centralize app route
  builders, API route builders, and auth path constants" item with staged
  follow-ups for public app routes, auth/protected routes, API route builders,
  and smoke/discovery route lists.
- Testing workstream: add route-builder unit coverage and route-parity source
  hygiene as expected verification for future implementation tasks.
- Routes/API architecture doc: after implementation, document the canonical
  route-builder module boundaries and explicitly distinguish app route builders
  from API route IDs used for logging.

## Verification

- `git diff --check` passed.
