# Setup Runbook

## Local Install

```bash
npm install
```

## Development Server

```bash
npm run dev
```

Default Next.js local URL:

```text
http://localhost:3000
```

## Baseline Checks

```bash
npm test
npm run build
npm run lint
```

## Required Local Services

The app expects access to configured external services for full behavior:

- MongoDB for app and auth data.
- Shopify Storefront API for shop products.
- Cloudinary for image delivery and uploads.
- OAuth provider credentials if testing GitHub or Google sign-in.

See [environment variables](environment.md) before testing integration-heavy
features.
