export function buildUrl(
  segments: string[],
  query?: Record<string, string>
): string {
  const path = `/${segments.join("/")}`;

  if (!query) return path;

  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `${path}?${queryString}`;
}
