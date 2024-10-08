import { redirect } from "next/navigation";

export default function Account() {
  redirect("http://localhost:3000/account/dashboard");

  // return (
  //   <main className="flex min-h-screen max-w-full flex-col items-center justify-start"></main>
  // );
}
