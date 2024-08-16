"use client";

import { addToFavourites } from "@/lib/server/artwork/actions/addToFavourites";
import React, { useActionState, useState } from "react";

type Props = {
  label: string;
};

const initialState = {
  message: "",
};

const WatchlistButton = ({ label }: Props) => {
  // const [state, formAction] = useActionState(addToFavourites, initialState);
  // const [buttonLabel, setButtonLabel] = useState(label);
  return (
    <>
      {/* <form action={formAction}> */}
      {/* <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" required /> */}
      <button
        className="p-2 border border-2 border-black bg-black w-2/3 rounded-full font-subheading text-white font-bold"
        // onClick={async () => {
        //   const updatedLikes = await addToFavourites();
        //   setButtonLabel("Added to favourites");
        // }}
        type="submit"
      >
        {label}
      </button>
      {/* </form> */}
    </>
  );
};

export default WatchlistButton;
