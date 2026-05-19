# Cloudinary Runbook

Cloudinary is used for artwork and content images.

## Code Areas

- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `src/lib/data/schemas/cloudinarySchema.ts`
- Artwork create and update forms under `src/components/features/adminDashboard/`
- Cloudinary image rendering components.

## Operating Notes

- Upload signing should remain admin-only.
- `POST /api/v2/admin/sign-cloudinary-params` returns JSON 401 for
  unauthenticated callers and JSON 403 for authenticated non-admin callers.
- Successful signing responses must keep top-level `signature` for
  `next-cloudinary` `signatureEndpoint` compatibility. The route may also
  return an additive success envelope such as `success: true` and
  `data: { signature }`.
- The signing route validates that the request body and `paramsToSign` are JSON
  objects before signing, allows only the current widget signing parameters,
  and returns a public-safe configuration error if `CLOUDINARY_API_SECRET` is
  missing.
- Cloudinary credentials and upload configuration should be environment-managed.
- Required Cloudinary environment variables are inventoried in
  [environment.md](environment.md): `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
  `NEXT_PUBLIC_CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is not currently read from
  `process.env`; the active upload button hard-codes the preset. Owner decision
  is still needed before making the preset environment-managed.
- Image records should preserve enough metadata for alt text, dimensions, and
  archive context where available.
- A-009 confirmed the current signing route is materially safer after T-005 and
  T-066, but Cloudinary operations are not production-ready until destructive
  cleanup, metadata parsing, and delivery transformation policy are implemented.

## Cloudinary Asset Lifecycle Policy

Interim production policy: preserve Cloudinary assets when MongoDB content is
deleted. Admin delete routes must not call `cloudinary.uploader.destroy` or any
equivalent destructive Cloudinary cleanup until all of these are true:

- The asset owner has approved the specific deletion class, such as artwork,
  blog, article, collection, or failed-upload orphan cleanup.
- Cloudinary asset inventory export and MongoDB reference export have been
  captured for the affected assets.
- Backup availability, restore steps, and rollback steps have been verified for
  the affected asset class.
- The proposed deletion list has been reviewed by the owner or an explicitly
  delegated operator.

Deleting a MongoDB artwork, blog, article, or collection record currently
removes only app data and relationships. The referenced Cloudinary asset remains
in the Cloudinary account for manual review. Failed artwork create/update flows
can leave uploaded assets without a persisted MongoDB reference; those assets
must also be preserved until the manual orphan review process below is complete.

## Manual Orphan Review

Use this process before deleting any likely orphaned asset from Cloudinary:

1. Export current app references without secret values. Include artwork
   `image.public_id`, artwork `image.secure_url`, article `imageUrl`, blog
   `imageUrl`, collection `imageUrl`, and known source-controlled Cloudinary
   URLs.
2. Export the Cloudinary asset candidates from the Cloudinary dashboard or an
   owner-approved Cloudinary API script. Capture `public_id`, secure URL,
   resource type, delivery type, folder, bytes, format, created/updated time,
   tags/context if present, and whether Cloudinary backup is enabled.
3. Normalize Cloudinary URLs before comparison. Treat the same asset as
   referenced when the `public_id` matches or when the secure URL differs only
   by delivery transformations such as `/upload/w_300,q_auto/`.
4. Mark an asset as a deletion candidate only when it has no MongoDB reference,
   no source-controlled URL reference, no known use outside this app, and owner
   approval for the asset class.
5. Record deletion evidence before acting: candidate `public_id`, URL,
   matching export timestamp, searches performed, owner approval, backup/restore
   status, rollback plan, and the operator performing the deletion.
6. Prefer a staged deletion batch. Start with a small owner-approved list,
   verify public pages and admin previews still render, then continue only if no
   missing-asset issue is observed.

Do not paste full Cloudinary exports, secret-bearing API output, or large raw
logs into docs. Summarize counts and preserve the evidence file location or
operator-owned ticket instead.

## Backup, Restore, And Rollback

Minimum backup expectation before deletion: the operator must confirm that the
candidate assets can be recovered from Cloudinary account backups, a separately
exported asset archive, or another owner-approved source of truth. If recovery
cannot be demonstrated, do not delete the assets.

Minimum restore expectation: restoration must be able to recreate the same
public delivery URL or update the affected MongoDB/source references in a
controlled follow-up. If the restored asset would receive a different
`public_id` or folder, the operator must document which app records or source
constants need updates before deletion proceeds.

Rollback expectation: every deletion batch needs a rollback note with the
deleted `public_id` values, original secure URLs, restore source, and smoke
routes to check after restore. For artwork assets, include at least the artwork
detail route and one list/card route that renders the image. For blog,
article, and collection images, include the public detail route plus the
section/card route that renders the image.

## Upload Ownership

Current source facts:

