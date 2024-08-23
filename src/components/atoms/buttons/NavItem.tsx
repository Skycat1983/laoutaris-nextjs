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
  console.log("segments :>> ", segments);
  console.log("slug :>> ", slug);
  console.log("label :>> ", label);
  const isActive =
    segments.includes(slug) || segments.includes(label.toLowerCase());

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
