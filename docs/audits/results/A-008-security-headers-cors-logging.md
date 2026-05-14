# A-008 Security Headers, CORS, And Logging Result

Status: Completed

Audit goal: [A-008 Security headers, CORS, and logging](../goals.md#a-008-security-headers-cors-and-logging)

Workstream: [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md)

## Summary

The app has a global CSP and API CORS policy, but both are too permissive for a
production admin, auth, and commerce surface. The current Next config no longer
exposes blocked server-only secrets through `env`, and the Cloudinary signing
route now has route-local admin validation and public-safe missing-secret
handling. At audit completion, broad request logging, raw auth/user/error logs,
a Storefront-token-shaped source comment, and route handlers that expose raw
exception messages remained production risks. T-009 later removed the direct
registration credential logs and the token-shaped source comment; owner
verification/rotation remains tracked separately.

## Scope Inspected

- `next.config.mjs`
- `src/middleware.ts`
- `src/app/api/v2/**/route.ts`
- `src/lib/api/**`
- `src/lib/actions/**`
- `src/lib/config/**`
- `src/lib/db/**`
- `src/lib/session/**`
- `scripts/validate-next-config-env.mjs`
- `package.json`
- [Deployment, security, and observability workstream](../../workstreams/deployment-security-and-observability.md)
- [Production-readiness risks](../../risks/production-readiness.md)
- Existing A-001, A-006, A-007, A-013, A-014, and A-015 audit references where
  they overlap logging, credential, deployment, and config risk.

## Commands Run

- `git status --short`: repo is already dirty with unrelated docs, task,
  package, route, script, and test changes; this audit only changed this result
  file.
- `sed -n '1,260p' docs/README.md`: confirmed canonical docs workflow.
- `sed -n '1,260p' docs/audits/goals.md`: confirmed A-008 scope and expected
  result file.
- `sed -n '1,220p' docs/audits/README.md`: confirmed concurrent audit edits
  should stay scoped to the result file unless assigned to reconcile.
- `sed -n '1,260p' docs/workstreams/deployment-security-and-observability.md`:
  confirmed existing CSP/CORS/logging backlog context.
- `sed -n '1,260p' docs/risks/production-readiness.md`: confirmed existing
  R-004, R-019, R-022, and related security/deployment risks.
- `rg --files src/app/api`: inventoried API route files.
- `rg -n "Access-Control|Content-Security-Policy|headers\\(|NextResponse\\.next\\(|new Response\\(" src src/app next.config.mjs`:
  found headers are centralized in `next.config.mjs`; no route-local CORS
  implementation was found.
- `rg -n "console\\.(log|debug|warn|error|info)" src/app/api src/lib src/middleware.ts`:
  found active middleware, API, DB, auth, fetcher, and action logging.
- `rg -n "error instanceof Error \\? error\\.message|error: error\\.message|message: error\\.message" src/app/api src/lib`:
  found routes/actions that return raw exception messages.
- `rg -n "SHOPIFY_STOREFRONT_ACCESS_TOKEN|<redacted-token-prefix>|MONGO_URI|NEXTAUTH_SECRET|JWT_SECRET|AUTH_SECRET|CLOUDINARY_API_SECRET|GOOGLE_SECRET|GITHUB_SECRET" src scripts next.config.mjs package.json`:
  confirmed current secret references and the remaining token-shaped Shopify
  source comment.
- `npm run env:guard`: passed; `next.config.mjs` does not currently expose
  blocked server-only env names through Next config `env`.
- `npm run lint`: passed with no ESLint warnings or errors.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Registration logs expose raw passwords, hashed passwords, and saved user documents. | `src/lib/actions/registerUser.ts:29` logs `email`, `username`, and raw `password`; `src/lib/actions/registerUser.ts:33` logs `hashedPassword`; `src/lib/actions/registerUser.ts:41` and `src/lib/actions/registerUser.ts:45` log the user document/save result. | Remove these logs immediately or replace them with structured, redacted, environment-gated events. Add a focused regression test or static check that blocks logging `password`, `hashedPassword`, and user documents in auth paths. |
| High | A Storefront-token-shaped value remains in source comments. | At audit time, `src/lib/config/shopifyConfig.ts:4` contained a concrete `SHOPIFY_STOREFRONT_ACCESS_TOKEN=<redacted-token-shaped-value>` example. A-001 and A-007 already flagged this as credential-like and unresolved. | Remove the value from source comments, verify whether it was real, and rotate it if it has ever been usable. Keep example env docs placeholder-only. |
| Medium | API CORS headers are globally broad and internally inconsistent. | `next.config.mjs:27-42` applies CORS to every `/api/:path*` route, sets `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Credentials: true`, allows all request headers with `Access-Control-Allow-Headers: *`, and allows mutating methods across public, user, admin, auth-adjacent, and Cloudinary signing APIs. | Replace the global API CORS rule with an allowlist-based policy by route group and environment. Do not send wildcard origin with credentials. Limit methods and headers to the route surface that truly needs browser cross-origin access. |
| Medium | CSP is too permissive and lacks several standard hardening directives. | `next.config.mjs:44-69` sets a global CSP, but `default-src` allows all `https:`, `data:`, and `blob:`; `script-src` allows `'unsafe-eval'` and `'unsafe-inline'`; `connect-src`, `img-src`, and `media-src` allow broad `https:`; there is no `object-src 'none'`, `base-uri 'self'`, `form-action`, `frame-ancestors`, `upgrade-insecure-requests`, or report/report-only path. The same file does not set `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or HSTS. | Build a production CSP from the actual Cloudinary, Shopify, YouTube, Next, font, image, and API needs. Add missing hardening headers and consider a staged `Content-Security-Policy-Report-Only` rollout before enforcing a tighter policy. |
| Medium | Middleware and server request helpers log auth and routing details on every matched request. | `src/middleware.ts:7-33` logs every path, token presence, protected-route state, redirect reason, and admin role check. `src/lib/session/getAuthUser.ts:35-66` logs development auth/test headers, including `req.headers` and test user/admin IDs. `src/lib/api/core/createFetcher.ts:27-55` logs endpoint, request options, stack excerpts, final URL, and response status. | Define a production logging policy and wrapper with levels, redaction, and environment gates. Remove always-on middleware/fetcher logs and avoid logging full request headers, request options, stack traces, or role checks outside controlled debugging. |
| Medium | Several API routes return raw exception messages to clients. | `src/app/api/v2/public/enquiry/route.ts:25-31` returns `error.message`; `src/app/api/v2/public/artwork/[id]/route.ts:31-36` returns `error.message`; admin create/update routes also return raw messages at `src/app/api/v2/admin/artwork/create/route.ts:54-60`, `src/app/api/v2/admin/blog/create/route.ts:45-53`, and `src/app/api/v2/admin/blog/update/[id]/route.ts:95-102`. | Standardize route error responses so clients receive stable public-safe errors while logs receive redacted internal details with a request/correlation ID. Prioritize public routes first, then admin routes. |
| Low | Cloudinary signing is partially hardened, but upload signing policy remains incomplete. | `src/app/api/v2/admin/sign-cloudinary-params/route.ts:43-82` now requires API admin access, validates JSON shape, and hides missing secret details. It still signs arbitrary plain-object `paramsToSign` values and uses public-prefixed Cloudinary cloud/API key names in server config at `src/app/api/v2/admin/sign-cloudinary-params/route.ts:11-14`. | Coordinate with A-009 to decide allowed Cloudinary signing params, upload presets, public/server variable names, and asset lifecycle policy. |

## Findings Register Updates

- Reconciled by the orchestrator on 2026-05-14 into F-051 through F-054, with
  source updates to existing F-011 and F-044.
- Candidate: High, from A-008, "Registration logs expose raw passwords, hashed
  passwords, and saved user documents." Route to deployment/security,
  auth/admin, and testing. Link evidence:
  `src/lib/actions/registerUser.ts:29-45`.
- Candidate: Medium, from A-008, "API CORS headers are globally broad and
  internally inconsistent." Route to deployment/security. Link evidence:
  `next.config.mjs:27-42`.
- Candidate: Medium, from A-008, "CSP allows broad sources, unsafe script
  behavior, and misses standard hardening directives." Route to
  deployment/security. Link evidence: `next.config.mjs:44-69`.
- Candidate: Medium, from A-008, "Always-on middleware, fetcher, DB, auth, and
  route logs need a production logging policy and redaction." Route to
  deployment/security and observability. Link evidence:
  `src/middleware.ts:7-33`, `src/lib/api/core/createFetcher.ts:27-55`,
  `src/lib/db/clientPromise.ts:4-80`, `src/lib/db/mongodb.ts:18-71`.
- Candidate: Medium, from A-008, "Public and admin routes expose raw exception
  messages in JSON responses." Route to data/API and deployment/security. Link
  evidence: `src/app/api/v2/public/enquiry/route.ts:25-31`,
  `src/app/api/v2/public/artwork/[id]/route.ts:31-36`,
  `src/app/api/v2/admin/artwork/create/route.ts:54-60`,
  `src/app/api/v2/admin/blog/create/route.ts:45-53`, and
  `src/app/api/v2/admin/blog/update/[id]/route.ts:95-102`.
- Candidate update to existing F-011/R-022: A-008 reconfirms the
  Storefront-token-shaped source comment remains at
  `src/lib/config/shopifyConfig.ts:4`.

## Risks Updated

- Reconciled by the orchestrator on 2026-05-14.
- Updated R-004 for confirmed broad CORS/CSP policy.
- Updated R-006 and R-019 for public-safe API errors and logging/redaction
  policy.
- Updated R-022 for the reconfirmed Shopify credential-like source comment.
- Added R-029 for registration logs that expose credential material.

## Workstream Updates

- Reconciled by the orchestrator on 2026-05-14.
- Updated
  [Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md),
  [Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md),
  [Data models and API](../../workstreams/data-models-and-api.md), and
  [Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md).
- Created [T-009](../../tasks/T-009-remove-credential-logging-and-source-secret.md)
  for the first credential/logging implementation slice.

## Next Action

T-009 is complete. Continue owner verification/rotation for the removed Shopify
value through R-022, then address broader CSP/CORS/logging policy work through
F-052 and F-053.
