import { headers } from "next/headers";
import { isStaticGenBailoutError } from "next/dist/client/components/static-generation-bailout";
import { isNotFoundError } from "next/dist/client/components/not-found";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";

export async function fetchArticles<T>(
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    identifierKey,
    identifierValue,
  });

  if (fields && fields.length > 0) {
    queryParams.append("fields", fields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/article?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: result.data as T,
      statusCode: response.status,
    };
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    if (isNotFoundError(error)) {
      throw error;
    }
    if (isRedirectError(error)) {
      throw error;
    }
    if (isStaticGenBailoutError(error)) {
      throw error;
    }

    console.error("Error fetching article fields:", error);
    return {
      success: false,
      message: "Failed to fetch article fields",
      statusCode: 500,
    };
  }
}
