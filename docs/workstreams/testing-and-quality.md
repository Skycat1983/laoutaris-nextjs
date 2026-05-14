# Testing And Quality Workstream

Status: Planned

Goal: build a dependable verification baseline that supports production
refactoring without turning every change into a manual QA pass.

## Depends On

- [Testing runbook](../runbooks/testing.md)
- [Routes and API architecture](../architecture/routes-and-api.md)
- [Production-readiness risks](../risks/production-readiness.md)

## Blocks

- Safe refactoring across shared modules.
- Production release confidence.
- CI readiness.

## Related Code Areas

- `jest.config.js`
- `jest.setup.js`
- `__tests__/`
- `package.json`
- Any route, transform, helper, or component touched by refactors.

## Current Facts

- Existing scripts are `npm test`, `npm run build`, `npm run lint`, and
  `npm run dev`.
- Jest uses `next/jest` with `jsdom`.
- Current tests are mostly utilities plus a small home view integration test.
- No dedicated end-to-end script is present in `package.json`.
- Project owner reports testing has been attempted but is not yet successfully
  established as a reliable production-readiness practice.

## Backlog

- Establish which tests must pass before each handoff.
- Separate working test infrastructure from attempted or unreliable test
  patterns.
- Add a route/API testing strategy for high-risk endpoints.
- Add transform and schema contract tests where data shape is fragile.
- Decide whether browser smoke tests are needed before production launch.
- Add CI documentation after the chosen checks are stable.

## Acceptance Criteria

- Every production-critical workstream lists its required verification commands.
- Test failures are documented with owner and next action.
- New refactors include focused tests when behavior changes.
- Build and test commands can be run by a new agent without extra context.

## Verification

```bash
npm test
npm run build
npm run lint
```

## Progress

- Documentation scaffold created.

## Next Agent Action

Run the baseline commands, record current pass/fail state here, and create risks
for any failures that block production readiness.
