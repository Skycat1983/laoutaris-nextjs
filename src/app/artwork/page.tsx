import dbConnect from "@/utils/mongodb";
import { getDefaultRedirect } from "@/utils/server/getDefaultRedirectUrl";
import { redirect } from "next/navigation";

export default async function Artwork() {
  await dbConnect();
  const defaultRedirect = await getDefaultRedirect("artwork");
  if (defaultRedirect) {
    redirect(defaultRedirect.url);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>artwork</h1>
    </main>
  );
}
