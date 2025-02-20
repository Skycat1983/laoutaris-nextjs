import { AccountSettings } from "@/components/sections/AccountSettings";
import { serverApi } from "@/lib/api/server";
import { FrontendUser } from "@/lib/data/types/userTypes";
import React from "react";

export const UserSettingsLoader = async () => {
  const settings: ApiResponse<FrontendUser> =
    await serverApi.user.fetchUserSettings();

  if (!settings.success) {
    throw new Error("Failed to fetch user settings");
  }

  const { data } = settings as ApiSuccessResponse<FrontendUser>;

  return <AccountSettings {...data} />;
};
