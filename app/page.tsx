import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { ProductGrid, ProductGridSkeleton } from "./_components/ProductGrid";
import { SearchForm } from "./_components/SearchForm";

const Home = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <h1 className="sr-only">Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductCatalog />
      </Suspense>
      <SearchForm />
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

  return <ProductGrid products={products} />;
};

export default Home;
