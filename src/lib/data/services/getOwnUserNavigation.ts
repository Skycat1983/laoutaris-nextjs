import "server-only";

import { UserModel } from "@/lib/data/models/userModel";
import type {
  OwnUserNavDataFrontend,
  OwnUserSelectFieldsLean,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";

export type OwnUserNavigationServiceResult =
  | OwnUserNavDataFrontend
  | null;

export const getOwnUserNavigation = async (
  userId: string
): Promise<OwnUserNavigationServiceResult> => {
  await dbConnect();

  const leanUserData = await UserModel.findById(userId)
    .select("favourites watchlist comments")
    .lean<OwnUserSelectFieldsLean>();

  if (!leanUserData) {
    return null;
  }

  return transformAccountNav.toFrontend(leanUserData);
};
