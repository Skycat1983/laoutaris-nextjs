import NavItem from "@/components/atoms/buttons/NavItem";
import Link from "next/link";

interface SubnavProps {
  stem: string;
  items: { title: string; slug: string }[];
}

const Subnav = ({ items, stem }: SubnavProps) => {
  return (
    <ul className="w-full flex flex-row justify-center space-x-8 my-10">
      {items.map((post, i) => (
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
  );
};

export default Subnav;
