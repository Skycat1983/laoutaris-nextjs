"use client";
import { useSelectedLayoutSegments } from "next/navigation";

interface NavItemProps {
  label: string;
  slug: string;
  activeClassName: string;
  className: string;
  disabled?: boolean;
}

const NavItem = ({
  label,
  slug,
  activeClassName,
  className,
  disabled = false,
}: NavItemProps) => {
  const segments = useSelectedLayoutSegments();
  const isActive =
    segments.includes(slug) || segments.includes(label.toLowerCase());

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

export default NavItem;
