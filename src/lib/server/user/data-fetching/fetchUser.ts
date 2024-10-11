import { headers } from "next/headers";

export async function fetchUser<T>(
  identifierKey: string,
  identifierValue: string,
  // email: string,
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
      `http://localhost:3000/api/user?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching collection fields:", error);
    return { success: false, message: "Failed to fetch collection fields" };
  }
}
