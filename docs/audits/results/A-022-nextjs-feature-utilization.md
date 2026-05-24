# A-022 Next.js Feature Utilization Result

Status: Completed

Audit goal: audit how well the app is maximizing Next.js benefits and where
Next.js features or efficiency savings should be adopted next.

Workstream:
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md)
and
[Frontend routes and components](../../workstreams/frontend-routes-and-components.md).

## Summary

The app now uses Next.js much better than the older SSR/data-fetching audits
recorded: it is on the App Router, root layout no longer performs global
database/session work, server loaders mostly use server-only data services
instead of self-fetching the same app, public detail pages have route metadata,
JSON-LD, and not-found files, image allowlisting is configured, and targeted
tests protect cache policy, image sizing, metadata, server loaders, server
actions, and import boundaries.

The biggest remaining efficiency opportunity is controlled caching. The current
policy keeps high-value public routes dynamic and avoids `revalidate`,
`generateStaticParams()`, cached non-`fetch` data functions, and cache tags.
That is conservative, but it leaves the archive, blog, search, shop, sitemap,
and redirect flows doing more request-time MongoDB/Shopify work than Next.js
needs. The next highest priorities are narrowing middleware coverage, fixing a
live client/server import-boundary regression, and reducing public client
JavaScript from global providers and large client components.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md`
  - `docs/workstreams/README.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
  - `docs/workstreams/frontend-routes-and-components.md`
  - `docs/architecture/rendering-and-data-fetching.md`
  - `docs/architecture/system-overview.md`
- Related audit results:
  - `docs/audits/results/A-005-frontend-routes-components.md`
  - `docs/audits/results/A-010-performance-seo-accessibility.md`
  - `docs/audits/results/A-013-architecture-refactor-scope.md`
  - `docs/audits/results/A-015-ssr-data-fetching.md`
- Framework/config surface:
  - `package.json`
  - `next.config.mjs`
  - `src/middleware.ts`
  - `src/app/layout.tsx`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
  - `src/lib/config/publicSiteUrl.ts`
  - `src/lib/styles/fonts.ts`
- Route and rendering surface:
  - 36 App Router pages under `src/app`
  - 61 route handlers under `src/app/api`
  - route `loading.tsx`, `error.tsx`, and `not-found.tsx` files
  - public dynamic pages, redirect pages, account/admin routes, sitemap, robots,
    metadata, and JSON-LD emitters
- Data and cache surface:
  - server loaders under `src/components/loaders`
  - server-only data services under `src/lib/data/services`
  - server actions under `src/lib/actions`
  - Shopify client and shop/search services
- Client bundle and boundary surface:
  - global root client provider wrapper
  - public hero, shop gallery, artwork gallery, search, forms, account nav, and
    admin dashboard client components
  - client/server import-boundary tests
