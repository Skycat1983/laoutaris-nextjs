# Incident 2026-05-14 Vercel Bcrypt Native Trace

Status: Fixed locally; redeploy required.

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Production Signal

Vercel logged a `500 Internal Server Error` for `page: "/"`. The pasted log did
not include request method, timestamp, deployment ID, build ID, or Vercel
environment label.

Relevant stack summary:

- Runtime: Node `22.22.2`, Linux x64, glibc, ABI `127`.
- Failing dependency load: `/var/task/node_modules/bcrypt`.
- Error: `node-gyp-build` could not find a native bcrypt build for the runtime.
- First app-owned route/page boundary: `src/app/layout.tsx`, because the root
  layout imports `authOptions` and calls `getServerSession(authOptions)` for all
  pages, including `/`.

## Root Cause

This was a deployment bundle/runtime mismatch after the `bcrypt@6.0.0` upgrade.
The compiled home route bundle contains an external `require("bcrypt")` through
the root layout authentication chain:

`src/app/layout.tsx` -> `src/lib/config/authOptions.ts` ->
`src/lib/actions/authenticateUser.ts` -> `src/lib/helpers/bcrypt.ts`.

`bcrypt@6.0.0` ships native prebuilds under `node_modules/bcrypt/prebuilds/`.
Vercel loaded the package JavaScript, but the deployed function did not have a
matching Linux x64 glibc native `.node` file available to `node-gyp-build`.

## Local Fix

`next.config.mjs` now adds `experimental.outputFileTracingIncludes` for
`node_modules/bcrypt/prebuilds/**/*` across server routes so Vercel functions
ship the native bcrypt prebuilds they need at runtime.

Focused coverage was added in
`__tests__/unit/deployment/nextConfigBcryptTrace.test.ts`.

## Verification

Passed:

- `npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm run env:guard`
- `npm test -- --runTestsByPath __tests__/unit/validateNextConfigEnv.test.ts __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm run lint`
- `npm_config_platform=linux npm_config_arch=x64 LIBC=glibc node -e "const path=require('path'); const load=require('node-gyp-build'); console.log(load.path(path.resolve('node_modules/bcrypt')));"`
  resolved bcrypt to `node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node`.

Attempted but did not complete locally:

- `npm run build` failed with local Node heap exhaustion during production
  compilation before this fix was applied. Treat that as a local verification
  blocker, not as a reproduction of the Vercel bcrypt error.

## Remaining Production Action

Redeploy to Vercel, then smoke `GET /` and credentials sign-in. If Vercel still
reports the same bcrypt native-load error, capture the deployment ID/build ID
and inspect the function bundle contents for
`node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node`.
