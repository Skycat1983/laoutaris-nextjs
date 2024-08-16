"use server";

import dbConnect from "@/utils/mongodb";

interface AddToFavouritesResponse {
  message: string;
}

export async function addToFavourites(
  prevState: any,
  formData: FormData
): Promise<AddToFavouritesResponse> {
  await dbConnect();

  return { message: "Added to favourites" };
}