- Official Next.js documentation consulted:
  - [Caching and Revalidating, previous model](https://nextjs.org/docs/app/guides/caching-without-cache-components)
  - [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
  - [Image component](https://nextjs.org/docs/app/api-reference/components/image)
  - [sitemap.xml file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
  - [proxy file convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
  - [instrumentation file convention](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation)
  - [`use server` directive](https://nextjs.org/docs/app/api-reference/directives/use-server)

## Commands Run

- `git status --short`: showed many pre-existing dirty and untracked files
  across docs, tests, prototypes, and components. This audit only added this
  result file.
- `sed -n ... docs/...`: read the required documentation, workstream briefs,
  architecture docs, audit result index, template, and related audit results.
- `rg --files src/app`: inventoried current App Router pages, API route
  handlers, metadata files, route fallback files, and special files.
- `rg -n "export const (dynamic|revalidate|fetchCache|runtime|maxDuration|preferredRegion)|generateStaticParams|generateMetadata|revalidate(Path|Tag)|unstable_cache|cacheTag|cacheLife|use cache|fetch\(" ...`:
  inventoried route segment config, static params, cache/revalidation APIs, and
  fetch usage.
- `rg -n "from ['\"]next/(image|font|dynamic|script|navigation|headers|cache|server|auth)|next/image|next/font|next/dynamic|next/script" ...`:
  inventoried Next.js feature imports.
- `rg -n "^\"use server\"|^'use server'|^\"use client\"|^'use client'" ...`:
  inventoried server/client directives.
- `rg -n "instrumentation|reportWebVitals|useReportWebVitals|web-vitals|Sentry|OpenTelemetry|next/after|after\(" src package.json next.config.mjs`:
  found no runtime instrumentation or web-vitals usage.
- `find src/app -name loading.tsx -o -name error.tsx -o -name not-found.tsx`:
  found one global error file, one root loading file, one admin feed loading
  file, and five public detail not-found files.
- `find src/app -name route.ts | wc -l`: counted 61 route handlers.
- `find src/app -name page.tsx | wc -l`: counted 36 pages.
- `npm run build`: passed. Build output used Next.js 14.2.35, generated 50
  static pages, reported static shells for `/biography`, `/collections`,
  `/project/*`, `/shop`, policy pages, prototypes, `robots.txt`, and
  `sitemap.xml`, but dynamic rendering for `/`, `/artwork`, public details,
  `/blog`, `/search`, `/shop/products`, product detail, account routes, API
  routes, and `/sign-in`. Middleware size was 48 kB. Build also warned that
  `caniuse-lite` is outdated.
- `npm test -- --runTestsByPath __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts __tests__/unit/publicImagePreloadSizing.test.tsx`:
  failed because `clientServerImportBoundary.test.ts` detected client runtime
  import chains from `SignUpForm` through `@/lib/constants` into mixed
  constants, component barrels, transforms, and Mongoose model barrels. The
  route cache policy and image preload/sizing tests passed. Jest also emitted a
  Node `punycode` deprecation warning.

## Current Utilization Scorecard

| Area | Current use | Assessment |
| --- | --- | --- |
| App Router and server components | Strong use. Public pages, layouts, server loaders, metadata files, not-found files, route handlers, and server actions are all present. | Keep this direction. The app is already shaped like a modern App Router app. |
| Direct server data services | Strong and improved. Loaders such as `ArtworkListLoader` and `ShopProductsLoader` call server-only services directly. Services call `dbConnect()` and are guarded by `server-only`. | Preserve. This realizes a major App Router benefit and removes prior same-app HTTP overhead. |
| Route-level rendering policy | Conservative. 12 public routes explicitly export `dynamic = "force-dynamic"` and no public route uses `revalidate` or `generateStaticParams()`. | Safe but leaves large efficiency savings unused. Needs route-by-route cache/ISR adoption. |
| Static generation | Partial. Build shows several static shell pages and metadata routes. | Useful, but dynamic archive/detail/shop routes and sitemap behavior need deliberate freshness ownership. |
| Metadata/discovery | Good baseline. Root metadata, detail `generateMetadata`, JSON-LD, `robots.ts`, and `sitemap.ts` exist. | Improve cache/freshness and add generated social images only after core cache policy is settled. |
| Image optimization | Good baseline. `next/image`, remote patterns, priority/sizes tests, and `next/font` are in use. | Continue targeted tuning; add stricter image config and monitor LCP rather than broad rewrites. |
| Middleware/proxy | Functional auth guard, but broad matcher. Middleware exits early for public routes but still runs on most request paths and builds to 48 kB. | Narrow matcher to protected route prefixes and plan the future `middleware.ts` -> `proxy.ts` migration. |
| Client/server boundaries | Guard exists, but currently failing. | High-priority fix because client bundle/server leakage directly undermines Next.js RSC benefits. |
| Client JavaScript | Mixed. Interactivity is correctly client-side, but global providers and large public modules increase shared/client payload. | Optimize after boundary fix; use route-local providers and lazy loading for below-the-fold or rarely used UI. |
| Observability hooks | Not implemented by policy. No `instrumentation.ts`, `useReportWebVitals`, monitoring SDK, or OpenTelemetry setup in source/package config. | Blocked by ADR 0005 owner decision, but a clear Next.js feature gap for production operation. |
| Next major readiness | Known but deferred. Current app is Next 14.2.35 while current official docs show latest 16.2.2. | Do not mix into immediate performance work; use T-015 migration audit before package changes. |

## Prioritized Opportunities

| Rank | Priority | Opportunity | Why first | Evidence | Recommended follow-up |
| --- | --- | --- | --- | --- | --- |
| 1 | High | Adopt explicit caching/ISR for selected public reads and dynamic metadata routes. | This is the largest Next.js efficiency saving still unused: fewer request-time MongoDB/Shopify reads, better TTFB, and better crawler reliability for public archive and commerce pages. | Build keeps `/`, `/artwork`, `/artwork/[artworkId]`, `/blog`, `/blog/[slug]`, `/search`, `/shop/products`, and product detail dynamic. `__tests__/unit/publicRouteCachePolicy.test.ts` enforces no public `revalidate` or `generateStaticParams()`. `rg` found no `unstable_cache`, `revalidateTag`, `cacheTag`, or `cacheLife` use. Next's previous cache model supports `unstable_cache` for non-`fetch` database work, route `revalidate`, and `revalidatePath`/`revalidateTag` for event-driven invalidation. | Start with one low-risk public family: blog list/detail or biography articles. Add cached service wrappers with a short revalidate value, then add `generateStaticParams()` for known slugs where freshness allows. Keep account/admin routes dynamic. |
| 2 | High | Fix current client/server import-boundary failure. | Server Components and server-only data services only pay off if client bundles cannot pull in Mongoose, transforms, mixed component barrels, or server-only constants. The current guard is already failing. | Targeted test failure traces `src/components/modules/forms/user/SignUpForm.tsx` importing `@/lib/constants` to `src/lib/constants/index.ts`, then through `publicDocumentConstants.ts` into `../data/models` and transforms, and through `navigationLinks.ts` into `Subnav` and `components/elements/buttons/index.ts`. | Import `ACCOUNT_PRIVACY_ACKNOWLEDGEMENT_*` directly from `accountPrivacyAcknowledgement` or create a client-safe constants barrel. Then keep the recursive import-graph test green. |
| 3 | High | Narrow middleware to protected route prefixes and plan `proxy.ts` migration. | Public routes currently avoid token parsing, but middleware still executes before most public pages. A narrower matcher reduces edge/runtime work and lowers risk as the project moves toward newer Next conventions. | `src/middleware.ts` matcher is `"/((?!api/auth|_next/static|_next/image|favicon.ico).*)"`, so it covers public pages and public APIs before early return. Build reports middleware at 48 kB. Protected prefixes are already known in `routeConstants.ts`: `/account`, `/admin`, `/api/v2/admin`, `/api/v2/user`. Official Proxy docs say matchers should target specific paths and note `middleware` has been renamed to `proxy` in newer Next. | Change matcher to protected frontend/API prefixes only, with tests proving account/admin/user API protection and public bypass. Defer file rename to the accepted Next major migration task. |
| 4 | High | Define freshness for `sitemap.ts`, static redirect routes, and default collection/biography redirects. | These are currently statically generated while depending on MongoDB/Shopify. That is efficient, but may freeze dynamic discovery and redirect targets until deploy. | Build marks `/sitemap.xml`, `/biography`, and `/collections` as static. `sitemap.ts` calls `getDynamicPublicSitemapEntries()`, which reads Article, Blog, Artwork, Collection, and Shopify product data. `/biography` and `/collections` query navigation services before redirecting. Official sitemap docs say `sitemap.ts` is cached by default unless a request-time API or dynamic config is used. | Choose per surface: add `export const revalidate = ...` to sitemap/default redirects, or make redirects dynamic if owner-controlled ordering must update immediately. Add tests that enforce the chosen freshness contract. |
| 5 | Medium | Add `generateStaticParams()` for stable public detail routes after freshness is approved. | High-value detail pages can be prerendered or ISR-backed instead of always on-demand. This is lower than rank 1 because freshness and build-time DB/Shopify availability must be decided first. | Public detail pages all export `dynamic = "force-dynamic"` and none exports `generateStaticParams()`. Official docs describe `generateStaticParams()` as the App Router replacement for `getStaticPaths()` and a way to generate dynamic segment routes at build time. | Start with biography/blog slugs before artwork and Shopify. For large artwork catalogs, consider returning a limited hot set or empty array with ISR if the accepted policy allows runtime static generation. |
| 6 | Medium | Reduce public client JavaScript by moving global providers and heavy islands lower. | The build has a reasonable shared baseline, but public routes still hydrate global session/modal providers and interactive hero/navigation code. This is a concrete RSC efficiency opportunity after boundary fixes. | `src/app/layout.tsx` wraps the whole app in `ClientContextBoundary`; `ClientContextBoundary` wraps every route in `SessionProvider` and `GlobalFeaturesProvider`. Home is dynamic with 182 kB first-load JS; `/artwork` is 177 kB; `/blog` is 183 kB; admin dashboard segment is 251 kB. | Split modal/session providers so public static shells do not hydrate account/session state unless the route needs it. Use route-local client islands and `next/dynamic` for non-critical drawers, modals, frame preview, and prototype/admin-only UI. |
| 7 | Medium | Cache and deduplicate expensive non-`fetch` data services. | Direct Mongoose and Shopify fan-out is now clean, but repeated queries inside a render can still duplicate work and cannot benefit from Next cache invalidation until wrapped. | `getBlogList` is called three times in `BlogListLoader` for the unsorted blog page. `getPublicSearchResults` runs multiple MongoDB queries and calls `getShopProductList()` for shop product search. `getShopProductList()` fans out with `Promise.all` to `getProductById()` for each unique Shopify product. | Use React `cache()` for per-render dedupe and `unstable_cache` or future Cache Components for cross-request public data where invalidation is defined. Add tags such as `artwork`, `blog`, `collection`, `shop-product` only after admin mutations can revalidate them. |
| 8 | Medium | Continue image optimization, with stricter config and measured LCP. | The project already uses `next/image` well enough that cache/client-boundary work should come first. Still, stricter image settings and measurement can reduce bandwidth. | `next.config.mjs` has remote patterns. Targeted image test passed. Active hero first slide uses `priority`; product/detail images have `sizes`. However Next 16 docs deprecate `priority` in favor of `preload`, and `images.qualities` becomes required in Next 16. | Keep current image tests. Add `images.qualities` before a Next major upgrade, review `priority` -> `preload` during upgrade, and measure LCP for home hero/artwork/product pages before further changes. |
| 9 | Medium | Add production instrumentation and web vitals once owner decision unblocks it. | This is less an efficiency saving than an efficiency feedback loop: without web vitals and server instrumentation, cache/image/client JS work cannot be validated in production. | `rg` found no `instrumentation.ts`, `useReportWebVitals`, web-vitals package, Sentry, or OpenTelemetry usage in source/package config. ADR 0005 intentionally blocks provider installation and instrumentation. Official docs use `instrumentation.ts` for observability tooling. | After owner/provider approval, add provider-specific instrumentation, web-vitals reporting, source maps/release tracking, and alerts. Keep this out of core Next optimization work until ADR 0005 is resolved. |
| 10 | Low | Remove unnecessary top-level `"use server"` directives from server components/loaders. | This is lower impact than cache and boundary work, but it reduces conceptual confusion between Server Components and Server Functions. | `rg` shows `"use server"` at the top of server component/layout/loader files such as `src/components/views/Home.tsx`, `src/components/loaders/viewLoaders/BlogListLoader.tsx`, and `src/app/biography/layout.tsx`. Official docs define top-level `"use server"` as marking all functions in a file as server-side Server Functions, mainly for functions imported into client components. | Use `server-only` imports for server-only modules and reserve `"use server"` for actual server action/function files. Remove directives in small slices with build/test verification. |

## Benefits Already Being Captured

- App Router file conventions are broadly used: layouts, pages, route handlers,
  metadata files, not-found files, error/loading boundaries, and server actions.
- Route-critical server loaders now call server-only data services directly.
  For example, `ArtworkListLoader` calls `getArtworkList()`, and
  `ShopProductsLoader` calls `getShopProductList()` without same-app HTTP.
- Data services import `server-only` and own `dbConnect()`, which improves the
  safety of server component data access.
- Detail routes use `generateMetadata()` and structured JSON-LD for artwork,
  collection artwork, biography, blog, and products.
- The app uses `next/font/google` and `next/image` with configured remote image
  patterns.
- Saved-item server actions now call `dbConnect()` and `revalidatePath()` for
  affected account and artwork routes.
- Source tests are unusually useful for a Next.js app: they assert root layout
  auth/DB boundaries, public route cache policy, loader direct-service usage,
  metadata/discovery behavior, image preload/sizing, saved action revalidation,
  and client/server import boundaries.

## Candidate Findings For Reconciliation

- High, Rendering/cache: Public archive, blog, search, shop, and detail routes
  are intentionally dynamic and do not yet use ISR, cached non-`fetch` data
  functions, cache tags, or `generateStaticParams()`.
- High, Client/server boundary: The client import graph is currently failing
  because `SignUpForm` imports the broad `@/lib/constants` barrel, which reaches
  server/model and mixed component barrels.
- High, Middleware: Auth middleware runs for most public paths before early
  return; the matcher can be narrowed to protected route prefixes.
- High, Discovery/cache: `sitemap.ts`, `/biography`, and `/collections` are
  statically generated while reading mutable MongoDB/Shopify data, so freshness
  is implicit and deploy-bound.
- Medium, Client JS: Global root client providers and large public client
  islands reduce the amount of UI that can stay purely server-rendered.
- Medium, Observability: Next.js instrumentation and web-vitals reporting remain
  blocked by owner/provider decision, so performance gains cannot be measured in
  production.
- Low, Code clarity: Top-level `"use server"` appears in server
  component/loader files where `server-only` would better express intent.

Reconciled on 2026-05-23:

- F-111: public caching/ISR and cached non-`fetch` service reads. Partially
  mitigated by T-232/T-233 for the biography proof route, T-238 for the
  collections redirect/navigation proof, and T-239 for explicit sitemap ISR
  ownership. T-240 scoped the blog primary-data cache split, T-241 completed
  the primary blog detail cache proof, T-242 completed the default grouped blog
  list proof, T-243 selected query normalization/bounds as the prerequisite
  before sorted blog list caching, and T-244 completed that prerequisite.
- F-112: current client/server import-boundary regression. Resolved by T-230.
- F-113: middleware matcher broader than protected route prefixes. Resolved by
  T-231.
- F-114: implicit deploy-bound freshness for sitemap/default redirects.
  Resolved by T-232.
- F-115: public client-provider and client-island cost. Partially mitigated by
  T-234/T-236; broader provider/modal ownership remains separate.
- F-116: duplicate of F-080/R-019/ADR 0005 for instrumentation/web-vitals.
- F-117: low-priority non-action top-level `"use server"` cleanup. Resolved
  by T-235.

## Risks Updated

- 2026-05-23 reconciliation updated R-012 with the cache/ISR, sitemap/default
  redirect freshness, and middleware matcher sequence.
- R-025 was moved back to partially mitigated during reconciliation because the
  guard was red again through `SignUpForm`; T-230 later mitigated it again.
- R-019 was updated to note the still-blocked Next.js instrumentation and
  web-vitals gap.
- R-014 was updated to record this reconciliation.

## Workstream Updates

- Updated the rendering architecture doc with the A-022 implementation order.
- Updated the architecture, frontend, and deployment workstreams with A-022
  facts, backlog entries, and next-agent sequencing.
- Prepared planned task briefs T-230 through T-235; T-236 was added after the
  T-234 scoping pass.
- T-230, T-231, T-232, T-233, T-235, and T-236 are now complete. T-234 scoped
  the client-provider/client-island work.
- T-237 scoped the next A-022 efficiency wave, T-238 completed the collections
  redirect/navigation cache proof, and T-239 made the current one-hour
  `/sitemap.xml` manifest revalidation explicit in source.
- T-240 completed as a docs-only scoping task for blog primary-data caching
  because `/blog` and `/blog/[slug]` mix query-driven list variants, primary
  detail reads, metadata/JSON-LD, and optional comments. It created T-241 as
  the selected implementation slice.
- T-241 completed the primary blog detail cache proof while keeping comments,
  blog routes, public blog APIs, and route-level blog ISR dynamic.
- T-242 completed the default grouped `/blog` list cache proof while keeping
  sorted pages, public APIs, comments, and route output dynamic.
- T-243 completed the docs-only sorted blog list cache/query-hygiene scoping
  pass and created T-244 as the selected prerequisite implementation slice.
- T-244 completed public blog list query normalization and bounds for `/blog`
  and `GET /api/v2/public/blog`.
- T-245 completed the sorted `/blog` first-page cache proof. T-246 is planned
  to scope whether bounded page-2-plus sorted cache expansion is worthwhile.

## Next Action

The first A-022 implementation sequence, the T-238 collections proof, T-239
sitemap ISR ownership, T-240 blog cache scoping, and T-241 primary blog detail
cache proof, T-242 default grouped blog list proof, and T-243 sorted-list
cache/query scoping, T-244 query-hygiene implementation, and T-245 sorted
first-page cache proof are complete. Assign T-246 next if continuing the
Next.js efficiency track; keep it docs-only and focused on whether any bounded
sorted page-2-plus cache expansion is safe or worth doing. Further broad
static/ISR, provider/modal, monitoring instrumentation, generated params,
sorted blog later-page implementation, comment caching, or route-family cache
work should be scoped as separate tasks.
