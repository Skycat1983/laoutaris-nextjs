# T-278 Isolate Account Project Build Hard Failures

Status: Completed

Workstreams:

- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)
- [Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md)
- [Auth, admin, and permissions](../workstreams/auth-admin-and-permissions.md)
- [Frontend routes and components](../workstreams/frontend-routes-and-components.md)

## Goal

Remove the accidental build-time hard failures for protected `/account*` routes
and `/project/about` without changing the intentional ISR/static surfaces.

## Context

A-035 showed that `npm run build` compiles but fails during static generation in
the default sandbox because MongoDB SRV lookup is blocked. The hard-failure
routes are:

- `/account`, `/account/settings`, `/account/comments`, `/account/favourites`,
  and `/account/watchlist`, where the account layout and imported NextAuth
  adapter path can connect to MongoDB during build.
- `/project/about`, which is classified as static but renders
  `ArticleLoader slug="about" section="project"` and therefore needs MongoDB.

The same build passed with external network access, so this task should isolate
the accidental route policies rather than broad release evidence.

## Scope

In scope:

- Remove or defer unconditional account layout/NextAuth MongoDB work during
  build for `/account*`.
- Add the smallest explicit rendering policy or source change for
  `/project/about` after deciding whether it is live MongoDB content or static
  project copy.
- Add focused source/tests that prevent the accidental build-time coupling from
  returning where practical.
- Run `npm run build` in the default sandbox and record whether `/account*` and
  `/project/about` still appear as hard failures.

Out of scope:

- Root header static-safe navigation work.
- `/biography`, `/collections`, and `/sitemap.xml` external-build policy.
- `/prototype/home` production-build policy.
- Monitoring, smoke accounts, or Vercel owner decisions.

## Concurrency

Can run in parallel with Jest repair tasks. Do not run in parallel with another
agent editing account layout/session/authOptions/clientPromise or
`/project/about`.

## Files Likely Touched

- `src/app/account/layout.tsx`
- `src/components/loaders/componentLoaders/AccountSubnavLoader.tsx`
- `src/lib/config/authOptions.ts`
- `src/lib/db/clientPromise.ts`
- `src/app/project/about/page.tsx`
- Focused tests under `__tests__/unit/`
- `docs/tasks/T-278-isolate-account-project-build-hard-failures.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after account/project build behavior
  is fixed or a concrete blocker is documented.
- Update `docs/tasks/README.md`.
- Update relevant workstream and architecture/runbook docs if route rendering
  policy changes.
- Record exact build output summary, including any remaining external dependency
  failures outside this task's scope.

## Acceptance Criteria

- `/account*` routes no longer attempt unconditional MongoDB work just to build
  release artifacts.
- `/project/about` has an explicit accepted rendering/data policy.
- Default-sandbox `npm run build` no longer hard-fails because of `/account*`
  or `/project/about`; any remaining failures are mapped to A-035 intentional
  or deferred surfaces.

## Verification

```bash
npm run build
git diff --check
```

Add focused tests or static source checks that match the implemented mitigation.

## Handoff Notes

- Completed on 2026-05-25.
- `src/app/account/layout.tsx` no longer performs layout-level `dbConnect()`
  work and now declares `dynamic = "force-dynamic"` for the protected account
  segment.
- `src/lib/db/clientPromise.ts` now exports a lazy thenable promise so importing
  `authOptions` for session reads does not instantiate or connect the raw
  MongoDB client until NextAuth adapter code awaits it.
- `src/app/project/about/page.tsx` now declares
  `dynamic = "force-dynamic"` because it renders MongoDB-owned project article
  content through `ArticleLoader`.
- Focused tests updated/added:
  `__tests__/unit/accountLayoutSubnavMount.test.tsx`,
  `__tests__/unit/db/clientPromiseLazyConnection.test.ts`, and
  `__tests__/unit/publicRouteCachePolicy.test.ts`.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/accountLayoutSubnavMount.test.tsx __tests__/unit/db/clientPromiseLazyConnection.test.ts __tests__/unit/publicRouteCachePolicy.test.ts __tests__/unit/auth/authOptionsImportBoundary.test.tsx`
  passed with 4 suites and 17 tests.
- Verification: `npm run build` under Node `22.14.0` passed in the default
  sandbox. The route table shows `/account`, `/account/settings`,
  `/account/comments`, `/account/favourites`, `/account/watchlist`, and
  `/project/about` as dynamic (`ƒ`). `/biography`, `/collections`, and
  `/sitemap.xml` remain static/ISR surfaces for T-279. No `/account*` or
  `/project/about` hard failures remained.
- Verification: `git diff --check` passed.
