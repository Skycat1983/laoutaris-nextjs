import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/shadcn/tabs";
// import { AdminFeed } from "@/components/admin/AdminFeed";

interface AdminMobileTabsProps {
  mainContent: React.ReactNode;
}

export function AdminMobileTabs({ mainContent }: AdminMobileTabsProps) {
  return (
    <div className="block lg:hidden">
      <Tabs defaultValue="main">
        <TabsList>
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="main">{mainContent}</TabsContent>
        <TabsContent value="feed">
          {/* <AdminFeed /> */}
          <div className="w-full h-full bg-greyish/10 hover:bg-whitish">
            FEED
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
