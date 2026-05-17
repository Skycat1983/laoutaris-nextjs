# Environment Variables Runbook

Do not store secret values in this repo. This file records variable names,
purposes, classifications, required environments, and owner/status notes only.

This inventory is based on source searches for `process.env`, public env names,
platform env names, and the unresolved A-007 environment evidence. It does not
depend on local `.env` contents.

## Runtime Variables

| Variable | Purpose | Classification | Required environments | Owner/status and notes |
| --- | --- | --- | --- | --- |
| `MONGO_URI` | MongoDB connection for app data, NextAuth adapter storage, and the read-only Shopify product-link audit script. | Server-only secret. | Local development when MongoDB-backed routes or scripts run; preview; production; any shell running `npm run audit:shopify-products`. | Database/deployment owner. Configure only in server runtime/build environments. Do not expose through `next.config.mjs` `env` or any `NEXT_PUBLIC_*` variable. Rotate through MongoDB and the deployment provider if exposed. |
| `NEXTAUTH_SECRET` | NextAuth JWT/session signing secret used by NextAuth and middleware token lookup. | Server-only secret. | Local development when auth/protected routes are exercised; preview; production. | Auth/deployment owner. Keep stable per environment so sessions remain valid. Rotate intentionally because existing sessions will be invalidated. |
| `GITHUB_ID` | GitHub OAuth client ID for the NextAuth GitHub provider. | Provider identifier; not a server secret, but should remain environment-managed. | Only environments where GitHub sign-in is enabled. | Auth/OAuth owner. Provider callback URLs must match the active Vercel or custom domain for each enabled environment. |
| `GITHUB_SECRET` | GitHub OAuth client secret for the NextAuth GitHub provider. | Server-only secret. | Only environments where GitHub sign-in is enabled. | Auth/OAuth owner. Rotate in the GitHub OAuth app if exposed or when ownership changes. |
| `GOOGLE_ID` | Google OAuth client ID for the NextAuth Google provider. | Provider identifier; not a server secret, but should remain environment-managed. | Only environments where Google sign-in is enabled. | Auth/OAuth owner. Provider redirect URIs must match the active Vercel or custom domain for each enabled environment. |
| `GOOGLE_SECRET` | Google OAuth client secret for the NextAuth Google provider. | Server-only secret. | Only environments where Google sign-in is enabled. | Auth/OAuth owner. Rotate in Google Cloud if exposed or when ownership changes. |
| `SHOPIFY_STORE_DOMAIN` | Shopify shop domain used to build the Storefront GraphQL endpoint. | Server-side commerce configuration; non-secret. | Local development when shop routes are exercised; preview; production. | Commerce/deployment owner. Source constructs the Storefront URL from this value; keep the value domain-only, without a protocol. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify Storefront API token used in Storefront GraphQL requests. | Server-only secret. | Local development when shop routes are exercised; preview; production. | Commerce/deployment owner. T-009 removed a token-shaped source comment; owner verification of whether the removed value was real, and rotation if needed, remains separate. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name used by the admin upload signing route and public Cloudinary delivery configuration. | Public Cloudinary account identifier. | Local development when admin uploads are exercised; preview; production. | Assets/deployment owner. Keep aligned with Cloudinary delivery settings and `next.config.mjs` image host policy. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Cloudinary API key used by the admin upload signing route configuration. | Public Cloudinary account identifier. | Local development when admin uploads are exercised; preview; production. | Assets/deployment owner. This is not the signing secret, but it should still be managed with the matching Cloudinary account. |
| `CLOUDINARY_API_SECRET` | Cloudinary signing secret used by `POST /api/v2/admin/sign-cloudinary-params`. | Server-only secret. | Local development when admin uploads are exercised; preview; production. | Assets/security owner. Missing values return a public-safe configuration error. Rotate in Cloudinary if exposed or when ownership changes. |
| `NODE_ENV` | Standard Node/Next environment mode used for development-only DB client caching, auth/test helper behavior, and Shopify cache policy. | Runtime/platform variable; non-secret. | All Node/Next commands. | Node/Next runtime. Do not use as the only production safety control for secrets or authorization. |

## Script-Only Variables

These variables are not production runtime configuration. They are optional
operator inputs for `npm run smoke:public` unless marked required.

