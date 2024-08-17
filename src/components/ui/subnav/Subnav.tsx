"use server";

import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

interface SubnavProps {
  stem: string;
  links: SubnavLink[];
}

const Subnav = ({ links, stem }: SubnavProps) => {
  return (
    <div className="flex flex-row w-full justify-center bg-yellow-100 mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto bg-green-100 ">
        <ul className="w-max flex flex-row justify-center space-x-8 my-10 bg-red-100">
          {links.map((post, i) => (
            <li key={i}>
              <Link href={`/${stem}/${post.slug}`}>
                <NavItem
                  label={post.title}
                  slug={post.slug}
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
