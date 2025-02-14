import React from "react";
import { Spinner } from "@/components/elements/misc/Spinner";

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Spinner size="large">
        <h1 className="text-xl p-4 pb-48 ">Loading...</h1>
      </Spinner>
    </div>
  );
};

export default PageLoading;
