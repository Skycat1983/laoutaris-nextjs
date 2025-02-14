"use server";

import { headers } from "next/headers";

export async function fetchBlog<T>(
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

  console.log("in fetchBlog :>> ");
  console.log("queryParams :>> ", queryParams);

  try {
    const response = await fetch(
      `http://localhost:3000/api/blog?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    console.log("response :>> ", response);

    const result = await response.json();

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { success: false, message: "Failed to fetch blog" };
  }
}
