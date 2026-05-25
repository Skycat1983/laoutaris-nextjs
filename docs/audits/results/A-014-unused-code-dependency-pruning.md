# A-014 Unused Code And Dependency Pruning Result

Status: Completed

Audit goal: [A-014 Unused code and dependency pruning](../goals.md#a-014-unused-code-and-dependency-pruning)

Workstream: [Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md)

## Summary

The audit found several high-confidence pruning candidates, but deletion should
be staged. The safest first pass is unused leaf UI files, duplicate overlay
components, unused WIP modules, unused barrel files, starter assets, and a small
set of unused direct dependencies. Higher-risk candidates need owner or
workstream confirmation first: the `/protected` route, the legacy auth/session
form chain, the mostly unused i18n translation pipeline, and root Shopify
historical notes that are not fully consolidated yet.

No runtime code, package files, risks, or findings-register files were changed.
All evidence below comes from non-mutating file reads and reference searches.

## Scope Inspected

- Required docs:
  - `docs/README.md`
  - `docs/workstreams/architecture-refactor-and-code-health.md`
  - `docs/runbooks/testing.md`
  - `docs/audits/goals.md#a-014-unused-code-and-dependency-pruning`
- Linked architecture/risk context:
  - `docs/architecture/system-overview.md`
  - `docs/architecture/rendering-and-data-fetching.md`
  - `docs/architecture/routes-and-api.md`
  - `docs/risks/production-readiness.md`
- Prior related audit context:
  - `docs/audits/results/A-013-architecture-refactor-scope.md`
  - `docs/audits/results/A-001-shopify-commerce.md`
  - `docs/audits/results/A-019-dependencies-supply-chain.md`
- Runtime and project surfaces:
  - `src/app/`
  - `src/components/`
  - `src/contexts/`
  - `src/hooks/`
  - `src/lib/`
  - `src/middleware.ts`
  - `__tests__/`
  - `public/`
  - `package.json`
  - root `SHOP*.md` historical notes

## Audit Method

- Built a file inventory with `rg --files`.
- Ran a lightweight import-reference scan over `src/**/*.ts(x)` to identify
  files with no importers. This was used only as a clue because comments can
  produce false references.
- Verified candidates with targeted `rg -n` searches for component names,
  import paths, route paths, dependency package names, and public assets.
- Read candidate files with `sed` and `nl -ba` to confirm whether they are real
  implementations, commented prototypes, route entrypoints, or documented WIP.

## Findings

### A014-1: High-Confidence Unused Leaf Components

These files have no live import path found by the import scan and targeted
reference searches. They should be safe candidates for a first pruning PR after
one final `npm run build`/`npm run lint` gate on the deletion branch.

| Candidate | Evidence | Recommendation |
| --- | --- | --- |
| `src/components/animations/ArtworkImage.tsx` | Import scan listed no importers. `rg -n "TransitionGroup\|PageLoading\|components/animations\|ArtworkImage" src __tests__ docs` found live uses for `TransitionGroup` and `PageLoading`, but only self/comment hits for `ArtworkImage`. The file exports only `unused` at lines 3-5 and the real image component is commented at lines 7-41. | Delete the file. Keep `TransitionGroup.tsx` and `PageLoading.tsx`. |
| `src/components/elements/overlays/DimmedOverlay.tsx` and `src/components/elements/overlays/RadialGradientOverlay.tsx` | Targeted search found no `elements/overlays` imports. Live hero code imports duplicate implementations from `src/components/modules/hero/Overlays.tsx`; see `rg -n "elements/overlays\|modules/hero/Overlays\|DimmedOverlay\|RadialGradientOverlay" src __tests__ docs`. | Delete the unused `elements/overlays` copies. Keep `modules/hero/Overlays.tsx`. |
| `src/components/elements/skeletons/FeedSkeleton.tsx`, `SectionHeadingSkeleton.tsx`, `SkeletonP.tsx` | Import scan listed no importers. `src/app/admin/dashboard/@feed/loading.tsx` uses `FeedSkeleton` from `src/components/compositions/Feed.tsx`, not `elements/skeletons/FeedSkeleton.tsx`. | Delete these unused skeleton leaf files after checking no design-system docs rely on them. |
| `src/components/modules/forms/user/LoginForm.tsx` | Import scan found no importers. The file itself asks whether it is unused at line 7. Current auth UI uses `SignInForm` from account navigation and `SignInFormBackup` through `SignUpForm`, not `LoginForm`. | Delete `LoginForm.tsx` as a standalone obsolete form. Do not delete `SignInFormBackup.tsx` in the same pass. |
| `src/components/layouts/admin/AdminContentLayout.tsx`, `src/components/layouts/admin/AdminPageContainer.tsx` | Import scan listed no importers. Targeted layout search found live admin routes use `AdminSidebar` and `AdminCrudTabs`, not these containers. | Delete or first move to an archive branch if the admin workstream wants to preserve layout experiments. |
| `src/components/layouts/public/ArtworkViewLayout.tsx`, `src/components/layouts/public/CollectionInfoLayout.tsx` | Import scan listed no importers. `ArtworkLoader` only has a commented `<CollectionInfoLayout />` reference. | Delete after confirming the collection route no longer needs these experiments. |
| `src/components/modules/error/ErrorBoundary.tsx` | Import scan listed no importers. App Router already has `src/app/error.tsx` as the route-level error boundary. | Delete unless a future client-only boundary is explicitly planned. |
| `src/components/modules/disclosures/FrameInfo.tsx` | Import scan listed no importers. No targeted references outside the file were found. | Delete or fold into a future artwork-info component only if needed. |
| `src/components/modules/sidebar/BlogSidebar.tsx` | Import scan listed no importers. Blog listing currently uses `BlogsViewLayout` and section components, not this sidebar. | Delete after confirming no planned blog sidebar task needs it. |
| `src/components/modules/tabs/AdminMobileTabs.tsx` | Import scan listed no importers. Admin dashboard uses `AdminCrudTabs` at `src/app/admin/dashboard/@main/[segment]/page.tsx`. | Delete or defer to admin UX workstream if mobile tab redesign is active. |

### A014-2: WIP And Variant Components To Prune Carefully

The `src/components/modules/wip/` directory is only partly unused. Do not delete
the directory wholesale: `src/components/modules/wip/CollectionInfo.tsx` is
still imported by `CollectionViewPagination`.

| Candidate | Evidence | Recommendation |
| --- | --- | --- |
| `src/components/modules/wip/ArtistProfile.tsx` | `rg -n "ArtistProfile\|components/modules/wip" src __tests__ docs` found live `ArtistProfile` usage from `src/components/modules/cards/ArtistProfile.tsx`, while the WIP file has no importers. | Delete the WIP copy only. |
| `src/components/modules/wip/ArtworkView.tsx` | No importers found. Live artwork route uses `src/components/views/ArtworkView.tsx` through loaders. | Delete after visual parity is not needed. |
| `src/components/modules/wip/CroppedImages.tsx` | No importers found. The file is a client prototype with a trailing commented image block. | Delete unless multi-image artwork browsing is actively planned. |
| `src/components/modules/wip/ZoomWrapper.tsx` | No importers found. It is not part of the current artwork view. | Delete unless future image carousel work explicitly adopts it. |
| `src/components/modules/artInfoTabs/ArtInfoTabs.tsx` | The file is marked `//! unused` at line 3. Targeted search found only a commented reference in `WatclistedArtworkLoader`. It also declares `"use server"` while rendering interactive tabs and `EnquiryForm`, so it is not a clean drop-in client component. | Candidate deletion, but escalate to frontend/forms owner first because it contains the only artwork-detail enquiry tab prototype. |
| `src/components/modules/cards/ArtworkMagazineCard.tsx` | No live importers. References in route/layout files are commented out. | Delete after confirming magazine-card variants are not part of the desired artwork layout direction. |
| `src/components/sections/BiographySectionVariations.tsx` | Targeted search found only a commented import in `BiographySectionLoader.tsx`; live home biography uses `BiographySection.tsx`. | Delete or move to design archive after confirming no biography layout variant is planned. |
| `src/components/modules/hero/HeroSlide.tsx`, `HeroSlides.tsx`, `PortraitCycleSlides.tsx`, `PortraitHeroSlides.tsx` | Import scan listed no importers. Live `Hero.tsx` uses discrete slide modules under `src/components/modules/hero/slides/` plus `PortraitsOfBeryl`. | Delete after confirming the current hero direction. Keep `PortraitsOfBeryl.tsx` and `slides/*` modules that are imported by `Hero.tsx`. |

### A014-3: Auth And Session Pruning Candidates Need Escalation

These are likely obsolete or duplicate, but auth/session reachability is
production-sensitive. Do not delete them until A-004 or an auth-focused task
confirms behavior.

| Candidate | Evidence | Recommendation |
| --- | --- | --- |
| `src/contexts/SessionProvider.tsx` | No importers found. Root layout imports `ClientContextBoundary` at `src/app/layout.tsx`, and `ClientContextBoundary` wraps `next-auth/react` `SessionProvider`. `SessionProvider.tsx` duplicates that provider and even default-exports the imported provider rather than `SessionContextProvider`. | Delete after a build confirms no external import path depends on it. Low runtime risk, but keep in auth batch. |
| `src/lib/session/githubSession.ts` | Marked `// TODO: delete?` at line 3. Targeted search found no external references. `getSessionController` does not return or use the session value. | Delete in auth cleanup batch. |
| `src/lib/session/getAuthUser.ts` | Marked `// ! unused?` at line 31. Targeted search found no imports outside the file. It duplicates admin-user helper concepts also present in the live `src/lib/session/isAdmin.ts` and `getUserIdFromSession.ts` paths. | Delete only after confirming no test-header auth workflow is planned. |
| `src/lib/session/getRoleFromSession.ts` | Targeted search found no imports outside the file. Middleware currently calls `getToken` directly. | Delete or fold into middleware if A-004 chooses a shared role helper. |
| Legacy custom session chain around `SignInFormBackup.tsx`, `processLogin.ts`, and `src/lib/session/session.ts` | `SignInForm.tsx` uses `next-auth/react` `signIn`, but imports only `LoginProcessResponse` for initial state. `SignUpForm.tsx` imports `SignInForm` from `./SignInFormBackup` at line 6, keeping `processLogin` and custom `jose` JWT session code reachable through a sign-up modal path. | Do not prune casually. First choose one sign-in path, then remove the abandoned form/action/session path and re-test auth. If the custom `session.ts` path is removed, `jose` becomes a dependency-pruning candidate. |

### A014-4: `/protected` Route Looks Like A Stale Route

`src/app/protected/page.tsx` is a candidate route deletion, but route deletion is
high-risk enough to escalate before pruning.

Evidence:

- `src/lib/constants/routeConstants.ts` includes `PROTECTED: "/protected"` at
  line 5, so middleware protects the path.
- `docs/architecture/routes-and-api.md` does not list `/protected` among public,
  account, or admin pages.
- `rg -n "'/protected'|\"/protected\"|/protected" src docs README.md` found no
  navigation links or docs references beyond the route constant.
- The page imports `useGlobalFeatures` and `redirect` but does not use them, and
  returns an old Pages Router-style redirect object at lines 11-16 instead of
  calling App Router `redirect()`.

Recommendation: confirm whether `/protected` was only a test route. If yes,
delete `src/app/protected/page.tsx` and remove `PROTECTED` from
`PROTECTED_FRONTEND_ROUTES` in the same auth-reviewed change.

### A014-5: Translation Pipeline Is Mostly Unused

The current i18n data and `TranslatedContent` composition are pruning
candidates if the project is not shipping multilingual UI soon. This needs
product-owner confirmation because it is feature direction, not simple
dead-code deletion.

Evidence:

- `src/components/compositions/TranslatedContent.tsx` has no importers.
- `src/lib/translations/index.ts` imports and flattens category JSON files, but
  targeted search found the translation API used only by `TranslatedContent`.
- `src/lib/constants/translations/index.ts` is empty, and
  `src/lib/constants/translations/navigation.json` is also empty.
- `useLanguage` is used by `GlobalFeaturesContext`, but targeted search found no
  rendered text consuming `language` except the unused `TranslatedContent`.
  `AccountNav` has a separate local `selectedLanguage` state that is not wired
  to the global language context.

Recommendation: escalate a content/i18n decision. If multilingual UI is out of
scope for production launch, prune `TranslatedContent`, `src/lib/translations/`,
`src/lib/constants/translations*`, and simplify `GlobalFeaturesContext` by
removing `useLanguage`. If multilingual UI remains planned, keep the files and
create a real integration task instead.

### A014-6: Unused Barrels And Superseded Broad Import Patterns

Several `index.ts` barrels have no importers and can be deleted independently
after confirming there is no planned public module API. This also supports the
repo guidance to prefer direct imports where broad barrels can pull server-only
code into client bundles.

High-confidence unused barrels:

- `src/components/elements/typography/index.ts`
- `src/components/features/adminDashboard/crudForms/read/index.ts`
- `src/components/features/adminDashboard/feeds/index.ts`
- `src/components/features/adminDashboard/inputs/index.ts`
- `src/components/features/adminDashboard/operationTabs/index.ts`
- `src/components/loaders/componentLoaders/index.ts`
- `src/components/loaders/sectionLoaders/index.ts`
- `src/components/modules/cards/index.ts`
- `src/components/modules/forms/user/index.ts`
- `src/components/modules/hero/slides/index.ts`
- `src/lib/constants/translations/index.ts`

Evidence:

- The import-reference scan listed these files as having no importers.
- `rg -n "components/(elements/typography|features/adminDashboard/crudForms/read|features/adminDashboard/feeds|features/adminDashboard/inputs|features/adminDashboard/operationTabs|loaders/componentLoaders|loaders/sectionLoaders|modules/cards|modules/forms/user|modules/hero/slides)(/index)?['\"]" src __tests__ docs` returned no matches.
- Some barrels are ineffective for default-only modules, for example
  `src/components/modules/forms/user/index.ts` uses `export *` against files
  that mostly default-export components.

Recommendation: delete unused barrels in the pruning pass. Keep live barrels
such as `src/components/elements/buttons/index.ts` until direct-import
migration is planned.

### A014-7: Utility, Constant, And Import-Level Cleanup Candidates

These are not whole-file deletion candidates in every case, but they are
pruning candidates for a cleanup branch.

| Candidate | Evidence | Recommendation |
| --- | --- | --- |
| `filterWatchlerlist` export in `src/lib/helpers/transformData.ts` | Targeted search found `replaceMongoId` used by `submitSubscription`, but no `filterWatchlerlist` references outside its declaration. | Remove the unused export. Consider fixing the spelling only if a real caller appears. |
| Unused imports in `src/lib/actions/updateUserFavourites.ts` and `src/lib/actions/updateUserWatchlist.ts` | Targeted search shows both import `delay` and `revalidatePath` while the delay calls are commented. `updateUserWatchlist.ts` also imports `WatchlistButton` from the buttons barrel without a live reference. | Remove unused imports in a narrow lint cleanup. |
| `src/app/collections/[slug]/layout.tsx` commented layout imports | The route imports `HorizontalDivider` and `SubscribeSection`, but current rendered JSX only uses children and `CollectionArtworksPaginationLoader`; former uses are commented. | Remove unused imports with route cleanup. |
| `src/components/modules/forms/user/SignInForm.tsx` stale state/imports | `LoginProcessResponse`, `useFormState`, and `[state, formAction]` remain although the form action calls `signIn()` directly. The stray `` ` ` `;`` appears at line 17. | Reconcile current and backup sign-in forms before auth cleanup; do not change piecemeal without testing sign-in. |
| `src/components/modules/hero/PortraitCycleSlides.tsx` local `useImageCycle` | This unused component contains a local hook that duplicates the shared `src/hooks/useImageCycle.ts`. | Delete with the unused hero variant. Keep shared `useImageCycle.ts` because `PortraitsOfBeryl.tsx` imports it. |
| `useLanguage`/global language state | No rendered consumer except unused `TranslatedContent`; `AccountNav` maintains separate language state. | Treat as an i18n decision, not a simple hook deletion. |

No safe whole-file hook deletion was found among `src/hooks/*`:

- `useImageCycle.ts` is used by `PortraitsOfBeryl.tsx`.
- `useInfiniteScroll.ts` is used by `MasonryLayout` and `BlogSectionContinuous`.
- `useModal.ts` is used by `GlobalFeaturesContext`.
- `useLanguage.ts` is technically used by `GlobalFeaturesContext`, but its
  product-level value is uncertain as noted above.

### A014-8: Dependency Pruning Candidates

Direct package candidates from `package.json` should be removed only in a
package-focused cleanup that updates the lockfile and runs `npm test`,
`npm run build`, and `npm run lint`.

| Package | Evidence | Recommendation |
| --- | --- | --- |
| `@radix-ui/react-dialog` | Declared in `package.json` line 19. Package usage scan reported `imports:0 text:0`. Targeted search for `Dialog`, `AlertDialog`, and `@radix-ui/react-dialog` found only Headless UI dialog usage in `src/components/modules/modal/Modal.tsx`. There is no `src/components/shadcn/dialog.tsx`. | Remove dependency if no pending shadcn dialog component is planned. |
| `@shopify/shopify-api` | Declared in `package.json` line 31. Package usage scan reported `imports:0 text:0`. Current Shopify client uses raw `fetch` against Storefront GraphQL at `src/lib/api/shopify/shopifyClient.ts:27-40`. | Remove if A-001 Shopify work does not choose the official SDK. |
| `graphql-request` | Declared in `package.json` line 40. Package usage scan reported `imports:0 text:0`; targeted search found no `GraphQLClient` or `graphql-request` use. | Remove if raw fetch remains the chosen Storefront API client. |
| `graphql` | Declared in `package.json` line 39. Package usage scan found no package imports. It appears unnecessary if `graphql-request` and `@shopify/shopify-api` are not retained. | Remove together with unused GraphQL client packages, after lockfile/test verification. |
| `next-test-api-route-handler` | Declared in `package.json` line 48. Package usage scan reported `imports:0 text:0`; targeted search found no `testApiHandler` usage. Current tests are unit/view tests under `__tests__/`. | Remove unless route-handler tests are planned immediately. |
| `@types/uuid` | Declared in `package.json` line 69. Runtime `uuid` is imported once by `transformCloudinary.ts`; `node_modules/uuid` contains its own `.d.ts` files. | Remove the redundant DefinitelyTyped package after TypeScript/build verification. |

Packages checked and not currently pruning candidates:

- `@testing-library/jest-dom` has bare imports in `jest.setup.js` and
  `__tests__/integration/views/Home.test.tsx`; the usage-count script missed
  bare side-effect imports.
- `@types/bcrypt` is likely still needed because installed `bcrypt` does not
  expose `.d.ts` files in its package metadata.
- `jose` is still reachable through the custom `src/lib/session/session.ts`
  path. It becomes a candidate only after the legacy auth form/session chain is
  removed.
- `date-fns`, `react-day-picker`, and `react-colorful` are still used by live
  admin/filter components.

### A014-9: Historical Docs And Starter Assets

| Candidate | Evidence | Recommendation |
| --- | --- | --- |
| Root `SHOP*.md` historical notes | `docs/archive/README.md` indexes six root shop notes and says they are not the source of truth. It also says detailed filtering/sorting history still needs review before removal. `wc -l SHOP*.md` shows 1,555 lines of historical root notes. | Do not delete yet. After the Shopify workstream consolidates filtering/sorting history, move or remove the root notes in a dedicated docs cleanup. |
| `public/next.svg` and `public/vercel.svg` | `rg -n "next\.svg|vercel\.svg|/next\.svg|/vercel\.svg"` returned no references. These are default starter assets. | Delete in the first asset cleanup pass. |

## Escalations Before Deletion

- Confirm whether `/protected` is intentionally public/test-only before deleting
  the route and constant.
- Confirm auth direction before deleting `SignInFormBackup`, `processLogin`,
  `session.ts`, or `jose`.
- Confirm i18n direction before deleting `useLanguage`,
  `GlobalFeaturesContext` language fields, or translation JSON assets.
- Confirm root Shopify note consolidation before deleting the six root
  historical docs.
- Run a package-focused cleanup for dependency removals so `package-lock.json`
  changes are intentional and verified.

## Commands Run

- `pwd`
- `git status --short`
- `sed -n '1,220p' AGENTS.md`
- `sed -n '1,260p' docs/README.md`
- `sed -n '1,260p' docs/workstreams/architecture-refactor-and-code-health.md`
- `sed -n '1,240p' docs/runbooks/testing.md`
- `rg -n "A-014|Unused code|dependency pruning|unused" docs/audits/goals.md`
- `sed -n '210,255p' docs/audits/goals.md`
- `sed -n '1,260p' docs/architecture/system-overview.md`
- `sed -n '1,300p' docs/architecture/rendering-and-data-fetching.md`
- `sed -n '1,300p' docs/architecture/routes-and-api.md`
- `sed -n '1,260p' docs/risks/production-readiness.md`
- `test -f docs/audits/results/A-014-unused-code-dependency-pruning.md && sed -n '1,260p' docs/audits/results/A-014-unused-code-dependency-pruning.md || true`
- `rg --files src | sort`
- `rg --files docs | sort`
- `sed -n '1,260p' package.json`
- `sed -n '1,260p' tsconfig.json`
- `sed -n '1,220p' next.config.mjs`
- `rg --files -g '!node_modules' -g '!package-lock.json' | sort`
- `rg -n "TODO|FIXME|WIP|backup|Backup|deprecated|legacy|unused|delete|remove|superseded|old" src docs README.md package.json`
- `rg -n "from ['\"]@/components/.*/index|from ['\"]@/components/(elements/buttons|elements/icons|views|sections|modules/cards|features/adminDashboard/.*/index|loaders/.*/index)|from ['\"]@/lib/(constants|data/models|data/schemas|data/types|transforms)/index|from ['\"]@/lib/(constants|data/models|data/schemas|data/types|transforms)['\"]" src`
- `rg -n "process\.env|NEXT_PUBLIC_|SHOPIFY_|MONGO_|AUTH|NEXTAUTH|CLOUDINARY|GOOGLE|GITHUB" src next.config.mjs .env* docs/runbooks docs/architecture docs/workstreams docs/audits/results/A-019-dependencies-supply-chain.md`
  - Note: output is intentionally not reproduced here because local env files
    contained sensitive-looking values.
- `node -e "...import-reference scan over src files..."`
- `node -e "...package dependency usage scan..."` after one failed quoting
  attempt. The failed attempt did not modify files.
- Targeted `rg -n` searches for hook names, component names, WIP modules,
  forms, route constants, session helpers, package names, translation modules,
  Shopify routes, shadcn imports, section/layout names, public starter assets,
  and historical shop docs.
- Targeted `sed -n` reads for candidate runtime files, package metadata, and
  related docs.
- Targeted `nl -ba ... | sed -n ...` reads for line-numbered evidence in
  candidate files.
- Several initial reads against bracketed route paths failed due unquoted shell
  globbing and were rerun with quoted paths. No files were changed by those
  reads.

No `npm test`, `npm run build`, or `npm run lint` command was run because this
assignment was a non-mutating audit and no runtime code changed.

## Findings Register Updates

- Not updated. The assignment explicitly scoped edits to this result file and
  said not to touch the findings register unless explicitly instructed.
- Candidate reconciliation rows:
  - Medium, Code health: delete high-confidence zero-import UI/WIP leaf files.
  - Medium, Code health: remove unused barrels after direct-import policy is
    confirmed.
  - Medium, Code health: prune unused direct dependencies in a package-focused
    cleanup.
  - Medium, Auth/Routes: confirm and remove stale `/protected` route if unused.
  - Medium, Auth: reconcile legacy custom session/login path before deleting.
  - Low, Docs: consolidate and remove root Shopify historical notes.

## Risks Updated

- None. The assignment explicitly scoped edits to this result file.
- Existing risks still cover the relevant unresolved areas:
  - R-011 for unused code/dependencies/WIP modules.
  - R-002 for auth/admin route protection.
  - R-017 for dependency health.
  - R-009 for historical root shop notes.

## Workstream Updates

- None. The assignment said to keep edits scoped to the assigned result file.

## Verification

- Verification used non-mutating reference searches, import graph clues, package
  usage scans, route reachability checks, and file reads.
- No deletion was performed.
- No package files were edited.
- No runtime tests were run because no runtime behavior changed.

## Next Action

Create a staged pruning task:

1. Delete only high-confidence unused leaf UI/WIP files, unused barrels, starter
   assets, and obvious unused exports/imports; then run `npm run lint`,
   `npm test`, and `npm run build`.
2. Separately reconcile `/protected`, auth/session legacy forms, and i18n
   direction before deleting anything in those areas.
3. Open a package-focused dependency cleanup for the unused direct dependencies
   so `package.json` and `package-lock.json` changes are reviewed together with
   full verification.
