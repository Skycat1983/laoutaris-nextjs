import dbConnect from "@/utils/mongodb";
import { fetchBiography } from "@/lib/server/biography/data-fetching/fetchBiography";
import ArticleView from "@/views/ArticleView";
import MobileArticleView from "@/views/MobileArticleView";
import { fetchBiographyLinks } from "@/lib/server/biography/data-fetching/fetchBiographyLinks";

export default async function Article({
  params,
}: {
  params: { articleSlug: string };
}) {
  await dbConnect();
  const result = await fetchBiography(params.articleSlug);
  const article = result.success ? result.data : null;

  const links = await fetchBiographyLinks("biography");
  const navLinks = links.success ? links.data : [];

  const currentIndex = navLinks.findIndex(
    (link) => link.slug === params.articleSlug
  );

  const nextLink =
    currentIndex !== -1 && currentIndex < navLinks.length - 1
      ? navLinks[currentIndex + 1]
      : null;

  const prevLink = currentIndex > 0 ? navLinks[currentIndex - 1] : null;

  const nextUrl = nextLink ? `/biography/${nextLink.slug}` : null;
  const prevUrl = prevLink ? `/biography/${prevLink.slug}` : null;

  console.log("prev", prevLink);
  console.log("nextLink", nextLink);

  // const nextLink = navLinks.find((link, index) => {
  //   if (link.slug === params.articleSlug) {
  //     return navLinks[index + 1];
  //   }
  // });

  // console.log("nextLink", nextLink);

  // const prevLink = navLinks.find((link, index) => {
  //   if (link.slug === params.articleSlug) {
  //     return navLinks[index - 1];
  //   }
  // });

  return (
    <main className="flex flex-col items-center justify-between lg:px-12 py-4">
      <div className="block md:hidden">
        {article && (
          <MobileArticleView
            article={article}
            nextUrl={nextUrl}
            prevUrl={prevUrl}
          />
        )}
      </div>

      {/* <div className="hidden md:block"> */}
      {/* {article && (
        <MobileArticleView
          article={article}
          nextUrl={nextUrl}
          prevUrl={prevUrl}
        />
      )} */}
      {/* </div> */}

      <div className="hidden lg:block">
        {article && <ArticleView article={article} />}
      </div>
    </main>
  );
}
