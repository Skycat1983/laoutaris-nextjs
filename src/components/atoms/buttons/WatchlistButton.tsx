import React from "react";

type Props = {
  label: string;
};

const WatchlistButton = ({ label }: Props) => {
  return (
    <button
      className="p-2 border border-2 border-black bg-black w-2/3 rounded-full font-subheading text-white font-bold"
      onClick={() => {
        //   handleWatchlist();
      }}
    >
      {label}
    </button>
  );
};

export default WatchlistButton;
