import { getArticleFeed } from "@/lib/server/admin/use_cases/getArticleFeed";

export async function ArticleFeed() {
  const articleFeed = await getArticleFeed();

  return (
    <div className="w-full h-full bg-blue-100 hover:bg-whitish">
      <h1 className="text-4xl font-archivo p-8 mt-8">Article Feed</h1>
      {/* Display article feed items */}
      {articleFeed.map((article) => (
        <div key={article._id}>
          <h2>{article.title}</h2>
          <p>{article.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
