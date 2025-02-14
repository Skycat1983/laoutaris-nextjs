import { fetchArtworkFeed } from "../../lib/server/admin/data-fetching/fetchArtworkFeed";

export const getArtworkFeed = async () => {
  return await fetchArtworkFeed();
};
