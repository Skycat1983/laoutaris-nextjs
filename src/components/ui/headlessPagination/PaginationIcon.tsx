type PaginationIconProps = {
  isActive: boolean;
  onClick: () => void;
};

type Props = {
  children: React.ReactNode;
};

const PaginationIconsContainer = ({ children }: Props) => {
  return (
    <div className="flex flex-row gap-4 items-center justify-center mt-8">
      {children}
    </div>
  );
};

const PaginationIcon = ({ isActive = false, onClick }: PaginationIconProps) => {
  if (isActive) {
    return (
      <div
        className={`bg-gray-300 w-[12px] h-[12px] rounded-full`}
        onClick={onClick}
      ></div>
    );
  }

  return (
    <div
      className={`outline outline-gray-300 bg-white w-[10px] h-[10px] rounded-full cursor-pointer`}
      onClick={onClick}
    ></div>
  );
};

export { PaginationIcon, PaginationIconsContainer };
