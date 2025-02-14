import { FrontendBlogEntryUnpopulated } from "@/lib/types/blogTypes";
import { fetchBlog } from "../../lib/server/blog/data-fetching/fetchBlog";

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
