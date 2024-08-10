"use client";
import { usePathname } from "next/navigation";

interface NavItemProps {
  label: string;
  slug: string;
  activeClassName: string;
  className: string;
}

const NavItem = ({ label, slug, activeClassName, className }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(slug);

  return (
    <div className={isActive ? activeClassName : className}>
      <h2>{label}</h2>
    </div>
  );
};

export default NavItem;
