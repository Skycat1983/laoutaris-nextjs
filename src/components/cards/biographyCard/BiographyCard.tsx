import Link from "next/link";

type Props = {
  entry: {
    url: string;
    title: string;
    subheading: string;
    to: string;
  };
};

const BiographyCard = ({ entry }: Props) => {
  return (
    <Link href={entry.to}>
      <div
        className="grid grid-cols-1 h-full"
        style={{ gridTemplateRows: "120% 25%" }}
      >
        <div className="flex">
          <img
            src={entry.url}
            alt={entry.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* <div className="flex flex-col gap-8 p-4 py-8">
          <h1 className="font-archivo text-2xl font-bold">{entry.title}</h1>
          <h2 className="font-archivo text-xl font-normal text-gray-500">
            {entry.subheading}
          </h2>
        </div> */}
      </div>
    </Link>
  );
};

export default BiographyCard;
