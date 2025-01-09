"use server";

import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import { buildUrl } from "@/utils/buildUrl";

interface SubNavBarLink {
  title: string;
  slug: string;
  url: string;
  disabled?: boolean;
}

type FetchFunction<T> = (
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
) => Promise<ApiResponse<T[]>>;

interface SubNavBarProps<T> {
  fetcher: FetchFunction<T>;
  identifierKey: string;
  identifierValue: string;
  fields?: string[];
}

// subnav component. receives a fetchFunction as prop. this fetchFunction takes identifier key (string), idenfifier value (string), and fields (string[]) as arguments and returns a promise of type T.

const SubNav = async <T extends SubNavBarLink>({
  fetcher,
  identifierKey,
  identifierValue,
  fields,
}: SubNavBarProps<T>) => {
  const response = await fetcher(identifierKey, identifierValue, fields);

  if (!response.success) {
    return <p>{response.message}</p>;
  }

  const links: SubNavBarLink[] = response.data.map((item) => ({
    title: item.title,
    slug: item.slug,
    url: buildUrl(["collections", item.slug]), // Adjust `buildUrl` logic as needed.
  }));
  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
          {links.map((link, i) => (
            <li key={i}>
              {link.disabled ? (
                // Render NavItem without Link when disabled
                <NavItem
                  label={link.title}
                  slug={link.slug}
                  disabled={true}
                  className="z-[99] font-face-default subheading-button disabled"
                  activeClassName="z-[99] font-face-default subheading-button-active disabled-active"
                />
              ) : (
                // Render NavItem wrapped with Link when not disabled
                <Link href={link.url}>
                  <NavItem
                    label={link.title}
                    slug={link.slug}
                    disabled={false}
                    className="z-[99] font-face-default subheading-button"
                    activeClassName="z-[99] font-face-default subheading-button-active"
                  />
                </Link>
              )}
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </div>
  );
};

export default SubNav;

// "use server";

// import NavItem from "@/components/atoms/buttons/NavItem";
// import Link from "next/link";
// import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

// interface SubnavProps {
//   stem: string;
//   links: SubnavLink[];
// }

// const Subnav = ({ links, stem }: SubnavProps) => {
//   const buildUrl = (link: SubnavLink, stem: string) => {
//     return `http://localhost:3000/${stem}/${link.slug}`;
//   };

//   console.log("links in Subnav :>> ", links);
//   return (
//     <>
//       <div className="relative  flex flex-row w-full justify-center mx-4 ">
//         <ScrollArea className="whitespace-nowrap rounded-md h-auto ">
//           <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
//             {links.map((link, i) => (
//               <li key={i}>
//                 <Link href={buildUrl(link, stem)}>
//                   <NavItem
//                     label={link.title}
//                     slug={link.slug}
//                     className="z-[99] font-face-default subheading-button"
//                     activeClassName="z-[99] font-face-default subheading-button-active"
//                   />
//                 </Link>
//               </li>
//             ))}
//           </ul>
//           <ScrollBar orientation="horizontal" className="p-0" />
//         </ScrollArea>
//       </div>
//     </>
//   );
// };

// export default Subnav;
