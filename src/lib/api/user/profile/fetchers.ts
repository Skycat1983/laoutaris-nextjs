import type { Fetcher } from "../../core/createFetcher";

export const createProfileFetchers = (fetcher: Fetcher) => ({
  // Get user profile
  get: async () => fetcher<FrontendUser>(`/api/v2/user/profile`),

  // Update user profile
  update: async (data: Partial<FrontendUser>) =>
    fetcher<FrontendUser>(`/api/v2/user/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
});

export type ProfileFetchers = ReturnType<typeof createProfileFetchers>;
