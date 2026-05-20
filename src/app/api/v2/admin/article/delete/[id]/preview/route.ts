import type { SingleResult, RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { getArticleDeletePreview } from "@/lib/api/admin/delete/preview";
import type { AdminDeletePreview } from "@/lib/api/admin/delete/previewTypes";
import { adminDeletePreviewResponse } from "@/lib/api/admin/delete/previewRoute";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<SingleResult<AdminDeletePreview>>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("article", "Invalid article ID");
  }

  return adminDeletePreviewResponse({
    request,
    route: "/api/v2/admin/article/delete/[id]/preview",
    id,
    adminUserId: admin.userId,
    notFoundMessage: "Article not found",
    failureMessage: "Failed to preview article deletion",
    operation: "admin.article.delete",
    errorLabel: "admin_article_delete_preview_failed",
    getPreview: getArticleDeletePreview,
  });
}
