import { getBiographySubNavData } from "../lib/use_cases/getBiographySubnavData";
import { redirectToDefault } from "../lib/use_cases/redirectToDefault";

export const getBiographyDefaultRedirect = async () => {
  return redirectToDefault(
    getBiographySubNavData,
    "No biography data is available at the moment."
  );
};
