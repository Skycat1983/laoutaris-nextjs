# T-255 Scope Post-Modal Provider Efficiency Wave

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Decide the next A-022 efficiency assignment after T-254's modal-provider
cleanup and lazy-host runtime proof.

## Context

- T-232 through T-251 completed the accepted low-risk public cache and freshness
  proofs for biography, collections, sitemap, blog list/detail slices, sorted
  blog pages, and fixed unfiltered `/artwork` browse pages 1-5.
- T-252 paused further F-111 runtime cache expansion because the remaining
  cache candidates carry higher personalization, query-cardinality, Shopify, or
  mutation-revalidation risk.
- T-253 scoped the next F-115 provider/client-island slice.
- T-254 removed unused language state from the active root modal provider path
  and lazy-loaded the modal dialog presentation after modal intent while keeping
  `ClientContextBoundary`, `SessionProvider`, and modal ownership rooted.
- T-254 build evidence showed the root layout client chunk moved from the
  T-236 `27,772` byte baseline to `27,498` bytes uncompressed. The modal dialog
  code split successfully, but the root chunk stayed above the aspirational
  `26,000` byte target because the remaining cost appears to sit in existing
  root/header client code outside the modal dialog path.

## Scope

In scope:

- Review post-T-254 source, test, and build evidence for the remaining
  A-022/F-115 cost.
- Compare candidate next tracks:
  - another root/header client-island runtime slice;
  - a docs-only policy task for `SessionProvider` or route-local provider
    ownership;
  - lazy-loading specific interaction-heavy public/header/account islands;
  - returning to F-111 with a policy task for high-risk detail/search/shop
    cache surfaces;
  - pausing the Next.js efficiency track and switching to another priority.
- Evaluate each candidate by expected user impact, bundle or cache value,
  auth/session risk, modal/saved-item/account/comment/form blast radius,
  Shopify or mutation freshness risk, testability, and concurrency risk.
- Create exactly one follow-up task brief if a bounded next assignment is clear.
- Update this task brief with the decision, rejected candidates, and next
  assignment pointer.

Out of scope:

- Do not edit runtime source, tests, route segment config, providers, modal
  consumers, auth/session behavior, saved-item actions, account/admin/comment
  UI, contact/enquiry forms, shop behavior, cache wrappers, package files,
  Playwright setup, or CI workflows.
- Do not move `ClientContextBoundary`, `SessionProvider`, or modal provider
  ownership in this task.
- Do not add `unstable_cache`, route-level ISR, `generateStaticParams()`, cache
  tags, `revalidatePath()`, or `revalidateTag()`.
- Do not broaden browser automation or collect high-volume build artifacts
  unless a specific decision requires it.

## Concurrency

Run after T-254. Do not run in parallel with root layout/provider/header/modal
edits, auth/session refactors, saved-item action edits, account/admin/comment
UI edits, contact/enquiry form edits, cache-policy runtime work, package edits,
or CI edits.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task is created
- optionally one new follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if the selected next action
  changes

Do not edit runtime source in this task.

## Acceptance Criteria

- The scoping pass records the post-T-254 root/header/provider state with
  concrete source and build evidence.
- The comparison explicitly addresses remaining root layout client cost,
  `SessionProvider` ownership, header/client islands, modal behavior,
  saved-item/account/admin/comment/form blast radius, and whether F-111 cache
  policy work should resume.
- The decision identifies one recommended next assignment or explicitly pauses
  the Next.js efficiency track.
- Any selected follow-up defines owned files, included behavior, excluded
  behavior, expected bundle/cache target, fallback behavior, and required tests.
- No runtime behavior changes are made.

## Verification

```bash
git diff --check
```

Use targeted source reads, focused `rg` searches, the T-254 build evidence, and
current architecture/workstream docs. Run `npm run build` only if fresh chunk
evidence is necessary to make the decision.

## Handoff Notes

- Finding: F-115.
- Related finding: F-111.
- Risk: R-012.
- Depends on: T-254.
- This task is intentionally docs-only because T-254 proved the modal split and
  showed the remaining cost is outside that isolated modal-dialog path.
