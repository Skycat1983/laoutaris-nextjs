import type { Fetcher } from "../../core/createFetcher";
import type { OwnUserFrontend, SingleResult } from "@/lib/data/types";

type ApiProfileResult = SingleResult<OwnUserFrontend>;

export const createProfileFetchers = (fetcher: Fetcher) => ({
  // Get user profile
  get: async () => fetcher<ApiProfileResult>(`/api/v2/user/profile`),

  // Update user profile
  update: async (data: Partial<OwnUserFrontend>) =>
    fetcher<ApiProfileResult>(`/api/v2/user/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
});

export type ProfileFetchers = Awaited<ReturnType<typeof createProfileFetchers>>;
