import { AccountSettings } from "@/components/sections/AccountSettings";
import { serverApi } from "@/lib/api/serverApi";
import { ApiProfileResult } from "@/lib/api/user/profile/fetchers";
import { ApiErrorResponse } from "@/lib/data/types";
import React from "react";

type Response = ApiProfileResult | ApiErrorResponse;

export const UserSettingsLoader = async () => {
  const result = await serverApi.user.profile.get();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch user settings");
  }

  const { data } = result as ApiProfileResult;

  return <AccountSettings {...data} />;
};
