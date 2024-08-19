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

  // const pathname = usePathname();
  const pathSegments = slug.split("/");
  // const isActive = pathSegments.includes(slug);

  console.log("segments", segments);
  console.log("slug", slug);
  // console.log("slug", slug);
  const isActive = segments.includes(slug);

  return (
    <div className={isActive ? activeClassName : className}>
      <h2>{label}</h2>
    </div>
  );
};

export default NavItem;
