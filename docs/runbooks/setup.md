# Setup Runbook

## Runtime Baseline

Use Node `22.14.0` and npm `10.9.2`.

The repo records the Node baseline in `.nvmrc` and `.node-version`, declares
`npm@10.9.2` in `package.json`, and enables npm engine checks through `.npmrc`.

## Local Install

```bash
npm ci
```

Use `npm ci` for fresh local installs and reproducible agent setup. Use explicit
package commands only when intentionally changing dependencies, for example
`npm install <package>` or `npm install --save-dev <package>`, then commit the
matching `package.json` and `package-lock.json` changes.

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
