# Rendering And Data Fetching

This document tracks the intended server-side rendering and data-fetching
strategy for the app. It is partially implemented through narrow proof routes,
but remains a staged migration target rather than a fully implemented
architecture contract.

## Current Position

- The app uses Next.js 14 App Router.
- Some pages and loader components are server-rendered.
- Some interactivity is handled by client components.
- Project owner reports that server-side rendering has been attempted but has
  not yet been successfully established as a reliable, consistent pattern.

## Desired Direction

Public archive and commerce pages should prefer server-rendered initial data
when it improves reliability, SEO, shareability, or first load behavior. Client
components should be used for interaction after initial render, such as filters,
sort controls, forms, drawers, and account actions.

## Public Route Rendering And Cache Policy

T-102 removed the global root-layout and middleware auth blockers from public
routes. Public rendering and cache ownership is now route-local. The policy is
conservative: routes that depend on request query params, session-aware UI,
MongoDB data freshness, or Shopify reads remain explicitly dynamic until a
separate static/ISR task defines build-time data access, params, and freshness
requirements.

Only `/biography`, `/collections`, and `/sitemap.xml` use `revalidate` as route
segment exports in the current runtime policy. `/biography` is the T-233 proof
and `/collections` is the T-238 proof; both reuse a 10-minute service-cache
window for redirect/navigation data. `/sitemap.xml` is the T-239 proof and owns
a one-hour discovery freshness window directly in `src/app/sitemap.ts`. T-241
adds cached primary blog detail service reads, and T-242 adds cached default
grouped `/blog` list service reads for the unfiltered featured/latest/popular
sections only. `/blog` and `/blog/[slug]` remain route-dynamic with no
route-level ISR or generated params. T-244 canonicalizes and bounds public blog
list query inputs before sorted-list cache implementation. T-245 adds cached
sorted `/blog` first-page list reads only for latest, oldest, featured, and
popular page 1 with fixed limit 10. T-247 adds bounded sorted pages 2-5 for
latest, oldest, and featured with fixed limit 10 while leaving `popular` pages
greater than 1 and sorted pages greater than 5 direct. T-249 adds a cached
default `/artwork` browse list service read only for `mostRecent` page 1 limit
10, `filterMode: "ALL"`, no taxonomy filters, and no `sortColor`; `/artwork`
remains route-dynamic. Other public route families remain free of route-level
`revalidate` until their own route-family cache task updates source and tests
together.
`generateStaticParams()` is deferred for content and commerce detail routes
until owner-approved data freshness, build-time MongoDB/Shopify availability,
and detail-param coverage are defined. T-233 implemented the first approved
runtime proof for the biography article route family with staged cached
non-`fetch` service wrappers before generated params.

| Route group | Current route examples | Current cache policy | Owner/blocker |
| --- | --- | --- | --- |
| Stable static shell | `/biography`, `/collections`, `/project`, `/project/about`, `/project/aims`, `/project/film`, `/shop` | Leave without forced dynamic config or generated params. `/biography` and `/collections` are the only current shell routes with route-level ISR, using accepted 10-minute cache windows for their default redirects. The other shell routes remain without ISR config. | Keep root layout and middleware free of global DB/session work. Revisit if route-local loaders are added. |
| Query-driven public browse/search | `/artwork`, `/blog`, `/search`, `/shop/products`, `/project/contact` | `dynamic = "force-dynamic"` is explicit. Query params select filters, sort, pagination, search terms, or product enquiry context and should not be silently treated as static. The only current browse-list service cache exception is the T-249 fixed default `/artwork` server-rendered list, which does not add route ISR. | A future ISR/static task must first define canonical query variants or split static shells from query results. |
| DB-backed public detail/redirect | `/artwork/[artworkId]`, `/biography/[slug]`, `/blog/[slug]`, `/collections/[slug]`, `/collections/[slug]/[artworkId]` | `dynamic = "force-dynamic"` is explicit. These routes read owner-controlled MongoDB content at request time for detail content, redirect targets, metadata, JSON-LD, or saved-item state. | Static params and ISR are deferred until content freshness, not-found behavior, and build-time DB access are approved. |
| Shopify-backed public commerce | `/shop/products`, `/shop/products/[productHandle]` | `dynamic = "force-dynamic"` is explicit. Shopify product availability, metadata, and linked artwork reads remain request-time behavior. | Future commerce cache policy must define Shopify freshness, product-handle coverage, and fallback behavior. |
| Session-aware public UI | `/`, `/artwork/[artworkId]` | `dynamic = "force-dynamic"` is explicit. The home page includes subscription session state, and artwork detail reads session user context for saved-item ownership. | Split session-only islands or define a separate personalized-data strategy before static rendering. |

