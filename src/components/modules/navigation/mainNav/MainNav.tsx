import { MobileNavLayout } from "@/components/modules/navigation/mainNav/MobileNavLayout";
import { TabletNavLayout } from "@/components/modules/navigation/mainNav/TabletNavLayout";
import { DesktopNavLayout } from "@/components/modules/navigation/mainNav/DesktopNavLayout";
import type { NavBarLink } from "@/components/modules/navigation/mainNav/types";
import { publicAppRoutes } from "@/lib/routes/publicAppRoutes";

export async function MainNav({ navLinks }: { navLinks: NavBarLink[] }) {
  return (
    <nav className="">
      <div className="block sm:hidden">
        <MobileNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout navLinks={navLinks} />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout navLinks={navLinks} />
      </div>
    </nav>
  );
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

  return (
    <nav className="">
      <div className="block sm:hidden">
        <MobileNavLayout navLinks={allLinksDisabled} />
      </div>
      <div className="hidden sm:block lg:hidden">
        <TabletNavLayout navLinks={allLinksDisabled} />
      </div>
      <div className="hidden lg:block">
        <DesktopNavLayout navLinks={allLinksDisabled} />
      </div>
    </nav>
  );
};
