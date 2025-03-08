import { ObjectId } from "mongoose";

export const isUserInArray = (
  array: (string | ObjectId)[],
  userId: string | null
): boolean => {
  if (!userId || !array) return false;
  return array.some((id) => id.toString() === userId);
};
