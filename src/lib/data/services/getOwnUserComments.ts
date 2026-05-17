import "server-only";

import { UserModel } from "@/lib/data/models/userModel";
import type {
  CommentFrontendPopulated,
  CommentLeanPopulated,
  PaginationMetadata,
} from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { transformCommentPopulated } from "@/lib/transforms";

interface UserWithCommentsLean {
  _id: string;
  comments?: CommentLeanPopulated[];
}

export type OwnUserCommentsServiceResult = {
  comments: CommentFrontendPopulated[];
  metadata: Required<PaginationMetadata>;
} | null;

const buildSinglePageMetadata = (
  total: number
): Required<PaginationMetadata> => ({
  total,
  page: 1,
  limit: total,
  totalPages: 1,
});

export const getOwnUserComments = async (
  userId: string
): Promise<OwnUserCommentsServiceResult> => {
  await dbConnect();

  const userWithComments = await UserModel.findById(userId)
    .select("comments")
    .populate({
      path: "comments",
      populate: [
        {
          path: "blog",
          model: "Blog",
        },
        {
          path: "author",
          model: "User",
        },
      ],
    })
    .lean<UserWithCommentsLean>();

  if (!userWithComments) {
    return null;
  }

  const comments = userWithComments.comments ?? [];

  return {
    comments: comments.map((comment) =>
      transformCommentPopulated(comment, userId)
    ),
    metadata: buildSinglePageMetadata(comments.length),
  };
};
