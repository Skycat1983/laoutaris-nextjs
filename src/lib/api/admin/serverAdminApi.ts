import { headers } from "next/headers";
import { createFetcher } from "../core/createFetcher";
import { createPostFetchers } from "./create/fetchers";
import { createDeleteFetchers } from "./delete/fetchers";
import { createUpdateFetchers } from "./update/fetchers";
import { createReadFetchers } from "./read/fetchers";

const adminServerFetcher = createFetcher({
  getUrl: (path) => {
    const baseUrl =
      process.env.VERCEL_ENV === "production"
        ? `https://laoutaris-nextjs.vercel.app`
        : process.env.VERCEL_ENV === "preview"
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:3000`;

    try {
      const newUrl = new URL(path, baseUrl);
      return newUrl.toString();
    } catch (error) {
      console.error("6. URL Construction Error:", error);
      throw error;
    }
  },
  getHeaders: () => headers(),
});
export const serverAdminApi = {
  create: createPostFetchers(adminServerFetcher),
  delete: createDeleteFetchers(adminServerFetcher),
  update: createUpdateFetchers(adminServerFetcher),
  read: createReadFetchers(adminServerFetcher),
};
