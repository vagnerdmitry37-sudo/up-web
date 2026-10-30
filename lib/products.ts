import type {
  Product,
  ProductImage,
  ProductsPageResponse,
} from "@/lib/api/models";

export type { Product };

const MAX_ROWS_PER_REQUEST = 200;
const MAX_PRODUCTS_PER_IMAGE_REQUEST = 100;

const apiUrl = (path: string): URL => {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error("API_URL is not set. Add it to .env.local.");
  }
  return new URL(path, baseUrl);
};

export const getProducts = async (): Promise<Product[]> => {
  const products: Product[] = [];
  let totalRecords: number;

  do {
    const response = await fetch(
      apiUrl(`/api/products?first=${products.length}&rows=${MAX_ROWS_PER_REQUEST}`),
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const page: ProductsPageResponse = await response.json();
    products.push(...page.items);
    totalRecords = page.totalRecords;
    if (page.items.length === 0) break;
  } while (products.length < totalRecords);

  return products;
};

export const getProductCoverUrls = async (
  productIds: string[],
): Promise<Map<string, string>> => {
  const coverUrls = new Map<string, string>();

  for (let start = 0; start < productIds.length; start += MAX_PRODUCTS_PER_IMAGE_REQUEST) {
    const query = new URLSearchParams({ entityType: "Product" });
    for (const id of productIds.slice(start, start + MAX_PRODUCTS_PER_IMAGE_REQUEST)) {
      query.append("entityIds", id);
    }
    const response = await fetch(apiUrl(`/api/images?${query}`));
    if (!response.ok) {
      throw new Error(`Failed to fetch product images: ${response.status}`);
    }
    const images: ProductImage[] = await response.json();
    for (const image of images) {
      if (!coverUrls.has(image.entityId)) {
        coverUrls.set(image.entityId, image.url);
      }
    }
  }

  return coverUrls;
};

export const getProduct = async (
  id: string,
): Promise<Product | undefined> => {
  const response = await fetch(
    apiUrl(`/api/products/by-ids?ids=${encodeURIComponent(id)}`),
  );
  const isMissingOrInvalidId =
    response.status === 404 || response.status === 400;
  if (isMissingOrInvalidId) return undefined;
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }
  const [product]: Product[] = await response.json();
  return product;
};