## Accepted Public Freshness Matrix

This matrix defines the accepted freshness target for runtime ISR,
`generateStaticParams()`, and cached public service-wrapper changes. "Current
runtime" describes the source as of T-247 and must remain true until a later
implementation task changes source and tests together.

| Surface | Current runtime | Accepted freshness policy | Approved first mechanism |
| --- | --- | --- | --- |
| Sitemap | `src/app/sitemap.ts` exports `SITEMAP_REVALIDATE_SECONDS = 3600` and `revalidate = SITEMAP_REVALIDATE_SECONDS` while reading stable routes plus best-effort Article, Blog, Artwork, Collection, and Shopify product detail entries. | One-hour ISR is the accepted target. Sitemap freshness is source-owned by the metadata route while preserving best-effort per-source fallback and public-safe crawler output. Do not make sitemap fully dynamic because crawler hits should not force all MongoDB/Shopify reads per request. | T-239 makes sitemap one-hour ISR source-owned after the biography and collections redirect proofs. Preserve best-effort per-source fallback, existing sitemap content semantics, and deployed or local `/sitemap.xml` smoke coverage. |
| Default biography redirect | `/biography` reads the cached biography navigation wrapper and exports `revalidate = 600`, so the redirect target uses the accepted 10-minute ISR/cache window. | Short ISR is accepted because owner-controlled first-article ordering may change without a deploy but does not need per-request freshness. | Implemented by T-233. Keep the current failure behavior of throwing when no biography article exists, and do not extend route-level `revalidate` beyond this redirect without a new route-family task. |
| Default collections redirect | `/collections` reads the cached collection navigation wrapper and exports `revalidate = 600`, so the redirect target uses the accepted 10-minute ISR/cache window. | Short ISR is accepted because collection ordering and first-artwork membership can change after content edits but should not force request-time reads for every hit. | Implemented by T-238. Keep the current failure behavior when no collection exists, keep `/collections/[slug]` and `/collections/[slug]/[artworkId]` explicitly dynamic, and do not extend route-level `revalidate` beyond this redirect without a new route-family task. |
| Blog list/detail | `/blog` and `/blog/[slug]` are explicitly dynamic. The list is query-driven by sort/page, and detail can render comment mode from search params. `/blog` now parses list queries through the shared public blog list query parser, so page values are finite and bounded before reaching `BlogListLoader`. The public blog API uses the same parser for bounded `page`/`limit` values. `/blog/[slug]` metadata, JSON-LD, and non-comments detail rendering use the cached primary blog detail wrapper with a 10-minute stale window. The unfiltered `/blog` grouped view uses fixed cached wrappers for featured page 1 limit 5, latest page 1 limit 6, and popular page 1 limit 8. Sorted `/blog` first pages use fixed cached wrappers for latest, oldest, featured, and popular page 1 limit 10. Sorted `/blog` pages 2-5 use fixed cached wrappers only for latest, oldest, and featured with limit 10. `popular` pages greater than 1 and sorted pages greater than 5 stay on direct `getBlogList()` reads. Comment-mode rendering still reads populated comments from the direct comments service and degrades to cached primary blog data if comments are unavailable. | Keep routes dynamic for now. A short stale window is accepted for primary post body, metadata, JSON-LD, server-rendered primary `commentCount`, default grouped `/blog` list cards, sorted first-page `/blog` list cards including popular comment-derived ordering/counts, and bounded owner-controlled sorted pages 2-5 for latest, oldest, and featured. Comments, `popular` pages greater than 1, sorted pages greater than 5, broad query variants, home blog sections, and public blog APIs remain request-time/direct-service behavior. | T-241 first blog proof: primary blog detail service reads only. T-242 second blog proof: default grouped `/blog` list reads only. T-244 query hygiene: canonical finite public blog list query values before sorted-list caching. T-245 third blog proof: sorted `/blog` first-page list reads only. T-247 fourth blog proof: bounded sorted `/blog` pages 2-5 for latest, oldest, and featured only. Do not add `generateStaticParams()`, route ISR, `popular` pages beyond page 1, sorted pages beyond page 5, comment caching, cache tags, or mutation revalidation in these proofs. |
| Biography article list/detail | Route-local biography navigation, `/biography`, `/biography/[slug]`, article metadata, JSON-LD, and previous/next navigation now use cached biography service wrappers with a 10-minute stale window. `/biography/[slug]` remains explicitly dynamic, and no biography route uses `generateStaticParams()`. | A short stale window is acceptable for biography article text, metadata, JSON-LD, and previous/next navigation. Missing primary articles still map to the existing not-found/error contract, and service failures must continue to log and fail through the App Router error boundary. | T-233 first proof route: biography. Cached non-`fetch` service wrappers are implemented for biography article detail and route-local biography navigation with a 10-minute TTL. Do not add `generateStaticParams()` in the first proof. Keep route-level `revalidate` limited to `/biography` default redirect. `MainNavLoader` remains on the direct navigation service because it is rendered from the root header; using the cached wrapper there made unrelated static shells inherit the 10-minute prerender window in build output. |
| Collections navigation/detail | Route-local collections subnav and `/collections` default redirect now use a cached collection navigation wrapper with a 10-minute stale window. `/collections/[slug]` and `/collections/[slug]/[artworkId]` remain explicitly dynamic, and no collections route uses `generateStaticParams()`. | A short stale window is acceptable for route-local collection navigation and the default redirect target. Collection detail rendering, collection artwork membership, pagination, Shopify product links, and saved-item state remain request-time behavior. | T-238 second proof route: collections. Cached non-`fetch` service wrappers are implemented only for collection navigation reads that derive redirect/subnav targets. Keep route-level `revalidate` limited to `/collections` default redirect. `MainNavLoader` remains on the direct collection navigation service to avoid root-header cache propagation into unrelated static shells. |
| Artwork browse/detail | `/artwork`, `/artwork/[artworkId]`, and collection-scoped artwork detail are explicitly dynamic. Browse is filter/sort/page driven, but T-249 caches only the server-rendered default `/artwork` list shape: `mostRecent` page 1 limit 10, `filterMode: "ALL"`, no taxonomy filters, and no `sortColor`. Filtered browse variants, page 2-plus, non-default limits, `mostPopular`, `mostFeatured`, `colorProximity`, public artwork APIs/fetchers, browser follow-up fetches, detail reads, metadata/JSON-LD detail reads, saved-item state, and Shopify product-link reads stay direct. | Keep routes dynamic. A short stale window is accepted only for the fixed default browse list because it is owner-controlled MongoDB archive content with no selected-branch session or Shopify coupling. | T-249 artwork proof: cached non-`fetch` service wrapper for the default browse list only. Do not add route-level ISR, `generateStaticParams()`, cache tags, mutation revalidation, filtered cache variants, API caching, detail caching, saved-item caching, or Shopify product-link caching. |
| Search | `/search` is explicitly dynamic and query-driven. | Keep dynamic. Search terms, type filters, pagination, and mixed MongoDB/Shopify result freshness should remain request-time behavior until a dedicated search cache policy exists. | Defer. No route `revalidate`, service cache, or generated params in the first proof. |
| Shop listing/detail | `/shop/products` and `/shop/products/[productHandle]` are explicitly dynamic. Shopify fetches already use the Storefront production fetch policy, while route rendering still resolves availability, hosted product URLs, linked artwork, and product metadata at request time. | Keep dynamic. Product availability, hosted purchase URL fallback, linked artwork degradation, and future cart/checkout ownership are commerce-sensitive and should not be the first ISR proof. | Defer. Do not add route ISR or generated product handles until Shopify freshness, unavailable-product behavior, and product-handle coverage are approved. |
| Session-aware UI | `/`, artwork saved-item controls, account entry points, and any public UI that reads or depends on session state are dynamic or client-personalized. | Keep dynamic or isolate the personalized island before static rendering. Public cache work must not cache session-derived state into shared output. | Defer. Split session-only islands or define a separate personalized-data strategy before any route-level cache change. |

