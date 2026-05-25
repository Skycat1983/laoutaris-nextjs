# A-035 Build-Time External Dependency Map

Status: Completed

Audit goal:
[A-035 Build-time external dependency map](../goals.md#a-035-build-time-external-dependency-map).

Workstreams:
[Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md),
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md).

## Assignment Summary

Map why `npm run build` needs external MongoDB/network access during static
generation and identify the smallest safe mitigation or release-evidence policy.

## Summary

`npm run build` still depends on live MongoDB during App Router page data
collection and static generation. Under the pinned Node `22.14.0` / npm
`10.9.2` runtime, the sandboxed build compiled successfully but failed during
static generation because MongoDB SRV DNS was blocked. The same command passed
when rerun with external network access.

The build-time dependency is not one single route. The largest accidental
couplings are the global header navigation loader, the `/account` layout, and
`/project/about`. The intentional static/ISR surfaces are `/biography`,
`/collections`, and `/sitemap.xml`; they currently need live data for complete
release evidence unless a future task changes their rendering policy. The
noindex `/prototype/home` route also performs live MongoDB and Shopify-backed
reads while prerendering.

Smallest safe next step: split the mitigation into two tasks. First remove the
accidental hard failures from `/account` and `/project/about`, then define an
explicit release-evidence policy for the intentional ISR/static surfaces until a
separate route-rendering decision changes them.

## Scope Inspected

- `docs/architecture/rendering-and-data-fetching.md`,
  `docs/runbooks/deployment.md`, `docs/runbooks/environment.md`, and
  [A-027 Verification gate snapshot](A-027-verification-gate-snapshot.md).
- Route segment exports and static/dynamic build classification under
  `src/app`.
- Root header navigation, account layout/session navigation, project article
  rendering, public sitemap generation, prototype home loaders, MongoDB
  connection helpers, and Shopify product-list service paths.
- `npm run build` output in the default sandbox and with external network
  access.

## Commands Run

