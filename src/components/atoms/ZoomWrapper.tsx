"use client";

import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ZoomWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      {children}
      <div className="flex flex-row mx-auto">
        <button>
          <ArrowBigLeft />
        </button>
        <button>
          <ArrowBigRight />
        </button>
      </div>
    </div>
  );
};

export default ZoomWrapper;
