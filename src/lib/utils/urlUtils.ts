export interface UrlParams {
  segments: string[];
  query?: Record<string, string>;
}

export interface ArtworkSearchParams {
  sortBy?: string;
  sortColor?: string;
  filterMode?: string;
}

/**
 * Builds a URL from segments and query parameters.
 * @param segments - Array of URL segments
 */
export function buildUrl(segments: string[]): string;
/**
 * Builds a URL from segments and query parameters.
 * @param params - Object containing segments and optional query parameters
 */
export function buildUrl(params: UrlParams): string;
/**
 * Implementation of buildUrl that handles both signatures
 */
export function buildUrl(params: string[] | UrlParams): string {
  // Handle array input (backward compatibility)
  if (Array.isArray(params)) {
    return `/${params.join("/")}`;
  }

  // Handle object input (new signature)
  const { segments, query } = params;
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
