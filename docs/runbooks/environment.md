# Environment Variables Runbook

Do not store secret values in this repo. This file records variable names,
purposes, and likely owners only.

## Known Variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection for app data | Referenced in `next.config.mjs` and DB helpers |
| `NEXTAUTH_SECRET` | NextAuth JWT/session secret | Required by middleware token lookup |
| `GITHUB_ID` | GitHub OAuth client ID | Optional unless GitHub sign-in is enabled |
| `GITHUB_SECRET` | GitHub OAuth client secret | Secret |
| `GOOGLE_ID` | Google OAuth client ID | Optional unless Google sign-in is enabled |
| `GOOGLE_SECRET` | Google OAuth client secret | Secret |
| `SHOPIFY_STORE_DOMAIN` | Shopify shop domain | Used to build Storefront API URL |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify Storefront API token | Secret |

## Needs Inventory

The codebase may require additional Cloudinary and NextAuth variables not yet
captured here. The deployment workstream should audit all `process.env` usage and
update this file before production.

## Rules

- Never commit `.env` values.
- Document new variables here when adding config.
- Include purpose, required environments, and rotation owner when known.
