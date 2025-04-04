import { delay } from "@/lib/utils/debugUtils";
import { ProjectSection } from "@/components/sections/ProjectSection";

export async function ProjectSectionLoader() {
  // simulate fetching projects
  return <ProjectSection />;
}
