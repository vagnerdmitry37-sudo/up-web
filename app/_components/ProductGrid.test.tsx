import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ProductType } from "@/lib/api/models";
import type { Product } from "@/lib/products";
import { ProductGrid, ProductGridSkeleton } from "./ProductGrid";

const product = (id: string, name: string): Product => ({
  id,
  type: "GroupExcursion",
  name,
  seoDescription: "Three hours through the old town",
  shortDescription: "",
  price: 25,
});

const productTypeLabels = new Map<ProductType, string>([["GroupExcursion", "Group excursion"]]);

describe("ProductGrid", () => {
  afterEach(cleanup);

  it("shows the cover image in a card that links to the product", () => {
    render(
      <ProductGrid
        products={[product("p1", "Old Town Walk")]}
        coverUrls={new Map([["p1", "https://img.test/p1-cover.webp"]])}
        productTypeLabels={productTypeLabels}
      />,
    );

    const link = screen.getByRole("link", { name: /Old Town Walk/ });
    expect(link.getAttribute("href")).toBe("/products/p1");
    expect(link.querySelector("img")?.getAttribute("src")).toBe(
      "https://img.test/p1-cover.webp",
    );
  });

  it("shows the readable label of the product type", () => {
    render(
      <ProductGrid
        products={[product("p1", "Old Town Walk")]}
        coverUrls={new Map()}
        productTypeLabels={productTypeLabels}
      />,
    );

    expect(screen.getByText("Group excursion")).toBeTruthy();
  });

  it("shows a placeholder instead of an image for a product without images", () => {
    render(
      <ProductGrid
        products={[product("p2", "Airport transfer")]}
        coverUrls={new Map()}
        productTypeLabels={productTypeLabels}
      />,
    );

    const link = screen.getByRole("link", { name: /Airport transfer/ });
    expect(link.querySelector("img")).toBeNull();
    expect(link.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  });

  it("shows one card per product", () => {
    render(
      <ProductGrid
        products={[product("p1", "Old Town Walk"), product("p2", "Airport transfer")]}
        coverUrls={new Map([["p1", "https://img.test/p1-cover.webp"]])}
        productTypeLabels={productTypeLabels}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("ProductGridSkeleton", () => {
  afterEach(cleanup);

  it("shows six placeholder cards while products load", () => {
    render(<ProductGridSkeleton />);

    const list = screen.getByRole("list", { name: "Loading products" });
    expect(list.getAttribute("aria-busy")).toBe("true");
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });
});
