import { AccountSettings } from "@/components/sections/AccountSettings";
import { fetchUserSettings } from "@/lib/api/public/userApi";
import React from "react";

type Props = {};

export const UserSettingsLoader = async () => {
  const settings = await fetchUserSettings();
  if (!settings.success) {
    throw new Error("Failed to fetch user settings");
  }
  const { data } = settings;
  console.log("settings", settings);
  return <AccountSettings {...data} />;
};
