import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";

export default async function Blog() {
  await dbConnect();
  redirect("blog/latest");
}
