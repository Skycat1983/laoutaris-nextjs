# Incident 2026-05-14 Vercel Bcrypt Native Trace

Status: Partial production smoke captured; redeploy/log access required.

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
At incident time, the compiled home route bundle contained an external
`require("bcrypt")` through the root layout authentication chain:

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

Follow-up blast-radius reduction was completed by
[T-023](T-023-root-layout-auth-bcrypt-decoupling.md): `authOptions` now
lazy-loads `authorizeUser` inside the credentials provider callback, so
root-layout session reads and public page imports no longer eagerly import the
bcrypt helper or native package.

## Verification

Passed:

- `npm test -- --runTestsByPath __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm run env:guard`
- `npm test -- --runTestsByPath __tests__/unit/validateNextConfigEnv.test.ts __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm run lint`
- `npm_config_platform=linux npm_config_arch=x64 LIBC=glibc node -e "const path=require('path'); const load=require('node-gyp-build'); console.log(load.path(path.resolve('node_modules/bcrypt')));"`
  resolved bcrypt to `node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node`.
- `npm test -- --runTestsByPath __tests__/unit/auth/authOptionsImportBoundary.test.tsx __tests__/unit/auth/credentialsRoleSession.test.ts __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/deployment/nextConfigBcryptTrace.test.ts`
- `npm test`
- `npm run build`

Attempted but did not complete locally:

- `npm run build` failed with local Node heap exhaustion during production
  compilation before this fix was applied. Treat that as a local verification
  blocker, not as a reproduction of the Vercel bcrypt error.

## Remaining Production Action

Redeploy to Vercel, then smoke `GET /` and credentials sign-in. If Vercel still
reports the same bcrypt native-load error, capture the deployment ID/build ID
and inspect the function bundle contents for
`node_modules/bcrypt/prebuilds/linux-x64/bcrypt.glibc.node`.

[T-024 Verify Vercel bcrypt redeploy smoke](T-024-verify-vercel-bcrypt-redeploy-smoke.md)
tracks this production verification step.

## Partial Production Smoke

On 2026-05-14 at 17:20:24 UTC,
`curl -I https://laoutaris-nextjs.vercel.app/` returned `HTTP/2 200` from
Vercel for `x-matched-path: /`
(`x-vercel-id: fra1::iad1::bvqrj-1778779220713-98f4158169b5`). A full
`GET /` also returned `HTTP/2 200`
(`x-vercel-id: fra1::iad1::828rx-1778779220730-bcc8d370c6d7`).

An intentionally invalid credentials callback smoke returned `401` with
`CredentialsSignin`, not `500`. This shows the deployed credentials callback did
not reproduce the bcrypt native-load crash for that invalid request, but it does
not prove successful credentials sign-in.

The production incident is not closed. The current `origin/main` SHA observed
during smoke was `e26656a812e23d75d49ae59d4a422ce2c6b5ab99`, which includes
the bcrypt tracing config but not the local T-023 dynamic credentials import.
This checkout also lacked `.vercel` metadata, Vercel CLI access, targeted log
access, and a documented smoke credentials account.

## Follow-Up

[T-023 Decouple root layout auth from bcrypt](T-023-root-layout-auth-bcrypt-decoupling.md)
completed the local blast-radius reduction. Keep the `next.config.mjs` bcrypt
prebuild tracing include until redeploy smoke confirms both `GET /` and
credentials sign-in in Vercel.

The production incident remains open until a T-024 rerun records successful
Vercel smoke evidence for a deployment that contains both local fixes.
