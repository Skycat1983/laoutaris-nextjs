import { UserModel } from "../data/models";

type UserId = string | null;

export async function createUserFromSession(
  username: string,
  email: string
): Promise<UserId> {
  try {
    const newUser = await new UserModel({ username, email });
    newUser.save();
    return newUser._id.toString();
  } catch (error) {
    return null;
  }
}
