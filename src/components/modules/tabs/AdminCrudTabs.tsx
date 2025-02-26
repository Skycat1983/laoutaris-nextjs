import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn/tabs";

interface AdminCrudTabsProps {
  createComponent?: React.ReactNode;
  readComponent?: React.ReactNode;
  updateComponent?: React.ReactNode;
  deleteComponent?: React.ReactNode;
  disabledOperations?: readonly ("create" | "read" | "update" | "delete")[];
}

const baseTabClass =
  "relative text-xl font-archivo px-8 text-gray-400 outline-none p-4 border-b-4 border-transparent transition-colors data-[state=active]:border-b-4";

const disabledTabClass = "opacity-50 cursor-not-allowed";

export function AdminCrudTabs({
  createComponent,
  readComponent,
  updateComponent,
  deleteComponent,
  disabledOperations = [],
}: AdminCrudTabsProps) {
  // Find first enabled operation for default value
  const enabledOperations = ["create", "read", "update", "delete"].filter(
    (op) => !disabledOperations.includes(op as any)
  );
  const defaultOperation = enabledOperations[0] || "read";

  return (
    <div className="">
      <Tabs defaultValue={defaultOperation}>
        <TabsList className="mb-10">
          <div className="flex flex-row gap-10 border-greyish/50">
            <TabsTrigger
              value="create"
              className={`${baseTabClass} data-[state=active]:text-green-700 data-[state=active]:border-green-700 ${
                disabledOperations.includes("create") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("create")}
            >
              Create
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className={`${baseTabClass} data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 ${
                disabledOperations.includes("read") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("read")}
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className={`${baseTabClass} data-[state=active]:text-orange-400 data-[state=active]:border-orange-400 ${
                disabledOperations.includes("update") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("update")}
            >
              Update
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className={`${baseTabClass} data-[state=active]:text-red-700 data-[state=active]:border-red-700 ${
                disabledOperations.includes("delete") ? disabledTabClass : ""
              }`}
              disabled={disabledOperations.includes("delete")}
            >
              Delete
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="create">{createComponent}</TabsContent>
        <TabsContent value="read">{readComponent}</TabsContent>
        <TabsContent value="update">{updateComponent}</TabsContent>
        <TabsContent value="delete">{deleteComponent}</TabsContent>
      </Tabs>
    </div>
  );
}
