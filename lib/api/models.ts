import type { components } from "./schema";

type Schema<Name extends keyof components["schemas"]> =
  components["schemas"][Name];

export type Product = Schema<"ProductResponse">;
export type ProductType = Schema<"ProductType">;
export type ProductsPageResponse = Schema<"ProductsPageResponse">;
