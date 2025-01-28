import { z } from "zod";
import { CreateBlogFormSchema } from "../../schemas/formSchemas";
import { postBlog } from "../../admin/data-fetching/postBlog";

interface BlogUploadParams {
  formData: z.infer<typeof CreateBlogFormSchema>;
}

export async function handleBlogUpload({ formData }: BlogUploadParams) {
  console.log("6. handleBlogUpload called with:", formData);
  try {
    console.log("7. About to call postBlog");
    const response = await postBlog({ blogData: formData });
    console.log("8. Got response from postBlog:", response);
    return response;
  } catch (error) {
    console.error("9. Error in handleBlogUpload:", error);
    throw error;
  }
}
