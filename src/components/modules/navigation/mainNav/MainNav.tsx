"use server";

import { MobileNavLayout } from "@/components/modules/navigation/mainNav/MobileNavLayout";
import { TabletNavLayout } from "@/components/modules/navigation/mainNav/TabletNavLayout";
import { DesktopNavLayout } from "@/components/modules/navigation/mainNav/DesktopNavLayout";
import { NavBarLink } from "@/components/loaders/componentLoaders/MainNavLoader";

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
      label: "Biography",
      path: "/biography",
      disabled: true,
    },
    {
      label: "Collections",
      path: "/collections",
      disabled: true,
    },
    {
      label: "Blog",
      path: "/blog",
      disabled: true,
    },
    {
      label: "Project",
      path: "/project",
      disabled: true,
    },
    {
      label: "Shop",
      path: "/shop",
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
