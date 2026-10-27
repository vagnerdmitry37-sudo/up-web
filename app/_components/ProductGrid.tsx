import Link from "next/link";
import type { Product } from "@/lib/products";

const gridClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

export const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <ul className={gridClassName}>
      {products.map((product) => (
        <li key={product.id}>
          <Link
            href={`/products/${product.id}`}
            className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 text-card-foreground transition-colors hover:bg-muted"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.type}
            </span>
            <span className="font-semibold">{product.name}</span>
            <span className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </span>
            <span className="mt-auto pt-2 font-medium">
              {product.price}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const ProductGridSkeleton = () => {
  return (
    <ul className={gridClassName} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
      ))}
    </ul>
  );
};
