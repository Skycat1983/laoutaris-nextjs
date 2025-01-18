import { getBiographySubNavData } from "../src/lib/use_cases/getBiographySubnavData";
import { redirectToDefault } from "../src/lib/use_cases/redirectToDefault";

export const getBiographyDefaultRedirect = async () => {
  return redirectToDefault(
    getBiographySubNavData,
    "No biography data is available at the moment."
  );
};
