import { ArticleModel, BlogModel, CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import {
  SearchResponse,
  SearchResultItem,
  SearchQueriesType,
} from "@/lib/data/types/searchTypes";
import { transformMongooseDoc } from "@/lib/transforms/utils/transformMongooseDoc";
import {
  ArticleLean,
  ApiErrorResponse,
  ApiSuccessResponse,
  BlogEntryLean,
  CollectionLean,
} from "@/lib/data/types";
import { transformToPick } from "@/lib/transforms";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
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

    // Base queries
    const queries: SearchQueriesType = {
      articles: ArticleModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ArticleLean[]>(),

      blogs: BlogModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<BlogEntryLean[]>(),

      collections: CollectionModel.find({
        $or: [
          { title: searchRegex },
          { subtitle: searchRegex },
          { summary: searchRegex },
          { text: searchRegex },
        ],
      })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<CollectionLean[]>(),
    };

    // Always search everything
    const [articles, blogs, collections] = await Promise.all([
      queries.articles,
      queries.blogs,
      queries.collections,
    ]);

    // Transform each result set
    const transformedArticles = transformMongooseDoc<ArticleLean[]>(
      articles
    ).map((item) => ({
      ...transformToPick(item, [
        "title",
        "subtitle",
        "summary",
        "imageUrl",
        "slug",
      ]),
      linkTo: `/${item.section}/${item.slug}`,
    })) as SearchResultItem[];

    const transformedBlogs = transformMongooseDoc<BlogEntryLean[]>(blogs).map(
      (item) => ({
        ...transformToPick(item, [
          "title",
          "subtitle",
          "summary",
          "imageUrl",
          "slug",
        ]),
        linkTo: `/blog/${item.slug}`,
      })
    ) as SearchResultItem[];

    const transformedCollections = transformMongooseDoc<CollectionLean[]>(
      collections
    ).map((item) => ({
      ...transformToPick(item, [
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