| Value | Current source of truth | Policy status |
| --- | --- | --- |
| Cloud name | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is read by `sign-cloudinary-params`; `next.config.mjs` currently allows optimized images from `res.cloudinary.com/dzncmfirr/**`. | Owner must keep the environment value aligned with the configured delivery allowlist. A future task should remove the split by making the allowlist and env policy explicit before changing accounts. |
| API key | `NEXT_PUBLIC_CLOUDINARY_API_KEY` is read by the signing route Cloudinary config. | Environment-managed public account identifier. Keep paired with the configured cloud and secret. |
| API secret | `CLOUDINARY_API_SECRET` is read only server-side by the signing route. | Server-only secret. Rotate in Cloudinary if exposed or ownership changes. |
| Upload preset | `UploadButton` hard-codes `laoutaris_art`, and the signing route only accepts `upload_preset: "laoutaris_art"`. | Keep hard-coded until the owner chooses whether `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` should become the canonical runtime value. |
| Folder | No folder is signed; unknown signing params are rejected. | Do not add signed `folder`, `tags`, or `context` params until exact folder names/patterns, ownership, migration impact, and rollback behavior are approved. |

## Delivery Allowlist And Image URLs

`next.config.mjs` currently allows optimized images from:

- `https://res.cloudinary.com/dzncmfirr/**`
- `https://cdn-icons-png.flaticon.com/**`
- `https://cdn.shopify.com/**`

The Cloudinary cloud name used for upload signing must stay aligned with the
Cloudinary delivery path allowed by `next.config.mjs`; otherwise newly uploaded
assets can succeed in the widget but fail when rendered through Next image
optimization.

Blog, article, and collection image URL policy:

| Image source | Interim decision | Next implementation route |
| --- | --- | --- |
| Cloudinary-managed assets in the configured project cloud | Preferred for archive-owned blog, article, and collection imagery. | Runtime validation accepts only `https://res.cloudinary.com/dzncmfirr/**` for Cloudinary-managed content images. |
| Explicitly allowed external hosts, currently Flaticon icons and Shopify CDN product media | Allowed only when the asset is intentionally third-party or commerce-owned. | Runtime validation accepts `https://cdn-icons-png.flaticon.com/**` and `https://cdn.shopify.com/**`; document the content reason and keep the host in `next.config.mjs` before expanding the host list. |
| Other arbitrary URLs | Not production-approved. | Reject or migrate through a future image-field policy task; do not solve by adding broad image hosts. |

T-135 implements this policy in `src/lib/validation/contentImageUrl.ts` and the
admin article, blog, and collection create/update schemas. The validator rejects
unsupported protocols, arbitrary hosts, mismatched Cloudinary cloud paths,
non-default ports, credentials, and malformed URLs before persistence.

## Delivery Transformations

`src/lib/images/cloudinaryDelivery.ts` is the source of truth for app-authored
Cloudinary delivery URL transformations. Components should call
`getCloudinaryDeliveryUrl(src, variant)` instead of rewriting `/upload/`
strings inline.

The helper only transforms HTTPS URLs in the configured Cloudinary delivery
path, `https://res.cloudinary.com/dzncmfirr/image/upload/`. Non-Cloudinary
URLs, mismatched Cloudinary clouds, credentials, non-default ports, malformed
URLs, and the `original` variant are returned unchanged so Shopify, Flaticon,
or unapproved external URLs are not routed through Cloudinary-specific
transformations.

Current variants:

| Variant | Transform | Current use |
| --- | --- | --- |
| `original` | none | Detail views or callers that need the stored URL. |
| `card` | `w_300,q_auto` | Standard public/admin feed cards. |
| `galleryList` | `w_600,q_auto` | Masonry artwork list images. |
| `adminPreview` | `w_200,h_200,c_fill` | Admin article, artwork, and blog read-list previews. |
| `blogHero` | `w_1200,q_auto` | Featured blog section hero images. |
| `blogFeatureHero` | `w_1600,q_auto` | Full-width featured blog section hero images. |
| `blogFeatureCard` | `w_600,q_auto` | Secondary featured blog cards. |
| `blogGridCard` | `w_800,q_auto` | Blog tile and continuous-grid cards. |
| `blogListThumbnail` | `w_200,q_auto` | Compact split-screen blog list thumbnails. |

## Signing Parameter Allowlist

`POST /api/v2/admin/sign-cloudinary-params` signs only these `paramsToSign`
keys for the current `UploadButton` widget:

| Param | Accepted shape | Notes |
| --- | --- | --- |
| `timestamp` | Positive safe integer as a number or digit-only string. | Required before signing. |
| `upload_preset` | Exact string `laoutaris_art`. | Required before signing; mirrors the current hard-coded admin widget preset. |
| `source` | Exact string `uw`. | Allows the Cloudinary upload widget source marker. |

Unknown params, arrays, nested objects, booleans, unsafe timestamp strings, and
unexpected preset/source values return `400` before
`cloudinary.utils.api_sign_request` runs. In particular, `folder` is not
currently signed because folder rules are still an owner policy decision.

## Open Work

- Implement runtime asset cleanup only after owner-approved backup, restore,
  rollback, and deletion evidence are in place.
- Decide whether `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` should become the
  source of truth for the upload preset or whether the hard-coded admin widget
  preset remains intentional.
- Decide whether signed folder parameters are needed, and if so define exact
  folder names or patterns before adding them to the allowlist.
- Review existing blog, article, and collection image URLs against the T-135
  validation policy before any future migration or cleanup work.
- Harden artwork upload-result metadata parsing and decide how operators
  recover from failed persistence after successful upload.
