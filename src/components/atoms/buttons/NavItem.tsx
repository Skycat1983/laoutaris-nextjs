"use client";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

interface NavItemProps {
  label: string;
  slug: string;
  activeClassName: string;
  className: string;
}

const NavItem = ({ label, slug, activeClassName, className }: NavItemProps) => {
  const segments = useSelectedLayoutSegments();
  const isActive = segments.includes(slug);

  return (
    <div
      className={isActive ? activeClassName : className}
      onClick={() => {
        console.log("clicked");
      }}
    >
      <h2>{label}</h2>
    </div>
  );
};

export default NavItem;
