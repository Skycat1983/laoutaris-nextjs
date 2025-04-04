type BuildUrlParams = [segments: string[], query?: Record<string, string>];

type ArtworkSearchParams = {
  sortBy?: string;
  sortColor?: string;
  filterMode?: string;
};

/**
 * Builds a URL from segments and query parameters.
 * @param segments - Array of URL segments
 * @param query - Optional query parameters
 */
export function buildUrl(...[segments, query]: BuildUrlParams): string {
  const path = `/${segments.join("/")}`;

  if (!query) return path;

  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${path}?${queryString}`;
}

/**
 * Builds a URL for artwork search with optional parameters.
 *
 * @param {ArtworkSearchParams} params - The search parameters.
 * @returns {string} The constructed artwork search URL.
 */
export function buildArtworkSearchUrl(params: ArtworkSearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });

  return `/artwork?${searchParams.toString()}`;
}

export type { BuildUrlParams, ArtworkSearchParams };
