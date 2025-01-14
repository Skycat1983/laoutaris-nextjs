"use server";

import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../components/ui/shadcn/scroll-area";

type FetchFunction<T> = (
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
) => Promise<ApiResponse<T[]>>;

interface SubNavBarLink {
  title: string;
  slug: string;
  url: string;
  disabled?: boolean;
}

interface SubNavBarProps<T extends SubNavBarLink> {
  fetcher: FetchFunction<T>;
  identifierKey: string;
  identifierValue: string;
  fields?: string[];
  linkResolver: (item: T) => SubNavBarLink;
}

const SubNav = async <T extends SubNavBarLink>({
  fetcher,
  identifierKey,
  identifierValue,
  fields,
  linkResolver,
}: SubNavBarProps<T>) => {
  const response = await fetcher(identifierKey, identifierValue, fields);

  if (!response.success) {
    return <p>{response.message}</p>;
  }

  const links = response.data.map(linkResolver);

  return (
    <div className="relative flex flex-row w-full justify-center mx-4">
      <ScrollArea className="whitespace-nowrap rounded-md h-auto">
        <ul className="w-max flex flex-row justify-center space-x-8 my-4 md:my-10">
          {links.map((link, i) => (
            <li key={i}>
              {link.disabled ? (
                <NavItem
                  label={link.title}
                  slug={link.slug}
                  disabled={true}
                  className="z-[99] font-face-default subheading-button disabled"
                  activeClassName="z-[99] font-face-default subheading-button-active disabled-active"
                />
              ) : (
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

// const links: SubNavBarLink[] = response.data.map((item) => ({
//   title: item.title,
//   slug: item.slug,
//   url: buildUrl(["collections", item.slug]),
// }));
