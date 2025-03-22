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

    console.log("4. Constructed baseUrl:", baseUrl);

    try {
      const newUrl = new URL(path, baseUrl);
      console.log("5. Final URL:", newUrl.toString());
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

// console.log("=== URL Construction Debug ===");
// console.log("1. Incoming path:", path);
// console.log("2. NODE_ENV:", process.env.NODE_ENV);
// console.log("3. VERCEL_URL:", process.env.VERCEL_URL);
// console.log("4. VERCEL_ENV:", process.env.VERCEL_ENV);
// console.log("NEXT_PUBLIC_VERCEL_ENV:", process.env.NEXT_PUBLIC_VERCEL_ENV);
// console.log("NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL);
