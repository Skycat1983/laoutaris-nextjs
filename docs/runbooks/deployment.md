# Deployment Runbook

Deployment target: Vercel, based on the project README.

For active production failures, security/privacy concerns, data-loss risk, or
cross-service incidents, use the [incident response runbook](incident-response.md)
alongside this deployment checklist.

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

`.github/workflows/main-ci.yml` is the repository-owned, non-secret local gate
for pull requests to `main`, pushes to `main`, and manual dispatch. It proves
typecheck, full Jest, production build, lint, and event-aware whitespace checks
under Node `22.14.0` / npm `10.9.2` with `npm ci`.

Main CI is pre-release regression evidence. It does not replace the release
handoff fields below because it intentionally avoids production secrets,
credentialed/admin smoke, public-smoke repository variables, Vercel log review,
monitoring, and rollback operations.

## Vercel Operator Token

The owner has created a local operator Vercel access token for deployment/log
inspection capacity. This token is not an app runtime variable and must not be
added to project `.env` files, Vercel project environment variables, source
code, docs, or chat.

Expected local shell name when an approved operator task needs CLI access:

```bash
VERCEL_TOKEN
```

Use only for approved Vercel CLI/API inspection such as deployment metadata or
targeted logs. Do not print the token. Do not use it for rollback, project
setting changes, environment variable changes, domain changes, or deployment
promotion unless the incident/runbook task explicitly grants that authority.
If `VERCEL_TOKEN` is unavailable in the agent shell, request a short redacted
log excerpt from the owner instead of working around access controls.

## External-Access Build Evidence

`npm run build` is still part of release evidence. For every production release
handoff, record whether the build ran with external access to MongoDB, Shopify,
and required network resources, or whether it ran in a restricted environment.

This evidence is separate from accidental build hard failures. Protected account
routes and `/project/about` should not require build-time data access just to
produce release artifacts. If those routes, or any other request-time surface,
start failing the build because external services are unavailable, treat that as
a build-isolation regression rather than satisfying this evidence policy.

The intentional external-build surfaces are:

- `/biography`, which uses the cached biography navigation data to choose the
  default redirect target.
- `/collections`, which uses cached collection navigation data to choose the
  default redirect target.
- `/sitemap.xml`, which uses MongoDB archive records and Shopify-backed product
  links for dynamic sitemap coverage.

Required release handoff fields:

- `npm run build` result and environment: external access available, restricted
  sandbox, or not run.
- Build evidence source: local build, Vercel build, CI build, or other named
  environment.
- External services expected during build: MongoDB, Shopify Storefront API, and
  any other relevant dependency.
- External dependency failures seen in build logs, or `None observed`.
- Follow-up task or incident when a build passes only by silently omitting
  expected dynamic sitemap coverage.

When dynamic sitemap archive or shop entries are expected for a release, a
basic `200` from `/sitemap.xml` is not enough. Record at least one expected
public dynamic URL from each applicable source that should be present:
biography article, blog post, artwork detail, collection route, collection
artwork detail, and Shopify product detail. If a source is intentionally empty,
not configured, or blocked by an upstream outage, record that explicit reason.

## Environment Checklist

Before deploying, use the full
[environment variables inventory](environment.md) as the source of truth.
At minimum, confirm production values exist for:

- MongoDB connection via server-only `MONGO_URI`.
- NextAuth secret and provider credentials.
- Shopify store domain and Storefront token.
- Cloudinary upload and delivery configuration.

Server-only secrets must be configured in the deployment environment and must
not be exposed through `next.config.mjs` `env` or `NEXT_PUBLIC_*` variables.
`npm run build` runs `npm run env:guard` before `next build` to prevent known
server-only secret names from being exposed through Next config.