T-233, T-238, T-241, T-242, T-244, T-245, T-247, and T-249 verification prove the current
route-family cache/query proofs without weakening the current source
invariants: route behavior stays public-safe, no broad public route gains
`generateStaticParams()`, and unchanged dynamic routes keep their current
`force-dynamic` declarations until their own route-family policy is
implemented.

## Next.js Utilization Implementation Order

A-022 confirmed that the app is already benefiting from App Router, direct
server data services, route metadata, JSON-LD, `next/image`, `next/font`, and
source-level architecture tests. The remaining high-value Next.js efficiency
work should be sequenced so production behavior stays easy to reason about:

1. Repair the current client/server import-boundary regression before adding
   more caching. Server Component and server-only service benefits depend on
   keeping client runtime graphs away from Mongoose, server-only modules, and
   mixed component barrels.
2. Narrow middleware matching to protected frontend and API prefixes. The
   route-level public cache policy is clearer when public requests do not enter
   auth middleware at all.
3. Define freshness for mutable static surfaces before runtime cache changes.
   `sitemap.ts`, `/biography`, and `/collections` can prerender while reading
   mutable MongoDB/Shopify-backed data, so each surface needs explicit
   deploy-bound, ISR-backed, or dynamic ownership.
4. Pilot route-family caching/ISR in narrow slices after freshness is accepted.
   T-233 proved biography, T-238 proved collections, T-241 proved primary
   blog detail service caching, T-242 proved default grouped blog list service
   caching, T-245 proved sorted first-page blog list service caching, and
   T-247 proved bounded sorted page 2-5 caching for latest, oldest, and
   featured without broad static params, route-level blog ISR, `popular` page
   2-plus caching, sorted page 6-plus caching, comment caching, or root-header
   cache propagation. T-249 proved the default `/artwork` browse list cache
   without route-level artwork ISR, filtered browse caching, public API
   caching, detail caching, saved-item caching, or Shopify product-link caching.
