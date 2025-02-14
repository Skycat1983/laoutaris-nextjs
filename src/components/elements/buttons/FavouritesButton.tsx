"use client";

import React from "react";
import { useFormState } from "react-dom";

import { updateUserFavourites } from "@/lib/old_code/user/actions/updateUserFavourites";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import SubmitButton from "./SubmitButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
import ModalMessage from "@/components/elements/typography/ModalMessage";

type FavouritesButtonProps = {
  isLoggedIn: boolean;
  isFavourited: boolean;
  artworkId: string;
};

export interface FavouritesButtonState {
  success: boolean;
  message: string;
  isFavourited: boolean;
}
const FavouritesButton = ({
  isLoggedIn,
  isFavourited,
  artworkId,
}: FavouritesButtonProps) => {
  const initialState: FavouritesButtonState = {
    success: false,
    isFavourited: isFavourited,
    message: "",
  };

  const { openModal } = useGlobalFeatures();

  const [state, formAction] = useFormState(updateUserFavourites, initialState);

  const handleUnauthenticatedAction = () => {
    openModal(<ModalMessage message="You need to be logged in to do this" />);
  };

  const label = !state.isFavourited ? "Favourite" : "Unfavourite";

  if (isLoggedIn) {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <form action={formAction} className="w-full">
                <input type="hidden" name="artworkId" value={artworkId} />
                <SubmitButton label={label} variant={"outline"} />
              </form>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add this item to your favourites list</p>
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
              <SubmitButton label={label} variant={"outline"} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add this item to your favourites list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default FavouritesButton;
