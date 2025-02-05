import HomepageView from "@/components/views/HomepageView";
import { headers } from "next/headers";

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

export default async function Home() {
  // colleictionRouteTest();
  return (
    <>
      <HomepageView />
    </>
  );
}
