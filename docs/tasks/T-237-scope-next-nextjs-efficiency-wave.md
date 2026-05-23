# T-237 Scope Next Next.js Efficiency Wave

Status: Completed

Workstream:
[Architecture Refactor And Code Health](../workstreams/architecture-refactor-and-code-health.md),
[Frontend Routes And Components](../workstreams/frontend-routes-and-components.md),
[Testing And Quality](../workstreams/testing-and-quality.md)

## Goal

Choose the next safe, high-impact Next.js efficiency implementation slice after
the completed A-022 sequence, without making runtime changes.

## Context

- A-022 and follow-up tasks T-230 through T-236 are complete or scoped.
- F-111/R-012 remain partially mitigated: biography now has the first
  route-family cache proof, but broader public route-family caching/static ISR
  work remains open.
- F-115 remains partially mitigated: T-236 proved lazy mobile drawer splitting
  and reduced the root layout client chunk, but broader provider/modal ownership
  remains separate.
- Monitoring/instrumentation remains blocked by ADR 0005 and should not be
  selected unless the owner/provider decision changes.

## Scope

In scope:

- Review current evidence from:
  - [A-022 result](../audits/results/A-022-nextjs-feature-utilization.md)
  - [Findings register](../audits/findings-register.md) entries F-111 and
    F-115
  - [Rendering architecture](../architecture/rendering-and-data-fetching.md)
  - T-232, T-233, T-234, T-235, and T-236 task handoffs
  - Current `npm run build` route-size output if needed
- Compare at least these candidate next slices:
  - next route-family cache proof, such as `/collections` default redirect ISR
    and cached collection navigation/first-artwork reads
  - blog primary-data cache split, keeping comment/query behavior dynamic
  - sitemap short-ISR discovery freshness
  - provider/modal client-island follow-up after the T-236 drawer proof
- Rank candidates by impact, implementation risk, blast radius, testability,
  and freshness/UX constraints.
- Recommend one next implementation slice and create or update the next task
  brief for it if the scope is clear.
- Record why the other candidates should wait.

Out of scope:

- Do not make runtime source changes in this task.
- Do not move `SessionProvider`, `GlobalFeaturesProvider`, modal providers, or
  cache policy directly.
- Do not add route `revalidate`, `generateStaticParams()`, cache tags, or
  cached service wrappers directly.
- Do not unblock monitoring/instrumentation without a changed ADR 0005 owner
  decision.

## Concurrency

Run after T-235 and T-236. Do not run in parallel with route-family cache,
provider, root layout, or public navigation runtime changes.

Owned files:

- this task brief
- `docs/tasks/README.md` if a follow-up task brief is created
- optionally the recommended follow-up task brief under `docs/tasks/`
- relevant workstream next-agent-action sections if needed

Do not edit runtime source in this task.

## Acceptance Criteria

- Remaining F-111/F-115 options are compared with concrete source/build/doc
  evidence.
- One next implementation slice is selected or the blocker is stated clearly.
- The selected slice has an implementation task brief with:
  - owned files
  - explicit out-of-scope boundaries
  - acceptance criteria
  - verification commands
  - handoff notes linking findings/risks
- No runtime behavior changes are made.

## Verification

```bash
npm run build
git diff --check
```

Use targeted source searches as needed for route cache config, cached service
wrappers, `next/dynamic`, provider ownership, `useSession`, `useGlobalFeatures`,
and route-size evidence. Keep captured output summarized in the task handoff.

## Candidate Comparison

