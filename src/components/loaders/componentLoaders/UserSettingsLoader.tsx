import { AccountSettings } from "@/components/sections/AccountSettings";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import React from "react";

export const UserSettingsLoader = async () => {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let data: Awaited<ReturnType<typeof getOwnUserProfile>>;

  try {
    data = await getOwnUserProfile(userId);
  } catch {
    throw new Error("Failed to fetch user settings");
  }

  if (!data) {
    throw new Error("User not found");
  }

  return <AccountSettings {...data} />;
};
