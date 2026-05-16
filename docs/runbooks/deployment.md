# Deployment Runbook

Deployment target: Vercel, based on the project README.

## Install Baseline

Deployments and clean verification environments should install from the
lockfile:

```bash
npm ci
```

The committed runtime baseline is Node `22.14.0` with npm `10.9.2`. The Node
baseline is recorded in `.nvmrc`, `.node-version`, and `package.json` engines;
npm is pinned through `packageManager`.

## Pre-Deployment Checks

```bash
npm ci --dry-run --ignore-scripts
npm run env:guard
npm test
npm run build
npm run lint
```

## Environment Checklist

Before deploying, use the full
[environment variables inventory](environment.md) as the source of truth.
At minimum, confirm production values exist for:

- MongoDB connection via server-only `MONGO_URI`.
- NextAuth secret and provider credentials.
- Shopify store domain and Storefront token.
- Cloudinary upload and delivery configuration.
- Public/platform URL configuration while same-app HTTP fetches remain:
  `NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, and `VERCEL_URL`.

Server-only secrets must be configured in the deployment environment and must
not be exposed through `next.config.mjs` `env` or `NEXT_PUBLIC_*` variables.
`npm run build` runs `npm run env:guard` before `next build` to prevent known
server-only secret names from being exposed through Next config.

Legacy or unused candidates such as `JWT_SECRET`, `AUTH_SECRET`, and
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are documented in the environment
runbook. Do not add or keep them in production settings without an owner
decision.

## Smoke Checks After Deploy

Run these checks after every production Vercel deploy and after any preview
deploy that changes auth, routing, data access, Shopify, native packages,
runtime settings, or deployment configuration.

Record only evidence needed to prove the deploy. Do not record passwords,
session cookies, CSRF tokens, OAuth tokens, Vercel tokens, raw request bodies, or
screenshots containing credential values.

### Smoke Evidence Template

Copy this template into the active task, incident note, or deployment handoff.

```md
## Vercel Smoke Evidence

- Checked at, UTC:
- Checked by:
- Vercel environment: Production | Preview
- Deployment URL or deployment ID:
- Alias tested, if different:
- Commit SHA:
- Runtime observed, if available:
- Build ID, if available:
- Route/status results:
  - GET /:
  - GET /artwork:
  - GET /artwork/<smoke-artwork-id>:
  - GET /collections:
  - GET /collections/<smoke-collection-slug>/<smoke-artwork-id>:
  - GET /blog:
  - GET /blog/<smoke-blog-slug>:
  - GET /search?q=<smoke-query>:
  - GET /shop/products:
  - GET /shop/products/<smoke-product-handle>:
  - GET /shop/products/<known-missing-product-handle>:
  - GET /api/auth/signin:
  - GET /api/auth/signout:
  - GET /admin/dashboard/articles as unauthenticated:
