import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";
import { PrototypeMainNav } from "@/components/modules/navigation/prototypeMainNav/PrototypeMainNav";
import { publicAppRoutes } from "@/lib/routes/publicAppRoutes";

export async function MainNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return <PrototypeMainNav navLinks={navLinks} />;
}

export const MainNavSkeleton = () => {
  const allLinksDisabled = [
    {
      label: "Artwork",
      path: publicAppRoutes.artwork,
      disabled: true,
    },
    {
      label: "Biography",
      path: publicAppRoutes.biography,
      disabled: true,
    },
    {
      label: "Collections",
      path: publicAppRoutes.collections,
      disabled: true,
    },
    {
      label: "Blog",
      path: publicAppRoutes.blog,
      disabled: true,
    },
    {
      label: "Project",
      path: publicAppRoutes.project,
      disabled: true,
    },
    {
      label: "Shop",
      path: publicAppRoutes.shop,
      disabled: true,
    },
  ];

  return <PrototypeMainNav navLinks={allLinksDisabled} />;
};
