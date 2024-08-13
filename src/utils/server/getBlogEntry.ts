import { BlogModel, IBlogEntry } from "@/app/models";
import { IFrontendBlogEntry } from "@/lib/types/blogTypes";

export const getBlogEntry = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await BlogModel.findOne({ slug: slug });
    // .populate("author")
    // .lean();

    const data = JSON.parse(JSON.stringify(content));
    if (data) {
      return data as IFrontendBlogEntry;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
