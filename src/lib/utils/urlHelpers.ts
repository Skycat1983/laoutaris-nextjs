export const buildArtworkSearchUrl = (params: {
  sortBy?: string;
  sortColor?: string;
  filterMode?: string;
}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });

  return `/artwork?${searchParams.toString()}`;
};
