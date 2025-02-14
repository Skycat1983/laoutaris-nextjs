"use server";

import NavItem from "@/components/modules/common/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../components/shadcn/scroll-area";
import { delay } from "@/utils/debug";

export interface SubNavBarLink {
  title: string;
  slug: string;
  link_to: string;
  disabled?: boolean;
}

interface SubNavProps {
  fetchLinks: () => Promise<SubNavBarLink[]>;
}

const SubNavBar = async ({ fetchLinks }: SubNavProps) => {
  await delay(1000);
  const links = await fetchLinks();

  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul className="w-max flex flex-row justify-center space-x-8 my-6 md:my-6">
          {links.map((link, i) => (
            <li key={i}>
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
        </ul>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </div>
  );
};

export default SubNavBar;
