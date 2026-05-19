import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import type { ApiErrorResponse, CommentLeanPopulated, RouteResponse } from "@/lib/data/types";
import {
  ApiUserCommentsGetResult,
  ApiUserCommentCreateResult,
} from "@/lib/api/user/comments/fetchers";
import { requireApiUser } from "@/lib/api/requireApiUser";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { transformCommentPopulated } from "@/lib/transforms";
import dbConnect from "@/lib/db/mongodb";
import {
  createCommentRouteSchema,
  type CreateCommentRouteInput,
} from "@/lib/data/schemas/commentSchema";
import { getOwnUserComments } from "@/lib/data/services/getOwnUserComments";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import {
  createRequestContext,
  type RequestContext,
} from "@/lib/observability/requestContext";
export const dynamic = "force-dynamic";

type CommentFieldErrors = Partial<
  Record<keyof CreateCommentRouteInput, string[] | undefined>
>;

type CommentValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: CommentFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: CommentFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<CommentValidationErrorResponse>(
    {
      success: false,
      error: "Invalid comment input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const errorResponse = (
  error: string,
  status: number,
  requestContext?: RequestContext
) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
      ...(requestContext === undefined
        ? {}
        : { requestId: requestContext.requestId }),
    },
    {
      status,
      ...(requestContext === undefined
        ? {}
        : { headers: requestContext.responseHeaders }),
    }
  );

const findPopulatedCommentById = (
  commentId: unknown,
  session: mongoose.ClientSession
) =>
  CommentModel.findById(commentId)
    .session(session)
    .populate([
      { path: "author", model: "User" },
      { path: "blog", model: "Blog" },
    ])
    .lean<CommentLeanPopulated>();

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiUserCommentsGetResult>> {
  const requestContext = createRequestContext(req, "/api/v2/user/comment");
  const logger = createApiLogger(requestContext);
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const userComments = await getOwnUserComments(userGuard.userId);

    if (!userComments) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: userComments.comments,
      metadata: userComments.metadata,
    } satisfies ApiUserCommentsGetResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("api.user.comment_list.failed", {
      operation: "user_comment_list",
      error,
      errorLabel: "user_comment_list_failed",
    });
    return errorResponse("Failed to fetch user comments", 500, requestContext);
  }
}

export async function POST(req: NextRequest) {
  const requestContext = createRequestContext(req, "/api/v2/user/comment");
  const logger = createApiLogger(requestContext);
  const userGuard = await requireApiUser();

  if (!userGuard.ok) {
    return userGuard.response;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationErrorResponse({}, ["Request body must be valid JSON."]);
  }

  const parsedBody = createCommentRouteSchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { blogSlug, text } = parsedBody.data;
    const blog = await BlogModel.findOne({ slug: blogSlug });

    if (!blog) {
      return errorResponse("Blog not found", 404);
    }

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      const createdComments = await CommentModel.create(
        [
          {
            text,
            author: userGuard.userId,
            blog: blog._id,
            displayDate: new Date(),
          },
        ],
        { session: mongoSession }
      );
      const createdComment = createdComments[0];

      if (!createdComment?._id) {
        throw new Error("Comment creation did not return an id");
      }

      await BlogModel.findByIdAndUpdate(
        blog._id,
        { $push: { comments: createdComment._id } },
        { session: mongoSession }
      );

      await UserModel.findByIdAndUpdate(
        userGuard.userId,
        { $push: { comments: createdComment._id } },
        { session: mongoSession }
      );

      const populatedComment = await findPopulatedCommentById(
        createdComment._id,
        mongoSession
      );

      if (!populatedComment) {
        throw new Error("Created comment could not be loaded");
      }

      await mongoSession.commitTransaction();

      return NextResponse.json({
        success: true,
        data: transformCommentPopulated(populatedComment, userGuard.userId),
      } satisfies ApiUserCommentCreateResult);
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("api.user.comment_create.failed", {
      operation: "user_comment_create",
      error,
      errorLabel: "user_comment_create_failed",
    });
    return errorResponse("Failed to create comment", 500, requestContext);
  }
}
