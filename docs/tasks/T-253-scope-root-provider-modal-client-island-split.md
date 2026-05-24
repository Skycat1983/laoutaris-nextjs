# T-253 Scope Root Provider Modal Client-Island Split

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Scope the next F-115 provider/client-island optimization after T-236 without
moving runtime providers yet.

## Context

- T-234 measured the original public provider/client-island cost and selected
  lazy mobile drawer loading as the first safe runtime proof.
- T-236 lazy-loaded the public mobile search and navigation drawer bodies,
  reducing the root layout client chunk from 35,174 to 27,772 bytes
  uncompressed while keeping shared first-load route totals effectively flat.
- T-252 paused F-111 runtime cache expansion because the remaining cache
  candidates now carry higher personalization, query-cardinality, Shopify, or
  mutation-revalidation risk than the completed fixed public list proofs.
- Root layout still wraps the global modal, header, route content, and footer in
  `ClientContextBoundary`, which mounts `SessionProvider` and
  `GlobalFeaturesProvider`.
- `GlobalFeaturesProvider` still combines modal state and language state.
  Modal consumers span public saved-item intent buttons, blog comments, auth and
  contact/enquiry/logout forms, account navigation, comment cards, and admin
  operation tabs.

## Scope

In scope:

- Inventory current post-T-236 provider/client-island ownership from source and,
  if needed, a fresh build.
- Compare root provider/modal split options, including:
  - split unused language state from modal ownership
  - keep `SessionProvider` global while moving or narrowing modal ownership
  - route-local modal hosts for public-only surfaces
  - defer provider moves and instead lazy-load specific modal-heavy consumers
- Identify exactly one recommended later runtime task, or explicitly recommend
  no provider runtime move yet.
- Define the selected runtime task's provider shape, route/component family,
  included client islands, excluded behavior, expected bundle target, fallback
  behavior, and focused tests.
- Update this task brief with the decision, rejected candidates, and next
  assignment pointer.

Out of scope:

- Do not move `ClientContextBoundary`, `SessionProvider`,
  `GlobalFeaturesProvider`, `Modal`, or modal consumers in this task.
- Do not change auth/session semantics, saved-item actions, account routes,
  admin dashboard behavior, comment behavior, contact/enquiry forms, shop
  behavior, cache policy, route segment config, or package files.
- Do not add a new state-management library.
- Do not rerun broad browser automation unless a specific provider behavior
  question cannot be answered from source and focused tests.

## Concurrency

Run after T-252. Do not run in parallel with root layout/provider/modal edits,
auth/session component refactors, saved-item action edits, account/admin
navigation edits, comment UI edits, contact/enquiry form edits, or cache-policy
runtime work.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally one new follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if the selected next action
  changes

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass describes current provider/client-island ownership with
  concrete source evidence and, if useful, current build evidence.
- The comparison explicitly addresses modal blast radius, session/auth behavior,
  saved-item intent behavior, account/admin/comment/form consumers, unused
  language state, and public route bundle impact.
- The decision identifies one recommended next assignment or explicitly pauses
  F-115 runtime work.
- Any selected runtime plan defines provider shape, route/component family,
  included client islands, excluded behavior, bundle target, fallback behavior,
  and required tests.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source/test reads and current build evidence from T-234/T-236.
Run `npm run build` only if fresh post-T-252 route-output or chunk evidence is
needed to make the provider decision.

## Handoff Notes

- Finding: F-115.
- Related finding: F-111.
- Risk: R-012.
- Depends on: T-252.
- This task is intentionally docs-only because root provider/modal ownership is
  cross-cutting across public, account, auth, comment, and admin behavior.
- Completed 2026-05-24 as a docs-only scoping task.
- Created
  [T-254 Split modal context language state and lazy host](T-254-split-modal-context-language-state-and-lazy-host.md)
  as the selected later runtime task.
- No runtime source, tests, route segment config, cache policy, provider moves,
  auth/session behavior, saved-item actions, account/admin/comment/form
  behavior, package files, or browser automation were changed.
- Verification passed: `git diff --check`.

## Source Review

Current post-T-236 ownership from source:

- `src/app/layout.tsx` imports `ClientContextBoundary` and wraps the global
  `Modal`, `Header`, route content, and `Footer` inside it.
- `src/contexts/ClientContextBoundary.tsx` is still a root client boundary that
  mounts `next-auth/react`'s `SessionProvider` and
  `GlobalFeaturesProvider`. No route-local provider split has happened.
- `src/contexts/GlobalFeaturesContext.tsx` still combines `useModal()` and
  `useLanguage()` into one context value. The active modal fields are
  `isOpen`, `openModal`, `closeModal`, `modalContent`, and
  `setModalContent`; the language fields are `language` and
  `changeLanguage`.
