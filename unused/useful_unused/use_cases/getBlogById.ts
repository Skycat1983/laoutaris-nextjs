import { FrontendBlogEntryUnpopulated } from "@/lib/data/types/blogTypes";
import { fetchBlog } from "../../../src/lib/old_code/blog/data-fetching/fetchBlog";

export const getBlogById = async (
  id: string
): Promise<FrontendBlogEntryUnpopulated> => {
  console.log("id in getBlogById :>> ", id);
  const identifierKey = "_id";
  const identifierValue = id;
  const result = await fetchBlog<FrontendBlogEntryUnpopulated>(
    identifierKey,
    identifierValue
  );
  if (!result.success) {
    throw new Error("Failed to fetch blog");
  }
  return result.data;
};
