# A-002 API Contracts Result

Status: Completed

Audit goal: [A-002 Public, user, and admin API contracts](../goals.md#a-002-public-user-and-admin-api-contracts)

Workstream: [Data models and API](../../workstreams/data-models-and-api.md)

## Summary

The `/api/v2` surface has a useful route-group shape and a shared typed response
vocabulary, but the contracts are not production-ready. The strongest existing
pattern is `{ success, data, metadata? }` for successful typed fetches and
`{ success: false, error }` for failures. The problem is that route handlers do
not apply that pattern consistently across HTTP status codes, validation,
MongoDB connection ownership, transformed response data, and exposed client
fetcher methods.

The most important production blockers are:

- Many routes return `success: false` with HTTP 200 because they omit the
  `NextResponse.json(..., { status })` option.
- The public single-product shop endpoint returns raw product/raw error bodies
  instead of the shared envelope.
- Several client fetchers expose methods or single-resource routes that do not
  exist in `src/app/api/v2`.
- Nearly all admin MongoDB-backed routes and several public/user routes touch
  Mongoose models without route-local `dbConnect()`.
- Admin and user create/update routes mix Zod validation, raw request bodies,
  raw Mongoose documents, transformed data, and 500 responses for validation
  failures.
- The Cloudinary signing route lives under `/api/v2/admin` but bypasses the
  admin route convention and returns raw `Response.json({ signature })`.

No runtime code was changed.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md#a-002-public-user-and-admin-api-contracts`
  - `docs/audits/results/README.md`
  - `docs/workstreams/README.md`
  - `docs/workstreams/data-models-and-api.md`
  - `docs/architecture/routes-and-api.md`
- Related audit context:
  - `docs/audits/results/A-001-shopify-commerce.md`
  - `docs/audits/results/A-013-architecture-refactor-scope.md`
  - `docs/audits/results/A-015-ssr-data-fetching.md`
- API route surface:
  - 52 route files under `src/app/api/v2`
  - 54 method handlers: 19 public, 10 user, 25 admin
- API client/fetcher surface:
  - `src/lib/api/core/createFetcher.ts`
  - `src/lib/data/types/apiTypes.ts`
  - `src/lib/api/public/**/fetchers.ts`
  - `src/lib/api/user/**/fetchers.ts`
  - `src/lib/api/admin/**/fetchers.ts`
  - `src/lib/api/public/serverPublicApi.ts`
  - `src/lib/api/user/serverUserApi.ts`
  - `src/lib/api/admin/serverAdminApi.ts`
  - `src/lib/api/clientApi.ts`
  - `src/lib/api/serverApi.ts`
- Supporting helpers:
  - `src/lib/session/getUserIdFromSession.ts`
  - `src/lib/session/isAdmin.ts`
  - `src/lib/data/schemas/commentSchema.ts`
  - Shopify and Cloudinary route-adjacent files where they define route
    contracts.
- Consumers:
  - Public, account, shop, and admin components/loaders that call
    `clientApi`, `serverApi`, or direct `/api/v2` `fetch` paths.
- Test surface:
  - `package.json`
  - `jest.config.js`
  - `__tests__/`

## Commands Run

- `pwd`
- `git status --short`
- `sed -n '1,240p' docs/README.md`
- `sed -n '1,260p' docs/audits/goals.md`
- `sed -n '1,220p' docs/audits/README.md`
- `sed -n '1,260p' docs/workstreams/data-models-and-api.md`
- `sed -n '1,280p' docs/architecture/routes-and-api.md`
- `sed -n '1,260p' docs/audits/results/A-002-api-contracts.md`
- `sed -n '1,220p' docs/audits/results/README.md`
- `sed -n '1,220p' docs/workstreams/README.md`
- `rg --files src/app/api/v2`
- `find src/app/api/v2 -name route.ts -print`
- `rg -n "^export" src/app/api/v2`
- `rg -n "NextResponse|Response\\.json|status:|dbConnect|connect|auth|getServerSession|getToken|require|session|zod|schema|validate" src/app/api/v2 src/lib/api`
- `rg -n "Schema\\.parse|schema\\.parse|request\\.json\\(|await request\\.json\\(|await req\\.json\\(" src/app/api/v2/admin src/app/api/v2/user src/app/api/v2/public`
- `rg -n "return NextResponse\\.json\\(\\{\\s*success: false|return NextResponse\\.json\\(\\s*\\{\\s*success: false|statusCode: 404|statusCode: 500|errorCode: 500" src/app/api/v2`
- `rg -n "dbConnect\\(|from \\\"@/lib/db/mongodb\\\"" src/app/api/v2`
- `rg -n "isAdmin\\(|getUserIdFromSession|getServerSession|Response\\.json" src/app/api/v2`
- `rg -n "addToFavourites|removeFromFavourites|addToWatchlist|removeFromWatchlist|profile\\.update|clientApi\\.user\\.profile\\.update|serverApi\\.user\\.profile\\.update|patchArticle|patchArtwork|patchCollection|patchBlog|deleteComment|updateComment|createComment" src`
- `rg -n "method:\\s*\\\"(POST|PATCH|DELETE)\\\"" src/lib/api/user src/lib/api/admin src/lib/api/public`
- `rg -n "api/v2" src --glob '!src/app/api/v2/**'`
- `rg -n "fetch\\(" src --glob '!src/app/api/v2/**'`
- `find . -maxdepth 3 -type d -name '*test*' -o -name '__tests__'`
- `rg --files -g '*test*' -g '*spec*' -g 'jest.config*' -g 'package.json'`
- `sed -n '1,220p' package.json`
- Static Node inventory commands:
  - route group, method, status, auth, schema, raw JSON, and DB ownership
    summary for all `src/app/api/v2/**/route.ts` files.
  - group-level count summary for routes, methods, MongoDB-backed routes, and
    missing `dbConnect()` ownership.
- Line-numbered `nl -ba` reads for representative and high-risk public, user,
  admin, shop, session, and schema files cited below.
- Note: initial `nl -ba` reads for bracketed dynamic route paths failed because
  zsh interpreted brackets as globs. The same paths were rerun successfully with
  quoted paths.
- Note: one `rg ... src tests` command reported `tests: No such file or
  directory`; `__tests__` was inspected separately.
- No `npm test`, `npm run build`, or `npm run lint` command was run because this
  was a docs-only audit and no runtime code changed.

## Contract Inventory

### Shared API Vocabulary

The codebase has a clear intended response vocabulary:

- `ApiErrorResponse`, `ApiSuccessResponse`, `SingleResult`, `ListResult`, and
  `RouteResponse` live in `src/lib/data/types/apiTypes.ts:3-46`.
- `createFetcher` parses JSON, treats non-OK HTTP status or missing
  `result.success` as failure, and returns `{ success: false, error }` for
  errors (`src/lib/api/core/createFetcher.ts:42-59`).
- Public/user/admin client and server API factories reuse that fetcher across
  most app routes.

Current route behavior only partially matches that vocabulary.

### Route Group Counts

| Group | Route files | Method handlers | MongoDB-backed files | MongoDB-backed files without route-local `dbConnect()` | Admin handlers without `isAdmin()` |
| --- | ---: | ---: | ---: | ---: | ---: |
| Public | 19 | 19 | 18 | 7 | N/A |
| User | 8 | 10 | 8 | 2 file-level gaps, plus `POST /user/comment` lacks its own connection setup | N/A |
| Admin | 25 | 25 | 24 | 24 | 1 |

The admin exception is `src/app/api/v2/admin/sign-cloudinary-params/route.ts`,
which has no `isAdmin()` check and returns raw `Response.json({ signature })`.

### Public Routes

| Route | Methods | Contract notes |
| --- | --- | --- |
| `/api/v2/public/article` | GET | Returns list envelope, but empty and catch branches omit HTTP status options and therefore return HTTP 200 for failures (`src/app/api/v2/public/article/route.ts:46-76`). |
| `/api/v2/public/article/[slug]` | GET | Returns populated article envelope; not-found and catch branches include `statusCode` in the JSON body but no HTTP status option (`src/app/api/v2/public/article/[slug]/route.ts:33-57`). |
| `/api/v2/public/artwork` | GET | Stronger envelope and explicit 500 responses. Pagination metadata is present (`src/app/api/v2/public/artwork/route.ts:146-170`). |
| `/api/v2/public/artwork/[id]` | GET | Stronger single envelope with explicit 404/500 statuses (`src/app/api/v2/public/artwork/[id]/route.ts:19-46`). |
| `/api/v2/public/blog` | GET | Returns list envelope; invalid sort and catch errors omit HTTP status options (`src/app/api/v2/public/blog/route.ts:41-89`). |
| `/api/v2/public/blog/[slug]` | GET | Returns single envelope; not-found and catch errors omit HTTP status options (`src/app/api/v2/public/blog/[slug]/route.ts:30-50`). |
| `/api/v2/public/blog/[slug]/comments` | GET | Returns populated blog/comments envelope; not-found and catch errors omit HTTP status options (`src/app/api/v2/public/blog/[slug]/comments/route.ts:37-58`). |
| `/api/v2/public/collection` | GET | Returns list envelope with metadata and explicit 404/500 options (`src/app/api/v2/public/collection/route.ts:61-95`). |
| `/api/v2/public/collection/[slug]` | GET | No `dbConnect()`, returns raw collection document as `data`, and has a nested/incorrect success type assertion (`src/app/api/v2/public/collection/[slug]/route.ts:1-30`). |
| `/api/v2/public/collection/[slug]/artwork` | GET | No `dbConnect()`, but does transform populated collection data and returns explicit 404/500 (`src/app/api/v2/public/collection/[slug]/artwork/route.ts:11-49`). |
| `/api/v2/public/collection/[slug]/artwork/[id]` | GET | No `dbConnect()`, returns raw populated Mongoose collection, constructs `Types.ObjectId(id)` without ID validation, and returns explicit 404/500 (`src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts:14-51`). |
| `/api/v2/public/enquiry` | POST | No `dbConnect()`, no validation, stores raw body, returns raw enquiry document, and all error branches omit HTTP status options (`src/app/api/v2/public/enquiry/route.ts:9-31`). |
| `/api/v2/public/navigation/articles/[section]` | GET | Has `dbConnect()` and list envelope, but empty and catch errors omit HTTP status options (`src/app/api/v2/public/navigation/articles/[section]/route.ts:25-67`). |
| `/api/v2/public/navigation/collections` | GET | Has `dbConnect()` and list envelope, but empty and catch errors omit HTTP status options (`src/app/api/v2/public/navigation/collections/route.ts:18-63`). |
| `/api/v2/public/navigation/collections/[slug]` | GET | No `dbConnect()`, returns transformed nav item, but not-found and catch errors omit HTTP status options (`src/app/api/v2/public/navigation/collections/[slug]/route.ts:13-41`). |
| `/api/v2/public/navigation/collections/[slug]/artworks` | GET | No `dbConnect()`, includes `// ! did i break this?`, returns a collection-populated contract instead of the navigation fetcher's list type, and errors omit HTTP status options (`src/app/api/v2/public/navigation/collections/[slug]/artworks/route.ts:11-48`; expected fetcher type in `src/lib/api/public/navigation/fetchers.ts:13-46`). |
| `/api/v2/public/search` | GET | Explicit 400/500 statuses, but no `dbConnect()`, ignores the fetcher's `type` param, and computes `page`, `limit`, and `total` without returning metadata (`src/app/api/v2/public/search/route.ts:17-143`). |
| `/api/v2/public/shop/products` | GET | Returns `{ success, data, metadata }` and explicit 500, but metadata is not the shared pagination shape and partial Shopify fetch failures are silently dropped (`src/app/api/v2/public/shop/products/route.ts:103-135`). |
| `/api/v2/public/shop/products/[productId]` | GET | Returns raw `SimpleProduct` and raw `{ error }` bodies instead of the shared envelope (`src/app/api/v2/public/shop/products/[productId]/route.ts:15-40`). |

### User Routes

| Route | Methods | Contract notes |
| --- | --- | --- |
| `/api/v2/user/comment` | GET, POST | GET returns list envelope but unauthenticated, missing-user, and catch errors omit HTTP status options. POST reads `req.json()` twice, does not parse `createCommentSchema`, lacks method-local `dbConnect()`, returns raw created comment, and all error branches omit HTTP status options (`src/app/api/v2/user/comment/route.ts:25-171`; schema exists at `src/lib/data/schemas/commentSchema.ts:12-18`). |
| `/api/v2/user/comment/[commentId]` | PATCH, DELETE | Stronger explicit 401/400/404/403/500 statuses, but error bodies use `message` without `error`, PATCH returns raw populated Mongoose data, and DELETE success omits the `data` field expected by typed success envelopes (`src/app/api/v2/user/comment/[commentId]/route.ts:19-171`). |
| `/api/v2/user/favourite` | GET | Returns list envelope, but unauthenticated, missing-user, and catch errors omit HTTP status options (`src/app/api/v2/user/favourite/route.ts:23-65`). |
| `/api/v2/user/favourite/[artworkId]` | GET | Returns single envelope, but all error branches omit HTTP status options. The client fetcher exposes POST and DELETE for this path even though the route exports only GET (`src/app/api/v2/user/favourite/[artworkId]/route.ts:12-62`; `src/lib/api/user/favorites/fetchers.ts:35-52`). |
| `/api/v2/user/navigation` | GET | Returns single envelope, but auth/missing-user/catch errors omit HTTP status options and `isNextError` is converted to a JSON error instead of being rethrown (`src/app/api/v2/user/navigation/route.ts:21-59`). |
| `/api/v2/user/profile` | GET | Returns raw user document selected without password, not `OwnUserFrontend`, and error branches omit HTTP status options. The fetcher exposes PATCH but the route exports only GET (`src/app/api/v2/user/profile/route.ts:11-46`; `src/lib/api/user/profile/fetchers.ts:8-15`). |
| `/api/v2/user/watchlist` | GET | No `dbConnect()`, returns list envelope, and all error branches omit HTTP status options (`src/app/api/v2/user/watchlist/route.ts:17-63`). |
| `/api/v2/user/watchlist/[artworkId]` | GET | No `dbConnect()`, returns single envelope, and all error branches omit HTTP status options. The client fetcher exposes POST and DELETE for this path even though the route exports only GET (`src/app/api/v2/user/watchlist/[artworkId]/route.ts:13-61`; `src/lib/api/user/watchlist/fetchers.ts:31-48`). |

### Admin Routes

| Route area | Methods | Contract notes |
| --- | --- | --- |
| Article admin | POST create, GET list, GET by id, PATCH, DELETE | All handlers check `isAdmin()`. None call `dbConnect()`. Create uses `createArticleSchema.parse` but validation errors become 500s; create/update return raw Mongoose documents; reads return transformed data; delete returns `data: null` (`src/app/api/v2/admin/article/create/route.ts:13-55`, `src/app/api/v2/admin/article/update/[id]/route.ts:24-61`). |
| Artwork admin | POST create, GET list, GET by id, PATCH, DELETE | All handlers check `isAdmin()`. None call `dbConnect()`. Create uses `createArtworkSchema.parse` but validation errors become 500s; update accepts raw JSON `$set`; create/update return raw Mongoose documents; reads return transformed frontend artwork (`src/app/api/v2/admin/artwork/create/route.ts:24-60`, `src/app/api/v2/admin/artwork/update/[id]/route.ts:24-56`). |
| Blog admin | POST create, GET list, GET by id, PATCH, DELETE | All handlers check `isAdmin()`. None call `dbConnect()`. Create/update parse schemas but validation errors become 500s; create/update return raw Mongoose documents; reads transform populated data; update has explicit 400/404/409 branches (`src/app/api/v2/admin/blog/create/route.ts:25-52`, `src/app/api/v2/admin/blog/update/[id]/route.ts:28-101`). |
| Collection admin | POST create, GET list, GET by id, PATCH, DELETE | All handlers check `isAdmin()`. None call `dbConnect()`. Create and update accept raw JSON without schema parsing; create returns 201 while other create routes return 200; create/update return raw Mongoose documents; reads transform populated data (`src/app/api/v2/admin/collection/create/route.ts:26-53`, `src/app/api/v2/admin/collection/update/[id]/route.ts:24-67`). |
| Comment admin | GET list, DELETE | Both handlers check `isAdmin()` and return explicit statuses, but no `dbConnect()`. The admin read fetcher exposes `comment(id)` at `/api/v2/admin/comment/read/[id]`, but no matching route file exists (`src/lib/api/admin/read/fetchers.ts:108-113`). |
| User admin | GET list, DELETE | Both handlers check `isAdmin()` and return explicit statuses, but no `dbConnect()`. The admin read fetcher exposes `user(id)` at `/api/v2/admin/user/read/[id]`, but no matching route file exists (`src/lib/api/admin/read/fetchers.ts:102-106`). |
| Cloudinary signing | POST | Lives under `/api/v2/admin`, but has no `isAdmin()` check, no request validation, no shared envelope, and returns raw `Response.json({ signature })` (`src/app/api/v2/admin/sign-cloudinary-params/route.ts:14-23`). |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | API HTTP status codes are inconsistent. Many public and user handlers put `statusCode` or `errorCode` inside JSON bodies but omit the `NextResponse.json` status option, so failures are emitted as HTTP 200. | Examples include public article list (`src/app/api/v2/public/article/route.ts:46-76`), public article detail (`src/app/api/v2/public/article/[slug]/route.ts:33-57`), public blog routes (`src/app/api/v2/public/blog/route.ts:41-89`, `src/app/api/v2/public/blog/[slug]/route.ts:30-50`), public navigation (`src/app/api/v2/public/navigation/collections/route.ts:30-63`), user favourites (`src/app/api/v2/user/favourite/route.ts:23-65`), user profile (`src/app/api/v2/user/profile/route.ts:18-46`), and user comments (`src/app/api/v2/user/comment/route.ts:33-171`). | Add shared response helpers for success, validation, unauthorized, forbidden, not-found, conflict, and server errors. Replace body-only `statusCode` fields with real HTTP statuses. Add route-handler tests for representative public, user, and admin routes. |
| High | Route handlers and fetchers disagree about several available endpoints and methods. | User fetchers expose POST/DELETE for favourites and watchlist, but the dynamic favourite/watchlist routes export only GET (`src/lib/api/user/favorites/fetchers.ts:35-52`, `src/app/api/v2/user/favourite/[artworkId]/route.ts:12-15`; `src/lib/api/user/watchlist/fetchers.ts:31-48`, `src/app/api/v2/user/watchlist/[artworkId]/route.ts:13-16`). Profile fetcher exposes PATCH but `/api/v2/user/profile` exports only GET (`src/lib/api/user/profile/fetchers.ts:8-15`, `src/app/api/v2/user/profile/route.ts:11-13`). Admin read fetchers expose `user(id)` and `comment(id)`, but no `admin/user/read/[id]` or `admin/comment/read/[id]` route files exist (`src/lib/api/admin/read/fetchers.ts:102-113`). | Generate or maintain a route contract inventory that checks fetcher paths/methods against `src/app/api/v2`. Either implement the missing handlers or remove the unsupported fetcher methods before components depend on them. |
| High | MongoDB connection ownership is inconsistent. Static inventory found 24 admin MongoDB-backed route files without `dbConnect()`, plus seven public route files and two user route files with the same gap. `POST /api/v2/user/comment` also lacks method-local connection setup even though its file has `dbConnect()` in GET. | Admin examples: `src/app/api/v2/admin/article/create/route.ts:1-40`, `src/app/api/v2/admin/artwork/read/route.ts:1-49`, and `src/app/api/v2/admin/blog/delete/[id]/route.ts:1-80` touch models or transactions without `dbConnect()`. Public examples: search (`src/app/api/v2/public/search/route.ts:1-81`), collection detail (`src/app/api/v2/public/collection/[slug]/route.ts:1-14`), and collection navigation item (`src/app/api/v2/public/navigation/collections/[slug]/route.ts:1-19`). User examples: watchlist list/detail (`src/app/api/v2/user/watchlist/route.ts:17-32`, `src/app/api/v2/user/watchlist/[artworkId]/route.ts:13-31`). | Add a route wrapper or explicit `await dbConnect()` to every MongoDB-backed handler before model/session access, including auth helpers that query users. Add an automated check that fails when a route imports or uses models without the DB wrapper. |
| High | Admin route-group conventions are broken by the Cloudinary signing endpoint. | The route is under `/api/v2/admin`, but has no `isAdmin()` check, no shared envelope, and no validation around `paramsToSign`; it directly signs and returns `{ signature }` (`src/app/api/v2/admin/sign-cloudinary-params/route.ts:14-23`). `UploadButton` points to this admin route (`src/components/elements/buttons/UploadButton.tsx:116`). | Move this into the standard admin API contract: require admin authorization, validate `paramsToSign`, return `{ success, data: { signature } }`, and add unauthorized/invalid-body tests. Coordinate with A-004/A-009 because this is both contract and security/asset scope. |
| High | Create/update validation behavior is uneven and often maps validation failures to HTTP 500. | Admin article/artwork/blog create routes call Zod `.parse(...)` inside a broad catch that returns 500 (`src/app/api/v2/admin/article/create/route.ts:25-55`, `src/app/api/v2/admin/artwork/create/route.ts:24-60`, `src/app/api/v2/admin/blog/create/route.ts:25-52`). Blog update parses `apiUpdateBlogSchema` but also catches parse failures as 500 (`src/app/api/v2/admin/blog/update/[id]/route.ts:49-101`). Collection create/update and article/artwork update accept raw JSON without schema parsing (`src/app/api/v2/admin/collection/create/route.ts:26-43`, `src/app/api/v2/admin/collection/update/[id]/route.ts:24-57`, `src/app/api/v2/admin/article/update/[id]/route.ts:26-35`, `src/app/api/v2/admin/artwork/update/[id]/route.ts:24-30`). | Standardize validation with `safeParse` or a shared parser that returns HTTP 400 and a predictable validation error shape. Apply it to public enquiry, user comments, and admin create/update routes. |
| High | Several API routes return raw Mongoose documents where fetcher types expect transformed frontend/admin data. | Public collection detail returns `collection` directly (`src/app/api/v2/public/collection/[slug]/route.ts:27-30`) and collection artwork detail returns raw populated collection (`src/app/api/v2/public/collection/[slug]/artwork/[id]/route.ts:39-42`). Public enquiry returns raw `enquiry` (`src/app/api/v2/public/enquiry/route.ts:20-24`). User profile returns raw `user` (`src/app/api/v2/user/profile/route.ts:25-37`). User comment create/update returns raw comment documents (`src/app/api/v2/user/comment/route.ts:126-158`, `src/app/api/v2/user/comment/[commentId]/route.ts:63-72`). Admin create/update routes return raw documents for article/artwork/blog/collection. | Require public/user/admin APIs to return transformed frontend/admin DTOs unless an endpoint is explicitly documented as raw. Add tests around transform output for high-use routes before changing consumers. |
| Medium | Empty list semantics are inconsistent. Some list routes return 404 for an empty collection, while others return `success: true` with an empty array. | Public article returns an error when `articles.length === 0` without HTTP status (`src/app/api/v2/public/article/route.ts:46-50`). Admin article/artwork/blog/collection/comment/user list routes return 404 for empty lists. Public artwork and blog list routes return successful arrays with metadata (`src/app/api/v2/public/artwork/route.ts:146-155`, `src/app/api/v2/public/blog/route.ts:74-78`). | Choose a list contract. For browse/feed endpoints, prefer `success: true`, `data: []`, and metadata. Reserve 404 for missing singleton resources. |
| Medium | Public search parameters and metadata are under-specified. | The search fetcher sends `q`, optional `type`, `page`, and `limit` (`src/lib/api/public/search/fetchers.ts:9-15`), but the route ignores `type`, searches all models, computes `total`, and returns no pagination metadata (`src/app/api/v2/public/search/route.ts:17-135`). | Define the search contract: whether `type` is supported, how pagination applies across combined result sets, and what metadata is returned. Add tests for missing query, type filtering, pagination, and empty results. |
| Medium | Public shop API envelopes are inconsistent and product ID validation is absent. | Listing route wraps products in `{ success, data, metadata }` (`src/app/api/v2/public/shop/products/route.ts:128-135`), while single product returns raw product/raw errors (`src/app/api/v2/public/shop/products/[productId]/route.ts:15-40`). The single route accepts any path segment and blindly builds a Shopify GID (`src/app/api/v2/public/shop/products/[productId]/route.ts:22-26`). | Standardize the single-product route envelope and validate/normalize numeric Shopify IDs before calling Shopify. This overlaps with A-001 and the Shopify workstream. |
| Medium | Route grouping uses action-named admin paths instead of resource-oriented methods, and this convention is undocumented beyond a high-level group list. | Admin APIs are organized as `/admin/{entity}/create`, `/read`, `/update/[id]`, and `/delete/[id]`; fetchers mirror this in `src/lib/api/admin/create/fetchers.ts`, `src/lib/api/admin/read/fetchers.ts`, `src/lib/api/admin/update/fetchers.ts`, and `src/lib/api/admin/delete/fetchers.ts`. `docs/architecture/routes-and-api.md` only says admin APIs include CRUD operations, not whether action segments are canonical. | Either document the action-segment convention as canonical for this app or migrate toward resource-oriented routes during API hardening. Do not mix both without an ADR and compatibility plan. |
| Low | Debug logging and production response details are noisy and inconsistent across routes. | Examples include `createFetcher` logging endpoint/options/stack for every request (`src/lib/api/core/createFetcher.ts:27-55`), public article route DB logs (`src/app/api/v2/public/article/route.ts:16-22`), public collection route error logs for normal request receipt (`src/app/api/v2/public/collection/route.ts:15`), and shop listing route count/query logs (`src/app/api/v2/public/shop/products/route.ts:41-126`). | Gate diagnostic logs behind a development/debug flag and define what error detail is safe to expose in public/user/admin API responses. |

## Targeted Tests Recommended

- Route contract tests for shared success/error helpers once introduced.
- Static contract test that compares `src/lib/api/**/fetchers.ts` methods and
  paths against exported methods under `src/app/api/v2`.
- Static DB ownership test that fails when a MongoDB-backed route lacks
  `dbConnect()` or a shared route wrapper.
- Public route tests for:
  - artwork list/detail success, not found, invalid ObjectId, and transform
    failure.
  - collection detail/artwork routes after DB connection and transform cleanup.
  - article/blog/navigation empty-list behavior once semantics are chosen.
  - search missing query, type filtering, pagination metadata, and DB errors.
  - shop products listing/single envelope, product ID validation, not found, and
    Shopify upstream failure.
- User route tests for:
  - unauthenticated responses returning real 401s.
  - profile transform shape.
  - favourite/watchlist GET not-found and not-owned semantics.
  - comment create/update/delete validation, ownership, and response envelope.
- Admin route tests for:
  - unauthorized returns 401 across every route.
  - create/update validation returns 400, not 500.
  - create/update responses return transformed admin DTOs.
  - missing single user/comment read endpoints are implemented or removed from
    fetchers.
  - Cloudinary signing requires admin auth and validates request shape.

## Findings Register Updates

- Not updated by this audit because audit workflow says result authors update
  their assigned result file by default and shared trackers belong to the
  orchestrator or reconciliation agent.
- Candidate rows for reconciliation:
  - High, Data/API: API handlers return body-level error codes with HTTP 200
    across public and user routes.
  - High, Data/API: API fetchers expose methods and single-resource admin
    endpoints that do not exist in `src/app/api/v2`.
  - High, Data/API: MongoDB-backed API handlers lack consistent route-local
    `dbConnect()` ownership, especially admin routes.
  - High, Admin/Security/API: `/api/v2/admin/sign-cloudinary-params` bypasses
    admin auth and the shared API envelope.
  - High, Data/API: Create/update validation is inconsistent and maps Zod
    validation failures to 500.
  - High, Data/API: Public, user, and admin routes return raw Mongoose
    documents where typed fetchers expect frontend/admin DTOs.
  - Medium, Data/API: List empty-state semantics vary between 404 and
    successful empty arrays.
  - Medium, Search/API: Public search ignores the `type` param and omits
    pagination metadata.
  - Medium, Shopify/API: Public shop product single route uses raw responses and
    lacks product ID validation.

## Risks Updated

- None. This audit was scoped to the A-002 result file.
- Candidate escalation for reconciliation: add or update a production-readiness
  risk for inconsistent API status/envelope behavior because it affects public
  SSR, account flows, admin CRUD, and future external integrations.

## Workstream Updates

- None. This audit was scoped to the result file. The Data Models and API
  workstream already includes backlog items for API response shape inventory,
  status-code consistency, DB connection ownership, validation policy, response
  transforms, and pagination/filter contracts.

## Completion Audit

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read required docs. | Scope inspected lists the A-002 goal, Data Models and API workstream, and Routes and API architecture. | Complete |
| Inventory API routes. | Contract inventory covers 52 route files and 54 method handlers across public, user, and admin groups. | Complete |
| Inspect response shapes. | Findings cover shared envelopes, raw product/raw error bodies, raw Mongoose documents, and missing `data` fields. | Complete |
| Inspect status codes. | Findings identify body-level status codes emitted with HTTP 200 and routes with explicit 400/401/403/404/409/500 branches. | Complete |
| Inspect validation behavior. | Findings cover Zod parse-to-500 behavior, raw JSON admin updates, public enquiry, and user comment validation gaps. | Complete |
| Inspect route-group conventions. | Contract inventory and findings cover public/user/admin groups, admin action segments, and the Cloudinary admin exception. | Complete |
| Inspect fetcher/API consumer contracts. | Findings cover unsupported fetcher methods and missing admin single-resource routes. | Complete |
| Keep edits scoped. | Only this result file was edited. Shared findings, risks, goals, result index, and workstream files were not modified. | Complete |
| Record verification. | Commands run are listed above. Runtime verification was not run because no runtime code changed. | Complete |

## Next Action

Reconcile the candidate findings into the findings register, then start the API
hardening work with a narrow shared response-helper and route-test proof on one
public route, one user route, and one admin route. After the helper contract is
accepted, apply it across `/api/v2` with a static fetcher-vs-route inventory
check and a DB-ownership check.
