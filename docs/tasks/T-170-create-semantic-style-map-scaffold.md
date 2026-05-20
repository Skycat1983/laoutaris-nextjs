# T-170 Create Semantic Style Map Scaffold

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Add the first client-safe semantic style map scaffold using exact existing
class strings, without changing runtime visuals.

## Context

- T-161 audited the style system and recommended a pure
  `src/lib/styles/semanticStyles.ts` style map before any broad CSS changes.
- The owner wants a central point of truth for typography and repeated styles,
  but this must be planned carefully and migrated in small steps.
- The expanded homepage prototype is owner-review-ready, but production
  migration is not approved yet.

## Scope

In scope:

- Add a pure, client-safe semantic style module, expected at
  `src/lib/styles/semanticStyles.ts`, unless inspection finds a better local
  path.
- Export literal Tailwind class strings for common roles such as page title,
  display title, section heading, body text, muted body, caption, eyebrow,
  primary/secondary/text actions, page frame, content rail, card surface, and
  media frame.
- Use exact existing class-string patterns from the audit; this task should
  create names, not alter visuals.
- Add focused source/invariant coverage proving the module is client-safe,
  exports literal class strings, and does not import server-only modules,
  models, data services, route handlers, or mixed barrels.
- Document that adoption into prototype or live components is a follow-up task.

Out of scope:

- Do not replace component classes yet.
- Do not edit global CSS, Tailwind config, fonts, shadcn primitives, live
  homepage, or prototype components.
- Do not create dynamic Tailwind class generation.
- Do not start a visual style migration.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-169, T-171, T-172, and T-173 because it owns a new
style module and focused tests only.

Owned files:

- `src/lib/styles/semanticStyles.ts`
- focused source/invariant test, expected at
  `__tests__/unit/styles/semanticStyles.test.ts`
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- A client-safe semantic style map exists with literal class strings.
- No runtime component imports are changed.
- No visual behavior changes are introduced.
- Focused tests or source checks cover the module's safety constraints.

## Verification

```bash
npm test -- --runTestsByPath __tests__/unit/styles/semanticStyles.test.ts
npm run lint
git diff --check
```

## Agent Prompt

You are working on T-170. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-161, `docs/architecture/style-system-audit.md`, and the frontend,
architecture, and testing workstreams. Add a pure client-safe semantic style
map scaffold using exact existing Tailwind class-string patterns. Do not adopt
it in components yet and do not edit global CSS, Tailwind config, shadcn,
prototype components, the live homepage, or shared trackers. Add focused
source/invariant coverage, run the focused test, lint, and `git diff --check`,
then update only this task handoff.

## Handoff Notes

- Prepared after the style-system audit and expanded prototype QA.
- 2026-05-20: Added `src/lib/styles/semanticStyles.ts` as a pure
  import-free semantic class map with literal Tailwind strings for text,
  action, layout, and surface roles copied from existing source patterns.
- Added `__tests__/unit/styles/semanticStyles.test.ts` with focused source and
  invariant coverage for exported role shape, source-level string literals,
  client-safe/no-import constraints, copied existing class strings, and no
  runtime component adoption yet.
- No component imports, runtime JSX class names, global CSS, Tailwind config,
  shadcn primitives, prototype components, or live homepage files were changed.
- Adoption into `/prototype/home` or live components remains a follow-up task
  after owner approval and a scoped visual-parity migration plan.
- Candidate tracker updates for the orchestrator: mark T-170 complete in the
  frontend, architecture, and testing workstreams; keep broad style migration,
  global token changes, and runtime component adoption as separate follow-up
  tasks.
- Verification: `npm test -- --runTestsByPath
  __tests__/unit/styles/semanticStyles.test.ts` passed; `npm run lint` passed;
  `git diff --check` passed.