5. Canonicalize query inputs before broad query-variant caching. T-244 bounds
   public blog list `page` and API `limit` values so future sorted-list cache
   keys cannot be created from malformed, `NaN`, or oversized inputs.
6. Keep sorted query-variant caching fixed and narrow. T-245 caches only the
   sorted `/blog` page 1 variants for latest, oldest, featured, and popular
   with fixed limit 10; T-247 adds only latest, oldest, and featured pages 2-5
   with fixed limit 10. `popular` pages beyond page 1, sorted pages beyond page
   5, public APIs, comments, and mutation paths remain dynamic/direct.
7. Codify sitemap one-hour ISR explicitly after the redirect proofs. T-239 made
   `/sitemap.xml` source-owned with `SITEMAP_REVALIDATE_SECONDS = 3600` and a
   matching route `revalidate` export, guarded by route-cache policy and sitemap
   discovery tests.
8. Only after those proof routes are stable, evaluate broader
   `generateStaticParams()`, cached non-`fetch` service wrappers, cache tags,
   and client provider splitting route by route.

Do not remove the existing `force-dynamic` public route declarations or
`publicRouteCachePolicy` invariants in a broad sweep. Each change should update
this document, the route source, and focused tests together.

## Public Route Loading And Fallback Pattern

Route loading states should preserve the route's visual structure and should be
owned as close as practical to the async boundary they represent. Generic
user-facing loading copy is not the accepted pattern for public archive routes;
use existing skeletons or small neutral placeholders that keep the surrounding
layout stable.

