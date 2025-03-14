interface PaginationLinks {
  prev: string | null;
  next: string | null;
}

export function transformToPaginationLinks(
  page: number,
  limit: number,
  total: number,
  basePath: string
): PaginationLinks {
  const baseUrl = new URL(basePath, "http://placeholder.com");

  return {
    prev:
      page > 1
        ? `${baseUrl.pathname}?sortby=${baseUrl.searchParams.get(
            "sortby"
          )}&page=${page - 1}`
        : null,
    next:
      page * limit < total
        ? `${baseUrl.pathname}?sortby=${baseUrl.searchParams.get(
            "sortby"
          )}&page=${page + 1}`
        : null,
  };
}
