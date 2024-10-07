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
    // <div className="relative  flex flex-row w-full justify-center mx-4 pt-[145px] md:pt-[230px] lg:pt-[150px]">

    <>
      <div className="relative  flex flex-row w-full justify-center mx-4 ">
        <ScrollArea className="whitespace-nowrap rounded-md h-auto ">
          <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
            {links.map((link, i) => (
              <li key={i}>
                <Link href={buildUrl(link, stem)}>
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

      {/* <div className="mt-[130px] sm:mt-[210px] md:mt-[200px] lg:mt-[200px] h-[5px] w-full container"></div> */}
    </>
  );
};

export default Subnav;
