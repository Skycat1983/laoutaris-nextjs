# Cloudinary Runbook

Cloudinary is used for artwork and content images.

## Code Areas

- `src/app/api/v2/admin/sign-cloudinary-params/route.ts`
- `src/lib/data/schemas/cloudinarySchema.ts`
- Artwork create and update forms under `src/components/features/adminDashboard/`
- Cloudinary image rendering components.

## Operating Notes

- Upload signing should remain admin-only.
- Cloudinary credentials and upload configuration should be environment-managed.
- Image records should preserve enough metadata for alt text, dimensions, and
  archive context where available.

## Open Work

- Inventory required Cloudinary environment variables.
- Document upload preset, folder, and transformation conventions.
- Define backup and deletion expectations for artwork images.
- Audit whether upload signing validates allowed parameters tightly enough for
  production.
