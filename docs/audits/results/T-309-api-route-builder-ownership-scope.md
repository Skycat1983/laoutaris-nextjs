# T-309 API Route Builder Ownership Scope

Status: Completed
Date: 2026-05-27

## Assignment

Scope API route builder and route-ID ownership before runtime `/api/v2`
centralization.

Runtime source, tests, route handlers, fetchers, parity fixtures, shared
trackers, and smoke scripts were not changed. This result owns only the first
implementation recommendation and candidate follow-up scope.

## Source Discovery Commands

- `sed -n '1,260p' docs/audits/results/T-302-route-builder-centralization-scope.md`
- `sed -n '1,260p' docs/architecture/routes-and-api.md`
- `sed -n '1,620p' __tests__/unit/api/routeFetcherParity.test.ts`
- `sed -n '1,340p' __tests__/unit/api/protectedApiGuardInventory.test.ts`
- `sed -n '1,220p' __tests__/unit/api/adminDeleteFetchers.test.ts`
- `sed -n '1,280p' __tests__/unit/api/adminReadFetchers.test.ts`
- `sed -n '1,260p' src/lib/api/admin/delete/fetchers.ts`
- `sed -n '1,320p' src/lib/api/admin/read/fetchers.ts`
- `sed -n '1,180p' src/lib/api/public/navigation/fetchers.ts`
- `find src/app/api/v2/admin -path '*delete*' -name route.ts | sort`
- `find src/app/api/v2/admin -path '*read*' -name route.ts | sort`
- `find src/app/api/v2/public/navigation -name route.ts | sort`
- `rg -n "adminDeletePreviewResponse|createRequestContext|route: \"/api/v2/admin/.+delete" src/app/api/v2/admin src/lib/api --glob '!**/*.json'`

## Ownership Boundaries

API route centralization has four separate concerns that should not be collapsed
into one generic route helper.

### External API Paths

External API paths are the HTTP contract exposed under `/api/v2`. They are what
clients fetch, middleware protects, smoke/auth checks probe, and route parity
tests compare to physical files. Examples:

- `/api/v2/admin/article/delete/article%20id`
- `/api/v2/admin/article/delete/article%20id/preview`
- `/api/v2/admin/artwork/read?page=2&limit=50`
- `/api/v2/public/navigation/collections/paintings`

These builders must encode dynamic values and own query-string construction
where the fetcher already owns it today. They should not emit bracket tokens
such as `[id]` for runtime requests.

### Client Fetcher Builders

Client fetcher builders are the first useful centralization target. They are
called by `src/lib/api/**/fetchers.ts` and must remain client-safe: string
builders only, no route handlers, models, auth, DB helpers, request context, or
server-only imports.

Fetcher builders may produce concrete external paths with encoded values and
optional query strings, but they should not become the canonical list of
physical route files or request-context route IDs.

### Physical Route Files

Physical route files live under `src/app/api/v2/**/route.ts`. Their filesystem
segments are the source of truth for Next.js routing. The current
`__tests__/unit/api/routeFetcherParity.test.ts` derives route paths from those
files and compares them to a manually inventoried fetcher operation list.

The first implementation slice should not make physical route files import
client fetcher builders. That would point server route ownership at a client
fetching concern and could hide route/fetcher drift that parity coverage is
meant to expose.

### Request-Context Route IDs

Route IDs passed to `createRequestContext()` and
`adminDeletePreviewResponse()` are observability identifiers. They deliberately
mirror route templates, including bracket placeholders such as:

- `/api/v2/admin/article/delete/[id]`
- `/api/v2/admin/article/delete/[id]/preview`
- `/api/v2/admin/artwork/read/[id]`
- `/api/v2/public/navigation/articles/[section]`

They should remain stable template IDs for logs and request IDs. They should not
be reused as runtime fetch URLs, and client fetch URL builders should not be
used to generate these IDs.

## Candidate Families

### Candidate A: Admin Delete

Files and coverage:

- Fetcher source: `src/lib/api/admin/delete/fetchers.ts`
- Fetcher tests: `__tests__/unit/api/adminDeleteFetchers.test.ts`
- Physical route files: 12 files across six resources, each with destructive
  delete and preview routes.
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts` inventories
  all six destructive delete operations and all six preview operations.
- Guard/behavior coverage: `__tests__/unit/api/adminDeleteRouteGuard.test.ts`,
  `__tests__/unit/api/adminDeletePreviewRoute.test.ts`, and
  `__tests__/unit/api/adminDeleteAuditEvent.test.ts`
- Route ID consumers: destructive handlers call `createRequestContext()`;
  preview route files pass route templates into `adminDeletePreviewResponse()`.

Why it is a good first slice:

- The fetcher already has small local `deletePath()` and
  `deletePreviewPath()` helpers, so the implementation can extract an existing
  pattern instead of inventing a broad API router.
- The operation set is compact and regular:
  `{article, artwork, blog, collection, comment, user}` plus optional
  `/preview`.
- Existing tests prove encoded IDs, destructive `DELETE` options, preview
  fetches, physical route parity, admin guard ordering, preview behavior, and
  audit behavior.

Risk:

- Delete routes are high-impact operations. The first slice must centralize only
  client fetcher path builders and focused template constants if needed for
  tests. It should not change guard order, evidence payloads, preview response
  behavior, cascade behavior, transactions, audit events, or route handlers.

### Candidate B: Admin Read

Files and coverage:

- Fetcher source: `src/lib/api/admin/read/fetchers.ts`
- Fetcher tests: `__tests__/unit/api/adminReadFetchers.test.ts`
- Physical route files: 12 files across six resources, each with list and
  detail routes.
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts` inventories
  all six list operations and all six detail operations.