- Credentials smoke account source, no secret values:
- Credentials sign-in outcome:
- Sign-out outcome:
- Non-admin admin denial outcome:
- Admin dashboard access outcome:
- Targeted Vercel log check:
- Native-package/runtime errors found:
- External dependency errors found:
- Rollback decision: No rollback | Rollback started | Rollback completed
- Rollback target deployment, if used:
- Follow-up task or incident:
```

### Minimum Route Set

Use stable, owner-approved production records for detail routes. If a detail
record is deleted or intentionally unpublished, replace it with another approved
record and note that substitution in the evidence.

| Area | Check | Expected result |
| --- | --- | --- |
| Home | `GET /` | `200`, no root-layout or native-package crash. |
| Artwork list | `GET /artwork` | `200`. |
| Artwork detail | `GET /artwork/<smoke-artwork-id>` | `200` for an approved artwork ID. |
| Collections entry | `GET /collections` | `200` after the current redirect to the first collection artwork. |
| Collection detail | `GET /collections/<smoke-collection-slug>/<smoke-artwork-id>` | `200` for an approved collection/artwork pair. |
| Blog list | `GET /blog` | `200`. |
| Blog detail | `GET /blog/<smoke-blog-slug>` | `200` for an approved blog slug. |
| Search | `GET /search?q=<smoke-query>` | `200`; empty results are acceptable only if the query is expected to be empty. |
| Shop listing | `GET /shop/products` | `200`; Shopify failures are deployment-blocking unless confirmed as an external outage. |
| Product detail | `GET /shop/products/<smoke-product-handle>` | `200` for an approved product handle. |
| Product not found | `GET /shop/products/<known-missing-product-handle>` | `404`, not `500`. |
| Sign-in shell | `GET /api/auth/signin` | `200`, no provider/config crash. |
| Sign-out shell | `GET /api/auth/signout` | `200`, no provider/config crash. |
| Credentials sign-in | Deployed UI or approved credentials callback flow | Successful sign-in with an owner-provided smoke account; no secret values recorded. |
| Sign-out | Deployed UI or approved sign-out flow | Session clears; protected routes require sign-in again. |
| Non-admin admin denial | Visit `/admin/dashboard/articles` with a non-admin smoke account | Redirects away from admin UI, or API admin routes return `403`. |
| Admin dashboard | Visit `/admin/dashboard/articles` with an admin smoke account | `200` dashboard access for the expected admin role. |

### Public Route Smoke Script

The public status script covers only unauthenticated checks and is safe to run
without production credentials:

```bash
npm run smoke:public -- --base-url=https://laoutaris-nextjs.vercel.app
```

Optional detail records can be supplied without secrets:

```bash
SMOKE_ARTWORK_ID=<artwork-id> \
SMOKE_COLLECTION_SLUG=<collection-slug> \
SMOKE_COLLECTION_ARTWORK_ID=<artwork-id> \
SMOKE_BLOG_SLUG=<blog-slug> \
SMOKE_PRODUCT_HANDLE=<product-handle> \
npm run smoke:public -- --base-url=https://laoutaris-nextjs.vercel.app
```

The script checks:

- Public list/status routes: home, artwork list, collections entry, blog list,
  search, and shop listing.
- Optional detail routes when the smoke record variables are present.
- Product not-found behavior with `SMOKE_MISSING_PRODUCT_HANDLE`, defaulting to
  `codex-smoke-missing-product`.
- NextAuth sign-in/sign-out shell pages.
- Unauthenticated admin denial by checking that `/admin/dashboard/articles`
  redirects to `/api/auth/signin`.

Script limitations:

- It does not prove credentials sign-in, sign-out, non-admin denial after login,
  or admin dashboard access.
- It does not inspect Vercel logs.
- It checks HTTP status, redirect destination where relevant, and timing only;
  it does not validate page content.
- A skipped optional detail route is not a pass. Complete production evidence
  still needs approved detail records.

### Credentials Smoke Handling

Use a production smoke account only if the owner has approved the account and
provided the secret through a password manager or other private channel outside
the repo, chat transcript, terminal history, screenshots, and docs.

Record the account source and role, not the secret:

- Allowed: `Owner-provided non-admin smoke account from password manager; email not recorded.`
- Allowed: `Owner-provided admin smoke account from password manager; username not recorded.`
- Allowed: `Credentials sign-in succeeded and session showed expected non-admin role.`
- Allowed: `Credentials sign-in failed with CredentialsSignin and no 500; no successful sign-in evidence.`
- Not allowed: usernames, emails, passwords, password reset links, session
  tokens, CSRF tokens, cookies, or screenshots that reveal any of those values.

Required credentialed outcomes:

- Non-admin credentials can sign in and sign out.
- Non-admin credentials cannot access `/admin` or `/admin/dashboard/articles`.
- Admin credentials can access `/admin/dashboard/articles`.
- After sign-out, `/account` and `/admin/dashboard/articles` require sign-in
  again.

If no approved smoke account exists, do not improvise with a real user account.
Record the blocker as an owner action to create or approve non-admin and admin
smoke accounts.

### Targeted Vercel Logs

A production smoke is incomplete until a Vercel project owner, or an agent with
approved Vercel access, checks deployment-specific logs for the same time window
as the smoke run.

Record:

- Who checked the logs.
- Vercel environment, deployment ID or URL, and commit SHA.
- UTC time window.
- Routes queried, especially `/`, `/api/auth/callback/credentials`,
  `/shop/products`, the product detail route, and admin dashboard route.
- Whether any `5xx`, uncaught exceptions, missing environment variables,
  Shopify failures, MongoDB failures, auth callback failures, or native-package
  load errors appeared.
- A short owner-provided excerpt if the agent cannot access logs directly.

If native-package errors recur, capture only the targeted technical fields:

- Package name and failing native file path.
- Node/runtime version, platform, architecture, libc, and ABI if present.
- Vercel function or route.
- Deployment ID, build ID if available, commit SHA, timestamp, and
  `x-vercel-id`.
- First app-owned stack frame.

Do not paste full raw logs when they include environment values, request bodies,
cookies, tokens, or user data.

## Rollback

Use Vercel's project rollback controls to promote the last known good production
deployment. The owner or orchestrator must identify who has Vercel rollback
permission before production launch.

Start rollback or block promotion when any critical smoke path fails:

- `GET /` returns `500` or logs a root-layout/serverless crash.
- Vercel logs show a native-package load error such as `node-gyp-build` failing
  to load `bcrypt`, or another runtime/package mismatch.
- Public archive routes needed for browsing, including `/artwork` or an
  approved artwork detail, return repeatable `5xx` responses.
- `/shop/products` or an approved product detail returns repeatable `5xx`
  responses not confirmed as a Shopify outage.
- A missing product route returns `500` instead of `404`.
- Credentials sign-in returns `500` or all approved credentials fail
  unexpectedly.
- A non-admin smoke account can access admin UI or admin APIs.
- An admin smoke account cannot access `/admin/dashboard/articles` after
  successful sign-in.
- The deployment points at the wrong commit, environment, or alias.

Rollback evidence must record:

- Rollback started at, UTC.
- Person who triggered rollback.
- Failed deployment URL or ID.
- Rollback target deployment URL or ID.
- Commit SHA before and after rollback.
- Reason from the trigger list above.
- Post-rollback smoke result for `GET /`, credentials sign-in if relevant, and
  the route that caused rollback.
- Follow-up task or incident link.
