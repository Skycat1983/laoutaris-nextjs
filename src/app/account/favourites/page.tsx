import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserModel } from "@/lib/server/models";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Favourites() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!!session && session.user && session.user.email) {
    const user = await UserModel.findOne({ email: session.user.email })
      .populate("favourites")
      .lean();
    console.log("user", user);
  } else {
    redirect("http://localhost:3000");
  }
  return (
    <main className="flex min-h-screen max-w-full flex-col items-center justify-start"></main>
  );
}
