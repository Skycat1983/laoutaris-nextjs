"use server";

interface AddToFavouritesResponse {
  message: string;
}

export async function addToFavourites(
  prevState: any,
  formData: FormData
): Promise<AddToFavouritesResponse> {
  return { message: "Added to favourites" };
}
