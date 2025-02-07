"use server";

import { FrontendBlogEntry } from "@/lib/types/blogTypes";
import { headers } from "next/headers";

export async function fetchBlogFeed(): Promise<FrontendBlogEntry[]> {
  const response = await fetch("http://localhost:3000/api/admin/blog/read", {
    method: "GET",
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog feed");
  }

  return response.json();
}

// export async function fetchBlogFeed(): Promise<FrontendBlogEntryUnpopulated[]> {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const response = await fetch(`${baseUrl}/api/admin/blog/read`, {
//     method: "GET",
//     credentials: "same-origin",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch blog feed");
//   }

//   return response.json();
// }
