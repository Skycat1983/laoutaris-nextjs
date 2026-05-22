import ArticleViewSkeleton from "@/components/elements/skeletons/ArticleViewSkeleton";
import { ArticleLoader } from "@/components/loaders/viewLoaders/ArticleLoader";
import ContactForm from "@/components/modules/forms/user/ContactForm";
import { normalizeProductHandle } from "@/lib/data/schemas/enquirySchema";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface ContactPageProps {
  searchParams?: {
    product?: string | string[];
  };
}

const getProductHandleFromSearchParams = (
  product: string | string[] | undefined
) => normalizeProductHandle(Array.isArray(product) ? product[0] : product);

export default async function Contact({ searchParams }: ContactPageProps) {
  const productHandle = getProductHandleFromSearchParams(searchParams?.product);

  return (
    <Suspense fallback={<ArticleViewSkeleton />}>
      <ArticleLoader
        slug={"contact"}
        section={"project"}
        form={<ContactForm productHandle={productHandle} />}
      />
    </Suspense>
  );
}
