# T-280 Handle Public Smoke Socket Sandbox Path

Status: Completed

Workstreams:

- [Testing and quality](../workstreams/testing-and-quality.md)
- [Deployment, security, and observability](../workstreams/deployment-security-and-observability.md)

## Goal

Make the public smoke discovery endpoint test's localhost socket requirement
explicit, or refactor the fixture so it can run in the default sandbox.

## Context

A-034 found `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
failed during full `npm test` in the default sandbox with
`listen EPERM: operation not permitted 127.0.0.1`, then passed with escalated
socket permission.

This is separate from deterministic Jest assertion drift and admin/form timeout
work.

## Scope

In scope:

- Decide whether this suite should require socket permission in sandboxed agent
  runs or avoid real localhost binding.
- If documenting the requirement, update the testing/deployment runbook with
  exact command/permission expectations.
- If refactoring, keep the test's discovery endpoint assertions equivalent
  without broadening deployment behavior.

Out of scope:

- Full public smoke workflow redesign.
- Admin/form Jest timeout tuning.
- Monitoring, CI secret, or smoke-account decisions.

## Concurrency

Can run in parallel with T-276/T-277 only if it does not edit shared Jest config
used by those tasks. Coordinate with T-279 if both edit testing/deployment
runbooks.

## Files Likely Touched

- `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
- `docs/runbooks/testing.md`
- `docs/runbooks/deployment.md`
- `docs/tasks/T-280-handle-public-smoke-socket-sandbox-path.md`
- `docs/tasks/README.md`

## Completion Contract

- Mark this task `Status: Completed` only after the chosen socket strategy is
  implemented or documented.
- Update `docs/tasks/README.md`.
- Record whether default-sandbox or escalated-socket verification was used.

## Acceptance Criteria

- Future agents know whether the public smoke discovery endpoint suite needs
  socket permission.
- If the fixture is refactored, it still validates robots/sitemap discovery
  endpoint behavior.
- No unrelated smoke, monitoring, or CI changes are mixed in.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts
git diff --check
```

If the accepted policy requires escalated socket permission, record that instead
of treating the default-sandbox failure as a product regression.

## Handoff Notes

- Completed on 2026-05-25.
- Chosen strategy: refactored
  `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` to avoid
  real localhost binding. The suite still spawns the real
  `scripts/smoke-public-routes.mjs` CLI, but preloads an in-process `fetch`
  fixture with the route map instead of starting `http.createServer()` on
  `127.0.0.1`.
- Default-sandbox verification was used; no escalated socket permission is
  required for this focused suite.
- Verification:
  `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts`
  passed in the default sandbox, with the existing Node punycode deprecation
  warning.
