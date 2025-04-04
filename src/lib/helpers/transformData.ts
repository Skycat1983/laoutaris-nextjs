export const replaceMongoId = <T extends { _id: any }>(
  document: T
): Omit<T, "_id"> & { id: string } => {
  const { _id, ...rest } = document;
  return {
    id: _id.toString(),
    ...rest,
  };
};

export const filterWatchlerlist = <T extends { watcherlist: string[] }>(
  watcherlist: T,
  userId: string
): T => {
  return {
    ...watcherlist,
    watcherlist: watcherlist.watcherlist.filter((id) => id !== userId),
  };
};
