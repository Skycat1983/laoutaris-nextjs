import { redirect } from "next/navigation";

export default function Project() {
  const baseUrl = process.env.VERCEL_URL || "http://localhost:3000";
  redirect(`${baseUrl}/project/about`);
  // return (
  //   <main className="flex  flex-col items-start justify-between px-24">
  //     {/*  */}
  //   </main>
  // );
}