- Completed 2026-05-24 as a docs-only scoping task.
- Created
  [T-256 Lazy-load public account navigation island](T-256-lazy-load-public-account-navigation-island.md)
  as the selected follow-up runtime task.
- No runtime source, tests, route segment config, provider ownership, auth
  behavior, saved-item actions, account/admin/comment/form behavior, shop
  behavior, cache policy, package files, Playwright setup, or CI workflows were
  changed.
- Verification passed: `git diff --check`.

## Source And Build Review

Post-T-254 provider and modal state from source:

- `src/app/layout.tsx` still wraps the root `Modal`, `Header`, route content,
  and `Footer` in `ClientContextBoundary`.
- `src/contexts/ClientContextBoundary.tsx` still mounts
  `SessionProvider` from `next-auth/react` and `GlobalFeaturesProvider` at the
  root client boundary. Session ownership and modal provider ownership remain
  global.
- `src/contexts/GlobalFeaturesContext.tsx` is now modal-only. It exposes the
  existing `useGlobalFeatures()` compatibility hook with `isOpen`,
  `openModal`, `closeModal`, `modalContent`, and `setModalContent`; it no
  longer imports `useLanguage`.
- `src/components/compositions/TranslatedContent.tsx` owns its own deferred
  `useLanguage()` state and is no longer connected to the active root modal
  provider path.
- `src/components/modules/modal/Modal.tsx` is now a small intent-gated host
  using `React.lazy` and `Suspense`; `ModalDialog.tsx` owns the
  `@headlessui/react` dialog, panel, and transition imports.
- `__tests__/unit/modalProviderLazyHost.test.tsx` covers the modal-only
  provider shape, preserved `openModal`/`closeModal`/`setModalContent`
  behavior, language-state decoupling, Headless UI dialog source isolation, and
  rooted `SessionProvider`/modal provider ownership.

Post-T-254 root/header client cost evidence:

- The existing T-254 build artifact is
  `.next/static/chunks/app/layout-b0c26cf58907374a.js` at `27,498` bytes
  uncompressed, versus the T-236 `27,772` byte baseline.
- The modal dialog presentation split to
  `.next/static/chunks/1053.84709eefe2c01bc9.js` at `738` bytes. Targeted
  search confirmed the modal dialog strings and Headless UI dialog imports are
  in that lazy chunk rather than the root layout chunk.
- The root chunk still remains above the aspirational `26,000` byte target
  because the remaining cost is in existing root/header client code, not in the
  modal dialog path.

Current remaining root/header source ownership:

- `Header` is still a server component, but `MainNav` renders client layout
  islands for mobile, tablet, and desktop navigation.
- `MobileNavLayout` imports the already split `SearchDrawer` and
  `MobileNavDrawer`. Their body implementations remain lazy-loaded after first
  open intent, preserving the T-236 split.
- `DesktopNavLayout` and `TabletNavLayout` both import `AccountNav`.
  `AccountNav` is a root-header client component that imports shadcn menubar
  primitives, `lucide-react` icons, `useSession`, `signIn`, `signOut`, the
  global modal hook, and `AccountNavDropdown`.
- `AccountNavDropdown` imports shadcn navigation-menu primitives, NextAuth
  session/sign-out APIs, modal behavior, route hooks, and account/sign-in
  icons. It is visible as an account trigger in the public header, but its
  dropdown content is only needed after account-menu interaction.
- `useSession()` consumers remain intentionally broad in account navigation,
  mobile drawer body, sign-in form, and comment card paths. Moving or narrowing
  `SessionProvider` would still affect header account state, auth flows,
  comments, and protected account behavior.

No fresh `npm run build` was needed for this scoping pass. T-254 already
recorded fresh build output after the modal split, and T-255 made no runtime
changes.

## Candidate Comparison

