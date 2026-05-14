# Database Runbook

MongoDB stores archive content, users, comments, account features, and admin
managed content.

## Code Areas

- `src/lib/db/`
- `src/lib/data/schemas/`
- `src/lib/data/models/`
- `src/lib/transforms/`
- `src/app/api/v2/`

## Connection Notes

The local DB README at `src/lib/db/README.md` documents connection helpers,
retry logic, and serverless considerations.

Use `withDbConnect` where applicable in API route handlers that need Mongoose
access.

## Backup Expectations

Before production data migrations or destructive admin changes:

- Export affected MongoDB collections.
- Record the export location outside this repo if it contains private data.
- Record migration intent in the relevant workstream.
- Add a rollback note when possible.

## Open Work

- Inventory all collections and schemas.
- Document indexes and uniqueness expectations.
- Define migration process for adding Shopify product links to artworks.
