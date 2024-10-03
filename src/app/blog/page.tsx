import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";

export default async function Blog() {
  await dbConnect();
  redirect("blog/latest");
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <h1>blog</h1>
  //   </main>
  // );
}
