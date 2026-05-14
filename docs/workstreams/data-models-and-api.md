# Data Models And API Workstream

Status: Active

Goal: make MongoDB schemas, Mongoose models, transforms, and API responses
consistent enough for production refactoring and Shopify integration.

## Depends On

- [System overview](../architecture/system-overview.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Database runbook](../runbooks/database.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-016 Forms, validation, and user input](../audits/goals.md#a-016-forms-validation-and-user-input)

## Blocks

- Reliable public archive browsing.
- Admin CRUD hardening.
- Commerce link integrity.
- Broad test coverage.

## Related Code Areas

- `src/lib/data/schemas/`
- `src/lib/data/models/`
- `src/lib/data/types/`
- `src/lib/transforms/`
- `src/lib/api/`
- `src/app/api/v2/`

## Current Facts

- The API is split into public, user, and admin route groups under
  `/api/v2`.
- Mongoose schemas and frontend types are separate and need contract alignment.
- Transform functions normalize model data for frontend use.
- MongoDB connection helpers exist under `src/lib/db/`.
- Shopify product links currently live on artwork data.
- A-013 and A-001 found response envelopes, status codes, and transform
  contracts are uneven across public, user, admin, and shop routes.
- A-015 found several MongoDB-backed API routes and account actions without
  explicit route-local DB connection ownership.
- A-001 found Shopify product IDs are documented as numeric but accepted as
  arbitrary strings.
- A-002 completed the `/api/v2` contract inventory and found inconsistent real
  HTTP statuses, route/fetcher drift, DB connection gaps, validation behavior,
  raw document responses, shop envelope drift, and undocumented admin route
  conventions.
- A-003 found model/schema/type field drift, admin write validation gaps,
  profile/comment/enquiry DTO mismatches, transform extender gaps, and artwork
  image sanitization issues.
- T-004 completed the first narrow API contract slice: the public single
  Shopify product route now uses success/error envelopes, validates numeric
  product IDs before Shopify calls, and has focused route tests.
- A-016 completed the forms/input audit and confirmed server-side validation
  gaps in public enquiry, user comments, admin create/update routes,
  subscription, search/browse query parsing, and input persistence tests.
- A-008 confirmed public and admin routes return raw exception messages and need
  public-safe error responses with internal redacted logging.
- T-010 completed the first public input hardening slice: public enquiry now
  uses a shared Zod DTO schema, persists only normalized validated fields,
  returns real 400 validation responses with `fieldErrors`/`formErrors`, removes
  request-body logging, owns `dbConnect()`, and returns public-safe 500 errors.
- T-012 completed the user comment input hardening slice: comment create/update
  now use route-safe Zod parsing, real HTTP auth/validation/not-found/forbidden
  statuses, parsed trimmed text persistence, transformed frontend DTO responses,
  and focused route tests.
- T-017 completed the subscription input hardening slice: `submitSubscription`
  validates defensive `FormData` input, normalizes email values, owns
  `dbConnect()`, persists only the normalized subscriber DTO, removes direct
  input logging, and returns stable public-safe failures.
- T-018 moved the public artwork list query, existing filter/sort behavior,
  color-proximity handling, pagination metadata, user-context transformation,
  and `dbConnect()` ownership into `getArtworkList`, shared by the API route and
  `ArtworkListLoader`.
- T-020 completed the first admin collection write validation slice: collection
  create/update now use strict route-safe schemas, real validation statuses,
  allowlisted parsed persistence, ObjectId checks, `dbConnect()` ownership, and
  focused route tests.
- T-021 completed public search query hardening: `/api/v2/public/search` now
  validates and bounds `q`/`type`/`page`/`limit`, escapes search regex input,
  delegates MongoDB query/DTO work to `getPublicSearchResults`, and returns real
  400 validation responses.

## Backlog

- Inventory all public, user, and admin API response shapes.
- Identify routes that return inconsistent success/error envelopes.
- Standardize shared success, error, unauthorized, forbidden, not-found,
  validation, and upstream-service response helpers.
- Replace body-level `statusCode`/`errorCode` failures with real HTTP response
  statuses across representative public, user, and admin routes first.
- Add a route/fetcher parity inventory or static test that catches unsupported
  methods and missing route files before consumers depend on them.
- Require route responses to return transformed frontend/admin data rather than
  raw Mongoose documents unless explicitly documented.
- Add `dbConnect()` or a shared DB wrapper to every MongoDB-backed API route and
  server action, then test handlers in isolation.
- Confirm schemas, TypeScript types, and transforms agree on required fields.
- Build a field matrix for article, artwork, blog, collection, comment, user,
  enquiry, and subscriber records, then choose the authoritative layer for each
  required/optional field.
- Add validation policy for create and update routes, including `safeParse` or
  equivalent 400 responses instead of broad 500s for validation failures.
- Fix high-risk route DTO mismatches for user profile and admin content writes.
- Migrate admin create/update routes toward allowlisted schemas, ObjectId
  validation, real 400 validation responses, and route tests by content type.
- Validate and bound artwork browse and shop browse query parameters before
  building Mongo filters or Shopify query behavior.
- Replace raw exception responses with stable public-safe errors across public,
  user, and admin routes.
- Add Shopify product ID normalization and validation for admin writes, API
  reads, and one-time data migration/audit work.
- Document pagination and filtering contracts for artwork, collection, blog,
  article, search, and shop endpoints.
- Choose list empty-state semantics and search pagination metadata behavior.
- Document whether admin action-segment API paths are canonical, or open an ADR
  for a resource-oriented migration plan.
- Audit form/input validation from UI through API persistence.
- Add tests for high-risk transforms and route utilities, including blog
  `readTime`, collection `firstArtworkId`, user/comment ownership state, artwork
  image sanitization, and color-sort payloads.

## Acceptance Criteria

- API response conventions are documented and applied consistently.
- Data model fields needed by public pages and admin forms are traceable from
  schema to type to transform.
- Missing, invalid, and unauthorized requests return predictable status codes.
- Shopify product references are validated consistently before persistence.

## Verification

```bash
npm test
npm run build
```

Add API route tests where behavior is changed.

## Progress

- Documentation scaffold created.
- 2026-05-14: Reconciled A-001, A-013, and A-015 data/API findings into
  `docs/audits/findings-register.md`, production risks, and this backlog.
- 2026-05-14: Reconciled A-002 and A-003 into F-036 through F-041, F-049, F-050,
  existing F-010/F-012/F-015/F-024, production risks, and this backlog.
- 2026-05-14: Prepared T-004 to standardize the public single Shopify product
  API contract before broad route/fetcher refactors.
- 2026-05-14: Completed T-004 for
  `/api/v2/public/shop/products/[productId]`; validation, 400/404/502 error
  envelopes, success `data` wrapping, and the direct artwork-page consumer are
  covered by focused tests.
- 2026-05-14: Reconciled A-016 into F-055 through F-062, updated F-016, and
  routed the first public input slice to T-010.
- 2026-05-14: Reconciled A-008 raw exception handling into F-053 and this
  backlog.
- 2026-05-14: Completed T-010 for `POST /api/v2/public/enquiry`; shared schema
  validation, normalized DTO persistence, body-log removal, real HTTP
  validation statuses, public-safe 500s, and focused route tests are in place.
- 2026-05-14: Completed T-012 for user comment create/update routes; route-safe
  schema validation, real HTTP statuses, trimmed persistence, transformed
  frontend DTOs, transaction rollback coverage, and focused route tests are in
  place.
- 2026-05-14: Completed T-017 for `submitSubscription`; server-action
  validation, normalization, `dbConnect()` ownership, public-safe errors, input
  log removal, and focused tests are in place.
- 2026-05-14: Completed T-018 for `GET /api/v2/public/artwork`; the route now
  parses search params and delegates query/transform ownership to
  `getArtworkList` while preserving the public list envelope.
- 2026-05-14: Prepared T-020 for admin collection create/update validation and
  T-021 for public search query validation plus server-only data access.
- 2026-05-14: Completed T-020 for admin collection create/update validation;
  strict route schemas, allowlisted parsed persistence, collection/artwork
  ObjectId validation, real 400/401/404/500 statuses, `dbConnect()` ownership,
  debug-log removal, and focused route tests are in place.
- 2026-05-14: Completed T-021 for public search query validation and direct
  server data access; `getPublicSearchResults` now owns MongoDB connection,
  escaped regex search, `type` filtering, pagination bounds, and DTO shaping for
  both the API route and `/search` page.

## Next Agent Action

Commission a follow-up for the remaining F-060 artwork/shop browse query
bounds. Keep article/artwork/blog admin writes as separate follow-up slices.