| Route type | Accepted fallback pattern | Current examples |
| --- | --- | --- |
| App Router route-level `loading.tsx` files | Use only where the whole route segment or parallel route needs a framework-level pending state. The fallback should be a stable route shell or skeleton, not route-specific content claims. Do not add broad public `loading.tsx` files until the route family needs segment-wide behavior. | Root `src/app/loading.tsx` delegates to `PageLoading`; admin feed `src/app/admin/dashboard/@feed/loading.tsx` renders `FeedSkeleton`. |
| Public detail primary-content `Suspense` boundaries | Use route-local or shared content skeletons that match the detail view's shape and are visible while primary content is pending. These are distinct from not-found and error handling: missing primary content still follows the public detail `notFound()` contract, and upstream failures throw to the App Router error boundary. | `ArtworkViewSkeleton`, `BlogDetailSkeleton`, and `ArticleViewSkeleton` around artwork, collection artwork, blog, biography, and project article loaders. |
| Route layout navigation and pagination `Suspense` boundaries | Keep the fallback local to the navigational region being loaded. Use navigation or pagination skeletons that preserve spacing so the route body does not shift when links arrive. | `SubnavSkeleton` in biography, collections, and account layouts; `PaginationSkeleton` in collection and saved-artwork layouts. |
| Invisible JSON-LD and metadata `Suspense` boundaries | `fallback={null}` is intentional only for invisible script/metadata output. Do not use `fallback={null}` for visible route content that would otherwise collapse or appear blank while loading. | Detail routes wrap structured data/JSON-LD emitters with `fallback={null}` before the visible detail-content boundary. |
| Client follow-up loading states | Keep loading, retry, and unavailable states visible and local to the client interaction that triggered them. These states are not route-loading placeholders and should preserve already-rendered server content when practical. | Artwork filters/load-more, shop product filtering, blog continuous loading, forms, and account actions. |

For static project shells that only suspend a visual asset, use a small
route-local neutral placeholder when no shared skeleton matches the asset shape.
`/project/aims` uses this pattern for its desktop image boundary so the image
column keeps its dimensions without exposing generic loading text.

## Accepted Server Data Pattern

[ADR 0004](../decisions/0004-server-data-access-ownership.md) accepts direct
server data-access services as the canonical server-side pattern. Server loaders,
API routes, and server actions should share server-only services that own
MongoDB/Shopify reads, transforms, and typed domain results. API routes remain
HTTP adapters for browser clients and external callers. Server loaders and
server actions should not fetch this same Next.js app through absolute HTTP URLs.

Implemented proof slices:

- `src/lib/data/services/getArtworkById.ts` is shared by the public artwork
  detail API and shop product detail archive-context reads.
- `src/lib/data/services/getArtworkList.ts` is shared by
  `ArtworkListLoader` and `GET /api/v2/public/artwork`, so the initial
  `/artwork` server render no longer self-fetches the same app for its artwork
  list.
- `src/lib/data/services/getCachedArtworkListData.ts` wraps only the fixed
  default `/artwork` server-rendered browse list read with a 10-minute
  non-`fetch` cache for the T-249 proof. Filtered variants, page 2-plus,
  non-default limits, `mostPopular`, `mostFeatured`, `colorProximity`, public
  artwork API routes, browser follow-up fetches, artwork detail routes,
  metadata/JSON-LD detail reads, saved-item/session-aware reads, and Shopify
  product-link reads remain on direct services.
- `src/lib/data/services/getPublicSearchResults.ts` is shared by
  `src/app/search/page.tsx` and `GET /api/v2/public/search`, so the initial
  `/search` server render no longer self-fetches the same app for search
  results.
- `src/lib/data/services/getCollectionNavigationList.ts` is shared by
  `CollectionsSubnavLoader` and
  `GET /api/v2/public/navigation/collections`, so the collections subnav no
  longer self-fetches the same app for its initial navigation links.
- `src/lib/data/services/getArticleNavigationList.ts` is shared by
  `BiographySubnavLoader`, `MainNavLoader`, and
  `GET /api/v2/public/navigation/articles/[section]`, so those navigation
  loaders no longer self-fetch the same app for biography article navigation.
  The biography default redirect page and `ArticleLoader` previous/next
  navigation path also use this service directly.
- `src/lib/data/services/getArticleBySlugPopulated.ts` is shared by
  `ArticleLoader` and `GET /api/v2/public/article/[slug]`, so public article
  detail server rendering no longer self-fetches the same app for populated
  article data.
- `src/lib/data/services/getCachedBiographyArticleData.ts` wraps the biography
  detail and route-local biography navigation service reads with a 10-minute
  non-`fetch` cache for the T-233 proof. API routes and global `MainNavLoader`
  continue to use the direct services so the proof does not broaden into
  unrelated route output.
