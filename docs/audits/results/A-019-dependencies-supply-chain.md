# A-019 Dependencies And Supply Chain Result

Status: Completed

Audit goal: [A-019 Dependencies and supply chain](../goals.md#a-019-dependencies-and-supply-chain)

Workstream: [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md)

## Summary

The dependency tree is reproducible from the checked-in npm lockfile, but it is
not production-ready. `npm audit --omit=dev --json` reports 18 production-tree
vulnerabilities, including a critical direct `next@14.2.5` exposure and high
direct exposures in `cloudinary`, `mongoose`, and `bcrypt`. The full tree audit
reports 31 vulnerabilities. The repo also lacks package-manager, Node runtime,
CI, and automated dependency-update controls, and A-014's unused dependency
candidates are confirmed by a fresh import scan.

No runtime code, package files, lockfiles, shared risk docs, or shared findings
register files were changed by this audit.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/audits/README.md`
  - `docs/audits/goals.md#a-019-dependencies-and-supply-chain`
  - `docs/workstreams/deployment-security-and-observability.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
- Related prior audit and tracking context:
  - `docs/audits/results/A-014-unused-code-dependency-pruning.md`
  - `docs/audits/results/A-007-deployment-environment.md`
  - `docs/audits/findings-register.md`
  - `docs/risks/production-readiness.md`
- Dependency and supply-chain surfaces:
  - `package.json`
  - `package-lock.json`
  - `node_modules` metadata through npm commands
  - `docs/runbooks/setup.md`
  - `docs/runbooks/deployment.md`
  - root package-manager/runtime control files
  - dependency imports in `src/`, `__tests__/`, `scripts/`, and config files

## Lockfile And Package Manager Health

| Check | Evidence | Result |
| --- | --- | --- |
| Lockfile format | `package-lock.json` has `lockfileVersion: 3`. | Good. npm lockfile is present and modern. |
| Manifest/lock agreement | A lockfile parser confirmed the root `dependencies` and `devDependencies` match `package.json`; no direct packages are missing from `node_modules`. | Good. |
| Install reproducibility | `npm ci --dry-run --ignore-scripts` completed and reported `added 939 packages in 46s`. | Good, with scripts disabled for the check. |
| Top-level install state | `npm ls --depth=0` exited 0 and listed all direct packages. | Good. |
| Integrity and source registry | Lock parser found 939 package entries, no non-registry `resolved` URLs, and zero resolved entries missing `integrity`. | Good. |
| Package manager pin | `package.json` has no `packageManager`; no `.npmrc` was found. | Gap. Agents and deploys can use different npm behavior. |
| Node runtime pin | `package.json` has no `engines`; no `.nvmrc` or `.node-version` was found. Local audit environment was Node `v21.2.0` and npm `10.2.3`. | Gap. Runtime drift can change install/build behavior. |
| CI/update automation | No `.github` workflows, Dependabot, or Renovate config were found. | Gap. Vulnerability and drift checks are manual. |
| Install runbook | `docs/runbooks/setup.md` uses `npm install`; `docs/runbooks/deployment.md` lists pre-deploy checks but not `npm ci`. | Gap. Production install discipline is not documented. |

## Package Purpose Inventory

| Area | Direct packages | Audit disposition |
| --- | --- | --- |
| Framework and rendering | `next`, `react`, `react-dom` | Live core stack. `next@14.2.5` is the highest-priority vulnerable package and should be updated before production. |
| Auth and accounts | `next-auth`, `@auth/mongodb-adapter`, `bcrypt`, `jose` | Live NextAuth and credential helpers use `next-auth`, adapter, and `bcrypt`. `jose` is still reachable through the legacy custom session path identified by A-014/A-004; remove it only after auth cleanup. |
| Database | `mongodb`, `mongoose` | Both are live: raw MongoDB supports the NextAuth adapter, and Mongoose supports models/routes. `mongoose@8.9.5` has a high advisory. |
| Cloudinary and media | `cloudinary`, `next-cloudinary`, `uuid` | Live admin upload/signing code uses these. `cloudinary@2.5.1` and `uuid@11.0.5` have advisories. |
| Shopify | `@shopify/shopify-api`, `graphql`, `graphql-request` | Current Shopify client uses raw `fetch`; fresh scan found zero imports for these direct packages. Confirm SDK direction, then prune if raw fetch remains canonical. |
| UI primitives and styling | Radix packages, `@headlessui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `vaul`, `lucide-react`, `framer-motion`, `embla-carousel-react` | Mostly live through shadcn, modal, navigation, carousel, and UI code. `@radix-ui/react-dialog` has zero imports. Some Headless UI imports are in A-014 unused components, but `Modal.tsx` remains live. |
| Forms, validation, dates, color | `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `react-day-picker`, `react-colorful`, `slugify` | Live in admin forms, schemas, date picker, color picker, and create/update routes. |
| Test and build tooling | `jest`, `jest-environment-jsdom`, Testing Library packages, `eslint`, `eslint-config-next`, `typescript`, `postcss`, `tailwindcss`, type packages | Live for tests/lint/build except `next-test-api-route-handler` and likely `@types/uuid`. Dev tree has several advisories and deprecated transitive packages. |

## Direct Dependency Usage Scan

Fresh import scanning across `src/`, `__tests__/`, `scripts/`, and config files
confirmed A-014's package cleanup candidates:

| Candidate | Current evidence | Recommended follow-up |
| --- | --- | --- |
| `@radix-ui/react-dialog` | Zero imports and no text references. Current modal code uses Headless UI dialog. | Remove if no pending shadcn dialog component is planned. |
| `@shopify/shopify-api` | Zero imports. `src/lib/api/shopify/shopifyClient.ts` uses raw Storefront GraphQL `fetch`. | Remove if raw fetch remains the accepted Shopify client strategy. |
| `graphql-request` | Zero imports. | Remove with the unused Shopify/GraphQL client set. |
| `graphql` | Zero imports; only text hit is the Shopify GraphQL URL string. | Remove if `graphql-request` and Shopify SDK are removed. |
| `next-test-api-route-handler` | Zero imports. `npm why core-js` shows it pulls `core-js`, which has an install script. | Remove unless route-handler tests are adopted immediately. |
| `@types/uuid` | Zero imports. `uuid@11` ships its own types. | Remove after TypeScript verification. |

## Known Vulnerability Exposure

`npm audit --omit=dev --json` reported 18 production-tree vulnerabilities:

| Severity | Count |
| --- | ---: |
| Critical | 1 |
| High | 9 |
| Moderate | 6 |
| Low | 2 |

Direct or production-relevant packages called out by the production audit:

| Package | Severity | Evidence | Fix direction |
| --- | --- | --- | --- |
| `next@14.2.5` | Critical | Multiple Next.js advisories; audit reports `fixAvailable` as `next@14.2.35` without a semver-major jump. | Upgrade within Next 14 first, then retest build/routes/auth/admin/shop. |
| `cloudinary@2.5.1` | High | GHSA-g4mf-96x5-5m2c arbitrary argument injection; package is used by the admin signing route. | Upgrade to at least `2.7.0`; current `npm outdated` wanted/latest is `2.10.0`. |
| `mongoose@8.9.5` | High | GHSA-wpg9-53fq-2r8h NoSQL injection through `$nor` sanitization. | Upgrade within Mongoose 8 first; current wanted is `8.23.1`. |
| `bcrypt@5.1.1` | High | Direct package is affected through `@mapbox/node-pre-gyp` and vulnerable `tar`; audit fix is `bcrypt@6.0.0` and semver-major. | Plan a focused credential-hashing compatibility check before upgrading. |
| `next-auth@4.24.11` | Moderate | NextAuth email misdelivery advisory plus transitive `@auth/core`/`cookie`; audit says fix available. | Upgrade to current `4.24.14` and rerun auth/session tests. |
| `uuid@11.0.5` | Moderate | GHSA-w5hq-g745-h8pq for missing buffer bounds check in v3/v5/v6 when `buf` is provided. | Upgrade to at least `11.1.1`; reassess `@types/uuid`. |
| `postcss` | Moderate | Production audit includes `postcss <8.5.10` through `next` and root `postcss`. | Upgrade through the Next patch and root dev dependency if still needed. |

The full `npm audit --json` report, including dev dependencies, reported 31
total vulnerabilities: 2 critical, 14 high, 9 moderate, and 6 low. The extra
critical is `form-data` through `jest-environment-jsdom`/`jsdom`, confirmed by
`npm why form-data`, so it affects the test/dev toolchain rather than the
runtime deployment tree.

## Supply-Chain Risk Notes

- Required install lifecycle scripts exist in the lockfile for `bcrypt` and
  `core-js`; `fsevents` is optional. `bcrypt` is a native package and currently
  brings the high `tar` advisory through `@mapbox/node-pre-gyp`.
- `core-js` is pulled by unused `next-test-api-route-handler`, so pruning that
  unused package can remove one required install script from the tree.
- Lockfile metadata lists 15 deprecated packages, mostly from old Jest/ESLint
  transitive chains: `@humanwhocodes/*`, old `glob`, `rimraf@3`, `inflight`,
  `npmlog`, `gauge`, `are-we-there-yet`, `abab`, `domexception`, and `q`.
- `npm outdated --json` returned many production packages behind current
  patch/minor ranges and several major-version gaps, including `next` 16,
  React 19, MongoDB 7, Mongoose 9, `jose` 6, `zod` 4, and `uuid` 14. Production
  remediation should prioritize security patch lines before broad major
  migrations.
- Most direct dependency ranges use `^`, while the framework pair
  `next`/`eslint-config-next` is pinned exactly. The lockfile prevents drift
  only when installs honor it; the repo does not yet enforce `npm ci` in CI or
  deployment docs.

## Commands Run

- `sed -n '1,240p' docs/README.md`: read canonical docs entry point.
- `sed -n '1,260p' docs/audits/goals.md`: read audit index and A-019 goal.
- `sed -n '296,314p' docs/audits/goals.md`: read exact A-019 scope.
- `sed -n '1,220p' docs/audits/README.md`: read audit workflow and shared-file ownership.
- `sed -n '1,220p' docs/workstreams/README.md`: read workstream process.
- `sed -n '1,260p' docs/workstreams/deployment-security-and-observability.md`: read linked workstream.
- `sed -n '1,280p' docs/workstreams/architecture-refactor-and-code-health.md`: read linked workstream.
- `sed -n '1,240p' docs/risks/production-readiness.md`: checked existing dependency risk coverage.
- `sed -n '1,260p' docs/audits/results/A-014-unused-code-dependency-pruning.md`: read prior dependency pruning findings.
- `sed -n '1,220p' docs/audits/results/README.md`: read result format requirements.
- `sed -n '1,260p' package.json`: inspected scripts and direct dependencies.
- `sed -n '1,80p' package-lock.json`: inspected lockfile header and root package block.
- `git status --short`: confirmed a dirty worktree existed before this result edit; unrelated changes were left untouched.
- `rg --files -g 'package.json' -g 'package-lock.json' -g 'npm-shrinkwrap.json' -g 'yarn.lock' -g 'pnpm-lock.yaml' -g '.npmrc' -g '.nvmrc' -g 'Dockerfile' -g '.github/**'`: found only `package.json` and `package-lock.json`.
- `rg -n "npm install|npm ci|npm audit|dependabot|renovate|package-lock|packageManager|engines|node-version|actions/setup-node|permissions:|workflow_dispatch|pull_request|npm run" .github docs package.json README.md`: failed for missing `.github`, then still returned package/doc hits. No files changed.
- `npm ls --depth=0`: passed and listed all top-level dependencies.
- `npm ci --dry-run --ignore-scripts`: passed and reported `added 939 packages in 46s`.
- Lockfile parser with `node -e`: confirmed 61 direct dependencies, 939 package entries, root manifest/lock agreement, zero missing direct packages, zero non-registry tarballs, zero missing integrity entries, and install scripts for `bcrypt`, `core-js`, and optional `fsevents`.
- Import usage scanner with `node -e`: scanned `src/`, `__tests__/`, `scripts/`, and config files for direct package imports.
- Direct package metadata parser with `node -e`: inspected direct package versions, engines, peer dependencies, and install-script flags from the lockfile.
- `find . -maxdepth 3 -name '.npmrc' -o -name '.nvmrc' -o -name '.node-version' -o -name 'renovate.json' -o -name 'dependabot.yml' -o -name 'dependabot.yaml' -o -name 'vercel.json' -o -name 'Dockerfile'`: found no package-manager/runtime/update-control files.
- `npm audit --json`: failed in the default sandbox with `getaddrinfo ENOTFOUND registry.npmjs.org`, then passed with approved registry access and reported 31 total vulnerabilities.
- `npm audit --omit=dev --json`: passed with approved registry access and reported 18 production-tree vulnerabilities.
- `npm outdated --json`: passed with approved registry access and returned many stale direct production packages.
- `npm why form-data`: confirmed the full-audit critical `form-data` path is dev-only through `jest-environment-jsdom`/`jsdom`.
- `npm why lodash`: confirmed vulnerable `lodash` is pulled by both `cloudinary` and dev `@testing-library/jest-dom`.
- `npm why core-js`: confirmed `core-js` is pulled by unused `next-test-api-route-handler`.
- `npm fund --json`: showed 178 funded packages; informational only.
- `node --version`: local audit environment was `v21.2.0`.
- `npm --version`: local audit environment was npm `10.2.3`.
- `ls -la`: checked root package-manager/runtime control files without reading local `.env`.
- `sed -n '1,120p' next.config.mjs`: checked image/CSP context relevant to Next advisory exposure.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| Critical | The production dependency tree has active critical/high advisories in live runtime packages. | `npm audit --omit=dev --json` reports 18 production-tree vulnerabilities, including critical direct `next@14.2.5`, high direct `cloudinary@2.5.1`, high direct `mongoose@8.9.5`, and high direct `bcrypt@5.1.1`. | Create an urgent dependency security task: patch Next to `14.2.35`, patch Cloudinary/Mongoose/NextAuth/uuid within current major lines, plan the bcrypt 6 compatibility change, then run `npm test`, `npm run lint`, `npm run build`, and targeted auth/admin/upload/shop checks. |
| High | Dev and quality tooling also carries critical/high advisories, so CI/test machines remain exposed and future audits stay noisy. | Full `npm audit --json` reports 31 total vulnerabilities. `npm why form-data` traces a critical dev-only issue through `jest-environment-jsdom`/`jsdom`; `eslint-config-next` also has high transitive exposure. | Upgrade dev tooling in a separate task after runtime patches, or explicitly document acceptable dev-only residual advisories with owner review. |
| High | Supply-chain update controls are missing. | No `packageManager`, `engines`, `.nvmrc`, `.node-version`, `.npmrc`, `.github` workflow, Dependabot, or Renovate config was found. Setup docs use `npm install`; deployment docs do not require `npm ci`. | Add package-manager and Node runtime pins, switch install/deploy docs to `npm ci`, and add a CI/dependency-update plan that runs audit, lint, test, and build. |
| Medium | Unused direct dependencies increase vulnerability and install-script surface. | Fresh import scan found zero imports for `@radix-ui/react-dialog`, `@shopify/shopify-api`, `graphql-request`, `graphql`, `next-test-api-route-handler`, and `@types/uuid`; `npm why core-js` shows unused `next-test-api-route-handler` pulls required-script `core-js`. | Reconcile Shopify SDK direction, then run a package-focused cleanup that removes unused direct packages and updates `package-lock.json` with full verification. |
| Medium | Required install lifecycle scripts are not governed by policy. | Lock parser found required install scripts for `bcrypt` and `core-js`, plus optional `fsevents`. `bcrypt` is also the path to high `tar` advisories through `@mapbox/node-pre-gyp`. | Document install-script expectations; reduce scripts by pruning `next-test-api-route-handler`; handle `bcrypt@6` upgrade and native-build requirements explicitly. |
| Medium | The dependency baseline is stale beyond immediate advisories. | `npm outdated --json` returned many direct packages behind current patch/minor ranges and major lines, including Next, React, MongoDB, Mongoose, Jose, Zod, UUID, and Tailwind helpers. | After security patches, establish a recurring dependency update cadence and group major migrations by workstream risk. |
| Low | Deprecated transitive packages remain in the lockfile. | Lock parser found 15 deprecated entries, mostly old Jest/ESLint transitive packages and `rimraf@3`/old `glob` chains. | Address through dev-tool upgrades; do not chase transitive overrides before direct package updates are planned. |

## Findings Register Updates

- Reconciled by the orchestrator on 2026-05-14 into F-063 through F-066, with a
  source update to existing F-034.
- Candidate reconciliation rows retained for audit trace:

| Candidate severity | Area | Candidate finding |
| --- | --- | --- |
| Critical | Dependencies/Security | Production dependency audit reports critical/high runtime vulnerabilities in `next`, `cloudinary`, `mongoose`, and `bcrypt`; patch before production launch. |
| High | Supply chain | Package-manager, Node runtime, CI, and automated dependency-update controls are missing. |
| Medium | Code health/Supply chain | Unused direct dependencies should be pruned in a package-focused cleanup with lockfile verification. |
| Medium | Supply chain | Required install lifecycle scripts need an explicit policy, especially native `bcrypt` and unused `next-test-api-route-handler`'s `core-js` path. |
| Medium | Quality/Supply chain | Dev/test tooling carries critical/high advisories and deprecated transitive packages. |

## Risks Updated

- Reconciled by the orchestrator on 2026-05-14.
- Updated R-017 from a pending dependency audit risk to a critical open
  dependency/supply-chain risk covering active production advisories, missing
  controls, unused direct dependency cleanup, install-script policy, and dev
  tooling advisories.

## Workstream Updates

- Updated
  `docs/workstreams/deployment-security-and-observability.md` current facts,
  backlog, progress, and next agent action for the completed A-019 audit.
- Updated `docs/workstreams/testing-and-quality.md` for dependency verification
  and residual advisory tracking.
- Created
  [T-011](../../tasks/T-011-production-dependency-security-patch.md) for the
  production dependency security patch task.

## Verification

- This was a non-mutating audit.
- Verification used npm lockfile checks, npm install dry-run, npm advisory data,
  npm staleness data, npm dependency path explanations, direct import scans,
  and package-manager control-file searches.
- No `npm test`, `npm run build`, or `npm run lint` was run because no runtime
  behavior or package files changed.

## Next Action

Run
[T-011 Patch Production Dependency Security Baseline](../../tasks/T-011-production-dependency-security-patch.md)
as the package-owner task, then record residual production advisories and full
verification results.
