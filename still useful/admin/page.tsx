"use server";

import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  const url = "/admin/articles";
  return redirect(url);
};

export default page;
