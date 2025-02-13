import {
  CreateArticleFormValues,
  FrontendArticle,
} from "@/lib/types/articleTypes";
import {
  CreateCollectionFormValues,
  FrontendCollection,
} from "../types/collectionTypes";

export const postArticle = async (
  data: CreateArticleFormValues
): Promise<ApiResponse<FrontendArticle>> => {
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

export const postCollection = async (
  data: CreateCollectionFormValues
): Promise<ApiResponse<FrontendCollection>> => {
  try {
    const response = await fetch("/api/v2/admin/collection/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to create collection");
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

// interface PostBlogParams {
//   blogData: z.infer<typeof CreateBlogFormSchema>;
// }

// export async function postBlog({ blogData }: PostBlogParams) {
//   console.log("blogData in postBlog", blogData);
//   const response = await fetch(`/api/v2/admin/blog/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(blogData),
//   });

//   console.log("response in postBlog", response);

//   if (!response.ok) {
//     throw new Error("Failed to create blog entry");
//   }

//   return response.json();
// }
