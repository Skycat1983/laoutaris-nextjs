# T-015 Audit Next Major Migration Preflight

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)

## Goal

Decide the exact Next major migration target and implementation scope needed to
clear the residual Next/PostCSS production advisories without breaking the
current App Router production baseline.

## Why Now

T-014 confirmed `npm audit --omit=dev --json` still reports high production
advisories against `next@14.2.35` and a moderate advisory against
`next/node_modules/postcss@8.4.31`. npm currently reports `next@16.2.6` as the
available fix, which is a semver-major framework migration and requires Node
`>=20.9.0`.

This task addresses:

- [F-063](../audits/findings-register.md): residual high runtime advisories need
  major-migration decisions.
- [R-017](../risks/production-readiness.md): dependency health remains open
  after T-011/T-014.
- [R-013](../risks/production-readiness.md): testing must stay reliable before
  framework/runtime migrations.

## Read First

- [T-014 Decide Residual Dependency Advisories](T-014-residual-dependency-advisory-decision.md)
- [T-011 Patch Production Dependency Security Baseline](T-011-production-dependency-security-patch.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)
- [Rendering and data fetching architecture](../architecture/rendering-and-data-fetching.md)

## Scope

In scope:

- Re-run `npm audit --omit=dev --json` and inspect current npm metadata for the
  available Next fix target before making a final target recommendation.
- Review official Next migration guidance for the target major versions needed
  to leave Next 14, including Node runtime, React peer range, `eslint-config-next`,
  App Router, middleware/proxy, `next/image`, headers, webpack config, and
  build/lint script implications.
- Inventory local migration risk in `next.config.mjs`, `src/middleware.ts`,
  App Router pages/layouts/loading/error boundaries, server actions, API route
  handlers, `next/image` usage, and package/test tooling that depends on Next.
- Decide whether the implementation should migrate directly to the npm audit fix
  target, stop at a lower patched major if npm metadata supports it, or require
  owner acceptance of temporary residual risk.
- Define the verification plan for the implementation task, including auth,
  admin, public archive, shop product detail, build, lint, and focused Jest
  coverage.
- Create or update a follow-up implementation task brief if the owner accepts a
  migration target.

Out of scope:

- Do not edit `package.json`, `package-lock.json`, Next config, source files, or
  tests in this preflight task.
- Do not perform the Next major migration.
- Do not combine this with the `bcrypt@6` package change; T-016 owns that
  smaller dependency path.
- Do not add CI/update automation; F-064 owns that follow-up.

## Concurrency

This is a non-mutating audit/planning task. It may inspect package metadata,
source files, docs, and audit output, but it should not own package manifests.

## Acceptance Criteria

- The current npm audit fix target and any viable patched lower-major target
  are documented with package metadata evidence.
- Node, React, `eslint-config-next`, and build/lint/runtime constraints are
  documented.
- Local code and config surfaces likely to break under the migration are listed.
- The implementation path is documented as direct migration, staged migration,
  or accepted-risk defer requiring owner approval.
- A ready implementation task brief exists if a migration path is accepted.

## Outcome

Completed on 2026-05-14.

### Current Audit And Package Metadata

`npm audit --omit=dev --json` still exits 1 with 2 production-tree
vulnerabilities after T-016:

| Package path | Severity | Advisory path | npm fix availability |
| --- | --- | --- | --- |
| `node_modules/next` (`next@14.2.35`) | High | Direct Next advisories plus the nested PostCSS effect. Direct Next advisory ranges are fixed by `15.5.16+`, but npm currently recommends `next@16.2.6`. | `next@16.2.6`, semver-major. |
| `node_modules/next/node_modules/postcss` (`postcss@8.4.31`) | Moderate | Bundled under `next`; root `postcss@8.5.14` is not the vulnerable path. | npm reports `next@16.2.6`, semver-major, but isolated metadata/audit checks show this stable target still bundles vulnerable PostCSS. |

Current installed top-level versions:

- `next@14.2.35`
- `eslint-config-next@14.2.35`
- `react@18.3.1`
- `react-dom@18.3.1`
- root `postcss@8.5.14`

Relevant npm metadata checked on 2026-05-14:

| Candidate | Node engine | React peers | Bundled PostCSS | Audit result / disposition |
| --- | --- | --- | --- | --- |
| `next@15.5.18` | `^18.18.0 || ^19.8.0 || >= 20.0.0` | `^18.2.0 || ... || ^19.0.0` | `8.4.31` | Not viable to clear both residual advisories because bundled PostCSS remains `<8.5.10`. |
| `next@16.2.6` (`latest`) | `>=20.9.0` | `^18.2.0 || ... || ^19.0.0` | `8.4.31` | npm audit recommends it from the current app, but an isolated `next@16.2.6` lockfile still reports 2 moderate vulnerabilities through PostCSS. |
| `next@16.3.0-canary.6` | `>=20.9.0` | not used as a production target | `8.5.10` | Isolated lockfile audit reports 0 vulnerabilities, but this is a canary release and is not recommended as the production migration target without explicit owner approval. |
| `next@canary` (`16.3.0-canary.19`) | `>=20.9.0` | not used as a production target | `8.5.10` | Confirms the PostCSS fix has landed on canary, not on the current stable `latest` dist-tag. |

