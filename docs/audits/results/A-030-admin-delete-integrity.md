# A-030 Admin Delete Integrity Snapshot

Status: Completed

Audit goal:
[A-030 Admin delete integrity snapshot](../goals.md#a-030-admin-delete-integrity-snapshot).

Workstreams:
[Content, assets, and admin operations](../../workstreams/content-assets-and-admin-ops.md),
[Auth, admin, and permissions](../../workstreams/auth-admin-and-permissions.md).

## Assignment Summary

Verify the admin destructive delete path for articles, artwork, blogs,
collections, comments, and users, with special focus on whether artwork delete
correctly handles affected user favourite/watchlist references.

Recovered clue from the aborted A-029 run: artwork deletion previews reportedly
preserve affected user favourite/watchlist records, while the destructive route
removes artwork from collections but not from users. This audit confirms that
behavior and classifies it as a concrete data-integrity issue.

## Summary

Admin delete routes now have meaningful production controls: shared admin guard,
ObjectId validation, backup/review evidence validation, read-only cascade
preview, and redacted audit-event creation before mutation. The destructive
cascade behavior generally matches the preview contract for articles, blogs,
comments, and users.

Artwork deletion is the exception. The preview explicitly finds users whose
`watchlist` or `favourites` arrays contain the artwork and reports those user
records as preserved, with the description that current artwork deletion does
not update user favourite or watchlist records. The destructive artwork delete
route then deletes the artwork and pulls it from collections only. Collection
deletion has a similar lower-impact reciprocal-reference issue: the preview and
route preserve artwork records but do not pull the deleted collection ID from
artwork `collections` arrays. No current ADR, runbook note, route contract, or
user-facing tombstone behavior makes these preserved references accepted or
harmless.

## Scope Inspected

- A-030 assignment and linked workstream/runbook/risk docs.
- Admin delete preview routes for article, artwork, blog, collection, comment,
  and user resources.
- Destructive admin delete routes for article, artwork, blog, collection,
  comment, and user resources.
- Shared delete preview, evidence validation, fetcher, and audit-event helpers.
- Delete confirmation UI where it loads previews, renders blockers/impact, and
  gates confirmation on required evidence.
- User saved-artwork list/detail routes, services, account navigation data, and
  favourite/watchlist server actions.
- Focused delete-preview, delete-route, saved-artwork route, audit-event, and
  delete-confirmation tests.

## Commands Run

- `git status --short` - completed; worktree was already dirty with unrelated
  edits, and `docs/audits/results/A-030-admin-delete-integrity.md` was
  untracked before this audit update.
- `sed -n '580,660p' docs/audits/goals.md` - completed; confirmed A-030 scope,
  output file ownership, non-destructive verification rules, and completion
  expectations.
- `rg --files src/app/api/v2/admin | rg '/delete/'` - completed; found the six
  destructive delete routes and six matching preview routes.
- `rg -n "DeleteConfirmation|fetchDeletePreview|deleteFetchers\\.preview|favourites|watchlist" src __tests__ docs` - completed; identified preview UI wiring,
  saved-artwork services/actions, and focused test coverage.
- `rg -n "populate\\([^)]+collections|collections\\.length|collectionCount|Current collection deletion" src docs __tests__` -
  completed; identified the collection delete reciprocal-reference surface.
- Targeted `nl -ba ... | sed -n ...` reads of the source/test/doc files named
  in this result - completed; no production data or destructive operations were
  used.
- `npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/userSavedRoutes.test.ts __tests__/unit/forms/adminDeleteConfirmation.test.tsx --runInBand` -
  completed with a verification note: the three API suites passed, but the
  first `adminDeleteConfirmation` UI test timed out under the combined run.
- `npm test -- --runTestsByPath __tests__/unit/forms/adminDeleteConfirmation.test.tsx --runInBand` -
  passed: 1 suite, 4 tests.
- `npm test -- --runTestsByPath __tests__/unit/api/adminDeletePreviewRoute.test.ts __tests__/unit/api/adminDeleteRouteGuard.test.ts __tests__/unit/api/userSavedRoutes.test.ts --runInBand` -
  passed: 3 suites, 84 tests. Node emitted the existing `punycode`
  deprecation warning.

## Delete Path Matrix

| Resource | Preview behavior | Destructive behavior | User-visible aftermath | Evidence |
| --- | --- | --- | --- | --- |
| Article | Reads the article, reports deleting the article, and reports referenced Cloudinary `imageUrl` assets as preserved when present. | Requires admin, valid ID, delete evidence, and audit event; then calls `ArticleModel.findByIdAndDelete(id)`. | Linked artwork and assets remain available; no user saved-artwork impact. | `src/lib/api/admin/delete/preview.ts:269`; `src/app/api/v2/admin/article/delete/[id]/route.ts:23`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:427`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:477` |
| Artwork | Reads artwork, referencing articles, collections, and users with matching `watchlist`/`favourites`; blocks when articles reference the artwork; reports collection detaches; reports Cloudinary image and affected users as preserved. | Requires admin, valid ID, delete evidence, and audit event; starts a transaction; blocks if an article references the artwork; otherwise deletes the artwork and pulls it from collection `artworks` arrays only. | Collections are cleaned up, but users can retain stale favourite/watchlist ObjectIds for a deleted artwork. Account nav can still derive first saved-artwork links from raw arrays, detail loaders return not-found/error states, and server actions classify mismatched saved-artwork references as data-integrity errors. | `src/lib/api/admin/delete/preview.ts:303`; `src/app/api/v2/admin/artwork/delete/[id]/route.ts:23`; `src/lib/data/services/getOwnUserNavigation.ts:17`; `src/lib/transforms/transformHelpers.ts:111`; `src/lib/data/services/getOwnSavedArtwork.ts:54`; `src/lib/actions/updateUserFavourites.ts:48`; `src/lib/actions/updateUserWatchlist.ts:48`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:469`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:650` |
| Blog | Reads the blog, referenced comments, and comment authors; reports deleting the blog/comments, updating user comment arrays, and preserving Cloudinary `imageUrl` assets. | Requires admin, valid ID, delete evidence, and audit event; starts a transaction; deletes associated comments, pulls those comment IDs from users, then deletes the blog. | Public blog/comment views lose the blog and associated comments consistently; affected user comment arrays are cleaned. | `src/lib/api/admin/delete/preview.ts:390`; `src/app/api/v2/admin/blog/delete/[id]/route.ts:24`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:554`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:681` |
| Collection | Reads the collection; reports deleting only the collection while preserving linked artwork records and stating that current deletion does not pull collection references from artwork records. | Requires admin, valid ID, delete evidence, and audit event; calls `CollectionModel.findByIdAndDelete(id)` only. | Artwork records remain, but `Artwork.collections` can retain the deleted collection ID. That can leave stale `collectionCount` values and stale `collections.length` sorting input on artwork lists. | `src/lib/api/admin/delete/preview.ts:456`; `src/lib/api/admin/delete/preview.ts:490`; `src/app/api/v2/admin/collection/delete/[id]/route.ts:70`; `src/lib/data/models/artworkModel.ts:27`; `src/lib/transforms/transformHelpers.ts:65`; `src/lib/data/services/getArtworkList.ts:90`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:607` |
| Comment | Reads the comment; reports deleting it and updating the related user and blog comment arrays. | Requires admin, valid ID, delete evidence, and audit event; starts a transaction; pulls the comment ID from the author and blog, then deletes the comment. | Blog and user comment references are cleaned consistently. | `src/lib/api/admin/delete/preview.ts:508`; `src/app/api/v2/admin/comment/delete/[id]/route.ts:24`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:647`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:723` |
| User | Reads the target user; reports blockers for current-admin and last-admin deletion; reports deleting the user and user comments, updating blog comment arrays, and updating artwork `watcherlist`/`favourited` arrays. | Requires admin, valid ID, delete evidence, and audit event; blocks current-admin delete before transaction work; blocks last-admin delete; otherwise deletes user comments, pulls those comments from blogs, pulls the user ID from saved artwork reciprocal arrays, and deletes the user. | Comments and reciprocal saved-artwork references are cleaned; admin lockout protections remain in place. | `src/lib/api/admin/delete/preview.ts:553`; `src/app/api/v2/admin/user/delete/[id]/route.ts:29`; `__tests__/unit/api/adminDeletePreviewRoute.test.ts:677`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:763`; `__tests__/unit/api/adminDeleteRouteGuard.test.ts:873` |

## Saved Artwork Reference Assessment

Preserved favourite/watchlist references after artwork deletion are a concrete
data-integrity issue, not accepted or harmless behavior.

Evidence:

- The data model stores reciprocal saved-artwork relationships: users store
  artwork IDs in `watchlist` and `favourites`, while artworks store user IDs in
  `watcherlist` and `favourited`.
- The artwork preview intentionally detects affected users with
  `$or: [{ watchlist: id }, { favourites: id }]`, but classifies them under
  `preserved` with the message that current artwork deletion does not update
  user favourite or watchlist records.
- The artwork destructive route does not import `UserModel` and performs only
  `ArtworkModel.findByIdAndDelete(id)` plus `CollectionModel.updateMany(...$pull
  artworks...)`.
- Account navigation reads raw user `favourites` and `watchlist` arrays and
  derives `firstFavouriteId`, `firstWatchlistId`, `hasFavourites`, and
  `hasWatchlist` from those arrays. A stale deleted-artwork ID can therefore
  keep account saved-artwork navigation enabled and point to a missing detail
  route.
- Saved-artwork detail services return `artwork-not-found` when the target
  artwork record is gone, and the loaders surface that as generic error states.
- Favourite/watchlist server actions explicitly call mismatched user/artwork
  saved references a `Data integrity error`, so the current artwork delete path
  creates a state that other code already treats as invalid.
- The user delete route cleans the reciprocal side by pulling the deleted user
  from artwork `watcherlist` and `favourited` arrays. Artwork delete should have
  an equally explicit policy for the reciprocal user arrays.

The preview does surface the preserved user records to the admin operator, but
that is only a warning. It does not make stale user references safe for account
navigation, saved-artwork detail routes, or future saved-item mutations.

## Findings

| Severity | Finding | Evidence | Recommended follow-up |
| --- | --- | --- | --- |
| High | Artwork admin deletion leaves stale user favourite/watchlist references for deleted artwork. | Preview explicitly detects affected users and preserves them (`src/lib/api/admin/delete/preview.ts:306`, `src/lib/api/admin/delete/preview.ts:376`), while the destructive route deletes the artwork and pulls only collection references (`src/app/api/v2/admin/artwork/delete/[id]/route.ts:93`). Raw user arrays still drive account saved-artwork navigation (`src/lib/data/services/getOwnUserNavigation.ts:17`, `src/lib/transforms/transformHelpers.ts:111`), saved-artwork detail returns `artwork-not-found` for missing artwork (`src/lib/data/services/getOwnSavedArtwork.ts:94`), and saved-item actions call reciprocal mismatches data-integrity errors (`src/lib/actions/updateUserFavourites.ts:48`, `src/lib/actions/updateUserWatchlist.ts:48`). | Create a focused implementation task that either removes the deleted artwork ID from user `favourites` and `watchlist` arrays in the artwork delete transaction, or records an owner-approved preserved-history policy with tombstone UI and route behavior. The cleanup path is the coherent default: update preview from `preserve user` to `update user`, mutate users transactionally, update audit summary expectations, add tests for user cleanup, and align the runbook current-effects table. |
| Medium | Collection admin deletion leaves stale collection IDs on artwork records. | Preview says current collection deletion preserves artwork records and does not pull collection references from artwork records (`src/lib/api/admin/delete/preview.ts:490`), and the destructive route only calls `CollectionModel.findByIdAndDelete(id)` (`src/app/api/v2/admin/collection/delete/[id]/route.ts:70`). Artwork records store `collections` (`src/lib/data/models/artworkModel.ts:27`), public transforms expose `collectionCount` from that array (`src/lib/transforms/transformHelpers.ts:65`), and public artwork sorting can use `collections.length` (`src/lib/data/services/getArtworkList.ts:90`). | Include collection/artwork reciprocal cleanup in the same delete-integrity follow-up: either pull the deleted collection ID from `Artwork.collections` during collection deletion and update preview/tests/runbook, or document an explicit preserved-history policy and adjust public count/sort behavior accordingly. |

## Findings Register Updates

Candidate rows for orchestrator review only. Do not edit
`docs/audits/findings-register.md` in this audit unless separately assigned.

| Candidate ID | Severity | Status | Finding | Suggested routing |
| --- | --- | --- | --- | --- |
| A-030-F01 | High | Candidate | Artwork admin deletion leaves stale user favourite/watchlist references for deleted artwork, creating saved-artwork navigation/detail failures and reciprocal relationship drift. | Content/assets/admin ops with auth/data API review; likely follow-up task under destructive delete integrity. |
| A-030-F02 | Medium | Candidate | Collection admin deletion leaves stale collection IDs on artwork records, affecting artwork collection counts and collection-based sorting. | Content/assets/admin ops with data/API review; include in the same reciprocal delete cleanup task if scoped together. |

## Risks Updated

- Candidate update only: R-007/R-006 should mention that A-030 found remaining
  destructive delete integrity gaps for reciprocal artwork saved-user and
  collection/artwork references.
  No shared risk file was edited because A-030 owns only this result file.

## Workstream Updates

- Candidate content-assets/admin backlog update: add a focused reciprocal
  delete-reference cleanup task for artwork saved-user references and collection
  artwork references, or an owner/ADR decision if preserved history is
  intentionally required.
- Candidate auth-admin update: keep user/account saved-artwork route behavior in
  scope for the follow-up because stale user arrays affect account navigation
  and saved-artwork detail loaders.
- No shared workstream files were edited because A-030 owns only this result
  file.

## Next Action

Create one reciprocal delete-reference cleanup task. It should first fix artwork
delete saved-reference integrity by pulling the deleted artwork ID from all user
`favourites` and `watchlist` arrays in the same transaction, then fix collection
delete relationship integrity by pulling the deleted collection ID from affected
artwork `collections` arrays. Update the preview contracts from preserved
records to updates, adjust audit summary/test expectations, and update the
admin content operations runbook. If the owner wants either preserved-history
behavior instead, make that an explicit ADR first and add the corresponding
tombstone/count/sort UI and route behavior before production deletes rely on it.
