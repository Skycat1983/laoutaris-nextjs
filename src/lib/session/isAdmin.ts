import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { UserModel } from "../data/models";

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return false;
  }
  if (session.user.role !== "admin") {
    return false;
  }
  const user = await UserModel.findById(session.user.id);
  return user?.role === "admin";
}
