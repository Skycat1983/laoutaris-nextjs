# T-234 Scope Public Client Provider Islands

Status: Scoped

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Measure and scope the first safe client-JavaScript reduction slice for public
routes after the higher-priority A-022 boundary, middleware, and cache work.

## Context

- A-022 found every route is wrapped in `ClientContextBoundary`, which mounts
  `SessionProvider` and `GlobalFeaturesProvider`.
- Public browse routes still have meaningful first-load JavaScript even though
  much of their initial content is server-rendered.
- Provider splitting can easily change modal, auth, saved-item, form, and
  account behavior, so the first step should be a focused scope and proof plan.

## Scope

In scope:

- Inventory public route client providers and heavy client islands using source
  searches and build output.
- Identify one low-risk first runtime slice, such as route-local modal provider
  placement, lazy-loading a drawer/modal, or keeping session-only UI out of a
  public static shell.
- Record required tests and smoke checks for that first slice.
- Update this brief with the recommended next implementation task if the scope
  is clear.

Out of scope:

- Do not change runtime provider placement in this task unless explicitly
  reassigned from planning to implementation.
- Do not change auth/session semantics, modals, saved-item actions, account
  routes, admin dashboard behavior, or cache policy.
- Do not add a new state management library.

## Concurrency

Run after T-230 through T-233 unless the orchestrator explicitly prioritizes
client JS over cache proof work. Do not run in parallel with homepage
production migration or provider/runtime refactors.

Owned files:

- this task brief
- optionally a focused planning note under `docs/architecture/` or
  `docs/audits/results/` if the inventory is too large for the handoff

Do not edit shared trackers in parallel unless explicitly assigned.

## Acceptance Criteria

- The current provider/client-island cost is described with concrete route and
  source evidence.
- One first implementation slice is scoped with owned files, expected behavior,
  and verification.
- No runtime behavior changes are made unless the task is explicitly expanded.

## Inventory

Source evidence:

- `src/app/layout.tsx` imports `ClientContextBoundary` and wraps the global
  modal, header, route content, and footer in it.
- `src/contexts/ClientContextBoundary.tsx` is a client component that mounts
  `next-auth/react`'s `SessionProvider` and `GlobalFeaturesProvider`.
- `src/contexts/GlobalFeaturesContext.tsx` combines modal state from
  `useModal()` with language state from `useLanguage()`. The language state has
  no active source consumer beyond the currently unreferenced
  `TranslatedContent` component.
- `useSession()` source consumers are concentrated in public/account header and
  auth/comment islands: `MobileNavDrawer`, `AccountNav`, `AccountNavDropdown`,
  `SignInForm`, and `CommentCard`.
- `useGlobalFeatures()` consumers are modal-oriented: `Modal`, `BlogDetail`,
  account/admin operations, auth/contact/enquiry/logout forms, saved-item
  buttons, and comment cards.
- No active source currently imports `next/dynamic`, so public drawers, modal
  host code, and auth/session UI are all statically attached to their current
  client entries.

Build evidence from `npm run build` on 2026-05-23:

- Shared first-load JavaScript is `87.5 kB`.
- Public static shells still carry a non-trivial baseline:
  `/biography`, `/collections`, `/project`, `/project/film`, and `/shop` each
  report `87.7 kB` first-load JavaScript.
- Public browse and form routes add larger route-local client islands:
  `/artwork` reports `177 kB`, `/blog` reports `183 kB`,
  `/shop/products` reports `142 kB`, and `/project/contact` reports `149 kB`.
- The compiled root layout client chunk is 35,174 bytes uncompressed at
  `.next/static/chunks/app/layout-*.js`. A targeted compiled-chunk check found
  `SessionProvider`, `modalContent`, `openModal`, `AccountNav`,
  `SearchDrawer`, and `MobileNavDrawer` in that layout chunk.
- The largest public route-local app chunks are the home page at 26,125 bytes,
  `/artwork` at 24,346 bytes, `/shop/products` at 14,688 bytes, `/blog` at
  13,293 bytes, and `/project/contact` at 9,579 bytes uncompressed.

Conclusion: moving the root providers directly is not the right first runtime
change. `SessionProvider` and the global modal context are cross-cutting enough
that a provider move could change auth, account dropdown, saved-item, form,
comment, and admin behavior at once. The safer first slice is to reduce one
public header island before changing provider ownership.

## Recommended First Implementation Slice

Recommended next task: `T-236 Lazy-load public mobile navigation drawers`.

Goal: defer the mobile-only `SearchDrawer` and `MobileNavDrawer` client drawer
implementations from the initial public header path while preserving the visible
mobile trigger controls, drawer content, search navigation, account-link
enabled/disabled behavior, and current root provider placement.

Owned source files for the slice:

- `src/components/modules/navigation/mainNav/MobileNavLayout.tsx`
- `src/components/modules/search/SearchDrawer.tsx`
- `src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx`
- optionally new colocated client island files under the same navigation/search
  module directories
- focused unit tests under `__tests__/unit/` for the existing public search and
  navigation accessibility/source-hygiene coverage

Expected behavior:

- Desktop and tablet navigation remain unchanged.
- Mobile search and navigation buttons remain labelled buttons in the header.
- Opening search still focuses the search input and routes to `/search?q=...`.
- Opening mobile navigation still renders the same public and account links,
  with account, sign-up, log-in, and logout availability based on the current
  session status.
- `ClientContextBoundary`, `SessionProvider`, `GlobalFeaturesProvider`,
  saved-item actions, account routes, admin routes, and cache policy are not
  moved in this first implementation slice.

Preferred implementation shape:

- Keep a tiny client trigger/controller in the mobile header.
- Load drawer bodies with `next/dynamic` only after the user expresses intent,
  or use dynamic client wrappers that keep the trigger accessible while the
  drawer implementation chunk loads.
- Do not use `ssr: false` in a way that makes the mobile header controls absent
  before hydration.
- Re-run the build and compare `/layout`, `/search`, `/artwork`, `/blog`, and
  `/shop/products` first-load output against this inventory.

Follow-up provider slice after the drawer proof:

- If the drawer slice proves a measurable reduction without UX regression,
  scope a separate provider task to split `GlobalFeaturesProvider` into
  modal-only and language-only ownership, remove unused language state from the
  root path, and then evaluate moving the modal host/provider out of static
  public shells route by route.

## Verification

```bash
npm run build
git diff --check
```

Use targeted source searches for `use client`, `ClientContextBoundary`,
`SessionProvider`, `GlobalFeaturesProvider`, `next/dynamic`, and public route
client components.

Verification performed:

- `npm run build` passed on 2026-05-23 and produced the route-size evidence
  listed above.
- Targeted source searches were run for `use client`, `ClientContextBoundary`,
  `SessionProvider`, `GlobalFeaturesProvider`, `next/dynamic`, `useSession`,
  and `useGlobalFeatures`.
- Targeted `.next` chunk checks were run against the freshly generated build
  output to confirm which root-layout client symbols are present.

## Handoff Notes

- Finding: F-115.
- Priority: after T-230 through T-233.
- No runtime files were changed for this planning task.
- Next action: create or assign `T-236 Lazy-load public mobile navigation
  drawers` as the first runtime proof before attempting root provider moves.
