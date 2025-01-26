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
  "text-xl font-archivo px-8 text-gray-400 outline-none data-[selected]:border-b-4 data-[selected]:border-black data-[selected]:text-black p-4";

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
          <div className="flex flex-row gap-10 border-b-2 border-greyish/50">
            <TabsTrigger
              value="create"
              className={`${baseTabClass} data-[selected]:text-green-700 data-[selected]:border-green-700`}
            >
              Create
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className={`${baseTabClass} data-[selected]:text-blue-400 data-[selected]:border-blue-400`}
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className={`${baseTabClass} data-[selected]:text-orange-400 data-[selected]:border-orange-400`}
            >
              Update
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className={`${baseTabClass} data-[selected]:text-red-700 data-[selected]:border-red-700`}
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

{
  /* <TabList>
                <div className="flex flex-row gap-10 border-b-2 border-greyish/50">
                  {tabs.map((tab, i) => (
                    <Tab key={i} as="div" className={tab.className}>
                      {tab.label}
                    </Tab>
                  ))}
                </div>
              </TabList> */
}
