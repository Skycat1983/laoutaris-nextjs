import { delay } from "@/lib/utils/debug";
import { ProjectSection } from "@/components/sections/ProjectSection";

export async function ProjectSectionLoader() {
  // simulate fetching projects
  return <ProjectSection />;
}
