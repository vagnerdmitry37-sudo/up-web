import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProduct, getProductImages } from "@/lib/products";
import { getProductTypeLabels } from "@/lib/reference-data";
import { ProductGallery } from "./_components/ProductGallery";
import { galleryAspectRatio } from "./_components/galleryAspectRatio";

const layoutClassName = "grid gap-6 lg:grid-cols-12 lg:gap-8";
const galleryColumnClassName = "lg:col-span-7";
const summaryColumnClassName = "flex min-w-0 flex-col gap-4 lg:col-span-5";

export const generateMetadata = async (
  props: PageProps<"/products/[id]">,
): Promise<Metadata> => {
  const { id } = await props.params;
  const product = await getProduct(id);
  if (!product) return {};
  return { title: product.name, description: product.seoDescription };
};

const ProductPage = (props: PageProps<"/products/[id]">) => {
  return (
    <div className="flex flex-1 flex-col gap-6">
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

  const [images, productTypeLabels] = await Promise.all([
    getProductImages(product.id),
    getProductTypeLabels(),
  ]);

  return (
    <article className={layoutClassName}>
      <div className={summaryColumnClassName}>
        <Badge variant="secondary">{productTypeLabels.get(product.type)}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight break-words sm:text-3xl">
          {product.name}
        </h1>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-3xl font-semibold tracking-tight break-words">
                {product.price}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={galleryColumnClassName}>
        <ProductGallery images={images} productName={product.name} />
      </div>
    </article>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <div className={layoutClassName} aria-busy="true">
      <div className={summaryColumnClassName}>
        <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-44 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className={galleryColumnClassName}>
        <AspectRatio
          ratio={galleryAspectRatio}
          className="w-full animate-pulse rounded-xl bg-muted"
        />
      </div>
    </div>
  );
};

export default ProductPage;
