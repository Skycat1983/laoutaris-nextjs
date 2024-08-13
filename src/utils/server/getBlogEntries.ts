import { BlogModel } from "@/app/models";

export const getLatestBlogEntries = async () => {
  const blogEntries = await BlogModel.find().sort({ createdAt: 1 }).limit(3);

  //   const blogEntries = await BlogModel.find().sort({ createdAt: -1 }).limit(3);
  return blogEntries;
};

export const getOldestBlogEntries = async () => {
  const blogEntries = await BlogModel.find().sort({ createdAt: -1 }).limit(3);

  //   const blogEntries = await BlogModel.find().sort({ createdAt: 1 }).limit(3);
  return blogEntries;
};
