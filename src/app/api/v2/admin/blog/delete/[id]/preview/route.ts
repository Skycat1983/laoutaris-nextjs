import type { SingleResult, RouteResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { getBlogDeletePreview } from "@/lib/api/admin/delete/preview";
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
    return adminDeleteInvalidIdResponse("blog", "Invalid blog ID");
  }

  return adminDeletePreviewResponse({
    request,
    route: "/api/v2/admin/blog/delete/[id]/preview",
    id,
    adminUserId: admin.userId,
    notFoundMessage: "Blog not found",
    failureMessage: "Failed to preview blog deletion",
    operation: "admin.blog.delete",
    errorLabel: "admin_blog_delete_preview_failed",
    getPreview: getBlogDeletePreview,
  });
}
