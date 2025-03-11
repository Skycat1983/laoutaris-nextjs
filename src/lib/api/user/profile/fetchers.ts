import type { Fetcher } from "../../core/createFetcher";
import type { PublicUser, SingleResult } from "@/lib/data/types";

type ApiProfileResult = SingleResult<PublicUser>;

export const createProfileFetchers = (fetcher: Fetcher) => ({
  // Get user profile
  get: async () => fetcher<ApiProfileResult>(`/api/v2/user/profile`),

  // Update user profile
  update: async (data: Partial<PublicUser>) =>
    fetcher<ApiProfileResult>(`/api/v2/user/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
});

export type ProfileFetchers = ReturnType<typeof createProfileFetchers>;
