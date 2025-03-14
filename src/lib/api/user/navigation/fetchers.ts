import { Fetcher } from "../../core/createFetcher";
import { OwnUserNavDataFrontend, SingleResult } from "@/lib/data/types";

export type ApiOwnUserNavResult = SingleResult<OwnUserNavDataFrontend>;

export const createUserNavigationFetchers = (fetcher: Fetcher) => ({
  fetchUserNavigation: async () =>
    fetcher<ApiOwnUserNavResult>(`/api/v2/user/navigation`),
});

export type OwnUserNavigationFetchers = ReturnType<
  typeof createUserNavigationFetchers
>;
