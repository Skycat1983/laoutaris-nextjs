type Props = {
  heading: string;
  subheading: string;
};

const SectionHeading = ({ heading, subheading }: Props) => {
  return (
    <>
      <div className="w-full px-4">
        <h1 className="text-4xl font-bold text-left font-archivo font-normal py-4">
          {heading}{" "}
          <span className="text-gray-400 block sm:inline">{subheading}</span>
        </h1>
      </div>
    </>
  );
};

export default SectionHeading;
