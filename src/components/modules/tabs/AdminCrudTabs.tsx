"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn/tabs";

type AdminOperation = "create" | "read" | "update" | "delete";

interface AdminCrudTabsProps {
  createComponent?: React.ReactNode;
  readComponent?: React.ReactNode;
  updateComponent?: React.ReactNode;
  deleteComponent?: React.ReactNode;
  disabledOperations?: readonly AdminOperation[];
}

interface AdminArchiveEntryPoint {
  documentId: string;
  operation: Extract<AdminOperation, "update" | "delete">;
}

interface AdminArchiveEntryPointContextValue {
  selectEntryForOperation: (entryPoint: AdminArchiveEntryPoint) => void;
}

interface OperationComponentProps {
  initialDocumentId?: string | null;
}

const baseTabClass =
  "relative text-xl font-archivo px-8 text-gray-400 outline-none p-4 border-b-4 border-transparent transition-colors data-[state=active]:border-b-4";

const disabledTabClass = "opacity-50 cursor-not-allowed";

const AdminArchiveEntryPointContext =
  createContext<AdminArchiveEntryPointContextValue>({
    selectEntryForOperation: () => undefined,
  });

export function useAdminArchiveEntryPoint() {
  return useContext(AdminArchiveEntryPointContext);
}

export function AdminCrudTabs({
  createComponent,
  readComponent,
  updateComponent,
  deleteComponent,
  disabledOperations = [],
}: AdminCrudTabsProps) {
  const enabledOperations = ["create", "read", "update", "delete"].filter(
    (op): op is AdminOperation => !disabledOperations.includes(op as AdminOperation)
  );
  const defaultOperation = enabledOperations[0] || "read";
  const [activeOperation, setActiveOperation] =
    useState<AdminOperation>(defaultOperation);
  const [selectedEntryPoint, setSelectedEntryPoint] =
    useState<AdminArchiveEntryPoint | null>(null);

  const selectEntryForOperation = (entryPoint: AdminArchiveEntryPoint) => {
    if (disabledOperations.includes(entryPoint.operation)) return;

    setSelectedEntryPoint(entryPoint);
    setActiveOperation(entryPoint.operation);
  };

  const handleOperationChange = (operation: AdminOperation) => {
    if (disabledOperations.includes(operation)) return;

    setActiveOperation(operation);
    if (operation === "create" || operation === "read") {
      setSelectedEntryPoint(null);
    }
  };

  const renderOperationComponent = (
    component: React.ReactNode,
    operation: AdminOperation
  ) => {
    if (activeOperation !== operation) return null;
    if (
      (operation !== "update" && operation !== "delete") ||
      !React.isValidElement<OperationComponentProps>(component)
    ) {
      return component;
    }

    const initialDocumentId =
      selectedEntryPoint?.operation === operation
        ? selectedEntryPoint.documentId
        : null;

    return React.cloneElement(component, { initialDocumentId });
  };

  return (
    <AdminArchiveEntryPointContext.Provider value={{ selectEntryForOperation }}>
      <Tabs
        value={activeOperation}
        onValueChange={(value) => handleOperationChange(value as AdminOperation)}
      >
        <TabsList className="mb-10">
          <div className="flex flex-row gap-10 border-greyish/50">
            <TabsTrigger
              value="create"
              className={`${baseTabClass} data-[state=active]:text-green-700 data-[state=active]:border-green-700 ${
                disabledOperations.includes("create") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("create")}
              onClick={() => handleOperationChange("create")}
            >
              Create
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className={`${baseTabClass} data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 ${
                disabledOperations.includes("read") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("read")}
              onClick={() => handleOperationChange("read")}
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className={`${baseTabClass} data-[state=active]:text-orange-400 data-[state=active]:border-orange-400 ${
                disabledOperations.includes("update") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("update")}
              onClick={() => handleOperationChange("update")}
            >
              Update
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className={`${baseTabClass} data-[state=active]:text-red-700 data-[state=active]:border-red-700 ${
                disabledOperations.includes("delete") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("delete")}
              onClick={() => handleOperationChange("delete")}
            >
              Delete
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="create">
          {renderOperationComponent(createComponent, "create")}
        </TabsContent>
        <TabsContent value="read">
          {renderOperationComponent(readComponent, "read")}
        </TabsContent>
        <TabsContent value="update">
          {renderOperationComponent(updateComponent, "update")}
        </TabsContent>
        <TabsContent value="delete">
          {renderOperationComponent(deleteComponent, "delete")}
        </TabsContent>
      </Tabs>
    </AdminArchiveEntryPointContext.Provider>
  );
}
