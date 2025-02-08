import { CreateArticleFormValues } from "@/lib/types/articleTypes";

export const postArticle = async (data: CreateArticleFormValues) => {
  try {
    const response = await fetch("/api/v2/admin/article/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create article");
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
