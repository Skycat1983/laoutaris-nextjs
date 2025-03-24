/*
Fully typed from end to end
Shared error handling
Consistent API responses
Clear separation between client and server code
Reusable fetching logic
*/

import { ApiErrorResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
// Fetcher types
export type Fetcher = <T>(
  endpoint: string,
  options?: RequestInit
) => Promise<T | ApiErrorResponse>;

export type FetcherConfig = {
  getUrl: (path: string) => string;
  getHeaders: () => HeadersInit;
};

export const createFetcher = (config: FetcherConfig): Fetcher => {
  return async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | ApiErrorResponse> => {
    console.log("🔍 Fetcher called:", {
      endpoint,
      options,
      stack: new Error().stack?.split("\n").slice(1, 5).join("\n"), // First 4 lines of stack
    });
    try {
      const baseHeaders = config.getHeaders();
      const combinedHeaders = {
        "Content-Type": "application/json",
        ...(baseHeaders instanceof Headers
          ? Object.fromEntries(baseHeaders.entries())
          : baseHeaders),
        ...options.headers,
      };

      const finalUrl = config.getUrl(endpoint);
      console.log("🌐 Final URL:", finalUrl);

      const response = await fetch(finalUrl, {
        ...options,
        headers: combinedHeaders,
      });

      // Log response info
      console.log("📥 Response:", {
        url: finalUrl,
        status: response.status,
        ok: response.ok,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error:
            typeof result.error === "string"
              ? result.error
              : "An error occurred",
        } satisfies ApiErrorResponse;
      }

      return result satisfies T;
    } catch (error) {
      if (isNextError(error)) {
        // console.error(`NextError error for ${endpoint}:`, error);
        throw error;
      }
      console.error(`Fetch error for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      } satisfies ApiErrorResponse;
    }
  };
};
