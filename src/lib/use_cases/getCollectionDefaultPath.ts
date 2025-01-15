import { getCollectionSubNavData } from "./getCollectionSubnavData";

export const getCollectionDefaultPath = async (): Promise<string> => {
  const subNavData = await getCollectionSubNavData();

  if (!subNavData || subNavData.length === 0) {
    throw new Error("No collection data is available at the moment.");
  }

  return subNavData[0].link_to;
};