- `src/lib/data/services/getCachedCollectionNavigationData.ts` wraps
  route-local collection navigation reads with a 10-minute non-`fetch` cache for
  the T-238 proof. API routes, collection detail routes, and global
  `MainNavLoader` continue to use the direct services so the proof does not
  broaden into unrelated route output.
- `src/lib/data/services/getCachedBlogPrimaryData.ts` wraps primary blog detail
  reads with a 10-minute non-`fetch` cache for the T-241 proof.
  `/blog/[slug]` metadata, blog JSON-LD helpers, and `BlogDetailLoader` primary
  reads use this wrapper. Blog comments, blog lists, public blog API routes,
  route-level blog ISR, generated params, cache tags, and mutation revalidation
  remain out of scope.
- `src/lib/data/services/getCachedBlogListData.ts` wraps only the unfiltered
  default `/blog` grouped list reads with a 10-minute non-`fetch` cache for the
  T-242 proof: featured page 1 limit 5, latest page 1 limit 6, and popular page
  1 limit 8. After T-245, the same service also wraps only sorted first-page
  `/blog` reads with fixed no-argument wrappers for latest page 1 limit 10,
  oldest page 1 limit 10, featured page 1 limit 10, and popular page 1 limit
  10. After T-247, it also wraps only latest, oldest, and featured sorted
  `/blog` pages 2-5 with fixed no-argument wrappers and limit 10. `popular`
  pages beyond page 1, sorted pages beyond page 5, `BlogSectionLoader`, public
  blog API routes, comments, route-level blog ISR, generated params, cache
  tags, and mutation revalidation remain on direct request-time services.
- `src/lib/data/services/getArticleList.ts` is shared by
  `BiographySectionLoader` and `GET /api/v2/public/article`, so the home
  biography section no longer self-fetches the same app for biography article
  list data.
- `src/lib/data/services/getBlogBySlugWithAuthor.ts` and
  `src/lib/data/services/getBlogBySlugWithComments.ts` are shared by
  direct public blog API routes and comments-mode server rendering. After
  T-241, non-comments public blog detail server rendering uses the cached
  primary blog wrapper while populated comments stay on
  `getBlogBySlugWithComments`.
- `src/lib/data/services/getBlogList.ts` is shared by `BlogListLoader`,
  `BlogSectionLoader`, and `GET /api/v2/public/blog`, so public blog list and
  home blog section server rendering no longer self-fetch the same app for blog
  list data.
- `src/lib/data/services/getCollectionWithArtworks.ts` and
  `src/lib/data/services/getCollectionArtwork.ts` are shared by
  `CollectionArtworksPaginationLoader`, `CollectionArtworkLoader`,
  `GET /api/v2/public/collection/[slug]/artwork`, and
  `GET /api/v2/public/collection/[slug]/artwork/[id]`, so collection artwork
  pagination and selected-artwork server rendering no longer self-fetch the
  same app for collection artwork reads.

## Public Detail Not-Found And Error Contract

T-199 accepts this contract for public detail pages before runtime changes are
split across route families. It covers standalone artwork, collection-scoped
artwork, biography articles, blog posts, and Shopify product details.

Primary content is the thing named by the URL: the artwork, collection-scoped
artwork, article, blog post, or Shopify product. Missing primary content is a
404. Upstream/service failures are not 404s. Optional related content can
degrade without changing the route status when the primary content is present.

| Condition | Accepted route behavior | Implementation owner |
| --- | --- | --- |
| Malformed route params | Return `notFound()` before expensive data access when the route param has a canonical syntactic shape. MongoDB artwork IDs must be 24 hex characters for `/artwork/[artworkId]` and `/collections/[slug]/[artworkId]`. Slugs and Shopify product handles remain opaque path segments unless a future accepted schema defines stricter validation. | Page-level param guards or a narrow route-local helper. |
| Valid params with missing primary content | Return `notFound()`. This includes `getArtworkById()` returning `null`, `getCollectionArtwork()` returning `collection-not-found` or `artwork-not-found`, `getArticleBySlugPopulated()` returning `null`, blog detail services returning `null`, and `getProductByHandle()` returning `null`. | Route page or server loader wrapper that is closest to the primary content fetch. Shared data services must not call `notFound()` because they also back API routes. |
| Upstream/service failure while loading primary content | Throw after structured server logging where the route or loader already owns logging. Let the App Router error boundary handle the failure. Do not convert provider, database, transform, or unexpected service failures into a 404. | Route page or server loader. |
| Optional related-content failure | Render the primary detail page, log the failure when useful, and omit or replace the related area with a compact unavailable/empty state. Do not call `notFound()` and do not fail the route. | Route loader/component that owns the related section. |

