"use client";

import { RefreshIcon } from "@/components/ui/icons/RefreshIcon";
import { useRouter } from "next/navigation";

interface RefreshButtonProps {
  onClick: () => void;
}

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
