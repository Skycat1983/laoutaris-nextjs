import dbConnect from "@/utils/mongodb";

//! not used/needed
export default async function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  return <section className="bg-red-100">{children}</section>;
}
