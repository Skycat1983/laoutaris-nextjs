import { UserExtended, UserSanitized } from "@/lib/data/types";

export const sanitizeUser = (user: UserExtended): UserSanitized => {
  return {
    // _id: user._id,
    username: user.username,
    role: user.role,
    // email: user.email,
    // password: user.password,
  };
};