| Candidate | Expected user impact | Bundle or cache value | Auth/session, modal, saved-item, account/admin/comment/form risk | Testability and concurrency risk | Decision |
| --- | --- | --- | --- | --- | --- |
| Another root/header client-island slice for public account navigation | Medium. The account icon/dropdown appears in the persistent public header across route families, and source shows it still pulls several interaction-heavy client dependencies into the header path. | Medium. It targets the remaining above-target root layout chunk after the modal split by deferring shadcn account menus, account dropdown content, and account-specific icons until account-menu intent. | Medium. It must keep `SessionProvider` rooted, preserve unauthenticated sign-in/sign-up links, authenticated profile/logout behavior, logout modal callbacks, and desktop/tablet header layout. It should not touch saved-item actions, comments, admin operations, auth forms, or modal provider placement. | Good if scoped to account nav files and focused navigation/auth tests. Concurrency risk is limited if no one edits root layout/provider/header/account navigation at the same time. | Select as the next runtime task. |
| Docs-only `SessionProvider` or route-local provider ownership policy | Medium long-term. A route-local session strategy could unlock larger public static/client reductions later. | Unknown until policy answers where session-aware header/account/comment UI belongs. | High for runtime, because session state spans header account navigation, mobile account links, sign-in/update flows, comments, and account pages. | Good as docs-only, but premature as the next task because the account nav island is a smaller measurable runtime slice that keeps provider ownership stable. | Defer. Revisit after the account nav split records whether header islands still dominate root cost. |
| Lazy-load other interaction-heavy public/header islands | Low to medium. Search and mobile nav drawer bodies are already lazy-loaded; the account menu is the clearest remaining persistent header interaction island. | Search/mobile drawer bodies already split into separate chunks; broadening to unrelated route-local islands would dilute the scope. | Varies by route. Public saved-item, comment, contact/enquiry, and admin islands have broader behavioral coupling than account-menu intent. | Less focused than account nav. | Reject for this wave. Keep the next runtime slice on account navigation only. |
| Return to F-111 with high-risk detail/search/shop cache policy work | Medium long-term, but no newly lower-risk runtime cache target appeared after T-254. | Could define future cache policy, but no immediate root/header bundle reduction. | High. Remaining F-111 surfaces involve saved-item personalization, arbitrary query terms, Shopify availability/price/hosted URL freshness, mutation-sensitive ordering, or route-level ISR/static-param decisions. | Good as docs-only, but it would pause the active F-115 evidence trail before the remaining header target is tested. | Defer. Keep remaining F-111 runtime work paused pending separate policy tasks or owner priority. |
| Pause the Next.js efficiency track | Lowest operational risk. | No bundle/cache progress. Leaves the known post-T-254 root/header cost untested. | Lowest immediate risk. | Easy, but it would stop before the clearest remaining bounded root/header slice. | Reject. One more provider-preserving header account split is justified. |

## Decision

Select
[T-256 Lazy-load public account navigation island](T-256-lazy-load-public-account-navigation-island.md)
as the next A-022/F-115 runtime assignment.

The selected follow-up deliberately keeps `ClientContextBoundary`,
`SessionProvider`, and modal provider ownership rooted. It should not move
providers, change auth/session semantics, change saved-item/comment/admin/form
behavior, or resume route-cache work. The purpose is narrower: preserve the
public header account affordance while deferring account dropdown/menu
implementation code until account-menu intent, then compare the root layout
chunk against the T-254 `27,498` byte baseline.

Expected target: reduce the root layout client chunk below `26,000` bytes
uncompressed, or record build evidence explaining why Next retains account
navigation code in the root/shared chunks. Shared first-load route totals may
remain effectively flat because `SessionProvider`, mobile drawer triggers,
search trigger, and route-local client islands remain rooted or route-owned.

## Rejected Or Deferred Work

- Moving `SessionProvider` is deferred because account navigation, mobile
  account links, sign-in/update flows, comments, and account pages all depend
  on the current global session context.
- Route-local modal/provider ownership remains deferred because T-254 proved
  the modal dialog split while preserving global modal behavior, and the
  remaining cost is now in header/account code.
- F-111 runtime cache expansion remains paused. Detail, search, shop, broader
  artwork browse, route-level ISR, generated params, cache tags, and mutation
  revalidation still need separate policy work before implementation.
- Additional route-local client-island splits are deferred until T-256 measures
  whether account navigation is still a meaningful root/header contributor.