- Guard/behavior coverage: `__tests__/unit/api/adminReadRouteGuard.test.ts`
  and `__tests__/unit/api/adminUserCommentReadRoute.test.ts`
- Route ID consumers: read handlers pass list/detail template IDs into
  `createRequestContext()`.

Why it is not first:

- The list fetchers also own page, limit, search, filter, and query-string
  details. That makes it a useful second slice after the project proves a small
  path-builder module with the simpler delete family.

### Candidate C: Public Navigation

Files and coverage:

- Fetcher source: `src/lib/api/public/navigation/fetchers.ts`
- Physical route files: four route files under
  `src/app/api/v2/public/navigation`.
- Parity coverage: `__tests__/unit/api/routeFetcherParity.test.ts`
  inventories all four fetcher operations.
- Route/loader coverage: `__tests__/unit/api/publicNavigationRoutes.test.ts`
  covers the route contracts that share server-side navigation services.

Why it is deferred:

- Public navigation has lower destructive risk, but it is tied to route-loader
  history and App Router service-adapter work. It also has fewer local fetcher
  path helper patterns than admin delete.

## Decision

The first implementation should centralize client fetcher paths only for the
admin delete route family.

Allowed in the first slice:

- Add a client-safe value-only module for admin delete API path builders, for
  example under `src/lib/api/admin/delete/paths.ts`.
- Export concrete external path builders:
  `adminDeletePath(resource, id)` and
  `adminDeletePreviewPath(resource, id)`.
- Type the supported delete resources from one local readonly list if that
  keeps the existing six-resource contract explicit.
- Update `src/lib/api/admin/delete/fetchers.ts` to use those builders.
- Add focused unit coverage for encoded IDs and supported preview/destructive
  paths, or extend `__tests__/unit/api/adminDeleteFetchers.test.ts` without
  weakening its existing fetcher assertions.

Not allowed in the first slice:

- Do not edit route handlers, preview helper behavior, guard helpers, DB work,
  transactions, cascade logic, evidence payload handling, or audit events.
- Do not replace `createRequestContext()` route IDs with concrete fetch URLs.
- Do not make route files import client fetcher builders.
- Do not change `__tests__/unit/api/routeFetcherParity.test.ts` unless the
  implementation adds a new static assertion that keeps the explicit operation
  inventory meaningful.
- Do not centralize admin read, create, update, public, user, auth, middleware,
  smoke, or sitemap paths in the same slice.

## Future Task Scope

Suggested task title: `T-310 Add Admin Delete API Path Builders`.

Owned files:

- `src/lib/api/admin/delete/paths.ts` or equivalent client-safe local module
- `src/lib/api/admin/delete/fetchers.ts`
- `__tests__/unit/api/adminDeleteFetchers.test.ts`
- Optional: `__tests__/unit/api/routeFetcherParity.test.ts` only for a static
  source-hygiene assertion that does not remove the explicit operation
  inventory

Acceptance criteria:

- Admin delete fetchers call a shared path-builder module for destructive and
  preview URLs.
- Generated paths preserve current `encodeURIComponent()` behavior.
- The six supported delete resources remain explicit.
- Existing fetcher call expectations continue to pass.
- Route/fetcher parity stays explicit and green.
- Runtime route handlers and request-context route IDs are unchanged.

Verification:

```bash
npm test -- --runTestsByPath __tests__/unit/api/adminDeleteFetchers.test.ts __tests__/unit/api/routeFetcherParity.test.ts
git diff --check
```

## Candidate Shared Tracker Updates

Do not apply these from this scoped result unless assigned as reconciliation:

- Architecture refactor backlog: replace the broad API route-builder backlog
  item with a staged admin-delete path-builder implementation task followed by
  admin-read query/path builders.
- Data/API workstream: add this result as the source of truth for first API
  route-builder implementation scope.
- Testing workstream: note that future API route-builder slices should keep
  route/fetcher parity explicit and add focused path-builder unit coverage.
- Routes/API architecture doc: after implementation, document that client API
  path builders, physical route files, and request-context route IDs are
  separate ownership boundaries.

## Verification

- `git diff --check` passed.
