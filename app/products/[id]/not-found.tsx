import Link from "next/link";

const ProductNotFound = () => {
  return (
    <div className="flex flex-1 flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Product not found</h1>
      <p className="text-muted-foreground">
        This product doesn’t exist or is no longer available.
      </p>
      <Link href="/" className="flex min-h-11 items-center underline underline-offset-4">
        Back to all products
      </Link>
    </div>
  );
};

export default ProductNotFound;
