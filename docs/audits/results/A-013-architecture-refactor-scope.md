# A-013 Architecture Refactor Scope Result

Status: Complete

Audit goal: [A-013 Architecture refactor scope](../goals.md#a-013-architecture-refactor-scope)

Workstream: [Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md)

## Summary

The app already has several scalable patterns worth preserving: App Router
pages hand off to server loaders and then to client views for interaction;
typed client/server API fetcher factories centralize most request paths; generic
transformers separate Mongoose documents from frontend types; route protection
has route utility tests; and admin CRUD is mostly isolated under a feature
namespace.

The main refactor scope is boundary definition, not a runtime rewrite. The
highest-risk architectural gaps are self-fetching server data access, leaky
client/server imports, duplicated taxonomy/filter structures, inconsistent API
response and transform contracts, scattered admin entity operations, and route
URL ownership split across helpers and hard-coded paths.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/workstreams/README.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
  - `docs/architecture/system-overview.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/architecture/rendering-and-data-fetching.md`
  - `docs/risks/production-readiness.md`
  - `docs/audits/goals.md#a-013-architecture-refactor-scope`
- Required code areas:
  - `src/app/`
  - `src/components/`
  - `src/lib/`
  - `src/hooks/`
  - `src/contexts/`
- Context inspected because route protection and architecture docs reference it:
  - `src/middleware.ts`
  - `__tests__/unit/utils/routeUtils.test.ts`
- No runtime code was refactored. No findings register, risk, ADR, or workstream
  backlog files were modified.

## Commands Run

- `pwd`
- `git status --short`
- `sed -n '1,240p' docs/README.md`
- `sed -n '1,220p' docs/workstreams/README.md`
- `sed -n '1,260p' docs/workstreams/architecture-refactor-and-code-health.md`
- `sed -n '1,260p' docs/architecture/system-overview.md`
- `sed -n '1,300p' docs/architecture/routes-and-api.md`
- `sed -n '1,260p' docs/architecture/rendering-and-data-fetching.md`
- `sed -n '1,280p' docs/risks/production-readiness.md`
- `rg -n "A-013|Architecture refactor scope|architecture refactor" docs/audits/goals.md`
- `sed -n '1,260p' docs/audits/goals.md`
- `ls docs/audits/results`
- `sed -n '1,260p' docs/audits/results/A-013-architecture-refactor-scope.md`
- `sed -n '1,200p' docs/audits/results/README.md`
- `sed -n '1,220p' docs/audits/results/A-005-frontend-routes-components.md`
- `sed -n '1,220p' docs/audits/results/A-014-unused-code-dependency-pruning.md`
- `sed -n '1,220p' docs/audits/results/A-015-ssr-data-fetching.md`
- `rg --files src/app`
- `rg --files src/components`
- `rg --files src/lib`
- `rg --files src/hooks src/contexts`
- `rg -l "^['\"]use client['\"]" src/app src/components src/lib src/hooks src/contexts`
- `rg -n "server-only|mongodb|mongoose|next-auth|authOptions|getServerSession|process\.env|fetch\(" src/app src/components src/lib src/hooks src/contexts`
- `rg -n "from \"@/components/(views|sections|modules/cards|elements/buttons|features/adminDashboard/.*|loaders/.*)\"|from \"@/components\"|from \"@/lib\"|from \"@/lib/(constants|data/types|transforms)\"" src/app src/components src/lib`
- `rg -n "from \"@/lib/data/models|from \"@/lib/db/mongodb|from \"@/lib/config/authOptions|from \"next/headers|from \"next-auth|useSession\(" src/app src/components src/lib src/hooks src/contexts`
- `rg -n "TODO|FIXME|WIP|OLD CODE|Backup|console\.log|console\.error" src/app src/components src/lib src/hooks src/contexts`
- `rg -n "^['\"]use client['\"]|serverApi|next/headers|@/lib/data/models|@/lib/db/mongodb|@/lib/config/authOptions|getServerSession|clientApi" src/components/modules/forms/user/ContactForm.tsx src/components/modules/forms/user/EnquiryForm.tsx src/components/modules/cards/ArtworkInfoCard.tsx src/components/loaders/viewLoaders/ArtworkLoader.tsx src/components/views/ArtworkView.tsx src/components/views/index.ts`
- `rg -n "^['\"]use client['\"]|@/lib/api/(clientApi|public/clientPublicApi|admin/clientAdminApi|user/clientUserApi)|@/lib/api/(serverApi|public/serverPublicApi|admin/serverAdminApi|user/serverUserApi)" src/app src/components src/lib src/hooks src/contexts`
- `rg -n "(/api/artworks|api/v2/public/artwork|api/v2/public/shop/products|NEXT_PUBLIC_BASE_URL|localhost:3000|laoutaris-nextjs\.vercel\.app)" src/app src/components src/lib`
- `rg -n "withDbConnect|dbConnect\(\)" src/app/api src/app src/components src/lib`
- `rg --files-without-match "dbConnect\(|withDbConnect" src/app/api/v2`
- `rg --files-with-matches "dbConnect\(|withDbConnect" src/app/api/v2`
- `rg -n "success: false|statusCode|message:|error:" 'src/app/api/v2/public/shop/products/[productId]/route.ts' 'src/app/api/v2/user/favourite/[artworkId]/route.ts' 'src/app/api/v2/admin/artwork/create/route.ts' 'src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts'`
- `rg --files -g 'middleware.*'`
- `rg -n "matcher|isProtectedRoute|isAdminRoute|getToken|NextResponse.next|middleware" .`
- `rg -n "href=.*localhost|router\.push\(\"http://localhost|api/auth/signin|/api/artworks" src/app src/components src/lib`
- `rg -n "from \"@/lib/data/models\"" src/components src/hooks src/contexts`
- `rg -n "from \"@/lib/api/serverApi\"|from \"@/lib/api/public/serverPublicApi\"" src/components src/hooks src/contexts`
- `rg -n "from \"@/lib/config/authOptions\"|from \"next-auth\"" src/components src/hooks src/contexts`
- `sed -n '1,220p' src/hooks/useInfiniteScroll.ts`
- `sed -n '1,220p' src/hooks/useLanguage.ts`
- `sed -n '1,220p' src/hooks/useModal.ts`
- `sed -n '1,220p' src/hooks/useImageCycle.ts`
- `sed -n '1,220p' src/contexts/SessionProvider.tsx`
- `sed -n '1,220p' src/contexts/ClientContextBoundary.tsx`
- Representative file reads with `sed -n` and line-number reads with
  `nl -ba` across route pages, loaders, API fetchers, API routes, transforms,
  DB utilities, admin feature modules, route utilities, hooks, and contexts.
- Note: several initial reads against bracketed route paths failed due unquoted
  shell globbing and were rerun with quoted paths. No files were changed by
  those reads.

## Findings

### Pattern To Preserve: Page -> Loader -> Client View

Evidence:

- `src/app/artwork/page.tsx` normalizes search params and passes typed sort and
  filter state into `ArtworkListLoader`.
- `src/components/loaders/viewLoaders/ArtworkListLoader.tsx:12-22` performs
  server-side loading and passes initial data into
  `src/components/artwork/ArtworkGallery.tsx`.
- `src/components/artwork/ArtworkGallery.tsx:1-16` is a client component that
  owns interactive filtering and pagination after initial render.

Why preserve it: this is the clearest current pattern for server-rendered
initial data with client-side interaction. Future public archive and shop route
work should standardize around this shape, after the server data-access decision
below is resolved.

### Pattern To Preserve: Typed Fetcher And API Result Vocabulary

Evidence:

- `src/lib/api/core/createFetcher.ts:12-20` defines the reusable fetcher contract.
- `src/lib/api/public/artwork/fetchers.ts` and related fetcher factories attach
  route paths to typed result aliases.
- `src/lib/data/types/apiTypes.ts:3-46` defines `ApiErrorResponse`,
  `ApiSuccessResponse`, `SingleResult`, `ListResult`, `RouteResponse`, and
  `ApiResponse`.

Why preserve it: the vocabulary is useful for route, client, and component
contracts. The next step is to enforce it consistently instead of adding
per-route exceptions.

### Pattern To Preserve: Document Transformers

Evidence:

- `src/lib/transforms/createTransformer.ts:39-82` centralizes raw, extended, and
  sanitized document transforms.
- `src/lib/transforms/artwork/transformArtwork.ts:18-27` applies the generic
  transformer to artwork.
- Public artwork routes use `transformArtwork.toFrontend`, for example
  `src/app/api/v2/public/artwork/[id]/route.ts`.

Why preserve it: this is a good ownership boundary between Mongoose documents
and frontend data. The refactor should make transformed frontend data the rule
for public/user/admin API responses, not a route-by-route choice.

### Pattern To Preserve: Route Utilities With Tests

Evidence:

- `src/lib/constants/routeConstants.ts` centralizes protected route prefixes.
- `src/lib/utils/routeUtils.ts` derives `isProtectedRoute` and `isAdminRoute`.
- `__tests__/unit/utils/routeUtils.test.ts` covers exact, nested, and
  admin-like false-positive cases.
- `src/middleware.ts` consumes the route utilities.

Why preserve it: this is a rare existing example where a boundary rule has a
focused unit test. The auth/admin audit can expand it, but architecture work
should keep this utility-and-test pattern.

### A013-1: Server-Side Data Access Has Competing Ownership Models

Severity: High

Evidence:

- Server loaders call both the database connection and an internal HTTP API.
  `src/components/loaders/viewLoaders/ArtworkListLoader.tsx:16-22` calls
  `dbConnect()` and then `serverApi.public.artwork.multiple(...)`.
- Server API wrappers self-fetch the app through hard-coded absolute base URLs:
  `src/lib/api/public/serverPublicApi.ts:11-31`,
  `src/lib/api/user/serverUserApi.ts:9-30`, and
  `src/lib/api/admin/serverAdminApi.ts:8-29`.
- The same base URL logic is duplicated across public, user, and admin server
  fetchers, including production domain and local fallback.
- Root layout connects to MongoDB for every route render in
  `src/app/layout.tsx:28`, while API routes and loaders also connect in
  separate places.
- `src/lib/db/README.md:37-40` says to use `withDbConnect` in all API routes,
  but `rg --files-without-match "dbConnect\(|withDbConnect" src/app/api/v2`
  shows many API routes without that pattern, including admin CRUD routes.

Risk:

- Server-rendered reads depend on the app being reachable over HTTP, even when
  the caller is already inside the same Next.js runtime.
- Auth header propagation, cache/revalidation behavior, database connection
  ownership, and test seams are unclear.
- The duplicated server fetcher base URL logic makes deployment domain changes
  risky.

Refactor scope:

- Decide one canonical server-side data access pattern before implementation:
  direct domain/query services called by loaders and API routes, or an explicit
  internal HTTP API layer with one shared server fetcher, cache policy, auth
  forwarding rules, and base URL source.
- Move DB connection ownership to the selected boundary. Avoid root layout
  connecting every route unless an ADR explicitly chooses that behavior.

ADR escalation:

- Required before broad implementation. This decision changes route data flow,
  cache policy, testing strategy, and API boundary ownership.

### A013-2: Client/Server Import Boundaries Are Leaky

Severity: High

Evidence:

- `src/components/modules/forms/user/ContactForm.tsx:1-21` is a client
  component that imports `serverApi` and `EnquiryBase` from the Mongoose model
  barrel. `serverApi` reaches server-only modules through server fetchers that
  import `next/headers`.
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:1-30`
  is a client component that imports `ArtworkBase` from `@/lib/data/models`.
  This is a value import, not `import type`, so it risks pulling the Mongoose
  model barrel into client compilation.
- `src/components/views/index.ts:1-8` exports both client components
  (`BlogDetail`, `DesktopArticleView`, `MobileArticleView`,
  `UserCommentsView`) and server-compatible views from one barrel. Server loader
  `src/components/loaders/viewLoaders/ArtworkLoader.tsx:1-3` imports from that
  broad view barrel.
- The search `rg -n "from \"@/lib/data/models\"" src/components src/hooks src/contexts`
  shows model imports from client-facing components.

Risk:

- Server-only dependencies can enter client bundles through unused imports or
  broad barrels.
- Future refactors can accidentally turn a safe server component import into a
  client-boundary error without changing the importing file.

Refactor scope:

- Define import rules for `src/lib`: client components should import
  `clientApi`, frontend types, schemas, and pure helpers only.
- Use `import type` for frontend-only type references.
- Prefer direct component imports over broad component barrels when a barrel
  mixes client and server-compatible exports.

ADR escalation:

- Recommended before enforcing lint rules or reorganizing module boundaries.
  The project needs an explicit client-safe/server-only package boundary.

### A013-3: Domain Taxonomy And Filter State Are Duplicated

Severity: Medium

Evidence:

- Canonical artwork options exist in
  `src/lib/constants/artworkConstants.ts:1-44`.
- `src/lib/data/schemas/artworkSchema.ts:7-32` repeats the same decade,
  artstyle, medium, and surface literals for Zod validation.
- `src/components/artwork/filters/ArtworkSortAndFilter.tsx:47-81` repeats
  option arrays for the public artwork filter UI.
- `src/components/features/adminDashboard/crudForms/create/CreateArtworkForm.tsx:126-239`
  repeats option literals inside admin form markup.
- Shop filtering introduces separate sentinel strings such as `all-style`,
  `all-medium`, `all-surface`, and `all-epochs` in
  `src/app/shop/products/page.tsx:13-20`,
  `src/components/compositions/ShopProductGallery.tsx:27-39`, and
  `src/components/modules/filters/ShopFilters.tsx:29-123`.

Risk:

- Adding or renaming taxonomy values requires edits in constants, schemas,
  public filters, admin forms, and shop filters.
- The shop filter UI includes dimensions and colors, but the current shop query
  builder only forwards artstyle, medium, surface, decade, and product type
  flags. That creates UI/API drift.

Refactor scope:

- Create one taxonomy/options source that feeds Mongoose enums, Zod schemas,
  admin forms, public filters, and shop filters.
- Make "all" sentinel values part of the same typed filter configuration rather
  than scattered string literals.

### A013-4: API Response And Transform Contracts Are Uneven

Severity: High

Evidence:

- The shared API vocabulary in `src/lib/data/types/apiTypes.ts:3-46` expects
  success/error envelopes.
- `src/app/api/v2/public/shop/products/[productId]/route.ts:15-40` returns raw
  `{ error: ... }` bodies and raw product JSON instead of the shared
  `success/data/error` envelope.
- `src/app/api/v2/user/favourite/[artworkId]/route.ts:21-62` returns
  unauthorized, not-found, and internal-error JSON bodies without explicit HTTP
  statuses.
- `src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts:39-42`
  returns a populated Mongoose collection directly as `data` instead of using a
  frontend transform.
- `src/app/api/v2/admin/artwork/create/route.ts:44-51` returns the saved
  Mongoose document directly and does not call `dbConnect()`.

Risk:

- Client components and fetchers cannot rely on one response shape.
- Public/user/admin routes may leak raw document structure or Mongoose-specific
  fields.
- Error handling and status-code behavior differ across route groups.

Refactor scope:

- Standardize route response helpers for success, error, unauthorized,
  forbidden, not-found, validation, and upstream service errors.
- Require route responses to return transformed frontend/admin data unless an
  internal-only API is explicitly documented.
- Reconcile this finding with A-002 and A-003 before implementation.

### A013-5: Admin Feature Isolation Is Good, But Entity Operations Are Repeated

Severity: Medium

Evidence:

- `src/components/features/adminDashboard/adminSegmentConfig.tsx:21-84`
  centralizes segment-to-component wiring for articles, artwork, blogs,
  collections, users, and comments.
- Operation tabs repeat similar state, read, update, delete, and success modal
  flow. Compare `src/components/features/adminDashboard/operationTabs/ArtworkOperations.tsx:27-154`
  and `src/components/features/adminDashboard/operationTabs/BlogOperations.tsx:20-107`.
- Feed tabs enumerate one component per entity in
  `src/components/features/adminDashboard/feeds/FeedTabs.tsx:79-107`, even
  though `src/components/compositions/Feed.tsx:38-75` already sketches a
  generic feed pattern.

Risk:

- Adding another admin entity means touching segment config, feed tab wiring,
  read list, operation tab, form, API fetchers, and cards separately.
- Fixing pagination, error handling, destructive action UX, or modal behavior
  requires repeated edits across entities.

Refactor scope:

- Preserve the `features/adminDashboard` ownership boundary.
- Consolidate repeated entity metadata into typed descriptors that can drive
  segment tabs, feed tabs, read lists, and operation handlers.
- Keep form specifics local where the schemas and user workflows differ.

### A013-6: Route URL Ownership Is Split Across Helpers And Hard-Coded Paths

Severity: Medium

Evidence:

- `src/lib/utils/urlUtils.ts` provides `buildUrl`, and it is used by loaders and
  layouts for some internal route construction.
- Hard-coded absolute local URLs still appear in UI code:
  `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx:35-44`
  and `src/components/modules/forms/user/LogoutForm.tsx:11-15`.
- Product detail code calls non-v2 artwork endpoints in
  `src/app/shop/products/[productHandle]/page.tsx:20-41`, while the documented
  API surface is under `/api/v2/public/artwork`.
- `src/app/project/page.tsx:1-5` builds a redirect from `process.env.VERCEL_URL`
  or `http://localhost:3000`, instead of using a relative app route.

Risk:

- Production links can point at localhost.
- Internal API path changes are hard to audit because route construction is not
  centralized.
- Public route helpers, auth paths, API paths, and external service URLs have
  overlapping responsibilities.

Refactor scope:

- Centralize app route builders, API route builders, and auth path constants.
- Prefer relative routes for same-app redirects and links.
- Align shop-linked artwork fetches with the documented v2 public artwork API.

### A013-7: Historical, WIP, And Debug Artifacts Obscure Ownership

Severity: Low

Evidence:

- `src/components/modules/wip/` contains WIP modules inside the production
  component tree.
- `rg -n "TODO|FIXME|WIP|OLD CODE|Backup|console\.log|console\.error" src/app src/components src/lib src/hooks src/contexts`
  found widespread TODOs, old code comments, backup forms, and debug logging.
- Examples include `src/lib/db/mongodb.ts` retaining old connection code,
  `src/lib/api/core/createFetcher.ts:27-55` logging every fetch, and
  `src/app/layout.tsx:29-32` logging branch verification on every render.

Risk:

- Agents cannot tell which modules are durable architecture and which are
  experiments.
- Debug logging and historical code increase the chance of accidental imports or
  production noise.

Refactor scope:

- Defer deletion decisions to A-014, but classify WIP/historical modules as
  archive, active backlog, or removable before broad refactors.
- Move durable lessons from old code comments into architecture/runbook docs
  before pruning.

## ADR Escalation

- ADR required: choose the canonical server-side data access pattern before
  replacing loaders, server fetchers, or API route data flow.
- ADR recommended: define client-safe and server-only module boundaries,
  including whether broad component/lib barrels are allowed in client
  components.
- No ADR required yet for taxonomy consolidation, admin descriptor extraction,
  or route URL helper cleanup unless those changes alter public API contracts or
  deployment behavior.

## Findings Register Updates

- Not updated per concurrency instruction.
- Candidate finding A013-1: Server-side data access has competing ownership
  models; decide direct domain services versus internal HTTP self-fetch before
  implementation.
- Candidate finding A013-2: Client/server import boundaries are leaky; define
  client-safe and server-only import rules.
- Candidate finding A013-3: Domain taxonomy and filter state are duplicated
  across constants, schemas, public filters, admin forms, and shop filters.
- Candidate finding A013-4: API response and transform contracts are uneven
  across public, user, admin, and shop routes.
- Candidate finding A013-5: Admin entity operations are isolated but repeated
  across operation tabs, read lists, feeds, and API clients.
- Candidate finding A013-6: Route URL ownership is split across helpers and
  hard-coded local paths.
- Candidate finding A013-7: Historical, WIP, and debug artifacts obscure module
  ownership; reconcile through A-014 before pruning.

## Risks Updated

- None. Existing risk R-010 remains the canonical production risk for this
  audit scope.

## Workstream Updates

- None. Per assignment, this audit did not modify workstream status, backlog,
  risks, ADRs, or the findings register.

## Next Action

Reconcile candidate findings through the findings register, then draft an ADR
for server-side data access ownership before implementing architecture
refactors. After that decision, split implementation planning across:

- direct-import/client-safe boundary cleanup,
- API response/transform contract standardization,
- taxonomy/filter option consolidation,
- route URL helper cleanup,
- admin entity descriptor consolidation,
- A-014 WIP and unused-code classification.
