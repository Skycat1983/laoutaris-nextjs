# T-086 Remove Hard-Coded Localhost Navigation URLs

Status: Completed

Workstreams:
[Architecture refactor and code health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend routes and components](../workstreams/frontend-routes-and-components.md),
[Deployment, security, and observability](../workstreams/deployment-security-and-observability.md),
[Testing and quality](../workstreams/testing-and-quality.md)

## Goal

Remove the remaining hard-coded same-app origins from user-facing navigation and
the `/project` redirect by using relative app paths, then refresh the
environment documentation made stale by the completed shop loader migration.

## Context

- F-030 tracks split route URL ownership across helpers and hard-coded paths.
- T-085 removed `ShopProductsLoader`'s `NEXT_PUBLIC_BASE_URL`/localhost
  same-app HTTP dependency.
- A targeted source check after T-085 found no remaining direct same-app HTTP
  calls under `src/components/loaders`.
- Remaining URL/base URL work should be split: user-facing navigation and
  redirect literals are small enough for this task, while shared server API
  helper base URL policy remains a separate architecture decision.
- Next.js `Link`, `router.push()`, and App Router `redirect()` can use
  same-app relative paths for these flows.

## Scope

In scope:

- Change `LogoutForm` to navigate home with a relative app path instead of
  `http://localhost:3000/`.
- Change `MobileNavDrawer` account auth links to same-app relative auth paths
  instead of `http://localhost:3000/api/auth/signin`.
- Change `src/app/project/page.tsx` to redirect to `/project/about` without
  constructing an origin from `VERCEL_URL` or localhost.
- Preserve existing mobile drawer labels, order, disabled states, and current
  auth destination behavior; do not invent a new sign-up flow.
- Use existing route constants or a tiny local constant only if it keeps the
  touched code clearer. Do not introduce a broad URL-builder abstraction in this
  task.
- Update `docs/runbooks/environment.md` so it no longer claims
  `NEXT_PUBLIC_BASE_URL` is required by the current shop listing loader, and so
  `VERCEL_URL` no longer names the current `/project` redirect after the source
  fix.
- Update affected workstreams, orchestration state, and F-030 notes after
  completion.
- Add focused tests or source hygiene checks proving the touched navigation and
  redirect files no longer contain hard-coded app origins.

Out of scope:

- Do not change the shared `serverPublicApi`, `serverUserApi`,
  `serverAdminApi`, or generic `serverApi` base URL helpers.
- Do not change NextAuth callback logic, OAuth provider callback configuration,
  middleware behavior, session behavior, or sign-in/sign-out semantics beyond
  replacing same-app absolute navigation strings.
- Do not remove historical OAuth callback comments or unrelated localhost
  references outside the touched user-facing navigation/redirect slice.
- Do not change shop product listing behavior, product detail behavior, checkout
  or cart ownership, or Shopify API validation.
- Do not attempt a repo-wide route-builder or base URL centralization.

## Files Likely Touched

- `src/components/modules/forms/user/LogoutForm.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`
- `src/app/project/page.tsx`
- Focused test file(s) under `__tests__/unit/`
- `docs/runbooks/environment.md`
- `docs/orchestration/state.md`
- `docs/workstreams/architecture-refactor-and-code-health.md`
- `docs/workstreams/frontend-routes-and-components.md`
- `docs/workstreams/deployment-security-and-observability.md`
- `docs/workstreams/testing-and-quality.md`
- `docs/audits/findings-register.md`
- `docs/risks/production-readiness.md` if the remaining risk wording changes

## Acceptance Criteria

- `LogoutForm` redirects to `/` without a hard-coded origin.
- `MobileNavDrawer` auth account links use `/api/auth/signin` or an equivalent
  same-app relative constant, while preserving current labels, ordering, and
  disabled-state behavior.
- `/project` redirects to `/project/about` without reading `VERCEL_URL` or
  falling back to `http://localhost:3000`.
- The touched source files contain no `http://localhost:3000`,
  `NEXT_PUBLIC_BASE_URL`, or `process.env.VERCEL_URL` references.
- `docs/runbooks/environment.md` reflects that `NEXT_PUBLIC_BASE_URL` is no
  longer required by the current shop listing loader after T-085, and that
  `VERCEL_URL` is no longer used by the current `/project` redirect after this
  task.
- A post-change source search documents any remaining localhost/base URL
  occurrences as out-of-scope shared helper, platform, test, or historical
  comment references.

## Verification

Run focused checks first, then broaden:

```bash
npm test -- --runTestsByPath <focused route/navigation URL tests>
npm run lint
npm run build
rg -n "http://localhost:3000|NEXT_PUBLIC_BASE_URL|process\.env\.VERCEL_URL" src docs/runbooks/environment.md
git diff --check
```

## Handoff Notes

- Prepared on 2026-05-17 after T-085 completed and a follow-up source check
  found the loader same-app HTTP migration thread clear.
- Keep this task as the user-facing navigation and `/project` redirect cleanup
  only. If shared server API helper base URL policy, OAuth callback ownership,
  or broad route-builder needs surface during implementation, record them as
  follow-up candidates instead of widening the edit.
- Completed on 2026-05-17.
- `LogoutForm` now pushes `/` after successful sign-out, `MobileNavDrawer`
  points both current auth account links at `/api/auth/signin`, and
  `/project` redirects directly to `/project/about`.
- `docs/runbooks/environment.md` now records `NEXT_PUBLIC_BASE_URL` as a
  deprecated public URL candidate after T-085 and notes that `VERCEL_URL` is no
  longer used by the current `/project` redirect.
- Added focused coverage in `__tests__/unit/navigationRelativeUrls.test.tsx`
  for the project redirect target, logout home navigation, and source hygiene
  across the three touched files.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/navigationRelativeUrls.test.tsx`,
  `npm run lint`, `npm run build`,
  `rg -n "http://localhost:3000|NEXT_PUBLIC_BASE_URL|process\.env\.VERCEL_URL" src docs/runbooks/environment.md`,
  and `git diff --check` passed. Build retained existing unrelated
  static-generation MongoDB, branch-verification, navigation-link, and
  `ArticleView` debug output.
