"use server";

import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

interface SubNavBarLink {
  title: string;
  slug: string;
  url: string;
  disabled?: boolean;
}

interface SubNavBarProps {
  links: SubNavBarLink[];
}

const SubNavBar = ({ links }: SubNavBarProps) => {
  console.log("links in Subnavbar :>> ", links);
  return (
    <>
      <div className="relative  flex flex-row w-full justify-center mx-4 ">
        <ScrollArea className="whitespace-nowrap rounded-md h-auto ">
          <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
            {links.map((link, i) => (
              <li key={i}>
                <Link href={link.url}>
                  <NavItem
                    label={link.title}
                    slug={link.slug}
                    className="z-[99] font-face-default subheading-button"
                    activeClassName="z-[99] font-face-default subheading-button-active"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <ScrollBar orientation="horizontal" className="p-0" />
        </ScrollArea>
      </div>
    </>
  );
};

export default SubNavBar;
