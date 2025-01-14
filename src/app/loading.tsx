import { Spinner } from "@/components/atoms/Spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Spinner size="large">
        <h1 className="text-xl p-8 pb-48 ">Loading...</h1>
      </Spinner>
    </div>
  );
};

export default Loading;
