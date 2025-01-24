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
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import Modal from "@/components/ui/modal/Modal";
import ModalMessage from "../ModalMessage";
import SubmitButton from "./SubmitButton";

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
