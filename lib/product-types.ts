import { apiUrl } from "@/lib/api/api-url";
import type { AttributeDefinition, ProductTypeDefinition } from "@/lib/api/models";

export type { AttributeDefinition, ProductTypeDefinition };

export const getProductTypes = async (): Promise<ProductTypeDefinition[]> => {
  const response = await fetch(apiUrl("/api/product-types"));
  if (!response.ok) {
    throw new Error(`Failed to fetch product types: ${response.status}`);
  }
  return response.json();
};
