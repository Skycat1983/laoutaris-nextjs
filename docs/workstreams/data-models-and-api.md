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

## Backlog

- Inventory all public, user, and admin API response shapes.
- Identify routes that return inconsistent success/error envelopes.
- Confirm schemas, TypeScript types, and transforms agree on required fields.
- Add validation policy for create and update routes.
- Document pagination and filtering contracts for artwork, collection, blog,
  article, search, and shop endpoints.
- Audit form/input validation from UI through API persistence.
- Add tests for high-risk transforms and route utilities.

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

## Next Agent Action

Create an API contract inventory from `src/app/api/v2`, then record route groups,
response shapes, and obvious inconsistencies in this brief.
