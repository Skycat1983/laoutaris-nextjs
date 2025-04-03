interface UrlParams {
  segments: string[];
  query?: Record<string, string>;
}

/**
 * Builds a URL from segments and query parameters.
 *
 * @param {UrlParams} params - The URL parameters.
 * @returns {string} The constructed URL.
 */
function buildUrl({ segments, query }: UrlParams): string {
  const path = `/${segments.join("/")}`;

  if (!query) return path;

  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${path}?${queryString}`;
}

export type { UrlParams };
export { buildUrl };
