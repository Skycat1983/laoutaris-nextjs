import { headers } from "next/headers";
// i want to refactor my code so that data is no longer fetched in the layout file. instead we should fetch in the subnav component.

export async function fetchCollections<T>(
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
      `http://localhost:3000/api/collection?${queryParams.toString()}`,
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
