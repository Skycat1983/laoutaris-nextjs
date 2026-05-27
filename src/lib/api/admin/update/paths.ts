export const ADMIN_UPDATE_RESOURCES = [
  "article",
  "artwork",
  "blog",
  "collection",
] as const;

export type AdminUpdateResource = (typeof ADMIN_UPDATE_RESOURCES)[number];

export const adminUpdatePath = (resource: AdminUpdateResource, id: string) =>
  `/api/v2/admin/${resource}/update/${encodeURIComponent(id)}`;
