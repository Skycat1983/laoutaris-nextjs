import { UserExtended, UserLean } from "@/lib/data/types";

export const extendUser = (userLean: UserLean): UserExtended => {
  return { ...userLean };
};
