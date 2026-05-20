# T-162 Review Homepage Prototype Visual QA

Status: Planned

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Review `/prototype/home` against the owner-provided design-guide images and
produce a concise refinement/owner-feedback handoff before any production
homepage migration.

## Context

- T-157 created the isolated full-width `/prototype/home` route.
- T-158, T-159, and T-160 added image-guided biography, blog, and shop teaser
  sections backed by real data.
- T-161 audited the style-system point of truth and recommends a semantic
  style-map pilot only after the prototype visual direction settles.
- The guide images live in `to_prototype/biography.png`,
  `to_prototype/blog.png`, and `to_prototype/shop.png`.

## Scope

In scope:

- Run the prototype route locally and inspect `/prototype/home`.
- Compare the biography, blog, and shop prototype sections against their guide
  images at desktop and a narrow/mobile viewport.
- Check for obvious text overlap, broken image states, unreadable type,
  awkward cropping, horizontal overflow, and misleading shop/commerce copy.
- Verify that the live homepage remains unchanged.
- Produce a concise section-by-section handoff with accepted areas, refinements,
  and owner decisions needed.

Out of scope:

- Do not redesign or edit prototype section code in this task.
- Do not migrate prototype sections into the live homepage.
- Do not create the semantic style map yet.
- Do not run broad traces, videos, full DOM dumps, or large screenshot sets.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-156 because it is read-only and limited to prototype
QA. Do not run in parallel with another task actively editing
`src/components/prototypes/home/*` unless the QA agent is told to review a
specific commit after edits land.

Owned files:

- this task brief handoff section
- optional concise QA note under `docs/assessments/` if screenshots or findings
  need a durable location

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `to_prototype/biography.png`
- `to_prototype/blog.png`
- `to_prototype/shop.png`
- `src/app/prototype/home/page.tsx`
- `src/components/prototypes/home/*`

## Acceptance Criteria

- The handoff identifies whether each prototype section is ready for owner
  review, needs visual refinement, or needs content/data correction.
- The handoff records any owner-facing decisions in simple terms.
- Browser/screenshot evidence is tightly scoped and not noisy.
- No runtime code changes are made.

## Verification

```bash
npm run lint
git diff --check
```

If browser automation is used, keep it to targeted `/prototype/home` desktop
and mobile screenshots or viewport checks only.

## Agent Prompt

You are working on T-162. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Review `/prototype/home` against
`to_prototype/biography.png`, `to_prototype/blog.png`, and
`to_prototype/shop.png`. This is a QA/owner-feedback task only: do not edit the
prototype implementation, global CSS, live homepage, or shared trackers. Use
tightly scoped browser/screenshot checks if needed, avoiding traces, videos,
full DOM dumps, and large screenshot sets. Produce a concise section-by-section
handoff that says what is ready, what needs refinement, and what decisions the
owner needs to make before production migration. Run lint only if source files
were touched unexpectedly; otherwise run `git diff --check` and update only
this task handoff.

## Handoff Notes

- Prepared after T-157 through T-161 completion.