The exact npm audit fix target is therefore misleading for the full residual
Next/PostCSS objective: `next@16.2.6` is the current stable `latest` and removes
the high direct Next ranges, but package metadata and an isolated audit show it
does not clear the nested PostCSS advisory. No patched lower-major stable target
was found that clears both advisories.

### Migration Decision

Implementation path: accepted-risk defer requiring owner/orchestrator approval.

Do not perform a production package migration directly to `next@16.2.6` as a
"full audit clear" task. It would still leave the PostCSS advisory and would
also require a Next 14 -> 16 migration. Do not migrate to `16.3.0-canary.6+`
unless the owner explicitly accepts canary framework risk.

Recommended path:

1. Wait for a stable Next release whose package metadata declares bundled
   `postcss@8.5.10` or newer, then create a package-owner implementation task
   for that stable target.
2. Before package edits, re-run:
   `npm view next version --json`,
   `npm view next@<target> engines peerDependencies dependencies --json`, and
   an isolated temp lockfile `npm audit --omit=dev --json`.
3. If production timing requires an earlier move, the owner must choose between
   migrating to stable `next@16.2.6` with explicit temporary acceptance of the
   residual moderate PostCSS advisory, or migrating to a canary with explicit
   acceptance of canary release risk.

No ready implementation task brief was created because no stable migration
target that clears both residual advisories has been accepted.

### Official Migration Constraints

Official Next guidance reviewed:

