import Image from "next/image";
import Link from "next/link";
import { ImageOffIcon } from "lucide-react";
import type { Product } from "@/lib/products";

const gridClassName = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
const coverClassName = "relative aspect-[4/3] w-full overflow-hidden bg-muted";
const coverSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

type ProductGridProps = {
  products: Product[];
  coverUrls: Map<string, string>;
};

export const ProductGrid = ({ products, coverUrls }: ProductGridProps) => {
  return (
    <ul className={gridClassName}>
      {products.map((product) => {
        const coverUrl = coverUrls.get(product.id);
        return (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className={coverClassName}>
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt=""
                    fill
                    sizes={coverSizes}
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <ImageOffIcon
                    aria-hidden="true"
                    className="absolute inset-0 m-auto size-8 text-muted-foreground"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {product.type}
                </span>
                <span className="font-semibold break-words">{product.name}</span>
                <span className="line-clamp-2 break-words text-sm text-muted-foreground">
                  {product.description}
                </span>
                <span className="mt-auto pt-2 font-medium">{product.price}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export const ProductGridSkeleton = () => {
  return (
    <ul className={gridClassName} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-xl border">
          <div className={`${coverClassName} animate-pulse`} />
          <div className="flex flex-col gap-2 p-5">
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  );
};
