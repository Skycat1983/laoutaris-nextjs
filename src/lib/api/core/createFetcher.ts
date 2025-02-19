import { Fetcher, FetcherConfig } from "./types";

/*
Fully typed from end to end
Shared error handling
Consistent API responses
Clear separation between client and server code
Reusable fetching logic
*/

export const createFetcher = (config: FetcherConfig): Fetcher => {
  // Returns a function that can be used for any API request
  // T is the expected response data type
  return async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      //combines the configured headers with any request-specific headers
      const response = await fetch(config.getUrl(endpoint), {
        ...options,
        headers: {
          ...config.getHeaders(), // Base headers (e.g., Content-Type)
          ...options.headers, // Request-specific headers
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `Failed to fetch: ${response.statusText}`,
        };
      }

      return result;
    } catch (error) {
      console.error(`Fetch error for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      };
    }
  };
};
