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

No public route uses `revalidate` in the current policy.
`generateStaticParams()` is deferred for content and commerce detail routes
until owner-approved data freshness, build-time MongoDB/Shopify availability,
and detail-param coverage are defined.

| Route group | Current route examples | Current cache policy | Owner/blocker |
| --- | --- | --- | --- |
| Stable static shell | `/biography`, `/collections`, `/project`, `/project/about`, `/project/aims`, `/project/film`, `/shop` | Leave without forced dynamic config, ISR config, or generated params. These routes can prerender when their current shell/redirect behavior allows it. | Keep root layout and middleware free of global DB/session work. Revisit if route-local loaders are added. |
| Query-driven public browse/search | `/artwork`, `/blog`, `/search`, `/shop/products`, `/project/contact` | `dynamic = "force-dynamic"` is explicit. Query params select filters, sort, pagination, search terms, or product enquiry context and should not be silently treated as static. | A future ISR/static task must first define canonical query variants or split static shells from query results. |
| DB-backed public detail/redirect | `/artwork/[artworkId]`, `/biography/[slug]`, `/blog/[slug]`, `/collections/[slug]`, `/collections/[slug]/[artworkId]` | `dynamic = "force-dynamic"` is explicit. These routes read owner-controlled MongoDB content at request time for detail content, redirect targets, metadata, JSON-LD, or saved-item state. | Static params and ISR are deferred until content freshness, not-found behavior, and build-time DB access are approved. |
| Shopify-backed public commerce | `/shop/products`, `/shop/products/[productHandle]` | `dynamic = "force-dynamic"` is explicit. Shopify product availability, metadata, and linked artwork reads remain request-time behavior. | Future commerce cache policy must define Shopify freshness, product-handle coverage, and fallback behavior. |
| Session-aware public UI | `/`, `/artwork/[artworkId]` | `dynamic = "force-dynamic"` is explicit. The home page includes subscription session state, and artwork detail reads session user context for saved-item ownership. | Split session-only islands or define a separate personalized-data strategy before static rendering. |

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
- `src/lib/data/services/getArticleList.ts` is shared by
  `BiographySectionLoader` and `GET /api/v2/public/article`, so the home
  biography section no longer self-fetches the same app for biography article
  list data.
- `src/lib/data/services/getBlogBySlugWithAuthor.ts` and
  `src/lib/data/services/getBlogBySlugWithComments.ts` are shared by
  `BlogDetailLoader`, `GET /api/v2/public/blog/[slug]`, and
  `GET /api/v2/public/blog/[slug]/comments`, so public blog detail server
  rendering no longer self-fetches the same app for either comments mode.
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
