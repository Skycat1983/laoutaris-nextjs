# T-321 Release Fixture And Auth Callback Route Ownership Scope

Status: Completed
Date: 2026-05-27

Task: [T-321 scope release fixture and auth callback route ownership](../../tasks/T-321-scope-release-fixture-auth-callback-route-ownership.md)

Workstreams:
[Architecture refactor and code health](../../workstreams/architecture-refactor-and-code-health.md),
[Deployment, security, and observability](../../workstreams/deployment-security-and-observability.md),
[Testing and quality](../../workstreams/testing-and-quality.md),
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md).

## Assignment Summary

Scope the remaining route-ownership surfaces that T-302 and T-315 deferred:
public smoke fixtures, sitemap/robots release contracts, auth callback paths,
and saved-item revalidation paths.

This was docs-only. Runtime source, tests, smoke scripts, route builders,
callback behavior, revalidation behavior, sitemap/robots output, Shopify
dashboard behavior, shared trackers, and production smoke behavior were not
changed.

## Commands Run

- `sed -n '1,220p' AGENTS.md`
- `sed -n '1,240p' docs/README.md`
- `sed -n '1,240p' docs/tasks/T-321-scope-release-fixture-auth-callback-route-ownership.md`
- `sed -n` reads for the linked workstream briefs.
- `sed -n '1,260p' docs/audits/results/T-302-route-builder-centralization-scope.md`
- `sed -n '1,260p' docs/audits/results/T-315-account-admin-route-builder-ownership-scope.md`
- Targeted reads of `scripts/smoke-public-routes.mjs`, `src/app/sitemap.ts`,
  `src/app/robots.ts`, `src/lib/metadata/publicDynamicSitemap.ts`,
  `src/lib/config/authCallbacks.ts`,
  `src/lib/actions/updateUserFavourites.ts`, and
  `src/lib/actions/updateUserWatchlist.ts`.
- Targeted reads/searches across focused deployment, route-builder, auth, and
  saved-item tests.
- `git status --short`
- `git diff --check`

## Current Ownership Inventory

| Surface | Current owner | Current behavior | Coverage / contract |
| --- | --- | --- | --- |
| Public smoke required sitemap paths | `scripts/smoke-public-routes.mjs` | The smoke CLI keeps an explicit `REQUIRED_SITEMAP_PATHS` list for `/`, `/artwork`, `/collections`, `/biography`, `/blog`, `/project/about`, `/project/contact`, `/shop/products`, and `/search`. | `__tests__/unit/deployment/publicSmokeDiscoveryEndpoints.test.ts` runs the real CLI with an in-process `fetch` fixture and asserts passing/failing discovery behavior. |
| Public smoke private sitemap prefixes | `scripts/smoke-public-routes.mjs` | The smoke CLI independently rejects sitemap paths under `/admin`, `/account`, and `/api`. | Public smoke discovery tests assert private sitemap exposure fails without dumping private response bodies. |
| Public smoke endpoint/status checks | `scripts/smoke-public-routes.mjs` | The CLI probes stable public pages, `/robots.txt`, `/sitemap.xml`, product not-found, `/sign-in`, `/api/auth/signout`, and unauthenticated `/admin/dashboard/articles` redirecting to sign-in. Optional detail checks use env/CLI-supplied IDs. | Public smoke discovery tests assert the default fixture passes with 12 passed checks and skipped optional detail checks. Deployment runbooks own live target evidence. |
| Stable sitemap routes | `src/app/sitemap.ts` | `stablePublicSitemapRoutes` is an explicit crawler contract with path, change frequency, and priority metadata. It includes stable public roots plus project subpages and `/shop/products`. | `publicMetadataDiscovery.test.ts` and `publicDynamicSitemap.test.ts` assert stable route ordering and absolute URL output. |
| Dynamic sitemap route builders | `src/lib/metadata/publicDynamicSitemap.ts` plus `src/lib/routes/publicAppRoutes.ts` | Dynamic biography, blog, artwork, collection, collection-artwork, and product entries already use public route builders. Private-prefix filtering remains local as `PRIVATE_PATH_PREFIXES`. | `publicDynamicSitemap.test.ts` asserts dynamic public detail URLs, de-dupe behavior, invalid segment rejection, private-path exclusion, and partial output when scoped sources fail. |
| Robots discovery output | `src/app/robots.ts` | Robots allows `/`, disallows `/admin`, `/account`, and `/api`, and emits an absolute `/sitemap.xml` URL. | `publicMetadataDiscovery.test.ts` asserts exact output. Public smoke validates deployed robots include an absolute sitemap directive pointing at `/sitemap.xml`. |
| NextAuth redirect callback paths | `src/lib/config/authCallbacks.ts` | The redirect callback compares `/api/auth/signin` and `/api/auth/signout`; sign-in currently returns `${baseUrl}/dashboard`, sign-out returns `baseUrl`, same-origin URLs pass through, and other URLs fall back to `baseUrl`. | Current auth tests cover JWT/session role propagation through `authCallbacks`, but there is no focused redirect-callback test owning `/api/auth/signin`, `/api/auth/signout`, `/dashboard`, same-origin pass-through, or off-origin fallback. |
| Saved-item favourites revalidation | `src/lib/actions/updateUserFavourites.ts` | Successful mutations revalidate `/account/favourites`, `/account/favourites/[artworkId]`, and `/artwork/[artworkId]` in that order. Failed or incomplete mutations do not revalidate. | `__tests__/unit/actions/savedItemActions.test.ts` asserts exact path order and no revalidation on persistence failure. |
| Saved-item watchlist revalidation | `src/lib/actions/updateUserWatchlist.ts` | Successful mutations revalidate `/account/watchlist`, `/account/watchlist/[artworkId]`, and `/artwork/[artworkId]` in that order. Failed or incomplete mutations do not revalidate. | `savedItemActions.test.ts` asserts exact path order and no revalidation on persistence failure. |

