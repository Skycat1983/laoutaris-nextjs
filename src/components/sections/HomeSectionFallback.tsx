import { SectionLayout } from "@/components/layouts/public/SectionLayout";

interface HomeSectionFallbackProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonLink: string;
  title: string;
  message: string;
  testId?: string;
}

export const HomeSectionFallback = ({
  heading,
  subheading,
  buttonLabel,
  buttonLink,
  title,
  message,
  testId,
}: HomeSectionFallbackProps) => {
  return (
    <SectionLayout
      heading={heading}
      subheading={subheading}
      buttonLabel={buttonLabel}
      buttonLink={buttonLink}
    >
      <div
        role="status"
        aria-live="polite"
        data-testid={testId}
        className="mx-4 my-8 rounded-md border border-gray-300 bg-whitish px-6 py-10 text-center"
      >
        <p className="font-archivo text-xl font-bold text-slate">{title}</p>
        <p className="mx-auto mt-3 max-w-2xl font-archivo text-base text-gray-600">
          {message}
        </p>
      </div>
    </SectionLayout>
  );
};
