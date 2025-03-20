import Image from "next/image";

export type ArticleSection = string;

export type ArticleFrontend = {
  section: ArticleSection;
  summary: string;
  title: string;
  text: string;
  _id: string;
  subtitle: string;
  imageUrl: string;
  slug: string;
};

export type ArticleDisplayProps = {
  articles: ArticleFrontend[];
};

export const ListLayout = ({ articles }: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className="flex gap-6 items-center bg-white rounded-xl shadow-sm p-4"
          >
            <div className="relative w-[200px] h-[140px] flex-shrink-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-600 line-clamp-2">{article.summary}</p>
              <p className="text-sm text-gray-500 mt-2">{article.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CarouselLayout = ({ articles }: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {articles.map((article) => (
          <div
            key={article._id}
            className="relative w-[300px] h-[400px] flex-shrink-0 snap-center rounded-xl overflow-hidden"
          >
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {article.title}
              </h2>
              <p className="text-white/90 text-sm line-clamp-2">
                {article.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MasonryLayout = ({ articles }: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="columns-2 md:columns-3 gap-4">
        {articles.map((article, index) => (
          <div
            key={article._id}
            className="relative break-inside-avoid mb-4 rounded-xl overflow-hidden"
            style={{ height: `${[500, 400, 450, 350, 400][index]}px` }}
          >
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-xl font-bold text-white mb-2">
                {article.title}
              </h2>
              <p className="text-white/90 text-sm line-clamp-2">
                {article.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FeaturedWithSidebarLayout = ({
  articles,
}: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  const [mainArticle, ...sidebarArticles] = articles;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="md:col-span-2 relative h-[600px] rounded-xl overflow-hidden">
          <Image
            src={mainArticle.imageUrl}
            alt={mainArticle.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mainArticle.title}
            </h2>
            <p className="text-white/90">{mainArticle.summary}</p>
          </div>
        </div>

        {/* Sidebar Articles */}
        <div className="space-y-4">
          {sidebarArticles.map((article) => (
            <div
              key={article._id}
              className="relative h-[140px] rounded-xl overflow-hidden"
            >
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 p-4 flex items-end">
                <h3 className="text-sm font-semibold text-white">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CompactGridLayout = ({ articles }: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {articles.map((article) => (
          <div
            key={article._id}
            className="relative h-[200px] rounded-xl overflow-hidden"
          >
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-sm font-bold text-white mb-1">
                {article.title}
              </h2>
              <p className="text-white/90 text-xs line-clamp-2">
                {article.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export const HeroLayout = ({ articles }: ArticleDisplayProps) => {
  if (!articles?.length) return null;

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 5);

  return (
    <section className="container mx-auto p-4 space-y-8">
      {/* Hero Article */}
      <div className="relative h-[600px] rounded-2xl overflow-hidden">
        <Image
          src={mainArticle.imageUrl}
          alt={mainArticle.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mainArticle.title}
          </h2>
          <p className="text-white/90">{mainArticle.summary}</p>
        </div>
      </div>

      {/* Secondary Articles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryArticles.map((article) => (
          <div
            key={article._id}
            className="relative h-[200px] rounded-xl overflow-hidden"
          >
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
              <h3 className="text-sm font-semibold text-white">
                {article.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
