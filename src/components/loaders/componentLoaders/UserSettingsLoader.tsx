import { AccountSettings } from "@/components/sections/AccountSettings";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { FrontendUser } from "@/lib/data/types/userTypes";
import React from "react";

export const UserSettingsLoader = async () => {
  const settings: ApiResponse<FrontendUser> =
    await serverPublicApi.user.fetchUserSettings();

  if (!settings.success) {
    throw new Error("Failed to fetch user settings");
  }

  const { data } = settings as ApiSuccessResponse<FrontendUser>;

  return <AccountSettings {...data} />;
};
