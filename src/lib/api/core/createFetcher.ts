/*
Fully typed from end to end
Shared error handling
Consistent API responses
Clear separation between client and server code
Reusable fetching logic
*/

import { ApiErrorResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import dbConnect from "@/lib/db/mongodb";
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
    try {
      await dbConnect();
      const baseHeaders = config.getHeaders();
      const combinedHeaders = {
        "Content-Type": "application/json",
        ...(baseHeaders instanceof Headers
          ? Object.fromEntries(baseHeaders.entries())
          : baseHeaders),
        ...options.headers,
      };

      const response = await fetch(config.getUrl(endpoint), {
        ...options,
        headers: combinedHeaders,
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
