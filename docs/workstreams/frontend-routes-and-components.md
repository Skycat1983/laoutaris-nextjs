# Frontend Routes And Components Workstream

Status: Active

Goal: stabilize public pages, component composition, responsive behavior, and
Next.js server/client component boundaries.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Testing runbook](../runbooks/testing.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-005 Frontend routes and component boundaries](../audits/goals.md#a-005-frontend-routes-and-component-boundaries)
- [A-017 Search, navigation, and content discovery](../audits/goals.md#a-017-search-navigation-and-content-discovery)
- [A-010 Performance, SEO, and accessibility](../audits/goals.md#a-010-performance-seo-and-accessibility)
- [A-022 Next.js feature utilization](../audits/goals.md#a-022-nextjs-feature-utilization)

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
- The framed print preview component stack now includes a standalone preview,
  modal controls, a noindex `/prototype/frame` workshop route, product-page
  launcher wiring for eligible print products, and a prototype-only rail
  renderer with non-repeating material panel backgrounds.
- `/prototype/frame` room-scene previews now use a shared centered hanging
  anchor and fixed-artwork wall geometry so room background switches do not move
  the artwork and mat margin changes grow the framed object around the print.
- `/prototype/frame` also exposes prototype-only right/down wall shadow controls
  for offset, edge blur, diffusion, spread, and darkness.
- Those shadow controls are placed in the room-preview column, and the room
  composite includes short south-east diagonal corner shadows from the frame.
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
- A-005 completed the frontend route/component-boundary audit. It found that
  public detail routes need a shared not-found/error contract, home section
  loaders can silently drop sections on failure, client follow-up fetch
  failures need visible states, mixed component barrels remain in server
  callers, the account subnav loader is not mounted in the account layout, and
  loading-state patterns need route-type documentation.
- A-022 completed the Next.js feature-utilization audit. It found that public
  browse/detail/shop routes are intentionally dynamic, the then-current
  client/server import-boundary guard was failing through `SignUpForm`, middleware
  matching is broader than protected route prefixes, static sitemap/default
  redirect freshness is implicit, and global client providers/large client
  islands are the next medium-priority RSC efficiency target. T-239 completed
  the sitemap freshness piece by making `/sitemap.xml` own a one-hour ISR route
  export without changing sitemap content or public route rendering.
- T-199 defined the public detail not-found/error contract in
  `docs/architecture/rendering-and-data-fetching.md`: malformed canonical
  params and missing primary detail content should map to `notFound()`,
  upstream/service failures should throw through the App Router error boundary,
  and optional related-content failures should degrade without changing the
  route status.
- T-200 implemented the first runtime slice of that contract for standalone and
  collection-scoped artwork detail routes. Those routes now share public
  not-found presentation, validate artwork ObjectIds before primary content data
  access, call `notFound()` for missing primary artwork content, preserve
  upstream failures as errors, and degrade optional linked Shopify product
  failures to empty linked-product props.
- T-201 implemented the next public detail runtime slice for article/blog
  detail routes. Missing primary article or blog content now maps to
  `notFound()`, primary-content service failures continue through the error
  path, route-local not-found UI exists for biography articles and blog posts,
  article navigation degrades to empty previous/next links, and blog comment
  loading degrades to the non-comment detail render for found posts.
- T-202 completed the remaining Shopify product detail not-found UI slice.
  Missing primary Shopify products still call `notFound()`, and the route now
  has shared public route-local not-found presentation with focused coverage.
- T-208 moved available Shopify product detail pages beyond enquiry-only
  commerce when Shopify exposes a valid hosted product URL. The route now
  renders an external `Purchase on Shopify` CTA for that case, keeps enquiry as
  fallback or secondary contact, and keeps unavailable products in a
  non-purchase state.
- T-203 resolved home section loader blank fallbacks. Biography, collections,
  and blog homepage section loaders now render visible unavailable states for
  missing service results or non-Next failures and visible empty states for
  empty result arrays, while preserving successful rendering, service inputs,
  Suspense skeleton ownership, and Next control-flow rethrows.
- T-204 resolved public browsing client follow-up fetch failure states.
  Artwork filter and load-more failures, shop product filter failures, and
  blog continuous-loading failures now show visible retry/recovery UI while
  preserving already-rendered content and public browsing source hygiene.
- T-205 resolved the mixed component barrel cleanup for scoped server
  routes/loaders. Remaining value imports from `@/components/sections`,
  `@/components/views`, and `@/components/loaders/viewLoaders` in `src/app`
  and `src/components/loaders` were replaced with direct file imports and
  guarded by source-hygiene coverage.
- T-206 restored the account subnav mount. The account layout now actively
  renders `AccountSubnavLoader` inside `Suspense` with `SubnavSkeleton`
  fallback before account route content, and layout-level coverage prevents
  the mount from being replaced by a JSX comment.
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
- The owner supplied a collections section mockup during the prototype track.
  `/prototype/home` now renders a collections prototype section that uses the
  same `getCollectionList({ section: "collections", limit: 9 })` data path as
  the live homepage collection section, while keeping its visual layout
  isolated from the production `CollectionSection`.
- `/prototype/home` now includes a fixed bottom route-local dropdown rail for
  comparing the expanded 1920px frame against an inset 1180px frame, scaling
  only section-level prototype headings through default, smaller, and compact
  presets, and adjusting shop product cards through large, larger, and feature
  artwork preview sizes. The project placeholder also embeds the existing
  documentary YouTube player to the right of the live homepage film copy on
  wider screens.

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
- Use the A-022 sequence for public route efficiency work: T-230 import-boundary
  repair, T-231 middleware matcher narrowing, T-232 freshness policy, then
  T-233 as the first biography ISR/cache proof route. T-233 is complete.
- Scope public client-provider and heavy-client-island reductions after the
  import-boundary and first cache proof work. T-234 scoped T-236 as the first
  safe runtime proof: lazy-load public mobile search/navigation drawers before
  root provider moves.
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
- Keep the documented public route loading/empty/error fallback pattern current
  when new route families or Suspense boundary types are added.

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

2026-05-22 deployment build fix verification: `npm run build` passed.

## Progress

- Documentation scaffold created.
- 2026-05-22: Fixed the prototype deployment TypeScript failures by guarding
  the optional frame room-shadow `min` input prop and widening the homepage
  biography prototype order-index map for normalized runtime slug/title
  lookups. `npm run build` now passes; local static generation still reports
  existing structured MongoDB timeout logs when the database is unavailable.
- 2026-05-23: Refined `/prototype/home` section styling after owner feedback.
  Collections now uses the route-local alternate section background instead of
  its previous hard-coded tint, biography timeline dots are filled above the
  timeline rule, the shop header duplicate copy/link was removed, and the
  fixed control rail now includes eight alternate section background presets
  plus eight neutral/brown alternate text-accent presets. Verification:
  `npx tsc --noEmit`, `npm run lint`, `npm run build`, and
  `curl -I http://localhost:3001/prototype/home` passed.
- 2026-05-23: Updated `/prototype/home` alternate background defaults after
  owner review. Alternate-background sections now default to chalk stone with
  walnut accent text, primary whitish sections use charcoal accent text, the
  artwork teaser placeholder slot was removed, and the alt-background control
  now offers warm near-white/beige options without blue-leaning presets. A
  follow-up tightened every non-chalk shade closer to the fixed whitish base so
  the presets differ more subtly.
  Verification: `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  and `npm run lint` passed. A lightweight live-route `curl` check could not be
  completed because `localhost:3000` refused the connection and the existing
  `localhost:3001` dev server request did not return within 30 seconds.
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
  T-143 later selected staged site-wide public search widening, completed by
  T-210/T-211 for artwork and Shopify product results. Search no-results/
  pagination, nav fallbacks, visible breadcrumbs, language UI, taxonomy option
  parity, blog controls, collection section policy, and footer/legal copy
  remained separate implementation or decision slices. T-145 and T-146 later
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
- 2026-05-20: Completed T-162. The visual QA handoff says the biography,
  blog, and shop prototype sections are stable enough for owner review, but
  production migration should wait for decisions on biography order, canonical
  dates, blog content strategy, shop/commerce wording, and mobile density.
- 2026-05-20: Prepared T-166, T-167, and T-168 after owner feedback that
  `/prototype/home` currently feels too bounded. T-166 owns the route-local
  prototype width pass, T-167 owns section rebalancing after that width change,
  and T-168 is the read-only visual QA checkpoint.
- 2026-05-20: Completed T-166 and T-167. `/prototype/home` now uses a
  route-local `max-w-[1920px]` prototype frame for biography, blog, shop, and
  placeholder sections, and the biography/blog/shop sections have been
  rebalanced for the wider canvas without changing the live homepage,
  `ContentLayout`, global CSS, root layout, header, footer, or destination
  pages.
- 2026-05-20: Completed T-168. The expanded `/prototype/home` review found the
  wider canvas ready for owner visual-direction review, with remaining
  decisions on biography order, canonical dates, blog strategy, shop wording,
  mobile density, and anchor/header behavior before production migration.
- 2026-05-20: Completed T-169 and T-170. The owner-facing homepage prototype
  review packet is recorded at
  [homepage-owner-review-packet.md](../prototypes/homepage-owner-review-packet.md),
  and the first semantic style-map scaffold exists without runtime adoption or
  visual changes.
- 2026-05-21: Added the mockup-guided `/prototype/home` collections section.
  The route now loads collection data in parallel through
  `getCollectionList({ section: "collections", limit: 9 })`, renders the first
  collection as the expanded panel with supporting narrow panels, and keeps the
  live homepage, `CollectionSection`, `CollectionsSectionLoader`,
  `ContentLayout`, global CSS, and public navigation unchanged.
- 2026-05-21: Refined the `/prototype/home` collections section into an
  animated accordion. Clicking a collapsed collection panel now expands it in
  place with route-local flex/min-height transitions, exposes the active
  collection link inside the expanded panel, and preserves the same
  server-loaded collection data.
- 2026-05-22: Added a route-local `/prototype/home` control rail with width and
  heading-size presets, changed the shared prototype frame to use a CSS variable
  defaulting to 1920px, and embedded the existing documentary video in the
  project placeholder. Focused Jest and lint passed. `npm run build` compiled
  and typechecked, then failed during page-data collection on unrelated
  protected/account page module lookups; the referenced source and generated
  `.next` files were present. The dev server is running on port 3002, and
  `/prototype/home` returned `200 OK` after slow restricted-network font
  retries.
- 2026-05-22: Refined the `/prototype/home` controls after owner feedback:
  heading presets now target only section-level headings, those headings use the
  smaller placeholder-scale default, the project video section uses the live
  homepage film copy, and the shop section gained product-card size controls.
  Focused Jest and lint passed;
  the running dev server returned `200 OK` for `/prototype/home`.
- 2026-05-22: Moved the `/prototype/home` shop size controls out of the shop
  section into a separate band above it, removed the smaller product-card option
  so the controls only compare large/larger/feature artwork previews, and made
  the inset frame preset visibly narrower at 1180px. Focused Jest and lint
  passed. Restarted the stale dev server after a hot-reload webpack runtime
  error; `/prototype/home` now returns `200 OK` on port 3001.
- 2026-05-22: Converted the `/prototype/home` controls into a fixed bottom
  dropdown rail so width, heading scale, and shop item size can be adjusted
  while reviewing any section. Section heading defaults were raised from the
  prior small pass without returning to the earlier oversized 80px+ headings.
  Focused Jest and lint passed, and `/prototype/home` returned `200 OK` on the
  running port 3001 dev server.
- 2026-05-22: Normalized `/prototype/home` section eyebrow labels after owner
  review found the Biography label inconsistent. Real content sections now
  share the same small uppercase tan eyebrow treatment, placeholders share the
  same scale/tracking in muted current color, the blog divider uses the shared
  tan accent, and the collections heading is sentence-cased. Focused Jest and
  lint passed, and `/prototype/home` returned `200 OK` on port 3001. Remaining
  prototype visual consistency areas to review are CTA treatment and divider
  density across Biography, Blog, Collections, and Shop.
- 2026-05-22: Updated the `/prototype/home` biography section after owner
  review so the cards render in the fixed order `Early Years`, `Meeting Beryl`,
  `Ethos`, `Later Years`, `Obituary` regardless of loader order. The biography
  timeline marker circle now aligns with the center of the rule above the
  images, and the read-more divider now runs behind the button at its center
  instead of along the button top edge.
- 2026-05-22: Changed the `/prototype/home` control rail defaults to smaller
  section headings and feature-sized shop items. The collections accordion now
  renders separate collapsed and expanded title layers, clips both inside the
  panel, measures the final open-panel title width, and slides the collapsed
  title out left while the width-stable expanded title eases in from the right.
- 2026-05-20: Completed T-173 and prepared T-174 through T-178 from its admin
  read-list audit. Frontend follow-up should wait for route query hardening
  before adding main read-tab pagination, filters, or search.
- 2026-05-20: Completed T-178. Comment and user read-list cards now hand off
  to the existing guarded delete workflows with selected IDs while preserving
  manual ObjectId lookup.
- 2026-05-20: Completed T-175. The main admin blog read tab now uses route
  pagination metadata for previous/next paging, preserves Update/Delete/Copy
  actions, and keeps the existing filters page-local until T-176.
- 2026-05-20: Completed T-176. The main admin blog read tab now sends the
  existing `featured` and year filters to the route, resets to page 1 on
  filter changes, and no longer filters only the currently visible page.
- 2026-05-20: Completed T-177. The main admin blog read tab now sends bounded
  route-backed search over title/slug, resets to page 1 on search changes, and
  preserves pagination, filters, no-results states, and Update/Delete/Copy
  actions.
- 2026-05-20: Completed T-179. The main admin collection read tab now sends
  bounded route-backed title/slug search, consumes route metadata for
  pagination, and preserves artwork counts, summaries, no-results states, and
  Update/Delete/Copy actions.
- 2026-05-20: Completed T-180. The main admin article read tab now sends
  route-backed section/overlay filters plus bounded title/slug search,
  consumes route metadata for pagination, and preserves image cards,
  no-results states, and Update/Delete/Copy actions.
- 2026-05-20: Completed T-181. The main admin artwork read tab now sends
  constrained artwork filters plus bounded title search, consumes route
  metadata for pagination, and preserves artwork cards, no-results states, and
  Update/Delete/Copy actions.
- 2026-05-20: Completed T-182. The main admin comment and user read tabs now
  consume route metadata for previous/next pagination and preserve card
  layout, no-results/error states, Copy ID, and Delete handoff actions.
- 2026-05-20: Completed T-183. The main admin article, artwork, blog,
  collection, comment, and user read tabs now share a small previous/next
  pagination component and metadata normalization helper without changing
  routes, fetchers, card layouts, search, filters, or handoff actions.
- 2026-05-21: Completed T-193 for the framed print preview prototype. The
  rail renderer now fills each clipped frame side with a non-repeating material
  panel instead of a repeated stripe gradient, preserving bevels, mitred seams,
  mat controls, modal behavior, and the simple product-page renderer default.
- 2026-05-22: Completed and reconciled A-005. Findings F-105 through F-110 now
  track public detail not-found/error contracts, silent home section loader
  fallbacks, invisible client follow-up fetch failures, mixed barrel cleanup,
  the unmounted account subnav, and route loading-state documentation. T-199
  was prepared as the first follow-up for F-105.
- 2026-05-22: Completed T-199 as a documentation-only contract. Public detail
  pages now have an accepted not-found/error split for malformed params,
  missing primary content, upstream/service failures, and optional
  related-content degradation. No runtime code changed.
- 2026-05-22: Prepared T-200 as the first runtime implementation slice for the
  accepted public detail contract. It covers `/artwork/[artworkId]` and
  `/collections/[slug]/[artworkId]` only.
- 2026-05-22: Completed T-200. Standalone and collection-scoped artwork detail
  routes now implement the accepted not-found/error contract, including
  route-local not-found UI, malformed ObjectId pre-fetch validation, missing
  primary-content `notFound()` handling, upstream failure propagation, and
  optional Shopify product-link degradation. T-201 was prepared for biography
  article and blog detail routes and completed later the same day.
- 2026-05-22: Completed T-201. Biography article and blog detail routes now
  implement the accepted not-found/error contract for missing primary content,
  upstream primary failures, route-local not-found UI, article navigation
  degradation, and blog comment degradation. T-202 was created for the
  remaining Shopify product detail route-local not-found UI slice and completed
  later the same day.
- 2026-05-22: Completed T-202. Shopify product detail now has route-local
  shared not-found UI and focused missing-product coverage while preserving
  existing metadata, enquiry, framed-preview, and optional linked-artwork
  behavior. F-105 is resolved, and T-203 was created for F-106 home section
  fallback states.
- 2026-05-22: Completed T-203. Biography, collections, and blog homepage
  section loaders now render visible unavailable or empty states instead of
  resolving to `null` after missing service results, empty result arrays, or
  non-Next failures. F-106 is resolved, and T-204 was prepared for F-107 public
  browsing client fetch error states.
- 2026-05-22: Completed T-204. Artwork browse filtering/load-more, shop
  product filtering, and blog continuous loading now expose visible retryable
  client fetch failure states while preserving existing rendered content.
  F-107 is resolved, and T-205 is prepared for F-108 mixed component barrel
  cleanup.
- 2026-05-22: Completed T-205. Scoped server routes/loaders no longer
  value-import mixed component barrels, focused mocks were moved to direct file
  paths, and `clientServerImportBoundary.test.ts` now guards `src/app` and
  `src/components/loaders` against reintroducing those barrel value imports.
  F-108 is resolved, and T-206 was prepared for F-109 account subnav mounting.
- 2026-05-22: Completed T-206. The account layout now actively mounts
  `AccountSubnavLoader` inside `Suspense` with `SubnavSkeleton` fallback, and
  layout-level coverage guards against returning to a commented-out mount.
  F-109 is resolved. F-110 route fallback patterns were captured in T-207.
- 2026-05-22: Deferred T-207 after priority review. Route fallback
  documentation and `/project/aims` loading-copy cleanup remain valid polish,
  but commerce/search/compliance production blockers take priority.
- 2026-05-22: Completed T-208. `/shop/products/[productHandle]` now renders an
  external hosted Shopify purchase CTA for available products with valid
  `onlineStoreUrl`, preserves the contact enquiry fallback when that URL is
  missing, keeps unavailable products free of purchase/enquiry completion CTAs,
  and adds focused page coverage for all three states.
- 2026-05-22: Prepared T-209 as the next frontend/compliance slice. It should
  neutralize unsupported commerce assurance copy in shared security banners and
  matching security translation strings without redesigning the footer or shop
  pages.
- 2026-05-22: Completed T-209. Shared security banners and matching security
  translation strings now avoid unsupported payment, buyer-protection,
  money-back, insured/global-shipping, payment-method, and guarantee claims.
  The replacement copy stays within archive browsing, direct contact,
  enquiry-context, catalogue access, and Shopify-hosted-link facts.
- 2026-05-22: Prepared T-210 as the next public-discovery slice. It starts the
  staged site-wide search expansion by adding artwork results to `/search`,
  while keeping Shopify product search separate.
- 2026-05-22: Completed T-210. `/search` now renders Artworks sections in
  all-type searches, supports selected `type=artworks` result pages with the
  existing pagination pattern, and updates no-results copy to include artworks
  without implying Shopify product search.
- 2026-05-22: Prepared T-211 as the next public-discovery slice. It adds
  Shopify product results to `/search` using the existing public shop
  product-list data path while keeping checkout/cart, shop listing controls,
  and commerce claims separate.
- 2026-05-22: Completed T-211. `/search` now renders Shop Products sections in
  all-type searches, supports selected `type=shop-products` pages with the
  existing no-results and pagination patterns, and updates supported-type and
  all-types empty copy to include shop products without commerce claims.
- 2026-05-22: Completed T-212 as the R-018 compliance decision-packet task.
  The owner later approved the packet recommendations for implementation
  scoping.
- 2026-05-22: Completed T-213. `/privacy`, `/terms`, and footer legal links
  are in place with focused coverage. Account privacy UI, comment/contact
  notices, third-party consent UI, social URLs, and commerce-policy URL work
  remain separate.
- 2026-05-22: Completed T-214. Newsletter form consent copy/links and
  `/newsletter/unsubscribe` are in place. Account privacy/terms
  acknowledgement UI and manual privacy request handoff remained separate until
  T-215.
- 2026-05-22: Completed T-215. Credentials signup now renders required
  privacy/terms acknowledgement UI, `/sign-in` renders provider controls with
  a policy notice before OAuth continuation, account and mobile navigation now
  target the app-owned sign-in route, and account settings exposes a manual
  delete/export/correction request handoff instead of an inert delete button.
- 2026-05-22: Completed T-216. `CommentForm` now renders visible posting
  notice copy with `/privacy` and `/terms` links plus the approved manual
  moderation/removal/correction handoff to hlaoutaris@gmail.com, while
  preserving existing comment submission and display behavior.
- 2026-05-22: Completed T-217. Contact/product and artwork enquiry forms now
  render the shared privacy/retention notice with `/privacy` and `/terms`
  links plus the manual privacy/legal handoff to hlaoutaris@gmail.com, while
  preserving existing enquiry form behavior.
- 2026-05-23: Completed T-218. The footer no longer renders dead
  Facebook/Twitter/Instagram `href="#"` placeholders, contact and legal links
  remain intact, and the copyright text is current-year based instead of fixed
  at 2024.
- 2026-05-23: Completed T-219 as a docs-only compliance blocker record. The
  remaining R-018 runtime work now waits for owner-supplied Shopify policy
  URLs, real social URLs, launch scope, or explicit opt-in decisions.
- 2026-05-23: Reactivated T-207 as the next unblocked frontend cleanup task.
  It should document route fallback patterns and replace only the generic
  `/project/aims` inline `Loading...` fallback.
- 2026-05-23: Completed T-207. The rendering architecture doc now records the
  accepted public route fallback pattern, and `/project/aims` uses a route-local
  neutral desktop image fallback instead of generic inline loading copy.
- 2026-05-23: Reconciled A-022 into F-111 through F-117 and planned tasks
  T-230 through T-235. T-230 then resolved the import-boundary guard regression,
  T-231 narrowed middleware matching to protected route prefixes only, T-232
  completed the docs-first freshness policy, and T-233 completed the biography
  runtime cache proof before later client-provider island work.
- 2026-05-23: Completed T-230. `SignUpForm` now avoids the broad
  `@/lib/constants` barrel at runtime by importing the account privacy
  acknowledgement field constants from the narrow client-safe constants module,
  while preserving the rendered privacy/terms acknowledgement behavior.
- 2026-05-23: Completed T-231. Middleware matching now covers only protected
  frontend/API prefixes, and protected route utility matching no longer treats
  public prefix lookalikes as protected.
- 2026-05-23: Completed T-232. Public sitemap/default redirect freshness is
  now explicit in the rendering architecture doc, and biography is selected as
  the first cached non-`fetch` service proof before generated params or broader
  route ISR.
- 2026-05-23: Completed T-233. Route-local biography detail, metadata,
  structured data, subnav, default redirect, and previous/next navigation now
  use 10-minute cached non-`fetch` service wrappers. `/biography` is the only
  route-level redirect ISR export added, `/biography/[slug]` remains dynamic,
  and `MainNavLoader` stays on the direct service to avoid root-header cache
  propagation into unrelated static shells.
- 2026-05-23: Scoped T-234. The current root layout client chunk still carries
  cross-cutting session, modal, search drawer, and mobile navigation drawer
  code, so T-236 is the first approved runtime proof before provider moves.
- 2026-05-23: Completed T-236. `SearchDrawer` and `MobileNavDrawer` now keep
  labelled trigger/controller code in the public mobile header and lazy-load
  colocated body modules after first open intent. The drawer bodies preserve
  the existing search form, close controls, public nav links, and
  session-dependent account links while desktop/tablet navigation and root
  provider ownership remain unchanged.
- 2026-05-23: Completed T-235. Ordinary server-rendered public/account
  layouts/pages, loaders, views, navigation modules, and prototype loader
  helpers no longer use top-level `"use server"` as a Server Component marker.
- 2026-05-23: Completed T-237 as a docs-only Next.js efficiency scoping pass.
  Provider/modal work remains deferred after the T-236 drawer proof, and T-238
  is the next selected runtime slice for the route-local collections redirect
  cache proof.
- 2026-05-24: Completed T-238. The collections default redirect and
  route-local collections subnav now use a 10-minute cached collection
  navigation wrapper, `/collections` exports the matching ISR window, and
  collection detail routes plus root header navigation keep their direct dynamic
  behavior.
- 2026-05-24: Completed T-239. `/sitemap.xml` now owns one-hour ISR freshness
  in `src/app/sitemap.ts`; sitemap content, public route rendering, provider
  ownership, and Shopify behavior were preserved.

## Next Agent Action

Do not reassign
[T-211 Add Shopify product results to public search](../tasks/T-211-add-shopify-product-results-to-public-search.md);
it is complete. T-215 through T-219 are complete; do not reassign them unless
account/comment/contact/footer compliance behavior or the owner-input blocker
record regresses. T-207 is complete; do not reassign it unless public route
fallback documentation or `/project/aims` fallback source hygiene regresses.
Keep third-party consent UI, commerce-policy URL wiring, and real social target
wiring separate until owner-supplied targets exist.

For the A-022 Next.js efficiency track, T-236 completed the first
client-island runtime proof by lazy-loading the public mobile search/navigation
drawer bodies, and T-238 completed the next route-family cache slice for
collections redirect/navigation. T-239 explicit `/sitemap.xml` ISR ownership is
also complete. Keep root provider/modal ownership, blog cache splitting,
generated params, and broader static/ISR migration separate unless a new task
scopes one of those paths.

If framed print preview implementation is prioritized instead, run T-194
targeted visual QA and owner review for `/prototype/frame` before Shopify
option mapping, checkout/cart work, enquiry mutation, or physical-dimension
migration.

For the homepage redesign track, keep production migration blocked until owner
review accepts the expanded prototype direction using the T-169 packet, now
updated to include the collections prototype. The semantic style map from T-170
should not be adopted in prototype or live components until that direction is
accepted and a visual-parity migration task is prepared. T-157 through T-170
and T-173 are complete; do not reassign them unless the prototype route,
section data mapping, visual QA handoff, style audit, width frame, section
composition, expanded QA conclusion, owner packet, style scaffold, collections
prototype, or admin read-list audit regresses.

No further admin archive maintenance UI task is currently prepared after
T-183. Keep any future shared read-list shell extraction, comment/user search,
or broader archive redesign separate and assign only if the duplication or
workflow gap becomes actionable.
T-174's route query prerequisite, T-175's blog pagination pilot, T-176's
route-backed blog filters, T-177's blog search pilot, and T-178's comment/user
delete handoff are complete. T-179's collection pagination/search rollout is
also complete, and T-180's article pagination/filter/search rollout is
complete. T-181's artwork pagination/filter/search rollout, T-182's
comment/user pagination rollout, and T-183's shared pagination-control
extraction are complete.

[T-143](../tasks/T-143-decide-public-search-scope.md) now records the staged
public-search widening direction: [T-210](../tasks/T-210-add-artwork-results-to-public-search.md)
completed MongoDB-backed artwork results first, and
[T-211](../tasks/T-211-add-shopify-product-results-to-public-search.md)
completed Shopify product results next. Keep collection section launch policy,
owner/legal-approved policy links/notices, broad static/ISR migration, and
checkout/cart work separate unless explicitly assigned. T-153, T-154, and T-155
are complete; do not reassign them unless blog admin controls, public taxonomy
validation, or visible breadcrumb labels regress.

Do not reassign T-081, T-082, T-083, T-084, T-085, T-086, T-087, T-088,
T-089, T-090, T-091, T-092, T-093, T-094, or T-095 unless a regression is
opened. Do not reassign T-130 unless the scoped public browsing client
source-hygiene or existing failure-state behavior regresses. Do not reassign
T-204 unless public browsing client retry/error states regress. Do not reassign
T-205 unless scoped mixed-barrel import hygiene regresses. Do not reassign
T-230 unless the client import-boundary guard or `SignUpForm` direct constants
import regresses. Do not reassign
T-206 unless the account layout subnav mount regresses. Do not reassign
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
