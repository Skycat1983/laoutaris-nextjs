# T-166 Expand Homepage Prototype Width

Status: Completed

Workstream:
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Make `/prototype/home` demonstrate genuinely wider homepage sections so the
design can be reviewed as full-screen-width work, not only as content bounded
like the current live pages.

## Context

- T-157 created the isolated `/prototype/home` route.
- T-158 through T-160 added biography, blog, and shop teaser sections.
- T-162 completed a first visual QA pass, but owner review now says the
  prototype still feels too horizontally bounded.
- The prototype route itself is full width, but the prototype section interiors
  currently use centered `max-w-[1440px]`/`max-w-[1536px]` containers with
  side padding. That may be useful eventually, but the next review needs to see
  the sections take more of the screen width, at least up to a larger sensible
  cap.

## Scope

In scope:

- Adjust only the isolated homepage prototype layout on `/prototype/home`.
- Create or apply a route-local prototype section width pattern so backgrounds
  remain full-bleed and section content can expand wider than the current live
  page feel.
- Increase the usable section width cap for the prototype sections while still
  preserving readable text measure and controlled padding.
- Keep mobile behavior stable and avoid horizontal scroll.
- Apply the width treatment consistently to prototype placeholders and the
  biography, blog, and shop prototype sections.
- Add or update focused prototype/source tests if existing tests assert the old
  bounded layout classes.

Out of scope:

- Do not edit the live homepage.
- Do not edit global CSS, root layout, header, footer, live page wrappers, or
  public route layouts.
- Do not redesign the biography, blog, or shop section composition beyond what
  is necessary to expose the wider canvas.
- Do not implement the semantic style-system pilot yet.
- Do not resolve biography order, canonical dates, blog strategy, shop wording,
  mobile density, or production migration decisions.
- Do not edit shared trackers while running in parallel.

## Concurrency

Can run in parallel with [T-165](T-165-persist-admin-delete-audit-events.md)
because T-165 owns admin delete routes/models/tests and this task owns only
prototype homepage layout files.

Do not run in parallel with another task editing
`src/components/prototypes/home/*` or `src/app/prototype/home/page.tsx`.

Owned files:

- `src/app/prototype/home/page.tsx` only if route wrapper adjustment is needed
- `src/components/prototypes/home/*`
- focused prototype tests, if updated or added
- this task brief handoff section

Do not edit shared trackers in parallel:
`docs/orchestration/state.md`, `docs/audits/findings-register.md`,
`docs/risks/production-readiness.md`, `docs/workstreams/*`, and index files.
List candidate tracker updates in this task's handoff notes.

## Acceptance Criteria

- `/prototype/home` no longer presents the main prototype sections as the same
  narrow centered content band used by normal pages.
- At desktop widths, biography, blog, shop, and placeholder sections visibly
  use more horizontal space while still having a sensible maximum width.
- Section backgrounds remain full viewport width.
- Text remains readable, buttons remain reachable, images remain correctly
  framed, and there is no horizontal scroll at mobile or desktop widths.
- The live homepage and other public routes are unchanged.

## Verification

```bash
npm run lint
npm run build
git diff --check
```

Run focused prototype tests if existing tests cover these files. If browser
automation is used, keep it targeted to `/prototype/home` at one desktop width
and one mobile width and summarize observations in this task handoff.

## Agent Prompt

You are working on T-166. Read `AGENTS.md`, `docs/README.md`, this task brief,
T-157 through T-162, and the frontend/testing workstreams. Adjust only the
isolated `/prototype/home` route and prototype home components so the prototype
sections demonstrate a wider, more full-screen-width layout than the current
bounded centered containers. Keep full-bleed section backgrounds, preserve
readable text widths, avoid horizontal scroll, and leave the live homepage,
global CSS, root layout, header, footer, and shared trackers untouched. Do not
redesign section content or resolve owner decisions. Run lint, build, `git diff
--check`, and any focused prototype tests you touch, then update only this task
handoff.

## Handoff Notes

- Prepared after owner feedback that `/prototype/home` currently feels too
  bounded by side space and needs a wider review mode.
- Completed 2026-05-20.
- Added a route-local prototype width helper in
  `src/components/prototypes/home/prototypeHomeLayout.ts` with a shared
  `max-w-[1920px]` frame and controlled responsive side padding.
- Applied the wider frame consistently to the prototype placeholders,
  biography, blog, and shop sections while leaving full-bleed section
  backgrounds intact.
- Kept readable text measures on section headings/body copy and widened only
  the review canvas/card rhythm: biography gets a larger wide-screen featured
  column, blog gives more space to the lead image at large viewports, and shop
  exposes a wider product rail/card rhythm at `2xl`.
- Added focused page/source coverage in
  `__tests__/unit/pages/PrototypeHomePage.test.tsx` so the prototype sections
  use the route-local wider frame and no longer carry the previous
  `max-w-[1440px]`/`max-w-[1536px]` section caps.
- Browser automation was not added because Playwright is not installed in this
  repo; verification stayed targeted to source coverage, build checks, and a
  local route smoke.
- Local dev server started at `http://localhost:3000`; targeted smoke
  `curl -I http://localhost:3000/prototype/home` returned `HTTP/1.1 200 OK`.
- Verification passed:
  `npm test -- --runTestsByPath __tests__/unit/pages/PrototypeHomePage.test.tsx`
  (with the existing Node `punycode` deprecation warning), `npm run lint`,
  `npm run build` (with the existing Browserslist currency warning), and
  `git diff --check`.
- Candidate tracker updates for the orchestrator: mark T-166 complete in the
  frontend/testing workstreams and note that `/prototype/home` now uses a
  route-local `1920px` prototype frame for section review.
