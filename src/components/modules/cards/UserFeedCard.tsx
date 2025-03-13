"use client";

import { UserFrontend } from "@/lib/data/types";

interface UserFeedCardProps {
  item: UserFrontend;
}

export function UserFeedCard({ item }: UserFeedCardProps) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{item.username}</h3>
          <span className="text-sm text-gray-500">{item.role}</span>
        </div>
        {/* <p className="text-sm text-gray-600">{item.email}</p> */}
      </div>
    </div>
  );
}
