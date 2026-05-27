export const ADMIN_READ_RESOURCES = [
  "article",
  "artwork",
  "blog",
  "collection",
  "comment",
  "user",
] as const;

export type AdminReadResource = (typeof ADMIN_READ_RESOURCES)[number];

type AdminReadFilterParams = {
  key?: string | null;
  value?: string | null;
};

export interface AdminReadListPathParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: AdminReadFilterParams;
}

export const adminReadDetailPath = (resource: AdminReadResource, id: string) =>
  `/api/v2/admin/${resource}/read/${encodeURIComponent(id)}`;

export const adminReadListPath = (
  resource: AdminReadResource,
  { page = 1, limit = 10, search, filter }: AdminReadListPathParams = {}
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    params.append("search", trimmedSearch);
  }

  if (filter?.key && filter?.value) {
    params.append("filterKey", filter.key);
    params.append("filterValue", filter.value);
  }

  return `/api/v2/admin/${resource}/read?${params}`;
};
