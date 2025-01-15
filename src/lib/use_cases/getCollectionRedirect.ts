import { getCollectionSubNavData } from "./getCollectionSubnavData";
import { redirectToDefault } from "./redirectToDefault";

export const getCollectionRedirect = async () => {
  return redirectToDefault(
    getCollectionSubNavData,
    "No collection data is available at the moment."
  );
};
