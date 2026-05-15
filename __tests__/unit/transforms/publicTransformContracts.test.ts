jest.mock("mongoose", () => {
  class MockObjectId {
    private value: string;

    constructor(value = "mock-object-id") {
      this.value = value;
    }

    toString() {
      return this.value;
    }
  }

  class MockSchema {
    static Types = {
      ObjectId: MockObjectId,
    };
  }

  return {
    __esModule: true,
    default: {
      models: {},
      model: jest.fn(),
      Schema: MockSchema,
    },
    Types: {
      ObjectId: MockObjectId,
    },
    Schema: MockSchema,
  };
});

import { transformBlogPopulatedWithCommentsPopulated } from "@/lib/transforms/blog/transformBlog";
import { transformBlog } from "@/lib/transforms/blog/transformBlog";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";
import {
  transformComment,
  transformCommentPopulated,
} from "@/lib/transforms/comment/transformComment";
import { transformUser } from "@/lib/transforms/user/transformUser";

const ownerId = "user-owner";
const otherUserId = "user-other";
const artworkId = "artwork-first";

const textWithWordCount = (wordCount: number) =>
  Array.from({ length: wordCount }, (_, index) => `word${index}`).join(" ");

const createUser = (overrides: Record<string, unknown> = {}) => ({
  _id: ownerId,
  email: "owner@example.com",
  username: "owner",
  password: "hashed-password",
  role: "user",
  comments: [],
  watchlist: [],
  favourites: [],
  ...overrides,
});

const createBlog = (overrides: Record<string, unknown> = {}) => ({
  _id: "blog-1",
  title: "Studio Notes",
  subtitle: "Updates",
  summary: "A short summary",
  text: textWithWordCount(201),
  imageUrl: "/blog.jpg",
  author: ownerId,
  slug: "studio-notes",
  displayDate: new Date("2026-01-01T00:00:00.000Z"),
  featured: false,
  pinned: false,
  comments: [],
  tags: [],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  ...overrides,
});

const createComment = (overrides: Record<string, unknown> = {}) => ({
  _id: "comment-1",
  text: "A thoughtful comment",
  author: ownerId,
  blog: "blog-1",
  displayDate: new Date("2026-01-03T00:00:00.000Z"),
  createdAt: new Date("2026-01-03T00:00:00.000Z"),
  updatedAt: new Date("2026-01-04T00:00:00.000Z"),
  ...overrides,
});

describe("public transform contracts", () => {
  it("derives blog readTime from text for direct and populated blog transforms", () => {
    const comment = createComment();
    const blog = createBlog({
      author: createUser(),
      comments: [
        {
          ...comment,
          author: createUser(),
          blog: createBlog({ text: "Nested blog text" }),
        },
      ],
    });

    expect(transformBlog.toFrontend(createBlog() as never).readTime).toBe(2);

    expect(
      transformBlogPopulatedWithCommentsPopulated(blog as never, ownerId)
        .readTime
    ).toBe(2);
  });

  it("returns stable collection firstArtworkId values for filled and empty collections", () => {
    const baseCollection = {
      _id: "collection-1",
      title: "Recent Work",
      subtitle: "Paintings",
      summary: "A collection summary",
      text: "Collection text",
      imageUrl: "/collection.jpg",
      slug: "recent-work",
      section: "collections",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    expect(
      transformCollection.toFrontend({
        ...baseCollection,
        artworks: [artworkId],
      } as never).firstArtworkId
    ).toBe(artworkId);

    expect(
      transformCollection.toFrontend({
        ...baseCollection,
        artworks: [],
      } as never).firstArtworkId
    ).toBeNull();
  });

  it("computes public user ownership while filtering sensitive fields", () => {
    const publicOwner = transformUser.toFrontend(createUser() as never, ownerId);
    const publicOtherUser = transformUser.toFrontend(
      createUser() as never,
      otherUserId
    );

    expect(publicOwner).toMatchObject({
      _id: ownerId,
      username: "owner",
      role: "user",
      isOwner: true,
    });
    expect(publicOwner).not.toHaveProperty("email");
    expect(publicOwner).not.toHaveProperty("password");
    expect(publicOtherUser.isOwner).toBe(false);
  });

  it("computes direct and populated comment ownership from the supplied userId", () => {
    const directComment = transformComment.toFrontend(
      createComment() as never,
      ownerId
    );
    const populatedComment = transformCommentPopulated(
      createComment({
        author: createUser(),
        blog: createBlog(),
      }) as never,
      ownerId
    );

    expect(directComment.isOwner).toBe(true);
    expect(
      transformComment.toFrontend(createComment() as never, otherUserId).isOwner
    ).toBe(false);
    expect(populatedComment.isOwner).toBe(true);
    expect(populatedComment.author.isOwner).toBe(true);
    expect(populatedComment.author).not.toHaveProperty("email");
    expect(populatedComment.author).not.toHaveProperty("password");
  });

  it("preserves user context for comments nested under populated blogs", () => {
    const transformedBlog = transformBlogPopulatedWithCommentsPopulated(
      createBlog({
        author: createUser(),
        comments: [
          createComment({
            author: createUser(),
            blog: createBlog(),
          }),
        ],
      }) as never,
      ownerId
    );

    expect(transformedBlog.author.isOwner).toBe(true);
    expect(transformedBlog.comments[0].isOwner).toBe(true);
    expect(transformedBlog.comments[0].author.isOwner).toBe(true);
  });
});
