import { HomeProjectSection } from "@/components/contentSections/HomeProjectSection";
import { delay } from "@/utils/debug";

export async function HomeProjectSectionLoader() {
  await delay(1000);
  // simulate fetching projects
  return <HomeProjectSection />;
}
