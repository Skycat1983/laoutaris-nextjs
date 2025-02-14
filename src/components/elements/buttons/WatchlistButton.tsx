"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateUserWatchlist } from "@/lib/server/user/actions/updateUserWatchlist";
import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "../ModalMessage";
import SubmitButton from "./SubmitButton";

type WatchlistButtonProps = {
  isLoggedIn: boolean;
  isWatchlisted: boolean;
  artworkId: string;
};

export interface WatchlistButtonState {
  success: boolean;
  message: string;
  isWatchlisted: boolean;
}
const WatchlistButton = ({
  isLoggedIn,
  isWatchlisted,
  artworkId,
}: WatchlistButtonProps) => {
  const initialState: WatchlistButtonState = {
    success: false,
    isWatchlisted: isWatchlisted,
    message: "",
  };

  const { openModal } = useGlobalFeatures();

  const [state, formAction] = useFormState(updateUserWatchlist, initialState);

  const handleUnauthenticatedAction = () => {
    openModal(<ModalMessage message="You need to be logged in to do this" />);
  };

  const label = !state.isWatchlisted ? "Watchlist" : "Unwatch";

  if (isLoggedIn) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <form action={formAction} className="w-full">
                <input type="hidden" name="artworkId" value={artworkId} />
                <SubmitButton label={label} />
              </form>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {state.isWatchlisted
                  ? "Remove this item from your watchlist"
                  : "Add this item to your watchlist"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="w-full"
              onClick={() => {
                handleUnauthenticatedAction();
              }}
            >
              <input type="hidden" name="artworkId" value={artworkId} />
              <SubmitButton label={label} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isWatchlisted
                ? "Remove this item from your watchlist"
                : "Add this item to your watchlist"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default WatchlistButton;

// interface SubmitButtonProps {
//   label: string;
// }

// function SubmitButton({ label }: SubmitButtonProps) {
//   const { pending } = useFormStatus();
//   return (
//     <Button
//       shape={"rounded"}
//       // variant={"outline"}
//       size={"full"}
//       disabled={pending}
//     >
//       {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//       {pending ? "Loading..." : label}
//     </Button>
//   );
// }
