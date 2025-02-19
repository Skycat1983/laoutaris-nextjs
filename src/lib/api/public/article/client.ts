"use client";
import { createFetcher } from "../../core/createFetcher";
import { createArticleFetchers } from "./shared";

const clientFetcher = createFetcher({
  getUrl: (path) => path,
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
});

export const articleClient = createArticleFetchers(clientFetcher);
