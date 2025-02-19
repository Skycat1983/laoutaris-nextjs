import { headers } from "next/headers";
import { createFetcher } from "../../core/createFetcher";
import { createArticleFetchers } from "./shared";

const serverFetcher = createFetcher({
  getUrl: (path) => {
    const baseUrl = process.env.BASEURL || "http://localhost:3000";
    return new URL(path, baseUrl).toString();
  },
  getHeaders: () => headers(),
});

export const articleServer = createArticleFetchers(serverFetcher);
