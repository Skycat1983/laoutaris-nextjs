import { delay } from "@/utils/debug";
import { ProjectSection } from "@/components/sections/ProjectSection";

export async function ProjectSectionLoader() {
  await delay(1000);
  // simulate fetching projects
  return <ProjectSection />;
}
