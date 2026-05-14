# Data Models And API Workstream

Status: Planned

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
- Fix high-risk route DTO mismatches for user profile, comment create/update,
  public enquiry, and admin content writes.
- Add Shopify product ID normalization and validation for admin writes, API
  reads, and one-time data migration/audit work.
- Document pagination and filtering contracts for artwork, collection, blog,
  article, search, and shop endpoints.
- Choose list empty-state semantics and search `type`/pagination metadata
  behavior.
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

## Next Agent Action

Start with the A-002/A-003 contract slice: add shared response/validation
helpers and a route/fetcher parity check, then apply them to one public route,
one user route, and one admin write route with focused tests.
