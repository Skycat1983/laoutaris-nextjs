# T-022 Prune Unused Package Candidates

Status: Completed

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove confirmed-unused direct dependencies that increase install-script,
lockfile, and audit surface, without mixing package cleanup into feature
changes.

## Why Now

A-014 and A-019 identified unused direct dependencies. T-019 also removed the
last known `jose` imports with the legacy custom session helpers. The current
highest-confidence package cleanup candidates are now independent of runtime
feature work.

This task addresses:

- [F-034](../audits/findings-register.md): unused direct dependencies need a
  package-focused cleanup with lockfile and full verification.
- [F-065](../audits/findings-register.md): install lifecycle scripts need an
  explicit policy, especially the `core-js` path pulled by unused
  `next-test-api-route-handler`.
- [R-011](../risks/production-readiness.md): unused dependencies obscure
  production risk.
- [R-017](../risks/production-readiness.md): dependency health and supply-chain
  controls are not production-ready.

## Read First

- [A-014 Unused code and dependency pruning](../audits/results/A-014-unused-code-dependency-pruning.md)
- [A-019 Dependencies and supply chain](../audits/results/A-019-dependencies-supply-chain.md)
- [T-019 Prune legacy auth session path](T-019-legacy-auth-session-pruning.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Architecture refactor and code health workstream](../workstreams/architecture-refactor-and-code-health.md)

## Scope

In scope:

- Re-run targeted import/reference searches before editing package files.
- Remove confirmed-unused direct package candidates from `package.json` and
  refresh `package-lock.json`. Current candidates to verify first:
  `jose`, `next-test-api-route-handler`, and `@types/uuid`.
- Reassess the A-014/A-019 zero-import candidates
  `@shopify/shopify-api`, `graphql-request`, and `graphql`, but do not remove
  them unless repo evidence and current Shopify architecture docs confirm raw
  Storefront `fetch` remains the accepted direction.
- Confirm whether removing `next-test-api-route-handler` removes the unused
  `core-js` install-script path from the lockfile.
- Keep `bcrypt` install-script/native-build policy documented as a separate
  residual item unless package verification surfaces a new issue.
- Run package/audit/test/build verification and update this task, findings,
  risks, deployment, architecture, and testing docs after completion.

Out of scope:

- Do not change runtime source code except import cleanup that is directly
  required after package removal.
- Do not upgrade Next or address residual Next/PostCSS advisories.
- Do not remove UI libraries or Shopify/GraphQL packages that still have a
  plausible near-term owner without documenting the decision evidence.
- Do not add CI, Dependabot, Renovate, package-manager pins, or Node runtime
  pins; F-064 owns that follow-up.

## Concurrency

You are not alone in the repo. This task owns `package.json`,
`package-lock.json`, package-focused verification, and directly related docs
while it runs. Avoid overlapping package edits with any dependency, Next, or
tooling task.

## Acceptance Criteria

- Package removals are backed by fresh reference-search evidence.
- `npm ls` confirms removed packages are absent or only transitive where
  expected.
- The unused `next-test-api-route-handler -> core-js` path is gone, or the
  task documents why it remains.
- Production audit output is no worse than before, with residual Next/PostCSS
  risk still tracked separately.
- Full Jest, lint, and build verification are recorded, or environment
  blockers are documented.

## Verification

```bash
rg "from ['\\\"]jose|from ['\\\"]next-test-api-route-handler|testApiHandler|@types/uuid|from ['\\\"]@shopify/shopify-api|from ['\\\"]graphql-request|from ['\\\"]graphql" src __tests__ docs package.json
npm install
npm ls jose next-test-api-route-handler core-js @types/uuid --all
npm audit --omit=dev --json
npm test
npm run lint
npm run build
```

## Outcome

Completed on 2026-05-14.

- Removed unused direct dependencies from `package.json` and refreshed
  `package-lock.json`: `jose`, `next-test-api-route-handler`, `@types/uuid`,
  `@shopify/shopify-api`, `graphql-request`, `graphql`, and the direct
  `@radix-ui/react-dialog` manifest entry.
- Current Shopify architecture and implementation still use raw Storefront
  GraphQL `fetch` through `src/lib/api/shopify/shopifyClient.ts`, so the
  unused Shopify SDK and GraphQL client packages were removed.
- `next-test-api-route-handler` and its unused `core-js` install-script path
  are gone from the lockfile.
- `jose` remains installed only as a transitive auth dependency through
  `@auth/core`, `next-auth`, and `openid-client`.
- `@radix-ui/react-dialog` remains installed only as a transitive dependency of
  `vaul`.
- The residual `bcrypt` native install-script policy remains separate; this
  task removed the unused `core-js` lifecycle-script path only.

Verification run on 2026-05-14:

- Targeted runtime/package reference search for removed direct packages returned
  no matches in `src`, `__tests__`, scripts, config files, or `package.json`.
- `npm install` passed and removed 22 packages.
- `npm ls jose next-test-api-route-handler core-js @types/uuid @shopify/shopify-api graphql graphql-request @radix-ui/react-dialog --all`
  confirmed `next-test-api-route-handler`, `core-js`, `@types/uuid`, Shopify
  SDK, `graphql-request`, and `graphql` are absent; `jose` and
  `@radix-ui/react-dialog` remain only transitively as expected.
- `npm why core-js`, `npm why @shopify/shopify-api`,
  `npm why graphql-request`, and `npm why @types/uuid` found no dependency
  paths.
- `npm audit --omit=dev --json` exits 1 with the known residual production
  `next` and nested `next/node_modules/postcss` advisories only: 0 critical,
  1 high, 1 moderate, 2 total. This is no worse than the T-015/T-016 baseline.
- `npm audit --json` exits 1 with 11 total findings: 1 critical, 2 high,
  4 moderate, and 4 low, all in the existing Next/PostCSS and dev/test tooling
  advisory surface.
- `npm test` passed: 25 suites and 195 tests.
- `npm run lint` passed with no warnings or errors.
- `npm run build` was attempted twice. The first run failed while concurrent
  edits temporarily left `src/app/search/page.tsx` unavailable to Next's build
  entry tracing. The second run compiled successfully, then failed during page
  data collection for `/api/v2/public/search` because unrelated in-progress
  T-021 public-search schema code throws `Can't use "invalid_type_error" or
  "required_error" in conjunction with custom error map.` No package-removal
  compile or type error was observed.
- Follow-up from T-021: the public-search schema blocker was fixed and
  `npm run build` passed.

## Escalate

Escalate to the orchestrator if:

- Shopify package candidates are intentionally retained for near-term SDK work.
- Removing a package changes lockfile audit output in a way that introduces new
  production risk.
- `npm install` or build verification needs network access that is unavailable
  in the current environment.
