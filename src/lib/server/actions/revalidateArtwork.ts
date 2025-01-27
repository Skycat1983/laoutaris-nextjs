"use server";

import { revalidatePath } from "next/cache";

export async function revalidateArtworkFeed() {
  revalidatePath("/admin/artwork");
}
