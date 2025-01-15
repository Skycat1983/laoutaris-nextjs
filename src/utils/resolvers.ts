import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { buildUrl } from "./buildUrl";
import {
  IFrontendCollection,
  IFrontendCollectionPopulated,
  IFrontendCollectionUnpopulated,
} from "@/lib/client/types/collectionTypes";
import { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";
import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { title } from "process";
/*
 These resolver functions are used to convert the data from the backend to the frontend
 This is useful when the backend data is different from the frontend data

? Why/where is this used?:
- The layout.tsx file of our collections route and biography route both have a SubNav component.
- Each Subnav component requires an array of SubNavBarLink objects to render the navigation links.
- However, the function used to fetch this data differs for each route. 
- This was not a problem while i was fetching in the layout.tsx of each route. However, fetching in layout.tsx was preventing me from using React Suspense/fallback Skeleton while the data is being fetched.
* The solution was to move the fetching to the SubNav component. This way, the SubNav component can handle the fetching and the layout.tsx handles the fallback UI Skeleton while the data is being fetched.
- In order to achieve this without creating two SubNav components- one for each route- instead I would pass the fetch/resolve functions to the Subav as props.
- To improve the code further, I created a higher-order function that takes the fetch/resolve functions as arguments and returns a function that can be passed to the SubNav component as props.
*/
// type SubNavArticleFields = Pick<IFrontendArticle, "title" | "slug">;

// export const articleToSubNavLink = (
//   item: SubNavArticleFields
// ): SubNavBarLink => ({
//   title: item.title,
//   slug: item.slug,
//   url: buildUrl(["biography", item.slug]),
// });

// type SubNavCollectionFields = Pick<
//   IFrontendCollectionUnpopulated,
//   "title" | "slug" | "artworks"
// >;

// export const collectionToSubNavLink = (
//   item: SubNavCollectionFields
// ): SubNavBarLink => ({
//   title: item.title,
//   slug: item.slug,
//   url: buildUrl(["collections", item.slug, item.artworks[0]]),
// });

// return {
//   secure_url: item.artworks[0].image.secure_url,
//   height: item.artworks[0].image.pixelHeight,
//   width: item.artworks[0].image.pixelWidth,
//   url: buildUrl(["collections", item.slug, item.artworks[0]._id]),
// };

// type PaginationItemProps = {
//   artworkLink: {
//     _id: string;
//     image: {
//       secure_url: string;
//       pixelHeight: number;
//       pixelWidth: number;
//     };
//   };
// };

// type PaginationCollectionArtworkFields = Pick<
//   IFrontendCollectionPopulated,
//   "section" | "slug" | "artworks"
// >;
