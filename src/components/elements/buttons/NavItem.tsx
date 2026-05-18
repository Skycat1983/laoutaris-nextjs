"use client";
import { Suspense } from "react";
import { useSelectedLayoutSegments, useSearchParams } from "next/navigation";

// Base props that both nav types share
type BaseNavItemProps = {
  label: string;
  slug: string;
  activeClassName: string;
  className: string;
  disabled?: boolean;
  link_to?: string | null;
};

const NavItemFallback = ({
  label,
  className,
  disabled = false,
}: Pick<BaseNavItemProps, "label" | "className" | "disabled">) => {
  const finalClassName = disabled
    ? `${className} cursor-not-allowed opacity-50`
    : className;

  return (
    <div className={finalClassName} aria-disabled={disabled}>
      <h2>{label}</h2>
    </div>
  );
};

const NavItemContent = ({
  label,
  slug,
  activeClassName,
  className,
  disabled = false,
  link_to,
}: BaseNavItemProps) => {
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

const NavItem = (props: BaseNavItemProps) => {
  return (
    <Suspense
      fallback={
        <NavItemFallback
          label={props.label}
          className={props.className}
          disabled={props.disabled}
        />
      }
    >
      <NavItemContent {...props} />
    </Suspense>
  );
};

export { NavItem };
