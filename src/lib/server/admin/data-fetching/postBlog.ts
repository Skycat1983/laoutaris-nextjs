import { CreateBlogFormSchema } from "@/lib/server/schemas/formSchemas";
import { z } from "zod";

interface PostBlogParams {
  blogData: z.infer<typeof CreateBlogFormSchema>;
}

export async function postBlog({ blogData }: PostBlogParams) {
  console.log("blogData in postBlog", blogData);
  const response = await fetch(`/api/admin/blog/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blogData),
  });

  console.log("response in postBlog", response);

  if (!response.ok) {
    throw new Error("Failed to create blog entry");
  }

  return response.json();
}
