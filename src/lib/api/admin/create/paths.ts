export const ADMIN_CREATE_RESOURCES = [
  "article",
  "artwork",
  "blog",
  "collection",
] as const;

export type AdminCreateResource = (typeof ADMIN_CREATE_RESOURCES)[number];

export const adminCreatePath = (resource: AdminCreateResource) =>
  `/api/v2/admin/${resource}/create`;
