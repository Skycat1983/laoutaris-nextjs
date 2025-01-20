import BlogSectionLayout from "@/components/layouts/BlogSectionLayout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BlogSectionLayout>{children}</BlogSectionLayout>
    </>
  );
}

// await dbConnect();
// const section = "featured";
// const result = await fetchBlogAvailability(section);

// const data = result.success ? result.data : {};

// const sortRangeOptions = [
//   { label: "All posts", queryValue: "all" },
//   ...Object.keys(data).map((year) => ({
//     label: year,
//     queryValue: year,
//   })),
// ];

{
  /* <div className="hidden md:block col-start-9 col-span-4 lg:col-start-9 lg:col-span-3 2xl:col-start-9 2xl:col-span-2 bg-slate-300/10 shadow mb-4">
        <BlogSidebar options={sortRangeOptions} />
      </div> */
}

// <section>
//   <div className="flex flex-col flex-grow p-4 md:px-10 lg:p-0">
//     <div className="grid grid-cols-12">
//       <div className="col-start-1 col-span-12 md:col-start-1 md:col-span-8 lg:col-start-2 lg:col-span-7 2xl:col-start-3 2xl:col-span-6 ">
//         {children}
//       </div>
//       <div className="hidden md:block col-start-9 col-span-4 lg:col-start-9 lg:col-span-3 2xl:col-start-9 2xl:col-span-2 bg-slate-300/10 shadow mb-4">
//         <BlogSidebar options={sortRangeOptions} />
//       </div>
//     </div>
//   </div>
// </section>

// export default async function BlogSectionLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   await dbConnect();
//   const section = "featured";
//   const result = await fetchBlogAvailability(section);

//   const data = result.success ? result.data : {};

//   const sortRangeOptions = [
//     { label: "All posts", queryValue: "all" },
//     ...Object.keys(data).map((year) => ({
//       label: year,
//       queryValue: year,
//     })),
//   ];

//   return (
//     <section>
//       <div className="flex flex-col flex-grow p-4 md:px-10 lg:p-0">
//         <div className="grid grid-cols-12">
//           <div className="col-start-1 col-span-12 md:col-start-1 md:col-span-8 lg:col-start-2 lg:col-span-7 2xl:col-start-3 2xl:col-span-6 ">
//             {children}
//           </div>
//           <div className="hidden md:block col-start-9 col-span-4 lg:col-start-9 lg:col-span-3 2xl:col-start-9 2xl:col-span-2 bg-slate-300/10 shadow mb-4">
//             <BlogSidebar options={sortRangeOptions} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
