"use client";
import { createFetcher } from "../../core/createFetcher";
import { createBlogFetchers } from "./shared";

const clientFetcher = createFetcher({
  getUrl: (path) => path,
  getHeaders: () => ({
    "Content-Type": "application/json",
  }),
});

export const blogClient = createBlogFetchers(clientFetcher);
