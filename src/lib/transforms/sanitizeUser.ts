import { UserLean, UserSanitized } from "@/lib/data/types";

export const sanitizeUser = (user: UserLean): UserSanitized => {
  return {
    _id: user._id,
    username: user.username,
    role: user.role,
    // email: user.email,
    // password: user.password,
  };
};
