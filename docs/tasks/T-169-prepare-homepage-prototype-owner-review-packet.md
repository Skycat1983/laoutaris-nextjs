# T-169 Prepare Homepage Prototype Owner Review Packet

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md)

## Goal

Create a concise, owner-facing review packet for `/prototype/home` so the
homepage direction can be reviewed without reading implementation notes or task
handoffs.

## Context

- T-157 through T-160 created the isolated prototype route and biography, blog,
  and shop sections.
- T-162 captured the first visual QA and owner-decision notes.
- T-166 and T-167 widened and rebalanced the prototype.
- T-168 says the expanded prototype is ready for owner review, but production
  migration and style-system work are still blocked on owner decisions.

## Scope

In scope:

- Create a plain-language owner review packet under `docs/prototypes/` or the
  nearest existing docs location.
- Include the review URL, what changed, what the owner should inspect, and the
  exact decisions needed.
- Explain each decision in simple terms with examples of what it means for the
  project moving forward.
- Cover at least width direction, biography order, canonical dates, blog
  strategy, shop/commerce wording, mobile density, and anchor/header behavior.
- Keep this docs-only and owner-facing.

Out of scope:

- Do not edit runtime code, prototype components, global CSS, live homepage, or
  route layouts.
- Do not resolve owner decisions on the owner's behalf.
- Do not migrate prototype sections into production.
- Do not start the semantic style-system pilot.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-170, T-171, T-172, and T-173 if agents avoid shared
tracker edits.

Owned files:

- new owner review packet under `docs/prototypes/` or another dedicated docs
  location
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- The packet lets a non-coder review `/prototype/home` without reading task
  docs.
- Decision questions are concrete and answerable.
- Each recommendation explains the practical project impact in simple terms.
- No runtime behavior changes.

## Verification

```bash
git diff --check
```

## Agent Prompt

You are working on T-169. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-162, T-166, T-167, T-168, and the frontend workstream. Create a concise
owner-facing review packet for `/prototype/home`. Use simple, non-technical
language and include recommendations, decision questions, and examples of what
each decision means for the project going forward. Do not edit runtime code,
shared trackers, prototype components, global CSS, or the live homepage. Run
`git diff --check` and update only this task handoff.

## Handoff Notes

- Prepared after T-168 marked the expanded prototype owner-review-ready.
- Completed 2026-05-20.
- Added the owner-facing review packet at
  `docs/prototypes/homepage-owner-review-packet.md`.
- The packet keeps the review non-technical and covers the local/preview review
  URL, what changed, what to inspect, a plain-language recommendation, concrete
  owner decisions, and examples of the project impact for each answer.
- Decisions covered: width direction, biography order, canonical dates, blog
  strategy, shop/commerce wording, shop product labels, mobile density, and
  anchor/header behavior.
- Runtime code, prototype components, global CSS, live homepage, shared
  trackers, workstream briefs, and index files were not edited.
- Candidate tracker updates for the orchestrator: mark T-169 complete and note
  that the expanded `/prototype/home` owner review packet is ready at
  `docs/prototypes/homepage-owner-review-packet.md`; production migration and
  style-system pilot remain blocked on owner responses.
- Verification passed: `git diff --check`.
