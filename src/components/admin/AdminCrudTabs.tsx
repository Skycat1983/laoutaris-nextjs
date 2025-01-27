import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/shadcn/tabs";

interface AdminCrudTabsProps {
  createComponent?: React.ReactNode;
  readComponent?: React.ReactNode;
  updateComponent?: React.ReactNode;
  deleteComponent?: React.ReactNode;
}

const baseTabClass =
  "relative text-xl font-archivo px-8 text-gray-400 outline-none p-4 border-b-4 border-transparent transition-colors data-[state=active]:border-b-4";

export function AdminCrudTabs({
  createComponent,
  readComponent,
  updateComponent,
  deleteComponent,
}: AdminCrudTabsProps) {
  return (
    <div>
      <Tabs defaultValue="create">
        <TabsList>
          <div className="flex flex-row gap-10 border-greyish/50">
            <TabsTrigger
              value="create"
              className={`${baseTabClass} data-[state=active]:text-green-700 data-[state=active]:border-green-700`}
            >
              Create
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className={`${baseTabClass} data-[state=active]:text-blue-400 data-[state=active]:border-blue-400`}
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className={`${baseTabClass} data-[state=active]:text-orange-400 data-[state=active]:border-orange-400`}
            >
              Update
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className={`${baseTabClass} data-[state=active]:text-red-700 data-[state=active]:border-red-700`}
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