## Ownership Conclusions

### Keep Release Fixtures Explicit

`scripts/smoke-public-routes.mjs` should remain an explicit release-contract
fixture for now. Its value is independent verification: it should fail when the
deployed app stops exposing expected public routes or starts exposing private
paths in sitemap output. Importing runtime route constants into the smoke CLI
would make the test follow the implementation and weaken that independent
evidence.

The same rule applies to the smoke fixture's `/api/auth/signout` and
unauthenticated `/admin/dashboard/articles` checks. They are deployment smoke
expectations, not app navigation builders.

### Keep Sitemap And Robots Contracts Explicit

`src/app/sitemap.ts` and `src/app/robots.ts` are app-owned crawler output, not
ordinary navigation consumers. Their current explicit lists are intentionally
covered by discovery tests and public smoke. The dynamic sitemap already uses
`publicAppRoutes` for generated detail paths, which is the right level of
centralization because those entries depend on dynamic slugs/IDs and path
encoding.

Do not replace `stablePublicSitemapRoutes`, robots disallow paths, or private
sitemap prefixes with route constants in the next slice. If that ever changes,
the task should add parity coverage proving the release contract still asserts
the exact external output rather than simply mirroring helper values.

### Defer Auth Callback Centralization

`authCallbacks.ts` is a separate auth semantics task, not a route-builder
cleanup. The sign-in branch currently redirects `/api/auth/signin` to
`/dashboard`, which does not match the active account/admin route surfaces.
Changing the literals or replacing them with route constants without first
deciding the intended redirect destination would risk silently changing auth
flow behavior.

A future callback task should first add focused redirect callback coverage for:

- `/api/auth/signin` current destination.
- `/api/auth/signout` base URL destination.
- same-origin callback pass-through.
- off-origin fallback to `baseUrl`.

Only after that coverage exists should the task decide whether `/dashboard`
should remain intentional, become `/account/settings`, become the admin
dashboard for admins only, or be removed from this callback branch.

### Centralize Saved-Item Revalidation Next

Saved-item revalidation is the safest remaining implementation slice. It is
runtime behavior, but it is narrow, already has exact-order tests, and can
reuse route builders that now exist:

- `accountFavouritesPath()` and `accountFavouritesPath(artworkId)` from
  `src/lib/routes/accountRoutes.ts`.
- `accountWatchlistPath()` and `accountWatchlistPath(artworkId)` from
  `src/lib/routes/accountRoutes.ts`.
- `artworkDetailPath(artworkId)` from `src/lib/routes/publicAppRoutes.ts`.

This should be treated as cache route ownership, not account navigation. The
task must preserve the current `revalidatePath()` call order and the current
no-revalidation-on-failure behavior.

## Recommended Next Implementation Task

Add a scoped saved-item revalidation route-builder slice:

1. Update only `updateUserFavourites.ts` and `updateUserWatchlist.ts` to call
   existing route builders for their three successful `revalidatePath()` calls.
2. Keep the successful path order unchanged:
   list path, account detail path, public artwork detail path.
3. Keep all mutation, DB, logging, session, and return-message behavior
   unchanged.
4. Preserve `savedItemActions.test.ts` exact path/order assertions, updating
   expected values only if the test imports route builders for clarity.
5. Run:

```bash
npm test -- --runTestsByPath __tests__/unit/actions/savedItemActions.test.ts __tests__/unit/routes/accountRoutes.test.ts __tests__/unit/routes/publicAppRoutes.test.ts __tests__/unit/security/clientServerImportBoundary.test.ts
git diff --check
```

Practical app impact: successful favourite/watchlist mutations should still
invalidate the same account list, account detail, and public artwork pages.
The change only reduces route drift risk between cache invalidation and the
client-safe route-builder modules.

## Explicitly Deferred

- Public smoke route lists, required sitemap paths, private sitemap prefixes,
  auth shell checks, product not-found checks, and unauthenticated admin denial
  checks.
- `stablePublicSitemapRoutes` and robots `disallow` paths.
- Dynamic sitemap private-prefix filtering unless paired with release-contract
  parity tests.
- `authCallbacks.ts` redirect literals and the current `/dashboard` sign-in
  callback destination.
- Credentialed/admin smoke, production public smoke, Vercel log inspection,
  browser automation, and Shopify dashboard behavior.
- Broader API route builders and request-context route IDs.

## Candidate Shared Tracker Updates

For orchestrator reconciliation only; this task did not edit shared trackers.

- `F-030`: note that T-321 scoped the remaining release-fixture, crawler,
  callback, and saved-item revalidation route surfaces. Public smoke,
  sitemap/robots, and auth callback paths should remain explicit for now; the
  next implementation candidate is saved-item revalidation path-builder usage.
- `R-010`: keep open. T-321 narrows the remaining route ownership work but does
  not implement runtime changes. It should point future route-builder work to
  the saved-item revalidation slice and keep release fixtures/auth callbacks
  separate.
- Architecture workstream: add a next action for saved-item cache route
  centralization using existing account/public route builders.
- Deployment/security workstream: record that public smoke and crawler
  discovery route lists remain independent release contracts, not helper
  consumers.
- Testing workstream: keep `publicSmokeDiscoveryEndpoints.test.ts`,
  `publicMetadataDiscovery.test.ts`, `publicDynamicSitemap.test.ts`, and
  `savedItemActions.test.ts` as the focused verification surfaces for these
  ownership boundaries.
- Auth/admin workstream: track a separate auth callback redirect task before
  changing `/api/auth/signin`, `/api/auth/signout`, or `/dashboard` behavior.
