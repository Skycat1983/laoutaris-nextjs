# Frontend Routes And Components Workstream

Status: Active

Goal: stabilize public pages, component composition, responsive behavior, and
Next.js server/client component boundaries.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Testing runbook](../runbooks/testing.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-017 Search, navigation, and content discovery](../audits/goals.md#a-017-search-navigation-and-content-discovery)
- [A-010 Performance, SEO, and accessibility](../audits/goals.md#a-010-performance-seo-and-accessibility)

## Blocks

- Public UX production polish.
- Safe refactors across shared component modules.
- Shop and archive route hardening.

## Related Code Areas

- `src/app/`
- `src/components/views/`
- `src/components/layouts/`
- `src/components/modules/`
- `src/components/compositions/`
- `src/components/loaders/`
- `src/components/shadcn/`

## Current Facts

- The app uses App Router server components for pages and loader components.
- Public route groups include home, artwork, collections, biography, blog,
  project, search, and shop.
- Shared card, navigation, filter, and loader modules are reused across routes.
- Historical shop notes identify barrel exports as a client bundle risk.
- A-013 and A-015 found client components importing server/model modules or
  broad barrels that can cross client/server boundaries.
- A-015 found public loaders handle error, empty, and not-found states
  inconsistently.
- A-001 found visible shop filter, pagination, and sorting controls whose UI
  behavior is not backed consistently by API data.
- A-002 found public list APIs have inconsistent empty-state semantics and that
  public search omitted pagination metadata; T-021 now honors the public search
  fetcher's `type` parameter.
- A-016 found legacy search, auth, and comment controls that need accessible
  labels or button semantics, and confirmed public search/filter UI relies on
  API query parsing that is not yet bounded server-side. T-021 bounded the
  public search route/page query parser; T-035 bounded artwork browse filters;
  T-036 bounded shop browse filters.
- T-013 fixed the sign-in credential field labels and converted the sign-in and
  sign-up modal switches from clickable spans to buttons.
- T-019 removed the stale `/protected` App Router page and protected-route
  constant; no documented frontend workflow owned that route.
- T-021 updated the `/search` page so its initial server render uses direct
  server data access and bounded query parsing instead of same-app HTTP.
- T-035 validates public artwork browse query params before the artwork list
  service receives them; existing valid frontend filter behavior was preserved.
- T-036 validates public shop browse query params at the API boundary while
  preserving existing valid shop filter UI behavior.
- T-060 removed public shop controls that were visible but not backed by API
  behavior: colour/dimension filters and hard-coded pagination.
- T-061 replaced public shop default type sorting that read product titles with
  metadata-based sorting from Shopify `productType`.
- A-020 found missing policy links/notices on public data-collection and
  commerce surfaces, including newsletter, comments, contact, signup/OAuth
  entry, third-party embeds, and commerce assurance copy.
- A-009 found blog and collection image URLs can accept hosts that are not
  backed by the current Next image allowlist, and Cloudinary delivery
  transformations are duplicated across frontend components.
- T-067 removed direct debug logging, polling, and widget DOM/iframe inspection
  from the admin Cloudinary upload button without changing upload widget
  behavior.
- T-068 removed direct public shop gallery and loader debug logging, and the
  loader no longer tells public users to check the console on product-loading
  failures.
- T-070 moved `CollectionsSubnavLoader` to the shared server-only
  `getCollectionNavigationList` service while preserving rendered `Subnav`
  link construction.
- T-071 moved `BiographySubnavLoader` and `MainNavLoader` to shared server-only
  navigation services while preserving rendered `Subnav` and `MainNav` links.
- T-072 moved the biography default redirect page and `ArticleLoader`
  navigation path to `getArticleNavigationList` while preserving redirect and
  previous/next link behavior.
- T-073 moved the collection redirect pages to server-only collection
  navigation services while preserving redirect target paths.
- T-074 moved `ArticleLoader`'s populated article detail data to
  `getArticleBySlugPopulated` while preserving `ArticleView` props, optional
  form rendering, and previous/next navigation.
- T-075 moved `BlogDetailLoader` to shared server-only blog detail services
  while preserving `BlogDetail` props and `showComments` behavior.
- T-076 moved `BlogListLoader` and `BlogSectionLoader` to a shared server-only
  blog list service while preserving blog list/section props and current sort
  behavior.
- T-077 moved `ArtworkLoader` to the existing server-only artwork detail
  service while preserving `ArtworkView` props, the subscribe section, and
  generic load-failure behavior.
- T-078 moved `CollectionArtworkLoader` and
  `CollectionArtworksPaginationLoader` to shared server-only collection artwork
  services while preserving selected artwork rendering and pagination links.
- T-079 moved `BiographySectionLoader` to the shared server-only
  `getArticleList` service while preserving `BiographySection` props and
  fallback behavior.
- T-080 moved `CollectionSectionLoader` to the shared server-only
  `getCollectionList` service while preserving `CollectionSection` props and
  fallback behavior.
- T-081 moved `AccountSubnavLoader` to a shared server-only account navigation
  service while preserving account subnav links, disabled states, and first
  favourite/watchlist segment behavior.
- T-083 moved the account favourites/watchlist list and detail loaders to
  shared server-only saved-artwork services while preserving saved-item
  pagination links and `ArtworkView` props.
- T-084 moved `UserSettingsLoader` and `UserCommentsLoader` to shared
  server-only profile/comment services while preserving account settings props,
  comment view props, and focused loader failure behavior.
- T-085 moved `ShopProductsLoader` to shared server-only `getShopProductList`
  service logic while preserving `ShopProductGallery` props, backed shop filter
  inputs, and the neutral loader failure UI.
- T-086 replaced the remaining hard-coded same-app origins in `LogoutForm`,
  `MobileNavDrawer`, and the `/project` redirect with relative app paths while
  preserving current account drawer labels, order, and disabled states.
- T-087 removed the stale account favourites `serverApi` import and commented
  old self-fetch block while preserving the current redirect to
  `/account/settings`.
- T-137 added a recursive client runtime import graph guard, split the
  client-safe `NavBarLink` type out of `MainNavLoader`, replaced scoped
  mixed-barrel client imports with direct imports, and requires no allowlist for
  current client entries.
- T-089 removed direct render `console.log()` output from root layout,
  `Subnav`, `ArticleView`, `DesktopArticleView`, and `UserCommentsView` while
  preserving layout, navigation, article, and account comments behavior.
- T-090 removed remaining scoped user-facing public/account `console.log()`
  output from `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`,
  `EnquiryForm`, `SubscribeSectionLoader`, the account favourite artwork page,
  and `CollectionViewPagination` while preserving the current public/account
  behavior.
- T-091 removed direct `console.log()` output from the scoped admin dashboard
  create/update forms and artwork filter dropdowns while preserving current
  dashboard validation, upload, submit/update, and filter behavior.
- T-092 removed success-path `console.log()` output from scoped admin read-list
  copy flows, `ArtworkFeedCard`, and the shared `copy_id()` helper while
  preserving copy-to-clipboard, read-list fetch, filter, loading, error, card,
  and skeleton behavior.
- T-093 removed direct `console.log()` output from shared UI components and
  the public artwork fetcher while preserving feed rendering, navigation
  active/disabled behavior, refresh behavior, YouTube embed behavior, and
  artwork query URL construction.
- T-095 removed stale commented `console.log()` snippets from the session
  provider, collection section, main navigation, and admin content layout while
  preserving rendering behavior. Full-source source-hygiene coverage now keeps
  `src` free of direct or commented `console.log()` calls.
- T-100 wires `/project/contact?product=...` into `ContactForm` with normalized
  product context, editable prefilled subject/message text, and preserved
  ordinary contact form behavior when no valid product query is present.
- A-010 found public route performance/SEO/accessibility gaps: global
  root-layout DB/session work and middleware token parsing keep public routes
  dynamic, root metadata is still scaffold copy, sitemap/robots/structured data
  are missing, hero/detail images need sizing and preload tuning, public search
  and drawer controls need real labelled button semantics, several pages expose
  nested main landmarks/noisy h1 usage, and artwork-to-shop links depend on
  client-side product fetches.
- T-103 replaced scaffolded root metadata with production-safe Joseph
  Laoutaris archive metadata and added baseline `robots.ts`/`sitemap.ts` for
  stable public routes. Route-specific detail metadata and JSON-LD remain
  separate.
- T-104 replaced scoped public search, mobile search drawer, mobile navigation
  drawer, and unauthenticated favourite/watchlist clickable icon or wrapper
  targets with labelled semantic buttons while preserving search URLs, drawer
  behavior, navigation links, authenticated saved-item forms, and tooltips.
- T-105 completed the remaining F-062 comment action accessibility slice by
  adding labelled non-submit controls for owner-only comment edit, delete,
  cancel, and save actions while preserving owner checks and mutation behavior.
- T-106 added route-specific metadata, canonical/social previews, and
  conservative JSON-LD for public biography article and blog detail pages
  without changing visible layout, comment-query behavior, or route cache
  policy.
- T-107 added route-specific metadata, canonical/social previews, and
  conservative JSON-LD for public artwork, collection-scoped artwork, and
  Shopify product detail pages without changing visible layout, saved-item
  behavior, product enquiry handoff, or route cache policy.
- T-108 tuned public image preload/sizing behavior for the active home hero
  path, shop banner/product detail images, product-detail featured artwork
  thumbnails, and artwork magnifier intent loading.
- T-109 completed the A-010/F-089 public landmark and heading cleanup: the
  root layout spacing wrapper is no longer a `<main>`, touched public
  routes/views own their page landmarks, repeated public visual modules no
  longer use `h1` for styling, and focused source invariants cover the
  ownership pattern.
- T-110 codified the public route rendering/cache matrix and added explicit
  `force-dynamic` segment config to remaining route-local dynamic public pages
  without broad static/ISR migration.
- T-111 makes artwork-to-shop product relationships discoverable in initial
  server-rendered artwork detail output.
- T-112 adds conservative breadcrumb JSON-LD to biography article, blog post,
  standalone artwork, collection-scoped artwork, and Shopify product detail
  pages without visible breadcrumb UI, navigation, metadata, enquiry, or route
  cache policy changes.
- T-130 removed direct `console.error()` calls from scoped public browsing
  clients while preserving artwork filter/loading state, infinite-scroll error
  state, blog continuous loading propagation, blog comment failure modals, and
  shop filter/sort/loading fallback behavior.
- T-131 removed direct `console.error()` calls from scoped account/user clients
  while preserving contact/comment form state, logout and account-nav modal and
  loading behavior, `CommentCard` owner edit/delete behavior, and
  `ErrorBoundary` fallback behavior.
- T-132 completed the shared fetcher and low-value utility/helper cleanup slice.
  `ArtworkFeedCard`, `TailwindColorIcon`, and `BlogSidebar` no longer emit
  direct `console.error()`/`console.warn()` output, and visible component
  behavior is unchanged.
- T-133 removed the remaining admin dashboard client direct console output
  across forms, feeds, read lists, operation tabs, upload handling, and the
  document reader while preserving existing visible dashboard behavior.
- A-017 completed the public discovery audit. It confirmed `/search` does not
  include artworks or shop products, search no-results/pagination UI was
  incomplete, visible breadcrumbs were not content-aware, and shop sorting is
  still client-only. T-145 resolved the `/artwork` page/API query parsing
  drift, T-146 resolved sorted blog follow-up loading drift, T-147 made main
  navigation resilient when dynamic nav data is unavailable, T-151 added
  current-scope search no-results/pagination behavior, and T-155 made targeted
  detail breadcrumbs content-aware.
- A-018 completed the translation/taxonomy audit. It confirmed visible
  language UI is not wired to rendered copy, public/admin taxonomy controls
  drift from canonical constants, blog pinned/tag controls were hidden, and
  footer/legal copy cleanup must coordinate with A-020 owner/legal decisions.
  T-153 now exposes blog pinned/tag controls and T-154 validates public
  article/collection section inputs at route boundaries.
- The owner added full-width homepage section design guides under
  `to_prototype/`: `biography.png`, `blog.png`, and `shop.png`. These guide
  homepage teaser sections, not the destination pages. Prototype work should
  use an isolated `/prototype/home` route because the live homepage currently
  uses `ContentLayout` side columns.

## Backlog

- Map server and client component boundaries for public routes.
- Identify barrel exports used from client components.
- Replace client component value imports from server APIs, Mongoose model
  barrels, and broad mixed client/server barrels with client-safe APIs, shared
  frontend types, or direct imports.
- Audit loading, error, not found, and empty states on public pages.
- Define loader error contracts by route type: public detail pages, section
  loaders, route-critical fetches, and empty archive views.
- Stabilize responsive behavior for artwork, collections, shop, and search.
- Audit search, navigation, breadcrumbs, filters, and content discovery paths.
- Align public empty, not-found, and search-result states with the data/API
  route contracts once A-002 empty-list and search metadata semantics are chosen.
- Align any future shop pagination or server-side sorting UI with backed API
  behavior before exposing new controls.
- Define a public route rendering/cache plan that separates public layout work
  from session-only UI and moves middleware token parsing behind protected-route
  checks.
- Add route-specific metadata, canonical/social previews, and structured data
  for remaining public archive/detail pages beyond the T-103 root metadata and
  T-106/T-107 detail-page slices.
- Audit and tune Next/Cloudinary image sizing for the home hero, shop listing
  banner, product detail, artwork detail, and magnifier payloads.
- Normalize public landmarks and heading hierarchy after route layout ownership
  is chosen.
- Add owner/legal-approved policy links and notices to newsletter, comments,
  contact, signup/OAuth entry, third-party embeds, and commerce surfaces after
  A-020 requirements are accepted.
- Align commerce assurance copy with implemented checkout/cart and approved
  sale/refund/shipping/payment policies.
- Keep admin content image UI aligned with the T-135 Cloudinary-managed or
  allowed-host image URL policy.
- Maintain the T-136 Cloudinary delivery helper when adding app-authored
  Cloudinary image variants.
- Decide the i18n/frontend language direction before pruning unused translation
  UI.
- Add smoke-level tests for high-value public pages.
- Create an isolated full-width homepage prototype route before redesigning the
  live landing page.
- Build image-guided homepage teaser prototypes for biography, blog, and shop
  sections using real data and local prototype components.
- Audit the current style system before introducing central typography,
  spacing, or component style tokens.
- Decide whether `/search` is site-wide; if yes, include artworks and shop
  products, and if not, relabel/copy the UI so scope is explicit.
- Decide the i18n/frontend language direction before visible language controls
  or taxonomy labels depend on translated copy.
- Centralize taxonomy value+label options for public filters and admin forms.
- Coordinate footer placeholder social links, current-year/copyright text, and
  assurance copy with A-020 owner/legal-approved requirements.

## Acceptance Criteria

- Public routes render predictable loading, empty, and error states.
- Client components avoid importing server-only dependencies.
- Route-level data fetching patterns are consistent and documented.
- Shared component changes have targeted tests or smoke coverage.

## Verification

```bash
npm test
npm run build
```

Use browser checks for layout-sensitive changes.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-013, A-014, and A-015 frontend findings into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled A-002 public list/search semantics into F-049 and this
  backlog.
- 2026-05-14: Reconciled A-016 search/query and accessibility findings into
  F-060 and F-062.
- 2026-05-14: Completed the T-013 sign-in accessibility slice with visible
  credential labels, field error relationships, and keyboard-accessible modal
  switch buttons.
- 2026-05-14: T-019 removed the stale `/protected` frontend route and added
  focused route utility coverage that it is no longer protected.
- 2026-05-14: Prepared T-021 to harden public search query handling and move
  `/search` initial server rendering off same-app HTTP.
- 2026-05-14: Completed T-021; `/search` now parses bounded query params,
  displays stable invalid-query states, and gets initial results from
  `getPublicSearchResults` instead of `serverApi.public.search.search(...)`.
- 2026-05-15: Prepared T-035 to bound public artwork browse query params while
  preserving existing valid filter behavior.
- 2026-05-15: Completed T-035 without changing artwork filter UI behavior; the
  API route now normalizes valid filter/sort/color/pagination params and rejects
  invalid public query values before service work.
- 2026-05-15: Prepared T-036 as an API-boundary slice for shop browse query
  params. It should keep existing valid shop filter UI behavior unchanged and
  escalate only if the UI sends values outside canonical constants.
- 2026-05-15: Completed T-036 without changing shop filter UI behavior; the API
  route now normalizes valid shop listing filters and rejects invalid public
  query values before MongoDB or Shopify work.
- 2026-05-16: Prepared T-060 as the first focused F-013 shop UI alignment
  slice. It removes visible colour/dimension filters and placeholder pagination
  that are not backed by API behavior while preserving backed shop filters,
  product-type checkboxes, result count, and sort controls.
- 2026-05-16: Completed T-060; `ShopFilters` no longer renders unsupported
  colour/dimension selects, `ShopResultsBar` no longer renders fake pagination,
  and focused component tests prove backed controls remain available.
- 2026-05-16: Prepared T-061 as the next shop UI/data-contract alignment slice.
  It should stop default shop type sorting from reading product titles and use
  explicit Shopify product metadata instead.
- 2026-05-16: Completed T-061; `ShopProductGallery` now sorts the default
  type view from explicit Shopify `productType` metadata, keeps unknown types
  last, and preserves existing price/title sort behavior.
- 2026-05-16: Completed T-067 as a focused frontend/admin component cleanup
  slice for `UploadButton` debug logging. It preserves the current
  `CldUploadWidget` props, loading/open behavior, and success callback.
- 2026-05-16: Prepared T-068 as a focused public shop frontend cleanup for
  `ShopProductGallery` and `ShopProductsLoader` debug logs while preserving
  backed filter, sort, loading, and empty-state behavior.
- 2026-05-16: Completed T-068; `ShopProductGallery` and `ShopProductsLoader`
  no longer emit direct `console.log` output during normal rendering,
  filtering, or sorting, and the loader failure state now uses neutral
  retry/contact copy while focused component/source tests preserve behavior.
- 2026-05-16: Prepared T-070 as a route-critical frontend loader migration.
  `CollectionsSubnavLoader` should use a shared server-only collection
  navigation service instead of `serverPublicApi` while rendering the same
  `Subnav` links.
- 2026-05-16: Completed T-070; `CollectionsSubnavLoader` now calls
  `getCollectionNavigationList` directly, no longer imports `serverPublicApi`,
  and remains covered by focused loader tests for link construction and no
  same-app fetches.
- 2026-05-16: Prepared T-071 as the next route-critical frontend loader
  migration. It should remove article-navigation same-app HTTP from
  `BiographySubnavLoader` and `MainNavLoader` while preserving link labels,
  path formats, and existing nav component behavior.
- 2026-05-16: Completed T-071; `BiographySubnavLoader` now calls
  `getArticleNavigationList("biography")` directly, and `MainNavLoader` now
  calls `getArticleNavigationList("biography")` plus
  `getCollectionNavigationList()` directly while preserving link labels and
  path formats.
- 2026-05-16: Prepared T-072 as the next article-navigation frontend migration.
  It should remove navigation same-app HTTP from `src/app/biography/page.tsx`
  and `ArticleLoader` while preserving the default redirect and previous/next
  article links.
- 2026-05-16: Completed T-072; the biography default page now redirects from
  the ordered server-only article navigation service, and `ArticleLoader` now
  builds previous/next links from `getArticleNavigationList(section)` while
  preserving `ArticleView` props and article detail fetching.
- 2026-05-16: Completed T-073; `/collections` now redirects from
  `getCollectionNavigationList`, and `/collections/[slug]` now redirects from
  `getCollectionNavigationItem` without same-app navigation HTTP or slug debug
  logging.
- 2026-05-16: Completed T-074 as the next route-critical frontend migration;
  `ArticleLoader` now calls `getArticleBySlugPopulated` for article detail data
  and `getArticleNavigationList(section)` for previous/next navigation, with
  no same-app HTTP dependency and unchanged `ArticleView` props.
- 2026-05-16: Completed T-075 as the next route-critical frontend migration;
  `BlogDetailLoader` now calls `getBlogBySlugWithAuthor` or
  `getBlogBySlugWithComments` directly, no longer imports `serverPublicApi`,
  no longer emits direct result `console.log` output, and preserves both
  comments and non-comments `BlogDetail` props.
- 2026-05-16: Prepared T-076 as the next blog frontend migration. It should
  remove blog list same-app HTTP from `BlogListLoader` and `BlogSectionLoader`
  while preserving grouped list data, single-sort list data, pagination link
  construction, and section card rendering.
- 2026-05-16: Completed T-076; `BlogListLoader` and `BlogSectionLoader` now
  call `getBlogList` directly, no longer import `serverApi` or
  `serverPublicApi` for blog lists, and preserve grouped list data,
  single-sort list data, pagination link construction, and section card
  rendering.
- 2026-05-16: Prepared T-077 as the next route-critical frontend loader
  migration. It should remove artwork detail same-app HTTP from
  `ArtworkLoader` while preserving `ArtworkView` props, the subscribe section,
  and generic load-failure behavior.
- 2026-05-16: Completed T-077; `ArtworkLoader` now calls
  `getArtworkById(params.id, userId)` directly after reading optional session
  user context, no longer imports `serverApi`, no longer waits on `delay`, and
  no longer logs direct artwork load results.
- 2026-05-16: Prepared T-078 as the next route-family frontend migration. It
  should remove collection artwork same-app HTTP from
  `CollectionArtworkLoader` and `CollectionArtworksPaginationLoader` while
  preserving selected artwork rendering, collection artwork pagination links,
  and existing non-Next failure fallback behavior.
- 2026-05-16: Completed T-078; `CollectionArtworkLoader` now calls
  `getCollectionArtwork(slug, artworkId)` directly, and
  `CollectionArtworksPaginationLoader` now calls
  `getCollectionWithArtworks(slug)` directly while preserving selected artwork
  props, pagination link construction, heading text, and null fallback behavior
  for non-Next loading failures.
- 2026-05-16: Prepared T-079 as the next frontend section-loader migration. It
  should remove article list same-app HTTP from `BiographySectionLoader` while
  preserving `BiographySection` props and null fallback behavior for non-Next
  loading failures.
- 2026-05-16: Completed T-079; `BiographySectionLoader` now calls
  `getArticleList({ section: "biography" })` directly, no longer imports
  `serverPublicApi`, and preserves `BiographySection` props plus null fallback
  behavior for non-Next loading failures.
- 2026-05-16: Prepared T-080 as the next frontend section-loader migration. It
  should remove collection list same-app HTTP from `CollectionSectionLoader`
  while preserving `CollectionSection` props and null fallback behavior for
  non-Next loading failures.
- 2026-05-16: Completed T-080; `CollectionSectionLoader` now calls
  `getCollectionList({ section: "collections", limit: 9 })` directly, no
  longer imports `serverApi`, and preserves `CollectionSection` props plus null
  fallback behavior for non-Next loading failures.
- 2026-05-17: Prepared T-081 as the next frontend loader migration. It should
  remove user navigation same-app HTTP from `AccountSubnavLoader` while
  preserving account subnav link labels, order, paths, disabled states, and
  first favourite/watchlist segment behavior.
- 2026-05-17: Completed T-081; `AccountSubnavLoader` now reads the current
  session user ID and calls `getOwnUserNavigation` directly, no longer imports
  `serverApi`, and preserves account subnav labels, order, paths, disabled
  states, first favourite/watchlist segment links, and cart/orders disabled
  behavior.
- 2026-05-17: Completed T-083; `FavouritesPaginationLoader`,
  `WatchlistPaginationLoader`, `FavouritedArtworkLoader`, and
  `WatchlistedArtworkLoader` now read the current session user ID and call
  shared saved-artwork services directly, no longer import `serverApi`, and
  preserve saved-item pagination headings, account saved-item links,
  `ArtworkView` props, and focused failure behavior.
- 2026-05-17: Completed T-084; `UserSettingsLoader` and
  `UserCommentsLoader` now read the current session user ID and call shared
  profile/comment read services directly, no longer import `serverApi`, and
  preserve account settings props, `UserCommentsView` props, and focused
  unauthorized/missing-user/failure behavior.
- 2026-05-17: Completed T-085; `ShopProductsLoader` now validates converted
  `initialFilters` through the shared shop product query schema and calls
  `getShopProductList` directly, no longer reads `NEXT_PUBLIC_BASE_URL`, no
  longer falls back to localhost, and no longer calls same-app `fetch()` for
  initial products.
- 2026-05-17: Prepared T-086 to remove hard-coded localhost app origins from
  logout navigation, mobile auth links, and the `/project` redirect while
  preserving current labels, ordering, disabled states, and redirect targets.
- 2026-05-17: Completed T-086; logout success navigation now pushes `/`, the
  mobile drawer's Sign Up and Log In account links use `/api/auth/signin`, and
  `/project` redirects to `/project/about` without an origin.
- 2026-05-17: Prepared T-087 to remove the stale account favourites
  `serverApi` import/commented self-fetch block while preserving the current
  redirect to `/account/settings`.
- 2026-05-17: Completed T-087; `src/app/account/favourites/page.tsx` now only
  imports `redirect`, keeps the `/account/settings` redirect, and carries no
  stale server-wrapper self-fetch code.
- 2026-05-17: Prepared T-089 to remove direct render `console.log()` calls from
  root layout, `Subnav`, `ArticleView`, `DesktopArticleView`, and
  `UserCommentsView` while preserving layout, navigation, article, and account
  comments behavior.
- 2026-05-17: Completed T-089; root layout, `Subnav`, `ArticleView`,
  `DesktopArticleView`, and `UserCommentsView` no longer emit direct render
  `console.log()` output, and focused source-hygiene coverage prevents the
  retired branch verification, link, article, title, and comments debug strings
  from returning.
- 2026-05-17: Prepared T-090 to remove remaining user-facing public/account
  `console.log()` output from `ClientContextBoundary`, `ArtworkGallery`,
  `BlogDetail`, `EnquiryForm`, `SubscribeSectionLoader`, the account favourite
  artwork page, and `CollectionViewPagination` while preserving behavior.
- 2026-05-17: Completed T-090; the scoped user-facing public/account files no
  longer emit direct `console.log()` output. `ArtworkGallery` now receives
  neutral starting-data/default prop names from `ArtworkListLoader` while
  preserving initial filters, sorting, filter clearing, load-more behavior,
  duplicate prevention, and empty-state rendering.
- 2026-05-17: Prepared T-091 to remove direct `console.log()` output from
  scoped admin dashboard create/update forms and artwork filter dropdowns while
  preserving current dashboard validation, upload, submit/update, and filter
  behavior.
- 2026-05-17: Completed T-091; the scoped admin dashboard create/update form
  and artwork filter files no longer emit direct `console.log()` output, and
  focused source-hygiene coverage prevents those logs from returning.
- 2026-05-17: Prepared T-092 to remove success-path `console.log()` output
  from scoped admin read-list copy flows, `ArtworkFeedCard`, and the shared
  `copy_id()` helper while preserving copy-to-clipboard, read-list fetch,
  filter, loading, error, card, and skeleton behavior.
- 2026-05-17: Completed T-092; the scoped admin read-list copy flows,
  `ArtworkFeedCard`, and shared `copy_id()` helper no longer emit success-path
  `console.log()` output, and `ReadArtworkList` no longer logs artwork arrays
  during render.
- 2026-05-17: Prepared T-093 to remove direct `console.log()` output from
  shared UI components and the public artwork fetcher while preserving feed
  rendering, navigation active/disabled behavior, refresh behavior, YouTube
  embed behavior, and artwork query URL construction.
- 2026-05-17: Completed T-093; `Feed`, `NavItem`, `RefreshButton`,
  `YoutubeEmbedding`, and the public artwork fetcher no longer emit direct
  `console.log()` output, and focused coverage preserves artwork fetcher URL
  construction.
- 2026-05-17: Prepared T-095 to remove stale commented `console.log()` snippets
  from the session provider, collection section, main navigation, and admin
  content layout paths while preserving rendering behavior.
- 2026-05-17: Completed T-095 by removing stale commented `console.log()`
  snippets from the session provider, collection section, main navigation, and
  admin content layout paths while preserving rendering behavior. Full-source
  source-hygiene coverage now keeps `src` free of direct or commented
  `console.log()` calls.
- 2026-05-18: Reconciled A-020 frontend-facing compliance findings into
  F-072, F-075, F-077, and F-078; visible policy links/notices and commerce
  assurance copy changes should wait for owner/legal-approved requirements.
- 2026-05-18: Reconciled A-009 frontend-facing asset findings into F-070 and
  F-071; blog/collection image handling and delivery transformation cleanup
  should follow the Cloudinary policy decision.
- 2026-05-18: Prepared T-100 for contact-page/contact-form product query
  wiring while keeping privacy notices and policy pages separate.
- 2026-05-18: Completed T-100; the contact page now passes valid normalized
  product query context into `ContactForm`, invalid query context is ignored
  before rendering, and focused component/page tests cover the handoff and
  submitted payload.
- 2026-05-18: Reconciled A-010 into F-084 through F-090. Highest priority
  frontend follow-ups are public/auth layout and cache ownership, production
  metadata/discovery files, accessible search/navigation controls, image sizing
  and preload tuning, landmark/heading cleanup, and server-rendered
  artwork-to-shop links.
- 2026-05-18: Prepared T-102 as the first A-010 implementation slice. It
  should remove global root-layout DB/session work and avoid middleware token
  parsing for unprotected public routes while recording any remaining
  route-local dynamic blockers.
- 2026-05-18: Completed T-102; root layout no longer performs global
  DB/session work, middleware skips token parsing for unprotected public paths,
  and shared navigation `useSearchParams()` callers are wrapped in narrow
  Suspense boundaries so the public shell can prerender where route-local data
  allows it. Build output now shows several public entry routes as static, with
  remaining dynamic public routes tied to route-local search params,
  MongoDB/Shopify loaders, or optional session-aware UI.
- 2026-05-19: T-140 reconciled A-017 and A-018 frontend findings into
  F-098 through F-104 plus existing F-013, F-023, F-033, and F-049 updates.
  T-143 is prepared for the public search scope decision. Search no-results/
  pagination, nav fallbacks, visible breadcrumbs, language UI, taxonomy option
  parity, blog controls, collection section policy, and footer/legal copy
  remain separate implementation or decision slices. T-145 and T-146 later
  resolved `/artwork` page/API query parity and sorted blog loading.
- 2026-05-18: Prepared T-103 as the next A-010/F-085 slice for production-safe
  root metadata plus baseline `robots.ts` and `sitemap.ts`. Route-specific
  detail metadata and JSON-LD remain separate.
- 2026-05-18: Completed T-103; root metadata now describes the Joseph
  Laoutaris public archive without checkout or policy claims, and baseline
  `robots.ts`/`sitemap.ts` list stable public routes only.
- 2026-05-18: Prepared T-104 as the next A-010/F-088 accessibility slice for
  public search submit, search drawer trigger/close, mobile nav drawer
  trigger/close, and unauthenticated favourite/watchlist controls.
- 2026-05-18: Completed T-104; public search submit, mobile search drawer
  trigger/close, mobile navigation drawer trigger/close, and unauthenticated
  favourite/watchlist controls now use labelled semantic buttons without
  changing search URL construction, drawer behavior, navigation targets,
  authenticated saved-item forms, or tooltips.
- 2026-05-18: Prepared T-105 for the remaining F-062 comment action
  accessibility slice covering owner-only comment edit/delete and edit-mode
  cancel/save icon controls.
- 2026-05-18: Completed T-105; `CommentCard` owner-only edit/delete and
  edit-mode cancel/save icon controls now have stable accessible names,
  explicit non-submit button semantics, and decorative hidden icons without
  changing owner-only rendering, edit state, loading state, or mutation
  callbacks.
- 2026-05-18: Prepared T-106 as the next F-085/R-030 slice for route-specific
  public biography article and blog detail metadata, canonical/social previews,
  and conservative article/blog structured data.
- 2026-05-18: Completed T-106; `/biography/[slug]` and `/blog/[slug]` now
  build route-specific title, description, canonical, Open Graph, and Twitter
  metadata from existing public content services and render conservative
  `Article`/`BlogPosting` JSON-LD without author, publisher, policy, sale, or
  commerce claims.
- 2026-05-18: Prepared T-107 as the next F-085/R-030 slice for public artwork,
  collection-scoped artwork, and Shopify product detail metadata plus
  conservative detail-page structured data.
- 2026-05-18: Completed T-107; `/artwork/[artworkId]`,
  `/collections/[slug]/[artworkId]`, and
  `/shop/products/[productHandle]` now build route-specific title,
  description, canonical, Open Graph, and Twitter metadata from existing
  server data services and render conservative artwork/product JSON-LD without
  changing visible layout, saved-item behavior, product enquiry handoff, or
  route cache policy.
- 2026-05-18: Prepared T-108 as the next A-010/F-086/F-087 slice for public
  image preload and sizing behavior across the home hero, shop pages, product
  detail images, and artwork magnifier.
- 2026-05-18: Completed T-108; only the initially visible active home hero
  image remains prioritized, active hero `quality={100}` usage was removed,
  touched home hero and shop/product `fill` images now declare responsive
  `sizes`, and `MagnifierImage` waits for hover/focus intent before loading its
  high-resolution zoom image.
- 2026-05-18: Prepared T-109 as the next A-010/F-089 accessibility slice for
  public main landmark ownership and noisy heading hierarchy cleanup.
- 2026-05-18: Completed T-109; root layout now uses a non-landmark spacing
  wrapper, touched public route/view surfaces own `<main>` landmarks, public
  hero/card/sidebar/section presentation headings were demoted away from `h1`,
  and focused landmark/heading source invariants passed alongside lint and
  build.
- 2026-05-18: Prepared T-110 as the next A-010/F-084/R-012 slice for
  route-local public rendering/cache policy and conservative segment config
  codification.
- 2026-05-18: Completed T-110 by documenting stable static shell,
  query-driven, DB-backed, Shopify-backed, and session-aware public route cache
  ownership; route-local dynamic public pages now export
  `dynamic = "force-dynamic"` while stable shell routes remain free of ISR or
  generated-param promises.
- 2026-05-18: Prepared T-111 as the next A-010/F-090 slice for server-rendered
  artwork-to-shop product discovery on artwork detail pages.
- 2026-05-18: Completed T-111; `ArtworkShopSection` now renders from
  server-provided grouped product summaries on artwork and collection-scoped
  artwork detail pages instead of fetching Shopify products after mount.
- 2026-05-18: Prepared T-112 as the next F-085/R-030 discovery slice for
  conservative breadcrumb JSON-LD on high-value public detail pages.
- 2026-05-18: Completed T-112; high-value public detail pages now emit one
  entity JSON-LD script and one conservative `BreadcrumbList` JSON-LD script
  from existing server data lookups, while missing/unavailable lookups still
  render no structured-data script.
- 2026-05-18: Prepared T-113 as the next F-085/R-030 discovery slice for
  dynamic detail sitemap expansion without route rendering changes.
- 2026-05-18: Completed T-113; `sitemap()` now preserves stable public routes
  while best-effort dynamic helper logic adds biography article, blog,
  standalone artwork, collection, collection-scoped artwork, and linked
  Shopify product detail URLs with duplicate, malformed, private, account,
  admin, and API paths excluded.
- 2026-05-18: Prepared T-114 for deployed discovery endpoint smoke assertions
  covering `/robots.txt` and `/sitemap.xml` without changing frontend route
  rendering, metadata helpers, structured data, or route cache policy.
- 2026-05-18: Completed T-114 without changing frontend route rendering,
  metadata helpers, structured data, or route cache policy. The public smoke
  script now validates deployed robots and sitemap discovery content while
  keeping dynamic detail URL presence tied to approved records/upstream data.
- 2026-05-18: Completed T-130 as a scoped public browsing client cleanup:
  `ArtworkGallery`, `BlogSectionContinuous`, `BlogDetail`,
  `ShopProductGallery`, and `useInfiniteScroll` no longer emit direct
  `console.error()` output, and focused tests preserve existing loading,
  fallback, modal, and infinite-scroll error behavior.
- 2026-05-18: Prepared T-131 for the remaining account/user client
  console-error cleanup slice.
- 2026-05-18: Completed T-131 as a scoped account/user client cleanup:
  `ContactForm`, `CommentForm`, `LogoutForm`, `AccountNavDropdown`,
  `CommentCard`, and `ErrorBoundary` no longer emit direct `console.error()`
  output, and focused tests preserve existing failure UI, retry, loading,
  callback, navigation, and fallback behavior.
- 2026-05-18: Completed T-132 for the scoped shared frontend-adjacent files:
  `ArtworkFeedCard`, `TailwindColorIcon`, and `BlogSidebar` no longer emit
  direct `console.error()`/`console.warn()` output while preserving copy
  attempts, unknown-color empty rendering, and sidebar state/rendering behavior.
- 2026-05-19: Completed T-133 for admin dashboard clients: CRUD forms, read
  lists, operation tabs, feeds, upload handling, and the document reader no
  longer emit direct `console.error()`/`console.warn()` output while preserving
  form state, loading resets, modal failure UI, silent copy attempts, and
  existing success/fallback behavior.
- 2026-05-19: Completed T-135 without redesigning admin image fields. The
  shared article, blog, and collection schemas now reject unsupported content
  image hosts before persistence while preserving existing field names and
  public read DTO shapes for already-allowed URLs.
- 2026-05-19: Completed T-137 by adding the client/server import boundary
  guard and replacing scoped client mixed-barrel imports with direct or
  type-only imports.
- 2026-05-19: Completed T-136 by replacing scoped direct Cloudinary upload-path
  string rewrites in cards, blog sections, masonry artwork lists, and admin
  previews with the shared delivery helper.
- 2026-05-19: Completed T-144 for the admin collection form slice. Collection
  create/update forms now surface structured route errors, and collection
  create calls its parent success callback after successful persistence.
- 2026-05-19: Completed T-145 by routing `/artwork` App Router search params
  through the shared artwork list query schema before constructing loader
  defaults.
- 2026-05-19: Completed T-146 by preserving active blog `sortby` through
  sorted list loader/view props, continuous follow-up requests, and sorted
  pagination rendering.
- 2026-05-19: Completed T-147 by rendering stable `/biography` and
  `/collections` main-nav fallbacks when dynamic navigation data is missing,
  empty, or unexpectedly unavailable.
- 2026-05-19: Completed T-148 by applying structured API error display to
  article and blog create/update forms while preserving successful submit
  callbacks.
- 2026-05-19: Prepared T-151 to add current-scope public search no-results and
  honest pagination behavior for articles, blogs, and collections without
  deciding the broader site-wide search scope.
- 2026-05-19: Prepared T-152 to reduce manual admin ObjectId copy/paste through
  direct read-list handoffs into update/delete workflows.
- 2026-05-19: Completed T-151 and T-152. Current-scope `/search` now has
  metadata-backed selected-type pagination and no-results states, and admin
  read lists can hand selected content into update/delete workflows without
  manual ObjectId copy/paste.
- 2026-05-19: Prepared T-153 for blog pinned/tag admin controls, T-154 for
  public taxonomy section runtime validation, and T-155 for content-aware
  visible breadcrumbs.
- 2026-05-20: Completed T-153, T-154, and T-155. Blog admin forms now expose
  pinned/tag controls and data-derived read-filter years; public article and
  collection section inputs validate at route boundaries before services are
  called; and targeted detail breadcrumbs reuse server-rendered breadcrumb
  JSON-LD for human-readable labels without client fetching.
- 2026-05-20: Prepared homepage prototype prompts and task briefs T-157 through
  T-161. T-157 creates the isolated `/prototype/home` route; T-158, T-159, and
  T-160 build the biography, blog, and shop teaser sections from
  `to_prototype/`; T-161 is a read-only style-system audit.
- 2026-05-20: Completed T-157 through T-160. `/prototype/home` now renders an
  isolated full-width prototype shell with image-guided biography, blog, and
  shop teaser sections backed by real article, blog, and shop/product data. The
  live homepage, `ContentLayout`, destination pages, global CSS, and public
  navigation remain unchanged.
- 2026-05-20: Completed T-161. The style-system audit is recorded in
  [style-system-audit.md](../architecture/style-system-audit.md) and recommends
  a client-safe semantic class map piloted on `/prototype/home` after the
  prototype visual direction settles.
- 2026-05-20: Prepared T-162 for a visual QA and owner-feedback pass on
  `/prototype/home` before production migration or style-system implementation.

## Next Agent Action

For the homepage redesign track, review `/prototype/home` visually and decide
which prototype sections should move toward production. The next likely task is
[T-162](../tasks/T-162-review-homepage-prototype-visual-qa.md), followed by
either refinement tasks per section or a semantic style-map pilot. T-157 through
T-161 are complete; do not reassign them unless the prototype route, section
data mapping, or style audit regresses.

Hold [T-143](../tasks/T-143-decide-public-search-scope.md) until the
owner/product scope answer exists. Keep collection section launch policy,
owner/legal-approved policy links/notices, broad static/ISR migration, and
checkout/cart work separate unless explicitly assigned. T-153, T-154, and T-155
are complete; do not reassign them unless blog admin controls, public taxonomy
validation, or visible breadcrumb labels regress.

Do not reassign T-081, T-082, T-083, T-084, T-085, T-086, T-087, T-088,
T-089, T-090, T-091, T-092, T-093, T-094, or T-095 unless a regression is
opened. Do not reassign T-130 unless the scoped public browsing client
source-hygiene or existing failure-state behavior regresses. Do not reassign
T-131 unless scoped account/user client source-hygiene or existing
failure-state behavior regresses. Do not reassign T-132 unless scoped shared
frontend-adjacent source hygiene or fallback behavior regresses. Do not
reassign T-133 unless admin dashboard source hygiene or existing dashboard
failure behavior regresses. Do not reassign T-135 unless content image URL
validation regresses. Do not reassign T-137 unless the client import-boundary
guard or scoped direct-import cleanup regresses. Do not reassign T-136 unless
the Cloudinary delivery helper or its source-hygiene guard regresses. Do not
reassign T-144, T-145, or T-146 unless their collection-form error surfacing,
`/artwork` query parity, or sorted blog loading behavior regresses. Do not
reassign T-147 or T-148 unless main-nav fallback behavior or article/blog form
error surfacing regresses.

Keep favourite/watchlist server actions, broader account navigation, user
comment mutations, profile editing, real pagination, checkout/cart, remaining
Shopify product transform fields, visible admin product-linking UI, client
fetcher behavior beyond scoped discovery work, test-session override logs, and
broad route-builder centralization separate.
