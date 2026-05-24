import React from "react";
import { Spinner } from "@/components/elements/misc/Spinner";

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Spinner size="large" label="Loading page">
        <span className="text-xl p-4 pb-48">Loading page</span>
      </Spinner>
    </div>
  );
};

export default PageLoading;
