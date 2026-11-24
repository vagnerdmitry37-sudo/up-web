import { Suspense } from "react";
import { getProductCoverUrls, getProducts } from "@/lib/products";
import { getProductTypeLabels } from "@/lib/reference-data";
import { ProductGrid, ProductGridSkeleton } from "./_components/ProductGrid";

const Home = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="sr-only">Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductCatalog />
      </Suspense>
    </div>
  );
};

const ProductCatalog = async () => {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No products yet.
      </p>
    );
  }

  const [coverUrls, productTypeLabels] = await Promise.all([
    getProductCoverUrls(products.map((product) => product.id)),
    getProductTypeLabels(),
  ]);

  return (
    <ProductGrid
      products={products}
      coverUrls={coverUrls}
      productTypeLabels={productTypeLabels}
    />
  );
};

export default Home;
