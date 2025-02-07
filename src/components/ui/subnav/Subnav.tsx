import Link from "next/link";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";
import NavItem from "../common/buttons/NavItem";

interface SubnavProps {
  links: ReadonlyArray<{
    title: string;
    slug: string;
    link_to: string;
    disabled?: boolean;
  }>;
}

export function Subnav({ links }: SubnavProps) {
  console.log("links", links);
  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul className="w-max flex flex-row justify-center space-x-8 my-6 md:my-6">
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
        </ul>
        <ScrollBar orientation="horizontal" className="p-0" />
      </ScrollArea>
    </div>
  );
}
