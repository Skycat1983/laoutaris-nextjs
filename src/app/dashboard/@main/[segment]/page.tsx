import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { adminSegmentConfig, AdminSegment } from "@/config/adminSegmentConfig";
import { notFound } from "next/navigation";

export default function SegmentPage({
  params: { segment },
}: {
  params: { segment: string };
}) {
  // Type guard for segment
  if (!isValidSegment(segment)) {
    notFound();
  }

  const components = adminSegmentConfig[segment];

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-4xl font-archivo font-semibold p-8 mt-8 capitalize">
        {segment}
      </h1>
      <AdminCrudTabs {...components} />
    </div>
  );
}

// Type guard function
function isValidSegment(segment: string): segment is AdminSegment {
  return segment in adminSegmentConfig;
}

// Generate static params for optimization
export function generateStaticParams() {
  return Object.keys(adminSegmentConfig).map((segment) => ({
    segment,
  }));
}
