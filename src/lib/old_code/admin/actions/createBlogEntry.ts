import { BlogModel } from "../../../data/models";
import { CreateBlogFormSchema } from "../../../data/schemas/formSchemas";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import slugify from "slugify";

export async function createBlogEntry(
  blogData: z.infer<typeof CreateBlogFormSchema>
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const enrichedBlogData = {
      ...blogData,
      author: session.user.id,
      slug: slugify(blogData.title, { lower: true }),
    };

    const newBlogEntry = new BlogModel(enrichedBlogData);
    await newBlogEntry.save();
    console.log("Saved blog entry:", newBlogEntry);
    return { success: true, blogEntry: newBlogEntry };
  } catch (error) {
    console.error("Error creating blog entry:", error);
    throw error;
  }
}
