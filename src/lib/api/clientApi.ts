import { clientAdminApi } from "./admin/clientAdminApi";
import { clientPublicApi } from "./public/clientPublicApi";

export const clientApi = {
  admin: clientAdminApi,
  public: clientPublicApi,
};
