import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/viewLoaders";
import ContactForm from "@/components/modules/forms/user/ContactForm";
import { Suspense } from "react";

export default async function Contact() {
  return (
    <Suspense fallback={<ArticleViewSkeleton />}>
      <ArticleLoader
        slug={"contact"}
        section={"project"}
        form={<ContactForm />}
      />
    </Suspense>
  );
}