- `src/hooks/useLanguage.ts` keeps independent language state, but targeted
  source search found no active language consumer except
  `src/components/compositions/TranslatedContent.tsx`, which itself is not
  imported by active source. The language state is therefore still attached to
  every route through the root provider without an active UI path.
- `src/components/modules/modal/Modal.tsx` is a root-mounted client component
  that imports `@headlessui/react` `Dialog`, `DialogPanel`, and `Transition`
  and reads the global modal fields through `useGlobalFeatures()`.
- T-236 split the mobile search and navigation drawer bodies:
  `SearchDrawer.tsx` and `MobileNavDrawer.tsx` now keep small trigger state in
  the header path and dynamically import `SearchDrawerBody.tsx` and
  `MobileNavDrawerBody.tsx` after open intent.
- `useSession()` consumers remain global-header or interaction islands:
  `MobileNavDrawerBody`, `AccountNav`, `AccountNavDropdown`, `SignInForm`, and
  `CommentCard`. `AuthProviderSignInButtons` imports `signIn()` without
  `useSession()`, and `LogoutForm` imports `signOut()`.
- `useGlobalFeatures()` consumers remain broad: the global `Modal`, public
  saved-item intent buttons, `BlogDetail` comment notifications, account
  navigation, auth/contact/enquiry/logout forms, admin operation tabs,
  `CommentCard`, and the currently unused `TranslatedContent` language path.

Current build evidence from T-236 remains the relevant bundle baseline because
T-253 made no runtime edits and T-252 did not change provider ownership:

- Shared first-load JavaScript stayed effectively flat after the drawer split:
  `87.6 kB` versus T-234 `87.5 kB`.
- Stable static public shells such as `/biography`, `/collections`,
  `/project`, `/project/film`, and `/shop` stayed at `87.8 kB` versus T-234
  `87.7 kB`.
- Public browse/form routes stayed effectively flat: `/artwork` `177 kB`,
  `/blog` `183 kB`, `/shop/products` `142 kB`, and `/project/contact`
  `149 kB`.
- The root layout client chunk dropped from T-234 `35,174` bytes to T-236
  `27,772` bytes uncompressed, with separate lazy chunks emitted for the
  drawer bodies.

No fresh `npm run build` was needed for this scoping pass. The decision depends
on source ownership and the existing post-T-236 build evidence, not on a new
runtime change.

## Candidate Comparison

| Candidate | Bundle opportunity | Modal/session blast radius | Saved-item, account, admin, comment, and form risk | Decision |
| --- | --- | --- | --- | --- |
| Split unused language state from modal ownership | Low by itself, but it removes dead root-provider state and makes the modal provider easier to reason about before a larger move. | Low if `useGlobalFeatures()` keeps a modal-compatible API or consumers are migrated mechanically to a modal-only hook. | Low. Active modal consumers do not use language; `TranslatedContent` is the only source consumer and is currently unreferenced. | Include in the next runtime task as the first step. |
| Keep `SessionProvider` global while narrowing modal ownership | Medium. It avoids changing auth while allowing the modal dialog implementation to leave the initial root chunk. | Medium. The modal API is used across public, account, admin, comment, and form paths, so provider placement should not move yet. | Medium but bounded if context stays global and only the dialog presentation is lazy-loaded after `openModal()` intent. | Select this shape, but do not move the modal provider route-local yet. |
| Move modal provider/host to route-local public surfaces | Potentially medium-high on public shells. | High. A route-local host would need coverage for every current modal consumer and could silently break cross-route account/admin/comment/form notifications. | High. Saved-item unauthenticated prompts, blog comment toasts, auth form switching, contact/enquiry results, logout redirect callbacks, and admin delete/upload errors all depend on the same global modal path. | Reject for now. Revisit only after a modal-only provider and lazy host are proven. |
| Move or narrow `SessionProvider` | Potentially medium, especially for static public shells. | High. Header account state, mobile account links, auth forms, and comment ownership rely on NextAuth client state. | High. Account navigation, comments, auth flows, and sign-out behavior would need route-level session decisions. | Reject for this wave. Keep `SessionProvider` global. |
| Defer provider changes and lazy-load modal-heavy consumers instead | Medium on specific routes if auth forms or admin operation tabs are split. | Medium-low per route, but it does not remove the global modal host or unused language state from the root path. | Varies by route. Public saved-item and comment forms are visible interaction paths; admin tabs are protected and lower public bundle value. | Defer. Use after the root modal host split if route chunks still justify it. |
| Pause F-115 runtime work entirely | No immediate change. | Lowest risk. | Lowest risk. | Reject. T-236 proved a measurable root chunk reduction, and a provider-preserving modal-host split is bounded enough to attempt next. |

## Decision

Select
[T-254 Split modal context language state and lazy host](T-254-split-modal-context-language-state-and-lazy-host.md)
as the next F-115 runtime assignment.

