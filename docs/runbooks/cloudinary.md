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
  objects before signing, and returns a public-safe configuration error if
  `CLOUDINARY_API_SECRET` is missing.
- Cloudinary credentials and upload configuration should be environment-managed.
- Image records should preserve enough metadata for alt text, dimensions, and
  archive context where available.

## Open Work

- Inventory required Cloudinary environment variables.
- Document upload preset, folder, and transformation conventions.
- Define backup and deletion expectations for artwork images.
- Audit whether upload signing validates allowed parameters tightly enough for
  production.
