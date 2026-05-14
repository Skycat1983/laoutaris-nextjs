# Deployment Runbook

Deployment target: Vercel, based on the project README.

## Pre-Deployment Checks

```bash
npm run env:guard
npm test
npm run build
npm run lint
```

## Environment Checklist

Before deploying, confirm production values exist for:

- MongoDB connection via server-only `MONGO_URI`.
- NextAuth secret and provider credentials.
- Shopify store domain and Storefront token.
- Cloudinary upload and delivery configuration.

See [environment variables](environment.md).

Server-only secrets must be configured in the deployment environment and must
not be exposed through `next.config.mjs` `env` or `NEXT_PUBLIC_*` variables.
`npm run build` runs `npm run env:guard` before `next build` to prevent known
server-only secret names from being exposed through Next config.

## Smoke Checks After Deploy

- Home page loads.
- Artwork listing and artwork detail load.
- Collection listing and collection detail load.
- Blog listing and blog detail load.
- Search page loads.
- Shop product listing loads.
- Product detail handles not found products gracefully.
- Sign-in and sign-out work.
- Non-admin users cannot access admin pages.
- Admin user can access dashboard.

## Rollback

Document the Vercel rollback procedure once the production project is configured.
Until then, treat rollback as an open deployment risk.
