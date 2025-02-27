import type { FrontendUser } from "@/lib/data/types/userTypes";
import type { Fetcher } from "../../core/createFetcher";

export const createProfileFetchers = (fetcher: Fetcher) => ({
  // Get user profile
  getProfile: async () => fetcher<FrontendUser>(`/api/v2/user/profile`),

  // Update user profile
  updateProfile: async (data: Partial<FrontendUser>) =>
    fetcher<FrontendUser>(`/api/v2/user/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
});

export type ProfileFetchers = ReturnType<typeof createProfileFetchers>;
