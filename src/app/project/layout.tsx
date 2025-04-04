import {
  Subnav,
  SubnavLink,
} from "@/components/modules/navigation/subnav/Subnav";
import { buildUrl } from "@/lib/utils/urlUtils";

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const stem = "project";

  const subNavLinks: SubnavLink[] = [
    {
      label: "About",
      slug: "about",
      link_to: buildUrl([stem, "about"]),
      disabled: false,
    },
    {
      label: "Film",
      slug: "film",
      link_to: buildUrl([stem, "film"]),
      disabled: false,
    },
    {
      label: "FAQ",
      slug: "faq",
      link_to: null,
      disabled: true,
    },
    {
      label: "Contact",
      slug: "contact",
      link_to: buildUrl([stem, "contact"]),
      disabled: false,
    },
  ];

  return (
    <section>
      <Subnav links={subNavLinks} />
      {children}
    </section>
  );
}
