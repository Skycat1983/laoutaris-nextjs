"use client";

import React from "react";
import { useFormState } from "react-dom";
import { updateUserWatchlist } from "@/lib/actions/updateUserWatchlist";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { SubmitButton } from "./SubmitButton";
import ModalMessage from "@/components/elements/typography/ModalMessage";

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
              <SubmitButton label={label} size={"full"} />
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

export { WatchlistButton };

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
