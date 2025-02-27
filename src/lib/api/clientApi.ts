import { clientAdminApi } from "./admin/clientAdminApi";
import { clientPublicApi } from "./public/clientPublicApi";
import { clientUserApi } from "./user/clientUserApi";

export const clientApi = {
  admin: clientAdminApi,
  user: clientUserApi,
  public: clientPublicApi,
};
