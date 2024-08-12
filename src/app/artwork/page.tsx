import dbConnect from "@/utils/mongodb";
import { getDefaultCollection } from "@/utils/server/getDefaultCollection";
import { getDefaultRedirect } from "../../../unused/getDefaultRedirectUrl";
import { redirect } from "next/navigation";

export default async function Artwork() {
  await dbConnect();
  const defaultRedirect = await getDefaultCollection("artwork");
  if (defaultRedirect) {
    redirect(defaultRedirect.url);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>artwork</h1>
    </main>
  );
}