The selected plan deliberately keeps `SessionProvider` global and keeps modal
context available globally. It should not move `ClientContextBoundary`, move
the modal provider route-local, or change modal consumer behavior. The runtime
slice should instead:

- split the currently unused language state out of
  `GlobalFeaturesProvider`/modal ownership;
- keep a modal-only provider at the existing root boundary;
- preserve a compatibility path for existing modal consumers or migrate them
  mechanically to a modal-only hook in the same task;
- replace the root-mounted eager modal dialog implementation with a small
  modal host that dynamically imports the `@headlessui/react` dialog
  presentation only after modal intent;
- keep the first-use fallback neutral, with no hidden auth/session or saved-item
  side effects while the dialog chunk loads.

Expected target: reduce the post-T-236 root layout client chunk below
`26,000` bytes uncompressed, or explain with build evidence why Next retained
the modal dialog code in the root/shared chunks. Shared first-load route totals
may stay effectively flat because `SessionProvider`, account navigation, and
route-local client islands remain global or route-owned.

## Selected Runtime Plan For T-254

Provider shape:

- Keep `ClientContextBoundary` as the root client boundary.
- Keep `SessionProvider` inside `ClientContextBoundary`.
- Replace the current combined `GlobalFeaturesProvider` shape with modal-only
  ownership at the same root level. The provider may keep the existing
  `useGlobalFeatures()` export temporarily if that avoids broad churn, but the
  value should no longer include language state.
- Do not introduce a new state-management library.

Route/component family:

- Root modal provider and root modal host only.
- Existing modal consumers in public saved-item buttons, blog detail comments,
  account navigation, auth/contact/enquiry/logout forms, admin operation tabs,
  and `CommentCard` should continue to call the same modal behavior.

Included client islands:

- `src/contexts/GlobalFeaturesContext.tsx` or a modal-only replacement under
  `src/contexts/`.
- `src/hooks/useModal.ts`.
- `src/components/modules/modal/Modal.tsx`, likely split into a small host and
  a lazily imported dialog body/presentation component.
- Focused tests that already mock `useGlobalFeatures()` may need mechanical
  updates if the hook name changes.

Excluded behavior:

- Do not move `SessionProvider`.
- Do not move modal provider ownership below the root.
- Do not change saved-item server actions, sign-in/sign-up flows, sign-out
  redirect behavior, account/admin route behavior, blog comment mutation
  behavior, contact/enquiry form payloads, shop behavior, cache policy, route
  segment config, package files, or Playwright setup.
- Do not delete broad unused files except the language state import/use from
  the active root provider path. Broader A-014 pruning remains separate.

Fallback behavior:

- Before any modal is opened, no eager modal dialog body should be required in
  the root layout chunk.
- On first `openModal()` call, the host may render no modal content until the
  lazy dialog body loads, then show the existing modal content. Existing
  callbacks passed to `openModal(content, onClose)` must still run on close,
  and auth form switching through `setModalContent(...)` must keep working.
- If the dynamic import shape does not reduce the root chunk, keep behavior and
  record that evidence rather than broadening the task.

Required tests and checks:

```bash
npm test -- --runTestsByPath __tests__/unit/publicSearchNavigationAccessibility.test.tsx __tests__/unit/navigationRelativeUrls.test.tsx __tests__/unit/forms/SignInForm.test.tsx __tests__/unit/forms/ContactEnquiryNotice.test.tsx __tests__/unit/forms/contactFormProductContext.test.tsx __tests__/unit/commentActionAccessibility.test.tsx __tests__/unit/accountUserClientErrorStates.test.tsx __tests__/unit/publicBrowsingClientErrorStates.test.tsx __tests__/unit/adminArchiveEntryPoints.test.tsx __tests__/unit/security/clientServerImportBoundary.test.ts
npm run build
git diff --check
```

Build/source checks should compare the post-T-254 root layout chunk against the
T-236 `27,772` byte baseline and confirm that unused language state no longer
rides through the active root provider path.

## Rejected Or Deferred Work

- Route-local modal providers are deferred because the current consumer set is
  too broad for the next runtime slice.
- `SessionProvider` movement is deferred because account navigation, auth
  forms, mobile account links, and comment ownership still depend on global
  client session state.
- Public-only modal hosts are deferred because saved-item prompts, comment
  notifications, forms, account navigation, and admin operation tabs all share
  the same modal API.
- Lazy-loading individual auth forms, contact/enquiry forms, admin operation
  tabs, or comment-card modal code is deferred until the global modal host
  split proves or fails to prove a measurable reduction.
- F-111 cache expansion remains paused under T-252's decision; this provider
  slice must not reopen route-cache, ISR, static params, cache tag, Shopify
  freshness, or mutation-revalidation work.
