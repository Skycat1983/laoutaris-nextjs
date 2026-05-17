# T-087 Retire Server API Self-Fetch Wrappers

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the now-unused server-side same-app API wrapper layer and its remaining
stale import so current source no longer carries runtime localhost/Vercel base
URL construction for same-app server reads.

## Context

- [ADR 0004](../decisions/0004-server-data-access-ownership.md) deprecated
  `serverApi`, `serverPublicApi`, `serverUserApi`, and `serverAdminApi` for
  same-app SSR and server actions.
- T-070 through T-085 migrated the route-critical loader/page reads that still
  depended on those wrappers to shared server-only services.
- T-086 removed the user-facing hard-coded localhost URL slice.
- A source check after T-086 shows the only active app import of the wrapper
  layer is a stale `serverApi` import and commented old code in
  `src/app/account/favourites/page.tsx`; the wrapper modules themselves still
  contain the remaining runtime `VERCEL_ENV`/`VERCEL_URL`/localhost base URL
  construction.
- Client API wrappers and route-specific fetcher factories are still used and
  should remain intact.

## Scope

In scope:

- Remove the stale `serverApi` import, unused type/helper imports, and commented
  old self-fetch block from `src/app/account/favourites/page.tsx`, preserving
  the current redirect to `/account/settings`.
- Delete the retired server wrapper entrypoints:
  - `src/lib/api/serverApi.ts`
  - `src/lib/api/public/serverPublicApi.ts`
  - `src/lib/api/user/serverUserApi.ts`
  - `src/lib/api/admin/serverAdminApi.ts`
- Preserve `clientApi`, `clientPublicApi`, `clientUserApi`,
  `clientAdminApi`, `createFetcher`, and the route-specific fetcher factory
  modules used by client code.
- Update tests that referenced the deleted server wrappers, replacing
  debug-log hygiene checks with source/import hygiene that proves the retired
  wrappers are gone and no active source imports `@/lib/api/serverApi` or the
  server wrapper entrypoints.
- Update the environment runbook so `VERCEL_ENV` and `VERCEL_URL` are no longer
  documented as current-source runtime variables if their only source usage was
  the retired server wrappers.
- Update affected workstreams, orchestration state, findings, risks, and ADR
  0004 notes after completion.

Out of scope:

- Do not delete or change client API wrappers, shared `createFetcher`, or the
  route-specific fetcher factories that client code still uses.
- Do not change API route contracts, server-only data services, transforms, or
  client fetch behavior.
- Do not change NextAuth callbacks, OAuth provider callback settings, or the
  historical OAuth callback comment in `src/lib/db/mongodb.ts`; record that as
  a separate documentation/source-hygiene candidate if needed.
- Do not change the MongoDB driver `serverApi` option in
  `src/lib/db/clientPromise.ts`; it is unrelated to the retired app API wrapper
  layer.
- Do not introduce a new base URL helper or route-builder abstraction in this
  task.

## Files Likely Touched

- `src/app/account/favourites/page.tsx`
- `src/lib/api/serverApi.ts`
- `src/lib/api/public/serverPublicApi.ts`
- `src/lib/api/user/serverUserApi.ts`
- `src/lib/api/admin/serverAdminApi.ts`
- `__tests__/unit/security/credentialSourceHygiene.test.ts` or a focused
  source-hygiene test file
- `docs/runbooks/environment.md`
- `docs/decisions/0004-server-data-access-ownership.md`
- `docs/orchestration/state.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md`

## Acceptance Criteria

- `src/app/account/favourites/page.tsx` has no unused imports or commented
  `serverApi` self-fetch block and still redirects to `/account/settings`.
- The four retired server wrapper entrypoint files are deleted.
- Current source has no imports from `@/lib/api/serverApi`,
  `@/lib/api/public/serverPublicApi`, `@/lib/api/user/serverUserApi`, or
  `@/lib/api/admin/serverAdminApi`.
- Current source under `src/lib/api` no longer contains
  `process.env.VERCEL_ENV`, `process.env.VERCEL_URL`, or
  `http://localhost:3000`.
- Client API modules and route-specific fetcher factories still compile and are
  not behaviorally changed.
- `docs/runbooks/environment.md` reflects that `VERCEL_ENV`/`VERCEL_URL` are
  not required by current source after the wrapper retirement, unless another
  active source usage is found and documented.
- A post-change source search documents remaining `localhost`/Vercel URL hits
  as out-of-scope historical comments, tests, docs, or unrelated platform
  references.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused source-hygiene tests>
npm run lint
npm run build
rg -n "from [\"']@/lib/api/(serverApi|public/serverPublicApi|user/serverUserApi|admin/serverAdminApi)[\"']|serverPublicApi|serverUserApi|serverAdminApi" src __tests__
rg -n "process\.env\.VERCEL_ENV|process\.env\.VERCEL_URL|http://localhost:3000" src/lib/api src/app/account/favourites/page.tsx
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-086 completed.
- Completed on 2026-05-17: removed the stale account favourites imports and
  commented self-fetch block, deleted the retired server wrapper entrypoints,
  and replaced the old wrapper debug-log hygiene check with source/import
  hygiene proving the deleted wrappers stay deleted, active source has no
  retired wrapper imports, and `src/lib/api` has no retired same-app server URL
  construction.
- Focused verification passed:
  `npm test -- --runTestsByPath __tests__/unit/security/credentialSourceHygiene.test.ts`
  and the updated loader source-hygiene tests. Broader verification passed:
  `npm run lint`, `npm run build`, the required retired-import and
  `VERCEL_ENV`/`VERCEL_URL`/localhost source searches, and `git diff --check`.
  Build retained existing MongoDB/static-generation and debug-log output
  outside this slice.