| Candidate | Impact | Risk / blast radius | Testability | Decision |
| --- | --- | --- | --- | --- |
| `/collections` default redirect ISR and cached collection navigation reads | High for F-111/R-012 because it extends the proven biography cache pattern to the next accepted default redirect surface. | Low to medium. Source shows `/collections` currently reads `getCollectionNavigationList()` and redirects to the first collection/first artwork path, while `/collections/[slug]` and `/collections/[slug]/[artworkId]` remain explicitly dynamic. Keep `MainNavLoader` on direct collection navigation to avoid root-header cache propagation. | Strong. Existing collection navigation, collection page, collection slug page, subnav loader, public route cache policy, and build-manifest checks can prove the route-local change. | Select next. Create T-238. |
| Blog primary-data cache split | Medium to high, but only after separating cacheable post/list data from query sorting, pagination, and comment mode. | Medium. `BlogListLoader` calls `getBlogList()` three ways for the default page and `/blog/[slug]` can render comments from query state, so cache boundaries are less clean than the collections redirect. | Good, but needs more route-family design before implementation. | Wait until after another redirect cache proof or a dedicated blog split scope. |
| Sitemap short-ISR discovery freshness | Medium for crawler freshness and DB/Shopify load control. | Medium. `src/app/sitemap.ts` reads Article, Blog, Artwork, Collection, and Shopify product discovery data through `getDynamicPublicSitemapEntries()`, so the change touches multiple content sources and deployed crawler behavior. | Moderate. Unit coverage exists, but useful verification should include build output and deployed `/sitemap.xml` smoke evidence. | Wait until after the second route-local cache proof. |
| Provider/modal client-island follow-up | Medium for F-115, but T-236 already captured the lowest-risk drawer split and first-load route sizes stayed effectively flat. | Medium to high. Source still wraps every route in `ClientContextBoundary`, `SessionProvider`, and `GlobalFeaturesProvider`; `useGlobalFeatures()` and `useSession()` are used across auth, account, comments, forms, saved-item, and modal flows. | Good but broad: would require focused UI behavior tests plus build chunk checks. | Wait. Scope separately after route-family cache work or an owner-approved provider ownership decision. |

Build/source evidence from this scoping pass:

- `npm run build` passed on 2026-05-23 with Next.js 14.2.35 and generated 50
  static pages.
- Build output kept `/collections` static at `189 B` route size and `87.8 kB`
  first-load JavaScript, while `/collections/[slug]` stayed dynamic at `189 B`
  / `87.8 kB` and `/collections/[slug]/[artworkId]` stayed dynamic at `228 B`
  / `130 kB`.
- Build output kept shared first-load JavaScript at `87.6 kB` and middleware at
  `48 kB`, matching the post-T-236 baseline closely.
- `__tests__/unit/publicRouteCachePolicy.test.ts` currently allows only the
  biography default redirect to export `revalidate`; `src/app/collections/page.tsx`
  is still listed as a stable static shell with no route-level `revalidate`.
- `src/app/collections/page.tsx` uses `getCollectionNavigationList()` to choose
  the first collection and first artwork redirect path.
- `src/components/loaders/componentLoaders/CollectionsSubnavLoader.tsx` also
  uses `getCollectionNavigationList()` for route-local collection navigation.
- `src/app/collections/[slug]/page.tsx` is explicitly
  `dynamic = "force-dynamic"` and uses `getCollectionNavigationItem(slug)` for
  slug-specific redirect data.
- `src/components/loaders/componentLoaders/MainNavLoader.tsx` uses
  `getCollectionNavigationList()` from the root header path; based on T-233,
  it should stay on the direct service in the next proof unless build evidence
  shows no cache propagation into unrelated static shells.
- `src/contexts/ClientContextBoundary.tsx` still mounts `SessionProvider` and
  `GlobalFeaturesProvider` globally, while modal/session consumers remain
  cross-cutting.

## Recommendation

Select T-238 as the next implementation slice:
[Pilot collections redirect cache proof](T-238-pilot-collections-redirect-cache-proof.md).

This is the best next step because it is the closest analogue to T-233:
route-local mutable redirect/navigation data, accepted 10-minute target
freshness, limited public UX surface, and clear tests. It also keeps the
provider/modal ownership decision out of the critical path and avoids caching
blog comments, search results, Shopify availability, or sitemap discovery fanout
before their boundaries are separately defined.

## Handoff Notes

- Findings: F-111 and F-115.
- Risk: R-012.
- Depends on: T-235 and T-236.
- Do not select monitoring/instrumentation unless ADR 0005 has changed.
- Completed 2026-05-23 as a docs-only scoping task. No runtime source files were
  changed.
- Created T-238 for the selected route-family cache proof.
- Verification passed: `npm run build`; `git diff --check`.
