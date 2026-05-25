import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { MainNavRouteSwitch } from "@/components/modules/navigation/mainNav/MainNavRouteSwitch";
import { PrototypeMainNav } from "@/components/modules/navigation/prototypeMainNav/PrototypeMainNav";
import { getMainNavLinks } from "@/components/loaders/componentLoaders/MainNavLoader";

export async function HeaderMainNavLoader() {
  const navLinks = await getMainNavLinks();

  return (
    <MainNavRouteSwitch
      defaultNav={<MainNav navLinks={navLinks} />}
      prototypeHomeNav={<PrototypeMainNav navLinks={navLinks} />}
    />
  );
}
