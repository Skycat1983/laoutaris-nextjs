import "server-only";

import { UserModel } from "@/lib/data/models/userModel";
import type { OwnUserFrontend, OwnUserLean } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformOwnUser } from "@/lib/transforms";

export type OwnUserProfileServiceResult = OwnUserFrontend | null;

export const getOwnUserProfile = async (
  userId: string
): Promise<OwnUserProfileServiceResult> => {
  await dbConnect();

  const user = await UserModel.findById(userId)
    .select("-password")
    .lean<OwnUserLean>();

  if (!user) {
    return null;
  }

  return transformOwnUser.toFrontend(user, userId);
};
