import { IFrontendArticle } from "@/lib/client/types/articleTypes";
import { buildUrl } from "./buildUrl";
import { IFrontendCollectionUnpopulated } from "@/lib/client/types/collectionTypes";
import { SubNavBarLink } from "@/components/ui/subnav/SubNavBar";
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
type SubNavArticleFields = Pick<IFrontendArticle, "title" | "slug">;

type SubNavCollectionFields = Pick<
  IFrontendCollectionUnpopulated,
  "title" | "slug" | "artworks"
>;

export const articleToSubNavLink = (
  item: SubNavArticleFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["biography", item.slug]),
});

export const collectionToSubNavLink = (
  item: SubNavCollectionFields
): SubNavBarLink => ({
  title: item.title,
  slug: item.slug,
  url: buildUrl(["collections", item.slug, item.artworks[0]]),
});
