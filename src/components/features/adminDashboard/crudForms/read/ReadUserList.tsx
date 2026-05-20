"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { CopyIcon, Trash2Icon } from "lucide-react";
import type { UserFrontend } from "@/lib/data/types/userTypes";
import { clientApi } from "@/lib/api/clientApi";
import { useAdminArchiveEntryPoint } from "@/components/modules/tabs/AdminCrudTabs";
import {
  AdminReadPagination,
  type AdminReadPaginationMetadata,
  createDefaultReadPaginationMetadata,
  normalizeAdminReadPaginationMetadata,
} from "./AdminReadPagination";

const USER_READ_PAGE_SIZE = 10;

const defaultPaginationMetadata =
  createDefaultReadPaginationMetadata(USER_READ_PAGE_SIZE);

export function ReadUserList() {
  const [users, setUsers] = useState<UserFrontend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState<AdminReadPaginationMetadata>(
    defaultPaginationMetadata
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectEntryForOperation } = useAdminArchiveEntryPoint();

  useEffect(() => {
    let isActive = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await clientApi.admin.read.users({
          page: currentPage,
          limit: USER_READ_PAGE_SIZE,
        });

        if (!isActive) return;

        if (response.success) {
          setUsers(response.data);
          setMetadata(
            normalizeAdminReadPaginationMetadata(
              response.metadata,
              currentPage,
              USER_READ_PAGE_SIZE
            )
          );
          return;
        }

        setUsers([]);
        setMetadata(defaultPaginationMetadata);

        if (response.error !== "No users found") {
          setError(response.error || "Failed to fetch users");
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch users"
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isActive = false;
    };
  }, [currentPage]);

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      return;
    }
  };

  if (error) {
    return (
      <div className="p-4" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      {isLoading ? (
        <UserListSkeleton />
      ) : (
        <>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">
              No users found on this page.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="relative group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-medium truncate">
                      {user.username}
                    </h3>
                    {/* <p className="text-xs text-gray-500 truncate">{user.email}</p> */}
                    <p className="text-xs text-gray-500">Role: {user.role}</p>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${user.username}`}
                      onClick={() =>
                        selectEntryForOperation({
                          documentId: user._id,
                          operation: "delete",
                        })
                      }
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Copy ${user.username} ID`}
                      onClick={() => handleCopyId(user._id)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {metadata.total > 0 && (
            <AdminReadPagination
              metadata={metadata}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
              resourceLabel="user"
            />
          )}
        </>
      )}
    </div>
  );
}

export function UserListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
