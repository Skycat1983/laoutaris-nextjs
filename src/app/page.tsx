import ArtworkSection from "@/components/homepageSections/ArtworkSection";
import BiographySection from "@/components/homepageSections/BiographySection";
import ProjectSection from "@/components/homepageSections/ProjectSection";
import Hero from "@/components/ui/hero/Hero";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { fetchArticles } from "../lib/server/article/data-fetching/fetchArticles";
import { fetchTest } from "@/lib/server/article/data-fetching/fetchTest";
import { headers } from "next/headers";

type BiographyFields = Pick<
  IFrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

// https://blog.arcjet.com/testing-next-js-app-router-api-routes/

//! DO NOT DELETE
export default async function Home() {
  const biographyEntriesResponse = await fetchArticles<BiographyFields>(
    "section",
    "biography",
    ["title", "subtitle", "slug", "imageUrl"]
  );

  console.log("biographyEntriesResponse", biographyEntriesResponse);

  return (
    <>
      {/* <Hero /> */}
      <div className="grid grid-cols-12 gap-4 py-32">
        <div className="col-span-1 lg:col-span-2"></div>

        <div className="col-span-10 lg:col-span-8 flex flex-col gap-24 ">
          <div className="">
            <ArtworkSection />
          </div>
          <div className="p-4 w-full">
            <ProjectSection />
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            {biographyEntriesResponse.success ? (
              <BiographySection
                biographyEntries={biographyEntriesResponse.data}
              />
            ) : (
              <p>Error: {biographyEntriesResponse.message}</p>
            )}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2"></div>
      </div>
    </>
  );
}

// export default async function Home() {
//   const url = `http://localhost:3000/api/test`;
//   const response = await fetch(url, {
//     method: "GET",
//     headers: headers(),
//   });

//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }

//   console.log("response", response);
//   const data = await response.json();
//   console.log("data", data);
//   return (
//     <>
//       <div className="grid grid-cols-12 gap-4 py-32">
//         <div className="col-span-1 lg:col-span-2"></div>

//         <div className="col-span-10 lg:col-span-8 flex flex-col gap-24">
//           <div data-testid="biography-content">BiographyContent</div>
//         </div>
//         <div className="col-span-1 lg:col-span-2"></div>
//       </div>
//     </>
//   );
// }

// const response = await fetchTest();

{
  /* <div
            className="w-full flex flex-col items-center justify-center"
            data-testid="biography-section"
          >
            {response.success ? (
              <div>
                <h2>Biography Entries</h2>
                <ul>
                  {response.data.map((entry) => (
                    <li key={entry._id}>
                      <h3>{entry.title}</h3>
                      <p>{entry.subtitle}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Error </p>
            )}
          </div> */
}
