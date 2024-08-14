import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { getDefaultBiography } from "@/lib/server/biography/getDefaultBiography";

export default async function Biography() {
  await dbConnect();
  const defaultRedirect = await getDefaultBiography("biography");
  if (defaultRedirect) {
    redirect(defaultRedirect.url);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Biography Section</h1>
    </main>
  );
}
