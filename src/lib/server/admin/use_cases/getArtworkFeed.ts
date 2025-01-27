import { fetchArtworkFeed } from "../data-fetching/fetchArtworkFeed";

export const getArtworkFeed = async () => {
  return await fetchArtworkFeed();
};
