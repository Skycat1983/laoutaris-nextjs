import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";

export default function SegmentPage({
  params: { segment },
}: {
  params: { segment: string };
}) {
  //   const components = getSegmentComponents(segment);

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-4xl font-archivo font-semibold p-8 mt-8 capitalize">
        {segment}
      </h1>
      {/* <AdminCrudTabs {...components} /> */}
    </div>
  );
}
