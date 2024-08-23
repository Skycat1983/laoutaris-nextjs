"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateUserWatchlist } from "@/lib/server/user/actions/updateUserWatchlist";
import { Button } from "@/components/ui/shadcn/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubmitButtonProps {
  label: string;
}

function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      shape={"rounded"}
      // variant={"outline"}
      size={"full"}
      disabled={pending}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Loading..." : label}
    </Button>
  );
}

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

  // ? unable to use this hook for some reason
  // const segments = useSelectedLayoutSegments();
  // console.log("segments :>> ", segments);

  const [state, formAction] = useFormState(updateUserWatchlist, initialState);

  const label = !state.isWatchlisted ? "Watchlist" : "Remove";

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
            <p>Notify me when this item is on sale</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default WatchlistButton;

//   return (
//     <>
//       <form action={formAction} className="w-full">
//         <input type="hidden" name="artworkId" value={artworkId} />

//         <SubmitButton label={label} />
//       </form>
//     </>
//   );
// };
