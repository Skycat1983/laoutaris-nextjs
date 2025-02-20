"use client";
import { createFetcher } from "../core/createFetcher";
import { createPostFetchers } from "./create/fetchers";
import { createDeleteFetchers } from "./delete/fetchers";
import { createUpdateFetchers } from "./update/fetchers";
import { createReadFetchers } from "./read/fetchers";

const adminClientFetcher = createFetcher({
  getUrl: (path) => path,
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
});

export const clientAdminApi = {
  create: createPostFetchers(adminClientFetcher),
  delete: createDeleteFetchers(adminClientFetcher),
  update: createUpdateFetchers(adminClientFetcher),
  read: createReadFetchers(adminClientFetcher),
};
