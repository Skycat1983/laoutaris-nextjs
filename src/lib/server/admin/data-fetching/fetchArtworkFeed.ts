"use server";

import type { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";
import { headers } from "next/headers";

export async function fetchArtworkFeed(): Promise<
  FrontendArtworkUnpopulated[]
> {
  const response = await fetch("http://localhost:3000/api/admin/artwork/read", {
    method: "GET",
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch artwork feed");
  }

  return response.json();
}
