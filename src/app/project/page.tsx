import { redirect } from "next/navigation";

export default function Project() {
  redirect(`${process.env.NEXTAUTH_URL}/project/about`);
  // return (
  //   <main className="flex  flex-col items-start justify-between px-24">
  //     {/*  */}
  //   </main>
  // );
}
