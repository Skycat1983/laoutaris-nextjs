# T-317 Next API Route Builder Family Scope

Status: Completed
Date: 2026-05-27

## Assignment

Scope the next API route-builder family after the completed admin delete and
admin read client fetcher path-builder slices.

Runtime source, tests, API handlers, route logging, request-context route IDs,
parity fixtures, shared trackers, smoke scripts, and Shopify behavior were not
changed. This result owns only the next implementation recommendation and
candidate follow-up scope.

## Source Discovery Commands

- `sed -n '1,280p' docs/audits/results/T-309-api-route-builder-ownership-scope.md`
- `sed -n '1,260p' docs/tasks/T-312-add-admin-delete-api-path-builders.md`
- `sed -n '1,260p' docs/tasks/T-314-add-admin-read-api-path-builders.md`
- `sed -n '1,280p' docs/architecture/routes-and-api.md`
- `sed -n '1,320p' __tests__/unit/api/routeFetcherParity.test.ts`
- `sed -n '321,700p' __tests__/unit/api/routeFetcherParity.test.ts`
- `sed -n '1,260p' src/lib/api/admin/create/fetchers.ts`
- `sed -n '1,260p' src/lib/api/admin/update/fetchers.ts`
- `sed -n '1,220p' src/lib/api/public/navigation/fetchers.ts`
- `sed -n '1,260p' src/lib/api/public/artwork/fetchers.ts`
- `sed -n '1,220p' src/lib/api/public/article/fetchers.ts`
- `sed -n '1,220p' src/lib/api/public/blog/fetchers.ts`
- `sed -n '1,260p' src/lib/api/public/collection/fetchers.ts`
- `sed -n '1,260p' src/lib/api/user/comments/fetchers.ts`
- `sed -n '1,220p' src/lib/api/user/favorites/fetchers.ts`
- `sed -n '1,220p' src/lib/api/user/watchlist/fetchers.ts`
- `sed -n '1,180p' src/lib/api/user/navigation/fetchers.ts`
- `sed -n '1,180p' src/lib/api/user/profile/fetchers.ts`
- `sed -n '1,240p' src/lib/api/public/shop/fetchers.ts`
- `sed -n '1,180p' src/lib/api/public/search/fetchers.ts`
- `sed -n '1,160p' src/lib/api/public/enquiry/fetchers.ts`
- `find src/app/api/v2 -name route.ts | sort`
- `rg -n "createPostFetchers|createUpdateFetchers|/api/v2/admin/.+/(create|update)|admin.*Fetchers" __tests__ src -g '*.test.ts' -g '*.test.tsx'`
- `rg -n "createRequestContext\\(|route: \"/api/v2/admin/.+/(create|update)|route: \"/api/v2/public/navigation|route: \"/api/v2/user" src/app/api/v2 src/lib/api --glob '!**/*.json'`

## Ownership Boundaries

The T-309 boundaries still apply after T-312 and T-314:

- Client fetcher path builders produce concrete external `/api/v2` URLs for
  runtime fetch calls. They must encode dynamic values and preserve query-string
  behavior already owned by the fetcher.
- Physical route files under `src/app/api/v2/**/route.ts` remain the Next.js
  routing source of truth. Route files should not import client fetcher path
  builders.
- Request-context route IDs passed to `createRequestContext()` remain stable
  observability templates, including bracket placeholders such as
  `/api/v2/admin/article/update/[id]`. They should not be replaced with
  concrete fetch URLs.
- The route/fetcher parity test remains an explicit inventory, not a generic
  route-builder source. It should continue to prove that inventoried fetcher
  operations are backed by physical route methods.

## Completed Prior Slices

### Admin Delete

T-312 added `src/lib/api/admin/delete/paths.ts`, moved admin delete fetchers to
shared destructive and preview path builders, and extended
`__tests__/unit/api/adminDeleteFetchers.test.ts` for supported resources and
encoded IDs.

The delete slice covered six resources:

- `article`
- `artwork`
- `blog`
- `collection`
- `comment`
- `user`

### Admin Read

