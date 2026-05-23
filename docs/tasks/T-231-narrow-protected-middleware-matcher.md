# T-231 Narrow Protected Middleware Matcher

Status: Planned

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Deployment Security And Observability](../workstreams/deployment-security-and-observability.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Restrict `src/middleware.ts` matching to protected frontend and API prefixes so
public pages and public APIs do not enter middleware before the early return.

## Context

- A-022 found middleware currently matches most public paths with
  `"/((?!api/auth|_next/static|_next/image|favicon.ico).*)"`.
- T-102 already made public paths return before `getToken()`, but the middleware
  still executes for most public requests.
- Protected prefixes are already expressed in route constants:
  `/account`, `/admin`, `/api/v2/admin`, and `/api/v2/user`.
- The future `middleware.ts` to `proxy.ts` rename belongs to the Next major
  migration track, not this Next 14 task.

## Scope

In scope:

- Change `config.matcher` to match only protected frontend/API prefixes.
- Preserve current behavior for unauthenticated protected frontend redirects,
  protected API JSON `401`, non-admin admin route/API `403` or redirect, and
  authenticated protected pass-through.
- Keep `/api/auth/*` outside protected middleware behavior.
- Add focused coverage for the matcher contract, including public pages/public
  APIs not matching the middleware config where practical.
- Fix any route utility prefix false positives if the matcher or tests expose
  them, while preserving existing protected route coverage.

Out of scope:

- Do not rename `middleware.ts` to `proxy.ts`.
- Do not change NextAuth configuration, JWT/session content, role policy, API
  guards, or route protection scope.
- Do not add cache/ISR behavior.

## Concurrency

This can run after T-230 or in parallel with it if file ownership does not
overlap. It should not run in parallel with other work editing
`src/middleware.ts`, protected route constants, or route utility tests.

Owned files:

- `src/middleware.ts`
- `src/lib/utils/routeUtils.ts` only if needed for exact prefix semantics
- `__tests__/unit/middleware.test.ts`
- `__tests__/unit/utils/routeUtils.test.ts`
- `__tests__/unit/security/publicShellAuthBoundaries.test.ts` only if the
  public-shell invariant needs an update

Do not edit shared trackers in parallel.

## Acceptance Criteria

- Middleware matcher is limited to protected frontend/API route prefixes.
- Public pages and public APIs are not covered by the matcher contract.
- Current protected route auth behavior is preserved.
- The task does not perform the Next major `proxy.ts` rename.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/middleware.test.ts __tests__/unit/utils/routeUtils.test.ts __tests__/unit/security/publicShellAuthBoundaries.test.ts
npm run build
```

## Handoff Notes

- Finding: F-113.
- Risk: R-012.
- Next task after this passes: T-232 public cache/freshness policy.