Legacy or unused candidates such as `JWT_SECRET`, `AUTH_SECRET`, and
`NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `VERCEL_ENV`,
and `VERCEL_URL` are documented in the environment runbook. Do not add, require,
or keep them as app-managed production settings without an owner decision.
`VERCEL_ENV` and `VERCEL_URL` may still be platform-provided by Vercel, but they
are not current app runtime requirements.

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
- Build evidence:
  - `npm run build` result:
  - Build environment:
  - External access during build: Available | Restricted | Unknown
  - External dependency build failures:
- Route/status results:
  - GET /:
  - GET /artwork:
  - GET /artwork/<smoke-artwork-id>:
  - GET /biography:
  - GET /biography/<smoke-biography-slug>:
  - GET /collections:
  - GET /collections/<smoke-collection-slug>/<smoke-artwork-id>:
  - GET /blog:
  - GET /blog/<smoke-blog-slug>:
  - GET /search?q=<smoke-query>:
  - GET /shop/products:
  - GET /robots.txt:
  - GET /sitemap.xml:
  - GET /shop/products/<smoke-product-handle>:
  - GET /shop/products/<known-missing-product-handle>:
  - GET /api/auth/signin:
  - GET /api/auth/signout:
  - GET /admin/dashboard/articles as unauthenticated:
- Intentional external-build surface evidence:
  - /biography redirect target:
  - /collections redirect target:
  - /sitemap.xml dynamic biography/blog/artwork/collection URLs present:
  - /sitemap.xml dynamic Shopify product URLs present:
  - Expected dynamic sitemap source omitted, with reason:
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
| Biography entry | `GET /biography` | Redirects to the expected first biography article selected from cached navigation data. |
| Biography detail | `GET /biography/<smoke-biography-slug>` | `200` for an approved biography article slug. |
| Collections entry | `GET /collections` | `200` after the current redirect to the first collection artwork. |
| Collection detail | `GET /collections/<smoke-collection-slug>/<smoke-artwork-id>` | `200` for an approved collection/artwork pair. |
| Blog list | `GET /blog` | `200`. |
| Blog detail | `GET /blog/<smoke-blog-slug>` | `200` for an approved blog slug. |
| Search | `GET /search?q=<smoke-query>` | `200`; empty results are acceptable only if the query is expected to be empty. |
| Shop listing | `GET /shop/products` | `200`; Shopify failures are deployment-blocking unless confirmed as an external outage. |
| Robots discovery | `GET /robots.txt` | `200`, includes an absolute `Sitemap:` directive for `/sitemap.xml`. |
| Sitemap discovery | `GET /sitemap.xml` | `200`, XML-like sitemap output containing stable public archive URLs and no `/admin`, `/account`, or `/api` URL paths. When dynamic archive/shop URLs are expected, confirm representative expected URLs are present rather than relying on the stable URL set alone. |
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
- Discovery endpoints: `/robots.txt` and `/sitemap.xml`, including
  conservative content checks for the sitemap directive, stable public sitemap
  URLs, and absence of private/admin/account/API sitemap paths.
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
- It checks HTTP status, redirect destination where relevant, discovery
  endpoint content, and timing only; it does not validate ordinary page
  content.
- It does not require dynamic detail URLs to appear in `/sitemap.xml`; dynamic
  detail sitemap coverage still depends on approved records and upstream
  archive/Shopify availability.
- A skipped optional detail route is not a pass. Complete production evidence
  still needs approved detail records.

### GitHub Actions Public Smoke

The repo-owned workflow `.github/workflows/public-smoke.yml` runs the same
unauthenticated public smoke script from GitHub Actions.

Manual run:

1. Open GitHub Actions and select `Public Smoke`.
2. Start `workflow_dispatch` with `base_url` set to the public production or
   preview URL to smoke.
3. Review the job log for failed and skipped checks.

Scheduled run setup:

1. In repository settings, open `Secrets and variables` then `Actions`.
2. Add non-secret repository variable `SMOKE_BASE_URL` with the public base URL.
3. Optionally add non-secret route input variables:
   `SMOKE_TIMEOUT_MS`, `SMOKE_SEARCH_QUERY`, `SMOKE_ARTWORK_ID`,
   `SMOKE_COLLECTION_SLUG`, `SMOKE_COLLECTION_ARTWORK_ID`, `SMOKE_BLOG_SLUG`,
   `SMOKE_PRODUCT_HANDLE`, and `SMOKE_MISSING_PRODUCT_HANDLE`.
4. Leave credentials, tokens, cookies, Vercel API keys, and private account
   identifiers out of repository variables.

The scheduled workflow skips with a notice until `SMOKE_BASE_URL` is configured.
Optional detail checks still skip unless their matching non-secret route
variables are configured. A green workflow with skipped detail checks proves
only the default unauthenticated public route set; it is not complete production
smoke evidence.

This workflow does not replace the credentialed smoke, admin access checks, or
targeted Vercel log review in this runbook.

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
deployment. The
[incident owner matrix](incident-response.md#owner-and-escalation-matrix)
currently records Vercel rollback ownership as blocked until the owner or
orchestrator approves the operator and backup. Do not start rollback unless the
owner/orchestrator has identified the Vercel-access operator for the incident.

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
