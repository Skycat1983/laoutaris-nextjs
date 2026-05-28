import { MainNav } from "@/components/modules/navigation/mainNav/MainNav";
import { getMainNavLinks } from "@/components/loaders/componentLoaders/MainNavLoader";

export function HeaderMainNavLoader() {
  const navLinks = getMainNavLinks();

  return <MainNav navLinks={navLinks} />;
}
