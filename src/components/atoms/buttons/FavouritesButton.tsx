"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/shadcn/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateUserFavourites } from "@/lib/server/user/actions/updateUserFavourites";

interface SubmitButtonProps {
  label: string;
}

function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      shape={"rounded"}
      size={"full"}
      disabled={pending}
      variant={"outline"}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Loading..." : label}
    </Button>
  );
}

type FavouritesButtonProps = {
  isFavourited: boolean;
  artworkId: string;
};

export interface FavouritesButtonState {
  success: boolean;
  message: string;
  isFavourited: boolean;
}

const FavouritesButton = ({
  isFavourited,
  artworkId,
}: FavouritesButtonProps) => {
  const initialState: FavouritesButtonState = {
    success: false,
    isFavourited: isFavourited,
    message: "",
  };

  const [state, formAction] = useFormState(updateUserFavourites, initialState);

  console.log("state", state);

  const label = !state.isFavourited ? "Favourite" : "Unfavourite";

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
            <p>Add this item to your favourites list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default FavouritesButton;
