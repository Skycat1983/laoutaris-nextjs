"use client";

import { useRouter } from "next/navigation";
import { RefreshIcon } from "@/components/ui/common/icons/RefreshIcon";
import { Button } from "@/components/ui/shadcn/button";

export function RefreshButton() {
  const router = useRouter();

  return (
    <div onClick={() => router.refresh()}>
      <RefreshIcon />
    </div>
    // <Button
    //   onClick={() => router.refresh()}
    //   variant="outline"
    //   size="sm"
    //   className="gap-2"
    // >
    //   <RefreshIcon />
    //   {/* Refresh Feed */}
    // </Button>
  );
}
