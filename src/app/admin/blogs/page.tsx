import React from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CreateBlogForm } from "@/components/ui/forms/CreateBlogForm";
import { DeleteBlogEntry } from "@/components/admin/crud/DeleteBlogEntry";
import { UpdateBlogEntry } from "@/components/admin/crud/UpdateBlogEntry";
import ReadBlogForm from "@/components/ui/forms/ReadBlogForm";

export default function AdminBlogsPage() {
  return (
    <AdminContentLayout title="Blogs" feedComponent={<BlogFeed />}>
      <AdminCrudTabs
        createComponent={<CreateBlogForm />}
        readComponent={<ReadBlogForm />}
        updateComponent={<UpdateBlogEntry />}
        deleteComponent={<DeleteBlogEntry />}
      />
    </AdminContentLayout>
  );
}
