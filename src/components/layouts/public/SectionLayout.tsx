import { ReactNode } from "react";
import ButtonDivider from "@/components/ui/common/ButtonDivider";
import HorizontalDivider from "@/components/ui/common/HorizontalDivider";
import SectionHeading from "@/components/ui/common/SectionHeading";

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
      <SectionHeading heading={heading} subheading={subheading} />
      <HorizontalDivider />

      {children}

      <ButtonDivider label={buttonLabel} link={buttonLink} />
    </div>
  );
};
