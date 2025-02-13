import HomeSubscribeSection from "@/components/contentSections/HomeSubscribeSection";
import { authOptions } from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";

export async function HomeSubscribeSectionLoader() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  return <HomeSubscribeSection isLoggedIn={isLoggedIn} />;
}
