"use client";

import { useRouter } from "next/navigation";
import { RefreshIcon } from "@/components/ui/common/icons/RefreshIcon";

export function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    console.log("Refresh clicked");
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
