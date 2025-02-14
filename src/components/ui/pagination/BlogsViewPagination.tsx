import Link from "next/link";
import { NavigateNextIcon } from "../../elements/icons/NavigateNextIcon";

interface BlogsViewPaginationProps {
  next: string | null;
  prev: string | null;
}

export const BlogsViewPagination = ({
  next,
  prev,
}: BlogsViewPaginationProps) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-row w-[200px] justify-center items-center gap-5">
        {prev ? (
          <Link href={prev}>
            <div className="text-black rounded-full border border-1 border-black w-12 h-12 flex justify-center items-center hover:bg-gray-200">
              <NavigateNextIcon style={{ transform: "rotate(180deg)" }} />
            </div>
          </Link>
        ) : (
          <div className="bg-gray-300 text-gray-500 rounded-full border border-1 border-gray-500 w-12 h-12 flex justify-center items-center cursor-not-allowed">
            <NavigateNextIcon style={{ transform: "rotate(180deg)" }} />
          </div>
        )}

        {next ? (
          <Link href={next}>
            <div className="text-black rounded-full border border-1 border-black w-12 h-12 flex justify-center items-center hover:bg-gray-200">
              <NavigateNextIcon />
            </div>
          </Link>
        ) : (
          <div className="bg-gray-300 text-gray-500 rounded-full border border-1 border-gray-500 w-12 h-12 flex justify-center items-center cursor-not-allowed">
            <NavigateNextIcon />
          </div>
        )}
      </div>
    </div>
  );
};
