import { OwnUserNavFields } from "@/lib/data/types/navigationTypes";
import { Fetcher } from "../../core/createFetcher";
import { ListResult } from "@/lib/data/types";

export type ApiOwnUserNavResult = ListResult<OwnUserNavFields>;

export const createUserNavigationFetchers = (fetcher: Fetcher) => ({
  fetchUserNavigationList: async () =>
    fetcher<ApiOwnUserNavResult>(`/api/v2/user/navigation`),
});

export type OwnUserNavigationFetchers = ReturnType<
  typeof createUserNavigationFetchers
>;
