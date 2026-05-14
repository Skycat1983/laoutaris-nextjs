"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";

type UserIdentifier = string | null;

export const getUserIdFromSession = async (): Promise<UserIdentifier> => {
  const session = await getServerSession(authOptions);

  return session?.user?.id ?? null;
};
