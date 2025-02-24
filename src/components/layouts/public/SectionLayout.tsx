import { ReactNode } from "react";
import ButtonDivider from "@/components/elements/misc/ButtonDivider";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { HomepageSectionHeading } from "@/components/elements/typography/HomepageSectionHeading";

interface HomeSectionProps {
  heading: string;
  subheading: string;
  children: ReactNode;
  buttonLabel: string;
  buttonLink: string;
}

export const SectionLayout = ({
  heading,
  subheading,
  children,
  buttonLabel,
  buttonLink,
}: HomeSectionProps) => {
  return (
    <div>
      <HomepageSectionHeading heading={heading} subheading={subheading} />
      <HorizontalDivider />

      {children}

      <ButtonDivider label={buttonLabel} link={buttonLink} />
    </div>
  );
};
