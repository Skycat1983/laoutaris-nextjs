import { ObjectId } from "mongoose";
import { UserFrontend } from "../data/types";

type IsUserInArrayInput = {
  array: (string | ObjectId)[];
  userId: string | null | undefined;
};

const isUserInArray = ({ array, userId }: IsUserInArrayInput): boolean => {
  if (!userId || !array) return false;
  return array.some((id) => id.toString() === userId);
};

const isFrontendUser = (
  author: string | UserFrontend
): author is UserFrontend => {
  return typeof author !== "string" && "_id" in author;
};

export { isUserInArray, isFrontendUser };
export type { IsUserInArrayInput };
