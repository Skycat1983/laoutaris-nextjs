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

- Document upload preset, folder, and transformation conventions.
- Define backup and deletion expectations for artwork images.
- Decide whether `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` should become the
  source of truth for the upload preset or whether the hard-coded admin widget
  preset remains intentional.
- Decide whether signed folder parameters are needed, and if so define exact
  folder names or patterns before adding them to the allowlist.
- Define Cloudinary asset lifecycle expectations for deletion, backup, orphaned
  assets, and rollback.
