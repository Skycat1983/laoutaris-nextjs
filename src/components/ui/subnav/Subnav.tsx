import NavItem from "@/components/atoms/buttons/NavItem";
import SubnavButton from "@/components/atoms/buttons/SubnavButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface SubnavProps {
  stem: string;
  items: { title: string; slug: string }[];
}

const Subnav = ({ items, stem }: SubnavProps) => {
  return (
    <ul className="w-full flex flex-row justify-center space-x-8 my-8">
      {items.map((post, i) => (
        <li key={i}>
          <Link href={`/${stem}/${post.slug}`}>
            {/* <SubnavButton title={post.title} slug={post.slug} /> */}
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
  );
};

export default Subnav;
