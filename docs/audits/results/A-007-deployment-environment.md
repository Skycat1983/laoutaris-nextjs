# A-007 Deployment And Environment Readiness Result

Status: Completed

Audit goal: [A-007 Deployment and environment readiness](../goals.md#a-007-deployment-and-environment-readiness)

Workstream: [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md)

Audit date: 2026-05-14

## Summary

The app can produce a production build only when external network access and a
live MongoDB connection are available. In the default sandbox, `npm run build`
compiled and type-checked but failed during prerender/static page generation
with MongoDB DNS/egress errors. The same command passed after approved external
access, confirming that build verification is coupled to live deployment
services rather than isolated project inputs.

The deployment environment inventory is incomplete. The current runbook misses
Cloudinary variables, `JWT_SECRET`, Vercel-derived URL assumptions, and the
server-side `NEXT_PUBLIC_BASE_URL` dependency used by shop routes. It also does
not call out that `next.config.mjs` exposes `MONGO_URI` through `env`, which is
not production-safe for a secret connection string.

Deployment operations are still manual. The README identifies Vercel as the
target, but the repo has no `vercel.json`, no pinned Node runtime file, no
automated smoke script, and no documented rollback procedure beyond an open
placeholder.

## Scope Inspected

- Required docs:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md#a-007-deployment-and-environment-readiness`
  - `docs/workstreams/README.md`
  - `docs/workstreams/deployment-security-and-observability.md`
  - `docs/runbooks/deployment.md`
  - `docs/runbooks/environment.md`
- Linked context:
  - `docs/architecture/system-overview.md`
  - `docs/risks/production-readiness.md`
  - `docs/runbooks/testing.md`
  - `docs/runbooks/setup.md`
  - `docs/runbooks/database.md`
  - `docs/runbooks/cloudinary.md`
  - Related prior audit results A-001, A-006, and A-015.
- Deployment and package configuration:
  - `README.md`
  - `package.json`
  - `package-lock.json`
  - `next.config.mjs`
  - `.gitignore`
  - local `.env` variable names only, not values.
- Runtime configuration and environment usage:
  - `src/middleware.ts`
  - `src/app/layout.tsx`
  - `src/app/project/page.tsx`
  - `src/app/shop/products/[productHandle]/page.tsx`
  - `src/components/loaders/viewLoaders/ShopProductsLoader.tsx`
  - `src/components/elements/buttons/UploadButton.tsx`
  - `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
  - `src/lib/api/public/serverPublicApi.ts`
  - `src/lib/api/user/serverUserApi.ts`
  - `src/lib/api/admin/serverAdminApi.ts`
  - `src/lib/api/shopify/shopifyClient.ts`
  - `src/lib/config/authOptions.ts`
  - `src/lib/config/shopifyConfig.ts`
  - `src/lib/db/clientPromise.ts`
  - `src/lib/db/mongodb.ts`
  - `src/lib/session/session.ts`
  - `src/lib/session/getAuthUser.ts`
  - `src/lib/styles/fonts.ts`

## Commands Run

- `git status --short`: confirmed there were pre-existing dirty shared docs
  before this audit; this audit only edits the A-007 result file.
- `sed -n ... docs/...`: read required docs, linked workstream/runbooks, risk
  context, and prior audit results.
- `rg -n "process\\.env|NEXT_PUBLIC_|VERCEL_|NODE_ENV|JWT_SECRET|MONGO_URI|SHOPIFY_|CLOUDINARY|NEXTAUTH|GOOGLE_|GITHUB_" src next.config.mjs jest.config.js jest.setup.js package.json`:
  inventoried runtime env references.
- `rg -n -P -o "^[A-Za-z_][A-Za-z0-9_]*(?==)" .env`: listed local `.env`
  variable names only; values were not printed or recorded.
- `rg --files -g 'package-lock.json' -g 'pnpm-lock.yaml' -g 'yarn.lock' -g '.nvmrc' -g '.node-version' -g 'vercel.json' -g 'Dockerfile' -g 'netlify.toml' -g '.github/**'`:
  found only `package-lock.json`.
- `rg -n "dynamic|revalidate|runtime|preferredRegion|maxDuration|generateStaticParams|fetch\\(" ...`:
  checked route segment/runtime/cache hints and build-time fetch behavior.
- `rg --files -g 'route.ts' src/app/api` and `rg --files -g 'page.tsx' src/app`:
  inventoried API and page surfaces that build/smoke checks must consider.
- `nl -ba ...`: captured line-numbered evidence from config, middleware, DB,
  API fetcher, Shopify, Cloudinary, shop, layout, and upload files.
- `npm test`: passed, 9 suites and 95 tests. Expected console noise remains in
  `dateUtils` invalid-date cases.
- `npm run lint`: passed with no ESLint warnings or errors.
- `npm run build`: failed in the default sandbox after compilation/type checking
  because prerender/static generation could not reach MongoDB DNS:
  `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net`.
- `npm run build` with approved external access: passed. The successful build
  still performed production MongoDB connection attempts, same-app route fetches,
  and extensive debug logging during static page generation.

## Environment Variable Inventory

| Variable | Evidence | Current documentation state | Production readiness note |
| --- | --- | --- | --- |
| `MONGO_URI` | Used in `next.config.mjs:3-5`, `src/lib/db/clientPromise.ts:4-11`, and `src/lib/db/mongodb.ts:38`. Present as a local `.env` key. | Documented in `docs/runbooks/environment.md`. | Required secret, but currently exposed through `next.config.mjs` `env`. Remove from `next.config` and keep server-only. |
| `NEXTAUTH_SECRET` | Used by middleware token lookup at `src/middleware.ts:15-18` and `getAuthUser()` at `src/lib/session/getAuthUser.ts:71-74`. Present as a local `.env` key. | Documented. | Required for protected routes and admin token checks. |
| `JWT_SECRET` | Used by legacy custom session code at `src/lib/session/session.ts:7-8`. Present as a local `.env` key. | Not documented. | Decide whether the legacy custom session path remains supported. If it stays, document ownership and rotation; otherwise remove it with the auth cleanup. |
| `AUTH_SECRET` | Present as a local `.env` key. No runtime reference found by the env search. | Not documented. | Either remove from active environment configuration or document why it exists. |
| `GITHUB_ID` / `GITHUB_SECRET` | Used by `GitHubProvider` in `src/lib/config/authOptions.ts:59-62`. Present as local `.env` keys. | Documented as optional unless GitHub sign-in is enabled. | Production OAuth callback configuration must match the Vercel deployment domain. |
| `GOOGLE_ID` / `GOOGLE_SECRET` | Used by `GoogleProvider` in `src/lib/config/authOptions.ts:63-66`. Present as local `.env` keys. | Documented as optional unless Google sign-in is enabled. | Production OAuth callback configuration must match the Vercel deployment domain. |
| `SHOPIFY_STORE_DOMAIN` | Used in `src/lib/config/shopifyConfig.ts:6` to construct the Storefront URL at `:14`. Present as a local `.env` key. | Documented. | Required for shop listing/detail routes. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Used in `src/lib/config/shopifyConfig.ts:7-8` and request headers at `src/lib/api/shopify/shopifyClient.ts:27-32`. Present as a local `.env` key. | Documented. | Secret. A token-shaped literal remains in source comments and should be removed/rotated if real. |
| `NEXT_PUBLIC_BASE_URL` | Used by `ShopProductsLoader` at `src/components/loaders/viewLoaders/ShopProductsLoader.tsx:40-44` and product detail helpers at `src/app/shop/products/[productHandle]/page.tsx:20-23` and `:37-42`. Not present in local `.env` key list. | Not documented. | Required while shop SSR uses absolute same-app fetches. Prefer removing same-app HTTP; if kept temporarily, document per Vercel environment. |
| `VERCEL_ENV` / `VERCEL_URL` | Used by server fetchers at `src/lib/api/public/serverPublicApi.ts:13-18`, `src/lib/api/user/serverUserApi.ts:11-16`, and `src/lib/api/admin/serverAdminApi.ts:10-15`; `VERCEL_URL` is also used by `src/app/project/page.tsx:4-5`. | Not documented in environment runbook. | Vercel-provided values, but URL construction is inconsistent and production URL is hard-coded in three fetcher files. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Used by Cloudinary signing route at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:8-12`. Present as a local `.env` key. | Not documented in environment runbook. | Required for admin uploads. Public by name; still needs ownership and environment coverage. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Used by Cloudinary signing route at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:8-12`. Present as a local `.env` key. | Not documented. | Public by name, but upload signing still depends on correct Cloudinary account configuration. |
| `CLOUDINARY_API_SECRET` | Used by Cloudinary signing route at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:8-20`. Present as a local `.env` key. | Not documented. | Secret. Required for signed uploads and should have a rotation owner. |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Present as a local `.env` key, but no runtime `process.env` usage found. `UploadButton` hard-codes `uploadPreset="laoutaris_art"` at `src/components/elements/buttons/UploadButton.tsx:113-117`. | Not documented. | Decide whether upload preset is config or hard-coded policy; document whichever is canonical. |
| `NODE_ENV` | Used for dev-only auth/test behavior, DB client caching, and Shopify cache policy. | Implicit platform variable. | Expected platform variable; no action except preserving environment-specific behavior in tests/build notes. |

## Production Configuration Inventory

- Deployment target is Vercel by convention only: `README.md:20-30` names Vercel
  and the live URL, while `docs/runbooks/deployment.md` says Vercel is the
  target based on the README.
- No `vercel.json`, `.nvmrc`, `.node-version`, Dockerfile, Netlify config, or
  GitHub Actions workflow was found by the deployment file search. The npm
  lockfile is `package-lock.json`.
- `package.json:5-11` defines only `dev`, `build`, `start`, `lint`, `test`, and
  `test:watch`. There is no automated smoke, e2e, preview, or CI script.
- `next.config.mjs:3-5` publishes `MONGO_URI` through Next config `env`.
- `next.config.mjs:6-24` allows remote images from the project Cloudinary cloud,
  `cdn-icons-png.flaticon.com`, and Shopify CDN.
- `next.config.mjs:25-67` sets broad API CORS and a broad CSP. Detailed header
  hardening belongs to A-008, but this is part of the current production config.
- `src/middleware.ts:50-60` protects route matching broadly but relies on
  `NEXTAUTH_SECRET` and emits debug logs for every checked route.
- `src/app/layout.tsx:28-33` connects to MongoDB, logs a branch verification
  timestamp, and calls `getServerSession(authOptions)` at the root layout for
  the entire app.
- `src/lib/styles/fonts.ts:1-48` uses `next/font/google` for five font families,
  so uncached clean builds need Google Fonts network access.
- The successful external build reported all app routes as dynamic (`ƒ`), so the
  current build output does not provide static route coverage for public pages.

## Findings

### A-007-F01: `MONGO_URI` Is Exposed Through Next Config

Severity: High

`next.config.mjs:3-5` assigns `MONGO_URI: process.env.MONGO_URI` under the Next
config `env` field. `MONGO_URI` is a secret database connection string used by
server DB helpers (`src/lib/db/clientPromise.ts:7-11`,
`src/lib/db/mongodb.ts:38`). It should not be configured as a public build-time
constant.

Why this matters:

- A production MongoDB connection string must remain server-only.
- This undermines the environment runbook's rule to avoid storing or exposing
  secret values.

Recommended follow-up:

- Remove `MONGO_URI` from `next.config.mjs`.
- Confirm no client bundle references require it.
- Add a config lint/test check that rejects known server-only env vars in
  `next.config` `env`.

### A-007-F02: Environment Runbook Is Missing Active Variables And Config Decisions

Severity: High

`docs/runbooks/environment.md` currently documents MongoDB, NextAuth, OAuth, and
Shopify variables, but live env usage also includes `JWT_SECRET`,
`NEXT_PUBLIC_BASE_URL`, `VERCEL_ENV`, `VERCEL_URL`,
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, and a local `.env` key for
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. The local `.env` also contains
`AUTH_SECRET`, which was not referenced by the env search.

Why this matters:

- A fresh production/preview environment can be configured incompletely while
  still appearing to satisfy the current runbook.
- Unused or legacy secrets make rotation ownership unclear.

Recommended follow-up:

- Update the environment runbook with every active variable, required
  environments, owner, purpose, and rotation guidance.
- Decide whether `JWT_SECRET`, `AUTH_SECRET`, and
  `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are active, deprecated, or mistakes.

### A-007-F03: Build Verification Depends On Live MongoDB And External Network

Severity: High

The default sandbox build compiled successfully but failed during page
generation with `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net`.
The escalated external-access rerun passed, while logging repeated production
MongoDB client creation, Mongoose connection attempts, same-app fetcher calls,
and route data loading. `src/app/layout.tsx:28-33` connects to MongoDB and reads
session state at the root layout, while `src/lib/db/clientPromise.ts:4-11`
creates a raw MongoDB client at module load for the NextAuth adapter. Clean
builds also depend on Google Fonts through `src/lib/styles/fonts.ts:1-48`.

Why this matters:

- CI, preview commissioning, and local release verification can fail because
  external services are unavailable, not because the code is invalid.
- Passing `npm run build` is not an isolated proof that deployment is ready; it
  also proves that Google Fonts and MongoDB are reachable at build time.

Recommended follow-up:

- Isolate build from live MongoDB where possible by moving global DB/session
  work out of the root layout and avoiding build-time route data fetches.
- If live services remain required temporarily, document them explicitly in the
  deployment and environment runbooks and CI configuration.
- Consider self-hosted/local fonts to remove the Google Fonts build dependency.

### A-007-F04: Deployment URL Construction Is Hard-Coded And Inconsistent

Severity: High

The server fetchers hard-code `https://laoutaris-nextjs.vercel.app` for
production and use `https://${process.env.VERCEL_URL}` only for previews
(`src/lib/api/public/serverPublicApi.ts:13-18`,
`src/lib/api/user/serverUserApi.ts:11-16`,
`src/lib/api/admin/serverAdminApi.ts:10-15`). Shop server code separately uses
`NEXT_PUBLIC_BASE_URL` with a `localhost:3000` fallback
(`src/components/loaders/viewLoaders/ShopProductsLoader.tsx:40-44`,
`src/app/shop/products/[productHandle]/page.tsx:20-23` and `:37-42`).
`src/app/project/page.tsx:4-5` redirects using `VERCEL_URL` without adding an
`https://` protocol.

Why this matters:

- Production domain changes require source changes in multiple files.
- Preview and custom-domain behavior can diverge from production.
- Missing `NEXT_PUBLIC_BASE_URL` can silently fall back to localhost in server
  code.

Recommended follow-up:

- Replace same-app HTTP fetches with direct server data access as planned in
  ADR 0004.
- Until then, centralize base URL construction in one server-only helper,
  document required variables, and avoid localhost fallbacks in production code.
- Change same-app redirects to relative app routes where possible.

### A-007-F05: Shopify Credential-Like Source Comment Remains

Severity: High

`src/lib/config/shopifyConfig.ts:1-8` correctly reads Shopify values from env,
but it also contains a concrete Storefront-token-shaped example in comments.
A-001 already found and reconciled this as F-011/R-022; A-007 confirms the value
is still present.

Why this matters:

- Even Storefront tokens should be treated as environment-managed credentials in
  this project.
- If the value is real, it may require rotation.

Recommended follow-up:

- Remove credential-like values from source comments.
- Verify whether the token is real and rotate it if it has been exposed.

### A-007-F06: Cloudinary Upload Configuration Is Not Deployment-Ready

Severity: Medium

Cloudinary signing depends on `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
`NEXT_PUBLIC_CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`
(`src/app/api/v2/admin/sign-cloudinary-params/route.ts:8-20`), but the
environment runbook does not list them. The local `.env` contains
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, while `UploadButton` hard-codes
`uploadPreset="laoutaris_art"` at
`src/components/elements/buttons/UploadButton.tsx:113-117`.

Why this matters:

- A production admin upload path can be deployed without the documented
  Cloudinary signing variables.
- Operators cannot tell whether the upload preset is environment-owned or a
  hard-coded policy.

Recommended follow-up:

- Document Cloudinary variables, upload preset ownership, allowed folders, and
  rotation owner.
- Reconcile this with A-009 before changing signing behavior.

### A-007-F07: Smoke Checks Are Manual And Not Backed By A Script

Severity: Medium

`docs/runbooks/deployment.md:25-36` lists useful post-deploy smoke checks for
public pages, shop, auth, non-admin access, and admin dashboard access.
`package.json:5-11` has no smoke/e2e script, and `docs/runbooks/testing.md`
states that no browser end-to-end script is currently defined.

Why this matters:

- Release confidence depends on an operator manually remembering routes,
  accounts, and assertions.
- Auth/admin/shop regressions can pass `npm test`, `npm run lint`, and even a
  build.

Recommended follow-up:

- Convert the deployment smoke list into a small scripted smoke suite or a
  precise manual checklist with test accounts, expected redirects, and pass/fail
  evidence fields.
- Keep browser output targeted per the repo's browser automation discipline.

### A-007-F08: Runtime Version, Rollback, And Vercel Project Settings Are Not Pinned

Severity: Medium

The deployment target is Vercel by README/runbook convention, but the repo has
no `vercel.json`, no Node runtime file, and no workflow config found by the
deployment file search. `docs/runbooks/deployment.md:39-40` still says rollback
must be documented once the production project is configured.

Why this matters:

- Different local, preview, and Vercel default Node versions can produce
  different dependency/build behavior.
- Rollback remains operator knowledge rather than a repeatable runbook.

Recommended follow-up:

- Document or pin the Node version used by production.
- Record Vercel project settings, build command, install command, output
  assumptions, env groups, and rollback steps.

### A-007-F09: Production Build And Runtime Logs Are Too Noisy

Severity: Medium

The successful build emitted root layout branch-verification logs
(`src/app/layout.tsx:29-32`), DB connection logs
(`src/lib/db/clientPromise.ts:4-5`, `src/lib/db/mongodb.ts:19-22`), fetcher
stack logs from server API calls, collection/article debug logs, and upload
widget debug logs in client code (`src/components/elements/buttons/UploadButton.tsx:17-110`
and `:129-170`).

Why this matters:

- Build and production logs are not actionable enough for deployment triage.
- Debug output can obscure real deployment failures and may include sensitive
  request or operational context.

Recommended follow-up:

- Define a production logging policy in the deployment/observability workstream.
- Gate debug logs behind development-only or explicit debug flags.

## Smoke-Check Coverage Gap

Current manual deployment smoke list:

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

Missing details before production:

- Exact deployed URLs for each check.
- Which seeded or production records should be used for artwork, collection,
  blog, and product detail checks.
- Which auth providers are expected to work in production.
- Test account roles or an operator-safe way to prove admin/non-admin access.
- Expected status codes/redirects for admin denial and product not found.
- A pass/fail recording location and rollback trigger.

## Findings Register Updates

- Reconciled on 2026-05-14 into
  [findings-register.md](../findings-register.md).
- New converted findings: F-044, F-046, F-047, and F-048.
- Existing findings updated with A-007 evidence: F-011, F-016, F-019, F-020,
  and F-030.

## Risks Updated

- Updated on 2026-05-14:
  [production-readiness risks](../../risks/production-readiness.md) R-003,
  R-005, R-008, R-014, R-019, R-022, R-024, R-027, and R-028.

## Workstream Updates

- Updated on 2026-05-14:
  [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md),
  [Testing and quality](../../workstreams/testing-and-quality.md),
  [Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
  [Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
  [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md),
  and [Shopify commerce](../../workstreams/shopify-commerce.md).

## Completion Audit

| Requirement | Evidence | Status |
| --- | --- | --- |
| Read AGENTS and docs index. | `AGENTS.md` and `docs/README.md` were read before inspection. | Complete |
| Read A-007 audit goal. | `docs/audits/goals.md#a-007-deployment-and-environment-readiness` was read; this file links back to it. | Complete |
| Read linked workstream. | `docs/workstreams/deployment-security-and-observability.md` was read and summarized in scope. | Complete |
| Read deployment runbook. | `docs/runbooks/deployment.md` was read; smoke and rollback gaps are audited above. | Complete |
| Read environment runbook. | `docs/runbooks/environment.md` was read; missing variables are compared above. | Complete |
| Audit deployment assumptions. | Production target, URL construction, Vercel assumptions, missing config files, and rollback gaps are documented. | Complete |
| Audit environment variables. | Runtime env references and local `.env` keys were inventoried without values; inventory table records active, missing, unused, and platform variables. | Complete |
| Audit build behavior. | `npm test`, `npm run lint`, sandbox `npm run build`, and external-access `npm run build` results are recorded. | Complete |
| Audit production configuration. | `next.config.mjs`, middleware, root layout DB/session work, fonts, image domains, CORS/CSP, package scripts, and route output were inspected. | Complete |
| Audit smoke-check requirements. | Deployment smoke list was reviewed and missing executable/evidence details are recorded. | Complete |
| Write result file. | `docs/audits/results/A-007-deployment-environment.md` is updated from placeholder to completed audit. | Complete |
| Avoid recording secret values. | `.env` inspection printed names only; this report does not include secret values. | Complete |
| Avoid overwriting unrelated dirty files. | Pre-existing dirty shared docs were observed; the original audit edited only this result file, and reconciliation later patched shared docs in place. | Complete |
| Reconcile shared tracker updates. | Candidate findings, risks, and workstream updates are now routed through the findings register, risk tracker, and workstream backlogs. | Complete |

## Next Action

Remove `MONGO_URI` from `next.config.mjs`, then update the
environment/deployment runbooks with owner, purpose, required environments,
rotation notes, Vercel settings, smoke evidence, and rollback steps.
