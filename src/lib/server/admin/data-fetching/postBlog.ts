import { CreateBlogFormSchema } from "@/lib/server/schemas/formSchemas";
import { z } from "zod";

interface PostBlogParams {
  blogData: z.infer<typeof CreateBlogFormSchema>;
}

export async function postBlog({ blogData }: PostBlogParams) {
  const response = await fetch("/api/admin/blog/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    throw new Error("Failed to create blog entry");
  }

  return response.json();
}
