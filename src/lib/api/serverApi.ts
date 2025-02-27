import { serverAdminApi } from "./admin/serverAdminApi";
import { serverPublicApi } from "./public/serverPublicApi";
import { serverUserApi } from "./user/serverUserApi";
export const serverApi = {
  public: serverPublicApi,
  user: serverUserApi,
  admin: serverAdminApi,
};
