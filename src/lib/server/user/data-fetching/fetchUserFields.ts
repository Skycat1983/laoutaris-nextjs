import { headers } from "next/headers";

export async function fetchUserFields<T>(
  email: string,
  fields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({ email });

  if (fields && fields.length > 0) {
    queryParams.append("fields", fields.join(","));
  }

  const response = await fetch(
    `http://localhost:3000/api/user/fields?${queryParams.toString()}`,
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
}
