import { getBiographySubNavData } from "./getBiographySubnavData";

export const getBiographyDefaultPath = async (): Promise<string> => {
  const subNavData = await getBiographySubNavData();

  if (!subNavData || subNavData.length === 0) {
    throw new Error("No biography data is available at the moment.");
  }

  return subNavData[0].link_to;
};
