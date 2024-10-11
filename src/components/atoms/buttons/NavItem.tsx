"use client";
import { useSelectedLayoutSegments } from "next/navigation";

interface NavItemProps {
  label: string;
  slug: string;
  activeClassName: string;
  className: string;
  disabled?: boolean; // Added disabled prop
}

const NavItem = ({
  label,
  slug,
  activeClassName,
  className,
  disabled = false, // Default to false
}: NavItemProps) => {
  const segments = useSelectedLayoutSegments();
  const isActive =
    segments.includes(slug) || segments.includes(label.toLowerCase());

  // Determine the final className based on active and disabled states
  const finalClassName = disabled
    ? `${className} cursor-not-allowed opacity-50` // Styles for disabled state
    : isActive
    ? activeClassName
    : className;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault(); // Prevent any default action
      return;
    }
    console.log("clicked");
    // Add any additional click handling if necessary
  };

  return (
    <div
      className={finalClassName}
      onClick={handleClick}
      aria-disabled={disabled} // Accessibility attribute
    >
      <h2>{label}</h2>
    </div>
  );
};

export default NavItem;

// interface NavItemProps {
//   label: string;
//   slug: string;
//   activeClassName: string;
//   className: string;
// }

// const NavItem = ({ label, slug, activeClassName, className }: NavItemProps) => {
//   const segments = useSelectedLayoutSegments();
//   const isActive =
//     segments.includes(slug) || segments.includes(label.toLowerCase());

//   return (
//     <div
//       className={isActive ? activeClassName : className}
//       onClick={() => {
//         console.log("clicked");
//       }}
//     >
//       <h2>{label}</h2>
//     </div>
//   );
// };

// export default NavItem;
