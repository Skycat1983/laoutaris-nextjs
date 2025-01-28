import { z } from "zod";
import { CreateBlogFormSchema } from "../../schemas/formSchemas";
import { postBlog } from "../../admin/data-fetching/postBlog";

export async function handleBlogUpload(
  formData: z.infer<typeof CreateBlogFormSchema>
) {
  const blogData = {
    title: formData.title,
    subtitle: formData.subtitle,
    summary: formData.summary,
    text: formData.text,
    imageUrl: formData.imageUrl,
    tags: formData.tags,
    featured: formData.featured,
    displayDate: formData.displayDate,
  };

  return await postBlog({ blogData });
}
