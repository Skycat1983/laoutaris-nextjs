"use client";

import React from "react";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";
import { addArtworkToWatchlist } from "@/lib/server/user/actions/addArtworkToWatchlist";

type WatchlistButtonProps = {
  isWatchlisted: boolean;
  artworkId: string;
  // label: string;
};

const initialState = {
  message: "",
};

const WatchlistButton = ({
  isWatchlisted,
  artworkId,
}: WatchlistButtonProps) => {
  const label = !isWatchlisted ? "Add to watchlist" : "Remove from watchlist";
  const [state, formAction] = useFormState(addArtworkToWatchlist, initialState);
  console.log("state frontend", state);
  return (
    <>
      <form action={formAction} className="w-full">
        {/* <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" required /> */}
        <input type="hidden" name="artworkId" value={artworkId} />
        <SubmitButton
          label={label}
          className="p-2 border border-2 border-black bg-black w-full rounded-full font-subheading text-white font-bold"
        />
        {/* <button
          className="p-2 border border-2 border-black bg-black w-2/3 rounded-full font-subheading text-white font-bold"
          type="submit"
        >
          {label}
        </button> */}
      </form>
    </>
  );
};

export default WatchlistButton;
