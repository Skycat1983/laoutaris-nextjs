import Link from "next/link";

type Props = {
  label: string;
  link: string;
};

const ButtonDivider = ({ label, link }: Props) => {
  return (
    <div className="relative w-full">
      <div className="absolute mt-7 flex justify-center w-full">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <Link href={link}>
        <button className="relative mx-auto z-1 bg-whitish px-[100px] py-3 border-2 border-black font-archivo font-bold text-xl">
          {label}
        </button>
      </Link>
    </div>
  );
};

export default ButtonDivider;
