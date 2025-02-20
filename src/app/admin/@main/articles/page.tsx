import { CreateArticle } from "@/components/modules/forms/admin/CreateArticle";
import { DeleteArticle } from "@/components/modules/forms/admin/DeleteArticle";
import { UpdateArticle } from "@/components/modules/forms/admin/UpdateArticle";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";

export default function ArticlesPage() {
  return (
    <AdminCrudTabs
      createComponent={<CreateArticle />}
      readComponent={<div>Read Article</div>}
      updateComponent={<UpdateArticle />}
      deleteComponent={<DeleteArticle />}
    />
  );
}