T-314 added `src/lib/api/admin/read/paths.ts`, moved admin read fetchers to
shared list and detail path builders, and extended
`__tests__/unit/api/adminReadFetchers.test.ts` for supported resources, encoded
detail IDs, and list query-string behavior.

The read slice covered six resources:

- `article`
- `artwork`
- `blog`
- `collection`
- `comment`
- `user`

## Candidate Families

### Candidate A: Admin Update

Files and coverage:

- Fetcher source: `src/lib/api/admin/update/fetchers.ts`
- Physical route files: four dynamic route files:
  - `src/app/api/v2/admin/article/update/[id]/route.ts`
  - `src/app/api/v2/admin/artwork/update/[id]/route.ts`
  - `src/app/api/v2/admin/blog/update/[id]/route.ts`
  - `src/app/api/v2/admin/collection/update/[id]/route.ts`
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts`
  inventories all four update operations.
- Route behavior coverage: `__tests__/unit/api/adminArticleRoute.test.ts`,
  `__tests__/unit/api/adminArtworkRoute.test.ts`,
  `__tests__/unit/api/adminBlogRoute.test.ts`, and
  `__tests__/unit/api/adminCollectionRoute.test.ts` cover the matching update
  handlers alongside create handlers.
- Route ID consumers: update handlers call `createRequestContext()` with
  template route IDs such as `/api/v2/admin/article/update/[id]`.

Why it is the best next slice:

- It follows the same proven pattern as admin delete and admin read: dynamic
  admin resource paths, explicit supported resource list, and existing
  `encodeURIComponent()` behavior inside fetchers.
- The family is compact: four update resources, all using `PATCH` and a
  dynamic `[id]` segment.
- Centralization removes duplicated local `encodedId` construction without
  touching body payloads, validation, DB writes, guards, or route contracts.
- It has route/fetcher parity coverage already, but lacks focused fetcher/path
  coverage. A future implementation can add a narrow
  `__tests__/unit/api/adminUpdateFetchers.test.ts` suite without broadening
  runtime behavior.

Risk:

- Admin update routes mutate archive content. The implementation must
  centralize only client fetcher URL construction. It must not change schemas,
  body serialization, status codes, validation order, DB ownership, transform
  behavior, route logging, or admin UI behavior.

### Candidate B: Admin Create

Files and coverage:

- Fetcher source: `src/lib/api/admin/create/fetchers.ts`
- Physical route files: four static route files:
  - `src/app/api/v2/admin/article/create/route.ts`
  - `src/app/api/v2/admin/artwork/create/route.ts`
  - `src/app/api/v2/admin/blog/create/route.ts`
  - `src/app/api/v2/admin/collection/create/route.ts`
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts`
  inventories all four create operations.
- Route behavior coverage: the same four admin route test files cover create
  handlers.
- Route ID consumers: create handlers call `createRequestContext()` with
  static route IDs such as `/api/v2/admin/article/create`.

Why it is deferred:

- Create paths are static and do not currently duplicate dynamic
  `encodeURIComponent()` logic, so the path-builder payoff is smaller than
  admin update.
- It is still a good follow-up after update, likely as a small static
  `adminCreatePath(resource)` builder, but it does not need to be paired with
  update in the next slice.

### Candidate C: Public Navigation

Files and coverage:

- Fetcher source: `src/lib/api/public/navigation/fetchers.ts`
- Physical route files: four public navigation route files under
  `src/app/api/v2/public/navigation`.
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts`
  inventories all four navigation fetcher operations.
- Route behavior coverage: `__tests__/unit/api/publicNavigationRoutes.test.ts`.
- Route ID consumers: public navigation route handlers call
  `createRequestContext()` with template IDs.

Why it is deferred:

- Public navigation has strong route coverage and lower mutation risk, but it
  also intersects with the existing route-loader/service-adapter history. It is
  better scoped after the admin write fetcher families are consistent.

### Candidate D: Protected User Paths

Files and coverage:

- Fetcher sources:
  - `src/lib/api/user/comments/fetchers.ts`
  - `src/lib/api/user/favorites/fetchers.ts`
  - `src/lib/api/user/watchlist/fetchers.ts`
  - `src/lib/api/user/navigation/fetchers.ts`
  - `src/lib/api/user/profile/fetchers.ts`
- Physical route files: comment, favourite, watchlist, navigation, and profile
  routes under `src/app/api/v2/user`.
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts`
  inventories user fetcher operations.
