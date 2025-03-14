"use client";
import { SubnavLink } from "@/components/modules/navigation/subnav/Subnav";
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation";

type NavItemProps = SubnavLink & {
  activeClassName: string;
  className: string;
};

const NavItem = ({
  label,
  slug,
  activeClassName,
  className,
  disabled,
}: NavItemProps) => {
  const segments = useSelectedLayoutSegments();
  const searchParams = useSearchParams();

  const currentSortby = searchParams.get("sortby")?.toLowerCase();

  const isActive =
    segments.includes(slug) ||
    segments.includes(label.toLowerCase()) ||
    currentSortby === label.toLowerCase();

  const finalClassName = disabled
    ? `${className} cursor-not-allowed opacity-50`
    : isActive
    ? activeClassName
    : className;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    console.log("clicked");
  };

  return (
    <div
      className={finalClassName}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      <h2>{label}</h2>
    </div>
  );
};

export { NavItem };
