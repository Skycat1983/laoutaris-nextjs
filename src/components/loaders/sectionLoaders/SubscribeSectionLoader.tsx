import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { SubscribeSection } from "../../sections/SubscribeSection";

export async function SubscribeSectionLoader() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  const userName = session?.user?.name || null;

  console.log("session in SubscribeSectionLoader", session);

  return (
    <>
      <SubscribeSection isLoggedIn={isLoggedIn} userName={userName} />
    </>
  );
}
