import { ObjectId } from "mongoose";

type IsUserInArrayInput = {
  array: (string | ObjectId)[];
  userId: string | null | undefined;
};

const isUserInArray = ({ array, userId }: IsUserInArrayInput): boolean => {
  if (!userId || !array) return false;
  return array.some((id) => id.toString() === userId);
};

export { isUserInArray };
export type { IsUserInArrayInput };
