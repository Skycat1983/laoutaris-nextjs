import { getCollectionSubNavData } from "../lib/use_cases/getCollectionSubnavData";
import { redirectToDefault } from "../lib/use_cases/redirectToDefault";

export const getCollectionRedirect = async () => {
  return redirectToDefault(
    getCollectionSubNavData,
    "No collection data is available at the moment."
  );
};
