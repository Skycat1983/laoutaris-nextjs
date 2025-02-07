"use client";
import { cloudinaryLoader } from "next-cloudinary";
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const currentSortby = searchParams.get("sortby")?.toLowerCase();

  const isActive =
    segments.includes(slug) ||
    segments.includes(label.toLowerCase()) ||
    currentSortby === label.toLowerCase();

  // console.log("segments", segments);
  // console.log("currentSortby", currentSortby);
  // console.log("label", label.toLowerCase());
  // console.log("isActive", isActive);

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
