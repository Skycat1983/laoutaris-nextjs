import { HomeProjectSection } from "@/components/sections/ProjectSection";
import { delay } from "@/utils/debug";

export async function ProjectSectionLoader() {
  await delay(1000);
  // simulate fetching projects
  return <HomeProjectSection />;
}
