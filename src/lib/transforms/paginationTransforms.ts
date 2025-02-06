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
  return {
    prev: page > 1 ? `${basePath}?page=${page - 1}` : null,
    next: page * limit < total ? `${basePath}?page=${page + 1}` : null,
  };
}