| Variable | Purpose | Classification | Required environments | Owner/status and notes |
| --- | --- | --- | --- | --- |
| `SMOKE_BASE_URL` | Base URL for unauthenticated public-route smoke checks when `--base-url` is not supplied. | Operator-supplied non-secret URL. | Required only for `npm run smoke:public` if `--base-url` is omitted. | Deployment tester. Use a production or preview URL; do not include credentials or tokens. |
| `SMOKE_TIMEOUT_MS` | Request timeout override for public smoke checks. | Operator-supplied non-secret test setting. | Optional for `npm run smoke:public`. | Deployment tester. Keep values practical enough to detect deployment hangs. |
| `SMOKE_SEARCH_QUERY` | Search query used by the public smoke script. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`. | Deployment tester. Use a query safe to record in smoke evidence. |
| `SMOKE_ARTWORK_ID` | Optional approved artwork detail record for smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`; required for complete production evidence. | Content/deployment tester. Use an owner-approved public record ID. |
| `SMOKE_COLLECTION_SLUG` | Optional approved collection slug for smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`; required with `SMOKE_COLLECTION_ARTWORK_ID` for complete collection detail evidence. | Content/deployment tester. Use an owner-approved public record. |
| `SMOKE_COLLECTION_ARTWORK_ID` | Optional approved artwork ID for collection detail smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`; required with `SMOKE_COLLECTION_SLUG` for complete collection detail evidence. | Content/deployment tester. Use an owner-approved public record. |
| `SMOKE_BLOG_SLUG` | Optional approved blog detail slug for smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`; required for complete production evidence. | Content/deployment tester. Use an owner-approved public record. |
| `SMOKE_PRODUCT_HANDLE` | Optional approved Shopify product handle for smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`; required for complete production shop evidence. | Commerce/deployment tester. Use an owner-approved product handle. |
| `SMOKE_MISSING_PRODUCT_HANDLE` | Product handle expected to return `404` in public smoke checks. | Operator-supplied non-secret route input. | Optional for `npm run smoke:public`. | Commerce/deployment tester. Keep it intentionally nonexistent and safe to record. |

## Legacy Or Decision Candidates

These names were raised by A-007, guard policy, or commented historical source
references. They are not currently required runtime variables based on the
current source search.

| Variable | Purpose | Classification | Required environments | Owner/status and notes |
| --- | --- | --- | --- | --- |
| `JWT_SECRET` | Previously used by the removed custom JWT cookie session path. | Deprecated server-only secret candidate. | Not required by current source after T-019 removed the legacy custom session path. | Auth/deployment owner decision. Remove from managed environments after confirming no external consumer still depends on it. It remains blocked by `npm run env:guard` if someone tries to expose it through Next config. |
| `AUTH_SECRET` | NextAuth/Auth.js-style secret alias found by A-007 as an unmanaged candidate. | Unused server-only secret candidate. | Not required by current source; the app uses `NEXTAUTH_SECRET`. | Auth/deployment owner decision. Either remove from managed environments or document a specific external reason for keeping it. It remains blocked by `npm run env:guard` if exposed through Next config. |
| `NEXT_PUBLIC_BASE_URL` | Former public app origin used by older same-app HTTP loader paths. | Deprecated public URL candidate. | Not required by current source after T-085 removed the shop listing loader dependency. | Deployment/architecture owner decision. Remove from managed environments after confirming no external consumer still depends on it; do not reintroduce same-app HTTP loader behavior without a new architecture decision. |
| `VERCEL_ENV` | Former server wrapper environment selector for choosing production, preview, or local same-app URL behavior. | Platform-provided non-secret; no longer an app runtime contract. | Not required by current source after T-087 removed the retired server API wrappers. | Vercel may still provide this automatically. Do not manage it as an app secret, and do not reintroduce same-app server self-fetch URL selection without a new architecture decision. |
| `VERCEL_URL` | Former server wrapper preview deployment hostname for same-app URL construction. | Platform-provided non-secret hostname; no longer an app runtime contract. | Not required by current source after T-087 removed the retired server API wrappers and T-086 removed the `/project` redirect dependency. | Vercel may still provide this automatically. Do not rely on it for current app URL construction unless a future task documents a new owner. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Potential public upload preset configuration. | Unused public upload-policy candidate. | Not required by current source; `UploadButton` currently hard-codes the upload preset. | Assets/deployment owner decision. Decide whether the preset is canonical hard-coded policy or should become environment-managed. Do not add it to required production config until code uses it. |
| `NEXT_PUBLIC_VERCEL_ENV` | Historical public Vercel environment candidate. | Unused public candidate. | Not required by current source. | Deployment owner decision. Do not configure as an app contract unless future source uses it intentionally. |
| `NEXT_PUBLIC_VERCEL_URL` | Historical public Vercel URL candidate. | Unused public candidate. | Not required by current source. | Deployment owner decision. Do not configure as an app contract unless future source uses it intentionally. |
| `MONGODB_URI` | Common MongoDB alias reserved by the Next config env guard. | Guard-only server-only secret candidate. | Not required by current source; use `MONGO_URI`. | Database/deployment owner. If this alias is introduced later, document and keep it server-only before use. |

## Rules

- Never commit `.env` values.
- Do not read, copy, or paste local `.env` contents into docs or chat.
- Keep server-only secrets out of `next.config.mjs` `env`; values defined there
  can be inlined into application bundles by Next.js.
- Keep server-only secrets out of `NEXT_PUBLIC_*` names.
- Run `npm run env:guard` after editing `next.config.mjs`; `npm run build` also
  runs this guard before `next build`.
- Document new variables here when adding config.
- Include purpose, classification, required environments, owner/status notes,
  and rotation/configuration guidance when known.

## Next Config Env Guard

`npm run env:guard` inspects the exported `next.config.mjs` object and fails if
the `env` field includes known server-only secrets or future secret-like names
containing `SECRET`, `TOKEN`, `PASSWORD`, or `PRIVATE_KEY`.

`NEXT_PUBLIC_*` names are not blocked just because they are public. If a public
name also contains a secret-like term, it must be explicitly allowlisted in
`scripts/validate-next-config-env.mjs` after its non-sensitive purpose is
documented here.
