import { headers } from "next/headers";

export async function fetchBiographyLinks(
  section: string
): Promise<ApiResponse<SubnavLink[]>> {
  const result = await fetch(
    `http://localhost:3000/api/biography/links?section=${encodeURIComponent(
      section
    )}`,
    {
      // cache: "no-cache",
      method: "GET",
      headers: headers(),
    }
  ).then((res) => res.json());

  const { data } = result;

  if (!result) {
    return { success: false, message: "Section collection links not found" };
  }
  return { success: true, data: data };
}
