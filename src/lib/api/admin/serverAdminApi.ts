import { headers } from "next/headers";
import { createFetcher } from "../core/createFetcher";
import { createPostFetchers } from "./create/fetchers";
import { createDeleteFetchers } from "./delete/fetchers";
import { createUpdateFetchers } from "./update/fetchers";
import { createReadFetchers } from "./read/fetchers";

// const adminServerFetcher = createFetcher({
//   getUrl: (path) => {
//     const baseUrl = process.env.BASEURL || "http://localhost:3000";
//     return new URL(path, baseUrl).toString();
//   },
//   getHeaders: () => headers(),
// });

const adminServerFetcher = createFetcher({
  getUrl: (path) => {
    return path.startsWith("/") ? path : `/${path}`;
  },
  getHeaders: () => headers(),
});
export const serverAdminApi = {
  create: createPostFetchers(adminServerFetcher),
  delete: createDeleteFetchers(adminServerFetcher),
  update: createUpdateFetchers(adminServerFetcher),
  read: createReadFetchers(adminServerFetcher),
};
