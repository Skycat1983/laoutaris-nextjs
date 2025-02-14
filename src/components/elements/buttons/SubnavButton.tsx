"use client";

import React from "react";
import { Button } from "@/components/shadcn/button";

interface SubnavButtonProps {
  title: string;
  slug: string;
}

const SubnavButton = ({ title, slug }: SubnavButtonProps) => {
  return (
    <Button
      shape={"rounded"}
      size={"full"}
      // disabled={pending}
      // variant={"outline"}
    >
      {title}
    </Button>
  );
};
export default SubnavButton;
