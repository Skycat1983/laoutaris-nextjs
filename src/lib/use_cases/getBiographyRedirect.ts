import { getBiographySubNavData } from "./getBiographySubnavData";
import { redirectToDefault } from "./redirectToDefault";

export const getBiographyDefaultRedirect = async () => {
  return redirectToDefault(
    getBiographySubNavData,
    "No biography data is available at the moment."
  );
};
