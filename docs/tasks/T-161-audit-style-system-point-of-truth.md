# T-161 Audit Style System Point Of Truth

Status: Planned

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Audit the current styling system and propose a careful central style point of
truth for typography, spacing, buttons, and repeated layout patterns without
changing runtime styles.

## Context

- The owner wants a future way to adjust common heading/body/font/button styles
  centrally.
- Current styling is split across Tailwind config, `src/app/globals.css`,
  shadcn CSS variables, layout components, typography helpers, and many
  component-level utility classes.
- A central style system could be valuable, but a rushed migration could break
  public pages and admin workflows.

## Scope

In scope:

- Read-only audit of current font families, heading/body text sizes, buttons,
  spacing patterns, section layouts, card styles, and repeated Tailwind class
  clusters.
- Identify existing central points: `tailwind.config.ts`,
  `src/app/globals.css`, `src/lib/styles/fonts.ts`, typography components,
  layout components, and shadcn variables.
- Propose a staged migration plan with low-risk pilot candidates.
- Recommend naming conventions for future style tokens/classes/components, such
  as page title, section heading, body text, caption, CTA button, and card
  title.
- Document risks, likely file ownership, and verification needed before any
  implementation.

Out of scope:

- Do not change runtime CSS, component classes, Tailwind config, or global
  styles.
- Do not redesign prototype sections.
- Do not implement new tokens or shared typography components yet.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with T-157, T-158, T-159, and T-160 because it is read-only.
The agent must not edit prototype implementation files except for this task
brief handoff.

Owned files:

- this task brief handoff section
- a new audit/result doc under `docs/audits/results/` or
  `docs/architecture/` if useful

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Files Likely Read

- `tailwind.config.ts`
- `src/app/globals.css`
- `src/lib/styles/fonts.ts`
- `src/components/elements/typography/*`
- `src/components/layouts/**/*`
- `src/components/sections/**/*`
- `src/components/modules/cards/**/*`
- representative public page/view components

## Files Likely Touched

- `docs/tasks/T-161-audit-style-system-point-of-truth.md`
- optional `docs/architecture/style-system-audit.md`

## Acceptance Criteria

- The audit identifies where style decisions currently live.
- The audit names repeated typography, spacing, button, card, and section
  patterns that are candidates for centralization.
- The audit recommends a staged migration path and one safe pilot area.
- No runtime code or CSS behavior changes.

## Verification

```bash
git diff --check
```

Use targeted `rg`/source searches as audit evidence. Do not run browser
automation unless explicitly needed.

## Agent Prompt

You are working on T-161. Read `AGENTS.md`, `docs/README.md`, this task brief,
and the linked workstreams. Perform a read-only style-system audit. Map where
fonts, heading sizes, body text, buttons, spacing, layouts, cards, Tailwind
tokens, shadcn variables, and repeated class patterns currently live. Do not
change runtime CSS, Tailwind config, component classes, or prototype sections.
Create or update only the audit/task docs needed for the handoff. Recommend a
staged central style point of truth in simple terms, including a safe pilot
area and verification plan. Run `git diff --check` and update only this task
brief handoff; leave shared tracker updates for the orchestrator.

## Handoff Notes

- Prepared after the owner asked about a centrally planned CSS/style point of
  truth. This task is intentionally audit-only.
