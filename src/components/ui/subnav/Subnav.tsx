import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import NavItem from "../common/buttons/NavItem";
import { Skeleton } from "../shadcn/skeleton";
import { ReactNode } from "react";

// --- Subnav Wrapper Component ---

interface SubnavWrapperProps {
  children: ReactNode;
  listClasses?: string;
}

export function SubnavWrapper({
  children,
  listClasses = "my-6 md:my-6",
}: SubnavWrapperProps) {
  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul
          className={`w-max flex flex-row justify-center space-x-8 ${listClasses}`}
        >
          {children}
        </ul>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </div>
  );
}

// --- Main Subnav Component ---

interface SubnavProps {
  links: ReadonlyArray<{
    title: string;
    slug: string;
    link_to: string;
    disabled?: boolean;
  }>;
}

export function Subnav({ links }: SubnavProps) {
  return (
    <SubnavWrapper>
      {links.map((link) => (
        <li key={link.slug}>
          <Link href={link.link_to}>
            <NavItem
              label={link.title}
              slug={link.slug}
              disabled={link.disabled}
              className="z-[99] font-face-default subheading-button"
              activeClassName="z-[99] font-face-default subheading-button-active"
            />
          </Link>
        </li>
      ))}
    </SubnavWrapper>
  );
}

// --- Skeleton Variant for Loading States ---

interface SubNavSkeletonProps {
  count?: number;
}

export const SubNavSkeleton = ({ count = 5 }: SubNavSkeletonProps) => {
  const skeletonClassName = "z-[99] w-36 h-14";

  return (
    <SubnavWrapper listClasses="my-4 md:my-10">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <Skeleton className={skeletonClassName} />
        </li>
      ))}
    </SubnavWrapper>
  );
};

// export function Subnav({ links }: SubnavProps) {
//   console.log("links", links);
//   return (
//     <div className="relative flex flex-row w-full justify-center mx-4">
//       <ScrollArea className="whitespace-nowrap rounded-md h-auto">
//         <ul className="w-max flex flex-row justify-center space-x-8 my-6 md:my-6">
//           {links.map((link) => (
//             <li key={link.slug}>
//               <Link href={link.link_to}>
//                 <NavItem
//                   label={link.title}
//                   slug={link.slug}
//                   disabled={link.disabled}
//                   className="z-[99] font-face-default subheading-button"
//                   activeClassName="z-[99] font-face-default subheading-button-active"
//                 />
//               </Link>
//             </li>
//           ))}
//         </ul>
//         <ScrollBar orientation="horizontal" className="p-0" />
//       </ScrollArea>
//     </div>
//   );
// }

// export const SubNavSkeleton = ({ count = 5 }: { count: number }) => {
//   const skeletonClassName = "z-[99] w-36 h-14";

//   return (
//     <div className="relative flex flex-row w-full justify-center mx-4">
//       <ScrollArea className="whitespace-nowrap rounded-md h-auto">
//         <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
//           {Array.from({ length: count }).map((_, index) => (
//             <li key={index}>
//               <Skeleton className={skeletonClassName} />
//             </li>
//           ))}
//         </ul>
//         <ScrollBar orientation="horizontal" className="p-0" />
//       </ScrollArea>
//     </div>
//   );
// };
