# Deployment, Security, And Observability Workstream

Status: Active

Goal: prepare the app for production deployment with safe configuration,
security headers, environment documentation, and actionable operational signals.

## Depends On

- [Deployment runbook](../runbooks/deployment.md)
- [Environment variables runbook](../runbooks/environment.md)
- [System overview](../architecture/system-overview.md)
- [Production-readiness risks](../risks/production-readiness.md)
- [A-019 Dependencies and supply chain](../audits/goals.md#a-019-dependencies-and-supply-chain)
- [A-020 Privacy, consent, and commerce compliance](../audits/goals.md#a-020-privacy-consent-and-commerce-compliance)
- [A-021 Observability and incident response](../audits/goals.md#a-021-observability-and-incident-response)
- [A-022 Next.js feature utilization](../audits/goals.md#a-022-nextjs-feature-utilization)

## Blocks

- Production launch.
- Secure Shopify and admin release.
- Incident response readiness.

## Related Code Areas

- `next.config.mjs`
- `src/middleware.ts`
- `src/lib/config/`
- `src/lib/db/`
- Vercel project settings
- Environment variables outside the repo

## Current Facts

- Deployment target in the README is Vercel.
- `next.config.mjs` configures remote image patterns and headers.
- CSP currently allows broad `https:` and inline/eval script behavior.
- API CORS headers are broad.
- Shopify, MongoDB, NextAuth, OAuth, and Cloudinary require environment
  variables.
- A-001 found a Shopify credential-like value in source comments that must be
  verified and removed.
- A-006 found build verification depends on Google Fonts network access and live
  MongoDB/environment behavior during static generation.
- Completed audits found debug logging across build, SSR, DB, fetcher, and shop
  paths that needs a production logging policy.
- A-019 completed the dependency/supply-chain audit and found active
  production-tree vulnerabilities in `next`, `cloudinary`, `mongoose`,
  `bcrypt`, `next-auth`, `uuid`, and `postcss`, plus missing package-manager,
  Node runtime, CI, and dependency-update controls.
- T-011 patched current-major production dependency advisories with
  `next@14.2.35`, `cloudinary@2.10.0`, `mongoose@8.23.1`,
  `next-auth@4.24.14`, `uuid@11.1.1`, root dev `postcss@8.5.14`, and targeted
  transitive overrides. The production audit now has no critical advisories but
  still reports residual Next/PostCSS advisories requiring the T-015 major
  migration preflight.
- T-014 decided the residual dependency direction: run a Next major migration
  preflight audit first through T-015, and run the focused `bcrypt@6.0.0`
  compatibility/security patch through T-016.
- T-016 upgraded `bcrypt` to `6.0.0` and removed the
  `bcrypt -> @mapbox/node-pre-gyp -> tar` production advisory path. No residual
  production advisory has been accepted for launch.
- T-015 confirmed the residual Next/PostCSS path does not currently have an
  accepted stable fix target: npm recommends stable `next@16.2.6`, but isolated
  metadata/audit checks show that release still bundles vulnerable
  `postcss@8.4.31`; canary `16.3.0-canary.6+` declares `postcss@8.5.10` and
  clears an isolated audit but needs explicit owner acceptance before use.
- A-007 completed the deployment/environment audit and found `MONGO_URI` is
  exposed through `next.config.mjs` `env`, the environment runbook misses active
  variables and decisions, build verification depends on live MongoDB and
  external network access, URL construction is hard-coded/inconsistent,
  Cloudinary upload variables are undocumented, smoke checks are manual, and
  runtime/Vercel/rollback settings are not pinned.
- T-005 added a route-local admin guard, request validation, and missing-secret
  handling to the Cloudinary signing endpoint.
- T-006 added `npm run env:guard`, a build precheck that rejects known
  server-only secrets and secret-like env names in `next.config.mjs` `env`.
- A-008 completed the security headers/CORS/logging audit and confirmed broad
  wildcard API CORS, permissive CSP, missing hardening headers, raw
  credential-bearing registration logs, always-on request/debug logs, and raw
  API exception messages.
- T-009 removed direct registration credential logging and the Shopify
  token-shaped source comment; owner verification/rotation for the removed
  Shopify value remains open.
- T-022 removed unused direct dependencies, including `jose`,
  `next-test-api-route-handler`, `@types/uuid`, Shopify/GraphQL client
  packages, and the direct Radix dialog manifest entry. The unused
  `next-test-api-route-handler -> core-js` install-script path is gone from the
  lockfile; production audit output remains limited to the known residual
  Next/PostCSS advisories from T-015.
- The 2026-05-14 Vercel bcrypt native trace incident produced a local fix in
  `next.config.mjs`: `experimental.outputFileTracingIncludes` now includes
  `node_modules/bcrypt/prebuilds/**/*` so Vercel serverless functions include
  the Linux native bcrypt prebuild.
- T-023 completed the follow-up that reduces reliance on native bcrypt
  packaging for public pages by removing bcrypt from the normal root-layout
  import path.
- T-024 confirmed the bcrypt native-load crash is resolved in production:
  `origin/main` matched local `HEAD` with the T-023 auth import-boundary change,
  the owner reported the deployment no longer crashes, and
  `curl -I https://laoutaris-nextjs.vercel.app/` returned `HTTP/2 200`.
- T-025 converted the remaining Vercel smoke repeatability gap into a
  deployment runbook checklist with exact evidence fields, minimum route
  expectations, credentials smoke handling, targeted Vercel log requirements,
  rollback triggers, and a dependency-free `npm run smoke:public` helper for
  unauthenticated public-route status checks.
- T-041 removed always-on middleware debug logs while fixing middleware API auth
  responses; broader production logging/redaction policy remains separate.
- T-044 completed a route-local public-safe API response slice for protected
  user read routes. It does not define the broader production logging,
  redaction, monitoring, or request-correlation policy.
- T-045 completed the next route-local public-safe API response slice, scoped to
  public content detail route failure bodies and direct debug-log removal in
  touched blog handlers.
- T-046 completed the next route-local public-safe API response slice, scoped to
  public collection route failure bodies and removal of touched collection
  request debug logging.
- T-047 completed the next route-local public-safe API response slice, scoped
  to public navigation route failure bodies and removal of touched navigation
  debug logging. Broader logging/redaction policy remains separate.
- A-020 completed the privacy, consent, and commerce compliance audit. It found
  missing public policy pages, newsletter consent/source and unsubscribe gaps,
  account privacy/self-service gaps, comment posting/moderation notice gaps,
  contact/enquiry notice and product-context gaps, third-party disclosure gaps,
  and commerce assurance copy that is ahead of checkout and policy pages.
- A-021 completed the observability and incident-response audit. It confirmed
  T-025 is a useful deployment-smoke baseline, but found no monitoring
  provider/instrumentation, no request/correlation ID policy, no structured
  redacted logger, no incident-response runbook or alert owner matrix, and no
  continuous smoke/monitoring setup. T-099 later added a provider-neutral
  request ID and structured logging foundation for a representative route
  slice, and T-116 later added the incident-response runbook with owner matrix
  placeholders that T-134 converted into explicit blocked owner-decision rows.
- T-123 added the provider-neutral
  [monitoring and error-reporting architecture plan](../architecture/monitoring-and-error-reporting.md).
  The app still has no monitoring SDK, no `instrumentation.ts`, no alert
  automation, no approved provider environment contract, and no owner-approved
  incident-response role assignments.
- T-124 added `.github/workflows/public-smoke.yml` so `npm run smoke:public`
  can run from GitHub Actions manually with a supplied `base_url` and on a
  schedule after repository variable `SMOKE_BASE_URL` is configured. This
  remains unauthenticated and does not cover credential/admin smoke, Vercel log
  inspection, rollback automation, or provider alerts.
- T-280 removed the localhost socket requirement from the public smoke
  discovery endpoint unit test without changing deployed smoke behavior. The
  real `npm run smoke:public` CLI remains the deployment smoke entry point; the
  focused Jest suite now uses an in-process `fetch` fixture and default-sandbox
  verification.
- T-283 removed live biography and collection navigation reads from the global
  root header main nav. `npm run build` passed without root-header
  `loader.public.main_nav.failed` output.
- T-125 added the
  [logging and redaction architecture policy](../architecture/logging-and-redaction.md).
  The 2026-05-18 non-route source inventory found 86 direct
  `console.error()`/`console.warn()` calls across 66 files outside API-v2 route
  handlers and the structured logger sink. T-126 completed the first public
  loader/page implementation slice; provider SDK installation and alert
  automation remain blocked on owner/platform approval.
- T-126 added `createServerLogger()` for server contexts without a request ID
  and migrated the scoped public loader/App Router page failure paths to
  redacted structured events. The scoped source search is clean for direct
  `console.error()`/`console.warn()` calls.
- T-127 migrated the scoped Shopify provider/data service failure paths to
  requestless structured server logging. Storefront HTTP/GraphQL/fetch
  failures, malformed featured-artwork metafields, and linked-product fan-out
  failures now log safe provider operation metadata, coarse status categories,
  public handles/IDs, and normalized errors without raw provider payloads.
- T-128 migrated scoped server action and development test-header session
  helper failure paths to requestless structured server logging. Subscription
  persistence failures, saved-item incomplete/unexpected mutation failures, and
  development lookup failures now log safe operation/status metadata and
  normalized generic errors without submitted payloads, emails, user IDs,
  artwork IDs, raw headers, raw sessions, or raw caught errors.
- T-129 migrated the remaining account saved-artwork server loader failure path
  to requestless structured server logging. Missing-session, missing-artwork,
  not-in-favourites, and unexpected non-Next failures now log safe loader
  operation metadata, coarse status categories, `hasArtworkId`, and normalized
  generic errors without user IDs, raw artwork IDs, session data, service
  results, or raw caught errors. Client components and admin dashboard clients
  remain separate.
- T-130 removed direct `console.error()` calls from the scoped public browsing
  client files. Artwork filtering/loading, blog continuous loading/comments,
  infinite-scroll errors, and shop product filter failures now rely on existing
  UI state, modals, loading reset, or fallback/current-result behavior instead
  of browser console output.
- T-131 removed direct `console.error()` calls from the scoped account/user
  client files. Contact/comment forms, logout, account navigation,
  `CommentCard` owner actions, and `ErrorBoundary` now rely on existing form
  state, modals, loading reset, callbacks, navigation behavior, or fallback UI
  instead of browser console output.
- T-132 removed direct `console.error()`/`console.warn()` calls from the scoped
  shared fetcher, date/translation utilities, copy helper/card, color icon, and
  blog sidebar files. Fetcher envelopes, Next control-flow rethrows,
  date/translation fallback strings, copy attempts, no-element color fallback,
  and blog sidebar state are preserved with focused source-hygiene and behavior
  coverage.
- T-133 removed the remaining known non-route direct `console.error()`/
  `console.warn()` calls from admin dashboard clients across CRUD forms, read
  lists, operation tabs, feeds, upload handling, and the document reader.
  Recursive admin dashboard source hygiene now guards that area, and the known
  non-route direct console error/warn inventory is clear except the approved
  structured logger sink.
- T-134 completed the incident-response owner-matrix follow-up as an explicit
  blocked owner-decision handoff. No owner-approved names, team aliases, or
  permanent backups were available, so the runbook now states the missing
  decision, interim owner/orchestrator escalation path, next owner action, and
  authority boundary for incident command, Vercel rollback/logs, repository
  release approval, MongoDB, Shopify, Cloudinary, auth/OAuth, DNS/domain/TLS,
  and privacy/legal communication.
- T-279 documented the external-access build evidence policy for intentional
  static/ISR build-time surfaces. Release handoffs must state whether
  `npm run build` had external access, smoke the `/biography` and
  `/collections` redirect targets, and verify expected dynamic
  `/sitemap.xml` archive/shop URLs when those entries are expected.
- T-274 added the
  [production ops owner decision packet](../runbooks/production-ops-owner-decision-packet.md)
  for A-033 blockers. Monitoring implementation, incident owner-matrix
  completion, Vercel log/rollback authority, credentialed smoke, and scheduled
  public-smoke detail coverage remain blocked until the owner/orchestrator
  supplies those answers.
- T-138 added the admin bootstrap and recovery workflow to the
  [auth runbook](../runbooks/auth.md), including sanitized evidence rules,
  sign-out/sign-in requirements after MongoDB role changes, credential/OAuth
  verification, and lockout recovery boundaries.
- A-010 completed the performance, SEO, and accessibility audit. It found all
  public routes still build as dynamic because of global root layout and
  middleware request-time work, production metadata/discovery files are missing,
  and public accessibility gaps are not covered by lint.
- A-022 completed the Next.js feature-utilization audit. It confirmed remaining
  deployment-relevant gaps around broad middleware matching, implicit
  deploy-bound freshness for static sitemap/default redirects, lack of Next.js
  instrumentation/web-vitals, and the need to keep the future `proxy.ts` rename
  in the Next major migration track instead of the current Next 14 middleware
  matcher slice.
- T-103 added production-safe root archive metadata plus baseline
  `robots.ts`/`sitemap.ts` discovery files using a fixed public site URL
  helper. Route-specific metadata, JSON-LD, and deployment smoke assertions for
  discovery endpoints remain separate.
- T-106 added route-specific metadata and conservative JSON-LD for public
  biography article and blog detail pages while keeping deployment smoke
  automation, cache policy, and commerce/legal claims separate.
- T-107 added route-specific metadata and conservative JSON-LD for public
  artwork, collection-scoped artwork, and Shopify product detail pages while
  keeping deployment smoke automation, cache policy, and commerce/legal claims
  separate.
- T-112 completed the remaining F-085 structured-data breadcrumb slice for
  high-value public detail pages. Dynamic detail sitemap expansion and
  deployment smoke assertions remain separate.
- T-048 completed the next route-local public-safe API response slice, scoped
  to admin read route failure bodies. Broader logging/redaction policy remains
  separate.
- T-049 completed the next route-local public-safe API response slice, scoped
  to admin delete route failure bodies and touched delete-handler debug-log
  removal. Broader logging/redaction policy remains separate.
- T-064 resolved the first F-064 supply-chain control slice by pinning
  `npm@10.9.2`, Node `>=22.14.0 <23`, root Node version files, npm engine
  enforcement, lockfile metadata, and `npm ci` install discipline.
  CI/dependency-update automation, Vercel project settings, and the residual
  Next/PostCSS decision remain separate.
- T-065 updated the environment runbook with current source-search evidence for
  active, script-only, platform-provided, legacy, and owner-decision environment
  variables without reading local `.env` files, recording secret values, or
  changing runtime configuration.
- T-066 hardened the Cloudinary signing policy gap by rejecting unknown or
  malformed signing params before `api_sign_request` and allowing only current
  admin widget params.
- T-067 removed the remaining admin Cloudinary upload widget debug logs,
  availability polling, and DOM/iframe inspection while preserving current
  upload widget behavior. It intentionally leaves the global logging/redaction
  and monitoring policy separate.
- T-101 documented the Cloudinary lifecycle and upload ownership policy without
  runtime config changes: automatic destructive Cloudinary cleanup remains
  disabled, `laoutaris_art` is the current hard-coded upload preset, signed
  folders remain rejected, and the configured upload cloud must stay aligned
  with the `next.config.mjs` Cloudinary delivery allowlist.
- T-068 removed always-on public shop products route, gallery, and loader
  `console.log` debug output, and replaced the loader's console-directed public
  error hint. Broader production logging/redaction and monitoring policy
  remain separate.
- T-086 refreshed the environment runbook after the shop loader migration and
  `/project` redirect cleanup: `NEXT_PUBLIC_BASE_URL` is now a deprecated
  public URL candidate, and `VERCEL_URL` no longer names the current
  `/project` redirect.
- T-087 removed the retired server-side same-app API wrappers that were the
  remaining current-source users of `VERCEL_ENV`/`VERCEL_URL` app URL
  construction. The environment runbook now classifies `VERCEL_ENV` and
  `VERCEL_URL` as platform-provided names that are not required by current
  source.
- T-088 removed direct console logging from the MongoDB helper layer and
  `CustomMongoDBAdapter.createUser()`, removed stale MongoDB connection and
  OAuth callback examples from `src/lib/db/mongodb.ts`, and added focused
  source hygiene plus DB helper behavior coverage. Broader production
  logging/redaction and build-time live MongoDB coupling remain separate.
- T-089 removed direct public/account render `console.log()` output from root
  layout, `Subnav`, article views, and account comments while preserving
  rendering behavior. Broader production logging/redaction and root-layout
  DB/session ownership remain separate.
- T-090 removed the remaining scoped user-facing public/account `console.log()`
  output from `ClientContextBoundary`, `ArtworkGallery`, `BlogDetail`,
  `EnquiryForm`, `SubscribeSectionLoader`, the account favourite artwork page,
  and `CollectionViewPagination`. Route-level API error logging, admin
  dashboard logs, and broader production logging/redaction remain separate.
- T-091 removed direct admin dashboard create/update form and artwork-filter
  `console.log()` output from the scoped admin dashboard files. Admin read-list
  copy logs, route-level API error logging, and broader production
  logging/redaction remain separate.
- T-092 removed success-path admin read-list copy, `ArtworkFeedCard`, shared
  `copy_id()`, and `ReadArtworkList` render `console.log()` output while
  preserving clipboard failure `console.error()` behavior. Route-level API
  logging and broader production logging/redaction remain separate.
- T-093 removed direct shared UI/public artwork fetcher `console.log()` output
  from `Feed`, `NavItem`, `RefreshButton`, `YoutubeEmbedding`, and the public
  artwork fetcher. Route-level API logging and broader production
  logging/redaction remain separate.
- T-094 removed the remaining active direct `console.log()` output from
  `getUserFromSession` development test-header paths while preserving
  test-header override behavior, normal NextAuth session lookup, delegated
  helper behavior, and lookup failure `console.error()` handling. T-095 later
  handled the commented-out debug lines; route-level API logging and broader
  production logging/redaction remain separate.
- T-095 removed the stale commented-out `console.log()` snippets from the
  scoped auth, session provider, public collection, main navigation, and admin
  layout source. The full-source `rg -n "console\\.log\\(" src` search now
  returns no matches; route-level API logging, `console.error()` handling, and
  broader production logging/redaction remain separate.
- T-096 removed the global `/api/:path*` CORS header rule from
  `next.config.mjs`, eliminating the wildcard-origin plus credential pairing
  and wildcard allowed request headers. It also added
  `X-Content-Type-Options`, `Referrer-Policy`, conservative
  `Permissions-Policy`, and CSP `object-src`, `base-uri`, `form-action`, and
  `frame-ancestors` directives while preserving the current broad Cloudinary,
  Shopify CDN, YouTube, image, font, media, and connection allowances. Full
  strict CSP allowlisting, HSTS, dynamic route-level CORS, CSP reporting, and
  monitoring remain separate.

## Backlog

- Keep the environment runbook current when runtime or script configuration
  changes.
- Resolve owner decisions for unused or legacy environment candidates:
  `JWT_SECRET`, `AUTH_SECRET`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`,
  commented-only public Vercel variables, and any future MongoDB alias.
- Verify whether the removed Shopify credential-like source comment represented
  a real value and rotate it if needed.
- Tighten the remaining broad CSP policy with production allowlists and decide
  whether any route-level dynamic CORS policy is needed.
- Keep non-route direct `console.error()`/`console.warn()` source hygiene
  enforced after T-126 through T-133 cleared the known inventory outside the
  approved structured logger sink.
- Gate or remove debug logs that currently pollute tests, builds, SSR, and shop
  flows.
- Standardize public-safe API exception responses with internal redacted
  logging and request/correlation context.
- Confirm build behavior on a clean environment.
- Decide whether CI builds should be isolated from Google Fonts and live MongoDB
  access or document those external dependencies explicitly.
- Keep broad route-builder ownership separate from retired same-app server
  wrapper cleanup; avoid reintroducing production localhost fallbacks or
  hard-coded production domains.
- Pin or document remaining Vercel project settings and deployment ownership;
  T-025 covers smoke evidence and rollback triggers, while T-064 covers repo
  runtime/package-manager pins.
- Keep the deployment smoke checklist and `npm run smoke:public` route list
  current as production route contracts, approved smoke records, auth roles, and
  Shopify product handles change.
- Decide whether to defer the Next/PostCSS migration until a stable Next release
  bundles `postcss@8.5.10+`, migrate to stable `next@16.2.6` with explicit
  temporary PostCSS advisory acceptance, or accept canary framework risk.
- Before any future Next package edit, re-run npm metadata/audit checks and use
  T-015's Node/React/lint/proxy/image/App Router verification plan.
- Define dependency audit/update automation or cadence after the package-manager
  and Node runtime pinning slice completed in T-064.
- Keep native-package deployment smoke checks for `GET /` and credentials
  sign-in after bcrypt, Next, runtime, or auth import-boundary changes.
- Route A-020 privacy/compliance findings through owner/legal review before
  implementing policy, consent, unsubscribe, account privacy, comment notice,
  third-party disclosure, or commerce policy pages.
- Preserve the T-099 request ID and structured redacted logging contract when a
  monitoring provider is integrated.
- Use the monitoring architecture plan to choose and document an
  error-reporting/monitoring provider, or explicitly record a no-provider
  decision for launch.
- Resolve the T-134 blocked owner-decision rows by recording owner-approved
  role labels, named owners, team aliases, backups, and authority boundaries
  for incident command, Vercel rollback/logs, repository release authority,
  MongoDB, Shopify, Cloudinary, auth/OAuth, DNS/domain, and privacy/legal
  communication.
- Keep the GitHub Actions public smoke workflow current as route contracts and
  owner-approved non-secret smoke records change; keep credentialed, admin, and
  Vercel-log smoke evidence owner-run until safe synthetic accounts and access
  are approved.
- Define the deployment/cache implications of separating public route rendering
  from authenticated/session-only UI after A-010, including how build output
  should prove static or ISR behavior for public archive/shop routes.
- Add deployment smoke or build-output checks for the T-103 discovery endpoints
  and future route-specific metadata once those route contracts are assigned.
- Define sitemap/default redirect freshness through T-232 before any runtime
  ISR/static-param changes affect deployment expectations.
- Sentry is approved as the monitoring provider in ADR 0005. Keep
  instrumentation/web-vitals runtime implementation scoped to T-310 or later
  tasks; source-map upload, alert routing, replay, profiling, broad tracing,
  uptime checks, and Vercel privileged actions remain separate.

## Acceptance Criteria

- Production environment variables are documented by name, owner, and purpose.
- Build and deployment steps are repeatable.
- Headers are reviewed for production risk.
- Debug logging does not leak sensitive data in production.
- Deployment smoke checks cover public pages, auth, admin access, and shop.

## Verification

```bash
npm run build
npm run lint
```

## Progress

- Documentation scaffold created.
- 2026-05-25: Completed T-284. `/prototype/home` is now explicitly dynamic, so
  the noindex prototype route no longer adds live MongoDB/Shopify section reads
  to production static generation. Build evidence for `/biography`,
  `/collections`, and `/sitemap.xml` remains governed by T-279.
- 2026-05-14: Reconciled A-001, A-006, A-014, and A-015 deployment/security
  findings into `docs/audits/findings-register.md`, production risks, and this
  backlog.
- 2026-05-14: Reconciled A-007 into F-046 through F-048 and updated
  F-011/F-019/F-020/F-030/F-044/F-047, production risks, and this backlog.
- 2026-05-14: T-001 removed `MONGO_URI` from `next.config.mjs`, confirmed the
  remaining `MONGO_URI` references are server-side DB helpers, and updated the
  environment/deployment runbooks to keep server-only secrets out of Next
  config `env`.
- 2026-05-14: Prepared T-005 to harden Cloudinary signing before the broader
  Cloudinary/Vercel/auth environment inventory continues.
- 2026-05-14: Completed T-005 missing `CLOUDINARY_API_SECRET` handling with a
  public-safe JSON error; Cloudinary environment inventory and rotation
  ownership remain open.
- 2026-05-14: Prepared T-006 to prevent server-only secrets from being exposed
  through Next config `env` again.
- 2026-05-14: Completed T-006 by adding `scripts/validate-next-config-env.mjs`,
  `npm run env:guard`, build-time guard execution, and focused guard tests.
- 2026-05-14: Completed A-019 dependency/supply-chain audit; result recorded
  production vulnerabilities, unused direct dependency candidates, lockfile
  health, install-script risk, and missing package-manager/update controls.
- 2026-05-14: Reconciled A-008 into F-051 through F-054, updated F-011/F-044,
  production risks, this backlog, and T-009.
- 2026-05-14: Completed T-009 by removing direct registration console logging,
  replacing the Shopify token-shaped source comment with value-free guidance,
  and adding focused source hygiene regression coverage. Owner verification or
  rotation for the removed Shopify value remains open.
- 2026-05-14: Completed T-011 by patching current-major production dependency
  advisories, adding targeted transitive overrides, fixing the
  `userUtils`/Mongoose Jest runtime import, and running production audit,
  focused tests, full Jest, lint, and build verification.
- 2026-05-14: Completed T-014 by confirming the 5 residual production
  advisories, choosing a Next major preflight audit before package edits, and
  creating ready follow-up briefs T-015 and T-016.
- 2026-05-14: Completed T-016 by upgrading `bcrypt`/`@types/bcrypt` to
  `6.0.0`, removing the `@mapbox/node-pre-gyp`/`tar` advisory path from the
  production audit, and running focused auth/bcrypt tests, full Jest, lint, and
  build verification.
- 2026-05-14: Completed T-015 by confirming current `npm audit --omit=dev`
  reports only residual Next/PostCSS advisories, finding that stable
  `next@16.2.6` does not clear the nested PostCSS advisory in an isolated
  audit, and documenting the owner decision path plus future migration
  verification plan.
- 2026-05-14: Prepared T-022 to prune confirmed-unused package candidates,
  including the unused `next-test-api-route-handler` core-js install-script
  path if verification confirms it is still unused.
- 2026-05-14: Completed T-022 by removing unused direct package candidates,
  refreshing `package-lock.json`, confirming the unused `core-js` path is gone,
  and running npm audit, full Jest, and lint verification. Build verification
  initially hit unrelated in-progress T-021 public-search schema edits; T-021
  later cleared that blocker and `npm run build` passed.
- 2026-05-14: Recorded the Vercel bcrypt native trace incident. Immediate local
  fix is `next.config.mjs` output-file tracing for bcrypt prebuilds; redeploy
  and `GET /` plus credentials sign-in smoke checks remain required.
- 2026-05-14: Prepared T-023 to decouple public root-layout session imports
  from credentials bcrypt imports.
- 2026-05-14: Completed T-023 by lazy-loading credentials authorize from
  `authOptions`, adding auth/root-layout import-boundary tests that fail if
  public imports load bcrypt, and keeping the bcrypt prebuild tracing include
  pending Vercel smoke.
- 2026-05-14: Prepared T-024 to capture Vercel redeploy smoke evidence for
  `GET /`, credentials sign-in, deployed commit/runtime, and targeted logs.
- 2026-05-14: T-024 partial smoke found `GET /` on
  `https://laoutaris-nextjs.vercel.app/` returning `HTTP/2 200`; an invalid
  credentials callback returned `401 CredentialsSignin`, not `500`. At that
  point the task was blocked pending a deployment containing T-023, Vercel log
  access, and a known test/admin credentials account.
- 2026-05-14: Completed T-024 after `origin/main` matched local `HEAD` with the
  T-023 auth import-boundary change, the owner confirmed the Vercel deployment
  no longer crashes, and a fresh `curl -I /` returned `HTTP/2 200`.
- 2026-05-14: Prepared T-025 to make Vercel smoke checks repeatable without
  storing secrets or Vercel tokens in the repo.
- 2026-05-14: Completed T-025 by expanding the deployment runbook with a smoke
  evidence template, minimum route expectations, credentials smoke secret
  handling, targeted Vercel log requirements, rollback triggers, and
  `npm run smoke:public` for unauthenticated public-route status checks.
- 2026-05-15: Prepared T-041 as a narrow middleware logging/auth-response slice:
  remove direct debug logs from `src/middleware.ts` while returning JSON `401`
  for protected API callers and preserving frontend redirects.
- 2026-05-15: Completed T-041 by removing direct debug logs from
  `src/middleware.ts`, returning shared JSON `401` responses for
  unauthenticated protected API callers, preserving frontend redirects, and
  verifying focused tests, lint, and build.
- 2026-05-15: Prepared T-044 to reduce public-facing route error inconsistency
  for protected user read routes with shared response helpers and stable
  public-safe failure bodies. Broader logging/redaction policy remains separate.
- 2026-05-15: Completed T-044 by routing protected user profile, navigation,
  favourite, and watchlist read-route missing-resource and internal failures
  through shared public-safe response helpers with real `404`/`500` statuses.
  Broader logging/redaction, monitoring, and request-correlation policy remains
  separate.
- 2026-05-15: Prepared T-045 to apply shared public-safe response helpers to
  unauthenticated public content detail routes. It should remove touched direct
  debug `console.log()` calls but keep global logging/redaction policy separate.
- 2026-05-15: Completed T-045 by routing public artwork/article/blog detail
  route missing-resource and internal failures through shared public-safe
  response helpers with real `404`/`500` statuses, removing touched blog
  `console.log()` calls, and keeping broader logging/redaction, monitoring, and
  request-correlation policy separate.
- 2026-05-15: Prepared T-046 to apply shared public-safe response helpers to
  public collection routes and remove touched direct debug logs. Broader
  logging/redaction policy remains separate.
- 2026-05-15: Completed T-046 by routing public collection route missing
  resource and internal failures through shared public-safe response helpers
  with real `404`/`500` statuses and removing touched collection request debug
  logging. Broader logging/redaction, monitoring, and request-correlation policy
  remains separate.
- 2026-05-15: Prepared T-047 to apply shared public-safe response helpers to
  public navigation routes and remove touched direct debug logs. Broader
  logging/redaction policy remains separate.
- 2026-05-15: Completed T-047 by routing public navigation route missing
  resource and internal failures through shared public-safe response helpers
  with real `404`/`500` statuses and removing touched navigation
  request/found/no-results debug logging. Broader logging/redaction,
  monitoring, and request-correlation policy remains separate.
- 2026-05-15: Prepared T-048 to apply shared stable response helpers to admin
  read routes while keeping broader logging/redaction, monitoring, and
  request-correlation policy separate.
- 2026-05-15: Prepared T-049 to apply shared stable response helpers to admin
  delete routes and remove touched direct debug logs while keeping broader
  logging/redaction, monitoring, and request-correlation policy separate.
- 2026-05-15: Completed T-048 by routing admin read route empty-list,
  missing-resource, and internal failures through shared stable response
  helpers with real `404`/`500` statuses and public-safe internal failure
  bodies. Broader logging/redaction, monitoring, and request-correlation policy
  remains separate.
- 2026-05-15: Completed T-049 by routing admin delete route missing-resource,
  conflict, and internal failures through shared stable response helpers with
  real `404`/`409`/`500` statuses and public-safe internal failure bodies,
  while removing touched delete-handler debug logs. Broader logging/redaction,
  monitoring, and request-correlation policy remains separate.
- 2026-05-15: Completed T-050 by routing admin create/update route success,
  missing-resource, conflict, and internal failures through shared stable
  response helpers with real `201`/`200`/`404`/`409`/`500` statuses and
  public-safe internal failure bodies. Broader logging/redaction, monitoring,
  and request-correlation policy remains separate.
- 2026-05-16: Prepared T-064 as the first F-064 supply-chain control slice. It
  pins the Node/npm runtime baseline and updates setup/deployment install docs
  to use `npm ci` while leaving CI/dependency-update automation, Vercel
  project-setting ownership, and Next/PostCSS migration decisions separate.
- 2026-05-16: Completed T-064 by adding npm and Node runtime pins,
  `.nvmrc`, `.node-version`, `.npmrc`, lockfile metadata, and `npm ci`
  setup/deployment/testing docs. Verification passed with Node `v22.14.0`, npm
  `10.9.2`, `npm ci --dry-run --ignore-scripts`, full Jest, lint, and build.
- 2026-05-16: Prepared T-065 as the next F-047 deployment-environment slice. It
  updates the environment runbook from source-search evidence and A-007 context
  while leaving runtime config, Vercel settings, Cloudinary upload policy,
  credential rotation, and CI/dependency automation separate.
- 2026-05-16: Completed T-065 by expanding the environment runbook to classify
  active runtime variables, smoke-script variables, Vercel/Node platform
  variables, and legacy/deprecated candidates with required environments,
  likely owners, and configuration/rotation notes. Runtime config, Vercel
  settings, Cloudinary upload policy, credential rotation, and CI/dependency
  automation remain separate.
- 2026-05-16: Prepared T-066 as the next F-044/F-054 Cloudinary signing slice.
  It should restrict signed upload params for the current admin widget while
  leaving upload preset ownership, asset lifecycle, Vercel settings, and
  credential rotation separate.
- 2026-05-16: Completed T-066 by restricting Cloudinary upload signing to
  `timestamp`, `upload_preset: "laoutaris_art"`, and `source: "uw"`, adding
  focused rejection coverage for unknown and malformed values, and documenting
  remaining preset/folder/lifecycle policy gaps.
- 2026-05-16: Completed T-067 by removing always-on debug logging, polling, and
  DOM/iframe inspection from `UploadButton` while preserving the current
  `CldUploadWidget` behavior and leaving global logging/redaction policy
  separate.
- 2026-05-16: Prepared T-068 to remove always-on public shop debug logging
  from the shop products route, gallery, and loader while preserving current
  shop behavior and leaving global logging/redaction policy separate.
- 2026-05-16: Completed T-068 by removing direct public shop route/gallery/loader
  `console.log` output, replacing the console-directed loader error hint, and
  adding focused no-debug-log regression coverage. Lint and build passed; build
  retained existing MongoDB/static-generation, branch-verification, link, and
  fetcher debug noise outside this slice.
- 2026-05-16: Prepared T-069 to remove always-on debug logging from the shared
  API fetcher and server API URL helper files while preserving current fetch
  behavior and same-app URL construction.
- 2026-05-16: Completed T-069 by removing shared fetcher request/URL/response
  `console.log` debug output, server public/user/admin API helper URL debug
  logs, and stale commented URL debug blocks. Build, lint, focused Jest, and
  `git diff --check` passed; build still emits already tracked
  MongoDB/static-generation, branch-verification, and link console noise outside
  this slice.
- 2026-05-17: Prepared T-086 as the next F-030 URL/environment slice. It should
  replace user-facing hard-coded same-app origins with relative app paths and
  refresh the environment runbook now that T-085 removed the shop loader's
  `NEXT_PUBLIC_BASE_URL` dependency.
- 2026-05-17: Completed T-086; user-facing localhost navigation origins and the
  `/project` `VERCEL_URL` redirect dependency were removed, and the environment
  runbook now records `NEXT_PUBLIC_BASE_URL` as deprecated current-source
  configuration.
- 2026-05-17: Prepared T-087 to retire the unused server-side same-app API
  wrappers that still contain runtime `VERCEL_ENV`/`VERCEL_URL`/localhost base
  URL construction, while preserving client fetchers and route-specific fetcher
  factories.
- 2026-05-17: Completed T-087; retired server API wrapper files were deleted,
  `src/lib/api` no longer contains `VERCEL_ENV`/`VERCEL_URL`/localhost same-app
  URL construction, and the environment runbook now records those Vercel names
  as not required by current source.
- 2026-05-17: Prepared T-088 as the next F-020 DB logging slice. It should
  remove direct MongoDB helper and auth adapter debug logs while preserving DB
  connection options, retry/backoff behavior, cached client behavior, thrown
  errors, and adapter-created user defaults.
- 2026-05-17: Completed T-088 by removing direct DB helper and auth adapter
  debug logs, deleting stale MongoDB connection/OAuth callback examples from
  `mongodb.ts`, preserving retry/backoff/cache/adapter defaults, and adding
  focused source hygiene plus DB helper behavior tests. Focused Jest, lint,
  build, required source search, and `git diff --check` passed; build still
  emits unrelated branch-verification and navigation link logs.
- 2026-05-17: Prepared T-089 as the next F-020 public render-log slice. It
  should remove root-layout branch verification, navigation-link, article, and
  account comments render `console.log()` output while leaving root-layout
  DB/session ownership and global logging policy separate.
- 2026-05-17: Completed T-089 by removing root-layout branch verification,
  navigation-link, article, title, and account-comments render `console.log()`
  output, adding focused render source-hygiene coverage, and preserving
  root-layout DB/session ownership plus current component rendering behavior.
- 2026-05-17: Prepared T-090 as the next F-020 user-facing client/page log
  slice. It should remove remaining public/account `console.log()` output from
  scoped client components and account pages while leaving admin logs, route
  error logging, and global logging policy separate.
- 2026-05-17: Completed T-090 by removing the scoped user-facing public/account
  `console.log()` output, preserving filtering/comments/enquiry/subscription/
  saved-artwork/pagination behavior, and extending focused source-hygiene
  coverage. Focused Jest, required source search, lint, and build passed.
- 2026-05-17: Prepared T-091 as the next F-020/R-019 admin dashboard
  form/filter debug-log slice. It should remove direct `console.log()` output
  from scoped admin create/update form and artwork-filter components while
  leaving read-list copy logs, route-level API logging, and global
  logging/redaction policy separate.
- 2026-05-17: Completed T-091 by removing direct admin dashboard
  create/update form and artwork-filter `console.log()` output from the scoped
  files, adding focused source-hygiene coverage, and preserving admin
  validation, upload-state handoff, submit/update, success/error, and filter
  callback behavior.
- 2026-05-17: Prepared T-092 as the next F-020/R-019 admin read/copy
  debug-log slice. It should remove success-path `console.log()` output from
  scoped admin read-list copy flows, `ArtworkFeedCard`, and the shared
  `copy_id()` helper while leaving failure `console.error()` behavior,
  route-level API logging, and global logging/redaction policy separate.
- 2026-05-17: Completed T-092 by removing success-path admin read-list copy,
  `ArtworkFeedCard`, shared `copy_id()`, and `ReadArtworkList` render
  `console.log()` output while preserving clipboard failure logging and leaving
  route-level API logging plus global logging/redaction policy separate.
- 2026-05-17: Prepared T-093 as the next F-020/R-019 shared UI/public fetcher
  debug-log slice. It should remove direct `console.log()` output from `Feed`,
  `NavItem`, `RefreshButton`, `YoutubeEmbedding`, and the public artwork
  fetcher while leaving `getUserFromSession` test-header logs, route-level API
  logging, and global logging/redaction policy separate.
- 2026-05-17: Completed T-093 by removing direct `console.log()` output from
  the scoped shared UI components and public artwork fetcher while preserving
  current feed, navigation, refresh, YouTube embed, and artwork URL-building
  behavior.
- 2026-05-17: Prepared T-094 as the next F-020/R-019 auth/session helper
  debug-log slice. It should remove the remaining active direct
  `console.log()` output from `getUserFromSession` development test-header
  paths while preserving the override behavior and leaving commented-out debug
  lines, route-level API logging, and global logging/redaction policy separate.
- 2026-05-17: Completed T-094 by removing the remaining active direct
  `getUserFromSession` test-header `console.log()` output while preserving
  test-user lookup/fallback behavior, test-admin override behavior, normal
  NextAuth session lookup, delegated helper behavior, and lookup failure
  `console.error()` handling.
- 2026-05-17: Prepared T-095 as the final `console.log()` source-hygiene
  cleanup slice. It should remove stale commented debug snippets from auth,
  session provider, collection section, main navigation, and admin layout
  source so the full-source `console.log()` search returns no matches.
- 2026-05-17: Completed T-095 by removing stale commented `console.log()`
  snippets from the scoped source files and adding full-source source hygiene
  coverage so direct or commented `console.log()` calls cannot return under
  `src`.
- 2026-05-17: Prepared T-096 to harden the baseline security headers and API
  CORS configuration without expanding into strict CSP allowlists, dynamic
  CORS, HSTS, monitoring, Cloudinary lifecycle, or global logging policy.
- 2026-05-17: Completed T-096 by removing global API CORS headers from
  `next.config.mjs`, adding baseline hardening headers and missing low-risk CSP
  directives, preserving current Cloudinary/Shopify/YouTube allowances, and
  adding focused static Next config coverage. Full strict CSP allowlisting,
  HSTS, route-level dynamic CORS, CSP reporting, and monitoring remain
  separate.
- 2026-05-18: Reconciled A-020 into F-072 through F-079 and R-018. Owner/legal
  review is required before policy-page copy, consent records, unsubscribe,
  account privacy actions, third-party disclosure, or commerce assurance copy is
  finalized.
- 2026-05-18: Reconciled A-021 into F-080 through F-083, R-019, and R-028. The
  first owner-independent implementation slice should add request/correlation
  IDs and structured redacted logging, while provider selection and incident
  response ownership remain separate.
- 2026-05-18: Prepared T-099 for a provider-neutral request/correlation ID and
  structured redacted logging foundation across a representative API route
  slice.
- 2026-05-18: Completed T-099 by adding provider-neutral request ID propagation
  and generation, structured redacted API logging, optional public
  `requestId`/`X-Request-Id` helper support, and a representative public/user/
  admin failure-path migration. Monitoring provider selection,
  `instrumentation.ts`, alerting, incident-response ownership, and broad route
  migration remain separate.
- 2026-05-18: Prepared T-101 as the Cloudinary policy/runbook slice for asset
  lifecycle, backup/restore, orphan cleanup, and upload preset/cloud/folder
  ownership before runtime cleanup or signed-folder changes.
- 2026-05-18: Completed T-101 by documenting the no-destructive-cleanup
  Cloudinary policy, manual deletion evidence requirements, backup/restore/
  rollback expectations, current preset/cloud/folder ownership, and delivery
  allowlist alignment without changing runtime configuration.
- 2026-05-18: Reconciled A-010 into F-084/F-085 and R-012/R-030 from the
  deployment side. Public route cacheability and metadata/discovery output now
  need explicit verification in future build/deployment checks.
- 2026-05-18: Prepared T-102 as the first public route cacheability slice. It
  should remove global root-layout DB/session work and avoid middleware token
  parsing for public routes, then record build output and any route-local
  dynamic blockers.
- 2026-05-18: Completed T-102; public middleware paths now bypass token parsing,
  root layout no longer imports or calls global DB/session helpers, and
  `npm run build` passes. Build output still marks route-local data/session
  public pages as dynamic, so deployment cacheability work should now focus on
  explicit route policy rather than global shell auth work.
- 2026-05-18: Prepared T-103 for production-safe root metadata plus baseline
  robots/sitemap discovery files. Keep metadata deployment checks separate from
  policy-page copy and commerce claims.
- 2026-05-18: Completed T-103 with a non-secret fixed public site URL helper,
  root archive metadata, baseline crawler rules, and a stable public route
  sitemap. Deployment smoke automation for discovery endpoints remains a
  future deployment slice.
- 2026-05-18: Prepared T-106 for public biography article and blog detail
  metadata, canonical/social previews, and conservative structured data while
  keeping route cache policy and smoke automation separate.
- 2026-05-18: Completed T-106; focused tests, lint, build, scaffold-text
  search, and `git diff --check` passed. Discovery endpoint smoke automation
  and explicit route cache policy remain future deployment slices.
- 2026-05-18: Prepared T-107 for public artwork and Shopify product detail
  metadata, canonical/social previews, and conservative structured data while
  keeping route cache policy and smoke automation separate.
- 2026-05-18: Completed T-107; focused tests, lint, build, scaffold-text
  search, and `git diff --check` passed. Product JSON-LD remains descriptive
  only and does not add checkout, offer, sale, shipping, refund, payment,
  guarantee, or availability claims.
- 2026-05-18: Prepared T-110 to make public route rendering/cache policy
  explicit and keep future deployment cacheability checks tied to route-local
  ownership instead of the now-fixed root shell blocker.
- 2026-05-18: Completed T-110 by documenting public route cache ownership and
  making the remaining dynamic public route list explicit in source. Future
  deployment cacheability checks should now compare build output against the
  route matrix rather than assuming all public pages are static candidates.
- 2026-05-18: Prepared T-112 as the next F-085/R-030 discovery slice for
  breadcrumb JSON-LD while keeping dynamic sitemap expansion and discovery
  endpoint smoke automation separate.
- 2026-05-18: Completed T-112; public biography, blog, artwork,
  collection-scoped artwork, and Shopify product detail pages now render
  conservative breadcrumb JSON-LD alongside their existing entity JSON-LD. The
  focused Jest slice, lint, build, and `git diff --check` passed.
- 2026-05-18: Prepared T-113 for dynamic detail sitemap expansion while keeping
  deployment smoke automation separate.
- 2026-05-18: Completed T-113; sitemap discovery now includes best-effort
  dynamic public detail URLs from current archive and linked Shopify product
  data while excluding duplicate, malformed, private, account, admin, and API
  paths. Build passed, with existing Shopify client cache/revalidate warnings
  surfacing on `/sitemap.xml`; deployment smoke automation remains separate.
- 2026-05-18: Prepared T-114 to extend unauthenticated public smoke checks with
  deployed `/robots.txt` and `/sitemap.xml` status plus minimal safe content
  assertions, keeping credentialed/admin smoke, Vercel log inspection, CI
  scheduling, monitoring, and Shopify fetch-cache cleanup separate.
- 2026-05-18: Completed T-114; `npm run smoke:public` now checks
  `/robots.txt` and `/sitemap.xml` by default, validates the robots sitemap
  directive, validates stable public sitemap paths, rejects private/admin/
  account/API sitemap paths, and reports body-check failures without dumping
  response bodies. Focused Jest, CLI help, lint, build, and `git diff --check`
  passed; the existing Shopify fetch cache/revalidate warning on
  `/sitemap.xml` remains separate.
- 2026-05-18: Prepared T-115 to clean up the Shopify Storefront fetch
  `cache`/`next.revalidate` option conflict surfaced by `/sitemap.xml` builds
  while preserving development freshness and production revalidation intent.
- 2026-05-18: Completed T-115; production Shopify Storefront fetches now send
  only `next.revalidate: 3600`, development fetches send only
  `cache: "no-store"`, and `npm run build` passed without the prior
  `/sitemap.xml` Shopify fetch warning.
- 2026-05-18: Prepared T-116 to create the missing incident-response runbook
  for severity levels, triage, escalation, owner matrix, rollback authority,
  evidence handling, and post-incident follow-up while keeping monitoring
  provider selection and SDK instrumentation separate.
- 2026-05-18: Completed T-116 by adding the incident-response runbook,
  linking it from the runbook index and deployment runbook, and closing the
  F-082 runbook gap. Remaining observability work is provider selection,
  alert/scheduled-smoke automation, broad route-level logging migration, and
  filling the runbook's `TBD` owner/escalation matrix with owner-approved
  authorities.
- 2026-05-18: Prepared T-117 as the next F-081/R-019 logging migration slice.
  It should move bounded public content API internal failures from direct
  route-level `console.error()` to request IDs and structured redacted logging
  while leaving monitoring provider selection and alert automation separate.
- 2026-05-18: Completed T-117 by migrating public article, blog, artwork, and
  collection API internal-failure paths under the scoped directories to
  request-context structured logging. Real `500` responses now return public
  request IDs plus `X-Request-Id`; legacy article/blog list pseudo-500 bodies
  remain unchanged while adding request ID headers. Monitoring provider
  selection, instrumentation, alert automation, scheduled smoke, incident
  owner-matrix completion, and broader route migration remain separate.
- 2026-05-18: Prepared T-118 as the next F-081/R-019 public route logging
  migration slice for search, navigation, and shop product routes that still
  use direct route-level `console.error()`.
- 2026-05-18: Completed T-118 by migrating public search, navigation, and shop
  product API internal/upstream failure paths to request-context structured
  logging. Real `500` responses and the Shopify upstream `502` response now
  return public request IDs plus `X-Request-Id`; success, validation, `404`,
  and Shopify status semantics were preserved. Monitoring provider selection,
  instrumentation, alert automation, scheduled smoke, incident owner-matrix
  completion, protected/admin route migration, and broader route migration
  remain separate.
- 2026-05-18: Prepared T-119 as the next F-081/R-019 protected user route
  logging migration slice for favourite, watchlist, and comment routes that
  still use direct route-level `console.error()`.
- 2026-05-18: Completed T-119 by migrating protected user favourite,
  watchlist, and comment API internal-failure paths to request-context
  structured logging. Scoped real `500` responses now return public request IDs
  plus `X-Request-Id`; auth, validation, not-found, forbidden, ownership,
  transaction, success, and action/loader contracts were preserved. Monitoring
  provider selection, instrumentation, alert automation, scheduled smoke,
  incident owner-matrix completion, admin route migration, and broader route
  migration remain separate.
- 2026-05-18: Prepared T-120 as the next F-081/R-019 admin route logging
  migration slice for admin read list/detail routes that still use direct
  route-level `console.error()`. Admin write/delete migration remains separate.
- 2026-05-18: Completed T-120 by migrating scoped admin read list/detail API
  internal-failure paths to request-context structured logging. Scoped
  server-error responses now include public request IDs plus `X-Request-Id`;
  shared admin guard behavior, invalid-ID `400`s, empty-list/missing-resource
  `404`s, pagination, success DTOs, transform behavior, and DB/model ordering
  were preserved. Admin write/delete logging migration, monitoring provider
  selection, instrumentation, alert automation, scheduled smoke, and incident
  owner-matrix completion remain separate.
- 2026-05-18: Prepared T-121 as the final route-level admin logging migration
  slice for admin create, update, and delete routes that still use direct
  route-level `console.error()`.
- 2026-05-18: Completed T-121 by migrating scoped admin create, update, and
  delete API internal-failure paths to request-context structured logging.
  Scoped server-error responses now include public request IDs plus
  `X-Request-Id`; shared admin guard behavior, validation and invalid-ID
  `400`s, missing-resource `404`s, conflict `409`s, cascade/transaction
  semantics, and mutation success contracts were preserved. Monitoring
  provider selection, instrumentation, alert automation, scheduled smoke,
  incident owner-matrix completion, lower-level service/client logging policy,
  and direct `console.error()`/`console.warn()` policy remain separate.
- 2026-05-18: Prepared T-122 as the post-migration API route logging
  invariant. It should add recursive source-hygiene coverage for current and
  future `src/app/api/v2` route handlers so direct route-level
  `console.error()`/`console.warn()` calls cannot return while leaving
  monitoring provider selection, alert automation, incident owner-matrix
  completion, and lower-level service/client logging policy separate.
- 2026-05-18: Completed T-122 by replacing the scoped migrated-route source
  lists with a recursive API-v2 route handler source-hygiene guard covering
  direct `console.error()` and `console.warn()` calls. The source search under
  `src/app/api/v2` remains clean. Monitoring provider selection,
  instrumentation, alert automation, scheduled smoke, incident owner-matrix
  completion, and lower-level service/client logging policy remain separate.
- 2026-05-18: Prepared T-123 as the next owner-independent monitoring slice.
  It should create a decision-ready monitoring/error-reporting architecture plan
  and environment contract before provider-specific SDK installation,
  `instrumentation.ts`, alert automation, or Vercel project changes.
- 2026-05-18: Completed T-123 by adding the provider-neutral monitoring and
  error-reporting architecture plan, linking it from the architecture index,
  and recording capture surfaces, T-099 request ID/logging integration,
  provider decision questions, environment-variable classification rules, and
  the post-approval implementation contract. Provider-specific SDK
  installation, `instrumentation.ts`, alert automation, CI/scheduled smoke,
  owner-approved incident matrix completion, and lower-level service/client
  logging policy remain separate.
- 2026-05-23: Completed T-139 as a blocked monitoring decision record. ADR 0005
  now records that no provider and no explicit no-provider interim launch
  policy are approved; provider SDKs, `instrumentation.ts`, provider variables,
  source-map/release tracking, dashboards, uptime checks, and alert routing
  remain blocked until owner/platform approval.
- This T-139 blocked state was superseded on 2026-05-27 when the owner approved
  Sentry in ADR 0005.
- 2026-05-27: Owner approved Sentry as the monitoring provider. ADR 0005 is now
  accepted, the monitoring architecture and production-ops decision packet
  record Sentry as approved, and T-310 is prepared as the first implementation
  baseline while source-map upload, alert routing, replay, profiling, broad
  tracing, uptime checks, Vercel privileged actions, and smoke-account work
  remain separate.
- 2026-05-18: Prepared T-124 as the next F-083/R-028 smoke automation slice.
  It should add a GitHub Actions workflow for unauthenticated public smoke that
  can run manually with a supplied base URL and on a schedule after the owner
  configures non-secret repository variables.
- 2026-05-18: Completed T-124 by adding `.github/workflows/public-smoke.yml`
  for unauthenticated public smoke in GitHub Actions. Manual runs require a
  `base_url`; scheduled runs use non-secret repository variable
  `SMOKE_BASE_URL` and skip with a notice until configured. The workflow uses
  Node `22.14.0`, `npm ci`, and passes through optional non-secret `SMOKE_*`
  route variables while keeping credential/admin smoke, Vercel logs, rollback
  automation, and provider alerting separate.
- 2026-05-18: Prepared T-125 as the next R-019 logging policy slice. It should
  inventory non-route direct `console.error()`/`console.warn()` calls and define
  the service, loader, action, client, utility, and provider-client logging and
  redaction policy before broad implementation cleanup.
- 2026-05-18: Completed T-125 by adding the durable logging/redaction
  architecture policy, recording the non-route direct console inventory, and
  defining allowed console use, server/client logging contracts, redaction
  rules, request-context expectations, and migration order. The first
  implementation slice is T-126 for public server loaders and App Router pages.
- 2026-05-18: Completed T-126 by adding a requestless server structured logger
  and migrating scoped public page/loader failure paths to redacted structured
  events while preserving redirects, null fallbacks, thrown errors, and
  user-facing shop loader copy. Focused source hygiene now covers the T-126
  file list; broader non-route `console.error()`/`console.warn()` cleanup
  remains staged by the T-125 migration order.
- 2026-05-18: Prepared T-127 as the next owner-independent logging cleanup
  slice for Shopify provider/data services. It should migrate scoped Shopify
  client and product service logs to structured redacted server events without
  changing Shopify DTOs, cache policy, or public shop contracts.
- 2026-05-18: Completed T-127 by routing scoped Shopify provider/data service
  failures through `createServerLogger()`. Focused source hygiene now covers
  `shopifyClient`, `getArtworkShopProducts`, and `getShopProductList`; product
  DTOs, Storefront cache policy, public-safe wrapper errors, linked-product
  skip/null behavior, product-list metadata, and filter behavior were
  preserved. Server action/session helper logging, client/admin reporting,
  shared fetcher/client reporting, and utility/helper warning cleanup remain
  separate.
- 2026-05-18: Prepared T-128 as the next owner-independent server-side logging
  cleanup slice for `submitSubscription`, `updateUserFavourites`,
  `updateUserWatchlist`, and `getUserFromSession`. It should preserve action
  return contracts, saved-item mutation/revalidation behavior, and
  development-only test-header session semantics.
- 2026-05-18: Completed T-128 by routing scoped server action/session-helper
  failure paths through `createServerLogger()` and adding focused source
  hygiene for the touched files. Public action returns, saved-item
  revalidation ordering, normal session lookup, and development test-header
  semantics were preserved.
- 2026-05-18: Prepared T-129 as the next owner-independent server-loader
  logging cleanup slice for `FavouritedArtworkLoader`. It should preserve the
  current account favourite artwork detail fallback UI, saved-artwork service
  behavior, and Next.js control-flow error handling.
- 2026-05-18: Completed T-129 by routing `FavouritedArtworkLoader` recoverable
  failure logging through `createServerLogger()` with coarse status categories
  and a normalized generic error while preserving fallback UI, success
  rendering, saved-artwork service behavior, no same-app HTTP/fetch behavior,
  and Next.js control-flow rethrows.
- 2026-05-18: Prepared T-130 as the first public browsing client console-error
  cleanup slice for artwork filtering/loading, blog continuous loading/comments,
  infinite scroll, and shop product filters. It should preserve existing UI
  state, modals, sorting, loading, and fallback behavior without introducing a
  monitoring provider or client reporting SDK.
- 2026-05-18: Completed T-130 by removing scoped public browsing client
  `console.error()` calls and adding focused source-hygiene plus behavior
  coverage for infinite-scroll error state, blog comment failure modals, and
  shop filter failure fallback. Browser client reporting/provider integration
  remains separate.
- 2026-05-18: Prepared T-131 as the next account/user client console-error
  cleanup slice for contact/comment forms, logout, account navigation,
  `CommentCard` owner actions, and the client error boundary.
- 2026-05-18: Completed T-131 by removing scoped account/user client
  `console.error()` calls and adding focused source-hygiene plus behavior
  coverage for contact failure modals/reset, comment retry state, logout and
  account-nav failure modals/loading reset, comment-card owner edit/delete
  failure behavior, and error-boundary fallback behavior. Browser client
  reporting/provider integration remains separate.
- 2026-05-18: Prepared T-132 as the next shared fetcher and low-value
  utility/helper console cleanup slice. It should preserve fetcher contracts,
  fallback strings, copy behavior, color-icon rendering, and blog sidebar
  state while keeping admin dashboard clients separate.
- 2026-05-18: Completed T-132 by removing the scoped shared fetcher and
  low-value utility/helper direct `console.error()`/`console.warn()` calls and
  adding focused source-hygiene plus fallback behavior coverage. The remaining
  non-route source inventory after excluding API-v2 route handlers and the
  structured logger sink is 37 direct `console.error()`/`console.warn()` calls
  across 28 admin dashboard client files.
- 2026-05-19: Prepared T-133 as the admin dashboard client console cleanup
  slice. It should preserve dashboard form, feed, list, copy, upload,
  operation-tab, and document-reader behavior while removing direct browser
  console error output.
- 2026-05-19: Completed T-133 by removing the remaining known admin dashboard
  client direct `console.error()`/`console.warn()` calls and extending recursive
  admin dashboard source hygiene. The known non-route direct console error/warn
  inventory is clear except the approved structured logger sink.
- 2026-05-19: Completed T-134 as a docs-only blocked owner-decision handoff.
  The incident-response owner matrix now replaces raw owner placeholders with
  blocked rows for every required surface, plus explicit approval authority for
  rollback, release changes, provider checks, MongoDB restore, credential
  rotation, and privacy/legal communication while owner assignments remain
  unavailable. The deployment runbook now links rollback permission to that
  matrix. Verification used the task's owner-placeholder search, secret-pattern
  search, and `git diff --check`.
- 2026-05-19: Completed T-138 by documenting admin bootstrap, promotion,
  lockout recovery, sanitized evidence handling, and credential/OAuth
  verification in the auth runbook without creating users, changing MongoDB
  data, inspecting environment values, or recording secrets.
- 2026-05-19: Completed T-149 by adding the admin content operations runbook.
  It links database, Cloudinary, Shopify, deployment, auth, and testing
  runbooks for routine content maintenance. The destructive production delete
  safeguards it identified were later implemented through T-156, T-163, T-164,
  and T-165.
- 2026-05-20: Completed T-172. The admin content operations runbook now
  documents how operators verify redacted admin delete audit receipts after
  approved production deletes, including safe fields, excluded private fields,
  a placeholder-only query shape, and a sanitized handoff example.
- 2026-05-22: Prepared T-209 as an owner-independent A-020/R-018 compliance
  slice. It removes unsupported commerce assurance claims from shared public
  banner copy while owner/legal policy pages, consent records, third-party
  disclosures, and app-owned checkout remain separate decisions.
- 2026-05-22: Completed T-209. Shared public security banner copy and matching
  security translation strings no longer advertise unsupported payment,
  buyer-protection, money-back, guarantee, insured/global-shipping, or
  payment-method assurances. Owner/legal policy pages, consent records,
  third-party disclosures, and app-owned checkout remain separate R-018 work.
- 2026-05-22: Completed T-212 as the next R-018 step. It created an
  owner-facing compliance decision packet before runtime policy pages, consent
  fields, unsubscribe behavior, account privacy actions, or third-party
  disclosure changes are assigned.
- 2026-05-22: Recorded owner approval for the T-212 recommendations using
  Heron Laoutaris / hlaoutaris@gmail.com as the owner/privacy contact. Prepared
  T-213 as the first runtime policy-route/footer-link slice.
- 2026-05-22: Completed T-213. Public `/privacy` and `/terms` routes, footer
  legal links, owner approval version display, cookie/session/third-party
  disclosure, and factual Shopify-hosted handoff boundary copy are in place.
  Prepared T-214 as the next newsletter consent/source/unsubscribe slice.
- 2026-05-22: Completed T-214. Newsletter consent/source metadata and public
  unsubscribe behavior are in place with public-safe invalid/expired messages
  and redacted logging. Prepared T-215 as the next account
  acknowledgement/manual privacy request handoff slice.
- 2026-05-22: Completed T-215. App-owned `/sign-in` redirects and smoke
  targets are in place, provider sign-in surfaces include the owner-approved
  privacy/terms notice, and account privacy requests now use a public-safe
  manual handoff to hlaoutaris@gmail.com without exposing private account data.
- 2026-05-22: Completed T-216. Public comment posting now includes the
  owner-approved privacy/terms notice and a public-safe manual
  moderation/removal/correction request handoff to hlaoutaris@gmail.com without
  adding request persistence or moderation workflow promises.
- 2026-05-22: Completed T-217. Contact/product and artwork enquiry forms now
  include public-safe privacy/retention notice copy, policy links, and the
  manual privacy/legal handoff to hlaoutaris@gmail.com without adding stored
  notice fields, operator workflow promises, or retention automation.
- 2026-05-23: Completed T-218. Footer placeholder social links and stale
  copyright copy are cleaned up without inventing real social URLs or adding
  Shopify policy targets.
- 2026-05-23: Completed T-219 as a docs-only owner-input record. Remaining
  R-018 runtime work is blocked on owner-supplied Shopify policy URLs, real
  social URLs, launch jurisdiction/audience assumptions, or explicit opt-in
  decisions for self-service privacy and comment moderation/reporting
  workflows.
- 2026-05-23: Reconciled A-022 deployment-adjacent findings into F-113,
  F-114, and duplicate F-116. T-231 has resolved middleware matcher narrowing,
  T-232 resolved sitemap/default redirect freshness decisions, and ADR 0005 now
  routes provider-backed instrumentation/web-vitals implementation to the Sentry
  baseline task.
- 2026-05-23: Completed T-231. Middleware matching is limited to protected
  frontend/API prefixes (`/account`, `/admin`, `/api/v2/admin`, and
  `/api/v2/user`), with focused coverage proving public pages, public APIs,
  `/api/auth/*`, and prefix lookalikes are outside the protected matcher
  contract. The future `proxy.ts` rename remains in the Next major migration
  track.
- 2026-05-23: Completed T-232. Sitemap and default redirect freshness are now
  explicit: current behavior remains deploy-bound, while later target windows
  are documented before runtime cache changes.
- 2026-05-25: Completed T-278. The accidental default-sandbox build hard
  failures for protected `/account*` routes and `/project/about` are removed.
  `npm run build` under Node `22.14.0` passed in the default sandbox; T-279
  later documented the remaining external-build evidence policy for
  `/biography`, `/collections`, and `/sitemap.xml`.
- 2026-05-25: Completed T-279. The deployment and testing runbooks now require
  release handoffs to record whether `npm run build` ran with external access,
  separate intentional static/ISR evidence from accidental build-isolation
  regressions, smoke `/biography` and `/collections` redirect targets, and
  verify representative dynamic `/sitemap.xml` archive/shop URLs when expected.
- 2026-05-25: Completed T-274. The production ops owner decision packet now
  turns the A-033 monitoring, incident owner, Vercel operator, smoke account,
  and public-smoke variable blockers into concrete owner questions and accepted
  answer formats without changing providers, CI, credentials, Vercel settings,
  or runtime behavior.
- 2026-05-25: Completed T-280. The public smoke discovery endpoint Jest suite
  no longer needs localhost socket permission because it preloads a route-map
  `fetch` fixture into the spawned smoke CLI process. Deployed public smoke
  behavior and public-smoke workflow configuration are unchanged.
- 2026-05-25: Completed T-283. Root header navigation now renders static
  route-root links for `/biography` and `/collections`; build verification
  passed without the previous root-header navigation source failures.
- 2026-05-25: Completed T-287 as a docs-only CI/release-gate policy pass. The
  next workflow slice should add non-secret `Main CI` for the local gate on PRs
  to `main`, pushes to `main`, and manual dispatch. External-access build
  evidence, public smoke, credentialed/admin smoke, Vercel log checks, and
  monitoring remain separate deployment evidence.
- 2026-05-25: Completed T-288. Added the non-secret `Main CI` local-gate
  workflow on PRs to `main`, pushes to `main`, and manual dispatch. It runs
  typecheck, full Jest, build, lint, and event-aware whitespace checks under
  Node `22.14.0` / npm `10.9.2` with `npm ci`, while leaving external-access
  build evidence, public smoke, credentialed/admin smoke, Vercel log checks,
  rollback, and monitoring separate.
- 2026-05-26: Prepared T-301 as a parallel-safe CSP/header allowlist scoping
  task. It should inventory current source requirements and produce a tightening
  plan without editing runtime headers or shared trackers during the parallel
  run.
- 2026-05-26: Completed T-301. The CSP allowlist result scopes a report-only
  tightening step before enforcement; no runtime headers changed.
- 2026-05-26: Prepared T-304 as the report-only CSP implementation/test slice.
  It can run in parallel with T-305/T-306 and should not edit shared trackers.
- 2026-05-26: Completed T-304. `Content-Security-Policy-Report-Only` is now
  emitted alongside the unchanged enforced CSP, and focused security-header
  coverage locks the enforced/report-only split. CSP enforcement, HSTS,
  dynamic CORS, CSP reporting, and monitoring remain separate.

## Next Agent Action

Sentry is approved as the monitoring provider and T-310 is prepared as the first
implementation task. Do not start T-310 while T-307/T-308/T-309 are actively
running if it would overlap package/config/global observability files. Keep
source-map upload, alert automation, credentialed smoke, Vercel privileged
actions, public-smoke repository variables, replay, profiling, broad tracing,
uptime checks, and CI workflow changes separate unless a later owner-approved
task explicitly scopes them.

The first non-secret Main CI local-gate workflow is in place. Keep public
smoke, credentialed/admin smoke, Vercel logs, monitoring, rollback, and
production secrets separate unless a later owner-approved task explicitly
changes that boundary.

T-304 is complete for the report-only CSP observation step. Do not enforce the
tightened CSP, add HSTS, change CORS, add a CSP report endpoint/provider, add
monitoring, or change environment variables without a separate scoped task. Any
future CSP enforcement task should first collect narrow evidence that the
report-only policy does not break public pages or admin upload behavior.

Do not reassign
[T-209 Align commerce assurance copy](../tasks/T-209-align-commerce-assurance-copy.md);
it is complete. T-215 is complete; do not reassign it unless app-owned sign-in
notice, account acknowledgement, or manual request handoff behavior regresses.
T-216, T-217, T-218, and T-219 are complete; do not reassign them unless
comment, contact/enquiry, footer cleanup behavior, or owner-input blocker
documentation regresses. T-207 and T-139 are complete; do not reassign them
unless route fallback source hygiene regresses or the owner/platform monitoring
decision changes. More R-018 runtime work is blocked until owner input exists
for Shopify policy URLs, real social URLs, jurisdiction/audience-specific legal
claims, self-service privacy workflows, or comment moderation/reporting
workflows. Monitoring provider choice is unblocked by ADR 0005 with Sentry
approved; runtime implementation remains pending T-310.

For the A-022 deployment-adjacent work, T-232 and T-233 are complete: sitemap
and default redirect freshness are explicit, and `/biography` is the only
route-level redirect ISR export added by the biography proof. Do not reassign
T-231 or T-233 unless the protected middleware matcher contract or biography
cache policy regresses.

Keep credential/admin smoke, Vercel log inspection, rollback automation,
owner approval to replace the T-134 blocked incident owner rows, and broad
remaining implementation cleanup separate. T-122, T-123, T-124, T-125,
T-126, T-127, T-128, T-129, T-130, T-131, T-132, T-133, T-134, and T-172 are
complete and should not be reassigned unless their source-hygiene,
documentation, policy, workflow, structured logging, public browsing client
state contracts, account/user client/shared utility/admin dashboard fallback
contracts, incident authority handoff, or audit-receipt verification guidance
regresses. T-138 is complete and should not be reassigned unless the
admin bootstrap/recovery runbook regresses. T-149 is complete and should not
be reassigned unless the admin content operations runbook regresses.

Keep Vercel project-setting ownership, CI/dependency-update automation,
provider-specific monitoring, runtime Cloudinary cleanup or signed folder
changes, credential rotation, OAuth callback configuration, full strict CSP
allowlist design, dynamic per-origin CORS, HSTS rollout, build-time live
MongoDB coupling, and the Next/PostCSS owner choice separate.
