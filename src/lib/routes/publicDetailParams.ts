const artworkObjectIdPattern = /^[a-f\d]{24}$/i;

export const isValidArtworkObjectId = (artworkId: string): boolean => {
  return artworkObjectIdPattern.test(artworkId);
};
