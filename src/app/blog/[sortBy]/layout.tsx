import BlogSortedByLayout from "@/components/layouts/BlogSortedByLayout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* <BlogSortedByLayout>{children}</BlogSortedByLayout> */}
    </>
  );
}