Accepted optional related content by route family:

| Route family | Primary content | Optional related content |
| --- | --- | --- |
| `/artwork/[artworkId]` | Artwork document. | Shopify product links, subscribe section session state, structured data. |
| `/collections/[slug]/[artworkId]` | Collection plus selected artwork membership. Missing collection and missing selected artwork both mean the URL has no primary content. | Shopify product links and structured data. |
| `/biography/[slug]` and project article detail pages | Article document. | Previous/next navigation and route-specific form content. Navigation failure should not hide a found article. |
| `/blog/[slug]` | Blog post document. | Author/comment population, comment list mode, and structured data. A found post should render even if comments are unavailable. |
| `/shop/products/[productHandle]` | Shopify product. | Linked archive artwork, book featured artwork cards, framed-preview eligibility data, and structured data. Missing linked archive records do not make the Shopify product 404. |

Not-found UI should be public and consistent, but route families need different
return links. The accepted implementation shape is a shared
`PublicDetailNotFound` view/component plus route-local `not-found.tsx` files for
the detail route families that call it with route-appropriate labels and links.
The first implementation slice should add only the route-local files needed by
the routes it converts; later slices can add the remaining route-local
not-found files as they change those routes.

`generateMetadata()` should mirror the same distinction without creating
runtime side effects: missing primary content uses the existing missing-detail
metadata helper, upstream failures use unavailable-detail metadata, and optional
related-content failures should not change primary detail metadata.

Runtime implementation order:

1. Convert artwork and collection-scoped artwork first. Add the shared public
   detail not-found view, route-local not-found files for those two route
   families, page-level ObjectId validation for collection-scoped artwork, and
   loader/page mappings from missing primary content to `notFound()`. Preserve
   optional Shopify product-link degradation.
2. Convert biography/project article and blog detail loaders. Missing articles
   or blog posts become `notFound()`, while article navigation and comment
   population become optional related-content paths with logged degradation.
3. Revisit Shopify product detail only for consistency after the shared
   not-found UI exists. Product primary-content behavior already calls
   `notFound()` for missing Shopify products; linked archive artwork and book
   artwork failures already degrade.

## Patterns To Audit

- Page-level data fetching in `src/app/**/page.tsx`.
- Server loader components under `src/components/loaders/`.
- Client compositions that fetch after mount.
- API routes used only to support server-renderable page data.
- Cache and revalidation behavior for MongoDB and Shopify reads.
- Error, loading, empty, and not-found states.

## Open Questions

- Which routes must be fully server-rendered for production launch?
- Which routes can remain client-interactive after a server-rendered shell?
- What cache and revalidation policy should Shopify reads use?
- Which service result shape should become the standard across public, user, and
  admin data services?
- What test strategy proves SSR behavior without brittle implementation checks?

## Reconciled Audit Findings

[A-015](../audits/results/A-015-ssr-data-fetching.md) confirmed that the app has
the desired high-level shape for several public routes: server pages and
loaders provide initial data, then client components handle interaction.

The remaining production blockers are tracked through the
[architecture refactor workstream](../workstreams/architecture-refactor-and-code-health.md),
[production risks](../risks/production-readiness.md), and
[ADR 0004](../decisions/0004-server-data-access-ownership.md):

- Some server loaders and server API wrappers still self-fetch the same app over
  absolute HTTP URLs until migrated to the ADR 0004 service pattern.
- Several MongoDB-backed API routes and account server actions lack explicit DB
  connection ownership.
- The root layout performs DB/session work globally, which blocks route-specific
  cache and rendering policy.
- Cache/revalidation behavior is inconsistent across MongoDB-backed public data,
  user/admin data, and Shopify reads.

Track discovery in
[A-015 SSR and data-fetching strategy](../audits/goals.md#a-015-ssr-and-data-fetching-strategy)
and implementation work in
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md).
