import { headers } from "next/headers";

export async function fetchCollectionArtwork<T>(
  collectionKey: string, // Changed from identifierKey
  collectionValue: string, // Changed from identifierValue
  collectionFields?: string[],
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  // Changed from ApiResponse<T[]>
  const queryParams = new URLSearchParams({
    collectionKey, // Updated parameter name
    collectionValue, // Updated parameter name
  });

  if (collectionFields && collectionFields.length > 0) {
    queryParams.append("collectionFields", collectionFields.join(","));
  }

  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("artworkFields", artworkFields.join(","));
  }

  try {
    console.log("in try");
    const response = await fetch(
      `http://localhost:3000/api/collection/artwork?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch data",
      };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching collection artworks:", error);
    return { success: false, message: "Failed to fetch collection artworks" };
  }
}

// export async function fetchCollectionArtwork<T>(
//   identifierKey: string,
//   identifierValue: string,
//   fields?: string[]
// ): Promise<ApiResponse<T[]>> {
//   const queryParams = new URLSearchParams({
//     identifierKey,
//     identifierValue,
//   });

//   if (fields && fields.length > 0) {
//     queryParams.append("fields", fields.join(","));
//   }

//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/collection/artwork?${queryParams.toString()}`,
//       {
//         method: "GET",
//         headers: headers(),
//       }
//     );

//     const result = await response.json();

//     if (!result.success) {
//       return { success: false, message: result.message };
//     }

//     return { success: true, data: result.data as T[] };
//   } catch (error) {
//     console.error("Error fetching collection fields:", error);
//     return { success: false, message: "Failed to fetch collection fields" };
//   }
// }
