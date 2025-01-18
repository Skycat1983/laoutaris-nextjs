import { UserModel } from "../../models";
import { getServerSession } from "next-auth";
import { type } from "os";
import { createUserFromSession } from "./createUserFromSession";
import { authOptions } from "@/lib/config/authOptions";

type UserIdentifier = string | null;

export const getUserIdFromSession = async (): Promise<UserIdentifier> => {
  const session = await getServerSession(authOptions);

  if (session && session.user && session.user.name) {
    const username = session.user.name;
    const email = session.user.email;
    console.log("session.user", session.user);

    const user = await UserModel.findOne({ username });

    if (user) {
      return user._id.toString();
    } else {
      const userId =
        email && username ? await createUserFromSession(username, email) : null;
      return userId;
    }
  } else {
    return null;
  }
};
