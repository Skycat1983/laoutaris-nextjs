import { UpdateArticleFormValues } from "@/lib/types/articleTypes";

export const patchArticle = async (
  articleId: string,
  data: UpdateArticleFormValues
) => {
  try {
    const response = await fetch(
      `/api/v2/admin/article/update?_id=${articleId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to update article");
    }

    return result;
  } catch (error) {
    throw new Error(
      `API Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
  }
};
