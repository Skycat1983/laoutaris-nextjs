# A-027 Verification Gate Snapshot

Status: Completed

Audit goal:
[A-027 Verification gate snapshot](../goals.md#a-027-verification-gate-snapshot).

Workstream: [Testing and quality](../../workstreams/testing-and-quality.md).

## Assignment Summary

Determine the current reliability of project verification commands and release
gates without changing code, dependencies, scripts, or CI.

## Summary

Current verification is mixed. The documented pinned runtime is available through
`nvm` and the install dry-run, env guard, lint, and production build can pass
under Node `22.14.0` / npm `10.9.2`. The default shell runtime is below that
baseline, so agents who run commands without activating the repo runtime get
weaker evidence.

The full Jest gate is currently red in this dirty worktree. One failing suite was
caused by sandbox socket restrictions and passed when rerun with permission to
bind `127.0.0.1`, but the full `npm test` command still has multiple assertion
drift and timeout failure classes. The explicit `npx tsc --noEmit --pretty false
--skipLibCheck` check is also red on test-file type errors and is not currently
part of `package.json` or CI.

The build gate is still environment-coupled: `npm run build` failed in the
default sandbox during static generation because MongoDB SRV DNS was blocked,
then passed with external network access. CI coverage is limited to the
unauthenticated public-smoke workflow; there is no repository-owned CI workflow
for install, env guard, Jest, lint, build, or explicit TypeScript.

## Scope Inspected

- `package.json` scripts, engines, package manager, and verification-related
  dependencies.
- `.nvmrc` and `.node-version` runtime pins.
- `docs/runbooks/testing.md`, `docs/runbooks/deployment.md`,
  `docs/runbooks/environment.md`, and `docs/risks/production-readiness.md`.
- `.github/workflows/public-smoke.yml`.
- `scripts/validate-next-config-env.mjs` and `scripts/smoke-public-routes.mjs`.
- Current worktree status before and after verification commands.

## Commands Run

| Command | Outcome | Notes |
| --- | --- | --- |
| `git status --short` | Informational | Worktree was already dirty with modified docs/tests/source files and untracked audit/prototype assets. This snapshot reflects current worktree state, not clean `main`. |
| `node -v`; `npm -v` | Baseline mismatch by default | Default shell reported Node `v21.2.0` and npm `10.2.3`, below the documented Node `22.14.0` / npm `10.9.2` baseline. |
| `source ~/.nvm/nvm.sh && nvm use 22.14.0 && node -v && npm -v` | Passed | Confirmed pinned local runtime: Node `v22.14.0`, npm `10.9.2`. |
| `npm run env:guard` | Passed | Ran under pinned runtime. `next.config.mjs` server-secret env guard passed. |
| `npm ci --dry-run --ignore-scripts` | Passed | Ran under pinned runtime; completed in about 54s and reported the lockfile install plan without lifecycle scripts. |
| `npm test` | Failed | Full Jest gate: 12 failed suites, 182 passed, 194 total; 22 failed tests, 1353 passed, 1375 total. Failure classes included assertion drift, full-suite timeouts, and one sandbox socket-binding suite. |
| `npm test -- --runTestsByPath __tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` | Passed with escalated socket permission | The isolated public-smoke discovery test suite passed once it could bind `127.0.0.1`; the same suite's full-run failure was a sandbox artifact. |
| `npm run lint` | Passed | `next lint` reported no ESLint warnings or errors under pinned runtime. |
| `npx tsc --noEmit --pretty false --skipLibCheck` | Failed | Four type errors, all in tests: `publicBreadcrumbStructuredData.test.tsx`, `ArtworkListLoader.test.tsx`, `modalProviderLazyHost.test.tsx`, and `publicRouteCachePolicy.test.ts`. |
| `npm run build` | Failed in sandbox, then passed with external network access | Sandbox run failed during page data/static generation with `querySrv ECONNREFUSED _mongodb._tcp.cluster0.nsrllxe.mongodb.net` on account and project/about pages. Escalated rerun passed and produced the route build summary. |
| `npm run smoke:public -- --help` | Passed | Verified script entrypoint/help only. No live smoke target was run because A-027 did not assign a deployed or local base URL and approved detail-route fixtures. |

## Gate Baseline

| Gate | Current status | Evidence | Release risk | Recommended follow-up |
| --- | --- | --- | --- | --- |
| Runtime pin | Partially reliable | `package.json` pins npm `10.9.2` and Node `>=22.14.0 <23`; `.nvmrc` and `.node-version` both contain `22.14.0`, but the default shell was Node `21.2.0`. | Medium: naive local command runs can produce non-baseline evidence. | Add a handoff reminder or preflight check to activate Node `22.14.0` before verification. |
| Lockfile install | Passing locally | `npm ci --dry-run --ignore-scripts` passed under Node `22.14.0`. | Low: install path is reproducible in this environment, but not CI-enforced outside public smoke. | Keep this command in pre-deployment checks and add it to CI once the main gate workflow exists. |
| Env guard | Passing | `npm run env:guard` passed; `npm run build` also invokes it before `next build`. | Low for current config, medium if bypassed because only build currently chains it. | Include `npm run env:guard` in any future main CI workflow. |
| Jest | Failing | Full `npm test` failed with 12 suites / 22 tests red; isolated socket-binding suite passed with escalated permission. | High: current full test gate cannot protect production refactors. | Restore the full `npm test` command, starting with assertion drift and timeout-prone suites in the current worktree. |
| ESLint | Passing | `npm run lint` passed with no warnings or errors. | Low: lint is reliable locally, but not currently part of main CI. | Add lint to the future main verification workflow. |
| Explicit TypeScript | Failing and unenforced | `npx tsc --noEmit --pretty false --skipLibCheck` found four test-file errors; no package script exists for this gate. | Medium: Next build passes while a broader repo type check fails, so type debt can accumulate outside app build coverage. | Decide whether to add a `typecheck` script after fixing the current test-file errors. |
| Build | Passing only with external network | `npm run build` failed in sandbox on MongoDB SRV lookup and passed with external network access. | High: build evidence depends on live external services and permissions. | Isolate or explicitly document build-time live data requirements and keep external-access build evidence in release handoffs. |
| Public smoke script | Script present, target not verified in this audit | `package.json` exposes `smoke:public`; help output confirms unauthenticated route/status scope. Deployment runbook says it needs a base URL and optional approved records. | Medium: command is useful, but a skipped or unconfigured smoke does not prove production route health. | Run against a deployed URL only in deployment smoke tasks with approved route fixtures and record skipped optional checks. |
| GitHub Actions public smoke | Narrow CI coverage only | `.github/workflows/public-smoke.yml` has manual `base_url` and scheduled `SMOKE_BASE_URL`; scheduled runs skip when the variable is unset and optional detail checks depend on repo variables. | Medium: CI can prove only unauthenticated public smoke, not build/test/lint/typecheck or credential/admin/log evidence. | Add a separate main verification workflow after local gates are green; keep public smoke as deployed-route evidence. |
| Credential/admin/log release smoke | Manual only | Deployment runbook requires credentialed sign-in/admin checks and targeted Vercel log review; public smoke explicitly does not cover them. | High for release readiness when auth/admin/runtime changes ship. | Keep credential/admin/log smoke as required release evidence until a scoped automation plan exists. |

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Full Jest is not currently a usable release gate. | `npm test` failed with 12 failed suites and 22 failed tests in the current worktree. The sandbox-only public-smoke discovery suite passed in isolation with socket permission, leaving multiple non-sandbox failure classes. | Create a focused stabilization task to restore `npm test`, then rerun the full suite under Node `22.14.0`. |
| High | The production build still depends on external MongoDB access during static generation. | `npm run build` failed in the default sandbox with MongoDB SRV `ECONNREFUSED` on account and project/about prerendering, then passed with external network access. | Decide whether build should avoid live data or require explicit external-service access/evidence in release gates. |
| Medium | Explicit TypeScript checking is red and not wired into package scripts or CI. | `npx tsc --noEmit --pretty false --skipLibCheck` failed on four test-file errors while `npm run build` passed with external access. | Fix current type errors, then add an owned `typecheck` gate if the project wants broader type coverage than Next build. |
| Medium | CI does not currently enforce the local verification baseline. | Only `.github/workflows/public-smoke.yml` exists; it runs `npm run smoke:public` against a supplied/scheduled URL, not install/env/test/lint/build/typecheck. | Add a main verification workflow after `npm test` and explicit typecheck are green enough to avoid institutionalizing red CI. |
| Medium | Public smoke automation is useful but incomplete as release evidence. | The script and workflow are unauthenticated, optional detail checks can skip, and the deployment runbook still requires credential/admin/log evidence. | Keep the public-smoke workflow scoped, and add release handoff evidence for approved detail records, credentials, admin access, and Vercel logs. |
| Medium | Default local runtime can invalidate verification evidence. | Default shell reported Node `21.2.0` / npm `10.2.3`; docs and package metadata require Node `22.14.0` / npm `10.9.2`. | Add a lightweight preflight habit or script before handoff commands, or state the active runtime in every verification handoff. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A027-C1 | High | Candidate | Full `npm test` currently fails in the dirty worktree, so Jest is not a reliable release gate. | Testing and quality; route to the owners of the failing auth, observability, image sizing, semantic style, admin read/form, and bcrypt test slices. |
| A027-C2 | High | Candidate | `npm run build` passes only with external MongoDB/network access and fails in the default sandbox during static generation. | Deployment/security/observability plus architecture refactor/data-fetching. |
| A027-C3 | Medium | Candidate | Explicit `npx tsc --noEmit --pretty false --skipLibCheck` fails on test-file type errors and is not represented by a package script or CI gate. | Testing and quality; consider a typecheck task after fixing current errors. |
| A027-C4 | Medium | Candidate | Repository CI currently contains only public smoke, not install/env/Jest/lint/build/typecheck. | Testing and quality plus deployment/security/observability. |
| A027-C5 | Medium | Candidate | Local default Node/npm are below the documented runtime baseline, so command evidence must state the activated runtime. | Testing and quality runbook or orchestration handoff discipline. |

## Risks Updated

- Candidate update for R-005/R-013: full Jest and explicit TypeScript are red in
  the current worktree, so the quality baseline is not release-ready.
- Candidate update for R-024: build verification remains coupled to live MongoDB
  DNS/network access; sandbox build failed while external-access build passed.
- Candidate update for R-028/R-019: public smoke CI does not replace
  credentialed/admin smoke or targeted Vercel log evidence.

## Workstream Updates

- Candidate testing workstream update: current pinned-runtime baseline is
  `env:guard` pass, `npm ci --dry-run --ignore-scripts` pass, `npm run lint`
  pass, `npm run build` pass only with external access, `npm test` fail, and
  explicit `npx tsc --noEmit --pretty false --skipLibCheck` fail.
- Candidate deployment workstream update: pre-deployment evidence should record
  whether build used external network access, and release smoke remains
  incomplete without credential/admin/log checks.
- Candidate orchestration note: do not promote the current dirty worktree as
  release-ready until the red Jest and TypeScript gates are resolved or
  explicitly waived by the owner.

## Next Action

1. Restore the full `npm test` gate under Node `22.14.0`, using the A-027 failure
   list to split assertion drift from timeout/performance cleanup.
2. After Jest is green, decide whether to add a `typecheck` package script and a
   main GitHub Actions verification workflow for `npm ci`, `npm run env:guard`,
   `npm test`, `npm run lint`, and `npm run build`.
