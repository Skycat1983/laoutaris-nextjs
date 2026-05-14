# Environment Variables Runbook

Do not store secret values in this repo. This file records variable names,
purposes, and likely owners only.

## Known Variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `MONGO_URI` | MongoDB connection for app data | Required server-only secret for DB helpers. Configure it in server runtime/build environments, not in `next.config.mjs` `env` or any `NEXT_PUBLIC_*` variable. |
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
- Keep server-only secrets out of `next.config.mjs` `env`; values defined there
  can be inlined into application bundles by Next.js.
- Run `npm run env:guard` after editing `next.config.mjs`; `npm run build` also
  runs this guard before `next build`.
- Document new variables here when adding config.
- Include purpose, required environments, and rotation owner when known.

## Next Config Env Guard

`npm run env:guard` inspects the exported `next.config.mjs` object and fails if
the `env` field includes known server-only secrets or future secret-like names
containing `SECRET`, `TOKEN`, `PASSWORD`, or `PRIVATE_KEY`.

`NEXT_PUBLIC_*` names are not blocked just because they are public. If a public
name also contains a secret-like term, it must be explicitly allowlisted in
`scripts/validate-next-config-env.mjs` after its non-sensitive purpose is
documented here.
