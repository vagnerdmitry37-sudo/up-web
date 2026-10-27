import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

export const generateMetadata = async (
  props: PageProps<"/products/[id]">,
): Promise<Metadata> => {
  const { id } = await props.params;
  const product = await getProduct(id);
  if (!product) return {};
  return { title: product.name, description: product.description };
};

const ProductPage = (props: PageProps<"/products/[id]">) => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/"
        className="-my-2 flex min-h-11 items-center self-start text-sm text-muted-foreground hover:text-foreground"
      >
        ← All products
      </Link>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails params={props.params} />
      </Suspense>
    </div>
  );
};

const ProductDetails = async ({
  params,
}: Pick<PageProps<"/products/[id]">, "params">) => {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <article className="flex flex-col gap-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {product.type}
      </span>
      <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-3xl">{product.name}</h1>
      <p className="text-2xl font-medium">{product.price}</p>
      <p className="leading-7 break-words text-muted-foreground">{product.description}</p>
    </article>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-8 w-28 animate-pulse rounded bg-muted" />
      <div className="h-20 animate-pulse rounded bg-muted" />
    </div>
  );
};

export default ProductPage;