- Route behavior coverage includes `userCommentRoute.test.ts`,
  `userProfileRoute.test.ts`, and `userSavedRoutes.test.ts`.

Why it is deferred:

- The protected user family mixes reads, creates, updates, deletes, list
  routes, and item routes across several feature areas. It should be split into
  smaller future scopes, for example saved-artwork paths before comment
  mutation paths.

### Candidate E: Public Content And Shop Paths

Files and coverage:

- Fetcher sources include public article, artwork, blog, collection, search,
  enquiry, and shop fetchers.
- Physical route files span list/detail content, collection artwork, search,
  enquiry, and shop product routes.
- Parity coverage inventories these public fetcher operations.

Why it is deferred:

- The public content surface is broader and mixes static paths, dynamic slugs,
  query-string construction, form submissions, and Shopify product ID handling.
  It should not be the next route-builder family until a smaller public slice
  is selected.

## Decision

The next implementation should centralize client fetcher paths only for the
admin update route family.

Allowed in the next slice:

- Add a client-safe value-only module for admin update API path builders, for
  example `src/lib/api/admin/update/paths.ts`.
- Export a concrete external path builder, for example
  `adminUpdatePath(resource, id)`.
- Keep the four supported update resources explicit:
  `article`, `artwork`, `blog`, and `collection`.
- Update `src/lib/api/admin/update/fetchers.ts` to call the shared builder
  while preserving current `PATCH` options and JSON body serialization.
- Add focused unit coverage for supported resources, encoded IDs, and preserved
  fetch options, likely in a new
  `__tests__/unit/api/adminUpdateFetchers.test.ts`.

Not allowed in the next slice:

- Do not edit route handlers, guard helpers, DB work, validation schemas, DTO
  transforms, response contracts, status codes, route logging behavior,
  request-context route IDs, or admin UI behavior.
- Do not make physical route files import client fetcher builders.
- Do not change `createRequestContext()` route template IDs such as
  `/api/v2/admin/article/update/[id]`.
- Do not centralize admin create, read, delete, public, user, auth,
  middleware, smoke, sitemap, Shopify, or route-ID paths in the same slice.
- Do not loosen the explicit route/fetcher parity inventory.

## Future Task Scope

Suggested task title: `T-318 Add Admin Update API Path Builders`.

Owned files:

- `src/lib/api/admin/update/paths.ts`
- `src/lib/api/admin/update/fetchers.ts`
- `__tests__/unit/api/adminUpdateFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that preserves the explicit operation inventory

Acceptance criteria:

- Admin update fetchers call a shared client-safe path-builder module for
  dynamic update URLs.
- Generated update paths preserve current `encodeURIComponent()` behavior.
- The four supported update resources remain explicit.
- Existing `PATCH` method and `JSON.stringify(data)` request bodies are
  unchanged.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminUpdateFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
npm run lint
git diff --check
```

Run the four admin create/update route suites only if the implementation
touches anything beyond fetcher URL construction:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminArticleRoute.test.ts __tests__/unit/api/adminArtworkRoute.test.ts __tests__/unit/api/adminBlogRoute.test.ts __tests__/unit/api/adminCollectionRoute.test.ts
```

## Candidate Shared Tracker Updates

Do not apply these from this scoped result unless assigned as reconciliation:

- Architecture refactor backlog: add admin update as the next staged API
  route-builder implementation after admin delete and read.
- Data/API workstream: note that admin write path-builder centralization should
  proceed one family at a time, starting with update and deferring create.
- Testing workstream: add the future admin update fetcher path coverage as the
  next focused route-builder test slice.
- Routes/API architecture doc: after implementation, document that admin
  delete, read, and update client fetcher path builders remain separate from
  physical route files and request-context route IDs.

## Verification

- `git diff --check` passed.
