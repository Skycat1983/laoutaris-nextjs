import { headers } from "next/headers";

export async function fetchCollections<T>(
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
): Promise<ApiResponse<T[]>> {
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

    return { success: true, data: result.data as T[] };
  } catch (error) {
    console.error("Error fetching collection fields:", error);
    return { success: false, message: "Failed to fetch collection fields" };
  }
}

// export async function fetchCollection(
//   slug: string
// ): Promise<ApiResponse<IFrontendCollection>> {
//   console.log("slug in fetch collection", slug);

//   const result = await fetch(
//     `http://localhost:3000/api/collection/slug?slug=${encodeURIComponent(
//       slug
//     )}`,
//     {
//       method: "GET",
//       headers: headers(),
//     }
//   ).then((res) => res.json());

//   console.log("result", result);

//   if (!result || !result.success) {
//     return { success: false, message: "Collection not found" };
//   }

//   return { success: true, data: result.data };
// }
