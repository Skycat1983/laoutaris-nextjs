import { UserNavFields } from "@/lib/data/types/navigationTypes";
import { Fetcher } from "../../core/createFetcher";

export const createUserNavigationFetchers = (fetcher: Fetcher) => ({
  // Add the user navigation fetcher
  fetchUserNavigationList: async () =>
    fetcher<UserNavFields>(`/api/v2/public/navigation/user`),
});

// Type for our navigation fetchers object
export type UserNavigationFetchers = ReturnType<
  typeof createUserNavigationFetchers
>;
