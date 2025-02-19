import { headers } from "next/headers";
import { createFetcher } from "../../core/createFetcher";
import { createBlogFetchers } from "./shared";

const serverFetcher = createFetcher({
  getUrl: (path) => `${process.env.BASEURL}${path}`,
  getHeaders: () => headers(),
});

export const blogServer = createBlogFetchers(serverFetcher);