- [Next 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Proxy file convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

Documented constraints for a future implementation:

- Node: Next 16 requires Node `>=20.9.0`. The local audit environment was
  Node `v22.14.0` and npm `10.9.2`, but the repo still lacks committed runtime
  pins.
- React: package peers for `next@15.5.18` and `next@16.2.6` still allow
  React `18.2+` or React 19, while the official upgrade guides tell upgraders
  to install the latest React versions and the Next 15 guide documents React 19
  migration implications. The implementation owner must decide whether to keep
  React 18 initially because npm peers allow it, or include React 19 and
  `@types/react`/`@types/react-dom` major changes in the same migration.
- Async request APIs: Next 15 introduces async `cookies`, `headers`,
  `draftMode`, `params`, and `searchParams`; Next 16 removes synchronous access.
- Caching: Next 15 changes default caching for `fetch` and `GET` route handlers.
- Build: Next 16 uses Turbopack by default for `next dev` and `next build`.
  2026-05-24 update: the former custom `webpack` function in `next.config.mjs`
  was removed after Next.js reverted the development `devtool` override and
  emitted the improper-devtool warning. This specific Turbopack/default-webpack
  conflict is no longer present.
- Lint: Next 16 removes `next lint`. The repo's `npm run lint` script and
  legacy `.eslintrc.json` setup must migrate to the ESLint CLI. Metadata for
  `eslint-config-next@16.2.6` requires `eslint >=9.0.0`; the current app has
  `eslint@^8`.
- Middleware/proxy: Next 16 deprecates `middleware.ts` in favor of `proxy.ts`
  and a `proxy` export; Proxy defaults to the Node.js runtime and does not allow
  a `runtime` config option.
- Images: Next 16 changes `next/image` defaults for local image query strings,
  `minimumCacheTTL`, `imageSizes`, allowed `qualities`, local IP optimization,
  and maximum redirects. The app already uses `remotePatterns`, which is the
  recommended replacement for deprecated `images.domains`.
- Parallel routes: Next 16 requires explicit `default` files for parallel route
  slots. `src/app/admin/dashboard/@feed/default.tsx` and
  `src/app/admin/dashboard/@main/default.tsx` already exist.

### Local Migration Risk Inventory

| Surface | Evidence | Migration risk |
| --- | --- | --- |
| `next.config.mjs` | Defines `images.remotePatterns` and broad `headers` config. The former custom development `devtool` webpack hook was removed on 2026-05-24. | Image defaults and CSP/CORS behavior need smoke coverage. |
| `src/middleware.ts` | Exports `middleware`, uses `getToken`, checks protected/admin routes, logs request/token state, and matches broad non-auth paths. | Rename to `proxy.ts`/`proxy` during Next 16 migration; verify auth redirects, admin API 403 JSON, and public route pass-through. |
| App Router `params`/`searchParams` | Synchronous typed `params` or `searchParams` appear in dynamic pages/layouts and many route handlers, including `blog/[slug]`, `collections/[slug]`, `artwork/[artworkId]`, `shop/products/[productHandle]`, and dynamic API routes. | Convert these props/context objects to promises and await them, or use generated `PageProps`/`RouteContext` types after `next typegen`. This is the largest required code-edit surface. |
| `next/headers` usage | `serverPublicApi`, `serverAdminApi`, and `serverUserApi` pass `headers()` synchronously into fetcher configs. | Must migrate to async `headers()` before or with Next 16. The shared fetcher type may need async header resolution. |
| Data fetching and caching | Shopify client sets `next.revalidate`; many server loaders still use same-app HTTP fetchers; route handlers mostly rely on default behavior. | Next 15's uncached default `fetch`/GET behavior may change route freshness and build/static generation. Verify public archive, blog, collections, search, user/admin data, and shop product detail after migration. |
| `next/image` usage | Many components and shop/admin pages import `next/image`; allowed remote hosts are Cloudinary, Shopify CDN, and flaticon. | Verify public archive image grids, artwork detail magnifier, hero images, admin previews, user comment images, and Shopify product images under new image optimizer defaults. |
| Lint/test tooling | `package.json` uses `next lint`; Jest uses `next/jest`; tests mock `next/navigation`, `NextResponse`, and NextAuth. | Lint requires script/config migration. Jest should be kept under focused smoke tests because Next major changes can affect `next/jest` transforms and route-handler mocks. |
| Runtime pins | No committed `engines`, `.nvmrc`, `.node-version`, or `packageManager`; local preflight ran on Node `v22.14.0`. | Add or coordinate runtime/package-manager pins before a Next 16 deployment path, tracked separately by F-064. |

### Future Implementation Verification Plan

For an accepted stable target, the implementation task should run:

```bash
npm view next version --json
npm view next@<target> engines peerDependencies dependencies --json
npm view eslint-config-next@<target> engines peerDependencies dependencies --json
npm install next@<target> eslint-config-next@<target> <react decision> <eslint decision>
npm audit --omit=dev --json
npm ls next postcss react react-dom eslint eslint-config-next --depth=0
npm test -- --runTestsByPath __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/auth/bcryptHelper.test.ts __tests__/unit/api/cloudinarySigningRoute.test.ts __tests__/unit/api/shopSingleProductRoute.test.ts __tests__/unit/shopProductDetailPage.test.tsx __tests__/unit/api/publicArtworkRoute.test.ts __tests__/unit/data/getArtworkById.test.ts __tests__/unit/api/userCommentRoute.test.ts __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/validateNextConfigEnv.test.ts
npm test
npm run env:guard
npm run lint
npm run build
```

Manual or scripted smoke coverage should include:

- Public archive browse and artwork detail: `/`, `/artwork`,
  `/artwork/[artworkId]`, `/collections`, `/collections/[slug]`.
- Blog/search: `/blog`, `/blog/[slug]`, `/search?q=<known term>`.
- Shop product list/detail: `/shop/products`,
  `/shop/products/[productHandle]`.
- Auth/admin: sign-in form, protected account redirect, admin dashboard
  redirect/allow behavior, admin Cloudinary signing route 401/403/success
  cases.

Keep browser automation narrow if used: route-level checks, targeted selectors,
and small screenshots only.

## Verification

```bash
npm audit --omit=dev --json
npm view next@<target> engines peerDependencies dependencies --json
```

No build/test run is required unless the task expands into code or package
edits.

Verification run on 2026-05-14:

- `npm audit --omit=dev --json`: exits 1 with 2 residual production
  vulnerabilities, documented above.
- `npm ls next react react-dom eslint-config-next postcss --depth=0`:
  confirmed current installed top-level versions.
- `npm view next version --json`: returned `16.2.6`.
- `npm view next@15.5.18 engines peerDependencies dependencies --json`:
  confirmed the latest Next 15 patch still bundles `postcss@8.4.31`.
- `npm view next@16.2.6 engines peerDependencies dependencies --json`:
  confirmed Node `>=20.9.0`, React 18.2+/19 peer support, and bundled
  `postcss@8.4.31`.
- `npm view eslint-config-next@16.2.6 peerDependencies dependencies engines --json`:
  confirmed `eslint >=9.0.0`.
- Isolated temp `next@16.2.6` lockfile audit under
  `/private/tmp/t015-next-audit-check-20260514`: exits 1 with 2 moderate
  vulnerabilities through bundled PostCSS.
- `npm view next@16.3.0-canary.6 dependencies engines --json` and
  `npm view next@canary version dependencies engines --json`: confirmed
  canary Next declares `postcss@8.5.10`.
- Isolated temp `next@16.3.0-canary.6` lockfile audit under
  `/private/tmp/t015-next-canary-audit-check-20260514`: exits 0 with no
  vulnerabilities.
- Targeted local source/config inventory used `rg` and `sed` against
  `next.config.mjs`, `src/middleware.ts`, App Router files, `next/headers`,
  `next/image`, package scripts, Jest config, and ESLint config.
- No build/test/lint run was required because this task did not edit package
  manifests or runtime code.

## Escalate

Escalate to the owner/orchestrator if:

- Production launch timing requires temporarily accepting residual Next
  advisories.
- The migration requires React 19, Node runtime, deployment platform, or App
  Router architecture decisions.
- The verification plan cannot cover build behavior without live MongoDB,
  Google Fonts network access, or production-like environment variables.
