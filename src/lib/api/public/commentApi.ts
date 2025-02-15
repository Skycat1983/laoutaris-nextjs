import { headers } from "next/headers";

export async function createComment(
  blogSlug: string,
  text: string
): Promise<void> {
  const response = await fetch(`/api/v2/blog/${blogSlug}/comment`, {
    method: "POST",
    //   headers: headers(),
    body: JSON.stringify({ text }),
  });

  const result = await response.json();

  console.log("result in create comment", result);

  if (!result.success) {
    throw new Error(result.error || "Failed to create comment");
  }

  return result.data;
}
