"use client";

import React from "react";
import SubmitButton from "./SubmitButton";
import { useFormState, useFormStatus } from "react-dom";
import { addArtworkToWatchlist } from "@/lib/server/user/actions/addArtworkToWatchlist";
import { updateUserWatchlist } from "@/lib/server/user/actions/updateUserWatchlist";
import { Button } from "@/components/ui/shadcn/button";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

type WatchlistButtonProps = {
  isWatchlisted: boolean;
  artworkId: string;
};

export interface WatchlistButtonState {
  success: boolean;
  message: string;
  isWatchlisted: boolean;
}
const WatchlistButton = ({
  isWatchlisted,
  artworkId,
}: WatchlistButtonProps) => {
  const initialState: WatchlistButtonState = {
    success: false,
    isWatchlisted: isWatchlisted,
    message: "",
  };
  const pathname = usePathname();
  console.log("pathname :>> ", pathname);
  // ? unable to use this hook for some reason
  // const segments = useSelectedLayoutSegments();
  // console.log("segments :>> ", segments);

  const [state, formAction] = useFormState(updateUserWatchlist, initialState);

  // Update the label based on the current state
  const label = !state.isWatchlisted
    ? "Add to watchlist"
    : "Remove from watchlist";

  console.log("artworkId :>> ", artworkId);
  console.log("state frontend", state);

  return (
    <>
      <form action={formAction} className="w-full">
        <input type="hidden" name="pathToRevalidate" value={pathname} />

        <input type="hidden" name="artworkId" value={artworkId} />
        <SubmitButton label={label} />
      </form>
    </>
  );
};

export default WatchlistButton;

{
  /* <Button shape={"rounded"}>Button</Button>
<Button shape={"rounded"} variant={"outline"}>
  Button
</Button> */
}
