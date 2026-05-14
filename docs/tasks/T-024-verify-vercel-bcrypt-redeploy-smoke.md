# T-024 Verify Vercel Bcrypt Redeploy Smoke

Status: Blocked by redeploy/log access and smoke account.

Workstreams:
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md),
[Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)

## Goal

Verify on Vercel that the bcrypt native trace fix and T-023 auth import-boundary
change resolve the production `500` on `/` and preserve credentials sign-in.

## Why Now

The local code fix is complete: `next.config.mjs` traces bcrypt prebuilds for
serverless functions and T-023 keeps bcrypt out of the normal public-page import
path. The incident is not production-closed until a Vercel deployment containing
both changes is smoked on `GET /` and credentials sign-in.

This task addresses:

- [Incident 2026-05-14 Vercel bcrypt native trace](incident-2026-05-14-vercel-bcrypt-native-trace.md)
- [F-048](../audits/findings-register.md): deployment smoke checks are not
  repeatable.
- [F-065](../audits/findings-register.md): native bcrypt install/build policy
  and runtime behavior remain open until production smoke is recorded.
- [R-017](../risks/production-readiness.md): dependency/native package behavior
  needs runtime verification.
- [R-024](../risks/production-readiness.md): local build/test checks do not
  fully prove deployment runtime behavior.

## Read First

- [Incident 2026-05-14 Vercel bcrypt native trace](incident-2026-05-14-vercel-bcrypt-native-trace.md)
- [T-023 Decouple root layout auth from bcrypt](T-023-root-layout-auth-bcrypt-decoupling.md)
- [Deployment runbook](../runbooks/deployment.md)
- [Deployment, security, and observability workstream](../workstreams/deployment-security-and-observability.md)
- [Testing and quality workstream](../workstreams/testing-and-quality.md)

## Scope

In scope:

- Confirm the deployed commit includes:
  - `next.config.mjs` bcrypt prebuild tracing under
    `experimental.outputFileTracingIncludes`.
  - T-023's dynamic credentials `authorizeUser` import in `authOptions`.
- Trigger or identify a Vercel deployment only if the agent has explicit
  deployment access. If not, record the exact owner action required.
- Smoke the deployed URL:
  - `GET /` returns a non-500 response.
  - Credentials sign-in works with a known test/admin account, without logging
    or recording credentials in docs.
- Inspect targeted Vercel logs for the deployment and confirm the bcrypt
  `node-gyp-build` native-load error is absent for `/`.
- Record minimal evidence in this task and the incident note: deployment URL or
  deployment ID, commit SHA if available, smoke timestamp, routes checked,
  status/result, and any relevant short log summary.
- If the smoke fails, capture the first app-owned stack frame and decide whether
  the cause is local code, missing deployment artifact, environment/runtime, or
  external service. Make a local fix only if the failing cause is clear and
  scoped.
- Update this task, the incident note, deployment/testing workstreams, findings,
  risks, and orchestration state after completion.

Out of scope:

- Do not remove the bcrypt tracing include from `next.config.mjs`.
- Do not change auth architecture beyond a minimal fix required by a failed
  smoke.
- Do not pin Node/package-manager versions; F-064 owns that follow-up.
- Do not start the Next/PostCSS migration.
- Do not paste full raw Vercel logs or secrets into docs.

## Concurrency

You are not alone in the repo. This task primarily owns deployment evidence and
incident docs. Avoid source edits unless production smoke exposes a clear,
localized regression. Coordinate before touching auth config, package files,
Next config, or root layout code.

## Acceptance Criteria

- The deployed app no longer returns the bcrypt native-load `500` on `GET /`.
- Credentials sign-in succeeds on the deployed app.
- Targeted Vercel logs show no repeat of the bcrypt `node-gyp-build` missing
  native build error for `/`.
- The incident note records the deployment evidence and final production status.
- Any inability to deploy or smoke is documented as a precise owner action, not
  left as an implied blocker.

## Partial Smoke Evidence

Captured on 2026-05-14 at 17:20:24 UTC against
`https://laoutaris-nextjs.vercel.app/`.

- `curl -I https://laoutaris-nextjs.vercel.app/` returned `HTTP/2 200`,
  `server: Vercel`, `x-matched-path: /`, `x-vercel-cache: MISS`, and
  `x-vercel-id: fra1::iad1::bvqrj-1778779220713-98f4158169b5`.
- A full `GET /` request also returned `HTTP/2 200` with
  `x-vercel-id: fra1::iad1::828rx-1778779220730-bcc8d370c6d7`.
- The credentials callback was exercised with intentionally invalid, non-secret
  smoke values after fetching a CSRF token. The callback returned `401` with
  `CredentialsSignin`, not `500`. This proves the callback path did not hit the
  bcrypt native-load crash for that request, but it is not a successful
  credentials sign-in.
- Remote `origin/main` was checked with `git ls-remote --heads origin main` and
  resolved to `e26656a812e23d75d49ae59d4a422ce2c6b5ab99`. That commit contains
  the `next.config.mjs` bcrypt tracing include, but the T-023
  `authOptions` dynamic import is still only in the local worktree at the time
  of this smoke. The production alias therefore cannot be claimed to contain
  both required changes.
- This checkout has no `.vercel` project metadata, no installed `vercel` CLI,
  and no documented Vercel token or project access. Targeted Vercel logs could
  not be inspected.
- No documented test/admin credentials or approved secret-channel smoke account
  were available, so successful credentials sign-in was not performed.

Owner action required:

- Commit and push the T-023 auth import-boundary change, then trigger or confirm
  a Vercel deployment containing both the tracing fix and T-023.
- Provide the deployment URL or deployment ID, or Vercel project/log access, so
  the targeted `/` logs can be checked for absence of the bcrypt
  `node-gyp-build` native-load error.
- Provide a known test/admin credentials account through a secret channel, then
  rerun the credentials sign-in smoke without recording secrets.

## Verification

Remote smoke:

```bash
curl -I <deployment-url>/
```

Also verify credentials sign-in through the deployed UI or an approved smoke
procedure that does not expose credentials in logs or docs.

If code changes are required during this task, rerun the narrow relevant tests
plus:

```bash
npm run lint
npm run build
```

## Escalate

Escalate to the orchestrator if:

- The agent cannot access Vercel deployment or logs.
- `GET /` still fails with a bcrypt native-load error after redeploying the
  tracing and T-023 changes.
- Credentials sign-in fails for a reason unrelated to the bcrypt incident.
- Production Node/runtime or Vercel bundling differs from the local assumptions
  in a way that requires an owner deployment-platform decision.
