export const ADMIN_DELETE_RESOURCES = [
  "article",
  "artwork",
  "blog",
  "collection",
  "comment",
  "user",
] as const;

export type AdminDeleteResource = (typeof ADMIN_DELETE_RESOURCES)[number];

export const adminDeletePath = (resource: AdminDeleteResource, id: string) =>
  `/api/v2/admin/${resource}/delete/${encodeURIComponent(id)}`;

export const adminDeletePreviewPath = (
  resource: AdminDeleteResource,
  id: string
) => `${adminDeletePath(resource, id)}/preview`;
