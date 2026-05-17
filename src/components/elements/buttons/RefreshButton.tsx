"use client";

import { RefreshIcon } from "@/components/elements/icons/RefreshIcon";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();
  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div
      onClick={handleRefresh}
      className="cursor-pointer hover:opacity-70 transition-opacity"
    >
      <RefreshIcon />
    </div>
  );
}
