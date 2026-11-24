import { cacheLife } from "next/cache";
import { apiUrl } from "@/lib/api/api-url";
import type { ProductType, ReferenceData } from "@/lib/api/models";

const getReferenceData = async (): Promise<ReferenceData> => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(apiUrl("/api/reference-data"));
  if (!response.ok) {
    throw new Error(`Failed to fetch reference data: ${response.status}`);
  }
  return response.json();
};

export const getProductTypeLabels = async (): Promise<Map<ProductType, string>> => {
  const { productTypes } = await getReferenceData();
  return new Map(productTypes.map(({ value, label }) => [value, label]));
};
