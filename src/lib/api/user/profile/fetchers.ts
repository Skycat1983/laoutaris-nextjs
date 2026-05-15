import type { Fetcher } from "../../core/createFetcher";
import type { OwnUserFrontend, SingleResult } from "@/lib/data/types";

export type ApiProfileResult = SingleResult<OwnUserFrontend>;

export const createProfileFetchers = (fetcher: Fetcher) => ({
  // Get user profile
  get: async () => fetcher<ApiProfileResult>(`/api/v2/user/profile`),
});

export type ProfileFetchers = Awaited<ReturnType<typeof createProfileFetchers>>;
