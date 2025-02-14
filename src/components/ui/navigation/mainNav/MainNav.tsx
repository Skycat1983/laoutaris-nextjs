"use server";

import { MobileNavLayout } from "@/components/ui/navigation/mainNav/MobileNavLayout";
import { TabletNavLayout } from "@/components/ui/navigation/mainNav/TabletNavLayout";
import { DesktopNavLayout } from "@/components/ui/navigation/mainNav/DesktopNavLayout";
import { NavBarLink } from "@/components/loaders/componentLoaders/MainNavLoader";

export async function MainNav({ navLinks }: { navLinks: NavBarLink[] }) {
  console.log("navLinks", navLinks);
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
