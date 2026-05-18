import { NextRequest, NextResponse } from "next/server";
import { CommentModel, UserModel, BlogModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { transformCommentPopulated } from "@/lib/transforms";
import { requireApiUser } from "@/lib/api/requireApiUser";
import {
  ApiErrorResponse,
  CommentLeanPopulated,
} from "@/lib/data/types";
import {
  ApiUserCommentDeleteResult,
  ApiUserCommentUpdateResult,
} from "@/lib/api/user/comments/fetchers";
import {
  updateCommentRouteBodySchema,
  updateCommentRouteParamsSchema,
  type UpdateCommentRouteBody,
  type UpdateCommentRouteParams,
} from "@/lib/data/schemas/commentSchema";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import {
  createRequestContext,
  type RequestContext,
} from "@/lib/observability/requestContext";

type CommentUpdateFieldErrors = Partial<
  Record<
    keyof (UpdateCommentRouteBody & UpdateCommentRouteParams),
    string[] | undefined
  >
>;

type CommentValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: CommentUpdateFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: CommentUpdateFieldErrors,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const requestContext = createRequestContext(
    request,
    "/api/v2/user/comment/[commentId]"
  );
  const logger = createApiLogger(requestContext);
  const userGuard = await requireApiUser();

  if (!userGuard.ok) {
    return userGuard.response;
  }

  const parsedParams = updateCommentRouteParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    const { fieldErrors, formErrors } = parsedParams.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationErrorResponse({}, ["Request body must be valid JSON."]);
  }

  const parsedBody = updateCommentRouteBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { commentId } = parsedParams.data;
    const { text } = parsedBody.data;

    const comment = await CommentModel.findById(commentId).populate("author");
    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    if (comment.author._id.toString() !== userGuard.userId) {
      return errorResponse("Not authorized to edit this comment", 403);
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { text } },
      { new: true, runValidators: true }
    )
      .populate([
        { path: "author", model: "User" },
        { path: "blog", model: "Blog" },
      ])
      .lean<CommentLeanPopulated>();

    if (!updatedComment) {
      return errorResponse("Comment not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: transformCommentPopulated(updatedComment, userGuard.userId),
    } satisfies ApiUserCommentUpdateResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.user.comment_update.failed", {
      operation: "user_comment_update",
      commentId: parsedParams.data.commentId,
      error,
      errorLabel: "user_comment_update_failed",
    });
    return errorResponse("Failed to update comment", 500, requestContext);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const requestContext = createRequestContext(
    request,
    "/api/v2/user/comment/[commentId]"
  );
  const logger = createApiLogger(requestContext);
  const user = await requireApiUser();

  if (!user.ok) {
    return user.response;
  }

  const parsedParams = updateCommentRouteParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    const { fieldErrors, formErrors } = parsedParams.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { commentId } = parsedParams.data;
    const mongoSession = await CommentModel.startSession();
    mongoSession.startTransaction();

    try {
      const comment = await CommentModel.findById(commentId)
        .populate("author")
        .session(mongoSession);

      if (!comment) {
        await mongoSession.abortTransaction();
        return errorResponse("Comment not found", 404);
      }

      if (comment.author._id.toString() !== user.userId) {
        await mongoSession.abortTransaction();
        return errorResponse("Not authorized to delete this comment", 403);
      }

      const blogId = comment.blog;

      await CommentModel.findByIdAndDelete(commentId).session(mongoSession);

      await UserModel.findByIdAndUpdate(
        comment.author._id,
        { $pull: { comments: commentId } },
        { session: mongoSession }
      );

      await BlogModel.findByIdAndUpdate(
        blogId,
        { $pull: { comments: commentId } },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();

      return NextResponse.json({
        success: true,
        data: {
          success: true,
          message: "Comment deleted successfully",
        },
      } satisfies ApiUserCommentDeleteResult);
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

    logger.error("api.user.comment_delete.failed", {
      operation: "user_comment_delete",
      commentId: parsedParams.data.commentId,
      error,
      errorLabel: "user_comment_delete_failed",
    });
    return errorResponse("Failed to delete comment", 500, requestContext);
  }
}
