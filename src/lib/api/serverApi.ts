import { serverAdminApi } from "./admin/serverAdminApi";
import { serverPublicApi } from "./public/serverPublicApi";

export const serverApi = {
  public: serverPublicApi,
  admin: serverAdminApi,
};
