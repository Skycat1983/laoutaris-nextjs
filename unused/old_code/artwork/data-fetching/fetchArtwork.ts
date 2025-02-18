import { headers } from "next/headers";

export async function fetchArtwork<T>(
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    identifierKey,
    identifierValue,
    single: "true",
  });

  if (fields && fields.length > 0) {
    queryParams.append("fields", fields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/artwork?${queryParams.toString()}`,
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
    console.error("Error fetching artwork:", error);
    return { success: false, message: "Failed to fetch artwork" };
  }
}
