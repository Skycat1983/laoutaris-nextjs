import { ArticleModel, BlogModel, CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import {
  SearchResponse,
  SearchResultItem,
  SearchableContent,
} from "@/lib/data/types/searchTypes";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { transformToPick } from "@/lib/transforms/transformToPick";
import {
  FrontendArticle,
  FrontendBlogEntry,
  FrontendCollection,
} from "@/lib/data/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    // regex case-insensitive search
    const searchRegex = new RegExp(query, "i");

    // base queries
    const queries = {
      articles: ArticleModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      }),
      blogs: BlogModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      }),
      collections: CollectionModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      }),
    };

    // if type specified, search only that type
    if (type && type in queries) {
      const model = queries[type as keyof typeof queries];
      const results = await model
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      const total = await model.countDocuments();

      // First transform mongoose doc, then pick required fields
      const transformedResults =
        transformMongooseDoc<SearchableContent[]>(results);
      const searchResults = transformedResults.map((item) =>
        transformToPick(item, [
          "_id",
          "title",
          "subtitle",
          "summary",
          "imageUrl",
          "slug",
        ])
      ) as SearchResultItem[];

      return NextResponse.json<ApiSuccessResponse<SearchResponse>>({
        success: true,
        data: {
          articles: type === "articles" ? searchResults : [],
          blogs: type === "blogs" ? searchResults : [],
          collections: type === "collections" ? searchResults : [],
          metadata: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    }

    // search all types if no type specified
    const [articles, blogs, collections] = await Promise.all([
      queries.articles.limit(limit).lean().exec(),
      queries.blogs.limit(limit).lean().exec(),
      queries.collections.limit(limit).lean().exec(),
    ]);

    // Transform each result set
    const transformedArticles = transformMongooseDoc<FrontendArticle[]>(
      articles
    ).map((item) => ({
      ...transformToPick(item, [
        "_id",
        "title",
        "subtitle",
        "summary",
        "imageUrl",
        "slug",
      ]),
      linkTo: `/${item.section}/${item.slug}`,
    })) as SearchResultItem[];

    const transformedBlogs = transformMongooseDoc<FrontendBlogEntry[]>(
      blogs
    ).map((item) => ({
      ...transformToPick(item, [
        "_id",
        "title",
        "subtitle",
        "summary",
        "imageUrl",
        "slug",
      ]),
      linkTo: `/blog/${item.slug}`,
    })) as SearchResultItem[];

    const transformedCollections = transformMongooseDoc<FrontendCollection[]>(
      collections
    ).map((item) => ({
      ...transformToPick(item, [
        "_id",
        "title",
        "subtitle",
        "summary",
        "imageUrl",
        "slug",
      ]),
      linkTo: `/collections/${item.slug}`,
    })) as SearchResultItem[];

    const total =
      transformedArticles.length +
      transformedBlogs.length +
      transformedCollections.length;

    return NextResponse.json<ApiSuccessResponse<SearchResponse>>({
      success: true,
      data: {
        articles: transformedArticles,
        blogs: transformedBlogs,
        collections: transformedCollections,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: "Failed to perform search",
      },
      { status: 500 }
    );
  }
}
