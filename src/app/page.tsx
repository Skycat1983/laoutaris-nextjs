import Home from "@/components/views/home/Home";

export default async function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}

// import HomeArtworkSection from "@/components/homepageSections/HomeArtworkSection";
// import { HomeProjectSection } from "@/components/homepageSections/HomeProjectSection";
// import HomeSubscribeSection from "@/components/homepageSections/HomeSubscribeSection";
// import ContentLayout from "@/components/layouts/ContentLayout";
// import { HomeBiographySectionLoader } from "@/components/loaders/HomeBiographySectionLoader";
// import { HomeBlogSectionLoader } from "@/components/loaders/HomeBlogSectionLoader";
// import BlogEntriesSkeleton from "@/components/skeletons/BlogEntriesSkeleton";
// import HomeArtworkSectionSkeleton from "@/components/skeletons/HomeArtworkSectionSkeleton";
// import HomeBiographySectionSkeleton from "@/components/skeletons/HomeBiographySectionSkeleton";
// import HomeProjectSectionSkeleton from "@/components/skeletons/HomeProjectSectionSkeleton";
// import { Suspense } from "react";

// export default async function Home() {
//   return (
//     <>
//       <Hero />
//       <ContentLayout>
//         <Suspense fallback={<HomeArtworkSectionSkeleton />}>
//           <HomeArtworkSection />
//         </Suspense>
//       </ContentLayout>

//       <ContentLayout bg="bg-slate/5">
//         <Suspense fallback={<HomeProjectSectionSkeleton />}>
//           <HomeProjectSection />
//         </Suspense>
//       </ContentLayout>

//       <ContentLayout>
//         <Suspense fallback={<HomeBiographySectionSkeleton />}>
//           <HomeBiographySectionLoader />
//         </Suspense>
//       </ContentLayout>

//       <ContentLayout bg="bg-slate/5">
//         <Suspense fallback={<HomeProjectSectionSkeleton />}>
//           <HomeSubscribeSection />
//         </Suspense>
//       </ContentLayout>

//       <ContentLayout bg="">
//         <Suspense fallback={<BlogEntriesSkeleton />}>
//           <HomeBlogSectionLoader />
//         </Suspense>
//       </ContentLayout>
//     </>
//   );
// }

// export const colleictionRouteTest = async () => {
//   // Test different query combinations
//   const tests = [
//     // Base collection fetch
//     `${process.env.BASEURL}/api/v2/collection`,

//     // With section filter
//     `${process.env.BASEURL}/api/v2/collection?section=artwork`,

//     // With pagination
//     `${process.env.BASEURL}/api/v2/collection?page=1&limit=5`,

//     // Combined filters
//     `${process.env.BASEURL}/api/v2/collection?section=artwork&page=1&limit=2`,
//   ];

//   for (const url of tests) {
//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: headers(),
//       });
//       const data = await response.json();
//       console.log(`\nResults for ${url}:`);
//       console.log("data:", data);
//     } catch (error) {
//       console.error(`Error fetching ${url}:`, error);
//     }
//   }
// };
