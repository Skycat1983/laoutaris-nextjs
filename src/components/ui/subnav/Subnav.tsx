"use server";

import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

interface SubnavProps {
  stem: string;
  links: SubnavLink[];
}

const Subnav = ({ links, stem }: SubnavProps) => {
  const buildUrl = (link: SubnavLink, stem: string) => {
    if (link.defaultRedirect) {
      return `http://localhost:3000/${stem}/${link.slug}/${link.defaultRedirect}`;
    } else {
      return `http://localhost:3000/${stem}/${link.slug}`;
    }
  };
  return (
    <div className="flex flex-row w-full justify-center bg-yellow-100 mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto bg-green-100 ">
        <ul className="w-max flex flex-row justify-center space-x-8 my-10 bg-red-100">
          {links.map((link, i) => (
            <li key={i}>
              <Link href={buildUrl(link, stem)}>
                <NavItem
                  label={link.title}
                  slug={link.slug}
                  className="font-face-default subheading-button"
                  activeClassName="font-face-default subheading-button-active"
                />
              </Link>
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" className="p-12" />
      </ScrollArea>
    </div>
  );
};

export default Subnav;

// const isExtended = (
//   link: SubnavLink | ExtendedSubnavLink
// ): link is ExtendedSubnavLink =>
//   (link as ExtendedSubnavLink).defaultRedirect !== undefined;

// const url = isExtended(links[0]) ? links[0].defaultRedirect : links[0].slug;

// const buildUrl = (link: SubnavLink | ExtendedSubnavLink, stem: string) => {
//     return isExtended(link) ? link.defaultRedirect : link.slug;
// }