| Command | Outcome | Notes |
| --- | --- | --- |
| `git status --short` | Informational | Worktree was already dirty with modified orchestration/audit/task docs and untracked A-034/A-035/task docs before this audit edit. |
| `node -v && npm -v` | Baseline mismatch by default | Default shell reported Node `v21.2.0` and npm `10.2.3`. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && node -v && npm -v` | Passed | Confirmed pinned local runtime: Node `v22.14.0`, npm `10.9.2`. |
| `rg -n "export const (dynamic\|revalidate\|dynamicParams\|fetchCache)\|generateStaticParams\|unstable_cache\|cache\\(" src/app src/components src/lib next.config.mjs package.json` | Passed | Found explicit dynamic routes, the three route-level `revalidate` surfaces, and the non-`fetch` cache wrappers. |
| `rg -n "dbConnect\|getServerSession\|authOptions\|ArticleLoader\|HeaderMainNavLoader\|AccountSubnavLoader\|getDynamicPublicSitemapEntries\|getCachedBiographyNavigationList\|getCachedCollectionNavigationList\|getShopProductList\|getArticleNavigationList\|getCollectionNavigationList" src/app src/components/loaders src/components/modules/navigation/header src/lib/metadata` | Passed | Identified the root header, account, project article, sitemap, route-local redirect, and prototype data paths that can run during build. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm run build` | Failed in sandbox | Compiled successfully, then failed during static generation with `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net`. Next listed export errors for `/account`, `/account/settings`, `/account/comments`, `/account/favourites`, `/account/watchlist`, and `/project/about`. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 >/dev/null && npm run build` with external network access | Passed | Confirmed the same build passes when live external access is available. Route table classified `/biography`, `/collections`, `/project/about`, `/prototype/home`, `/sitemap.xml`, `/shop`, `/privacy`, `/terms`, and other shells as static; `/account*` routes were dynamic in the final table but still failed in the sandbox before the dynamic bailout could complete. |

## Build-Time Dependency Map

| Route or path | External dependency | Build-time trigger | Intentional or accidental | Recommended follow-up |
| --- | --- | --- | --- | --- |
| Global header on every prerendered route, including static shells such as `/privacy`, `/project`, `/shop`, `/terms`, `/prototype/home`, `/project/about`, `/biography`, and `/collections` | MongoDB via biography article navigation and collection navigation | `RootLayout` renders `Header`; `Header` renders `HeaderMainNavLoader`; `getMainNavLinks()` calls `getArticleNavigationList("biography")` and `getCollectionNavigationList()`, which call `dbConnect()` and Mongoose queries. Evidence: `src/components/modules/navigation/header/Header.tsx:11`, `src/components/loaders/componentLoaders/MainNavLoader.tsx:55`, `src/components/loaders/componentLoaders/MainNavLoader.tsx:58`, `src/components/loaders/componentLoaders/MainNavLoader.tsx:59`, `src/lib/data/services/getArticleNavigationList.ts:15`, `src/lib/data/services/getCollectionNavigationList.ts:13`. | Accidental broad coupling. The loader catches rejected source reads and returns fallback top-level links, so it usually does not fail the build by itself, but it makes static generation depend on MongoDB and emits repeated build-time errors when MongoDB is unavailable. | Create a static-safe main-nav task: either use accepted cached wrappers/fallback links for root header build output, move live first-item resolution out of the global header, or make a route-rendering decision that explicitly accepts root-header live data as release-build input. |
| `/account`, `/account/settings`, `/account/comments`, `/account/favourites`, `/account/watchlist` | MongoDB through both Mongoose and the raw MongoDB driver used by the NextAuth adapter | `AccountLayout` calls `await dbConnect()` before rendering. Its subnav imports `getUserIdFromSession()`, which imports `authOptions`; `authOptions` imports `clientPromise`, and `clientPromise` starts `connectWithRetry(client)` at module load in non-development mode. Evidence: `src/app/account/layout.tsx:11`, `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx:14`, `src/lib/session/getUserIdFromSession.ts:4`, `src/lib/config/authOptions.ts:7`, `src/lib/config/authOptions.ts:34`, `src/lib/db/clientPromise.ts:65`, `src/lib/db/clientPromise.ts:67`. | Accidental hard failure. These are protected, request-time account routes; build should not need to connect to MongoDB just to produce release artifacts. | Smallest mitigation candidate: remove the unconditional `dbConnect()` from `AccountLayout` and/or export `dynamic = "force-dynamic"` from the account segment so the auth/session dynamic boundary is established before live DB work. Also consider lazy NextAuth adapter connection so importing `authOptions` does not start a raw MongoDB connection during build. |
| `/project/about` | MongoDB via project article detail and project article navigation | The static page renders `ArticleLoader slug="about" section="project"`. `ArticleLoader` calls `getArticleBySlugPopulated("about")` and, for non-biography sections, `getArticleNavigationList("project")`. Evidence: `src/app/project/about/page.tsx:8`, `src/components/loaders/viewLoaders/ArticleLoader.tsx:112`, `src/components/loaders/viewLoaders/ArticleLoader.tsx:115`, `src/components/loaders/viewLoaders/ArticleLoader.tsx:44`, `src/components/loaders/viewLoaders/ArticleLoader.tsx:47`. | Accidental hard failure. The route has no `dynamic` or `revalidate` export but needs live MongoDB content. `/project/contact` already exports `dynamic = "force-dynamic"` for a similar article-loader path. | Decide whether `/project/about` is static copy like `/project/aims` or MongoDB-owned content. If MongoDB-owned, add an explicit route policy such as `dynamic = "force-dynamic"` or accepted ISR. If static copy, remove the DB-backed `ArticleLoader` dependency. |
| `/biography` default redirect | MongoDB via cached biography navigation | Route exports `revalidate = 600` and calls `getCachedBiographyNavigationList()` to redirect to the first biography article. The cached wrapper calls `getArticleNavigationList("biography")`, which calls `dbConnect()`. Evidence: `src/app/biography/page.tsx:10`, `src/app/biography/page.tsx:20`, `src/lib/data/services/getCachedBiographyArticleData.ts:15`, `src/lib/data/services/getArticleNavigationList.ts:15`. | Intentional accepted ISR/static generation. Rendering docs identify `/biography` as a 10-minute redirect/navigation proof. | Keep external MongoDB access as required build evidence for this route until a future rendering task changes the redirect strategy. Release handoffs should record that build ran with external access and should smoke the redirect target. |
| `/collections` default redirect | MongoDB via cached collection navigation | Route exports `revalidate = 600` and calls `getCachedCollectionNavigationList()` to redirect to the first collection artwork. The cached wrapper calls `getCollectionNavigationList()`, which calls `dbConnect()`. Evidence: `src/app/collections/page.tsx:10`, `src/app/collections/page.tsx:20`, `src/lib/data/services/getCachedCollectionNavigationData.ts:8`, `src/lib/data/services/getCollectionNavigationList.ts:13`. | Intentional accepted ISR/static generation. Rendering docs identify `/collections` as a 10-minute redirect/navigation proof. | Keep external MongoDB access as required build evidence for this route until a future rendering task changes the redirect strategy. Release handoffs should record that build ran with external access and should smoke the redirected collection route. |
| `/sitemap.xml` | MongoDB for biography/blog/artwork/collection entries; MongoDB plus Shopify Storefront API fan-out for shop product entries | `sitemap()` exports `revalidate = 3600` and calls `getDynamicPublicSitemapEntries()`. That function runs MongoDB queries for Article, Blog, Artwork, and Collection models, then calls `getShopProductList()`, which connects to MongoDB for artwork product links and fetches Shopify products by ID. Evidence: `src/app/sitemap.ts:8`, `src/app/sitemap.ts:39`, `src/lib/metadata/publicDynamicSitemap.ts:99`, `src/lib/metadata/publicDynamicSitemap.ts:114`, `src/lib/metadata/publicDynamicSitemap.ts:129`, `src/lib/metadata/publicDynamicSitemap.ts:144`, `src/lib/metadata/publicDynamicSitemap.ts:180`, `src/lib/data/services/getShopProductList.ts:92`, `src/lib/data/services/getShopProductList.ts:120`. | Intentional ISR, but release evidence is incomplete without external dependencies. The sitemap source uses `Promise.allSettled()`, so external failures can silently reduce dynamic sitemap coverage while still returning stable routes. | Add a release-evidence policy: production build or deployed smoke must verify `/sitemap.xml` after external-access build and record that expected dynamic archive/shop URLs are present, or create a separate rendering task to make sitemap dependency/fallback semantics explicit. |
| `/prototype/home` | MongoDB for biography/blog/collection prototype data; MongoDB plus Shopify for shop prototype data | The noindex prototype page prerenders and calls `getBiographyPrototypeArticles()`, `getBlogPrototypeEntries()`, `getCollectionPrototypeEntries()`, and `getShopPrototypeProducts()`. These use shared data services, including `getShopProductList()`. Evidence: `src/app/prototype/home/page.tsx:20`, `src/app/prototype/home/page.tsx:22`, `src/app/prototype/home/page.tsx:23`, `src/app/prototype/home/page.tsx:24`, `src/app/prototype/home/page.tsx:25`, `src/components/prototypes/home/BiographyPrototypeLoader.tsx:22`, `src/components/prototypes/home/ShopPrototypeLoader.tsx:21`. | Accidental for production build reliability. The loaders catch failures and return empty data/fallback flags, so the route can build with degraded prototype content, but it still performs live external reads during static generation. | Decide whether prototype routes should be included in production builds with static fixtures, marked dynamic, or moved behind a non-production route policy. Do not let prototype-only pages add hidden release-build dependencies. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | The production build is still externally coupled: it fails without MongoDB DNS/network access and passes with external access. | Sandboxed `npm run build` failed during static generation with `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net`; external-access rerun passed and produced the route table. | Treat external-access build evidence as required for release until the accidental couplings are removed and the intentional ISR surfaces have an accepted offline/fallback policy. |
| High | Protected `/account` routes can fail the build before request-time auth handling because the account layout and NextAuth adapter path connect to MongoDB during build. | Next export errors listed `/account`, `/account/settings`, `/account/comments`, `/account/favourites`, and `/account/watchlist`; source shows `AccountLayout` awaits `dbConnect()` and `authOptions` imports a connecting `clientPromise`. | Create a focused account build-isolation task: remove unconditional layout DB work, add explicit dynamic segment policy where appropriate, and avoid eager raw MongoDB adapter connection on import. |
| High | `/project/about` is classified as static but renders MongoDB-backed article content and fails the sandbox build when MongoDB is unavailable. | Next export errors listed `/project/about`; source renders `ArticleLoader slug="about" section="project"` without `dynamic` or `revalidate`. External build route table showed `/project/about` as static. | Decide whether the route is static copy or live content, then add the matching route policy and tests. |
| Medium | The global header navigation makes otherwise static routes perform MongoDB reads at build time. | Build output repeatedly logged `loader.public.main_nav.failed` for article and collection navigation, and source shows `HeaderMainNavLoader` calls live navigation services from the root header. | Make root header navigation static-safe or explicitly document that the root header's first-item links are release-build data inputs. |
| Medium | `/sitemap.xml` can silently lose dynamic coverage when MongoDB or Shopify is unavailable. | `getDynamicPublicSitemapEntries()` uses `Promise.allSettled()` and drops rejected sources; the route still returns stable routes even if dynamic sources fail. | Add deployment evidence that checks dynamic sitemap URLs after an external-access build, or change the sitemap policy to fail/flag missing dynamic coverage intentionally. |
| Medium | The noindex `/prototype/home` route adds live MongoDB/Shopify reads to production build and can prerender degraded empty sections. | Sandbox build logged prototype loader failures; source catches data-service failures and returns empty arrays or `hasLoadError`. External build route table classified `/prototype/home` as static. | Give prototype routes an explicit production-build policy: static fixtures, dynamic-only, or excluded/reworked route ownership. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A035-C1 | High | Candidate | `npm run build` requires live MongoDB/network access during static generation and fails in the default sandbox. | Deployment/security/observability plus architecture refactor; update R-024/release evidence policy or create build-isolation work. |
| A035-C2 | High | Candidate | Protected `/account` routes connect to MongoDB during build through account layout and eager NextAuth adapter import paths. | Auth/admin/permissions plus architecture refactor; focused account build-isolation task. |
| A035-C3 | High | Candidate | `/project/about` is static but uses MongoDB-backed article loaders, causing build failure when MongoDB is unavailable. | Frontend routes/components plus architecture refactor; decide static copy vs dynamic/ISR route policy. |
| A035-C4 | Medium | Candidate | Root header navigation causes global build-time MongoDB reads for static shells. | Architecture refactor; static-safe navigation or documented release-build input decision. |
| A035-C5 | Medium | Candidate | `/sitemap.xml` can pass with incomplete dynamic coverage when MongoDB/Shopify sources fail. | Deployment/security/observability plus SEO route ownership; release smoke evidence or sitemap fallback policy. |
| A035-C6 | Medium | Candidate | `/prototype/home` performs live MongoDB/Shopify reads during production build and can prerender degraded prototype content. | Frontend/prototype ownership plus deployment; decide production-build policy for prototype routes. |

## Risks Updated

- Candidate R-024 update: Build verification remains coupled to live MongoDB
  DNS/network access. Current hard-failure paths are `/account*` and
  `/project/about`; intentional external-build paths include `/biography`,
  `/collections`, and `/sitemap.xml`; `/prototype/home` and the global header
  add additional build-time live reads.
- Candidate deployment evidence update: until mitigation lands, release
  handoffs should state whether `npm run build` ran with external network
  access and should include sitemap/redirect smoke evidence for the intentional
  ISR/static surfaces.

## Workstream Updates

- Candidate deployment/security update: pre-deployment checks currently require
  external MongoDB access for complete build evidence; `/sitemap.xml` should be
  smoked for dynamic archive/shop coverage when build uses live data.
- Candidate architecture update: add a build-isolation task before broad
  static/ISR expansion. Start with `/account` and `/project/about`, then reduce
  root-header live navigation reads on static shells.
- Candidate frontend/prototype update: define whether production builds should
  include prototype routes that use live archive and Shopify data.

## Next Action

Create one focused implementation task for accidental build coupling:

1. Remove or defer account layout/NextAuth MongoDB work during build for
   `/account*`.
2. Decide and implement the route policy for `/project/about`.
3. Add source/build verification proving the sandbox build no longer hard-fails
   on those accidental routes.

Then create a separate deployment policy task for intentional external-build
surfaces: document required external-access build evidence and sitemap/redirect
smoke checks for `/biography`, `/collections`, and `/sitemap.xml` until those
routes get a different accepted rendering strategy.
