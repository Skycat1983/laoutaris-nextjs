# A-015 SSR And Data-Fetching Strategy Result

Status: Completed

Audit goal: [A-015 SSR and data-fetching strategy](../goals.md#a-015-ssr-and-data-fetching-strategy)

Workstream: [Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md)

## Summary

The app already uses App Router server components and server loaders for most
public initial renders, so the intended "server shell plus client interaction"
model is present. The strategy is not production-ready yet because most server
loaders fetch their own Next.js API routes over HTTP with environment-derived
absolute URLs, cache policy is mostly implicit or disabled, some API routes used
by SSR do not establish their own MongoDB connection, and shop product detail
uses a non-existent artwork API path. Client-side fetching is mostly intentional
for filters, infinite scroll, comments, admin CRUD, forms, and artwork sale
badges, but those paths need clearer boundaries and tests.

## Scope Inspected

- Required documentation:
  - `docs/README.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
  - `docs/architecture/rendering-and-data-fetching.md`
  - `docs/workstreams/frontend-routes-and-components.md`
  - `docs/audits/goals.md#a-015-ssr-and-data-fetching-strategy`
- Linked architecture/risk context:
  - `docs/architecture/system-overview.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/architecture/shopify-commerce.md`
  - `docs/risks/production-readiness.md`
- Page and layout surface:
  - `src/app/**/page.tsx`
  - `src/app/**/layout.tsx`
  - `src/app/layout.tsx`
  - `src/app/error.tsx`
  - route loading files under `src/app/`
- Loader surface:
  - `src/components/loaders/viewLoaders/`
  - `src/components/loaders/componentLoaders/`
  - `src/components/loaders/sectionLoaders/`
  - `src/components/modules/navigation/header/Header.tsx`
- API, Shopify, and database fetch surface:
  - `src/lib/api/serverApi.ts`
  - `src/lib/api/public/serverPublicApi.ts`
  - `src/lib/api/user/serverUserApi.ts`
  - `src/lib/api/admin/serverAdminApi.ts`
  - `src/lib/api/clientApi.ts`
  - `src/lib/api/core/createFetcher.ts`
  - `src/lib/api/shopify/shopifyClient.ts`
  - public, user, admin, and shop API routes under `src/app/api/v2/`
  - MongoDB connection helpers under `src/lib/db/`
- Client fetch surface:
  - `src/components/artwork/ArtworkGallery.tsx`
  - `src/components/compositions/ShopProductGallery.tsx`
  - `src/components/modules/cards/ArtworkShopSection.tsx`
  - `src/components/views/BlogDetail.tsx`
  - admin feed/read/update/create/operation components under
    `src/components/features/adminDashboard/`
  - public form and user action components that call client APIs or server
    actions.
- Test and script surface:
  - `package.json`
  - `__tests__/`

## Commands Run

- `git status --short`: confirmed pre-existing dirty/untracked docs and README
  state before editing; runtime code was not changed.
- `sed -n ... docs/...`: read the required docs, linked architecture/risk docs,
  audit goal, existing A-015 result placeholder, audit result template, and
  related existing audit results.
- `rg --files -g 'page.tsx' src/app`: inventoried App Router pages.
- `rg --files src/components/loaders`: inventoried loader components.
- `rg --files -g 'layout.tsx' src/app`: inventoried layouts that participate in
  route data fetching and dynamic rendering.
- `rg -n "fetch\\(|clientApi|serverApi|Shopify|dbConnect|dynamic|revalidate|cache|headers\\(|cookies\\(|getServerSession" ...`:
  found server fetches, client fetches, cache flags, dynamic route flags,
  session reads, and MongoDB connection points.
- `rg --files -g 'route.ts' src/app/api`: inventoried API routes used by server
  and client fetch paths.
- `rg --files __tests__` and targeted `rg` in `__tests__`: checked whether SSR,
  loader, route, API, Shopify, or cache behavior is covered by tests.
- `nl -ba ...`: captured line-numbered evidence from inspected pages, loaders,
  API clients, API routes, DB helpers, client fetch components, and actions.
- Three early `nl -ba` commands against bracketed route paths failed because
  zsh treated the brackets as globs; the same paths were rerun successfully with
  quoted paths.
- No build, lint, or test commands were run because this was a static,
  non-mutating audit and no runtime code was refactored.

## Rendering Strategy Inventory

| Route area | Current strategy | Assessment |
| --- | --- | --- |
| `/` | Server page renders `Home`, which composes section loaders in `Suspense`. `Home` uses `CollectionsSectionLoader`, `BiographySectionLoader`, `BlogSectionLoader`, `SubscribeSectionLoader`, and static project content. | SSR initial data exists, but all data loaders rely on the same internal HTTP API layer or session helper, and root layout makes the whole tree dynamic. |
| `/artwork` | Server page parses search params and passes initial sort/filter state to `ArtworkListLoader`, which fetches initial artwork data server-side and hands it to client `ArtworkGallery`. | Good intended pattern: SSR first page plus client-side filtering and infinite load. Fragile because the server loader uses HTTP back into the app API. |
| `/artwork/[artworkId]` | Server page validates ObjectId shape and renders `ArtworkLoader` in `Suspense`. Loader fetches the artwork server-side. | SSR detail render works in shape. Fragile because loader uses internal HTTP and includes a debug delay. |
| `/collections` and `/collections/[slug]` | Server pages fetch navigation data and redirect to canonical collection/artwork paths. Collection detail layout and page use server loaders for subnav, artwork detail, and pagination. | SSR and redirects are present, but several collection API handlers used by these loaders do not call `dbConnect()`. |
| `/blog` and `/blog/[slug]` | Server pages render `BlogListLoader` or `BlogDetailLoader`; client `BlogDetail` intentionally fetches comments on demand unless requested via `?comments=true`. | Initial SSR works in shape. Comment hydration is intentional client-side behavior. |
| `/biography` and `/project/about|contact` | Biography redirects to first article; article routes use `ArticleLoader` for article plus navigation data. Contact embeds a client form. | SSR content render works in shape. Contact form has client/server import boundary risk. |
| `/search` | Server page calls `serverApi.public.search.search` and renders results. | SSR attempted, but the search API route uses models without an explicit `dbConnect()`, so it relies on ambient connection state. |
| `/shop/products` | Server page renders banner and `ShopProductsLoader`; loader fetches `/api/v2/public/shop/products` with `cache: "no-store"` and passes results to client `ShopProductGallery`. | SSR product listing is attempted but fragile: server self-fetch, no caching, and MongoDB plus Shopify fan-out happen on every initial render. |
| `/shop/products/[productHandle]` | Server page directly calls Shopify by handle, then tries to fetch linked MongoDB artwork/book data via `/api/artworks/:id`. | Production blocker: the linked artwork path is not a live route and does not match the documented `/api/v2/public/artwork/[id]` envelope. |
| `/account/*` | Account pages and layouts use server loaders for profile, comments, favourite/watchlist detail and pagination. Some index pages currently redirect to settings. | SSR is attempted for authenticated data, but it depends on self-HTTP user APIs and several watchlist paths lack explicit DB connection. |
| `/admin/dashboard/*` | Server route shell renders client admin tabs and client feed/read components. Admin data is intentionally fetched client-side through admin APIs. | Client-side fetching is expected for CRUD/admin interaction, but it needs auth/API tests rather than SSR hardening. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Public and account SSR depends on self-HTTP calls to the same Next.js app instead of direct server data access. This makes SSR fragile in build, preview, serverless, local test, and cold-start contexts. | `serverPublicApi`, `serverUserApi`, and `serverAdminApi` construct absolute URLs from `VERCEL_ENV`/`VERCEL_URL` or `http://localhost:3000` (`src/lib/api/public/serverPublicApi.ts:11-31`, `src/lib/api/user/serverUserApi.ts:9-30`, `src/lib/api/admin/serverAdminApi.ts:8-29`). `createFetcher` then calls `fetch(finalUrl)` (`src/lib/api/core/createFetcher.ts:42-48`). Server loaders call this path for route-critical data, for example artwork list (`src/components/loaders/viewLoaders/ArtworkListLoader.tsx:16-22`), article pages (`src/components/loaders/viewLoaders/ArticleLoader.tsx:30-33`), collection artwork (`src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:15-19`), account profile (`src/components/loaders/componentLoaders/UserSettingsLoader.tsx:9-18`), and search (`src/app/search/page.tsx:23-27`). | Establish a server data-access layer that calls MongoDB/Shopify/transforms directly from server components and API routes. Keep HTTP fetchers for browser clients and external consumers. Add route-level tests or integration tests that render server pages without needing a running `localhost:3000` server. |
| High | `/shop/products/[productHandle]` cannot reliably SSR linked artwork or book context because it fetches a non-existent `/api/artworks/:id` route. | Product detail helpers fetch `${baseUrl}/api/artworks/${product.mongodbArtworkId}` and `${baseUrl}/api/artworks/${id}` with `cache: "no-store"` (`src/app/shop/products/[productHandle]/page.tsx:20-45`). The live public artwork route is `src/app/api/v2/public/artwork/[id]/route.ts:9-37` and returns `{ success, data }`. `rg --files src/app/api` found no `/api/artworks` route. A-001 already identified the same commerce blocker. | Replace route-local artwork fetches with the canonical server-side public artwork data helper or `/api/v2/public/artwork/[id]` envelope parsing. Add product detail coverage for original, print, book, missing linked artwork, and malformed Shopify metafields. |
| High | Several API handlers used by SSR or server loaders query Mongoose models without establishing a route-local MongoDB connection. This makes those server renders depend on connection side effects from another route or layout. | Search API imports models and queries them but has no `dbConnect()` (`src/app/api/v2/public/search/route.ts:1-17`, `:37-81`). Collection detail and collection artwork APIs query `CollectionModel` without `dbConnect()` (`src/app/api/v2/public/collection/[slug]/route.ts:1-14`, `src/app/api/v2/public/collection/[slug]/artwork/route.ts:11-25`, `src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts:7-18`). Navigation item/artworks APIs have the same issue (`src/app/api/v2/public/navigation/collections/[slug]/route.ts:7-19`, `src/app/api/v2/public/navigation/collections/[slug]/artworks/route.ts:13-25`). Watchlist APIs also query models without `dbConnect()` (`src/app/api/v2/user/watchlist/route.ts:17-32`, `src/app/api/v2/user/watchlist/[artworkId]/route.ts:13-31`). | Require every API route that touches MongoDB to call a shared `withDbConnect`/`dbConnect` wrapper before model access. Add route tests that import handlers in isolation so missing connection setup is visible. |
| High | The root layout forces all public routes into per-request dynamic rendering and DB/session work, so cache/revalidation choices cannot be made per route today. | `RootLayout` imports `dbConnect`, calls it on every root render, then calls `getServerSession(authOptions)` (`src/app/layout.tsx:17-33`). `authOptions` imports the MongoDB adapter client promise at module load (`src/lib/config/authOptions.ts:10`, `:35-39`). The rendering architecture doc says the desired cache/revalidation strategy is still open (`docs/architecture/rendering-and-data-fetching.md`). | Move route-neutral auth/session state and DB work out of the global root layout where possible. Define which public archive routes should be static, ISR, or dynamic, then set explicit `dynamic`, `revalidate`, or fetch cache policy per route. |
| Medium | Cache behavior is inconsistent and mostly implicit. Shopify has a one-hour production revalidation rule, shop listing disables cache, most MongoDB-backed self-fetches inherit default fetch behavior, and user APIs force dynamic only in some places. | Shopify `shopifyFetch` uses `cache: "no-store"` in development and `next.revalidate: 3600` in production (`src/lib/api/shopify/shopifyClient.ts:27-40`). `ShopProductsLoader` self-fetches the listing API with `cache: "no-store"` (`src/components/loaders/viewLoaders/ShopProductsLoader.tsx:40-53`). Product detail artwork fetches also use `cache: "no-store"` (`src/app/shop/products/[productHandle]/page.tsx:21-24`, `:38-42`). Public navigation APIs force dynamic (`src/app/api/v2/public/navigation/collections/route.ts:13`, `src/app/api/v2/public/navigation/articles/[section]/route.ts:15`), while most public artwork/blog/article/collection APIs have no explicit cache or route segment config. | Document and implement route-specific policy: static/ISR for public archive and article data where possible, dynamic/no-store for authenticated user/admin data, and an explicit Shopify revalidation strategy aligned to product freshness needs. |
| Medium | Intentional client-side fetching exists but is not consistently separated from server-only imports and API contracts. | `ArtworkGallery` starts with server-provided `initialArtworks`, then uses `clientApi.public.artwork.multiple` for filters and pagination (`src/components/artwork/ArtworkGallery.tsx:31-40`, `:44-99`, `:108-149`). `ShopProductGallery` starts with server-provided products and fetches `/api/v2/public/shop/products` for filter changes (`src/components/compositions/ShopProductGallery.tsx:22-40`, `:79-142`). `BlogDetail` loads comments and posts comments through `clientApi` (`src/components/views/BlogDetail.tsx:31-60`, `:62-93`). Admin feeds/read lists fetch client-side after mount (`src/components/features/adminDashboard/feeds/ArtworkFeed.tsx:21-49`, `src/components/features/adminDashboard/crudForms/read/ReadArtworkList.tsx:23-44`). However, `ContactForm` is a client component that imports `serverApi` and `EnquiryBase` from server/model modules (`src/components/modules/forms/user/ContactForm.tsx:1-21`), and `EnquiryForm` imports `EnquiryBase` from models (`src/components/modules/forms/user/EnquiryForm.tsx:1-23`). | Keep the client-fetch patterns, but split shared types from Mongoose/server modules and remove server API imports from client components. Add import-boundary checks for client files that import `next/headers`, server API modules, DB models, or barrel exports that can pull those modules. |
| Medium | Account favourite/watchlist server actions update MongoDB without explicit connection setup or revalidation, so authenticated SSR data can become stale or fail if the action runs without an existing connection. | `updateUserFavourites` and `updateUserWatchlist` are server actions and query/update `UserModel` and `ArtworkModel` directly (`src/lib/actions/updateUserFavourites.ts:17-64`, `src/lib/actions/updateUserWatchlist.ts:17-64`). Both import `revalidatePath` but do not call it (`src/lib/actions/updateUserFavourites.ts:6`, `src/lib/actions/updateUserWatchlist.ts:7`). Neither action calls `dbConnect()`. | Add shared DB connection handling to server actions that touch MongoDB, then revalidate or redirect affected artwork/account routes after mutations. Cover favourite/watchlist mutation plus subsequent server render in tests. |
| Medium | Error, empty, and not-found behavior is inconsistent across loaders, which weakens SSR reliability and makes production failure modes hard to reason about. | `ArtworkLoader` throws on failure (`src/components/loaders/viewLoaders/ArtworkLoader.tsx:11-15`), while `CollectionArtworkLoader` catches non-Next errors and returns `null` (`src/components/loaders/viewLoaders/CollectionArtworkLoader.tsx:35-40`). Section loaders return `null` on many failures (`src/components/loaders/sectionLoaders/BiographySectionLoader.tsx:22-28`, `src/components/loaders/sectionLoaders/BlogSectionLoader.tsx:30-35`, `src/components/loaders/sectionLoaders/CollectionSectionLoader.tsx:27-32`). The app has only a root `error.tsx` and a global loading file plus one admin feed loading file (`rg --files -g 'loading.tsx' -g 'error.tsx' -g 'not-found.tsx' src/app`). | Define loader error contracts by route type: public detail pages should use `notFound()` for missing content, section loaders should render explicit empty/error states, and route-critical fetch failures should reach an error boundary. Add tests for missing artwork, missing article, empty collections, and upstream API failure. |
| Medium | SSR/data-fetching behavior is not covered by the current test surface. | `package.json` exposes `npm test`, `npm run build`, and `npm run lint` (`package.json:5-11`). `rg --files __tests__` found only utility tests and one Home view test. The Home test mocks server loaders rather than exercising data fetch behavior (`__tests__/integration/views/Home.test.tsx`), and targeted searches found no route handler, server loader, Shopify cache, or page-render tests. | Add focused tests before refactoring: route handler tests with mocked DB/Shopify, server loader tests that do not require a live Next server, client fetch component tests for filter/comment/admin paths, and a build check once route segment/caching decisions are changed. |
| Low | Debug-only delays and logging are still inside production SSR/data-fetch paths. | `ArtworkLoader` awaits `delay(1000)` before fetching (`src/components/loaders/viewLoaders/ArtworkLoader.tsx:6-11`). `RootLayout` logs a branch verification timestamp on render (`src/app/layout.tsx:28-32`). `createFetcher` logs endpoint/options/stack and response for every API fetch (`src/lib/api/core/createFetcher.ts:27-31`, `:50-55`). Several loaders and shop paths log initial data and fetched products (`src/components/loaders/viewLoaders/ArtworkListLoader.tsx:24-34`, `src/components/loaders/viewLoaders/ShopProductsLoader.tsx:46-70`, `src/components/compositions/ShopProductGallery.tsx:19-20`). | Remove debug delays and gate logs behind an explicit development/debug flag before relying on SSR timings or production observability. |

## Working Patterns To Preserve

- Server pages generally keep URL parsing and redirect decisions at the route
  boundary, then delegate data work to loader components.
- Public browse/detail pages already pass server-fetched initial data into
  client components for interaction, which matches the intended direction for
  artwork filters, blog comments, and shop filters.
- User/admin client fetches are mostly appropriate for interactive CRUD,
  mutation, and account workflows, provided auth/API contracts are hardened.
- Shopify listing follows the documented high-level join shape: filter MongoDB
  artworks, extract `shopifyProducts`, deduplicate product IDs, then fetch
  products from Shopify (`src/app/api/v2/public/shop/products/route.ts:30-135`).

## Build And Test Recommendations

- Static follow-up first:
  - Add an import-boundary check for client files importing `serverApi`,
    `next/headers`, `src/lib/db`, or `src/lib/data/models`.
  - Add a route inventory check that every MongoDB-backed API route calls
    `dbConnect()` or `withDbConnect()`.
- Targeted tests before broad refactor:
  - Server loader tests for artwork list/detail, article detail, collection
    detail, search, and shop product listing without a live `localhost:3000`
    server.
  - API route tests for missing DB connection setup, response envelopes, not
    found behavior, and Shopify upstream failures.
  - Client component tests for `ArtworkGallery`, `ShopProductGallery`,
    `BlogDetail`, and admin feed/read components.
- After implementation changes touch route segment config, API fetchers, or root
  layout behavior, run:
  - `npm test`
  - `npm run build`
  - `npm run lint`

## Findings Register Updates

- Not updated by this audit because the assignment explicitly scoped edits to
  `docs/audits/results/A-015-ssr-data-fetching.md`.
- Candidate rows for reconciliation:
  - High, Rendering: Server loaders and server APIs self-fetch the same Next app
    over absolute HTTP URLs instead of direct server data access.
  - High, Rendering/Shopify: `/shop/products/[productHandle]` fetches linked
    artwork from a non-existent `/api/artworks/:id` route.
  - High, Data/API: Several MongoDB-backed API routes used by SSR omit explicit
    `dbConnect()` setup.
  - High, Rendering/Cache: Root layout forces all public routes into dynamic
    DB/session work.
  - Medium, Rendering/Cache: Cache and revalidation policy is inconsistent
    across MongoDB and Shopify reads.
  - Medium, Client/server boundary: Client fetch components still import server
    or model modules in some places.
  - Medium, Account: Favourite/watchlist server actions lack explicit DB
    connection and route revalidation.
  - Medium, Quality: SSR/data-fetching behavior has no reliable test coverage.

## Risks Updated

- None. Existing risk R-012 directly covers the unreliable rendering strategy,
  but this audit was scoped to the result file only.
- Candidate escalation for reconciliation: add or update a production-readiness
  risk for MongoDB-backed API routes that omit route-local connection setup, if
  this is not folded into R-012.

## Workstream Updates

- None. The assignment explicitly scoped edits to this result file and said not
  to update shared reconciliation docs unless instructed.

## Next Action

Define the canonical server data-access pattern for public archive routes, then
start with a narrow proof on one high-value route, such as `/artwork` or
`/collections/[slug]/[artworkId]`: replace self-HTTP server fetching with direct
server data access, set explicit cache/dynamic behavior, and add a route or
loader test that proves it works without a live `localhost:3000` server.
